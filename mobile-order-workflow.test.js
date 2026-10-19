const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

const source = fs.readFileSync("mobile.js", "utf8");
const markup = fs.readFileSync("mobile.html", "utf8");
const dispatches = [
  { id: "pending", driverId: "D1", status: "已派单", waybillNo: "WB-1", currentNode: "待提货" },
  { id: "active", driverId: "D1", status: "运输中", waybillNo: "WB-2", currentNode: "已接单" },
  { id: "completed", driverId: "D1", status: "已完成", waybillNo: "WB-3", currentNode: "已送达" },
  { id: "cancelled", driverId: "D1", status: "取消", waybillNo: "WB-4", currentNode: "已拒绝" },
];
const state = { dispatches, currentDriverId: "D1", orderSearch: "", orderFilter: "all", orderStage: "all" };
const list = { innerHTML: "" };
const context = vm.createContext({
  state,
  dispatchCategory: (dispatch) => {
    if (dispatch.status === "已派单") return "pending";
    if (dispatch.status === "已完成") return "completed";
    if (dispatch.currentNode === "已拒绝" || dispatch.status === "取消") return "cancelled";
    return "active";
  },
  driverDispatches: () => state.dispatches.filter((dispatch) => dispatch.driverId === state.currentDriverId),
  dispatchTaskType: () => "提空装货",
  isTaskAwaitingStart: () => false,
  isTaskInProgress: () => false,
  orderCard: (dispatch) => `<article>${dispatch.id}</article>`,
  emptyState: () => "EMPTY",
  document: { querySelector: (selector) => selector === "#orderList" ? list : null },
});

const start = source.indexOf("function renderOrders(");
const end = source.indexOf("function daysUntil(", start);
assert.ok(start >= 0 && end > start, "full waybill renderer must exist");
vm.runInContext(source.slice(start, end), context);

context.renderOrders();
assert.match(list.innerHTML, /pending/);
assert.match(list.innerHTML, /active/);
assert.match(list.innerHTML, /completed/);
assert.match(list.innerHTML, /cancelled/, "all waybills must include cancelled dispatches");

state.orderFilter = "cancelled";
context.renderOrders();
assert.match(list.innerHTML, /cancelled/);
assert.doesNotMatch(list.innerHTML, /pending|active|completed/);

state.orderFilter = "pending";
context.renderOrders();
assert.match(list.innerHTML, /pending/);
assert.doesNotMatch(list.innerHTML, /cancelled/);

state.orderFilter = "all";
state.orderSearch = "WB-4";
context.renderOrders();
assert.match(list.innerHTML, /cancelled/);
assert.doesNotMatch(list.innerHTML, /pending|active|completed/);

assert.match(markup, /data-work-stage="active"[\s\S]*data-work-stage="pending"/);
assert.match(source, /\["cancelled", "已取消"\]/);
assert.match(source, /myOrders: "我的运单"/);
console.log("Mobile order workflow test passed");
