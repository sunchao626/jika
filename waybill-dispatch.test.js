const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

const html = fs.readFileSync("index.html", "utf8");
const formStart = html.indexOf('id="waybillForm"');
const formEnd = html.indexOf("</form>", formStart);
const formHtml = html.slice(formStart, formEnd);
assert.doesNotMatch(formHtml, /派车信息|name="dispatchType"|name="carrier"|name="plateNo"|name="driverId"|name="dispatchDate"|name="arrived"|name="arrivalDate"/);
assert.match(formHtml, /name="routeId" id="waybillRouteSelect" required/);
assert.match(formHtml, /<span class="section-index">02<\/span>.*应收费用/);
assert.match(formHtml, /<span class="section-index">03<\/span>.*应付费用/);
assert.equal((formHtml.match(/<button type="button"/g) || []).length, 3, "section navigation should have three destinations");

const source = fs.readFileSync("app.js", "utf8");
const start = source.indexOf("function createPendingDispatch(");
const end = source.indexOf("let routeCurrentPage =", start);
assert.ok(start >= 0 && end > start);
const dispatches = [];
let saves = 0;
const context = vm.createContext({
  dispatches,
  saveDispatches() { saves++; },
  formatWaybillBoxes: () => "TCLU123 / 40HQ",
  calculateRouteCommission: () => 420,
  Date: class extends Date { static now() { return 1000; } },
});
vm.runInContext(source.slice(start, end), context);
const waybill = {
  waybillNo: "WB20260921001", orderDate: "2026-09-21", loadAddress: "港区 / 仓库",
  boxNo1: "TCLU123", boxNo2: "-", boxType: "40HQ", receivable: 2800,
};
const route = { id: "XL-001", routeName: "港区线路", origin: "港区", destination: "仓库", estimatedRevenue: 2900 };
const pending = context.createPendingDispatch(waybill, route);
assert.equal(saves, 1);
assert.equal(dispatches[0], pending);
assert.equal(pending.status, "待派单");
assert.equal(pending.dispatchMode, "pending");
assert.equal(pending.routeId, "XL-001");
assert.equal(pending.estimatedRevenue, 2900);
assert.equal(pending.commission, 420);
assert.equal(pending.driverId, "");
assert.equal(pending.vehicleId, "");
assert.equal(pending.pushed, false);
assert.equal(pending.timeline.length, 0);
const noRoute = context.createPendingDispatch({ ...waybill, waybillNo: "WB20260921002" }, null);
assert.equal(noRoute.routeName, "未指定线路");
assert.equal(noRoute.estimatedRevenue, 2800);
assert.match(source, /const pending = dispatches\.find\(\(item\) => item\.waybillNo === waybill\.waybillNo && item\.status === "待派单"\);\s*const savedDispatch = pending \|\| \{ id: `PD-\$\{Date\.now\(\)\}`, \.\.\.assigned \};\s*if \(pending\) Object\.assign\(pending, assigned\);\s*else dispatches\.unshift\(savedDispatch\)/);
assert.match(source, /DispatchOperationLog\?\.record\(savedDispatch, \{[\s\S]*?action: "创建并推送派单"[\s\S]*?changes: \[/);
assert.match(source, /saveWaybills\(\);\s*createPendingDispatch\(newWaybill, route\)/);
console.log("Waybill to pending dispatch test passed");
