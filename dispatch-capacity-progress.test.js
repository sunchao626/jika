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

assert.match(html, /<th>任务类型<\/th><th class="dispatch-capacity-column">运力状态<\/th><th>派单方式<\/th>/);
assert.match(app, /<td>\$\{dispatch\.taskType \|\| "-"\}<\/td><td class="dispatch-capacity-cell">\$\{CapacityOwnership\.badgeMarkup\(dispatch\.capacityOwnershipSnapshot, dispatch\.capacityOwnershipTooltipSnapshot\)\}\$\{renderDispatchCapacityProgress\(dispatch\)\}<\/td><td><span class="dispatch-mode/);
assert.match(app, /colspan="17"/);

console.log("Dispatch capacity progress test passed");
