(function settlementRulesModule(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.SettlementRules = api;
})(typeof window !== "undefined" ? window : globalThis, function createSettlementRules() {
  const number = (value) => Number.isFinite(Number(value)) ? Number(value) : 0;
  const roundMoney = (value) => Math.round((number(value) + Number.EPSILON) * 100) / 100;
  const isPositiveMoney = (value) => roundMoney(value) > 0;

  function isClosedPayrollMonth(month, asOfDate = new Date().toISOString().slice(0, 10)) {
    const normalizedMonth = String(month || "");
    return /^\d{4}-(0[1-9]|1[0-2])$/.test(normalizedMonth)
      && normalizedMonth < String(asOfDate || "").slice(0, 7);
  }

  function nextDocumentNumber(existingValues, prefix, width = 3) {
    const escapedPrefix = String(prefix).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pattern = new RegExp(`^${escapedPrefix}(\\d+)$`);
    const maximum = (existingValues || []).reduce((current, value) => {
      const matched = String(value || "").match(pattern);
      return matched ? Math.max(current, number(matched[1])) : current;
    }, 0);
    return `${prefix}${String(maximum + 1).padStart(width, "0")}`;
  }

  function orderTotals(order) {
    const invoiceRecords = Array.isArray(order?.invoiceRecords) ? order.invoiceRecords : [];
    const paymentRecords = Array.isArray(order?.paymentRecords) ? order.paymentRecords : [];
    const receivable = order?.type === "receivable";
    const totalAmount = number(order?.totalAmount);
    const invoiceAmount = roundMoney(invoiceRecords.reduce((sum, record) => sum + number(record.amount), 0));
    const paymentAmount = roundMoney(paymentRecords.reduce((sum, record) => sum + number(record.amount), 0));
    const status = (amount, completed, pending, partial) => amount >= totalAmount - 0.005 && totalAmount > 0 ? completed : amount > 0 ? partial : pending;
    return {
      invoiceAmount,
      paymentAmount,
      invoiceOutstanding: roundMoney(Math.max(0, totalAmount - invoiceAmount)),
      paymentOutstanding: roundMoney(Math.max(0, totalAmount - paymentAmount)),
      invoiceStatus: status(invoiceAmount, receivable ? "已开票" : "已收票", receivable ? "未开票" : "未收票", receivable ? "部分开票（历史）" : "部分收票（历史）"),
      paymentStatus: status(paymentAmount, receivable ? "已收款" : "已付款", receivable ? "未收款" : "未付款", receivable ? "部分收款（历史）" : "部分付款（历史）"),
    };
  }

  function dashboardMetrics({ pendingReceivables = [], pendingPayables = [], pendingPayroll = [], orders = [], abnormalFees = [], energyLedger = [] } = {}) {
    const sum = (rows, key = "amount") => roundMoney(rows.reduce((total, row) => total + number(row?.[key]), 0));
    const confirmed = orders.filter((order) => order.documentStatus === "confirmed");
    const generated = orders.filter((order) => order.documentStatus === "generated");
    const receivableOrders = (rows) => rows.filter((order) => order.type === "receivable");
    const payableOrders = (rows) => rows.filter((order) => order.type === "payable");
    const missing = (rows, key) => rows.filter((order) => !(Array.isArray(order[key]) && order[key].length));
    const abnormalEntries = abnormalFees.flatMap((fee) => (fee.entries || []).filter((entry) => !entry.settlementOrderId));
    const pendingEnergy = energyLedger.filter((item) => item.businessType === "consumption" && item.status !== "allocated");
    const amountOf = (rows) => sum(rows, "totalAmount");
    const receivableInvoices = missing(receivableOrders(confirmed), "invoiceRecords");
    const payableInvoices = missing(payableOrders(confirmed), "invoiceRecords");
    const receivablePayments = missing(receivableOrders(confirmed), "paymentRecords");
    const payablePayments = missing(payableOrders(confirmed), "paymentRecords");
    return {
      pendingReceivables: { count: pendingReceivables.length, amount: sum(pendingReceivables) },
      pendingPayables: { count: pendingPayables.length, amount: sum(pendingPayables) },
      pendingPayroll: { count: pendingPayroll.length, amount: sum(pendingPayroll) },
      awaitingConfirmation: { count: generated.length, amount: amountOf(generated) },
      receivableConfirmation: { count: receivableOrders(generated).length, amount: amountOf(receivableOrders(generated)) },
      payableConfirmation: { count: payableOrders(generated).length, amount: amountOf(payableOrders(generated)) },
      receivableInvoices: { count: receivableInvoices.length, amount: amountOf(receivableInvoices) },
      payableInvoices: { count: payableInvoices.length, amount: amountOf(payableInvoices) },
      receivablePayments: { count: receivablePayments.length, amount: amountOf(receivablePayments) },
      payablePayments: { count: payablePayments.length, amount: amountOf(payablePayments) },
      abnormalEntries: { count: abnormalEntries.length, amount: sum(abnormalEntries) },
      pendingEnergy: { count: pendingEnergy.length, amount: sum(pendingEnergy) },
      confirmedOrders: confirmed,
    };
  }

  function validateFullTransaction(order, recordType, amount) {
    if (!order || order.documentStatus !== "confirmed") return { ok: false, message: "财务确认后才允许登记发票和收付款。" };
    if (!["invoice", "payment"].includes(recordType)) return { ok: false, message: "请选择正确的业务类型。" };
    const records = recordType === "invoice" ? order.invoiceRecords : order.paymentRecords;
    if (Array.isArray(records) && records.length) return { ok: false, message: "该业务已全额登记，不能重复登记。" };
    if (Math.abs(number(amount) - number(order.totalAmount)) > 0.005) return { ok: false, message: "暂不支持部分登记，金额必须等于结算单总额。" };
    return { ok: true };
  }

  function createAbnormalFee(input, context = {}) {
    const receivableAmount = roundMoney(Math.max(0, number(input.receivableAmount)));
    const payableAmount = roundMoney(Math.max(0, number(input.payableAmount)));
    if (!input.waybillNo || (!receivableAmount && !payableAmount)) throw new Error("异常费用必须关联运单并填写至少一项金额。");
    const id = input.id || `YC-${context.timestamp || Date.now()}`;
    const common = {
      id,
      waybillNo: String(input.waybillNo),
      feeType: String(input.feeType || "其他费用"),
      remark: String(input.remark || ""),
      createdAt: context.createdAt || "",
      createdBy: context.createdBy || "系统管理员",
      locked: false,
    };
    return {
      ...common,
      receivableAmount,
      payableAmount,
      entries: [
        receivableAmount ? { sourceId: `abnormal:receivable:${id}`, direction: "receivable", amount: receivableAmount } : null,
        payableAmount ? { sourceId: `abnormal:payable:${id}`, direction: "payable", amount: payableAmount } : null,
      ].filter(Boolean),
    };
  }

  function allocateEnergyConsumption(input, completedTrips, context = {}) {
    const amount = roundMoney(Math.max(0, number(input.amount)));
    const asOfMonth = String(context.asOfDate || new Date().toISOString().slice(0, 10)).slice(0, 7);
    if (!input.month || String(input.month) >= asOfMonth) {
      return { status: "pending", pendingReason: "month-open", tripCount: 0, allocations: [], allocatedAmount: 0 };
    }
    const trips = (completedTrips || []).filter((trip) => trip.vehicleNo === input.vehicleNo && String(trip.completedAt || "").slice(0, 7) === input.month);
    if (!trips.length) return { status: "pending", pendingReason: "no-completed-trips", tripCount: 0, allocations: [], allocatedAmount: 0 };
    const baseCents = Math.floor(Math.round(amount * 100) / trips.length);
    let remainingCents = Math.round(amount * 100);
    const allocations = trips.map((trip, index) => {
      const cents = index === trips.length - 1 ? remainingCents : baseCents;
      remainingCents -= cents;
      return { waybillNo: trip.waybillNo, amount: cents / 100 };
    });
    return { status: "allocated", pendingReason: "", tripCount: trips.length, allocations, allocatedAmount: amount };
  }

  function calculatePayroll(input) {
    const baseSalary = roundMoney(input.baseSalary);
    const safetyBonus = roundMoney(input.safetyBonus ?? input.attendanceBonus);
    const attendanceDeduction = roundMoney(input.attendanceDeduction);
    const assessmentPenalty = roundMoney(input.assessmentPenalty);
    const allowance = roundMoney(input.allowance);
    const transportPerformance = roundMoney(input.transportPerformance ?? input.tripCommission);
    const reward = roundMoney(input.reward);
    const reimbursement = roundMoney(input.reimbursement);
    const serviceFee = roundMoney(input.serviceFee);
    const insuranceFee = roundMoney(input.insuranceFee);
    const personalSocialSecurity = roundMoney(input.personalSocialSecurity);
    const otherDeduction = roundMoney(input.otherDeduction);
    const companySocialSecurity = roundMoney(input.companySocialSecurity);
    const grossAmount = roundMoney(baseSalary + safetyBonus + allowance + transportPerformance + reward + reimbursement);
    const deductionAmount = roundMoney(attendanceDeduction + assessmentPenalty + serviceFee + insuranceFee + personalSocialSecurity + otherDeduction);
    const netAmount = roundMoney(grossAmount - deductionAmount);
    const companyCost = roundMoney(grossAmount + companySocialSecurity);
    return {
      attendanceDays: Math.max(0, number(input.attendanceDays)),
      baseSalary,
      safetyBonus,
      attendanceBonus: safetyBonus,
      attendanceDeduction,
      assessmentPenalty,
      allowance,
      transportPerformance,
      tripCommission: transportPerformance,
      reward,
      reimbursement,
      serviceFee,
      insuranceFee,
      personalSocialSecurity,
      otherDeduction,
      companySocialSecurity,
      grossAmount,
      deductionAmount,
      netAmount,
      companyCost,
    };
  }

  function allocateAmountByLines(amount, lines) {
    const rows = Array.isArray(lines) ? lines : [];
    if (!rows.length) return [];
    const cents = Math.round(number(amount) * 100);
    const base = Math.floor(cents / rows.length);
    let remaining = cents;
    return rows.map((line, index) => {
      const current = index === rows.length - 1 ? remaining : base;
      remaining -= current;
      return { waybillNo: line.waybillNo, amount: current / 100 };
    });
  }

  return { number, roundMoney, isPositiveMoney, isClosedPayrollMonth, nextDocumentNumber, orderTotals, dashboardMetrics, validateFullTransaction, createAbnormalFee, allocateEnergyConsumption, calculatePayroll, allocateAmountByLines };
});
