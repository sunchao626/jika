const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

const html = fs.readFileSync("index.html", "utf8");
const vehicle = html.slice(html.indexOf('id="vehicleDialog"'), html.indexOf('id="deleteVehicleDialog"'));
for (const field of [
  "plateNo", "vehicleType", "vin", "engineNo", "driver", "fleet", "fleetName", "capacityOwnership", "supplierName",
  "vehicleState", "curbWeight", "fuelConsumption", "ratedLoad", "registrationCertNo",
  "technicalLevel", "technicalLevelExpiry", "drivingLicenseNo", "drivingLicenseExpiry",
  "permitNo", "operatingPermitExpiry", "inspectionDue", "drivingLicense", "operatingPermit",
  "commercialInsuranceNo", "commercialInsuranceExpiry", "mandatoryInsuranceNo",
  "mandatoryInsuranceExpiry", "cargoInsuranceNo", "cargoInsuranceExpiry", "insuranceDue", "remark",
]) {
  assert.equal((vehicle.match(new RegExp(`name="${field}"`, "g")) || []).length, 1, field);
}
assert.match(html, /id="dispatchRouteName" readonly/);
assert.match(html, /src="admin-dialogs\.js"/);
assert.ok((html.match(/<option>维修中<\/option>/g) || []).length >= 2);
assert.doesNotMatch(html, /<option>报废<\/option>/);

const listeners = {};
const buttons = Array.from({ length: 4 }, () => ({
  attrs: {}, classes: new Set(),
  classList: { toggle(name, on) { this.owner.classes[on ? "add" : "delete"](name); } },
  addEventListener(name, handler) { this[name] = handler; },
  setAttribute(key, value) { this.attrs[key] = value; },
  removeAttribute(key) { delete this.attrs[key]; },
}));
buttons.forEach((button) => { button.classList.owner = button; });
const sections = Array.from({ length: 4 }, (_, index) => ({ offsetTop: index * 200 }));
const scroll = {
  scrollTop: 0, scrollHeight: 800, clientHeight: 300,
  querySelectorAll() { return sections; },
  addEventListener(name, handler) { listeners[name] = handler; },
  scrollTo(options) { this.scrollTop = options.top; },
};
const nav = { querySelectorAll() { return buttons; } };
const form = { addEventListener(name, handler) { listeners[name] = handler; } };
const dialog = {
  querySelector(selector) { return { ".admin-section-nav": nav, ".admin-form-scroll": scroll, form }[selector]; },
  addEventListener(name, handler) { listeners[name] = handler; },
};
vm.runInNewContext(fs.readFileSync("admin-dialogs.js", "utf8"), {
  document: { querySelectorAll() { return [dialog]; } },
});
assert.equal(buttons[0].attrs["aria-current"], "step");
buttons[2].click();
assert.equal(scroll.scrollTop, 400);
assert.equal(buttons[2].attrs["aria-current"], "step");
listeners.invalid({ target: { closest() { return sections[3]; } } });
assert.equal(buttons[3].attrs["aria-current"], "step");
listeners.close();
assert.equal(scroll.scrollTop, 0);
assert.equal(buttons[0].attrs["aria-current"], "step");
console.log("Admin dialog navigation and vehicle fields test passed");
