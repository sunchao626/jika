const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

const app = fs.readFileSync("app.js", "utf8");
const html = fs.readFileSync("index.html", "utf8");
const start = app.indexOf("function renderDispatchCapacityProgress(");
const end = app.indexOf("function renderDispatchRows(", start);
assert.ok(start >= 0 && end > start, "dispatch capacity progress renderer must exist");

const context = vm.createContext({
  dashboardEscape: (value) => String(value),
  getDashboardTaskMeta: (dispatch) => ({
    taskType: dispatch.taskType || "提空装货",
    nodes: ["节点一", "节点二", "节点三", "节点四"],
    currentIndex: dispatch.progress === 100 ? 3 : dispatch.progress === 75 ? 2 : -1,
    completedCount: dispatch.progress === 100 ? 4 : dispatch.progress === 75 ? 3 : 0,
    stage: dispatch.progress === 100 ? "节点四" : dispatch.progress === 75 ? "节点三" : "待开始",
    progress: dispatch.progress || 0,
    nearComplete: dispatch.progress === 75,
    exceptionReason: "",
  }),
});
vm.runInContext(app.slice(start, end), context);

const nearComplete = context.renderDispatchCapacityProgress({ status: "运输中", progress: 75 });
assert.match(nearComplete, /near-complete/);
assert.match(nearComplete, /75% · 快完成/);
assert.match(nearComplete, /3 \/ 4 节点/);

const completed = context.renderDispatchCapacityProgress({ status: "已完成", progress: 100 });
assert.match(completed, /completed/);
assert.equal((completed.match(/capacity-node-block completed/g) || []).length, 4);

const pending = context.renderDispatchCapacityProgress({ status: "待派单", progress: 0 });
assert.match(pending, /0% · 待开始/);

const cancelled = context.renderDispatchCapacityProgress({ status: "取消", progress: 0 });
assert.match(cancelled, /已取消/);
assert.match(cancelled, /不计入进度/);

assert.match(html, /<th>计划靠台时间<\/th><th>任务类型<\/th><th>运单状态<\/th><th>运输节点<\/th><th>客户项目 \/ 线路名称<\/th>/);
assert.match(html, /<th>派单时间<\/th><th>实际靠台时间<\/th>/);
const dispatchRowsStart = app.indexOf("function renderDispatchRows(");
const dispatchRowsEnd = app.indexOf("function getActualBerthingTime(", dispatchRowsStart);
const dispatchRowsRenderer = app.slice(dispatchRowsStart, dispatchRowsEnd);
assert.match(dispatchRowsRenderer, /dispatch\.customerName, dispatch\.projectName/);
assert.match(dispatchRowsRenderer, /getActualBerthingTime\(dispatch\)/);
assert.match(dispatchRowsRenderer, /getDispatchCurrentTransportNode\(dispatch\)/);
assert.doesNotMatch(dispatchRowsRenderer, /<td><span class="dispatch-node">\$\{dispatch\.currentNode\}<\/span><\/td>/);
assert.doesNotMatch(dispatchRowsRenderer, /dispatch\.waybillNo|dispatch\.planTaskNo|dispatch\.dispatchMode|dispatch\.vehicleType/);
assert.match(dispatchRowsRenderer, /capacityOwnershipSnapshot/);
assert.match(app, /colspan="13"/);

const actualBerthingStart = app.indexOf("function getActualBerthingTime(");
const actualBerthingEnd = app.indexOf("function renderDispatchPagination(", actualBerthingStart);
const actualBerthingContext = vm.createContext({});
vm.runInContext(app.slice(actualBerthingStart, actualBerthingEnd), actualBerthingContext);
assert.equal(actualBerthingContext.getActualBerthingTime({ actualBerthingTime: "2026-09-18 08:30", timeline: [] }), "2026-09-18 08:30");
assert.equal(actualBerthingContext.getActualBerthingTime({ timeline: [{ node: "重箱进站", time: "2026-09-18 08:45" }] }), "2026-09-18 08:45");
assert.equal(actualBerthingContext.getActualBerthingTime({ timeline: [{ node: "在途", time: "2026-09-18 08:45" }] }), "");

const currentNodeStart = app.indexOf("function getDispatchCurrentTransportNode(");
const currentNodeEnd = app.indexOf("function getActualBerthingTime(", currentNodeStart);
const currentNodeContext = vm.createContext({});
vm.runInContext(app.slice(currentNodeStart, currentNodeEnd), currentNodeContext);
assert.equal(currentNodeContext.getDispatchCurrentTransportNode({ status: "运输中", currentNode: "重箱在途", timeline: [{ node: "已提重" }] }), "重箱在途");
assert.equal(currentNodeContext.getDispatchCurrentTransportNode({ status: "运输中", currentNode: "待派单", timeline: [{ node: "已派单" }, { node: "已提重" }] }), "已提重");
assert.equal(currentNodeContext.getDispatchCurrentTransportNode({ status: "已派单", currentNode: "待提货", timeline: [{ node: "已派单" }] }), "-");

console.log("Dispatch capacity progress test passed");
