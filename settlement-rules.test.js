const assert = require("node:assert/strict");
const rules = require("./settlement-rules.js");

const order = { type: "receivable", totalAmount: 1200, documentStatus: "confirmed", invoiceRecords: [], paymentRecords: [] };
assert.equal(rules.isPositiveMoney(0), false);
assert.equal(rules.isPositiveMoney(0.004), false);
assert.equal(rules.isPositiveMoney(0.01), true);
assert.equal(rules.isClosedPayrollMonth("2026-09", "2026-10-01"), true);
assert.equal(rules.isClosedPayrollMonth("2026-10", "2026-10-31"), false);
assert.equal(rules.isClosedPayrollMonth("2026-13", "2027-01-01"), false);
assert.equal(rules.isClosedPayrollMonth("2026-12", "2027-01-01"), true);
assert.equal(rules.validateFullTransaction(order, "invoice", 1200).ok, true);
assert.equal(rules.validateFullTransaction(order, "invoice", 600).ok, false);
assert.equal(rules.validateFullTransaction({ ...order, invoiceRecords: [{ id: "1" }] }, "invoice", 1200).ok, false);
assert.equal(rules.orderTotals({ ...order, invoiceRecords: [{ id: "1", amount: 1200 }] }).invoiceStatus, "已开票");
assert.equal(rules.orderTotals({ ...order, invoiceRecords: [{ id: "1", amount: 300 }] }).invoiceStatus, "部分开票（历史）");
assert.equal(rules.orderTotals({ ...order, invoiceRecords: [{ id: "1", amount: 300 }] }).invoiceOutstanding, 900);

const dashboard = rules.dashboardMetrics({
  pendingReceivables: [{ amount: 120 }, { amount: 80 }],
  pendingPayables: [{ amount: 60 }],
  pendingPayroll: [{ amount: 90 }],
  orders: [
    { type: "receivable", documentStatus: "generated", totalAmount: 300, invoiceRecords: [], paymentRecords: [] },
    { type: "payable", documentStatus: "generated", totalAmount: 200, invoiceRecords: [], paymentRecords: [] },
    { type: "receivable", documentStatus: "confirmed", totalAmount: 500, invoiceRecords: [], paymentRecords: [] },
    { type: "payable", documentStatus: "confirmed", totalAmount: 400, invoiceRecords: [{ id: "invoice" }], paymentRecords: [] },
    { type: "receivable", documentStatus: "confirmed", totalAmount: 700, invoiceRecords: [{ id: "invoice" }], paymentRecords: [{ id: "payment" }] },
  ],
  abnormalFees: [{ entries: [{ direction: "receivable", amount: 25 }, { direction: "payable", amount: 30, settlementOrderId: "JS-1" }] }],
  energyLedger: [
    { businessType: "consumption", status: "pending", amount: 45 },
    { businessType: "consumption", status: "allocated", amount: 70 },
    { businessType: "recharge", status: "posted", amount: 100 },
  ],
});
assert.deepEqual(dashboard.pendingReceivables, { count: 2, amount: 200 });
assert.deepEqual(dashboard.pendingPayables, { count: 1, amount: 60 });
assert.deepEqual(dashboard.pendingPayroll, { count: 1, amount: 90 });
assert.deepEqual(dashboard.awaitingConfirmation, { count: 2, amount: 500 });
assert.deepEqual(dashboard.receivableConfirmation, { count: 1, amount: 300 });
assert.deepEqual(dashboard.payableConfirmation, { count: 1, amount: 200 });
assert.deepEqual(dashboard.receivableInvoices, { count: 1, amount: 500 });
assert.deepEqual(dashboard.payableInvoices, { count: 0, amount: 0 });
assert.deepEqual(dashboard.receivablePayments, { count: 1, amount: 500 });
assert.deepEqual(dashboard.payablePayments, { count: 1, amount: 400 });
assert.deepEqual(dashboard.abnormalEntries, { count: 1, amount: 25 });
assert.deepEqual(dashboard.pendingEnergy, { count: 1, amount: 45 });

const fee = rules.createAbnormalFee({ waybillNo: "WB-1", feeType: "提箱费", receivableAmount: 300, payableAmount: 260 }, { timestamp: 1 });
assert.equal(fee.entries.length, 2);
assert.equal(fee.entries[0].sourceId, "abnormal:receivable:YC-1");
assert.equal(fee.entries[1].amount, 260);

assert.equal(rules.nextDocumentNumber(["JS-001", "JS-003"], "JS-"), "JS-004");

const allocation = rules.allocateEnergyConsumption({ vehicleNo: "沪A1", month: "2026-10", amount: 100 }, [
  { vehicleNo: "沪A1", completedAt: "2026-10-01", waybillNo: "WB1" },
  { vehicleNo: "沪A1", completedAt: "2026-10-20", waybillNo: "WB2" },
  { vehicleNo: "沪A1", completedAt: "2026-09-20", waybillNo: "WB3" },
], { asOfDate: "2026-11-01" });
assert.deepEqual(allocation.allocations.map((item) => item.amount), [50, 50]);
assert.equal(rules.allocateEnergyConsumption({ vehicleNo: "沪A2", month: "2026-10", amount: 100 }, [], { asOfDate: "2026-10-21" }).pendingReason, "month-open");
assert.equal(rules.allocateEnergyConsumption({ vehicleNo: "沪A2", month: "2026-10", amount: 100 }, [], { asOfDate: "2026-11-01" }).pendingReason, "no-completed-trips");

const payroll = rules.calculatePayroll({ baseSalary: 3000, transportPerformance: 1200, safetyBonus: 200, allowance: 300, attendanceDeduction: 100, assessmentPenalty: 50, serviceFee: 20, insuranceFee: 30, personalSocialSecurity: 400, companySocialSecurity: 800 });
assert.equal(payroll.grossAmount, 4700);
assert.equal(payroll.deductionAmount, 600);
assert.equal(payroll.netAmount, 4100);
assert.equal(payroll.companyCost, 5500);

console.log("Settlement rules tests passed");
