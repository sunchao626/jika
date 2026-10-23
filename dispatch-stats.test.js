const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const CapacityOwnership = require("./capacity-ownership.js");

const source = fs.readFileSync("app.js", "utf8");
const start = source.indexOf("const seedAutoDispatchIds =");
const end = source.indexOf("function updateDispatchSelection()", start);
assert.ok(start >= 0 && end > start, "dispatch classification functions must exist");

const dispatches = [
  { id: "PD-1001", waybillNo: "WB-1", status: "运输中", boxNo1: "TCLU8374621" },
  { id: "PD-1002", waybillNo: "WB-2", status: "已派单", boxNo2: "MSKU4920184" },
  { id: "PD-1005", waybillNo: "WB-3", status: "待派单" },
  { id: "PD-2001", waybillNo: "WB-4", status: "已派单", dispatchMode: "auto" },
  { id: "PD-2002", waybillNo: "WB-5", status: "已完成", dispatchMode: "manual" },
  { id: "PD-1999", waybillNo: "WB-6", status: "取消" },
];
const waybills = [
  { waybillNo: "WB-3", boxNo2: "CMAU6502739" },
];
const elements = new Map();
const element = (selector) => {
  if (!elements.has(selector)) elements.set(selector, { textContent: "" });
  return elements.get(selector);
};
const buttons = ["", "auto", "manual", "pending"].map((dispatchMode) => ({
  dataset: { dispatchMode }, classList: { toggle() {} },
  setAttribute(name, value) { this[name] = value; },
}));
const form = { elements: { dispatchMode: { value: "auto" } } };
const context = vm.createContext({
  CapacityOwnership,
  dispatches, waybills, dispatchQueryForm: form, normalize: (value) => String(value || "").trim().toLowerCase(),
  document: { querySelector: element, querySelectorAll: () => buttons },
});
vm.runInContext(source.slice(start, end), context);

context.renderDispatchStats();
assert.equal(element("#dispatchTotalStat").textContent, 6);
assert.equal(element("#dispatchAutoStat").textContent, 2);
assert.equal(element("#dispatchManualStat").textContent, 3);
assert.equal(element("#dispatchPendingStat").textContent, 1);
assert.equal(buttons[1]["aria-pressed"], "true");

const filtered = (mode) => context.filterDispatches(new Map([
  ["waybillNo", ""], ["containerNo", ""], ["orderDate", ""], ["routeId", ""], ["driverName", ""],
  ["plateNo", ""], ["dispatchStatus", ""], ["dispatchMode", mode],
]));
assert.equal(filtered("auto").length, 2);
assert.equal(filtered("manual").length, 3);
assert.equal(filtered("pending").length, 1);
assert.equal(filtered("").length, 6);
const filteredByContainer = (containerNo) => context.filterDispatches(new Map([
  ["waybillNo", ""], ["containerNo", containerNo], ["routeId", ""], ["driverName", ""],
  ["plateNo", ""], ["dispatchStatus", ""], ["dispatchMode", ""],
]));
assert.deepEqual(Array.from(filteredByContainer("tclu837").map((item) => item.id)), ["PD-1001"]);
assert.deepEqual(Array.from(filteredByContainer("4920184").map((item) => item.id)), ["PD-1002"]);
assert.deepEqual(Array.from(filteredByContainer("6502739").map((item) => item.id)), ["PD-1005"]);
console.log("Dispatch statistics test passed");
