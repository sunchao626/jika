const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const CapacityOwnership = require("./capacity-ownership.js");

const source = fs.readFileSync("app.js", "utf8");
const start = source.indexOf("const ACTIVE_DRIVER_DISPATCH_STATES");
const end = source.indexOf("function saveDispatches()", start);
assert.ok(start >= 0 && end > start, "driver operational state synchronizer must exist");

const drivers = [
  { id: "SJ-1", driverType: "自有司机", driverState: "在职", certificationStatus: "verified", licenseExpiry: "2099-01-01", qualificationExpiry: "2099-01-01" },
  { id: "SJ-2", driverType: "自有司机", driverState: "在职", certificationStatus: "verified", licenseExpiry: "2099-01-01", qualificationExpiry: "2099-01-01" },
  { id: "SJ-3", driverType: "自有司机", driverState: "停岗", certificationStatus: "verified", licenseExpiry: "2099-01-01", qualificationExpiry: "2099-01-01" },
  { id: "SJ-4", driverType: "自有司机", driverState: "运输中", certificationStatus: "verified", licenseExpiry: "2099-01-01", qualificationExpiry: "2099-01-01" },
  { id: "SJ-5", driverType: "自有司机", driverState: "空闲", certificationStatus: "verified", licenseExpiry: "2099-01-01", qualificationExpiry: "2099-01-01" },
  { id: "SJ-6", driverType: "自有司机", driverState: "空闲", certificationStatus: "pending", licenseExpiry: "2099-01-01", qualificationExpiry: "2099-01-01" },
];
const dispatches = [
  { driverId: "SJ-1", status: "已派单" },
  { driverId: "SJ-3", status: "运输中" },
  { driverId: "SJ-4", status: "已完成" },
  { driverId: "SJ-5", status: "运输中" },
];
const context = vm.createContext({ drivers, dispatches, Set, Boolean });
vm.runInContext(source.slice(start, end), context);

assert.deepEqual(drivers.map((driver) => driver.driverState), ["运输中", "空闲", "停用", "空闲", "运输中", "停用"]);

dispatches[0].status = "取消";
dispatches[3].status = "已完成";
vm.runInContext("syncDriverOperationalStates()", context);
assert.equal(drivers[0].driverState, "空闲");
assert.equal(drivers[2].driverState, "停用", "manual or migrated disabled state must remain disabled");
assert.equal(drivers[4].driverState, "空闲");

const availabilityStart = source.indexOf("function enabledOwnDrivers()");
const availabilityEnd = source.indexOf("const DRIVER_CERTIFICATION_STORAGE_KEY", availabilityStart);
const availabilityContext = vm.createContext({ drivers, daysUntil: () => 365, CapacityOwnership });
vm.runInContext(source.slice(availabilityStart, availabilityEnd), availabilityContext);
drivers[0].driverState = "运输中";
assert.equal(availabilityContext.enabledOwnDrivers().length, 4, "transporting drivers remain enabled in driver master data");
assert.equal(availabilityContext.availableOwnDrivers().length, 3, "only idle drivers are available for dispatch");
drivers[5].driverState = "空闲";
assert.equal(availabilityContext.availableOwnDrivers().length, 3, "pending certification must not enter the dispatch pool");

const reviewStart = source.indexOf("function canReviewDriverCertification(");
const reviewEnd = source.indexOf("function maskCertificationId(", reviewStart);
const reviewContext = vm.createContext({});
vm.runInContext(source.slice(reviewStart, reviewEnd), reviewContext);
assert.equal(reviewContext.canReviewDriverCertification({ certificationStatus: "pending", driverState: "空闲" }), true);
assert.equal(reviewContext.canReviewDriverCertification({ certificationStatus: "pending", driverState: "运输中" }), false);
assert.equal(reviewContext.canReviewDriverCertification({ certificationStatus: "verified", driverState: "运输中" }), false);
assert.match(source, /data-view-certification=.*查看认证资料/);

const mobileSource = fs.readFileSync("mobile.js", "utf8");
assert.match(mobileSource, /"SJ-1002": \{ status: "verified"/);

const html = fs.readFileSync("index.html", "utf8");
const queryStart = html.indexOf('id="driverQueryForm"');
const queryEnd = html.indexOf("</form>", queryStart);
const formStart = html.indexOf('id="driverForm"');
const formEnd = html.indexOf("</form>", formStart);
const driverControls = `${html.slice(queryStart, queryEnd)}${html.slice(formStart, formEnd)}`;
assert.match(driverControls, /空闲/);
assert.match(driverControls, /运输中/);
assert.match(driverControls, /停用/);
assert.doesNotMatch(driverControls, />在职<|>离职<|>待入职<|>停岗</);

console.log("Driver operational status test passed");
