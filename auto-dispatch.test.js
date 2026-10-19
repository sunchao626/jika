const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

function element() {
  return {
    dataset: {}, classList: { toggle() {} }, attributes: {}, listeners: {},
    addEventListener(name, callback) { this.listeners[name] = callback; },
    setAttribute(name, value) { this.attributes[name] = value; },
    closest() { return null; },
    innerHTML: "", textContent: "", value: "", checked: false,
  };
}

const elements = new Map();
const find = (selector) => {
  if (!elements.has(selector)) elements.set(selector, element());
  return elements.get(selector);
};
const tabs = ["queue", "exception", "result", "fleet"].map((autoTab) => {
  const tab = element();
  tab.dataset.autoTab = autoTab;
  return tab;
});
const stages = Array.from({ length: 4 }, element);
const page = element();
page.querySelector = find;
page.querySelectorAll = (selector) => selector === "[data-auto-tab]" ? tabs : stages;

const dispatches = [
  { id: "PD-1", waybillNo: "WB-PENDING", routeId: "XL-001", routeName: "线路一", orderDate: "2026-01-02", status: "待派单", dispatchTime: "", boxes: "BOX-1 / 40HQ" },
  { id: "PD-2", waybillNo: "WB-DONE", routeId: "XL-001", vehicleId: "浙B·K7812", driverId: "SJ-3", status: "运输中", dispatchTime: "2026-01-01 09:00" },
  { id: "PD-3", waybillNo: "WB-ACTIVE", routeId: "XL-004", vehicleId: "苏E·T5568", driverId: "SJ-3", status: "已派单", dispatchTime: "2026-01-01 10:00" },
];
const drivers = [
  { id: "SJ-1", name: "王海", phone: "13800000001", driverType: "自有司机", driverState: "空闲", certificationStatus: "verified", licenseExpiry: "2099-01-01", qualificationExpiry: "2099-01-01" },
  { id: "SJ-2", name: "赵亮", phone: "13800000002", driverType: "自有司机", driverState: "空闲", certificationStatus: "verified", licenseExpiry: "2099-01-01", qualificationExpiry: "2099-01-01" },
  { id: "SJ-3", name: "陈涛", phone: "13800000003", driverType: "自有司机", driverState: "空闲", certificationStatus: "unverified", licenseExpiry: "2099-01-01", qualificationExpiry: "2099-01-01" },
];
const vehicles = [
  { plateNo: "浙B·K7812", vehicleState: "在用", inspectionDue: "2099-01-01", insuranceDue: "2099-01-01", operatingPermitExpiry: "2099-01-01" },
  { plateNo: "沪D·A9021", vehicleState: "在用", inspectionDue: "2099-01-01", insuranceDue: "2099-01-01", operatingPermitExpiry: "2099-01-01" },
  { plateNo: "浙A·F2190", vehicleState: "在用", inspectionDue: "2099-01-01", insuranceDue: "2099-01-01", operatingPermitExpiry: "2099-01-01" },
  { plateNo: "苏E·T5568", vehicleState: "在用", inspectionDue: "2099-01-01", insuranceDue: "2099-01-01", operatingPermitExpiry: "2099-01-01" },
  { plateNo: "浙B·M6608", vehicleState: "维修中", inspectionDue: "2099-01-01", insuranceDue: "2099-01-01", operatingPermitExpiry: "2099-01-01" },
];
const storage = new Map();
let savedDispatches = 0;
let scheduledMinutes = 0;
const windowMock = {
  localStorage: {
    getItem(key) { return storage.get(key) || null; },
    setItem(key, value) { storage.set(key, value); },
  },
  DispatchStore: {
    nowText: () => "2026-09-21 10:30",
    save() { savedDispatches += 1; },
  },
  setInterval(callback, milliseconds) { scheduledMinutes = milliseconds / 60000; return 1; },
  clearInterval() {},
};
const context = vm.createContext({
  window: windowMock,
  document: { querySelector: (selector) => selector === "#autoDispatchPage" ? page : find(selector) },
  dispatches,
  fixedRoutes: [
    { id: "XL-001", routeName: "线路一", origin: "A", destination: "B", routeState: "启用", defaultDriver: "王海", defaultVehicle: "浙B·K7812", estimatedRevenue: 2800 },
    { id: "XL-002", routeName: "线路二", origin: "C", destination: "D", routeState: "启用", defaultDriver: "赵亮", defaultVehicle: "沪D·A9021", estimatedRevenue: 3300 },
    { id: "XL-003", routeName: "线路三", origin: "E", destination: "F", routeState: "启用", defaultVehicle: "浙A·F2190", estimatedRevenue: 2200 },
    { id: "XL-004", routeName: "停用线路", origin: "G", destination: "H", routeState: "停用", estimatedRevenue: 2000 },
  ],
  drivers,
  vehicles,
  formatMoney: (amount) => `¥${amount}`,
  calculateRouteCommission: () => 420,
  Date, String, Number,
});
vm.runInContext(fs.readFileSync("auto-dispatch.js", "utf8"), context);

