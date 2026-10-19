const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

const source = fs.readFileSync("app.js", "utf8");
const start = source.indexOf('dispatchForm.addEventListener("submit"');
const end = source.indexOf('dispatchBody.addEventListener("change"', start);
assert.ok(start >= 0 && end > start);
const route = { id: "XL-001", routeName: "港区线路", origin: "港区", destination: "仓库", estimatedRevenue: 2900 };
const waybill = { waybillNo: "WB-NEW", orderDate: "2026-09-21", loadAddress: "港区 / 仓库", boxNo1: "TCLU123", boxNo2: "-", boxType: "40HQ" };
const pending = { id: "PD-EXISTING", waybillNo: waybill.waybillNo, status: "待派单", dispatchMode: "pending", pushed: false, timeline: [] };
const dispatches = [pending];
const driver = { id: "SJ-1", name: "王师傅", phone: "13800000000", driverState: "空闲", capacityOwnership: "自营" };
let savedDispatches = 0;
let savedWaybills = 0;
const form = { elements: { waybillId: { value: waybill.waybillNo }, driverId: { value: "SJ-1" }, vehicleId: { value: "浙B-001" }, note: { value: " 按时送达 " } }, addEventListener(name, handler) { this[name] = handler; } };
const context = vm.createContext({
  CapacityOwnership: require("./capacity-ownership.js"),
  dispatchForm: form, dispatches, waybills: [waybill],
  drivers: [driver],
  availableOwnDrivers: () => [driver],
  vehicles: [{ plateNo: "浙B-001", capacityOwnership: "自营" }],
  getRouteForWaybill: () => route,
  formatWaybillBoxes: () => "TCLU123 / 40HQ",
  calculateRouteCommission: () => 420,
  window: { DispatchStore: { nowText: () => "2026-09-21 11:00" }, AutoDispatchDemo: { refresh() {} } },
  saveWaybills() { savedWaybills++; }, saveDispatches() { savedDispatches++; },
  renderRows() {}, renderDispatchPage() {}, getFilteredDispatches: () => [], filterRows: () => [],
  closeDispatchForm() {},
  dispatchQueryForm: { reset() {}, elements: { dispatchMode: { value: "" } } },
  queryForm: {},
  FormData: class { get() { return ""; } },
});
vm.runInContext(source.slice(start, end), context);
form.submit({ preventDefault() {} });
assert.equal(dispatches.length, 1, "assigning an existing pending order must not duplicate it");
assert.equal(pending.id, "PD-EXISTING");
assert.equal(pending.status, "已派单");
assert.equal(pending.dispatchMode, "manual");
assert.equal(pending.driverName, "王师傅");
assert.equal(pending.vehicleId, "浙B-001");
assert.equal(pending.note, "按时送达");
assert.equal(pending.pushed, true);
assert.equal(pending.timeline.length, 1);
assert.equal(driver.driverState, "运输中");
assert.equal(waybill.dispatchDate, "2026-09-21");
assert.equal(waybill.plateNo, "浙B-001");
assert.equal(savedWaybills, 1);
assert.equal(savedDispatches, 1);
console.log("Pending dispatch assignment test passed");
