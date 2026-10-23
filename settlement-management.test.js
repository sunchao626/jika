const assert = require("node:assert/strict");
const fs = require("node:fs");

const html = fs.readFileSync("index.html", "utf8");
const app = fs.readFileSync("app.js", "utf8");
const settlement = fs.readFileSync("settlement-management.js", "utf8");
const access = fs.readFileSync("user-access.js", "utf8");
const styles = fs.readFileSync("styles.css", "utf8");

assert.match(html, /data-page="settlement-management"[^>]*>结算管理/);
assert.match(html, /id="settlementPage"/);
assert.match(html, /id="settlementDashboard"/);
assert.doesNotMatch(html, /待处理事项|settlementDashboardTodos/);
assert.match(html, /id="settlementQuickLinks"/);
assert.match(html, /id="settlementPendingTransactionsBody"/);
assert.match(html, /data-settlement-order-filter="needs-confirmation"/);
assert.match(app, /"settlement-management": \{ title: "结算管理", kicker: "结算中心 \/ 结算管理"/);
for (const [page, title, module] of [
  ["settlement-receivable", "应收账款管理", "receivable"],
  ["settlement-payable", "三方应付结算", "payable"],
  ["settlement-payroll", "自营结算", "payroll"],
  ["settlement-abnormal", "异常费用管理", "abnormal"],
  ["settlement-transactions", "发票与收付款", "transactions"],
  ["settlement-energy", "预充值管理", "energy"],
]) {
  assert.match(html, new RegExp(`data-page="${page}"[^>]*>${title}<\\/button>`));
  assert.match(app, new RegExp(`"${page}": \\{ title: "${title}"[\\s\\S]*settlementModule: "${module}"`));
}
assert.match(app, /preferredNavigation/);
assert.match(app, /if \(meta\.view === "settlement"\) window\.SettlementManager\?\.openModule\?\.\(meta\.settlementModule \|\| "overview"\)/);
assert.match(settlement, /function openModule\(module = "overview"\)/);
assert.match(settlement, /overview: \{ title: "结算管理"[\s\S]*tabs: \[\] \}/);
assert.match(settlement, /receivable: \{ title: "应收账款管理"[\s\S]*tabs: \["pending", "orders"\]/);
assert.match(settlement, /payable: \{ title: "三方应付结算"[\s\S]*tabs: \["pending", "orders"\]/);
assert.match(settlement, /const initialModuleByRoute = \{[\s\S]*"settlement-receivable": "receivable"/);
assert.match(settlement, /if \(initialModuleByRoute\[selectedSettlementRoute\]\) openModule/);
assert.match(styles, /\.settlement-tabs\[hidden\][\s\S]*display: none !important/);

for (const field of [
  "thirdPartyEnabled",
  "thirdPartyCarrier",
  "thirdPartyPricingMethod",
  "thirdPartySettlementPrice",
  "thirdPartySettlementCycle",
  "thirdPartyInvoiceRequired",
]) assert.match(html, new RegExp(`name="${field}"`), `缺少线路三方结算字段 ${field}`);

assert.match(app, /thirdPartySettlementPriceSnapshot/);
assert.match(app, /function postApprovedDriverExpensesToFinance[\s\S]*financeExpenseRecords\[record\.waybillNo\]/);
assert.match(app, /result === "approved"[\s\S]*postApprovedDriverExpensesToFinance\(ids\)/);
assert.match(app, /record\.costPostedAt/);

assert.match(settlement, /dispatch\.status === "已完成"/);
assert.match(settlement, /if \(!rules\.isPositiveMoney\(amount\)\) return null/);
assert.match(settlement, /isClosedPayrollMonth\(payrollMonth, today\(\)\)/);
assert.match(settlement, /当月运单需在次月生成工资单/);
assert.match(settlement, /dispatch\.carrierTypeSnapshot/);
assert.match(settlement, /const statementNo = rules\.nextDocumentNumber/);
assert.match(settlement, /order\.driverId === lines\[0\]\.driverId && order\.payrollMonth === payrollMonth/);
assert.match(settlement, /selectedGroups\.has\(`\$\{row\.driverId\}:\$\{row\.payrollMonth\}`\)/);
for (const field of ["attendanceDays", "safetyBonus", "attendanceDeduction", "assessmentPenalty", "transportPerformance", "serviceFee", "insuranceFee", "bankAccount", "bankName"]) assert.ok(settlement.includes(field), `工资单缺少 ${field}`);
assert.match(settlement, /销项发票/);
assert.match(settlement, /进项发票/);
assert.match(settlement, /payrollSourceRows/);
assert.match(settlement, /function reconcileEnergyAllocations/);
assert.match(settlement, /removeEnergyAllocations\(item\)/);
assert.match(settlement, /selectedSourceIds/);
assert.match(settlement, /settledSourceIds/);
assert.match(settlement, /function openDashboardRoute/);
assert.match(settlement, /function renderPendingTransactions/);
assert.match(settlement, /order\.documentStatus !== "confirmed"/);
assert.match(settlement, /data-settlement-pending-transaction/);
assert.match(settlement, /rules\.dashboardMetrics/);
assert.match(settlement, /document\.querySelector\("#settlementDashboard"\)\.hidden = activeModule !== "overview"/);
assert.doesNotMatch(settlement, /settlementDashboardTodos|const todos = \[/);
for (const description of [
  "查看已完成运单的客户应收费用",
  "查看三方运力的应付结算费用",
  "核算已关闭月份的自营司机工资",
  "补录并跟踪异常应收、应付费用",
  "登记已确认结算单的发票和收付款",
  "管理能源预充值、消费及月度分摊",
  "查看和导出运输费用台账",
  "审核司机上报的运输费用及凭证",
]) assert.ok(settlement.includes(description), `快捷模块缺少用途说明：${description}`);
assert.match(styles, /\.settlement-module-link \{[^}]*display: flex/);
assert.match(styles, /\.settlement-module-link \.settlement-module-copy \{[^}]*flex: 1 1 0/);
assert.match(styles, /\.settlement-module-link strong \{[^}]*word-break: normal; overflow-wrap: break-word/);
assert.match(styles, /\.settlement-module-link small \{[^}]*word-break: normal; overflow-wrap: break-word/);
assert.match(html, /id="settlementPendingQuery"[\s\S]*name="startDate" type="date"[\s\S]*name="endDate" type="date"/);
for (const field of ["customerId", "projectId", "routeId", "taskType", "capacityOwnership", "vehicleNo", "driverId"]) assert.match(html, new RegExp(`id="settlementPendingQuery"[\\s\\S]*name="${field}"`));
assert.match(html, /id="settlementPendingQuery"[\s\S]*name="containerNo"/);
for (const id of ["settlementOrderContainerSearch", "payrollPendingContainerSearch", "payrollOrderContainerSearch", "abnormalFeeContainerSearch", "settlementTransactionContainerSearch"]) {
  assert.match(html, new RegExp(`id="${id}"`), `缺少集装箱号筛选框 ${id}`);
}
assert.match(settlement, /function matchesContainerNumber/);
assert.match(settlement, /record\.boxNo1[\s\S]*record\.boxNo2/);
assert.match(settlement, /matchesContainerNumber\(containerNo, row\)/);
assert.match(settlement, /matchesContainerNumber\(containerNo, \.\.\.\(order\.lines \|\| \[\]\)\)/);
assert.match(settlement, /boxNo1: containerNumberAt\(0, waybill, dispatch\)/);
assert.match(settlement, /boxNo2: containerNumberAt\(1, waybill, dispatch\)/);
assert.match(settlement, /row\.orderDate >= startDate/);
assert.match(settlement, /activeOrderFilter/);
for (const exportType of ["pending", "orders", "payroll-pending", "payroll-orders", "transactions"]) {
  assert.match(settlement, new RegExp(`data\\.settlementExport = type|data-settlement-export=\\"\\$\\{type\\}\\"`));
  assert.ok(settlement.includes(`\"${exportType}\"`), `缺少结算列表导出类型 ${exportType}`);
}
assert.match(settlement, /function exportSettlementList\(type\)/);
assert.match(settlement, /const dataset = exportDataset\(type\)/);
assert.match(settlement, /text\/csv;charset=utf-8/);
assert.match(settlement, /OperationLogManager\?\.record/);
assert.match(html, /data-settlement-order-filter="receivable-unpaid"/);
assert.match(html, /class="settlement-order-no-col"/);
assert.match(html, /class="settlement-waybill-col"/);
assert.match(access, /group: "结算中心", id: "settlements", name: "结算管理"/);

console.log("Settlement management contract test passed");
