const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

const html = fs.readFileSync("index.html", "utf8");
const app = fs.readFileSync("app.js", "utf8");

assert.match(html, /id="planOrderDate"[^>]*name="orderDate"|name="orderDate"[^>]*id="planOrderDate"/);
assert.match(html, /下单日期,计划执行日期/);

const context = vm.createContext({
  waybills: [],
  dispatches: [],
  fixedRoutes: [],
  routeAccountCatalog: [],
  waybillRouteMap: {},
  PLAN_TASK_TYPES: ["提空装货"],
  normalize: (value) => String(value || "").trim().toLowerCase(),
  getNextWaybillNo: () => "WB20260926001",
  createPendingDispatch(waybill) {
    context.dispatches.push({ waybillNo: waybill.waybillNo, orderDate: waybill.orderDate });
  },
  saveWaybills() {},
  window: {
    CustomerManager: { getActiveCustomerByName: () => ({ customerNo: "KH-001" }) },
    DispatchTaskNodes: { snapshot: (name) => ({ name, nodes: [] }) },
  },
});

const parserStart = app.indexOf("function parsePlanTaskCsvLine(");
const parserEnd = app.indexOf("function resolvePlanTaskRoute(", parserStart);
vm.runInContext(app.slice(parserStart, parserEnd), context);

const imported = context.parsePlanTaskCsv(
  "下单日期,计划执行日期,计划靠台时间,线路,柜型,客户名称,项目名称,任务类型,运单数量,箱号1,铅封号1,箱号2,铅封号2\n" +
  "2026-09-26,2026-09-28,2026-09-28 08:00,,40HQ,华贸,比亚迪,提空装货,1,,,,",
);
assert.equal(imported[0].orderDate, "2026-09-26");
assert.equal(imported[0].planExecutionDate, "2026-09-28");

const recordsStart = app.indexOf("function resolvePlanTaskRoute(");
const recordsEnd = app.indexOf("function updatePlanTaskRecords(", recordsStart);
vm.runInContext(app.slice(recordsStart, recordsEnd), context);

const result = context.createPlanTaskRecords(imported);
assert.equal(result.created.length, 1);
assert.equal(result.created[0].orderDate, "2026-09-26");
assert.equal(result.created[0].planExecutionDate, "2026-09-28");
assert.equal(result.created[0].entryDate, "2026-09-26");

context.getPlanTaskGroups = () => [{ id: result.created[0].planTaskId, canEdit: true, waybills: [result.created[0]] }];
context.getRouteStops = () => [{ value: "待维护" }, { value: "待维护" }, { value: "待维护" }, { value: "待维护" }];
context.getRouteAccount = () => null;
context.formatWaybillBoxes = () => "待装箱";
context.saveDispatches = () => {};
const updateStart = app.indexOf("function updatePlanTaskRecords(");
const updateEnd = app.indexOf("function refreshAfterPlanTaskCreate(", updateStart);
vm.runInContext(app.slice(updateStart, updateEnd), context);
assert.equal(context.updatePlanTaskRecords(result.created[0].planTaskId, {
  orderDate: "2026-09-25",
  planExecutionDate: "2026-09-29",
  customerName: "华贸",
  projectName: "比亚迪",
  taskType: "提空装货",
}, [{ routeValue: "", boxType: "40HQ", plannedBerthingTime: "2026-09-29T08:00" }]), true);
assert.equal(result.created[0].orderDate, "2026-09-25");
assert.equal(result.created[0].planExecutionDate, "2026-09-29");
assert.equal(context.dispatches[0].orderDate, "2026-09-25");
assert.equal(context.dispatches[0].planExecutionDate, "2026-09-29");

const legacy = context.createPlanTaskRecords([{
  planExecutionDate: "2026-09-30",
  plannedBerthingTime: "2026-09-30 09:00",
  customerName: "华贸",
  projectName: "比亚迪",
  taskType: "提空装货",
}]);
assert.equal(legacy.created[0].orderDate, "2026-09-30", "旧导入缺少下单日期时兼容计划执行日期");

console.log("Plan task order date test passed");
