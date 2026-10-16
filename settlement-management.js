(function initSettlementManagement() {
  const ORDER_STORAGE_KEY = "container-logistics-settlement-orders-v1";
  const PAYROLL_STORAGE_KEY = "container-logistics-payroll-orders-v1";
  const selectedSourceIds = new Set();
  const selectedPayrollIds = new Set();
  let activeTab = "pending";
  let activeOrderId = "";
  let orders = loadRecords(ORDER_STORAGE_KEY);
  let payrollOrders = loadRecords(PAYROLL_STORAGE_KEY);

  function loadRecords(key) {
    try {
      const records = JSON.parse(localStorage.getItem(key) || "[]");
      return Array.isArray(records) ? records : [];
    } catch (error) {
      console.warn("结算数据读取失败。", error);
      return [];
    }
  }

  function saveRecords() {
    localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(orders));
    localStorage.setItem(PAYROLL_STORAGE_KEY, JSON.stringify(payrollOrders));
  }

  const number = (value) => Number.isFinite(Number(value)) ? Number(value) : 0;
  const money = (value) => `¥${number(value).toFixed(2)}`;
  const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
  const today = () => {
    const date = new Date();
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  };
  const nowText = () => window.DispatchStore?.nowText?.() || new Date().toISOString().replace("T", " ").slice(0, 16);

  function latestCompletedDispatch(waybillNo) {
    return dispatches
      .filter((dispatch) => dispatch.waybillNo === waybillNo && dispatch.status === "已完成")
      .sort((left, right) => String(right.dispatchTime || "").localeCompare(String(left.dispatchTime || "")))[0] || null;
  }

  function completedTime(dispatch) {
    const timeline = Array.isArray(dispatch?.timeline) ? dispatch.timeline : [];
    const entry = [...timeline].reverse().find((item) => ["已送达", "已完成", "完成"].includes(item.node));
    return entry?.time || dispatch?.dispatchTime || "-";
  }

  function summedFee(waybill, key, target) {
    const fees = Array.isArray(waybill?.[key]) ? waybill[key] : [];
    return fees.filter((fee) => !target || fee.target === target).reduce((sum, fee) => sum + number(fee.amount), 0);
  }

  function settledSourceIds(type) {
    return new Set(orders.filter((order) => order.type === type && order.documentStatus !== "void").flatMap((order) => order.sourceIds || []));
  }

  function completedSettlementRows(direction) {
    const used = settledSourceIds(direction);
    return waybills.map((waybill) => {
      const dispatch = latestCompletedDispatch(waybill.waybillNo);
      if (!dispatch) return null;
      const route = fixedRoutes.find((item) => item.id === (dispatch.routeId || waybill.routeId)) || {};
      const vehicle = vehicles.find((item) => item.plateNo === dispatch.vehicleId);
      const sourceId = `${direction}:${waybill.waybillNo}`;
      if (used.has(sourceId)) return null;
      if (direction === "payable" && vehicle?.ownership !== "外协") return null;
      const feeAmount = direction === "receivable"
        ? summedFee(waybill, "receivableFees") || number(waybill.receivable || dispatch.estimatedRevenue)
        : summedFee(waybill, "payableFees", "供应商") || summedFee(waybill, "payableFees");
      const snapshotPrice = number(dispatch.thirdPartySettlementPriceSnapshot);
      const amount = direction === "payable" ? snapshotPrice || feeAmount || number(waybill.payable || route.baseFreight) : feeAmount;
      const counterparty = direction === "receivable"
        ? waybill.customerName || dispatch.customerName || route.customerName || "未设置客户"
        : dispatch.thirdPartyCarrierSnapshot || route.thirdPartyCarrier || vehicle?.fleetName || vehicle?.fleet || waybill.carrier || "未设置承运商";
      return {
        sourceId, direction, waybillNo: waybill.waybillNo, customerName: waybill.customerName || dispatch.customerName || "-",
        projectId: waybill.projectId || dispatch.projectId || "", projectName: waybill.projectName || dispatch.projectName || "未分配项目",
        routeName: dispatch.routeName || route.routeName || "未指定线路", counterparty, vehicleNo: dispatch.vehicleId || "-",
        driverId: dispatch.driverId || "", driverName: dispatch.driverName || "-", completedAt: completedTime(dispatch), amount,
        pricingMethod: dispatch.thirdPartyPricingMethodSnapshot || route.thirdPartyPricingMethod || "perTrip",
        settlementCycle: dispatch.thirdPartySettlementCycleSnapshot || route.thirdPartySettlementCycle || "-",
        invoiceRequired: direction === "receivable" || dispatch.thirdPartyInvoiceRequiredSnapshot !== false,
      };
    }).filter(Boolean);
  }

  function payrollSourceRows() {
    const used = new Set(payrollOrders.filter((order) => order.status !== "void").flatMap((order) => order.sourceIds || []));
    return waybills.map((waybill) => {
      const dispatch = latestCompletedDispatch(waybill.waybillNo);
      if (!dispatch?.driverId || !dispatch.driverName || dispatch.driverName === "待分配") return null;
      const driver = drivers.find((item) => item.id === dispatch.driverId);
      if (driver && driver.driverType !== "自有司机") return null;
      const sourceId = `payroll:${waybill.waybillNo}`;
      if (used.has(sourceId)) return null;
      const route = fixedRoutes.find((item) => item.id === (dispatch.routeId || waybill.routeId)) || {};
      return { sourceId, waybillNo: waybill.waybillNo, driverId: dispatch.driverId, driverName: dispatch.driverName, projectName: waybill.projectName || dispatch.projectName || "未分配项目", routeName: dispatch.routeName || route.routeName || "未指定线路", completedAt: completedTime(dispatch), amount: number(dispatch.commission) || number(route.commissionValue) };
    }).filter(Boolean);
  }

  function filteredPendingRows() {
    const form = document.querySelector("#settlementPendingQuery");
    const data = new FormData(form);
    const direction = String(data.get("direction") || "receivable");
    const projectId = String(data.get("projectId") || "");
    const keyword = String(data.get("keyword") || "").trim().toLowerCase();
    return completedSettlementRows(direction).filter((row) => (!projectId || row.projectId === projectId) && (!keyword || [row.waybillNo, row.customerName, row.projectName, row.counterparty, row.driverName].join(" ").toLowerCase().includes(keyword)));
  }

  function statusFromAmount(total, recorded, labels) {
    if (recorded <= 0) return labels[0];
    if (recorded + 0.005 < total) return labels[1];
    return labels[2];
  }

  function orderTotals(order) {
    const invoiceAmount = (order.invoiceRecords || []).reduce((sum, item) => sum + number(item.amount), 0);
    const paymentAmount = (order.paymentRecords || []).reduce((sum, item) => sum + number(item.amount), 0);
    return { invoiceAmount, paymentAmount, invoiceStatus: statusFromAmount(order.totalAmount, invoiceAmount, order.type === "receivable" ? ["未开票", "部分开票", "已开票"] : ["未收票", "部分收票", "已收票"]), paymentStatus: statusFromAmount(order.totalAmount, paymentAmount, order.type === "receivable" ? ["未收款", "部分收款", "已收款"] : ["未付款", "部分付款", "已付款"]) };
  }

  function renderSummary() {
    const receivableRows = completedSettlementRows("receivable");
    const payableRows = completedSettlementRows("payable");
    const receivableOutstanding = orders.filter((item) => item.type === "receivable").reduce((sum, order) => sum + Math.max(0, number(order.totalAmount) - orderTotals(order).paymentAmount), 0);
    const payableOutstanding = orders.filter((item) => item.type === "payable").reduce((sum, order) => sum + Math.max(0, number(order.totalAmount) - orderTotals(order).paymentAmount), 0);
    const payrollPending = payrollSourceRows().reduce((sum, row) => sum + row.amount, 0);
    document.querySelector("#settlementSummary").innerHTML = [
      ["待结算应收", money(receivableRows.reduce((sum, row) => sum + row.amount, 0)), `${receivableRows.length} 条已完成运单`, "pending"],
      ["待结算外调运费", money(payableRows.reduce((sum, row) => sum + row.amount, 0)), `${payableRows.length} 条外协运单`, "labor"],
      ["应收未回款", money(receivableOutstanding), "已生成结算单", "total"],
      ["外调待付款", money(payableOutstanding), "已生成应付结算单", "rejected"],
      ["司机待核算", money(payrollPending), `${payrollSourceRows().length} 条运单`, "completed"],
    ].map(([label, value, note, className]) => `<div class="finance-summary-card ${className}"><span>${label}</span><strong>${value}</strong><small>${note}</small></div>`).join("");
  }

  function populateProjectFilter() {
    const select = document.querySelector("#settlementProjectFilter");
    const current = select.value;
    const projects = [...new Map([...completedSettlementRows("receivable"), ...completedSettlementRows("payable")].filter((row) => row.projectId).map((row) => [row.projectId, row.projectName])).entries()];
    select.innerHTML = '<option value="">全部项目</option>' + projects.map(([id, name]) => `<option value="${escapeHtml(id)}">${escapeHtml(name)}</option>`).join("");
    select.value = projects.some(([id]) => id === current) ? current : "";
  }

  function renderPending() {
    const rows = filteredPendingRows();
    const body = document.querySelector("#settlementPendingBody");
    const validIds = new Set(rows.map((row) => row.sourceId));
    [...selectedSourceIds].forEach((id) => { if (!validIds.has(id)) selectedSourceIds.delete(id); });
    body.innerHTML = rows.length ? rows.map((row) => `<tr><td class="check-col"><input class="settlement-source-check" type="checkbox" value="${escapeHtml(row.sourceId)}" ${selectedSourceIds.has(row.sourceId) ? "checked" : ""} /></td><td><strong class="primary-text">${escapeHtml(row.waybillNo)}</strong></td><td>${escapeHtml(row.completedAt)}</td><td><strong>${escapeHtml(row.customerName)}</strong><small>${escapeHtml(row.projectName)}</small></td><td>${escapeHtml(row.routeName)}</td><td><strong>${escapeHtml(row.counterparty)}</strong><small>${row.direction === "receivable" ? "客户应收" : `${escapeHtml(row.settlementCycle)} · ${row.invoiceRequired ? "需票" : "无需票"}`}</small></td><td>${escapeHtml(row.vehicleNo)}<small>${escapeHtml(row.driverName)}</small></td><td class="finance-money-cell">${money(row.amount)}</td></tr>`).join("") : '<tr><td class="empty-table-cell" colspan="8">当前筛选范围内没有可结算的已完成运单</td></tr>';
    const selectedCount = [...selectedSourceIds].filter((id) => validIds.has(id)).length;
    document.querySelector("#settlementPendingSummary").textContent = `筛选结果 ${rows.length} 条，已选择 ${selectedCount} 条`;
    document.querySelector("#settlementPendingBadge").textContent = `${rows.length} 条待结算`;
    document.querySelector("#createSettlementOrder").disabled = selectedCount === 0;
    const checkAll = document.querySelector("#settlementPendingCheckAll");
    checkAll.checked = rows.length > 0 && selectedCount === rows.length;
    checkAll.indeterminate = selectedCount > 0 && selectedCount < rows.length;
    checkAll.disabled = rows.length === 0;
  }

  function renderOrders() {
    const body = document.querySelector("#settlementOrderBody");
    body.innerHTML = orders.length ? orders.map((order) => {
      const totals = orderTotals(order);
      return `<tr><td><strong class="primary-text">${escapeHtml(order.id)}</strong><small>${escapeHtml(order.statementNo)}</small></td><td><span class="settlement-direction ${order.type}">${order.type === "receivable" ? "应收" : "应付"}</span></td><td><strong>${escapeHtml(order.counterparty)}</strong></td><td>${escapeHtml((order.projectNames || []).join(" / ") || "-")}</td><td>${(order.lines || []).length}</td><td class="finance-money-cell">${money(order.totalAmount)}</td><td><span class="settlement-status ${order.reconciliationStatus}">${order.reconciliationStatus === "confirmed" ? "已确认" : "已生成"}</span></td><td>${totals.invoiceStatus}</td><td>${totals.paymentStatus}</td><td class="fixed-action-column"><div class="vehicle-action-group"><button class="link-btn" data-settlement-view="${escapeHtml(order.id)}" type="button">查看</button>${order.documentStatus === "draft" ? `<button class="link-btn success-link" data-settlement-confirm="${escapeHtml(order.id)}" type="button">确认</button>` : ""}</div></td></tr>`;
    }).join("") : '<tr><td class="empty-table-cell" colspan="10">尚未生成结算单</td></tr>';
    document.querySelector("#settlementOrderBadge").textContent = `${orders.length} 张结算单`;
  }

  function renderPayroll() {
    const rows = payrollSourceRows();
    const validIds = new Set(rows.map((row) => row.sourceId));
    [...selectedPayrollIds].forEach((id) => { if (!validIds.has(id)) selectedPayrollIds.delete(id); });
    document.querySelector("#payrollPendingBody").innerHTML = rows.length ? rows.map((row) => `<tr><td class="check-col"><input class="payroll-source-check" type="checkbox" value="${escapeHtml(row.sourceId)}" ${selectedPayrollIds.has(row.sourceId) ? "checked" : ""} /></td><td><strong class="primary-text">${escapeHtml(row.waybillNo)}</strong></td><td>${escapeHtml(row.driverName)}</td><td>${escapeHtml(row.projectName)}<small>${escapeHtml(row.routeName)}</small></td><td>${escapeHtml(row.completedAt)}</td><td class="finance-money-cell">${money(row.amount)}</td></tr>`).join("") : '<tr><td class="empty-table-cell" colspan="6">暂无待核算工资的已完成运单</td></tr>';
    document.querySelector("#payrollOrderBody").innerHTML = payrollOrders.length ? payrollOrders.map((order) => `<tr><td><strong class="primary-text">${escapeHtml(order.id)}</strong></td><td>${escapeHtml(order.driverName)}</td><td>${(order.lines || []).length}</td><td class="finance-money-cell">${money(order.totalAmount)}</td><td><span class="settlement-status ${order.status}">${({ draft: "草稿", confirmed: "已确认", paid: "已发放" })[order.status] || order.status}</span></td><td>${escapeHtml(order.createdAt)}</td><td class="fixed-action-column"><div class="vehicle-action-group">${order.status === "draft" ? `<button class="link-btn success-link" data-payroll-action="confirm" data-payroll-id="${escapeHtml(order.id)}" type="button">确认</button>` : order.status === "confirmed" ? `<button class="link-btn success-link" data-payroll-action="pay" data-payroll-id="${escapeHtml(order.id)}" type="button">登记发放</button>` : '<span class="finance-empty-value">已完成</span>'}</div></td></tr>`).join("") : '<tr><td class="empty-table-cell" colspan="7">尚未生成工资核算单</td></tr>';
    document.querySelector("#payrollPendingBadge").textContent = `${rows.length} 条待核算`;
    document.querySelector("#payrollSelectionSummary").textContent = `已选择 ${selectedPayrollIds.size} 条`;
    document.querySelector("#createPayrollOrders").disabled = selectedPayrollIds.size === 0;
    const checkAll = document.querySelector("#payrollCheckAll");
    checkAll.checked = rows.length > 0 && selectedPayrollIds.size === rows.length;
    checkAll.indeterminate = selectedPayrollIds.size > 0 && selectedPayrollIds.size < rows.length;
  }

  function renderTransactions() {
    const records = orders.flatMap((order) => [
      ...(order.invoiceRecords || []).map((record) => ({ ...record, order, category: order.type === "receivable" ? "销项发票" : "进项发票" })),
      ...(order.paymentRecords || []).map((record) => ({ ...record, order, category: order.type === "receivable" ? "收款" : "付款" })),
    ]).sort((left, right) => String(right.recordDate || "").localeCompare(String(left.recordDate || "")));
    document.querySelector("#settlementTransactionBody").innerHTML = records.length ? records.map((record) => `<tr><td>${escapeHtml(record.recordDate)}</td><td><strong class="primary-text">${escapeHtml(record.order.id)}</strong></td><td>${escapeHtml(record.order.counterparty)}</td><td>${escapeHtml(record.category)}</td><td>${escapeHtml(record.referenceNo || "-")}</td><td class="finance-money-cell">${money(record.amount)}</td><td>${escapeHtml(record.createdBy || "系统管理员")}</td></tr>`).join("") : '<tr><td class="empty-table-cell" colspan="7">暂无发票或收付款登记</td></tr>';
  }

  function createSettlementOrders() {
    const direction = document.querySelector('#settlementPendingQuery [name="direction"]').value;
    const rows = filteredPendingRows().filter((row) => selectedSourceIds.has(row.sourceId));
    const groups = new Map();
    rows.forEach((row) => {
      const key = `${direction}:${row.counterparty}`;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(row);
    });
    groups.forEach((lines) => {
      const serial = String(orders.length + 1).padStart(3, "0");
      const datePart = today().replaceAll("-", "");
      orders.unshift({ id: `JS-${direction === "receivable" ? "YS" : "YF"}-${datePart}-${serial}`, statementNo: `DZ-${datePart}-${serial}`, type: direction, counterparty: lines[0].counterparty, projectNames: [...new Set(lines.map((line) => line.projectName))], sourceIds: lines.map((line) => line.sourceId), lines, totalAmount: lines.reduce((sum, line) => sum + line.amount, 0), documentStatus: "draft", reconciliationStatus: "generated", invoiceRecords: [], paymentRecords: [], createdAt: nowText(), createdBy: "系统管理员" });
    });
    selectedSourceIds.clear();
    saveRecords();
    activeTab = "orders";
    render();
  }

  function createPayrollOrders() {
    const rows = payrollSourceRows().filter((row) => selectedPayrollIds.has(row.sourceId));
    const groups = new Map();
    rows.forEach((row) => {
      if (!groups.has(row.driverId)) groups.set(row.driverId, []);
      groups.get(row.driverId).push(row);
    });
    groups.forEach((lines) => {
      payrollOrders.unshift({ id: `GZ-${today().replaceAll("-", "")}-${String(payrollOrders.length + 1).padStart(3, "0")}`, driverId: lines[0].driverId, driverName: lines[0].driverName, sourceIds: lines.map((line) => line.sourceId), lines, totalAmount: lines.reduce((sum, line) => sum + line.amount, 0), status: "draft", createdAt: nowText() });
    });
    selectedPayrollIds.clear();
    saveRecords();
    render();
  }

  function confirmOrder(orderId) {
    const order = orders.find((item) => item.id === orderId);
    if (!order || order.documentStatus !== "draft") return;
    order.documentStatus = "confirmed";
    order.reconciliationStatus = "confirmed";
    order.confirmedAt = nowText();
    saveRecords();
    render();
  }

  function openOrderDetail(orderId) {
    const order = orders.find((item) => item.id === orderId);
    if (!order) return;
    activeOrderId = order.id;
    const totals = orderTotals(order);
    document.querySelector("#settlementDetailTitle").textContent = order.type === "receivable" ? "应收结算单" : "外调运费结算单";
    document.querySelector("#settlementDetailSubtitle").textContent = `${order.id} · 对账单 ${order.statementNo}`;
    document.querySelector("#settlementDetailBody").innerHTML = `<section class="settlement-detail-summary"><div><span>结算对象</span><strong>${escapeHtml(order.counterparty)}</strong></div><div><span>结算金额</span><strong>${money(order.totalAmount)}</strong></div><div><span>对账状态</span><strong>${order.reconciliationStatus === "confirmed" ? "已确认" : "已生成"}</strong></div><div><span>发票状态</span><strong>${totals.invoiceStatus}</strong></div><div><span>资金状态</span><strong>${totals.paymentStatus}</strong></div><div><span>生成时间</span><strong>${escapeHtml(order.createdAt)}</strong></div></section><section class="settlement-statement"><div><strong>对账单 ${escapeHtml(order.statementNo)}</strong><span>系统随结算单自动生成，确认后冻结当前运单及金额快照。</span></div></section><section class="driver-form-section"><h3>来源运单</h3><div class="table-wrap"><table class="fixed-action-table"><thead><tr><th>运单号</th><th>项目</th><th>线路</th><th>车辆 / 司机</th><th>金额</th></tr></thead><tbody>${(order.lines || []).map((line) => `<tr><td>${escapeHtml(line.waybillNo)}</td><td>${escapeHtml(line.projectName)}</td><td>${escapeHtml(line.routeName)}</td><td>${escapeHtml(line.vehicleNo)} / ${escapeHtml(line.driverName)}</td><td class="finance-money-cell">${money(line.amount)}</td></tr>`).join("")}</tbody></table></div></section>`;
    document.querySelector("#confirmSettlementOrder").hidden = order.documentStatus !== "draft";
    document.querySelector("#openSettlementTransaction").disabled = order.documentStatus !== "confirmed";
    document.querySelector("#settlementDetailDialog").showModal();
    window.lucide?.createIcons();
  }

  function openTransactionDialog() {
    const order = orders.find((item) => item.id === activeOrderId);
    if (!order || order.documentStatus !== "confirmed") return;
    const form = document.querySelector("#settlementTransactionForm");
    form.reset();
    form.elements.recordDate.value = today();
    form.elements.recordType.innerHTML = order.type === "receivable" ? '<option value="invoice">销项发票</option><option value="payment">收款</option>' : '<option value="invoice">进项发票</option><option value="payment">付款</option>';
    document.querySelector("#settlementTransactionSubtitle").textContent = `${order.id} · ${order.counterparty} · ${money(order.totalAmount)}`;
    document.querySelector("#settlementDetailDialog").close();
    document.querySelector("#settlementTransactionDialog").showModal();
  }

  function saveTransaction(event) {
    event.preventDefault();
    const order = orders.find((item) => item.id === activeOrderId);
    if (!order) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const recordType = String(data.get("recordType"));
    const totals = orderTotals(order);
    const amount = number(data.get("amount"));
    const recorded = recordType === "invoice" ? totals.invoiceAmount : totals.paymentAmount;
    if (amount <= 0 || recorded + amount > number(order.totalAmount) + 0.005) {
      form.elements.amount.setCustomValidity(`登记金额不能超过剩余金额 ${money(order.totalAmount - recorded)}`);
      form.elements.amount.reportValidity();
      return;
    }
    form.elements.amount.setCustomValidity("");
    const record = { id: `JL-${Date.now()}`, recordDate: String(data.get("recordDate")), amount, referenceNo: String(data.get("referenceNo") || "").trim(), remark: String(data.get("remark") || "").trim(), createdBy: "系统管理员", createdAt: nowText() };
    if (recordType === "invoice") order.invoiceRecords.push(record); else order.paymentRecords.push(record);
    saveRecords();
    document.querySelector("#settlementTransactionDialog").close();
    activeTab = "transactions";
    render();
  }

  function switchTab(tab) {
    activeTab = tab;
    document.querySelectorAll("[data-settlement-tab]").forEach((button) => {
      const active = button.dataset.settlementTab === tab;
      button.classList.toggle("active", active);
      button.setAttribute("aria-selected", String(active));
    });
    document.querySelectorAll("[data-settlement-panel]").forEach((panel) => {
      const active = panel.dataset.settlementPanel === tab;
      panel.classList.toggle("active", active);
      panel.hidden = !active;
    });
  }

  function render() {
    populateProjectFilter();
    renderSummary();
    renderPending();
    renderOrders();
    renderPayroll();
    renderTransactions();
    switchTab(activeTab);
    window.lucide?.createIcons();
  }

  document.querySelectorAll("[data-settlement-tab]").forEach((button) => button.addEventListener("click", () => switchTab(button.dataset.settlementTab)));
  document.querySelector("#settlementPendingQuery")?.addEventListener("input", () => { selectedSourceIds.clear(); renderPending(); });
  document.querySelector("#settlementPendingBody")?.addEventListener("change", (event) => {
    if (!event.target.matches(".settlement-source-check")) return;
    if (event.target.checked) selectedSourceIds.add(event.target.value); else selectedSourceIds.delete(event.target.value);
    renderPending();
  });
  document.querySelector("#settlementPendingCheckAll")?.addEventListener("change", (event) => {
    filteredPendingRows().forEach((row) => event.target.checked ? selectedSourceIds.add(row.sourceId) : selectedSourceIds.delete(row.sourceId));
    renderPending();
  });
  document.querySelector("#settlementSelectAll")?.addEventListener("click", () => { filteredPendingRows().forEach((row) => selectedSourceIds.add(row.sourceId)); renderPending(); });
  document.querySelector("#createSettlementOrder")?.addEventListener("click", createSettlementOrders);
  document.querySelector("#settlementOrderBody")?.addEventListener("click", (event) => {
    const view = event.target.closest("[data-settlement-view]");
    const confirm = event.target.closest("[data-settlement-confirm]");
    if (view) openOrderDetail(view.dataset.settlementView);
    if (confirm) confirmOrder(confirm.dataset.settlementConfirm);
  });
  document.querySelector("#closeSettlementDetail")?.addEventListener("click", () => document.querySelector("#settlementDetailDialog").close());
  document.querySelector("#confirmSettlementOrder")?.addEventListener("click", () => { confirmOrder(activeOrderId); document.querySelector("#settlementDetailDialog").close(); });
  document.querySelector("#openSettlementTransaction")?.addEventListener("click", openTransactionDialog);
  document.querySelector("#closeSettlementTransaction")?.addEventListener("click", () => document.querySelector("#settlementTransactionDialog").close());
  document.querySelector("#cancelSettlementTransaction")?.addEventListener("click", () => document.querySelector("#settlementTransactionDialog").close());
  document.querySelector("#settlementTransactionForm")?.addEventListener("submit", saveTransaction);
  document.querySelector("#settlementTransactionForm")?.elements.amount.addEventListener("input", (event) => event.target.setCustomValidity(""));
  document.querySelector("#payrollPendingBody")?.addEventListener("change", (event) => {
    if (!event.target.matches(".payroll-source-check")) return;
    if (event.target.checked) selectedPayrollIds.add(event.target.value); else selectedPayrollIds.delete(event.target.value);
    renderPayroll();
  });
  document.querySelector("#payrollCheckAll")?.addEventListener("change", (event) => { payrollSourceRows().forEach((row) => event.target.checked ? selectedPayrollIds.add(row.sourceId) : selectedPayrollIds.delete(row.sourceId)); renderPayroll(); });
  document.querySelector("#createPayrollOrders")?.addEventListener("click", createPayrollOrders);
  document.querySelector("#payrollOrderBody")?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-payroll-action]");
    if (!button) return;
    const order = payrollOrders.find((item) => item.id === button.dataset.payrollId);
    if (!order) return;
    order.status = button.dataset.payrollAction === "confirm" ? "confirmed" : "paid";
    if (order.status === "paid") order.paidAt = nowText();
    saveRecords();
    render();
  });
  window.addEventListener("storage", (event) => {
    if (![ORDER_STORAGE_KEY, PAYROLL_STORAGE_KEY].includes(event.key)) return;
    orders = loadRecords(ORDER_STORAGE_KEY);
    payrollOrders = loadRecords(PAYROLL_STORAGE_KEY);
    render();
  });

  window.SettlementManager = { render, completedSettlementRows, payrollSourceRows, orderTotals };
})();
