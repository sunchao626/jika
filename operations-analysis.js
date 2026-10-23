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
      payableCost = number(finance?.payableAmount) || number(dispatch?.thirdPartySettlementPriceSnapshot) || payableFees.reduce((sum, item) => sum + number(item.amount), 0) || number(waybill?.payable) || number(route?.thirdPartySettlementPrice) || number(route?.baseFreight);
      serviceCost = number(finance?.vehicleTotal) + number(finance?.laborTotal);
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
    const revenue = number(finance?.receivableAmount) || (hasValue(waybill?.receivable) && number(waybill.receivable) !== 0 ? number(waybill.receivable) : number(dispatch?.estimatedRevenue) || number(route?.estimatedRevenue));
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
      taxBasisConfirmed: waybill?.taxBasisConfirmed === true,
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

  const REPORT_DIMENSIONS = {
    customer: { id: "customerId", name: "customerName", label: "客户" },
    project: { id: "projectId", name: "projectName", label: "项目" },
    route: { id: "routeId", name: "routeName", label: "线路" },
  };
  const VEHICLE_COST_FIELDS = [
    ["fuel", "油费"], ["electricity", "电费"], ["gas", "汽费"], ["toll", "通行费"],
    ["parking", "停车费"], ["vehicleOther", "其他车辆费用"], ["taskShare", "任务分摊"],
    ["subsidy", "补贴"], ["insurance", "保险分摊"], ["labor", "工资"], ["service", "服务费"],
  ];
  const reportState = { operationsSort: { key: "profit", direction: "desc" }, operationsFilters: {}, vehicleSort: { key: "total", direction: "desc" }, vehicleFilters: {} };

  function reportFilteredRows(id, rows, filters) {
    const form = document.querySelector(`#${id}`);
    const values = form ? Object.fromEntries(new FormData(form).entries()) : {};
    return rows.filter((row) => {
      if (id === "operationsReportQuery" && values.startDate && (!row.date || row.date < values.startDate)) return false;
      if (id === "operationsReportQuery" && values.endDate && (!row.date || row.date > values.endDate)) return false;
      if (values.dataSource && row.source !== values.dataSource) return false;
      if (values.vehicleKeyword && !String(row.vehicleNo).toLowerCase().includes(values.vehicleKeyword.trim().toLowerCase())) return false;
      if (values.costState === "recorded" && !row.hasCost) return false;
      if (values.costState === "missing" && row.hasCost) return false;
      return Object.entries(filters).every(([key, term]) => !term || String(row[key] ?? "").toLowerCase().includes(term.toLowerCase()));
    });
  }

  function aggregateOperations(rows, dimension) {
    const config = REPORT_DIMENSIONS[dimension] || REPORT_DIMENSIONS.customer;
    const groups = new Map();
    rows.forEach((row) => {
      const key = row[config.id] || row[config.name] || `unknown-${row.waybillNo}`;
      const item = groups.get(key) || { key, name: row[config.name] || `未指定${config.label}`, count: 0, revenue: 0, knownRevenue: 0, cost: 0, profit: 0, known: 0, profitKnown: 0, taxPending: 0, missing: 0, source: row.source };
      item.count += 1;
      item.revenue += number(row.revenue);
      if (row.cost === null || row.cost === undefined) item.missing += 1;
      else {
        item.cost += number(row.cost);
        item.known += 1;
        if (row.taxBasisConfirmed) { item.profit += number(row.revenue) - number(row.cost); item.knownRevenue += number(row.revenue); item.profitKnown += 1; }
        else item.taxPending += 1;
      }
      groups.set(key, item);
    });
    return [...groups.values()];
  }

  function buildVehicleRows() {
    const records = typeof financeExpenseRecords !== "undefined" ? financeExpenseRecords : {};
    const rows = new Map();
    const dateForm = document.querySelector("#vehicleAnalysisQuery");
    const startDate = dateForm?.elements.startDate.value || "";
    const endDate = dateForm?.elements.endDate.value || "";
    const inPeriod = (date) => (!startDate || (date && date >= startDate)) && (!endDate || (date && date <= endDate));
    const assets = typeof vehicles !== "undefined" && Array.isArray(vehicles) ? vehicles : [];
    const selfVehiclePlates = new Set(assets.filter((vehicle) => ownershipFor({}, vehicle) === "自营" && vehicle.plateNo).map((vehicle) => vehicle.plateNo));
    assets.filter((vehicle) => selfVehiclePlates.has(vehicle.plateNo)).forEach((vehicle) => {
      rows.set(vehicle.plateNo, { vehicleNo: vehicle.plateNo, date: "", drivers: new Set(), waybillCount: 0, hasCost: false, total: 0, repair: 0, ...Object.fromEntries(VEHICLE_COST_FIELDS.map(([field]) => [field, 0])) });
    });
    const actualRows = enrich(allRows().filter((row) => row.source === "actual"));
    actualRows.forEach((waybill) => {
      if (waybill.ownership !== "自营") return;
      const date = waybill.completionDate || waybill.operationDate || "";
      if (!inPeriod(date)) return;
      const expenses = records[waybill.waybillNo] || {};
      const values = Object.fromEntries(VEHICLE_COST_FIELDS.map(([field]) => [field, number(expenses[field])]));
      const hasCost = Object.values(values).some((value) => value !== 0);
      const current = rows.get(waybill.vehicleNo) || { vehicleNo: waybill.vehicleNo || "待分配", date, drivers: new Set(), waybillCount: 0, hasCost: false, total: 0, repair: 0, ...Object.fromEntries(VEHICLE_COST_FIELDS.map(([field]) => [field, 0])) };
      if (waybill.driverName && waybill.driverName !== "待分配") current.drivers.add(waybill.driverName);
      current.waybillCount += 1;
      VEHICLE_COST_FIELDS.forEach(([field]) => { current[field] += values[field]; current.total += values[field]; });
      current.hasCost ||= hasCost;
      current.date = !current.date || date > current.date ? date : current.date;
      rows.set(current.vehicleNo, current);
    });
    const repairs = typeof vehicleRepairRecords !== "undefined" && Array.isArray(vehicleRepairRecords) ? vehicleRepairRecords : [];
    repairs.filter((record) => record.status === "已完成" && record.plateNo && selfVehiclePlates.has(record.plateNo)).forEach((record) => {
      const date = dateOnly(record.repairedAt || record.completedAt);
      if (!inPeriod(date)) return;
      const value = number(record.actualCost || (record.items || []).reduce((sum, item) => sum + number(item.subtotal), 0));
      const current = rows.get(record.plateNo) || { vehicleNo: record.plateNo, date, drivers: new Set(), waybillCount: 0, hasCost: false, total: 0, repair: 0, ...Object.fromEntries(VEHICLE_COST_FIELDS.map(([field]) => [field, 0])) };
      if (date && (!current.date || date > current.date)) current.date = date;
      current.repair += value;
      current.total += value;
      current.hasCost ||= value > 0;
      rows.set(current.vehicleNo, current);
    });
    return [...rows.values()].map((row) => ({ ...row, drivers: [...row.drivers].sort().join("、"), driverCount: row.drivers.size, vehicleNo: row.vehicleNo || "待分配" }));
  }

  function renderReportTable(headId, bodyId, columns, rows, sort, onSort, filters) {
    const head = document.querySelector(`#${headId}`);
    const body = document.querySelector(`#${bodyId}`);
    if (!head || !body) return;
    head.innerHTML = `<tr>${columns.map(([key, label]) => `<th><button type="button" data-sort="${key}">${escapeHtml(label)} ${sort.key === key ? (sort.direction === "asc" ? "↑" : "↓") : "↕"}</button></th>`).join("")}</tr><tr class="analysis-column-filters">${columns.map(([key, label]) => `<th><input type="search" data-column-filter="${key}" value="${escapeHtml(filters[key] || "")}" aria-label="筛选${escapeHtml(label)}" placeholder="筛选" /></th>`).join("")}</tr>`;
    const ordered = [...rows].sort((a, b) => {
      const left = a[sort.key] ?? "";
      const right = b[sort.key] ?? "";
      const result = typeof left === "number" && typeof right === "number" ? left - right : String(left).localeCompare(String(right), "zh-CN", { numeric: true });
      return result * (sort.direction === "asc" ? 1 : -1);
    });
    body.innerHTML = ordered.length ? ordered.map((row) => `<tr>${columns.map(([key, , format]) => `<td>${format ? format(row[key], row) : escapeHtml(row[key] ?? "—")}</td>`).join("")}</tr>`).join("") : `<tr><td colspan="${columns.length}" class="no-data-cell">暂无符合条件的数据</td></tr>`;
    head.querySelectorAll("[data-sort]").forEach((button) => button.addEventListener("click", () => onSort(button.dataset.sort)));
    head.querySelectorAll("[data-column-filter]").forEach((input) => input.addEventListener("input", () => {
      const key = input.dataset.columnFilter;
      const caret = input.selectionStart;
      filters[key] = input.value.trim().toLowerCase();
      onSort(sort.key, true);
      requestAnimationFrame(() => {
        const next = head.querySelector(`[data-column-filter="${key}"]`);
        next?.focus();
        next?.setSelectionRange(caret, caret);
      });
    }));
  }

  function renderBars(targetId, values, labelKey, amountKey, formatter = money) {
    const target = document.querySelector(`#${targetId}`);
    if (!target) return;
    const entries = [...values].sort((a, b) => number(b[amountKey]) - number(a[amountKey])).slice(0, 8);
    const max = Math.max(...entries.map((entry) => number(entry[amountKey])), 1);
    target.innerHTML = entries.length ? entries.map((entry) => `<div class="analysis-chart-row"><div><strong>${escapeHtml(entry[labelKey])}</strong><span>${formatter(entry[amountKey])}</span></div><i><b style="width:${Math.max(2, Math.round(number(entry[amountKey]) / max * 100))}%"></b></i></div>`).join("") : `<div class="analysis-empty">暂无数据</div>`;
  }

  function renderOperationsReport() {
    const form = document.querySelector("#operationsReportQuery");
    const dimension = form?.elements.dimension.value || "customer";
    const completed = enrich(allRows().filter((row) => row.status === "已完成"));
    const dataSource = form?.elements.dataSource.value || "";
    const base = completed.filter((row) => !dataSource || row.source === dataSource).map((row) => ({ ...row, date: row.completionDate || "" }));
    const rows = reportFilteredRows("operationsReportQuery", base, {});
    const groups = aggregateOperations(rows, dimension).filter((row) => Object.entries(reportState.operationsFilters).every(([key, term]) => !term || String(row[key] ?? "").toLowerCase().includes(term)));
    const shown = groups;
    const shownRevenue = shown.reduce((sum, row) => sum + row.revenue, 0);
    const shownKnownRevenue = shown.reduce((sum, row) => sum + row.knownRevenue, 0);
    const shownCost = shown.reduce((sum, row) => sum + row.cost, 0);
    const shownProfit = shown.reduce((sum, row) => sum + row.profit, 0);
    const shownMissing = shown.reduce((sum, row) => sum + row.missing, 0);
    const profitKnown = shown.reduce((sum, row) => sum + row.profitKnown, 0);
    const taxPending = shown.reduce((sum, row) => sum + row.taxPending, 0);
    renderKpis("operationsReportKpis", [["完成运单", shown.reduce((sum, row) => sum + row.count, 0), "按完成日期归属", "records"], ["收入金额", money(shownRevenue), "已完成运单收入", "total"], ["已确认成本", money(shownCost), `${shown.reduce((sum, row) => sum + row.known, 0)} 条成本完整`, "labor"], ["可确认利润", profitKnown ? money(shownProfit) : "待确认", `${profitKnown} 条税基明确`, shownProfit < 0 ? "pending" : "total"], ["利润率", profitKnown && shownKnownRevenue ? percentage(shownProfit / shownKnownRevenue) : "待确认", "税基明确范围加权", "completed"], ["口径待核", taxPending + shownMissing, `${shownMissing} 条缺成本 · ${taxPending} 条待税基确认`, "pending"]]);
    const name = REPORT_DIMENSIONS[dimension].name;
    const chartRows = [{ name: "收入", value: shownRevenue }, { name: "已确认成本", value: shownCost }, ...(profitKnown ? [{ name: "可确认利润", value: shownProfit }] : [])];
    renderBars("operationsReportChart", chartRows, "name", "value");
    renderBars("operationsReportRanking", shown.filter((row) => row.profitKnown), "name", "profit");
    document.querySelector("#operationsReportRankLabel").textContent = `按${REPORT_DIMENSIONS[dimension].label}利润`;
    document.querySelector("#operationsReportTableTitle").textContent = `${REPORT_DIMENSIONS[dimension].label}利润明细`;
    document.querySelector("#operationsReportSummary").textContent = `筛选结果 ${shown.reduce((sum, row) => sum + row.count, 0)} 条已完成运单 · ${shown.length} 个${REPORT_DIMENSIONS[dimension].label}`;
    document.querySelector("#operationsReportMissingBadge").textContent = `待核口径 ${shownMissing + taxPending} 条`;
    document.querySelector("#operationsReportSourceNote").textContent = `${rows.filter((row) => row.source === "actual").length} 条实际 · ${rows.filter((row) => row.source === "sample").length} 条样例`;
    const columns = [["name", REPORT_DIMENSIONS[dimension].label], ["count", "完成运单"], ["revenue", "收入", money], ["cost", "已确认成本", money], ["profit", "可确认利润", (value) => value == null ? "待确认" : money(value)], ["margin", "利润率", (value) => value == null ? "待确认" : percentage(value)], ["missing", "成本缺失"], ["taxPending", "税基待确认"]];
    renderReportTable("operationsReportHead", "operationsReportBody", columns, shown.map((row) => ({ ...row, profit: row.profitKnown ? row.profit : null, margin: row.profitKnown && row.knownRevenue ? row.profit / row.knownRevenue : null })), reportState.operationsSort, (key, unchanged) => { if (!unchanged) reportState.operationsSort = { key, direction: reportState.operationsSort.key === key && reportState.operationsSort.direction === "desc" ? "asc" : "desc" }; renderOperationsReport(); }, reportState.operationsFilters);
    window.lucide?.createIcons();
  }

  function renderVehicleAnalysis() {
    const rows = reportFilteredRows("vehicleAnalysisQuery", buildVehicleRows(), reportState.vehicleFilters);
    const total = rows.reduce((sum, row) => sum + row.total, 0);
    const repairs = rows.reduce((sum, row) => sum + row.repair, 0);
    const pending = rows.filter((row) => !row.hasCost).length;
    const vehiclesTotal = typeof vehicles !== "undefined" && Array.isArray(vehicles) ? vehicles.filter((vehicle) => ownershipFor({}, vehicle) === "自营").length : rows.length;
    renderKpis("vehicleAnalysisKpis", [["统计车辆", rows.length, `自营车辆档案 ${vehiclesTotal} 辆`, "records"], ["期间总成本", money(total), "运单归集 + 已完成维修", "total"], ["单车均值", money(rows.length ? total / rows.length : 0), "按筛选车辆计算", "completed"], ["维修保养", money(repairs), "不分摊至运营利润", "labor"], ["有费用记录", rows.length - pending, "仅按已录入金额", "records"], ["待补录", pending, "无费用记录车辆", "pending"]]);
    const costGroups = [...VEHICLE_COST_FIELDS.map(([key, name]) => ({ name, value: rows.reduce((sum, row) => sum + number(row[key]), 0) })), { name: "维修保养", value: repairs }];
    renderBars("vehicleAnalysisChart", costGroups, "name", "value");
    renderBars("vehicleAnalysisRanking", rows.map((row) => ({ ...row, name: row.vehicleNo, value: row.total })), "name", "value");
    document.querySelector("#vehicleAnalysisSummary").textContent = `筛选结果 ${rows.length} 辆 · 期间总成本 ${money(total)}`;
    document.querySelector("#vehicleAnalysisMissingBadge").textContent = `待补录 ${pending} 辆`;
    const columns = [["vehicleNo", "车牌号"], ["drivers", "关联司机"], ["waybillCount", "运单数"], ...VEHICLE_COST_FIELDS.map(([key, name]) => [key, name, money]), ["repair", "维修保养", money], ["total", "成本合计", money], ["hasCost", "费用状态", (value) => value ? "已记录" : "待补录"]];
    renderReportTable("vehicleAnalysisHead", "vehicleAnalysisBody", columns, rows, reportState.vehicleSort, (key, unchanged) => { if (!unchanged) reportState.vehicleSort = { key, direction: reportState.vehicleSort.key === key && reportState.vehicleSort.direction === "desc" ? "asc" : "desc" }; renderVehicleAnalysis(); }, reportState.vehicleFilters);
    window.lucide?.createIcons();
  }

  function exportReportTable(rows, columns, name) {
    const csv = [columns.map(([, label]) => label), ...rows.map((row) => columns.map(([key]) => row[key] ?? ""))].map((line) => line.map(csvValue).join(",")).join("\r\n");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob(["\ufeff", csv], { type: "text/csv;charset=utf-8" }));
    link.download = `${name}-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
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
    [["operationsReportQuery", renderOperationsReport], ["vehicleAnalysisQuery", renderVehicleAnalysis]].forEach(([id, render]) => {
      const form = document.querySelector(`#${id}`);
      if (!form) return;
      form.addEventListener("submit", (event) => { event.preventDefault(); render(); });
      form.addEventListener("change", render);
      form.querySelector(".analysis-reset")?.addEventListener("click", () => { form.reset(); render(); });
    });
    document.querySelector("#operationsReportExport")?.addEventListener("click", () => {
      const dimension = document.querySelector("#operationsReportQuery")?.elements.dimension.value || "customer";
      const config = REPORT_DIMENSIONS[dimension];
      const rows = enrich(allRows().filter((row) => row.status === "已完成")).map((row) => ({ ...row, date: row.completionDate || "" }));
      const grouped = aggregateOperations(reportFilteredRows("operationsReportQuery", rows, {}), dimension).filter((row) => Object.entries(reportState.operationsFilters).every(([key, term]) => !term || String(row[key] ?? "").toLowerCase().includes(term)));
      exportReportTable(grouped.map((row) => ({ ...row, profit: row.profitKnown ? row.profit : "税基待确认", margin: row.profitKnown && row.knownRevenue ? `${(row.profit / row.knownRevenue * 100).toFixed(1)}%` : "税基待确认", cost: row.missing ? `${row.cost}（${row.missing}条成本缺失）` : row.cost })), [["name", config.label], ["count", "完成运单"], ["revenue", "收入"], ["cost", "已确认成本"], ["profit", "可确认利润"], ["margin", "利润率"], ["missing", "成本缺失"], ["taxPending", "税基待确认"]], "运营分析报表");
    });
    document.querySelector("#vehicleAnalysisExport")?.addEventListener("click", () => {
      const rows = reportFilteredRows("vehicleAnalysisQuery", buildVehicleRows(), reportState.vehicleFilters);
      const columns = [["vehicleNo", "车牌号"], ["drivers", "关联司机"], ["waybillCount", "完成运单"], ...VEHICLE_COST_FIELDS.map(([key, name]) => [key, name]), ["repair", "维修保养"], ["total", "成本合计"], ["hasCost", "费用状态"]];
      exportReportTable(rows.map((row) => ({ ...row, hasCost: row.hasCost ? "已记录" : "待补录" })), columns, "自营车辆分析表");
    });
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
      if (meta?.view === "operationsReport") renderOperationsReport();
      if (meta?.view === "selfOwnedVehicleAnalysis") renderVehicleAnalysis();
    }
  }

  const api = { SAMPLE_ROWS, allRows, enrich, filteredRows, aggregateOperations, renderOverview, renderProfit, renderOperationsReport, renderVehicleAnalysis, buildVehicleRows, exportRows };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (typeof window !== "undefined") {
    window.OperationsAnalysis = api;
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true }); else init();
  }
})();
