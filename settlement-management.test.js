const assert = require("node:assert/strict");
const fs = require("node:fs");

const html = fs.readFileSync("index.html", "utf8");
const app = fs.readFileSync("app.js", "utf8");
const settlement = fs.readFileSync("settlement-management.js", "utf8");
const access = fs.readFileSync("user-access.js", "utf8");

assert.match(html, /data-page="settlement-management"[^>]*>结算中心/);
assert.match(html, /id="settlementPage"/);
assert.match(app, /"settlement-management": \{ title: "结算中心", kicker: "结算管理 \/ 结算中心"/);
assert.match(app, /if \(meta\.view === "settlement"\) window\.SettlementManager\?\.render\(\)/);

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
assert.match(settlement, /dispatch\.carrierTypeSnapshot/);
assert.match(settlement, /statementNo:/);
assert.match(settlement, /销项发票/);
assert.match(settlement, /进项发票/);
assert.match(settlement, /payrollSourceRows/);
assert.match(settlement, /selectedSourceIds/);
assert.match(settlement, /settledSourceIds/);
assert.match(settlement, /data-settlement-summary/);
assert.match(settlement, /function activateSummary/);
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
assert.match(access, /group: "结算管理", id: "settlements", name: "结算中心"/);

console.log("Settlement management contract test passed");
