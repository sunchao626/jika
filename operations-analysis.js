(() => {
  const SAMPLE_ROWS = [
    { id: "SAMPLE-01", operationDate: "2026-09-16", completionDate: "2026-09-16", waybillNo: "样例-WB-001", customerName: "华贸", projectName: "比亚迪", routeName: "北仑港至江北仓", ownership: "自营", vehicleNo: "样例车-001", driverName: "样例司机甲", status: "已完成", revenue: 2860, cost: 1940, vehicleCost: 1320, laborCost: 620, costState: "complete", source: "sample" },
    { id: "SAMPLE-02", operationDate: "2026-09-16", completionDate: "2026-09-16", waybillNo: "样例-WB-002", customerName: "陆港多联", projectName: "提箱装货", routeName: "洋山港至昆山保税区", ownership: "三方", vehicleNo: "样例车-002", driverName: "样例司机乙", status: "已完成", revenue: 3520, cost: 3040, payableCost: 2960, serviceCost: 80, costState: "complete", source: "sample" },
    { id: "SAMPLE-03", operationDate: "2026-09-17", completionDate: "2026-09-17", waybillNo: "样例-WB-003", customerName: "中铁联集项目", projectName: "X387", routeName: "萧山仓至梅山码头", ownership: "自营", vehicleNo: "样例车-003", driverName: "样例司机丙", status: "已完成", revenue: 2550, cost: 680, vehicleCost: 500, laborCost: 180, costState: "partial", source: "sample" },
    { id: "SAMPLE-04", operationDate: "2026-09-18", completionDate: "", waybillNo: "样例-WB-004", customerName: "中铁联集项目", projectName: "X8588", routeName: "苏州园区至外高桥", ownership: "三方", vehicleNo: "样例车-004", driverName: "样例司机丁", status: "运输中", revenue: 3050, cost: 2600, payableCost: 2600, serviceCost: 0, costState: "complete", source: "sample" },
    { id: "SAMPLE-05", operationDate: "2026-09-18", completionDate: "2026-09-18", waybillNo: "样例-WB-005", customerName: "华贸", projectName: "比亚迪", routeName: "北仑港至江北仓", ownership: "自营", vehicleNo: "样例车-005", driverName: "样例司机戊", status: "已完成", revenue: 900, cost: 1100, vehicleCost: 760, laborCost: 340, costState: "complete", source: "sample" },
    { id: "SAMPLE-06", operationDate: "2026-09-19", completionDate: "2026-09-19", waybillNo: "样例-WB-006", customerName: "陆港多联", projectName: "提箱装货", routeName: "洋山港至昆山保税区", ownership: "自营", vehicleNo: "样例车-006", driverName: "样例司机己", status: "已完成", revenue: 0, cost: null, vehicleCost: 0, laborCost: 0, costState: "pending", source: "sample" },
    { id: "SAMPLE-07", operationDate: "2026-09-20", completionDate: "", waybillNo: "样例-WB-007", customerName: "华贸", projectName: "比亚迪", routeName: "北仑港至江北仓", ownership: "自营", vehicleNo: "待分配", driverName: "待分配", status: "已派单", revenue: 2860, cost: null, vehicleCost: 0, laborCost: 0, costState: "pending", source: "sample" },
    { id: "SAMPLE-08", operationDate: "2026-09-21", completionDate: "2026-09-21", waybillNo: "样例-WB-008", customerName: "中铁联集项目", projectName: "X387", routeName: "萧山仓至梅山码头", ownership: "自营", vehicleNo: "样例车-008", driverName: "样例司机庚", status: "已完成", revenue: 4800, cost: 2750, vehicleCost: 1800, laborCost: 950, costState: "complete", source: "sample" },
  ];

  const moneyFormatter = new Intl.NumberFormat("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const escapeHtml = (value) => (typeof dashboardEscape === "function" ? dashboardEscape(value) : String(value ?? "").replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character])));
  const number = (value) => { const parsed = Number(value); return Number.isFinite(parsed) ? parsed : 0; };
  const hasValue = (value) => value !== undefined && value !== null && String(value).trim() !== "";
  const money = (value) => `¥${moneyFormatter.format(number(value))}`;
  const percentage = (value) => Number.isFinite(value) ? `${(value * 100).toFixed(1)}%` : "—";
  const dateOnly = (value) => String(value || "").slice(0, 10);

  function latestDispatchMap() {
    const map = new Map();
    const records = typeof dispatches !== "undefined" && Array.isArray(dispatches) ? dispatches : [];
    records.forEach((dispatch) => {
      if (!dispatch?.waybillNo) return;
      const current = map.get(dispatch.waybillNo);
      const candidateTime = String(dispatch.dispatchTime || dispatch.orderDate || "");
      const currentTime = String(current?.dispatchTime || current?.orderDate || "");
      if (!current || candidateTime >= currentTime) map.set(dispatch.waybillNo, dispatch);
    });
    return map;
  }

  function completionDate(dispatch) {
    const timeline = Array.isArray(dispatch?.timeline) ? dispatch.timeline : [];
    const completed = [...timeline].reverse().find((entry) => ["已送达", "已完成", "完成", "完成落重", "完成落空"].includes(String(entry?.node || "")));
    return dateOnly(completed?.time);
  }

  function routeFor(waybill, dispatch) {
    const routes = typeof fixedRoutes !== "undefined" && Array.isArray(fixedRoutes) ? fixedRoutes : [];
    return routes.find((route) => route.id === (dispatch?.routeId || waybill?.routeId)) || {};
  }

  function ownershipFor(dispatch, vehicle) {
    const value = dispatch?.capacityOwnershipSnapshot || vehicle?.capacityOwnership || vehicle?.ownership || "待确定";
    if (typeof CapacityOwnership !== "undefined" && CapacityOwnership.normalizeType) return CapacityOwnership.normalizeType(value);
    return value === "三方" || value === "外协" ? "三方" : value === "自营" ? "自营" : "待确定";
  }

  function feeRows(waybill, target) {
    const rows = Array.isArray(waybill?.payableFees) ? waybill.payableFees : [];
    return rows.filter((item) => !target || item.target === target);
  }

  function actualRow(waybill, dispatch) {
    const route = routeFor(waybill, dispatch);
    const vehiclesList = typeof vehicles !== "undefined" && Array.isArray(vehicles) ? vehicles : [];
    const vehicle = vehiclesList.find((item) => item.plateNo === dispatch?.vehicleId || item.plateNo === waybill?.plateNo);
    const ownership = ownershipFor(dispatch, vehicle);
    const completed = completionDate(dispatch);
    let vehicleCost = 0;
    let laborCost = 0;
    let payableCost = 0;
    let serviceCost = 0;
    let costState = "pending";
    let costSource = "待补录";
    const finance = typeof getFinanceRow === "function" ? getFinanceRow(waybill, dispatch) : null;
    const expenseRecords = typeof financeExpenseRecords !== "undefined" ? financeExpenseRecords : {};
    const expenseRecord = expenseRecords?.[waybill?.waybillNo];
    if (ownership === "三方") {
      const supplierFees = feeRows(waybill, "供应商");
      const payableFees = supplierFees.length ? supplierFees : feeRows(waybill);
      payableCost = number(dispatch?.thirdPartySettlementPriceSnapshot) || payableFees.reduce((sum, item) => sum + number(item.amount), 0) || number(waybill?.payable) || number(route?.thirdPartySettlementPrice) || number(route?.baseFreight);
      serviceCost = payableFees.filter((item) => /服务费/.test(String(item.kind || item.type || ""))).reduce((sum, item) => sum + number(item.amount), 0);
      const hasPayableSource = payableFees.length > 0 || number(dispatch?.thirdPartySettlementPriceSnapshot) > 0 || number(route?.thirdPartySettlementPrice) > 0 || hasValue(waybill?.payable);
      costState = hasPayableSource && payableCost > 0 ? "complete" : "pending";
      costSource = hasPayableSource ? "应付费用 / 三方结算价" : "待补录";
    } else {
      vehicleCost = number(finance?.vehicleTotal);
      laborCost = number(finance?.laborTotal);
      const hasExpenseSource = Boolean(expenseRecord) || vehicleCost > 0 || laborCost > 0;
      costState = hasExpenseSource ? "complete" : "pending";
      costSource = hasExpenseSource ? "费用补录" : "待补录";
    }
    const revenue = hasValue(waybill?.receivable) && number(waybill.receivable) !== 0 ? number(waybill.receivable) : number(dispatch?.estimatedRevenue) || number(route?.estimatedRevenue);
    const cost = ownership === "三方" ? payableCost + serviceCost : vehicleCost + laborCost;
    const status = String(dispatch?.status || "待派单");
    return {
      id: waybill?.waybillNo || dispatch?.id,
      operationDate: dateOnly(waybill?.planExecutionDate || waybill?.orderDate || dispatch?.orderDate || dispatch?.dispatchTime),
      completionDate: completed,
      waybillNo: waybill?.waybillNo || "-",
      customerId: waybill?.customerId || dispatch?.customerId || route?.customerId || "",
      customerName: waybill?.customerName || dispatch?.customerName || route?.customerName || "未指定客户",
      projectId: waybill?.projectId || dispatch?.projectId || route?.projectId || "",
      projectName: waybill?.projectName || dispatch?.projectName || route?.projectName || "未分配项目",
      routeId: dispatch?.routeId || waybill?.routeId || route?.id || "",
      routeName: dispatch?.routeName || route?.routeName || "未指定线路",
      ownership,
      vehicleNo: dispatch?.vehicleId || waybill?.plateNo || "待分配",
      driverName: dispatch?.driverName || waybill?.driverName || "待分配",
      status,
      revenue,
      cost: costState === "pending" ? null : cost,
      vehicleCost,
      laborCost,
      payableCost,
      serviceCost,
      costState,
      costSource,
      source: "actual",
      waybill,
      dispatch,
    };
  }

  function allRows() {
    const rows = [];
    const waybillList = typeof waybills !== "undefined" && Array.isArray(waybills) ? waybills : [];
    const dispatchMap = latestDispatchMap();
    waybillList.forEach((waybill) => {
      const dispatch = dispatchMap.get(waybill.waybillNo);
      if (dispatch) rows.push(actualRow(waybill, dispatch));
    });
    return [...rows, ...SAMPLE_ROWS.map((row) => ({ ...row, customerId: `sample-${row.customerName}`, projectId: `sample-${row.projectName}`, routeId: `sample-${row.routeName}`, costSource: row.costState === "pending" ? "待补录" : "样例成本" }))];
  }

  function profitState(row) {
    if (row.status !== "已完成") return "unfinished";
    if (!number(row.revenue)) return "pending";
    if (row.costState === "pending") return "pending";
    if (row.costState === "partial") return "partial";
    if (row.cost !== null && row.cost !== undefined && row.revenue - row.cost < 0) return "negative";
    return "complete";
  }

  function enrich(rows) {
    return rows.map((row) => ({ ...row, profit: row.cost === null || row.cost === undefined || !number(row.revenue) ? null : row.revenue - row.cost, margin: row.cost === null || row.cost === undefined || !number(row.revenue) ? null : (row.revenue - row.cost) / row.revenue, state: profitState(row) }));
  }

  function readForm(id) {
    const form = document.querySelector(`#${id}`);
    if (!form) return {};
    const data = new FormData(form);
    return Object.fromEntries(data.entries());
  }

  function matches(row, filters, mode) {
    const date = mode === "profit" ? row.completionDate : row.operationDate;
    const status = filters.status || "";
    if (status ? row.status !== status : row.status === "取消") return false;
    if (mode === "profit" && filters.keyword && !String(row.waybillNo || "").toLowerCase().includes(String(filters.keyword).trim().toLowerCase())) return false;
    if (filters.startDate && date && date < filters.startDate) return false;
    if (filters.endDate && date && date > filters.endDate) return false;
    if (mode === "profit" && filters.startDate && !date && filters.profitState !== "unfinished") return false;
    if (filters.customerId && row.customerId !== filters.customerId) return false;
    if (filters.projectId && row.projectId !== filters.projectId) return false;
    if (filters.routeId && row.routeId !== filters.routeId) return false;
    if (filters.capacityOwnership && row.ownership !== filters.capacityOwnership) return false;
    if (filters.dataSource && row.source !== filters.dataSource) return false;
    if (mode === "profit" && filters.profitState && row.state !== filters.profitState) return false;
    return true;
  }

  function filteredRows(mode) {
    const filters = readForm(mode === "overview" ? "operationsOverviewQuery" : "waybillProfitQuery");
    return { filters, rows: enrich(allRows()).filter((row) => matches(row, filters, mode)) };
  }

  function setOptions(formId, rows) {
    const form = document.querySelector(`#${formId}`);
    if (!form) return;
    const mappings = [["customerId", "customerName", "全部客户"], ["projectId", "projectName", "全部项目"], ["routeId", "routeName", "全部线路"]];
    mappings.forEach(([field, labelField, placeholder]) => {
      const select = form.elements[field];
      if (!select) return;
      const current = select.value;
      const values = [...new Map(rows.filter((row) => row[field] && row[labelField]).map((row) => [row[field], row[labelField]])).entries()];
      select.innerHTML = `<option value="">${placeholder}</option>${values.map(([value, label]) => `<option value="${escapeHtml(value)}">${escapeHtml(label)}</option>`).join("")}`;
      select.value = values.some(([value]) => value === current) ? current : "";
    });
  }

  function renderKpis(target, cards) {
    const element = document.querySelector(`#${target}`);
    if (!element) return;
    element.innerHTML = cards.map(([label, value, note, className]) => `<div class="finance-summary-card analysis-kpi-card ${className || ""}"><span>${label}</span><strong>${value}</strong><small>${note}</small></div>`).join("");
  }

  function renderOverview() {
    const all = enrich(allRows());
    setOptions("operationsOverviewQuery", all);
    const { rows } = filteredRows("overview");
    const knownCostRows = rows.filter((row) => row.cost !== null && row.cost !== undefined);
    const completed = rows.filter((row) => row.status === "已完成").length;
    const revenue = rows.reduce((sum, row) => sum + number(row.revenue), 0);
    const cost = knownCostRows.reduce((sum, row) => sum + number(row.cost), 0);
    const profit = knownCostRows.filter((row) => number(row.revenue) > 0).reduce((sum, row) => sum + number(row.profit), 0);
    const pending = rows.filter((row) => row.state === "pending" || row.state === "partial").length;
    renderKpis("operationsOverviewKpis", [
      ["运单数", rows.length, `已排除取消 ${all.filter((row) => row.status === "取消").length} 条`, "records"],
      ["集装箱数", rows.reduce((sum, row) => sum + number(row.waybill?.boxQuantity || (Array.isArray(row.waybill?.containers) ? row.waybill.containers.length : row.waybill ? 1 : 0)), 0), "按运单关联箱量", "completed"],
      ["完成率", percentage(rows.length ? completed / rows.length : NaN), `${completed} 条已完成`, "completed"],
      ["预计收入", money(revenue), "预计口径", "total"],
      ["已录入成本", money(cost), `${knownCostRows.length} 条有成本记录`, "labor"],
      ["预估利润", money(profit), "收入减已知成本", "total"],
      ["待补录运单", pending, "部分补录或未补录", "pending"],
      ["样例数据", rows.filter((row) => row.source === "sample").length, "可用来源筛选排除", "records"],
    ]);
    document.querySelector("#operationsOverviewQuerySummary").textContent = `筛选结果 ${rows.length} 条 · 预计收入 ${money(revenue)}`;
    document.querySelector("#operationsOverviewSourceNote").textContent = `${rows.filter((row) => row.source === "actual").length} 条实际 · ${rows.filter((row) => row.source === "sample").length} 条样例`;
    renderCustomerRanking(rows);
    renderOwnership(rows);
    renderTrend(rows);
    renderExceptions(rows);
    window.lucide?.createIcons();
  }

  function renderCustomerRanking(rows) {
    const grouped = new Map();
    rows.forEach((row) => {
      const key = row.customerName || "未指定客户";
      const current = grouped.get(key) || { name: key, count: 0, revenue: 0, cost: 0, profit: 0, pending: 0, customerId: row.customerId };
      current.count += 1;
      current.revenue += number(row.revenue);
      if (row.cost !== null && row.cost !== undefined) { current.cost += number(row.cost); current.profit += number(row.profit); }
      if (["pending", "partial"].includes(row.state)) current.pending += 1;
      grouped.set(key, current);
    });
    const body = document.querySelector("#operationsCustomerRanking");
    if (!body) return;
    const entries = [...grouped.values()].sort((a, b) => b.revenue - a.revenue);
    body.innerHTML = entries.length ? entries.map((item) => `<tr><td><button class="analysis-link" data-analysis-customer="${escapeHtml(item.customerId)}" type="button">${escapeHtml(item.name)}</button></td><td>${item.count}</td><td class="finance-money-cell">${money(item.revenue)}</td><td class="finance-money-cell">${money(item.cost)}</td><td class="finance-money-cell ${item.profit < 0 ? "analysis-negative" : ""}">${money(item.profit)}</td><td>${item.pending ? `<span class="analysis-status pending">${item.pending}</span>` : "—"}</td></tr>`).join("") : `<tr><td colspan="6" class="no-data-cell">暂无符合条件的数据</td></tr>`;
  }

  function renderOwnership(rows) {
    const target = document.querySelector("#operationsOwnershipComparison");
    if (!target) return;
    const groups = ["自营", "三方"].map((ownership) => {
      const items = rows.filter((row) => row.ownership === ownership);
      const revenue = items.reduce((sum, row) => sum + number(row.revenue), 0);
      const known = items.filter((row) => row.cost !== null && row.cost !== undefined);
      const cost = known.reduce((sum, row) => sum + number(row.cost), 0);
      const profit = known.reduce((sum, row) => sum + number(row.profit), 0);
      return { ownership, count: items.length, revenue, cost, profit, pending: items.filter((row) => ["pending", "partial"].includes(row.state)).length };
    });
    target.innerHTML = groups.map((item) => `<article class="analysis-ownership-card ${item.ownership === "三方" ? "third" : "self"}"><header><strong>${item.ownership}</strong><span>${item.count} 条运单</span></header><dl><div><dt>预计收入</dt><dd>${money(item.revenue)}</dd></div><div><dt>预估成本</dt><dd>${money(item.cost)}</dd></div><div><dt>预估利润</dt><dd class="${item.profit < 0 ? "analysis-negative" : ""}">${money(item.profit)}</dd></div><div><dt>待补录</dt><dd>${item.pending}</dd></div></dl></article>`).join("");
  }

  function renderTrend(rows) {
    const target = document.querySelector("#operationsTrendList");
    if (!target) return;
    const grouped = new Map();
    rows.forEach((row) => {
      const date = row.operationDate || "未归属日期";
      const current = grouped.get(date) || { date, count: 0, revenue: 0, cost: 0, profit: 0 };
      current.count += 1;
      current.revenue += number(row.revenue);
      if (row.cost !== null && row.cost !== undefined) { current.cost += number(row.cost); current.profit += number(row.profit); }
      grouped.set(date, current);
    });
    const entries = [...grouped.values()].sort((a, b) => a.date.localeCompare(b.date));
    const max = Math.max(...entries.map((item) => item.revenue), 1);
    target.innerHTML = entries.length ? entries.slice(-10).map((item) => `<div class="analysis-trend-row"><div><strong>${escapeHtml(item.date)}</strong><span>${item.count} 条运单 · ${money(item.profit)} 预估利润</span></div><i><b style="width:${Math.round(item.revenue / max * 100)}%"></b></i><strong>${money(item.revenue)}</strong></div>`).join("") : `<div class="analysis-empty">暂无趋势数据</div>`;
  }

  function renderExceptions(rows) {
    const target = document.querySelector("#operationsExceptionList");
    if (!target) return;
    const entries = rows.filter((row) => ["pending", "partial", "negative", "unfinished"].includes(row.state)).sort((a, b) => ({ pending: 0, partial: 1, negative: 2, unfinished: 3 }[a.state] || 9) - ({ pending: 0, partial: 1, negative: 2, unfinished: 3 }[b.state] || 9)).slice(0, 8);
    document.querySelector("#operationsExceptionCount").textContent = `${entries.length} 条`;
    target.innerHTML = entries.length ? entries.map((row) => `<button class="analysis-exception-row" data-analysis-waybill="${escapeHtml(row.waybillNo)}" type="button"><span class="analysis-exception-dot ${row.state}"></span><span><strong>${escapeHtml(row.waybillNo)}</strong><small>${escapeHtml(row.customerName)} · ${escapeHtml(row.costSource)}</small></span><em>${row.state === "negative" ? "负利润" : row.state === "unfinished" ? "未完成" : row.state === "partial" ? "部分补录" : "待补录"}</em></button>`).join("") : `<div class="analysis-empty">当前筛选下没有异常记录</div>`;
  }

  function renderProfit() {
    const all = enrich(allRows());
    setOptions("waybillProfitQuery", all);
    const { rows } = filteredRows("profit");
    const known = rows.filter((row) => row.cost !== null && row.cost !== undefined);
    const revenue = rows.reduce((sum, row) => sum + number(row.revenue), 0);
    const cost = known.reduce((sum, row) => sum + number(row.cost), 0);
    const profit = known.filter((row) => number(row.revenue) > 0).reduce((sum, row) => sum + number(row.profit), 0);
    const pending = rows.filter((row) => ["pending", "partial"].includes(row.state)).length;
    renderKpis("waybillProfitKpis", [
      ["运单数", rows.length, `${rows.filter((row) => row.status === "已完成").length} 条已完成`, "records"],
      ["预计收入", money(revenue), "预计口径", "total"],
      ["预估总成本", money(cost), `${known.length} 条有成本记录`, "labor"],
      ["预估利润", money(profit), "已知成本范围", "total"],
      ["预估利润率", percentage(revenue ? profit / revenue : NaN), "收入加权", "completed"],
      ["待补录", pending, "部分或未补录", "pending"],
      ["负利润", rows.filter((row) => row.state === "negative").length, "需复核", "rejected"],
      ["样例数据", rows.filter((row) => row.source === "sample").length, "可筛选排除", "records"],
    ]);
    document.querySelector("#waybillProfitQuerySummary").textContent = `筛选结果 ${rows.length} 条 · 预估利润 ${money(profit)}`;
    document.querySelector("#waybillProfitSourceNote").textContent = `${rows.filter((row) => row.source === "actual").length} 条实际 · ${rows.filter((row) => row.source === "sample").length} 条样例`;
    document.querySelector("#waybillProfitPendingBadge").textContent = `待补录 ${pending}`;
    document.querySelector("#waybillProfitResultText").textContent = `共 ${rows.length} 条明细，按完成日期归属；未完成运单显示为未归属日期`;
    const body = document.querySelector("#waybillProfitBody");
    if (!body) return;
    body.innerHTML = rows.length ? rows.map((row) => `<tr><td>${escapeHtml(row.completionDate || "未完成")}</td><td><strong class="primary-text">${escapeHtml(row.waybillNo)}</strong>${row.source === "sample" ? `<small class="analysis-sample-tag">样例</small>` : ""}</td><td><strong>${escapeHtml(row.customerName)}</strong><small>${escapeHtml(row.projectName)}</small></td><td>${escapeHtml(row.routeName)}</td><td><span class="analysis-ownership ${row.ownership === "三方" ? "third" : row.ownership === "自营" ? "self" : "pending"}">${escapeHtml(row.ownership)}</span></td><td>${escapeHtml(row.vehicleNo)}<small>${escapeHtml(row.driverName)}</small></td><td><span class="dispatch-status ${row.status === "已完成" ? "completed" : row.status === "取消" ? "cancelled" : "moving"}">${escapeHtml(row.status)}</span></td><td class="finance-money-cell">${money(row.revenue)}</td><td class="finance-money-cell">${row.cost === null || row.cost === undefined ? `<span class="analysis-missing">待补录</span>` : money(row.cost)}</td><td class="finance-money-cell ${row.profit < 0 ? "analysis-negative" : ""}">${row.profit === null || row.profit === undefined ? `<span class="analysis-missing">待补录</span>` : money(row.profit)}</td><td>${row.margin === null || row.margin === undefined ? "—" : percentage(row.margin)}</td><td><span class="analysis-status ${row.state}">${row.state === "complete" ? "已完整" : row.state === "partial" ? "部分补录" : row.state === "negative" ? "负利润" : row.state === "unfinished" ? "未完成" : "待补录"}</span></td></tr>`).join("") : `<tr><td colspan="12" class="no-data-cell">暂无符合条件的利润明细</td></tr>`;
    window.lucide?.createIcons();
  }

  function csvValue(value) { return `"${String(value ?? "").replace(/^([=+\-@])/, "'$1").replaceAll('"', '""')}"`; }
  function exportRows(rows, name) {
    const headers = ["运营日期", "完成日期", "运单号", "客户", "项目", "线路", "运力归属", "车号", "司机", "运输状态", "预计收入", "预估成本", "预估利润", "预估利润率", "数据状态", "数据来源"];
    const data = rows.map((row) => [row.operationDate, row.completionDate || "未完成", row.waybillNo, row.customerName, row.projectName, row.routeName, row.ownership, row.vehicleNo, row.driverName, row.status, row.revenue, row.cost ?? "待补录", row.profit ?? "待补录", row.margin == null ? "" : `${(row.margin * 100).toFixed(1)}%`, row.state, row.source === "sample" ? "样例数据" : "实际数据"]);
    const csv = [headers, ...data].map((row) => row.map(csvValue).join(",")).join("\r\n");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob(["\ufeff", csv], { type: "text/csv;charset=utf-8" }));
    link.download = `${name}-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  function openProfitWith(field, value) {
    if (typeof switchPage === "function") switchPage("waybill-profit");
    const form = document.querySelector("#waybillProfitQuery");
    if (!form || !form.elements[field]) return;
    form.elements[field].value = value;
    renderProfit();
  }

  function init() {
    ["operationsOverviewQuery", "waybillProfitQuery"].forEach((id) => {
      const form = document.querySelector(`#${id}`);
      if (!form || form.dataset.analysisReady) return;
      form.dataset.analysisReady = "true";
      form.addEventListener("submit", (event) => { event.preventDefault(); id === "operationsOverviewQuery" ? renderOverview() : renderProfit(); });
      form.addEventListener("change", () => { id === "operationsOverviewQuery" ? renderOverview() : renderProfit(); });
      form.querySelector(".analysis-reset")?.addEventListener("click", () => { form.reset(); id === "operationsOverviewQuery" ? renderOverview() : renderProfit(); });
    });
    document.querySelector("#operationsOverviewExport")?.addEventListener("click", () => exportRows(filteredRows("overview").rows, "运营经营概览"));
    document.querySelector("#waybillProfitExport")?.addEventListener("click", () => exportRows(filteredRows("profit").rows, "基础运单利润"));
    document.querySelector("#operationsOverviewPage")?.addEventListener("click", (event) => {
      const customer = event.target.closest("[data-analysis-customer]");
      const openProfit = event.target.closest("[data-analysis-open-profit]");
      const waybill = event.target.closest("[data-analysis-waybill]");
      if (customer) openProfitWith("customerId", customer.dataset.analysisCustomer);
      if (openProfit) openProfitWith("customerId", "");
      if (waybill) openProfitWith("keyword", waybill.dataset.analysisWaybill);
    });
    document.querySelector("#waybillProfitPage")?.addEventListener("click", (event) => {
      const row = event.target.closest("[data-analysis-waybill]");
      if (row) openProfitWith("keyword", row.dataset.analysisWaybill);
    });
    if (typeof activePageName !== "undefined") {
      const meta = typeof pageMeta !== "undefined" ? pageMeta[activePageName] : null;
      if (meta?.view === "operationsOverview") renderOverview();
      if (meta?.view === "waybillProfit") renderProfit();
    }
  }

  const api = { SAMPLE_ROWS, allRows, enrich, filteredRows, renderOverview, renderProfit, exportRows };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (typeof window !== "undefined") {
    window.OperationsAnalysis = api;
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true }); else init();
  }
})();
