const assert = require("assert");
const fs = require("fs");

const html = fs.readFileSync("index.html", "utf8");
const app = fs.readFileSync("app.js", "utf8");

assert.match(html, /<button class="nav-parent"[^>]*>[\s\S]*?数据看板[\s\S]*?data-page="finance-reports"[^>]*>运输成本台账/);
assert.match(app, /"finance-reports": \{ title: "运输成本台账", kicker: "数据看板 \/ 运输成本台账", view: "finance" \}/);
assert.match(html, /id="financePage"/);
assert.match(html, /id="financeReportBody"/);
assert.match(html, /id="financeExpenseDialog"/);
assert.match(html, /name="mileage"/);
[
  "接单时间", "客户", "项目", "路线", "运单号", "集装箱号", "箱型", "铅封号", "靠台时间", "提箱地", "装卸货地", "落箱地", "里程\(KM\)", "运输方式", "承运单位", "车号", "车型", "司机", "司机电话", "提箱时间", "完成时间", "结算方式",
].forEach((label) => assert.ok(html.includes(label), `missing report column: ${label}`));
[
  "fuel", "electricity", "gas", "toll", "parking", "vehicleOther", "taskShare", "subsidy", "insurance", "labor", "service",
].forEach((field) => assert.match(html, new RegExp(`name="${field}"`)));
assert.match(app, /FINANCE_EXPENSE_STORAGE_KEY/);
assert.match(app, /getFinanceRows/);
assert.match(app, /routeMileageSnapshot/);
assert.match(app, /saveFixedRoutes/);
assert.match(app, /data-finance-expense/);
assert.match(html, /保存费用/);

console.log("Finance report interaction contract test passed");
