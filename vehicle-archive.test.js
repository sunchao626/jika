const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

const source = fs.readFileSync("app.js", "utf8");
const html = fs.readFileSync("index.html", "utf8");

const monthStart = source.indexOf("function isExpiredOrDueWithinNaturalMonth(");
const monthEnd = source.indexOf("function getVehicleStateClass(", monthStart);
const filterStart = source.indexOf("function filterTrailers(");
const filterEnd = source.indexOf("function getFilteredTrailers(", filterStart);
const bindingStart = source.indexOf("function populateVehicleTrailerOptions(");
const bindingEnd = source.indexOf("function openVehicleForm(", bindingStart);
assert.ok(monthStart >= 0 && monthEnd > monthStart);
assert.ok(filterStart >= 0 && filterEnd > filterStart);
assert.ok(bindingStart >= 0 && bindingEnd > bindingStart);

const organizations = { organizationName: (item) => item.unit || "" };
const context = vm.createContext({
  today: new Date(2026, 0, 31),
  normalize: (value) => String(value || "").toLocaleLowerCase(),
  CapacityOwnership: organizations,
  vehicles: [
    { plateNo: "浙A001", vehicleType: "牵引车", unit: "宁波车队", mandatoryInsuranceExpiry: "2026-02-28", commercialInsuranceExpiry: "2026-03-01", inspectionDue: "2026-01-20" },
    { plateNo: "浙A002", vehicleType: "牵引车", unit: "宁波车队", mandatoryInsuranceExpiry: "2025-12-31", commercialInsuranceExpiry: "2026-04-01", inspectionDue: "2026-04-01" },
  ],
  trailers: [
    { id: "TR-1", plateNo: "浙A挂01", trailerType: "骨架挂车", unit: "上海车队", mandatoryInsuranceExpiry: "2026-02-28", commercialInsuranceExpiry: "2026-04-01", inspectionDue: "2026-04-01" },
  ],
});
vm.runInContext(`${source.slice(monthStart, monthEnd)}\n${source.slice(filterStart, filterEnd)}\nthis.api = { isExpiredOrDueWithinNaturalMonth, filterTrailers };`, context);

assert.equal(context.api.isExpiredOrDueWithinNaturalMonth("2026-02-28"), true, "month-end should clamp to February's last day");
assert.equal(context.api.isExpiredOrDueWithinNaturalMonth("2026-03-01"), false, "date after the clamped natural month should be excluded");
assert.equal(context.api.isExpiredOrDueWithinNaturalMonth("2025-12-31"), true, "overdue dates should remain included");
assert.equal(context.api.isExpiredOrDueWithinNaturalMonth("2026-02-31"), false, "invalid calendar dates should be rejected");

const query = (values) => ({ get: (key) => values[key] || "" });
assert.deepEqual(
  Array.from(context.api.filterTrailers(query({ mandatoryDue: "near" })), (item) => item.plateNo),
  ["浙A001", "浙A002", "浙A挂01"],
  "mandatory insurance filter should include overdue, near-expiry vehicles and trailers"
);
assert.deepEqual(
  Array.from(context.api.filterTrailers(query({ commercialDue: "near" })), (item) => item.plateNo),
  [],
  "commercial insurance filter should use its own due date"
);
assert.deepEqual(
  Array.from(context.api.filterTrailers(query({ vehicleType: "骨架", organization: "上海" })), (item) => item.plateNo),
  ["浙A挂01"],
  "archive filters should search both vehicle classes by type and organization"
);

const trailerSelect = { innerHTML: "", value: "" };
const bindingContext = vm.createContext({
  trailers: [
    { id: "TR-1", plateNo: "挂1", trailerType: "骨架挂车", trailerState: "在用" },
    { id: "TR-2", plateNo: "挂2", trailerType: "骨架挂车", trailerState: "在用" },
  ],
  vehicles: [{ plateNo: "车1", trailerId: "TR-1" }],
  editingVehiclePlate: "",
  document: { querySelector: () => trailerSelect },
});
vm.runInContext(`${source.slice(bindingStart, bindingEnd)}\nthis.populate = populateVehicleTrailerOptions;`, bindingContext);
bindingContext.populate("");
assert.match(trailerSelect.innerHTML, /TR-2/);
assert.doesNotMatch(trailerSelect.innerHTML, /TR-1/);
bindingContext.editingVehiclePlate = "车1";
bindingContext.populate("TR-1");
assert.match(trailerSelect.innerHTML, /TR-1/);

assert.match(html, /<span>车辆管理<\/span>/);
assert.match(html, /data-page="trailer-archives"[^>]*>车辆档案管理/);
assert.match(html, /id="vehicleBody"[\s\S]*?<\/table>/);
assert.match(html, /交强险承保单位/);
assert.match(html, /商业险保单号/);
assert.match(html, /name="mandatoryInsuranceCompany"/);
assert.match(html, /name="commercialInsuranceCompany"/);
assert.match(source, /populateVehicleTrailerOptions\(/);

console.log("Vehicle archive filters and natural-month boundaries passed");
