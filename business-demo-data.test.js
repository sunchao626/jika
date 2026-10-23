const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

const source = fs.readFileSync("app.js", "utf8");

function readDeclaration(startText, endText, exportText) {
  const start = source.indexOf(startText);
  const end = source.indexOf(endText, start);
  assert.ok(start >= 0 && end > start, `${startText} declaration must exist`);
  const context = vm.createContext({});
  vm.runInContext(`${source.slice(start, end)}\nthis.value = ${exportText};`, context);
  return context.value;
}

function assertBusinessFields(records, fields, label) {
  const invalid = new Set(["", "undefined", "null", "nan"]);
  records.forEach((record) => {
    fields.forEach((field) => {
      const value = String(record[field] ?? "").trim().toLowerCase();
      assert.ok(!invalid.has(value), `${label} ${record.id || record.plateNo || record.waybillNo} missing ${field}`);
    });
  });
}

const waybills = readDeclaration("const waybills = [", "const WAYBILL_STORAGE_KEY", "waybills");
const fleetRecords = readDeclaration("const trailers = [", "const inspectionRecords", "({ trailers, vehicles })");
const dispatchSeed = readDeclaration("const dispatchSeed = [", "const dispatches =", "dispatchSeed");
const drivers = readDeclaration("const drivers = [", "function ensureDefaultDrivers", "drivers");

assertBusinessFields(waybills, ["waybillNo", "taskType", "executionTime", "dispatchMode", "customerName", "projectName", "routeId"], "waybill");
assertBusinessFields(fleetRecords.vehicles, ["plateNo", "driver", "fleetName", "trailerId", "vehicleType", "vin", "engineNo", "permitNo", "ownership", "vehicleState", "inspectionDue", "insuranceDue", "attachments"], "vehicle");
assertBusinessFields(dispatchSeed, ["id", "waybillNo", "planTaskNo", "taskType", "dispatchMode", "customerName", "projectName", "routeName", "driverName", "phone", "vehicleId", "trailerId", "vehicleType", "status", "currentNode"], "dispatch");
assertBusinessFields(drivers, ["id", "name", "gender", "idCard", "phone", "address", "emergencyContact", "emergencyPhone", "entryDate", "driverType", "driverState", "certificationStatus", "fleet", "licenseNo", "licenseClass", "licenseIssueDate", "licenseExpiry", "licenseAttachment", "qualificationNo", "qualificationExpiry", "qualificationAttachment", "bankCard", "bankName", "remark"], "driver");

const pendingPlanGroupMap = new Map();
waybills.filter((item) => item.planTaskId?.startsWith("PT-DEMO-PENDING-")).forEach((item) => {
  if (!pendingPlanGroupMap.has(item.planTaskId)) pendingPlanGroupMap.set(item.planTaskId, []);
  pendingPlanGroupMap.get(item.planTaskId).push(item);
});
const pendingPlanGroups = [...pendingPlanGroupMap.values()];
assert.ok(pendingPlanGroups.length >= 2, "demo data should expose multiple unstarted plans");
pendingPlanGroups.forEach((group) => {
  assert.ok(group.length >= 1, "each unstarted plan should contain at least one task");
  group.forEach((waybill) => {
    const dispatch = dispatchSeed.find((item) => item.waybillNo === waybill.waybillNo);
    assert.equal(dispatch?.status, "待派单", `${waybill.waybillNo} should remain editable and cancellable`);
  });
});
assert.match(source, /function ensureDemoPendingPlanDispatches\(\)/, "stored demo data should be migrated with pending plan dispatches");

const planGroupStart = source.indexOf("function getPlanTaskToday(");
const planGroupEnd = source.indexOf("function getRecordOwner(", planGroupStart);
const planGroupContext = vm.createContext({ waybills, dispatches: dispatchSeed });
vm.runInContext(source.slice(planGroupStart, planGroupEnd), planGroupContext);
const editableDemoGroups = planGroupContext.getPlanTaskGroups(waybills).filter((item) => item.id.startsWith("PT-DEMO-PENDING-"));
assert.ok(editableDemoGroups.every((item) => item.status === "未开始" && item.canEdit && item.canCancel), "unstarted demo plans should expose edit and cancel actions");

const renderStart = source.indexOf("function renderVehicleRows(");
const renderEnd = source.indexOf("function renderReminderCards(", renderStart);
const vehicleRenderer = source.slice(renderStart, renderEnd);
assert.match(vehicleRenderer, /getTrailerLabel\(vehicle\.trailerId\)/);
assert.match(vehicleRenderer, /businessCell\(getVehicleDriverLabel\(vehicle\), "未绑定司机"\)/);
assert.doesNotMatch(vehicleRenderer, /<td>\$\{vehicle\.(?:vehicleType|vin|engineNo|permitNo|ownership|driver|inspectionDue|insuranceDue|attachments)\}<\/td>/);

const driverRenderStart = source.indexOf("function renderDriverRows(");
const driverRenderEnd = source.indexOf("function renderDriverPagination(", driverRenderStart);
const driverRenderer = source.slice(driverRenderStart, driverRenderEnd);
assert.match(driverRenderer, /businessCell\(driver\.name, "测试司机"\)/);
assert.match(driverRenderer, /businessCell\(value, "测试数据待补充"\)/);
assert.doesNotMatch(driverRenderer, /<td>\$\{driver\.(?:name|gender|phone|idCard|fleet|entryDate|licenseClass|licenseExpiry|qualificationExpiry)\}<\/td>/);

const normalizeDriverStart = source.indexOf("function normalizeDriverRecord(");
const normalizeDriverEnd = source.indexOf("drivers.forEach((driver, index)", normalizeDriverStart);
const normalizeContext = vm.createContext({});
vm.runInContext(`${source.slice(normalizeDriverStart, normalizeDriverEnd)}\nthis.normalizeDriverRecord = normalizeDriverRecord;`, normalizeContext);
const normalizedDriver = normalizeContext.normalizeDriverRecord({ id: "SJ-2048", name: undefined, phone: "undefined", bankName: null, remark: "" });
assertBusinessFields([normalizedDriver], ["name", "phone", "bankName", "remark", "licenseNo", "qualificationNo"], "normalized driver");
assert.equal(normalizedDriver.name, "测试司机48");

console.log("Business demo data completeness test passed");
