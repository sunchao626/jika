const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const CapacityOwnership = require("./capacity-ownership.js");

const source = fs.readFileSync("app.js", "utf8");
const start = source.indexOf("function populateDispatchFormOptions()");
const end = source.indexOf("function openDispatchDetail(", start);
assert.ok(start >= 0 && end > start);

const fields = {
  waybillId: { value: "OLD" }, driverId: { value: "OLD" },
  vehicleId: { value: "OLD" }, note: { value: "old note" },
};
const form = {
  elements: fields,
  reset() { Object.values(fields).forEach((field) => { field.value = ""; }); },
};
const nodes = new Map();
const find = (selector) => {
  if (!nodes.has(selector)) nodes.set(selector, { value: "", innerHTML: "" });
  return nodes.get(selector);
};
const routes = {
  "WB-1": { routeCode: "R1", routeName: "线路一", origin: "港区", destination: "仓库", estimatedRevenue: 2000 },
  "WB-2": { routeCode: "R2", routeName: "线路二", origin: "码头", destination: "园区", estimatedRevenue: 3000 },
};
const dialog = { open: false, dataset: {}, showModal() { this.open = true; }, close() { this.open = false; } };
const context = vm.createContext({
  CapacityOwnership,
  document: { querySelector: find }, dispatchForm: form, dispatchDialog: dialog,
  dispatches: [],
  waybills: [
    { waybillNo: "WB-1", customerName: "客户一", loadAddress: "港区 / 仓库", boxNo1: "BOX-1", boxNo2: "-", boxType: "40HQ" },
    { waybillNo: "WB-2", customerName: "客户二", loadAddress: "码头 / 园区", boxNo1: "BOX-2", boxNo2: "-", boxType: "20GP" },
  ],
  vehicles: [{ plateNo: "浙B123", vehicleType: "牵引车", vehicleState: "在用" }],
  availableOwnDrivers: () => [{ id: "D1", name: "王师傅", phone: "13800000000" }],
  getRouteForWaybill: (id) => routes[id],
  formatWaybillBoxes: (waybill) => `${waybill.boxNo1} / ${waybill.boxType}`,
  calculateRouteCommission: () => 200,
  formatMoney: (amount) => `¥${amount}`,
});
vm.runInContext(source.slice(start, end), context);

context.openDispatchForm();
assert.equal(dialog.open, true);
assert.equal(dialog.dataset.presentation, "page");
assert.equal(fields.waybillId.value, "");
assert.equal(fields.driverId.value, "");
assert.equal(fields.vehicleId.value, "");
assert.equal(fields.driverId.disabled, true);
assert.equal(fields.vehicleId.disabled, true);
assert.equal(find("#dispatchRouteName").value, "");
assert.equal(find("#dispatchRevenue").value, "");

fields.waybillId.value = "WB-1";
context.updateDispatchFormFromWaybill();
assert.equal(find("#dispatchRouteName").value, "R1 / 线路一");
assert.equal(find("#dispatchBoxes").value, "BOX-1 / 40HQ");
assert.equal(find("#dispatchRevenue").value, "¥2000");
assert.equal(fields.driverId.disabled, false);
assert.equal(fields.vehicleId.disabled, false);
assert.equal(fields.driverId.value, "");

fields.driverId.value = "D1";
fields.vehicleId.value = "浙B123";
fields.waybillId.value = "WB-2";
context.updateDispatchFormFromWaybill();
assert.equal(find("#dispatchRouteName").value, "R2 / 线路二");
assert.equal(fields.driverId.value, "");
assert.equal(fields.vehicleId.value, "");

context.closeDispatchForm();
assert.equal(dialog.dataset.presentation, "page");
context.openDispatchForm();
assert.equal(find("#dispatchRouteName").value, "");
assert.equal(fields.waybillId.value, "");
assert.equal(fields.driverId.disabled, true);
console.log("Dispatch form selection and reset test passed");