const pending = dispatches.find((item) => item.id === "PD-1");
assert.equal(pending.status, "已派单");
assert.equal(pending.dispatchMode, "auto");
assert.equal(pending.pushed, true);
assert.equal(drivers.find((driver) => driver.id === pending.driverId).driverState, "运输中");
assert.match(pending.timeline[0].desc, /自动派单.*司机微信小程序/);
assert.ok(savedDispatches > 0, "automatic execution should persist assignments");
assert.equal(find("#autoExecutionToggle").checked, true);
assert.equal(find("#autoExecutionBadge").textContent, "自动执行中");
assert.match(find("#autoRunSummary").textContent, /成功/);
assert.ok(Number(find("#autoExceptionCount").textContent) <= 3, "demo exceptions should stay limited");
assert.ok(Number(find("#autoResultCount").textContent) >= 4, "demo results should include multiple dispatched tasks");
assert.ok(Number(find("#autoFleetCount").textContent) >= 8, "demo fleet should include more capacity rows");

tabs[0].listeners.click();
assert.match(find("#autoTableHead").innerHTML, /<th>运单号<\/th>[\s\S]*<th>计划靠台时间<\/th>/);
assert.doesNotMatch(find("#autoTableHead").innerHTML, /任务 \/ 来源|计划日期/);
assert.doesNotMatch(find("#autoTaskBody").innerHTML, /待派单运单/);

tabs[2].listeners.click();
assert.match(find("#autoTaskBody").innerHTML, /WB-PENDING/);
assert.match(find("#autoTaskBody").innerHTML, /已派单/);
find("#autoTaskBody").listeners.click({ target: { closest: (selector) => selector === "[data-auto-id]" ? { dataset: { autoId: "pending-PD-1" } } : null } });
assert.match(find("#autoInspector").innerHTML, /自动执行/);
assert.match(find("#autoInspector").innerHTML, /已推送司机端/);

tabs[3].listeners.click();
assert.match(find("#autoTaskBody").innerHTML, /在途/);
assert.match(find("#autoTaskBody").innerHTML, /作业中/);
assert.match(find("#autoTaskBody").innerHTML, /维修中/);
assert.match(find("#autoTableHead").innerHTML, /节点进度/);
assert.match(find("#autoTaskBody").innerHTML, /auto-node-progress/);
assert.ok((find("#autoTaskBody").innerHTML.match(/near-complete/g) || []).length >= 3, "fleet should show several near-complete tasks");
assert.ok(find("#autoTaskBody").innerHTML.indexOf("浙C·L3210") < find("#autoTaskBody").innerHTML.indexOf("浙C·Q1188"), "near-complete vehicles should be listed first");
assert.match(find("#autoInspector").innerHTML, /当前任务节点进度/);

find("#autoExecutionToggle").listeners.change({ target: { checked: false } });
assert.equal(find("#autoExecutionBadge").textContent, "已暂停");
assert.equal(find("#autoNextRun").textContent, "已暂停");

find("#autoTriggerMode").listeners.change({ target: { value: "interval" } });
find("#autoIntervalMinutes").listeners.change({ target: { value: "10" } });
find("#autoExecutionToggle").listeners.change({ target: { checked: true } });
assert.equal(scheduledMinutes, 10);
assert.match(find("#autoExecutionDescription").textContent, /每 10 分钟/);

vehicles.push({ plateNo: "浙B·Q7788", vehicleState: "在用", inspectionDue: "2099-01-01", insuranceDue: "2099-01-01", operatingPermitExpiry: "2099-01-01" });
drivers.push({ id: "SJ-4", name: "周宁", phone: "13800000004", driverType: "自有司机", driverState: "空闲", certificationStatus: "verified", licenseExpiry: "2099-01-01", qualificationExpiry: "2099-01-01" });
dispatches.push({ id: "PD-5", waybillNo: "WB-NEW", routeId: "XL-001", routeName: "线路一", status: "待派单", dispatchTime: "" });
windowMock.AutoDispatchManager.refresh();
assert.equal(dispatches.find((item) => item.id === "PD-5").status, "待派单", "interval mode waits for its scheduled run");
windowMock.AutoDispatchManager.run();
assert.equal(dispatches.find((item) => item.id === "PD-5").status, "已派单");
assert.equal(dispatches.find((item) => item.id === "PD-5").dispatchMode, "auto");

assert.ok(storage.has("container-logistics-auto-dispatch-settings-v1"));
console.log("Automatic dispatch execution test passed");
