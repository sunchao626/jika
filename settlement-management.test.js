const assert = require("node:assert/strict");
const fs = require("node:fs");

const html = fs.readFileSync("index.html", "utf8");
const app = fs.readFileSync("app.js", "utf8");
const settlement = fs.readFileSync("settlement-management.js", "utf8");
const access = fs.readFileSync("user-access.js", "utf8");

assert.match(html, /data-page="settlement-management"[^>]*>结算管理/);
assert.match(html, /id="settlementPage"/);
assert.match(app, /"settlement-management": \{ title: "结算管理"/);
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
assert.match(settlement, /vehicle\?\.ownership !== "外协"/);
assert.match(settlement, /statementNo:/);
assert.match(settlement, /销项发票/);
assert.match(settlement, /进项发票/);
assert.match(settlement, /payrollSourceRows/);
assert.match(settlement, /selectedSourceIds/);
assert.match(settlement, /settledSourceIds/);
assert.match(settlement, /data-settlement-summary/);
assert.match(settlement, /function activateSummary/);
assert.match(settlement, /activeOrderFilter/);
assert.match(html, /data-settlement-order-filter="receivable-unpaid"/);
assert.match(html, /class="settlement-order-no-col"/);
assert.match(html, /class="settlement-waybill-col"/);
assert.match(access, /id: "settlements", name: "结算管理"/);

console.log("Settlement management contract test passed");
