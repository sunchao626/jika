const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

const source = fs.readFileSync("app.js", "utf8");
const desktopHtml = fs.readFileSync("index.html", "utf8");
const desktopCss = fs.readFileSync("styles.css", "utf8");
const mobileScript = fs.readFileSync("admin-mobile.js", "utf8");
assert.match(source, /getDispatchResourceOwnership\(vehicle\) === selectedOwnership/);
assert.match(source, /getDispatchResourceOwnership\(trailer\) === ownerType/);
assert.match(source, /dispatch\.capacityOwnershipDetailSnapshot\?\.find\(\(item\) => item\.role === "车辆"\)/);
assert.match(mobileScript, /\["司机所属单位", dispatch\.driverOrganizationSnapshot/);
assert.match(mobileScript, /\["车辆所属单位", dispatch\.vehicleOrganizationSnapshot/);
for (const [number, id] of [[1, "dispatchTempSealNo1"], [1, "dispatchRailSealNo1"], [1, "dispatchSeaSealNo1"], [2, "dispatchTempSealNo2"], [2, "dispatchRailSealNo2"], [2, "dispatchSeaSealNo2"]]) assert.ok(desktopHtml.includes(`id="${id}"`), `缺少第 ${number} 组封号字段 ${id}`);
assert.match(desktopCss, /\.dispatch-box-type-field\s*\{[^}]*max-width:\s*210px/);
assert.match(desktopCss, /\.dispatch-container-fields\s*\{[^}]*grid-template-columns:\s*repeat\(2, minmax\(0, 1fr\)\)/);
assert.match(desktopHtml, /id="dispatchJobLocationFields"/);
assert.match(source, /editingDispatch\.jobLocations = readDispatchJobLocations\(\)/);
assert.match(source, /label: "作业地点"/);
const start = source.indexOf('dispatchForm.addEventListener("submit"');
const end = source.indexOf('dispatchBody.addEventListener("change"', start);
assert.ok(start >= 0 && end > start);

const route = { id: "XL-001", routeName: "港区线路", origin: "港区", destination: "仓库", estimatedRevenue: 2900 };
const waybill = { waybillNo: "WB-EDIT", orderDate: "2026-09-27", taskType: "提空装货", loadAddress: "港区 / 仓库" };
const dispatch = {
  id: "PD-EDIT", waybillNo: "WB-EDIT", status: "已派单", dispatchMode: "auto", dispatchTime: "2026-09-27 08:00",
  currentNode: "待提货", driverId: "SJ-OLD", driverName: "原司机", vehicleId: "浙B-001", note: "原备注", pushed: true,
  timeline: [{ node: "已派单", time: "2026-09-27 08:00", desc: "原派单", photos: [] }],
};
const nextDriver = { id: "SJ-NEW", name: "新司机", phone: "13800000000", driverState: "空闲", capacityOwnership: "自营" };
const form = {
  dispatchMode: "edit",
  editingDispatchId: dispatch.id,
  elements: { waybillId: { value: waybill.waybillNo }, driverId: { value: nextDriver.id }, vehicleId: { value: "浙B-002" }, boxType: { value: "40HQ" }, boxNo1: { value: "MSKU-EDIT" }, tempSealNo1: { value: "SEAL-EDIT" }, railSealNo1: { value: "RAIL-EDIT" }, seaSealNo1: { value: "SEA-EDIT" }, boxNo2: { value: "-" }, tempSealNo2: { value: "-" }, railSealNo2: { value: "-" }, seaSealNo2: { value: "-" }, consignee: { value: "李收货" }, arrivalTime: { value: "2026-09-27T18:30" }, arrivalLocation: { value: "宁波北仑仓" }, note: { value: " 变更后备注 " } },
  addEventListener(name, handler) { this[name] = handler; },
};
const context = vm.createContext({
  CapacityOwnership: require("./capacity-ownership.js"),
  dispatchForm: form,
  dispatches: [dispatch],
  waybills: [waybill],
  drivers: [nextDriver],
  vehicles: [{ plateNo: "浙B-002", vehicleState: "在用", capacityOwnership: "自营" }],
  activePageName: "vehicle-dashboard",
  availableOwnDrivers: () => [nextDriver],
  getRouteForWaybill: () => route,
  readDispatchJobLocations: () => [
    { id: "提空装货-LOC-1", name: "提空地", address: "港区空箱区" },
    { id: "提空装货-LOC-2", name: "装货地", address: "客户仓库" },
    { id: "提空装货-LOC-3", name: "落重地", address: "铁路场站" },
  ],
  formatWaybillBoxes: () => "箱 / 40HQ",
  calculateRouteCommission: () => 420,
  window: { DispatchStore: { nowText: () => "2026-09-27 09:30" }, AutoDispatchManager: { refresh() {} } },
  saveWaybills() {}, saveDispatches() {}, syncDriverOperationalStates() {},
  renderRows() {}, renderDispatchPage() {}, renderDriverPage() {}, renderDashboard() {}, getFilteredDispatches: () => [], filterRows: () => [], getFilteredDrivers: () => [],
  closeDispatchForm() {}, dispatchQueryForm: { reset() {}, elements: { dispatchMode: { value: "" } } }, queryForm: {},
  FormData: class { get() { return ""; } },
});
vm.runInContext(source.slice(start, end), context);
form.submit({ preventDefault() {} });
assert.equal(dispatch.dispatchMode, "manual");
assert.equal(dispatch.driverId, "SJ-NEW");
assert.equal(dispatch.vehicleId, "浙B-002");
assert.equal(dispatch.boxType, "40HQ");
assert.equal(dispatch.boxNo1, "MSKU-EDIT");
assert.equal(dispatch.sealNo1, "SEAL-EDIT");
assert.equal(dispatch.railSealNo1, "RAIL-EDIT");
assert.equal(dispatch.seaSealNo1, "SEA-EDIT");
assert.deepEqual(dispatch.jobLocations.map(({ name, address }) => [name, address]), [["提空地", "港区空箱区"], ["装货地", "客户仓库"], ["落重地", "铁路场站"]]);
assert.equal(JSON.stringify(waybill.jobLocations), JSON.stringify(dispatch.jobLocations));
assert.equal(dispatch.consignee, "李收货");
assert.equal(dispatch.arrivalTime, "2026-09-27T18:30");
assert.equal(dispatch.arrivalLocation, "宁波北仑仓");
assert.equal(dispatch.note, "变更后备注");
assert.equal(dispatch.timeline.at(-1).node, "派单调整");
assert.equal(waybill.driverId, "SJ-NEW");
assert.equal(waybill.plateNo, "浙B-002");

const populateStart = source.indexOf("function populateDispatchFormOptions()");
const populateEnd = source.indexOf("function ensureDispatchDriverOption", populateStart);
const thirdDriver = { id: "SJ-THIRD", name: "三方司机", phone: "13900000001", capacityOwnership: "三方", supplierName: "测试车队" };
const driverSelect = { value: thirdDriver.id, innerHTML: "" };
const vehicleSelect = { value: "", innerHTML: "" };
const trailerSelect = { value: "", innerHTML: "" };
const waybillSelect = { value: "", innerHTML: "" };
const formSelects = { driverId: driverSelect, vehicleId: vehicleSelect, trailerId: trailerSelect };
const populateContext = vm.createContext({
  CapacityOwnership: require("./capacity-ownership.js"),
  dispatchForm: { elements: formSelects },
  drivers: [thirdDriver],
  vehicles: [
    { plateNo: "OWN-1", vehicleType: "牵引车", vehicleState: "在用", capacityOwnership: "自营" },
    { plateNo: "THIRD-1", vehicleType: "牵引车", vehicleState: "在用", capacityOwnership: "三方", supplierName: "测试车队", trailerId: "T-THIRD" },
  ],
  trailers: [
    { id: "T-OWN", plateNo: "挂自营", trailerType: "骨架车", capacityOwnership: "自营" },
    { id: "T-THIRD", plateNo: "挂三方", trailerType: "骨架车", capacityOwnership: "三方", supplierName: "测试车队" },
  ],
  waybills: [], dispatches: [],
  availableOwnDrivers: () => [thirdDriver],
  document: { querySelector: (selector) => ({ "#dispatchWaybillSelect": waybillSelect, "#dispatchDriverSelect": driverSelect, "#dispatchVehicleSelect": vehicleSelect, "#dispatchVehicleTypeSelect": null, "#dispatchTrailerSelect": trailerSelect })[selector] },
});
vm.runInContext(source.slice(populateStart, populateEnd), populateContext);
populateContext.populateDispatchFormOptions();
assert.match(vehicleSelect.innerHTML, /THIRD-1/);
assert.doesNotMatch(vehicleSelect.innerHTML, /OWN-1/);
assert.match(trailerSelect.innerHTML, /挂三方/);
assert.doesNotMatch(trailerSelect.innerHTML, /挂自营/);
console.log("Manual dispatch edit test passed");
