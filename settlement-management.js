(function initSettlementManagement() {
  const KEYS = {
    orders: "container-logistics-settlement-orders-v1",
    payroll: "container-logistics-payroll-orders-v1",
    abnormal: "container-logistics-abnormal-fees-v1",
    energy: "container-logistics-energy-ledger-v1",
  };
  const selectedSourceIds = new Set();
  const selectedPayrollIds = new Set();
  const rules = window.SettlementRules;
  let activeModule = "overview";
  let activeTab = "pending";
  let activeOrderFilter = "all";
  let activeTransactionTaskFilter = "all";
  let activeOrderId = "";
  let pendingSettlementGroups = [];
  let pendingPayrollGroups = [];

  function load(key) {
    try {
      const value = JSON.parse(localStorage.getItem(key) || "[]");
      return Array.isArray(value) ? value : [];
    } catch (error) {
      console.warn("结算数据读取失败。", error);
      return [];
    }
  }
  function normalizeOrder(order) {
    const generated = order.documentStatus === "draft" || !order.documentStatus;
    return {
      ...order,
      documentStatus: generated ? "generated" : order.documentStatus,
      reconciliationStatus: order.reconciliationStatus || (generated ? "generated" : "confirmed"),
      lockedAt: order.lockedAt || order.createdAt || "",
      invoiceRecords: Array.isArray(order.invoiceRecords) ? order.invoiceRecords : [],
      paymentRecords: Array.isArray(order.paymentRecords) ? order.paymentRecords : [],
    };
  }
  let orders = load(KEYS.orders).map(normalizeOrder);
  function normalizePayrollOrder(order) {
    return { ...order, payrollMonth: order.payrollMonth || String(order.lines?.[0]?.payrollMonth || order.lines?.[0]?.completedAt || order.settlementDate || "").slice(0, 7) };
  }
  let payrollOrders = load(KEYS.payroll).map(normalizePayrollOrder);
  let abnormalFees = load(KEYS.abnormal);
  let energyLedger = load(KEYS.energy);
  function saveRecords() {
    localStorage.setItem(KEYS.orders, JSON.stringify(orders));
    localStorage.setItem(KEYS.payroll, JSON.stringify(payrollOrders));
    localStorage.setItem(KEYS.abnormal, JSON.stringify(abnormalFees));
    localStorage.setItem(KEYS.energy, JSON.stringify(energyLedger));
  }

  const number = (value) => rules?.number(value) ?? (Number.isFinite(Number(value)) ? Number(value) : 0);
  const money = (value) => `¥${number(value).toFixed(2)}`;
  const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
  const today = () => {
    const date = new Date();
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  };
  const nowText = () => window.DispatchStore?.nowText?.() || new Date().toISOString().replace("T", " ").slice(0, 16);
  const notify = (message) => typeof window.showApplicationAlert === "function" ? window.showApplicationAlert(message) : window.alert(message);

  function latestCompletedDispatch(waybillNo) {
    return dispatches
      .filter((dispatch) => dispatch.waybillNo === waybillNo && dispatch.status === "已完成")
      .sort((left, right) => String(right.dispatchTime || "").localeCompare(String(left.dispatchTime || "")))[0] || null;
  }
  const normalizeSearch = (value) => String(value || "").trim().toLowerCase();
  function containerNumberAt(index, waybill, dispatch) {
    const field = `boxNo${index + 1}`;
    return [dispatch?.[field], waybill?.[field], dispatch?.containers?.[index]?.boxNo, waybill?.containers?.[index]?.boxNo]
      .find((value) => value && value !== "-") || "-";
  }
  function containerNumbers(record) {
    if (!record) return [];
    return [
      record.boxNo1,
      record.boxNo2,
      ...(Array.isArray(record.containers) ? record.containers.map((item) => item?.boxNo) : []),
    ].filter((value) => value && value !== "-");
  }
  function matchesContainerNumber(query, ...records) {
    const keyword = normalizeSearch(query);
    if (!keyword) return true;
    const sources = [];
    records.flat().filter(Boolean).forEach((record) => {
      sources.push(record);
      if (!record.waybillNo || containerNumbers(record).length) return;
      sources.push(waybills.find((item) => item.waybillNo === record.waybillNo));
      sources.push(latestCompletedDispatch(record.waybillNo));
    });
    return sources.flatMap(containerNumbers).some((value) => normalizeSearch(value).includes(keyword));
  }
  function completedTime(dispatch) {
    const timeline = Array.isArray(dispatch?.timeline) ? dispatch.timeline : [];
    return [...timeline].reverse().find((item) => ["已送达", "已完成", "完成"].includes(item.node))?.time || dispatch?.completedAt || dispatch?.dispatchTime || "-";
  }
  function completedTripRows() {
    return waybills.map((waybill) => {
      const dispatch = latestCompletedDispatch(waybill.waybillNo);
      return dispatch ? { waybillNo: waybill.waybillNo, vehicleNo: dispatch.vehicleId || waybill.plateNo || "", completedAt: completedTime(dispatch) } : null;
    }).filter(Boolean);
  }
  function summedFee(waybill, key, target) {
    return (Array.isArray(waybill?.[key]) ? waybill[key] : []).filter((fee) => !target || fee.target === target).reduce((sum, fee) => sum + number(fee.amount), 0);
  }
  function settledSourceIds(type) {
    return new Set(orders.filter((order) => order.type === type).flatMap((order) => order.sourceIds || []));
  }

  function settlementContext(waybill, dispatch) {
    const route = fixedRoutes.find((item) => item.id === (dispatch.routeId || waybill.routeId)) || {};
    const vehicle = vehicles.find((item) => item.plateNo === dispatch.vehicleId);
    const ownership = dispatch.carrierTypeSnapshot || vehicle?.capacityOwnership || (vehicle?.ownership === "外协" ? "三方" : "自营");
    return { route, vehicle, ownership };
  }
  function commonSettlementRow(waybill, dispatch, context) {
    return {
      waybillNo: waybill.waybillNo,
      boxNo1: containerNumberAt(0, waybill, dispatch),
      boxNo2: containerNumberAt(1, waybill, dispatch),
      customerId: waybill.customerId || dispatch.customerId || "",
      customerName: waybill.customerName || dispatch.customerName || "-",
      projectId: waybill.projectId || dispatch.projectId || "",
      projectName: waybill.projectName || dispatch.projectName || "未分配项目",
      routeId: dispatch.routeId || waybill.routeId || "",
      routeName: dispatch.routeName || context.route.routeName || "未指定线路",
      taskType: waybill.taskType || dispatch.taskType || "-",
      vehicleNo: dispatch.vehicleId || "-",
      driverId: dispatch.driverId || "",
      driverName: dispatch.driverName || "-",
      orderDate: waybill.orderDate || dispatch.orderDate || "",
      completedAt: completedTime(dispatch),
      capacityOwnership: dispatch.capacityOwnershipSnapshot || context.ownership || "待确定",
      capacityOwnershipTooltip: dispatch.capacityOwnershipTooltipSnapshot || "",
    };
  }
  function baseSettlementRow(waybill, direction, used) {
    const dispatch = latestCompletedDispatch(waybill.waybillNo);
    if (!dispatch) return null;
    const context = settlementContext(waybill, dispatch);
    const sourceId = `${direction}:${waybill.waybillNo}`;
    if (used.has(sourceId) || (direction === "payable" && context.ownership !== "三方")) return null;
    const feeAmount = direction === "receivable" ? summedFee(waybill, "receivableFees") || number(waybill.receivable || dispatch.estimatedRevenue) : summedFee(waybill, "payableFees", "供应商") || summedFee(waybill, "payableFees");
    const amount = rules.roundMoney(direction === "payable" ? number(dispatch.thirdPartySettlementPriceSnapshot) || feeAmount || number(waybill.payable || context.route.baseFreight) : feeAmount);
    if (!rules.isPositiveMoney(amount)) return null;
    const counterparty = direction === "receivable" ? waybill.customerName || dispatch.customerName || context.route.customerName || "未设置客户" : dispatch.carrierUnitSnapshot || dispatch.thirdPartyCarrierSnapshot || context.route.thirdPartyCarrier || context.vehicle?.fleetName || context.vehicle?.fleet || waybill.carrier || "未设置承运商";
    return {
      ...commonSettlementRow(waybill, dispatch, context), sourceId, sourceType: "base", direction, counterparty, amount,
      settlementCycle: dispatch.thirdPartySettlementCycleSnapshot || context.route.thirdPartySettlementCycle || "-",
      feeLabel: direction === "receivable" ? "基础应收" : "三方运费",
    };
  }
  function abnormalSettlementRows(direction, used) {
    return abnormalFees.flatMap((fee) => {
      const entry = (fee.entries || []).find((item) => item.direction === direction);
      if (!entry || used.has(entry.sourceId)) return [];
      const waybill = waybills.find((item) => item.waybillNo === fee.waybillNo);
      const dispatch = latestCompletedDispatch(fee.waybillNo);
      if (!waybill || !dispatch) return [];
      const context = settlementContext(waybill, dispatch);
      if (direction === "payable" && context.ownership !== "三方") return [];
      const counterparty = direction === "receivable" ? waybill.customerName || dispatch.customerName || "未设置客户" : dispatch.carrierUnitSnapshot || dispatch.thirdPartyCarrierSnapshot || context.route.thirdPartyCarrier || context.vehicle?.fleetName || "未设置承运商";
      return [{ ...commonSettlementRow(waybill, dispatch, context), sourceId: entry.sourceId, sourceType: "abnormal", abnormalFeeId: fee.id, direction, counterparty, amount: entry.amount, settlementCycle: "后续费用调整", feeLabel: fee.feeType }];
    });
  }
  function completedSettlementRows(direction) {
    const used = settledSourceIds(direction);
    return [...waybills.map((waybill) => baseSettlementRow(waybill, direction, used)).filter(Boolean), ...abnormalSettlementRows(direction, used)];
  }
  function payrollSourceRows() {
    const used = new Set(payrollOrders.flatMap((order) => order.sourceIds || []));
    return waybills.map((waybill) => {
      const dispatch = latestCompletedDispatch(waybill.waybillNo);
      if (!dispatch?.driverId || !dispatch.driverName || dispatch.driverName === "待分配") return null;
      const driver = drivers.find((item) => item.id === dispatch.driverId);
      if (driver && driver.driverType !== "自有司机") return null;
      const route = fixedRoutes.find((item) => item.id === (dispatch.routeId || waybill.routeId)) || {};
      const completedAt = completedTime(dispatch);
      const payrollMonth = String(completedAt).slice(0, 7);
      if (!rules.isClosedPayrollMonth(payrollMonth, today())) return null;
      const sourceId = `payroll:${waybill.waybillNo}`;
      if (used.has(sourceId) || payrollOrders.some((order) => order.driverId === dispatch.driverId && order.payrollMonth === payrollMonth)) return null;
      return { sourceId, waybillNo: waybill.waybillNo, boxNo1: containerNumberAt(0, waybill, dispatch), boxNo2: containerNumberAt(1, waybill, dispatch), driverId: dispatch.driverId, driverName: dispatch.driverName, projectName: waybill.projectName || dispatch.projectName || "未分配项目", routeName: dispatch.routeName || route.routeName || "未指定线路", completedAt, payrollMonth, amount: number(dispatch.commission) || number(route.commissionValue), vehicleNo: dispatch.vehicleId || "-", bankAccount: driver?.bankCard || "", bankName: driver?.bankName || "" };
    }).filter(Boolean);
  }
  function filteredPendingRows() {
    const data = new FormData(document.querySelector("#settlementPendingQuery"));
    const direction = String(data.get("direction") || "receivable");
    const startDate = String(data.get("startDate") || "");
    const endDate = String(data.get("endDate") || "");
    const customerId = String(data.get("customerId") || "");
    const projectId = String(data.get("projectId") || "");
    const routeId = String(data.get("routeId") || "");
    const taskType = String(data.get("taskType") || "");
    const containerNo = String(data.get("containerNo") || "");
    const keyword = String(data.get("keyword") || "").trim().toLowerCase();
    const ownership = String(data.get("capacityOwnership") || "");
    const vehicleNo = String(data.get("vehicleNo") || "");
    const driverId = String(data.get("driverId") || "");
    return completedSettlementRows(direction).filter((row) => (!startDate || row.orderDate >= startDate) && (!endDate || row.orderDate <= endDate) && (!customerId || row.customerId === customerId) && (!projectId || row.projectId === projectId) && (!routeId || row.routeId === routeId) && (!taskType || row.taskType === taskType) && (!ownership || row.capacityOwnership === ownership) && (!vehicleNo || row.vehicleNo === vehicleNo) && (!driverId || row.driverId === driverId) && matchesContainerNumber(containerNo, row) && (!keyword || [row.waybillNo, row.counterparty].join(" ").toLowerCase().includes(keyword)));
  }
  function orderTotals(order) { return rules.orderTotals(order); }
  function filteredOrderRows() {
    const containerNo = document.querySelector("#settlementOrderContainerSearch")?.value || "";
    return orders.filter((order) => {
      const typeMatches = activeOrderFilter === "needs-confirmation"
        ? order.type === MODULE_UI[activeModule]?.direction && order.documentStatus === "generated"
        : ["receivable", "payable"].includes(activeOrderFilter)
        ? order.type === activeOrderFilter
        : activeOrderFilter === "receivable-unpaid"
          ? order.type === "receivable" && !(order.paymentRecords || []).length
          : activeOrderFilter === "payable-unpaid"
            ? order.type === "payable" && !(order.paymentRecords || []).length
            : true;
      return typeMatches && matchesContainerNumber(containerNo, ...(order.lines || []));
    });
  }
  function transactionRows() {
    const moduleOrders = ["receivable", "payable"].includes(activeModule) ? orders.filter((order) => order.type === activeModule) : orders;
    return moduleOrders.flatMap((order) => [
      ...(order.invoiceRecords || []).map((record) => ({ ...record, order, category: order.type === "receivable" ? "销项发票" : "进项发票" })),
      ...(order.paymentRecords || []).map((record) => ({ ...record, order, category: order.type === "receivable" ? "收款" : "付款" })),
    ]).sort((left, right) => String(right.recordDate || "").localeCompare(String(left.recordDate || "")));
  }
  function filteredPayrollSourceRows() {
    const containerNo = document.querySelector("#payrollPendingContainerSearch")?.value || "";
    return payrollSourceRows().filter((row) => matchesContainerNumber(containerNo, row));
  }
  function filteredPayrollOrderRows() {
    const containerNo = document.querySelector("#payrollOrderContainerSearch")?.value || "";
    return payrollOrders.filter((order) => matchesContainerNumber(containerNo, ...(order.lines || [])));
  }
  function filteredAbnormalFees() {
    const containerNo = document.querySelector("#abnormalFeeContainerSearch")?.value || "";
    return abnormalFees.filter((fee) => matchesContainerNumber(containerNo, fee));
  }
  function filteredTransactionRows() {
    const containerNo = document.querySelector("#settlementTransactionContainerSearch")?.value || "";
    return transactionRows().filter((record) => matchesContainerNumber(containerNo, ...(record.order.lines || [])));
  }

  function renderSummary() {
    const metrics = rules.dashboardMetrics({
      pendingReceivables: completedSettlementRows("receivable"),
      pendingPayables: completedSettlementRows("payable"),
      pendingPayroll: payrollSourceRows(),
      orders,
      abnormalFees,
      energyLedger,
    });
    const kpis = [
      ["待结算应收", metrics.pendingReceivables, "settlement-receivable", "pending", `${metrics.pendingReceivables.count} 条费用来源`],
      ["待结算三方应付", metrics.pendingPayables, "settlement-payable", "pending", `${metrics.pendingPayables.count} 条费用来源`],
      ["待核算司机工资", metrics.pendingPayroll, "settlement-payroll", "completed", `${metrics.pendingPayroll.count} 条已关闭月份运单`],
    ];
    document.querySelector("#settlementSummary").innerHTML = `${kpis.map(([label, metric, route, tone, note]) => `<button class="finance-summary-card settlement-summary-card ${tone}" data-settlement-dashboard-route="${route}" type="button"><span>${label}</span><i data-lucide="arrow-up-right" aria-hidden="true"></i><strong>${money(metric.amount)}</strong><small>${note}</small></button>`).join("")}<div class="finance-summary-card settlement-summary-card settlement-confirmation-kpi"><span>待财务确认</span><strong>${metrics.awaitingConfirmation.count} 张</strong><small>${money(metrics.awaitingConfirmation.amount)} · 生成即锁定</small></div>`;

    const todos = [
      ["应收单待财务确认", metrics.receivableConfirmation, "settlement-receivable", "orders", "needs-confirmation", "待确认"],
      ["三方应付待财务确认", metrics.payableConfirmation, "settlement-payable", "orders", "needs-confirmation", "待确认"],
      ["客户待开票", metrics.receivableInvoices, "settlement-transactions", "", "receivable-invoice", "登记"],
      ["三方待收票", metrics.payableInvoices, "settlement-transactions", "", "payable-invoice", "登记"],
      ["客户待收款", metrics.receivablePayments, "settlement-transactions", "", "receivable-payment", "登记"],
      ["三方待付款", metrics.payablePayments, "settlement-transactions", "", "payable-payment", "登记"],
      ["异常费用待结算", metrics.abnormalEntries, "settlement-abnormal", "", "", "处理"],
      ["能源待月结分摊", metrics.pendingEnergy, "settlement-energy", "", "", "查看"],
    ];
    document.querySelector("#settlementDashboardTodos").innerHTML = todos.map(([label, metric, route, tab, filter, action]) => `<button class="settlement-todo-link" data-settlement-dashboard-route="${route}" ${tab ? `data-settlement-dashboard-tab="${tab}"` : ""} ${filter ? `data-settlement-dashboard-filter="${filter}"` : ""} type="button"><span class="settlement-todo-copy"><strong>${label}</strong><small>${money(metric.amount)}</small></span><span class="settlement-todo-count">${metric.count}</span><span class="settlement-todo-action">${action}<i data-lucide="chevron-right" aria-hidden="true"></i></span></button>`).join("");

    const modules = [
      ["应收账款管理", "receipt", "settlement-receivable", "查看已完成运单的客户应收费用", metrics.pendingReceivables.count, "待结算"],
      ["三方应付结算", "hand-coins", "settlement-payable", "查看三方运力的应付结算费用", metrics.pendingPayables.count, "待结算"],
      ["自营结算", "badge-dollar-sign", "settlement-payroll", "核算已关闭月份的自营司机工资", metrics.pendingPayroll.count, "待核算"],
      ["异常费用管理", "file-warning", "settlement-abnormal", "补录并跟踪异常应收、应付费用", metrics.abnormalEntries.count, "待结算"],
      ["发票与收付款", "files", "settlement-transactions", "登记已确认结算单的发票和收付款", metrics.receivableInvoices.count + metrics.payableInvoices.count + metrics.receivablePayments.count + metrics.payablePayments.count, "待登记"],
      ["预充值管理", "fuel", "settlement-energy", "管理能源预充值、消费及月度分摊", metrics.pendingEnergy.count, "待月结分摊"],
      ["运输管理台账", "list-checks", "finance-reports", "查看和导出运输费用台账", null, "全量台账"],
      ["司机费用上报", "clipboard-check", "driver-expenses", "审核司机上报的运输费用及凭证", null, "费用审核"],
    ];
    document.querySelector("#settlementQuickLinks").innerHTML = modules.map(([label, icon, route, description, count, note]) => `<button class="settlement-module-link" data-settlement-dashboard-route="${route}" type="button"><i data-lucide="${icon}" aria-hidden="true"></i><span class="settlement-module-copy"><strong>${label}</strong><small>${description}</small><em>${count === null ? note : `${note} ${count} 项`}</em></span><i class="settlement-module-arrow" data-lucide="arrow-up-right" aria-hidden="true"></i></button>`).join("");
  }
  function populateSettlementFilters() {
    const rows = [...completedSettlementRows("receivable"), ...completedSettlementRows("payable")];
    const fill = (selector, placeholder, pairs) => {
      const select = document.querySelector(selector);
      if (!select) return;
      const current = select.value;
      const values = [...new Map(pairs.filter(([value]) => value)).entries()];
      select.innerHTML = `<option value="">${placeholder}</option>` + values.map(([value, label]) => `<option value="${escapeHtml(value)}">${escapeHtml(label)}</option>`).join("");
      if (values.some(([value]) => value === current)) select.value = current;
    };
    fill("#settlementCustomerFilter", "全部客户", rows.map((row) => [row.customerId, row.customerName]));
    fill("#settlementProjectFilter", "全部项目", rows.map((row) => [row.projectId, row.projectName]));
    fill("#settlementRouteFilter", "全部线路", rows.map((row) => [row.routeId, row.routeName]));
    fill("#settlementTaskTypeFilter", "全部任务类型", rows.map((row) => [row.taskType, row.taskType]));
    fill("#settlementVehicleFilter", "全部车辆", rows.map((row) => [row.vehicleNo, row.vehicleNo]));
    fill("#settlementDriverFilter", "全部司机", rows.map((row) => [row.driverId, row.driverName]));
  }
  function renderPending() {
    const rows = filteredPendingRows();
    const valid = new Set(rows.map((row) => row.sourceId));
    [...selectedSourceIds].forEach((id) => { if (!valid.has(id)) selectedSourceIds.delete(id); });
    document.querySelector("#settlementPendingBody").innerHTML = rows.length ? rows.map((row) => `<tr><td class="check-col"><input class="settlement-source-check" type="checkbox" value="${escapeHtml(row.sourceId)}" ${selectedSourceIds.has(row.sourceId) ? "checked" : ""} /></td><td><strong class="primary-text">${escapeHtml(row.waybillNo)}</strong><small>${escapeHtml(row.feeLabel)}</small></td><td>${escapeHtml(row.completedAt)}</td><td><strong>${escapeHtml(row.customerName)}</strong><small>${escapeHtml(row.projectName)}</small></td><td>${escapeHtml(row.routeName)}</td><td><strong>${escapeHtml(row.counterparty)}</strong><small>${row.direction === "receivable" ? "客户应收" : "三方应付"} · ${escapeHtml(row.settlementCycle)}</small></td><td>${window.CapacityOwnership?.badgeMarkup?.(row.capacityOwnership, row.capacityOwnershipTooltip) || ""}${escapeHtml(row.vehicleNo)}<small>${escapeHtml(row.driverName)}</small></td><td class="finance-money-cell"><strong>${money(row.amount)}</strong><small>未结算</small></td></tr>`).join("") : '<tr><td class="empty-table-cell" colspan="8">当前筛选范围内没有可结算的已完成运单</td></tr>';
    const count = [...selectedSourceIds].filter((id) => valid.has(id)).length;
    document.querySelector("#settlementPendingSummary").textContent = `筛选结果 ${rows.length} 条，已选择 ${count} 条`;
    document.querySelector("#settlementPendingBadge").textContent = `${rows.length} 条待结算`;
    document.querySelector("#createSettlementOrder").disabled = !count;
    const all = document.querySelector("#settlementPendingCheckAll");
    all.checked = rows.length > 0 && count === rows.length;
    all.indeterminate = count > 0 && count < rows.length;
    all.disabled = !rows.length;
    refreshExportButtons();
  }
  function renderOrders() {
    const rows = filteredOrderRows();
    document.querySelector("#settlementOrderBody").innerHTML = rows.length ? rows.map((order) => {
      const totals = orderTotals(order);
      const settled = totals.paymentOutstanding <= 0.005;
      return `<tr><td><strong class="primary-text">${escapeHtml(order.id)}</strong><small>${escapeHtml(order.statementNo)}</small></td><td><span class="settlement-direction ${order.type}">${order.type === "receivable" ? "应收" : "应付"}</span></td><td><strong>${escapeHtml(order.counterparty)}</strong></td><td>${escapeHtml((order.projectNames || []).join(" / ") || "-")}</td><td>${(order.lines || []).length}</td><td class="finance-money-cell"><strong>${money(order.totalAmount)}</strong><small>${settled ? "已全额结清" : `未结 ${money(order.totalAmount)}`}</small></td><td><span class="settlement-status ${order.reconciliationStatus}">${order.reconciliationStatus === "confirmed" ? "已确认" : "已生成锁定"}</span></td><td>${totals.invoiceStatus}</td><td>${totals.paymentStatus}</td><td class="fixed-action-column"><div class="vehicle-action-group"><button class="link-btn" data-settlement-view="${escapeHtml(order.id)}" type="button">查看</button>${order.documentStatus === "generated" ? `<button class="link-btn success-link" data-settlement-confirm="${escapeHtml(order.id)}" type="button">财务确认</button>` : ""}</div></td></tr>`;
    }).join("") : '<tr><td class="empty-table-cell" colspan="10">当前筛选下没有结算单</td></tr>';
    const labels = { all: "全部结算单", receivable: "客户应收", payable: "三方应付", "receivable-unpaid": "应收未回款", "payable-unpaid": "三方待付款", "needs-confirmation": "待财务确认" };
    document.querySelector("#settlementOrderResultText").textContent = `${labels[activeOrderFilter]} · 生成即锁定，确认后全额登记`;
    document.querySelector("#settlementOrderBadge").textContent = `${rows.length} / ${orders.length} 张`;
    document.querySelectorAll("[data-settlement-order-filter]").forEach((button) => { const active = button.dataset.settlementOrderFilter === activeOrderFilter; button.classList.toggle("active", active); button.setAttribute("aria-pressed", String(active)); });
    refreshExportButtons();
  }
  function renderPayroll() {
    const rows = filteredPayrollSourceRows();
    const visiblePayrollOrders = filteredPayrollOrderRows();
    const valid = new Set(rows.map((row) => row.sourceId));
    [...selectedPayrollIds].forEach((id) => { if (!valid.has(id)) selectedPayrollIds.delete(id); });
    document.querySelector("#payrollPendingBody").innerHTML = rows.length ? rows.map((row) => `<tr><td class="check-col"><input class="payroll-source-check" type="checkbox" value="${escapeHtml(row.sourceId)}" ${selectedPayrollIds.has(row.sourceId) ? "checked" : ""} /></td><td><strong class="primary-text">${escapeHtml(row.waybillNo)}</strong></td><td>${escapeHtml(row.driverName)}</td><td>${escapeHtml(row.projectName)}<small>${escapeHtml(row.routeName)}</small></td><td>${escapeHtml(row.completedAt)}</td><td class="finance-money-cell">${money(row.amount)}</td></tr>`).join("") : '<tr><td class="empty-table-cell" colspan="6">暂无可核算工资的已完成运单；当月运单需在次月生成工资单</td></tr>';
    document.querySelector("#payrollOrderBody").innerHTML = visiblePayrollOrders.length ? visiblePayrollOrders.map((order) => `<tr><td><strong class="primary-text">${escapeHtml(order.id)}</strong><small>${escapeHtml(order.payrollMonth || "-")}</small></td><td>${escapeHtml(order.driverName)}</td><td>${(order.lines || []).length}</td><td class="finance-money-cell">${money(order.grossAmount ?? order.totalAmount)}</td><td class="finance-money-cell">${money(order.deductionAmount)}</td><td class="finance-money-cell">${money(order.netAmount ?? order.totalAmount)}</td><td class="finance-money-cell">${money(order.companyCost ?? order.totalAmount)}</td><td><span class="settlement-status ${order.status}">${({ generated: "已生成锁定", draft: "已生成锁定", confirmed: "已确认", paid: "已发放" })[order.status] || order.status}</span></td><td>${escapeHtml(order.createdAt)}</td><td class="fixed-action-column"><div class="vehicle-action-group">${["generated", "draft"].includes(order.status) ? `<button class="link-btn success-link" data-payroll-action="confirm" data-payroll-id="${escapeHtml(order.id)}" type="button">财务确认</button>` : order.status === "confirmed" ? `<button class="link-btn success-link" data-payroll-action="pay" data-payroll-id="${escapeHtml(order.id)}" type="button">登记发放</button>` : '<span class="finance-empty-value">已完成</span>'}</div></td></tr>`).join("") : '<tr><td class="empty-table-cell" colspan="10">当前集装箱号下没有工资单</td></tr>';
    document.querySelector("#payrollPendingBadge").textContent = `${rows.length} 条待核算`;
    document.querySelector("#payrollSelectionSummary").textContent = `已选择 ${selectedPayrollIds.size} 条`;
    document.querySelector("#createPayrollOrders").disabled = !selectedPayrollIds.size;
    const all = document.querySelector("#payrollCheckAll");
    all.checked = rows.length > 0 && selectedPayrollIds.size === rows.length;
    all.indeterminate = selectedPayrollIds.size > 0 && selectedPayrollIds.size < rows.length;
    refreshExportButtons();
  }
  function renderTransactions() {
    renderPendingTransactions();
    const rows = filteredTransactionRows();
    document.querySelector("#settlementTransactionBody").innerHTML = rows.length ? rows.map((record) => `<tr><td>${escapeHtml(record.recordDate)}</td><td><strong class="primary-text">${escapeHtml(record.order.id)}</strong></td><td>${escapeHtml(record.order.counterparty)}</td><td>${escapeHtml(record.category)}</td><td>${escapeHtml(record.referenceNo || "-")}<small>${escapeHtml(record.attachmentName || "无附件")}${record.attachmentId ? ` · <button class="link-btn" data-attachment-open="${escapeHtml(record.attachmentId)}" type="button">查看附件</button>` : ""}</small></td><td class="finance-money-cell">${money(record.amount)}</td><td>${escapeHtml(record.createdBy || "系统管理员")}</td></tr>`).join("") : '<tr><td class="empty-table-cell" colspan="7">暂无发票或收付款登记</td></tr>';
    refreshExportButtons();
  }
  function pendingTransactionOrders() {
    const containerNo = document.querySelector("#settlementPendingTransactionContainerSearch")?.value || "";
    return orders.filter((order) => {
      if (order.documentStatus !== "confirmed" || !matchesContainerNumber(containerNo, ...(order.lines || []))) return false;
      const missingInvoice = !(order.invoiceRecords || []).length;
      const missingPayment = !(order.paymentRecords || []).length;
      if (activeTransactionTaskFilter === "receivable-invoice") return order.type === "receivable" && missingInvoice;
      if (activeTransactionTaskFilter === "payable-invoice") return order.type === "payable" && missingInvoice;
      if (activeTransactionTaskFilter === "receivable-payment") return order.type === "receivable" && missingPayment;
      if (activeTransactionTaskFilter === "payable-payment") return order.type === "payable" && missingPayment;
      return missingInvoice || missingPayment;
    });
  }
  function renderPendingTransactions() {
    const rows = pendingTransactionOrders();
    document.querySelector("#settlementPendingTransactionsBody").innerHTML = rows.length ? rows.map((order) => {
      const totals = orderTotals(order);
      return `<tr><td><strong class="primary-text">${escapeHtml(order.id)}</strong><small>${escapeHtml(order.statementNo)}</small></td><td><span class="settlement-direction ${order.type}">${order.type === "receivable" ? "应收" : "三方应付"}</span></td><td>${escapeHtml(order.counterparty)}</td><td class="finance-money-cell">${money(order.totalAmount)}</td><td>${escapeHtml(totals.invoiceStatus)}</td><td>${escapeHtml(totals.paymentStatus)}</td><td class="fixed-action-column"><button class="link-btn success-link" data-settlement-pending-transaction="${escapeHtml(order.id)}" type="button">登记票款</button></td></tr>`;
    }).join("") : '<tr><td class="empty-table-cell" colspan="7">当前筛选下没有可登记的票款；新生成的结算单需先完成财务确认</td></tr>';
    document.querySelector("#settlementPendingTransactionsBadge").textContent = `${rows.length} 张待处理`;
  }
  function renderAbnormalFees() {
    const select = document.querySelector("#abnormalWaybillSelect");
    const current = select.value;
    const completed = waybills.filter((waybill) => latestCompletedDispatch(waybill.waybillNo));
    select.innerHTML = '<option value="">请选择已完成运单</option>' + completed.map((waybill) => `<option value="${escapeHtml(waybill.waybillNo)}">${escapeHtml(waybill.waybillNo)} · ${escapeHtml(waybill.customerName || waybill.projectName || "未命名")}</option>`).join("");
    if (completed.some((item) => item.waybillNo === current)) select.value = current;
    const rows = filteredAbnormalFees();
    document.querySelector("#abnormalFeeBody").innerHTML = rows.length ? rows.map((fee) => {
      const statuses = (fee.entries || []).map((entry) => `${entry.direction === "receivable" ? "应收" : "应付"}${entry.settlementOrderId ? "已结算" : "待结算"}`);
      if (fee.selfCostPostedAt) statuses.push("自营成本已入账");
      const completed = (fee.entries || []).length > 0 && (fee.entries || []).every((entry) => entry.settlementOrderId);
      return `<tr><td><strong class="primary-text">${escapeHtml(fee.id)}</strong></td><td>${escapeHtml(fee.waybillNo)}</td><td>${escapeHtml(fee.feeType)}</td><td class="finance-money-cell">${money(fee.receivableAmount)}</td><td class="finance-money-cell">${money(fee.payableAmount)}</td><td><span class="settlement-status ${completed ? "confirmed" : "generated"}">${escapeHtml(statuses.join(" / ") || "待结算")}</span></td><td>${escapeHtml(fee.createdAt)}</td><td>${escapeHtml(fee.remark || "-")}</td></tr>`;
    }).join("") : '<tr><td class="empty-table-cell" colspan="8">暂无异常费用补录记录</td></tr>';
    document.querySelector("#abnormalFeeBadge").textContent = `${rows.length} / ${abnormalFees.length} 条`;
  }
  function energyLabel(type) { return ({ fuel: "燃油", gas: "LNG", electricity: "充电" })[type] || type; }
  function energyBalances() {
    const map = new Map();
    energyLedger.forEach((item) => {
      const key = `${item.energyType}:${item.partnerName}`;
      const current = map.get(key) || { energyType: item.energyType, partnerName: item.partnerName, recharge: 0, consumption: 0 };
      current[item.businessType] += number(item.amount);
      map.set(key, current);
    });
    return [...map.values()].map((item) => ({ ...item, balance: item.recharge - item.consumption }));
  }
  function renderEnergy() {
    const balances = energyBalances();
    document.querySelector("#energyAccountSummary").innerHTML = balances.length ? balances.map((item) => `<div class="finance-summary-card"><span>${escapeHtml(item.partnerName)} · ${energyLabel(item.energyType)}</span><strong>${money(item.balance)}</strong><small>累计充值 ${money(item.recharge)} · 消费 ${money(item.consumption)}</small></div>`).join("") : '<div class="energy-empty-summary">暂无预充值账户，请先登记固定合作单位充值。</div>';
    const select = document.querySelector("#energyVehicleSelect");
    const current = select.value;
    const vehicles = [...new Set(completedTripRows().map((item) => item.vehicleNo).filter(Boolean))];
    select.innerHTML = '<option value="">请选择车辆</option>' + vehicles.map((value) => `<option>${escapeHtml(value)}</option>`).join("");
    if (vehicles.includes(current)) select.value = current;
    document.querySelector("#energyLedgerBody").innerHTML = energyLedger.length ? energyLedger.map((item) => `<tr><td>${escapeHtml(item.recordDate)}</td><td>${energyLabel(item.energyType)}</td><td>${escapeHtml(item.partnerName)}</td><td>${item.businessType === "recharge" ? "预充值" : "实际消费"}</td><td>${escapeHtml(item.vehicleNo || "-")}<small>${escapeHtml(item.month || "-")}</small></td><td class="finance-money-cell">${money(item.amount)}</td><td><span class="settlement-status ${item.status === "allocated" ? "confirmed" : "generated"}">${item.businessType === "recharge" ? "已入账" : item.status === "allocated" ? "已按趟分摊" : "待分摊"}</span></td><td>${number(item.tripCount)}</td><td>${escapeHtml(item.remark || "-")}</td></tr>`).join("") : '<tr><td class="empty-table-cell" colspan="9">暂无能源充值或消费记录</td></tr>';
  }

  function ensureExportButtons() {
    [["#settlementPendingBody", "pending"], ["#settlementOrderBody", "orders", ".settlement-order-tools"], ["#payrollPendingBody", "payroll-pending"], ["#payrollOrderBody", "payroll-orders"], ["#settlementTransactionBody", "transactions"]].forEach(([bodySelector, type, targetSelector]) => {
      const card = document.querySelector(bodySelector)?.closest(".settlement-table-card");
      const target = targetSelector ? card?.querySelector(targetSelector) : card?.querySelector(".table-summary");
      if (!target || target.querySelector(`[data-settlement-export="${type}"]`)) return;
      const button = document.createElement("button");
      button.className = "btn quiet settlement-export-btn";
      button.type = "button";
      button.dataset.settlementExport = type;
      button.innerHTML = '<i data-lucide="download" aria-hidden="true"></i>导出';
      target.appendChild(button);
    });
  }
  function exportDataset(type) {
    if (type === "pending") {
      const rows = filteredPendingRows();
      return { name: "待结算明细", description: "当前筛选条件", headers: ["方向", "费用来源", "运单号", "下单日期", "完成时间", "客户", "项目", "线路", "结算对象", "运力归属", "车辆", "司机", "结算金额"], rows: rows.map((row) => [row.direction === "receivable" ? "客户应收" : "三方应付", row.feeLabel, row.waybillNo, row.orderDate, row.completedAt, row.customerName, row.projectName, row.routeName, row.counterparty, row.capacityOwnership, row.vehicleNo, row.driverName, number(row.amount).toFixed(2)]) };
    }
    if (type === "orders") {
      const rows = filteredOrderRows();
      return { name: "结算单与对账单", description: `筛选类型：${activeOrderFilter}`, headers: ["结算单号", "对账单号", "方向", "结算对象", "项目", "运单数", "结算金额", "单据状态", "发票状态", "资金状态", "生成日期"], rows: rows.map((order) => { const totals = orderTotals(order); return [order.id, order.statementNo, order.type === "receivable" ? "应收" : "应付", order.counterparty, (order.projectNames || []).join(" / "), (order.lines || []).length, number(order.totalAmount).toFixed(2), order.reconciliationStatus === "confirmed" ? "已确认" : "已生成锁定", totals.invoiceStatus, totals.paymentStatus, order.settlementDate || order.createdAt]; }) };
    }
    if (type === "payroll-pending") {
      const rows = filteredPayrollSourceRows();
      return { name: "驾驶员工资待核算运单", description: "当前集装箱号筛选结果", headers: ["运单号", "驾驶员", "项目", "线路", "完成时间", "任务提成"], rows: rows.map((row) => [row.waybillNo, row.driverName, row.projectName, row.routeName, row.completedAt, number(row.amount).toFixed(2)]) };
    }
    if (type === "payroll-orders") return { name: "司机工资单", description: "当前集装箱号筛选结果", headers: ["工资单号", "工资月份", "驾驶员", "驾驶车辆", "出勤天数", "运输车次", "基本工资", "安全奖金", "考勤扣款", "考核处罚", "补贴", "运输绩效", "奖励", "应发工资", "服务费", "保险费", "其他代扣", "实付金额", "公司成本", "银行账号", "开户行", "状态", "生成时间", "发放时间"], rows: filteredPayrollOrderRows().map((order) => [order.id, order.payrollMonth || "-", order.driverName, order.vehicleNos?.join(" / ") || "-", number(order.attendanceDays), order.tripCount ?? (order.lines || []).length, number(order.baseSalary).toFixed(2), number(order.safetyBonus).toFixed(2), number(order.attendanceDeduction).toFixed(2), number(order.assessmentPenalty).toFixed(2), number(order.allowance).toFixed(2), number(order.transportPerformance ?? order.tripCommission).toFixed(2), number(order.reward).toFixed(2), number(order.grossAmount ?? order.totalAmount).toFixed(2), number(order.serviceFee).toFixed(2), number(order.insuranceFee).toFixed(2), number(order.otherDeduction).toFixed(2), number(order.netAmount ?? order.totalAmount).toFixed(2), number(order.companyCost ?? order.totalAmount).toFixed(2), order.bankAccount || "-", order.bankName || "-", order.status, order.createdAt, order.paidAt || "-"]) };
    const rows = filteredTransactionRows();
    return { name: "发票与收付款流水", description: "当前集装箱号筛选结果", headers: ["日期", "结算单号", "结算对象", "业务类型", "票据或流水号", "附件", "金额", "登记人", "备注"], rows: rows.map((record) => [record.recordDate, record.order.id, record.order.counterparty, record.category, record.referenceNo || "-", record.attachmentName || "-", number(record.amount).toFixed(2), record.createdBy || "系统管理员", record.remark || "-"]) };
  }
  function refreshExportButtons() {
    document.querySelectorAll("[data-settlement-export]").forEach((button) => { const count = exportDataset(button.dataset.settlementExport).rows.length; button.disabled = !count; button.title = count ? `导出当前列表全部 ${count} 条数据` : "当前列表暂无可导出数据"; });
  }
  function downloadCsv(dataset) {
    if (!dataset.rows.length) { notify("当前列表没有可导出的数据。"); return false; }
    const escapeCsv = (value) => `"${String(value ?? "").replace(/^([=+\-@])/, "'$1").replaceAll('"', '""')}"`;
    const csv = [dataset.headers, ...dataset.rows].map((row) => row.map(escapeCsv).join(",")).join("\r\n");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob(["\ufeff", csv], { type: "text/csv;charset=utf-8" }));
    link.download = `${dataset.name}-${today()}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
    return true;
  }
  function exportSettlementList(type) {
    const dataset = exportDataset(type);
    if (!downloadCsv(dataset)) return false;
    window.OperationLogManager?.record?.({ moduleId: "settlement", moduleName: "结算中心", actionId: "export", actionName: "导出", targetType: "结算列表", targetId: type, targetLabel: dataset.name, content: `导出${dataset.name}，${dataset.description}，共 ${dataset.rows.length} 条`, changes: [] });
    return true;
  }

  function buildSettlementGroups() {
    const direction = document.querySelector('#settlementPendingQuery [name="direction"]').value;
    const groups = new Map();
    filteredPendingRows().filter((row) => selectedSourceIds.has(row.sourceId)).forEach((row) => {
      const key = `${direction}:${row.counterparty}`;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(row);
    });
    return [...groups.values()];
  }
  function createSettlementOrders() {
    pendingSettlementGroups = buildSettlementGroups();
    if (!pendingSettlementGroups.length) return;
    const lines = pendingSettlementGroups.flat();
    document.querySelector("#settlementGenerationBody").innerHTML = `<div class="settlement-lock-notice danger"><i data-lucide="lock" aria-hidden="true"></i><span>生成后来源运单和金额立即锁定。不能删除、撤销、冲销或回退；后续差错只能新增费用补录。</span></div><section class="settlement-detail-summary"><div><span>结算方向</span><strong>${lines[0].direction === "receivable" ? "客户应收" : "三方应付"}</strong></div><div><span>生成结算单</span><strong>${pendingSettlementGroups.length} 张</strong></div><div><span>费用来源</span><strong>${lines.length} 条</strong></div><div><span>结算总额</span><strong>${money(lines.reduce((sum, row) => sum + row.amount, 0))}</strong></div><div><span>结算日期</span><strong>${today()}</strong></div><div><span>可结算范围</span><strong>仅已完成运单</strong></div></section><div class="settlement-preview-list">${pendingSettlementGroups.map((group) => `<div><strong>${escapeHtml(group[0].counterparty)}</strong><span>${group.length} 条 · ${money(group.reduce((sum, row) => sum + row.amount, 0))}</span></div>`).join("")}</div>`;
    document.querySelector("#settlementGenerationDialog").showModal();
    window.lucide?.createIcons();
  }
  function commitSettlementOrders() {
    const direction = pendingSettlementGroups[0]?.[0]?.direction;
    if (!direction) return;
    pendingSettlementGroups.forEach((lines, index) => {
      const datePart = today().replaceAll("-", "");
      const id = rules.nextDocumentNumber(orders.map((order) => order.id), `JS-${direction === "receivable" ? "YS" : "YF"}-${datePart}-`);
      const statementNo = rules.nextDocumentNumber(orders.map((order) => order.statementNo), `DZ-${datePart}-`);
      orders.unshift({ id, statementNo, type: direction, counterparty: lines[0].counterparty, projectNames: [...new Set(lines.map((line) => line.projectName))], sourceIds: lines.map((line) => line.sourceId), lines: JSON.parse(JSON.stringify(lines)), totalAmount: lines.reduce((sum, line) => sum + line.amount, 0), documentStatus: "generated", reconciliationStatus: "generated", lockedAt: nowText(), settlementDate: today(), invoiceRecords: [], paymentRecords: [], createdAt: nowText(), createdBy: "系统管理员" });
      lines.filter((line) => line.abnormalFeeId).forEach((line) => {
        const fee = abnormalFees.find((item) => item.id === line.abnormalFeeId);
        const entry = (fee?.entries || []).find((item) => item.sourceId === line.sourceId);
        if (entry) { entry.settlementOrderId = id; entry.lockedAt = nowText(); }
      });
    });
    window.OperationLogManager?.record?.({ moduleId: "settlement", moduleName: "结算中心", actionId: "create", actionName: "生成并锁定", targetType: "结算单", targetId: direction, content: `生成 ${pendingSettlementGroups.length} 张结算单，来源和金额已锁定`, changes: [] });
    pendingSettlementGroups = [];
    selectedSourceIds.clear();
    saveRecords();
    activeOrderFilter = direction;
    activeTab = "orders";
    document.querySelector("#settlementGenerationDialog").close();
    render();
  }
  function confirmOrder(id) {
    const order = orders.find((item) => item.id === id);
    if (!order || order.documentStatus !== "generated") return;
    order.documentStatus = "confirmed";
    order.reconciliationStatus = "confirmed";
    order.confirmedAt = nowText();
    order.confirmedBy = "系统管理员";
    saveRecords();
    render();
  }
  function openOrderDetail(id) {
    const order = orders.find((item) => item.id === id);
    if (!order) return;
    activeOrderId = id;
    const totals = orderTotals(order);
    document.querySelector("#settlementDetailTitle").textContent = order.type === "receivable" ? "应收结算单" : "三方应付结算单";
    document.querySelector("#settlementDetailSubtitle").textContent = `${order.id} · 对账单 ${order.statementNo}`;
    document.querySelector("#settlementDetailBody").innerHTML = `<section class="settlement-detail-summary"><div><span>结算对象</span><strong>${escapeHtml(order.counterparty)}</strong></div><div><span>结算金额</span><strong>${money(order.totalAmount)}</strong></div><div><span>单据状态</span><strong>${order.reconciliationStatus === "confirmed" ? "财务已确认" : "已生成并锁定"}</strong></div><div><span>发票状态</span><strong>${totals.invoiceStatus}</strong></div><div><span>资金状态</span><strong>${totals.paymentStatus}</strong></div><div><span>结算日期</span><strong>${escapeHtml(order.settlementDate || order.createdAt)}</strong></div></section><section class="settlement-statement"><div><strong>对账单 ${escapeHtml(order.statementNo)}</strong><span>来源运单与金额在生成时已冻结；差错通过新的费用补录处理。</span></div><i data-lucide="lock" aria-hidden="true"></i></section><section class="driver-form-section"><h3>来源费用</h3><div class="table-wrap"><table class="fixed-action-table"><thead><tr><th>运单号</th><th>费用来源</th><th>项目</th><th>线路</th><th>车辆 / 司机</th><th>金额</th></tr></thead><tbody>${(order.lines || []).map((line) => `<tr><td>${escapeHtml(line.waybillNo)}</td><td>${escapeHtml(line.feeLabel || "基础费用")}</td><td>${escapeHtml(line.projectName)}</td><td>${escapeHtml(line.routeName)}</td><td>${escapeHtml(line.vehicleNo)} / ${escapeHtml(line.driverName)}</td><td class="finance-money-cell">${money(line.amount)}</td></tr>`).join("")}</tbody></table></div></section>`;
    document.querySelector("#confirmSettlementOrder").hidden = order.documentStatus !== "generated";
    const complete = totals.invoiceOutstanding <= 0.005 && totals.paymentOutstanding <= 0.005;
    const legacyPartial = ((order.invoiceRecords || []).length && totals.invoiceOutstanding > 0.005) || ((order.paymentRecords || []).length && totals.paymentOutstanding > 0.005);
    const transactionButton = document.querySelector("#openSettlementTransaction");
    transactionButton.disabled = order.documentStatus !== "confirmed" || complete || legacyPartial;
    transactionButton.textContent = complete ? "发票和资金已登记" : legacyPartial ? "历史部分登记待迁移" : "登记发票 / 收付款";
    document.querySelector("#settlementDetailDialog").showModal();
    window.lucide?.createIcons();
  }
  function openTransactionDialog() {
    const order = orders.find((item) => item.id === activeOrderId);
    if (!order || order.documentStatus !== "confirmed") return;
    const options = [];
    if (!(order.invoiceRecords || []).length) options.push(`<option value="invoice">${order.type === "receivable" ? "销项发票" : "进项发票"}</option>`);
    if (!(order.paymentRecords || []).length) options.push(`<option value="payment">${order.type === "receivable" ? "收款" : "付款"}</option>`);
    if (!options.length) return notify("该结算单的发票和资金均已全额登记。");
    const form = document.querySelector("#settlementTransactionForm");
    form.reset();
    form.elements.recordDate.value = today();
    form.elements.amount.value = number(order.totalAmount).toFixed(2);
    form.elements.recordType.innerHTML = options.join("");
    document.querySelector("#settlementTransactionSubtitle").textContent = `${order.id} · ${order.counterparty} · 全额 ${money(order.totalAmount)}`;
    document.querySelector("#settlementDetailDialog").close();
    document.querySelector("#settlementTransactionDialog").showModal();
  }
  async function saveTransaction(event) {
    event.preventDefault();
    const order = orders.find((item) => item.id === activeOrderId);
    if (!order) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const type = String(data.get("recordType"));
    const validation = rules.validateFullTransaction(order, type, data.get("amount"));
    if (!validation.ok) return notify(validation.message);
    const attachment = form.elements.attachment.files?.[0];
    const recordId = `JL-${Date.now()}`;
    let storedAttachment = null;
    try { storedAttachment = attachment ? await window.AttachmentStore?.save?.(attachment, `settlement:${recordId}`) : null; }
    catch (error) { return notify(error.message || "附件保存失败，请重试。"); }
    const record = { id: recordId, recordDate: String(data.get("recordDate")), amount: number(order.totalAmount), referenceNo: String(data.get("referenceNo") || "").trim(), attachmentId: storedAttachment?.id || "", attachmentName: storedAttachment?.name || "", attachmentType: storedAttachment?.type || "", attachmentSize: storedAttachment?.size || 0, remark: String(data.get("remark") || "").trim(), createdBy: "系统管理员", createdAt: nowText(), locked: true };
    if (type === "invoice") order.invoiceRecords = [record]; else order.paymentRecords = [record];
    saveRecords();
    document.querySelector("#settlementTransactionDialog").close();
    if (typeof switchPage === "function") switchPage("settlement-transactions");
    else openModule("transactions");
  }

  function previewPayrollOrders() {
    const availableRows = payrollSourceRows();
    const selectedGroups = new Set(availableRows.filter((row) => selectedPayrollIds.has(row.sourceId)).map((row) => `${row.driverId}:${row.payrollMonth}`));
    const groups = new Map();
    availableRows.filter((row) => selectedGroups.has(`${row.driverId}:${row.payrollMonth}`)).forEach((row) => { const key = `${row.driverId}:${row.payrollMonth}`; if (!groups.has(key)) groups.set(key, []); groups.get(key).push(row); });
    pendingPayrollGroups = [...groups.values()];
    const duplicate = pendingPayrollGroups.find((lines) => payrollOrders.some((order) => order.driverId === lines[0].driverId && order.payrollMonth === lines[0].payrollMonth));
    if (duplicate) return notify(`${duplicate[0].driverName} ${duplicate[0].payrollMonth} 已生成工资单，不能重复计入当月固定工资。`);
    document.querySelector("#payrollGenerationBody").innerHTML = `<div class="settlement-lock-notice danger"><i data-lucide="lock" aria-hidden="true"></i><span>工资单按驾驶员和自然月生成；生成后立即锁定，不支持删除、撤销或回退。</span></div>${pendingPayrollGroups.map((lines, index) => `<section class="driver-form-section payroll-preview-card"><h3>${escapeHtml(lines[0].driverName)} <small>${escapeHtml(lines[0].payrollMonth)} · ${lines.length} 趟 · 运输绩效 ${money(lines.reduce((sum, line) => sum + line.amount, 0))}</small></h3><div class="form-grid payroll-preview-grid"><label class="field"><span>出勤天数</span><input name="attendanceDays-${index}" type="number" min="0" step="0.5" value="0" /></label><label class="field"><span>基本工资</span><input name="baseSalary-${index}" type="number" min="0" step="0.01" value="0" /></label><label class="field"><span>安全奖金</span><input name="safetyBonus-${index}" type="number" min="0" step="0.01" value="0" /></label><label class="field"><span>考勤扣款</span><input name="attendanceDeduction-${index}" type="number" min="0" step="0.01" value="0" /></label><label class="field"><span>考核处罚</span><input name="assessmentPenalty-${index}" type="number" min="0" step="0.01" value="0" /></label><label class="field"><span>补贴</span><input name="allowance-${index}" type="number" min="0" step="0.01" value="0" /></label><label class="field"><span>运输绩效</span><input name="transportPerformance-${index}" type="number" value="${lines.reduce((sum, line) => sum + line.amount, 0).toFixed(2)}" readonly /></label><label class="field"><span>奖励</span><input name="reward-${index}" type="number" min="0" step="0.01" value="0" /></label><label class="field"><span>服务费</span><input name="serviceFee-${index}" type="number" min="0" step="0.01" value="0" /></label><label class="field"><span>保险费</span><input name="insuranceFee-${index}" type="number" min="0" step="0.01" value="0" /></label><label class="field"><span>其他代扣</span><input name="otherDeduction-${index}" type="number" min="0" step="0.01" value="0" /></label><label class="field"><span>公司承担成本</span><input name="companySocialSecurity-${index}" type="number" min="0" step="0.01" value="0" /></label><label class="field"><span>银行账号</span><input name="bankAccount-${index}" value="${escapeHtml(lines[0].bankAccount)}" /></label><label class="field"><span>开户行</span><input name="bankName-${index}" value="${escapeHtml(lines[0].bankName)}" /></label><label class="field field-wide"><span>备注</span><input name="payrollRemark-${index}" placeholder="可填写工资调整说明" /></label></div><div class="payroll-preview-total" data-payroll-total="${index}"></div></section>`).join("")}`;
    updatePayrollPreviewTotals();
    document.querySelector("#payrollGenerationDialog").showModal();
    window.lucide?.createIcons();
  }
  function payrollValues(index) {
    const form = document.querySelector("#payrollGenerationForm");
    const value = (name) => number(form.elements[`${name}-${index}`]?.value);
    return rules.calculatePayroll({ attendanceDays: value("attendanceDays"), baseSalary: value("baseSalary"), safetyBonus: value("safetyBonus"), attendanceDeduction: value("attendanceDeduction"), assessmentPenalty: value("assessmentPenalty"), allowance: value("allowance"), transportPerformance: value("transportPerformance"), reward: value("reward"), serviceFee: value("serviceFee"), insuranceFee: value("insuranceFee"), otherDeduction: value("otherDeduction"), companySocialSecurity: value("companySocialSecurity") });
  }
  function updatePayrollPreviewTotals() {
    pendingPayrollGroups.forEach((lines, index) => {
      const totals = payrollValues(index);
      document.querySelector(`[data-payroll-total="${index}"]`).textContent = `应发 ${money(totals.grossAmount)} · 代扣 ${money(totals.deductionAmount)} · 实付 ${money(totals.netAmount)} · 公司成本 ${money(totals.companyCost)}`;
    });
  }
  function createPayrollOrders(event) {
    event.preventDefault();
    pendingPayrollGroups.forEach((lines, index) => {
      const totals = payrollValues(index);
      const payrollMonth = lines[0].payrollMonth;
      if (payrollOrders.some((order) => order.driverId === lines[0].driverId && order.payrollMonth === payrollMonth)) return;
      const id = rules.nextDocumentNumber(payrollOrders.map((order) => order.id), `GZ-${today().replaceAll("-", "")}-`);
      const form = document.querySelector("#payrollGenerationForm");
      const order = { id, payrollMonth, driverId: lines[0].driverId, driverName: lines[0].driverName, vehicleNos: [...new Set(lines.map((line) => line.vehicleNo))], tripCount: lines.length, bankAccount: String(form.elements[`bankAccount-${index}`]?.value || "").trim(), bankName: String(form.elements[`bankName-${index}`]?.value || "").trim(), remark: String(form.elements[`payrollRemark-${index}`]?.value || "").trim(), sourceIds: lines.map((line) => line.sourceId), lines: JSON.parse(JSON.stringify(lines)), ...totals, totalAmount: totals.netAmount, status: "generated", lockedAt: nowText(), settlementDate: today(), createdAt: nowText() };
      order.costAllocations = rules.allocateAmountByLines(order.companyCost, lines);
      order.costAllocations.forEach((allocation) => {
        const current = financeExpenseRecords[allocation.waybillNo] || {};
        current.labor = number(current.labor) + number(allocation.amount);
        current.payrollOrderIds = [...new Set([...(current.payrollOrderIds || []), id])];
        financeExpenseRecords[allocation.waybillNo] = current;
      });
      payrollOrders.unshift(order);
    });
    saveFinanceExpenseRecords();
    selectedPayrollIds.clear();
    pendingPayrollGroups = [];
    saveRecords();
    document.querySelector("#payrollGenerationDialog").close();
    render();
  }
  function saveAbnormalFee(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const waybillNo = String(data.get("waybillNo") || "");
    if (!latestCompletedDispatch(waybillNo)) return notify("只有运输完成的运单可以补录异常费用。");
    const feeType = data.get("feeType") === "custom" ? String(data.get("customFeeType") || "").trim() : String(data.get("feeType") || "");
    if (!feeType) return notify("请输入自定义费用项目名称。");
    let fee;
    try { fee = rules.createAbnormalFee({ waybillNo, feeType, receivableAmount: data.get("receivableAmount"), payableAmount: data.get("payableAmount"), remark: data.get("remark") }, { createdAt: nowText(), createdBy: "系统管理员" }); }
    catch (error) { return notify(error.message); }
    const dispatch = latestCompletedDispatch(waybillNo);
    const context = settlementContext(waybills.find((item) => item.waybillNo === waybillNo), dispatch);
    if (fee.payableAmount > 0 && context.ownership !== "三方") {
      const current = financeExpenseRecords[waybillNo] || {};
      current.vehicleOther = number(current.vehicleOther) + fee.payableAmount;
      current.abnormalFeeIds = [...new Set([...(current.abnormalFeeIds || []), fee.id])];
      financeExpenseRecords[waybillNo] = current;
      fee.selfCostPostedAt = nowText();
      fee.entries = fee.entries.filter((entry) => entry.direction !== "payable");
      saveFinanceExpenseRecords();
    }
    abnormalFees.unshift(fee);
    saveRecords();
    form.reset();
    document.querySelector("#abnormalCustomTypeField").hidden = true;
    render();
  }
  function postEnergyAllocations(record) {
    if (record.businessType !== "consumption" || record.status !== "allocated" || record.postedAt) return;
    const field = ({ fuel: "fuel", gas: "gas", electricity: "electricity" })[record.energyType];
    (record.allocations || []).forEach((allocation) => {
      const current = financeExpenseRecords[allocation.waybillNo] || {};
      const ids = Array.isArray(current.energyAllocationIds) ? current.energyAllocationIds : [];
      if (ids.includes(record.id)) return;
      current[field] = number(current[field]) + number(allocation.amount);
      current.energyAllocationIds = [...ids, record.id];
      current.energyAllocatedAmount = number(current.energyAllocatedAmount) + number(allocation.amount);
      financeExpenseRecords[allocation.waybillNo] = current;
    });
    record.postedAt = nowText();
    saveFinanceExpenseRecords();
  }
  function removeEnergyAllocations(record) {
    if (record.businessType !== "consumption" || !record.postedAt) return;
    const field = ({ fuel: "fuel", gas: "gas", electricity: "electricity" })[record.energyType];
    (record.allocations || []).forEach((allocation) => {
      const current = financeExpenseRecords[allocation.waybillNo] || {};
      const ids = Array.isArray(current.energyAllocationIds) ? current.energyAllocationIds : [];
      if (!ids.includes(record.id)) return;
      current[field] = Math.max(0, number(current[field]) - number(allocation.amount));
      current.energyAllocatedAmount = Math.max(0, number(current.energyAllocatedAmount) - number(allocation.amount));
      current.energyAllocationIds = ids.filter((id) => id !== record.id);
      financeExpenseRecords[allocation.waybillNo] = current;
    });
    delete record.postedAt;
  }
  function reconcileEnergyAllocations() {
    let changed = false;
    const trips = completedTripRows();
    energyLedger.filter((item) => item.businessType === "consumption").forEach((item) => {
      const allocation = rules.allocateEnergyConsumption(item, trips, { asOfDate: today() });
      const previous = JSON.stringify({ status: item.status, pendingReason: item.pendingReason || "", tripCount: item.tripCount || 0, allocations: item.allocations || [] });
      const next = JSON.stringify({ status: allocation.status, pendingReason: allocation.pendingReason || "", tripCount: allocation.tripCount || 0, allocations: allocation.allocations || [] });
      if (previous === next) return;
      removeEnergyAllocations(item);
      Object.assign(item, allocation);
      postEnergyAllocations(item);
      changed = true;
    });
    if (changed) { saveFinanceExpenseRecords(); saveRecords(); }
  }
  function toggleEnergyFields() {
    const form = document.querySelector("#energyLedgerForm");
    const consumption = form.elements.businessType.value === "consumption";
    document.querySelectorAll(".energy-consumption-field").forEach((field) => { field.hidden = !consumption; field.querySelector("input,select").required = consumption; });
  }
  function saveEnergyEntry(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const businessType = String(data.get("businessType"));
    const energyType = String(data.get("energyType"));
    const partnerName = String(data.get("partnerName") || "").trim();
    const amount = number(data.get("amount"));
    if (businessType === "consumption") {
      const balance = energyBalances().find((item) => item.energyType === energyType && item.partnerName === partnerName)?.balance || 0;
      if (amount > balance + 0.005) return notify(`当前预充值余额为 ${money(balance)}，不足以登记本次消费。`);
      if (!data.get("vehicleNo") || !data.get("month")) return notify("实际消费必须选择车辆和归属自然月。");
    }
    const record = { id: `NY-${Date.now()}`, businessType, energyType, partnerName, amount, vehicleNo: businessType === "consumption" ? String(data.get("vehicleNo")) : "", month: businessType === "consumption" ? String(data.get("month")) : "", recordDate: String(data.get("recordDate")), remark: String(data.get("remark") || "").trim(), createdAt: nowText(), createdBy: "系统管理员", status: businessType === "recharge" ? "posted" : "pending", tripCount: 0, allocations: [] };
    if (businessType === "consumption") Object.assign(record, rules.allocateEnergyConsumption(record, completedTripRows(), { asOfDate: today() }));
    energyLedger.unshift(record);
    postEnergyAllocations(record);
    saveRecords();
    form.reset();
    form.elements.recordDate.value = today();
    form.elements.month.value = today().slice(0, 7);
    toggleEnergyFields();
    render();
  }
  function exportEnergy(type) {
    const rows = energyLedger.filter((item) => item.energyType === type);
    downloadCsv({ name: `${energyLabel(type)}台账`, headers: ["日期", "合作单位", "业务类型", "车辆", "归属月份", "金额", "分摊状态", "完成趟次", "备注"], rows: rows.map((item) => [item.recordDate, item.partnerName, item.businessType === "recharge" ? "预充值" : "实际消费", item.vehicleNo || "-", item.month || "-", number(item.amount).toFixed(2), item.businessType === "recharge" ? "已入账" : item.status === "allocated" ? "已按趟分摊" : "待分摊", item.tripCount || 0, item.remark || "-"]) });
  }

  function switchTab(tab) {
    activeTab = tab;
    document.querySelectorAll("[data-settlement-tab]").forEach((button) => { const active = button.dataset.settlementTab === tab; button.classList.toggle("active", active); button.setAttribute("aria-selected", String(active)); });
    document.querySelectorAll("[data-settlement-panel]").forEach((panel) => { const active = panel.dataset.settlementPanel === tab; panel.classList.toggle("active", active); panel.hidden = !active; });
  }
  const MODULE_UI = {
    overview: { title: "结算管理", description: "查看结算进度和待处理事项，并快速进入对应模块。", badge: "结算业务实时汇总", tabs: [] },
    receivable: { title: "应收账款管理", description: "选择已完成运单生成客户应收结算单，财务确认后登记销项发票和收款。", badge: "仅归集已完成运单", tabs: ["pending", "orders"], direction: "receivable" },
    payable: { title: "三方应付结算", description: "选择三方运力的已完成运单生成应付结算单，财务确认后登记进项发票和付款。", badge: "仅归集三方完成运单", tabs: ["pending", "orders"], direction: "payable" },
    payroll: { title: "自营结算", description: "按司机和已关闭自然月归集已完成运单，生成并确认司机工资单。", badge: "司机＋自然月核算", tabs: ["payroll"] },
    abnormal: { title: "异常费用管理", description: "对已完成运单分别补录异常应收和异常应付，后续进入对应结算流程。", badge: "异常收付分别核算", tabs: ["abnormal"] },
    transactions: { title: "发票与收付款", description: "处理已确认结算单的发票、收款和付款，并查看历史登记流水及附件。", badge: "票款全额登记", tabs: ["transactions"] },
    energy: { title: "预充值管理", description: "管理燃油、LNG 和充电预充值及消费，月结后按车辆完成趟次分摊。", badge: "车辆＋自然月＋能源类型", tabs: ["energy"] },
  };
  function applyModuleLayout() {
    const config = MODULE_UI[activeModule] || MODULE_UI.overview;
    document.querySelector("#settlementPageEyebrow").textContent = `结算中心 / ${config.title}`;
    document.querySelector("#settlementPageHeading").textContent = config.title;
    document.querySelector("#settlementPageDescription").textContent = config.description;
    document.querySelector("#settlementSyncBadge").innerHTML = `<i></i>${escapeHtml(config.badge)}`;
    document.querySelector("#settlementDashboard").hidden = activeModule !== "overview";
    document.querySelector(".settlement-tabs").hidden = config.tabs.length <= 1;
    document.querySelectorAll("[data-settlement-tab]").forEach((button) => {
      button.hidden = !config.tabs.includes(button.dataset.settlementTab);
      if (button.dataset.settlementTab === "pending" && config.direction) button.textContent = config.direction === "receivable" ? "待结算应收" : "待结算应付";
      if (button.dataset.settlementTab === "orders" && config.direction) button.textContent = config.direction === "receivable" ? "应收结算单" : "应付结算单";
    });
    const directionField = document.querySelector("[data-settlement-direction-field]");
    const directionSelect = document.querySelector('#settlementPendingQuery [name="direction"]');
    if (config.direction) {
      directionSelect.value = config.direction;
      directionField.hidden = true;
    } else directionField.hidden = false;
    document.querySelectorAll("[data-settlement-order-filter]").forEach((button) => {
      button.hidden = Boolean(config.direction) && ![config.direction, `${config.direction}-unpaid`, "needs-confirmation"].includes(button.dataset.settlementOrderFilter);
    });
  }
  function openModule(module = "overview") {
    activeModule = MODULE_UI[module] ? module : "overview";
    const config = MODULE_UI[activeModule];
    activeTab = config.tabs[0] || "";
    selectedSourceIds.clear();
    selectedPayrollIds.clear();
    if (config.direction) activeOrderFilter = config.direction;
    if (activeModule === "transactions") activeTransactionTaskFilter = "all";
    render();
  }
  function openDashboardRoute(route, tab = "", filter = "") {
    if (typeof switchPage === "function") switchPage(route);
    if (tab) activeTab = tab;
    if (filter === "needs-confirmation") activeOrderFilter = filter;
    if (["receivable-invoice", "payable-invoice", "receivable-payment", "payable-payment"].includes(filter)) {
      activeTransactionTaskFilter = filter;
      const select = document.querySelector("#settlementPendingTransactionFilter");
      if (select) select.value = filter;
    }
    render();
  }
  function openTarget(target) {
    openModule(MODULE_UI[target] ? target : "overview");
  }
  function render() {
    applyModuleLayout();
    ensureExportButtons();
    reconcileEnergyAllocations();
    populateSettlementFilters();
    renderSummary();
    renderPending();
    renderOrders();
    renderPayroll();
    renderTransactions();
    renderAbnormalFees();
    renderEnergy();
    if (activeModule === "overview") {
      document.querySelectorAll("[data-settlement-panel]").forEach((panel) => { panel.classList.remove("active"); panel.hidden = true; });
    } else switchTab(activeTab);
    window.lucide?.createIcons();
  }

  document.querySelectorAll("[data-settlement-tab]").forEach((button) => button.addEventListener("click", () => { switchTab(button.dataset.settlementTab); renderSummary(); window.lucide?.createIcons(); }));
  document.querySelector("#settlementPage")?.addEventListener("click", (event) => {
    const routeButton = event.target.closest("[data-settlement-dashboard-route]");
    if (routeButton) openDashboardRoute(routeButton.dataset.settlementDashboardRoute, routeButton.dataset.settlementDashboardTab, routeButton.dataset.settlementDashboardFilter);
    const pendingTransactionButton = event.target.closest("[data-settlement-pending-transaction]");
    if (pendingTransactionButton) { openOrderDetail(pendingTransactionButton.dataset.settlementPendingTransaction); openTransactionDialog(); }
    const exportButton = event.target.closest("[data-settlement-export]");
    if (exportButton) exportSettlementList(exportButton.dataset.settlementExport);
  });
  document.querySelector("#settlementPendingQuery")?.addEventListener("input", () => { selectedSourceIds.clear(); renderPending(); });
  document.querySelector("#settlementOrderContainerSearch")?.addEventListener("input", renderOrders);
  document.querySelector("#settlementPendingBody")?.addEventListener("change", (event) => { if (!event.target.matches(".settlement-source-check")) return; if (event.target.checked) selectedSourceIds.add(event.target.value); else selectedSourceIds.delete(event.target.value); renderPending(); });
  document.querySelector("#settlementPendingCheckAll")?.addEventListener("change", (event) => { filteredPendingRows().forEach((row) => event.target.checked ? selectedSourceIds.add(row.sourceId) : selectedSourceIds.delete(row.sourceId)); renderPending(); });
  document.querySelector("#settlementSelectAll")?.addEventListener("click", () => { filteredPendingRows().forEach((row) => selectedSourceIds.add(row.sourceId)); renderPending(); });
  document.querySelector("#createSettlementOrder")?.addEventListener("click", createSettlementOrders);
  document.querySelector("#confirmSettlementGeneration")?.addEventListener("click", commitSettlementOrders);
  ["#closeSettlementGeneration", "#cancelSettlementGeneration"].forEach((selector) => document.querySelector(selector)?.addEventListener("click", () => document.querySelector("#settlementGenerationDialog").close()));
  document.querySelector("#settlementOrderBody")?.addEventListener("click", (event) => { const view = event.target.closest("[data-settlement-view]"); const confirm = event.target.closest("[data-settlement-confirm]"); if (view) openOrderDetail(view.dataset.settlementView); if (confirm) confirmOrder(confirm.dataset.settlementConfirm); });
  document.querySelector(".settlement-filter-group")?.addEventListener("click", (event) => { const button = event.target.closest("[data-settlement-order-filter]"); if (!button) return; activeOrderFilter = button.dataset.settlementOrderFilter; renderOrders(); renderSummary(); });
  document.querySelector("#closeSettlementDetail")?.addEventListener("click", () => document.querySelector("#settlementDetailDialog").close());
  document.querySelector("#confirmSettlementOrder")?.addEventListener("click", () => { confirmOrder(activeOrderId); document.querySelector("#settlementDetailDialog").close(); });
  document.querySelector("#openSettlementTransaction")?.addEventListener("click", openTransactionDialog);
  ["#closeSettlementTransaction", "#cancelSettlementTransaction"].forEach((selector) => document.querySelector(selector)?.addEventListener("click", () => document.querySelector("#settlementTransactionDialog").close()));
  document.querySelector("#settlementTransactionForm")?.addEventListener("submit", saveTransaction);
  document.querySelector("#settlementTransactionBody")?.addEventListener("click", async (event) => {
    const button = event.target.closest("[data-attachment-open]");
    if (!button) return;
    try { await window.AttachmentStore?.open?.(button.dataset.attachmentOpen); }
    catch (error) { notify(error.message || "附件读取失败。"); }
  });
  document.querySelector("#payrollPendingBody")?.addEventListener("change", (event) => { if (!event.target.matches(".payroll-source-check")) return; if (event.target.checked) selectedPayrollIds.add(event.target.value); else selectedPayrollIds.delete(event.target.value); renderPayroll(); });
  document.querySelector("#payrollCheckAll")?.addEventListener("change", (event) => { filteredPayrollSourceRows().forEach((row) => event.target.checked ? selectedPayrollIds.add(row.sourceId) : selectedPayrollIds.delete(row.sourceId)); renderPayroll(); });
  document.querySelector("#payrollPendingContainerSearch")?.addEventListener("input", renderPayroll);
  document.querySelector("#payrollOrderContainerSearch")?.addEventListener("input", renderPayroll);
  document.querySelector("#createPayrollOrders")?.addEventListener("click", previewPayrollOrders);
  document.querySelector("#payrollGenerationForm")?.addEventListener("input", updatePayrollPreviewTotals);
  document.querySelector("#payrollGenerationForm")?.addEventListener("submit", createPayrollOrders);
  ["#closePayrollGeneration", "#cancelPayrollGeneration"].forEach((selector) => document.querySelector(selector)?.addEventListener("click", () => document.querySelector("#payrollGenerationDialog").close()));
  document.querySelector("#payrollOrderBody")?.addEventListener("click", (event) => { const button = event.target.closest("[data-payroll-action]"); if (!button) return; const order = payrollOrders.find((item) => item.id === button.dataset.payrollId); if (!order) return; order.status = button.dataset.payrollAction === "confirm" ? "confirmed" : "paid"; if (order.status === "paid") order.paidAt = nowText(); saveRecords(); render(); });
  document.querySelector('#abnormalFeeForm [name="feeType"]')?.addEventListener("change", (event) => { document.querySelector("#abnormalCustomTypeField").hidden = event.target.value !== "custom"; });
  document.querySelector('#abnormalFeeForm [name="receivableAmount"]')?.addEventListener("input", (event) => { const payable = document.querySelector('#abnormalFeeForm [name="payableAmount"]'); if (!payable.dataset.edited) payable.value = event.target.value; });
  document.querySelector('#abnormalFeeForm [name="payableAmount"]')?.addEventListener("input", (event) => { event.target.dataset.edited = "true"; });
  document.querySelector("#abnormalFeeForm")?.addEventListener("submit", saveAbnormalFee);
  document.querySelector("#abnormalFeeContainerSearch")?.addEventListener("input", renderAbnormalFees);
  document.querySelector("#settlementTransactionContainerSearch")?.addEventListener("input", renderTransactions);
  document.querySelector("#settlementPendingTransactionContainerSearch")?.addEventListener("input", renderPendingTransactions);
  document.querySelector("#settlementPendingTransactionFilter")?.addEventListener("change", (event) => { activeTransactionTaskFilter = event.currentTarget.value; renderPendingTransactions(); });
  document.querySelector('#energyLedgerForm [name="businessType"]')?.addEventListener("change", toggleEnergyFields);
  document.querySelector("#energyLedgerForm")?.addEventListener("submit", saveEnergyEntry);
  document.querySelectorAll("[data-energy-export]").forEach((button) => button.addEventListener("click", () => exportEnergy(button.dataset.energyExport)));
  window.addEventListener("storage", (event) => {
    if (!Object.values(KEYS).includes(event.key)) return;
    orders = load(KEYS.orders).map(normalizeOrder);
    payrollOrders = load(KEYS.payroll).map(normalizePayrollOrder);
    abnormalFees = load(KEYS.abnormal);
    energyLedger = load(KEYS.energy);
    render();
  });
  const energyForm = document.querySelector("#energyLedgerForm");
  if (energyForm) { energyForm.elements.recordDate.value = today(); energyForm.elements.month.value = today().slice(0, 7); toggleEnergyFields(); }
  window.SettlementManager = { render, openModule, openTarget, completedSettlementRows, payrollSourceRows, orderTotals, exportDataset, exportSettlementList, reconcileEnergyAllocations };
  const selectedSettlementRoute = document.querySelector("#settlementPage.active") ? document.querySelector(".nav-child.selected")?.dataset.page : "";
  const initialModuleByRoute = {
    "settlement-management": "overview",
    "settlement-receivable": "receivable",
    "settlement-payable": "payable",
    "settlement-payroll": "payroll",
    "settlement-abnormal": "abnormal",
    "settlement-transactions": "transactions",
    "settlement-energy": "energy",
  };
  if (initialModuleByRoute[selectedSettlementRoute]) openModule(initialModuleByRoute[selectedSettlementRoute]);
})();
