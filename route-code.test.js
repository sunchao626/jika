const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const CapacityOwnership = require("./capacity-ownership.js");

const html = fs.readFileSync("index.html", "utf8");
const start = html.indexOf('id="routeForm"');
const end = html.indexOf("</form>", start);
assert.ok(start > 0 && end > start);
const formHtml = html.slice(start, end);
assert.doesNotMatch(formHtml, /name="routeCode"/);
assert.match(formHtml, /name="routeName" required/);
assert.match(html, /<th>线路编号<\/th>/);

const source = fs.readFileSync("app.js", "utf8");
const dataStart = source.indexOf("function getRouteFormData()");
const dataEnd = source.indexOf("function requestDeleteRoute(", dataStart);
assert.ok(dataStart >= 0 && dataEnd > dataStart);
const routes = [
  { routeCode: "XL-NB-001" }, { routeCode: "XL-SH-002" },
  { routeCode: "XL-HZ-003" }, { routeCode: "XL-SZ-004" },
];
const context = vm.createContext({
  CapacityOwnership,
  fixedRoutes: routes,
  routeForm: {},
  FormData: class { get(name) { return name === "routeName" ? "新线路" : ""; } },
});
vm.runInContext(source.slice(dataStart, dataEnd), context);

assert.equal(Object.hasOwn(context.getRouteFormData(), "routeCode"), false);
assert.equal(context.getNextRouteCode(), "XL-005");
routes.push({ routeCode: "XL-005" });
assert.equal(context.getNextRouteCode(), "XL-006");
routes.pop();
assert.equal(context.getNextRouteCode(), "XL-007", "deleted numbers should not be reused within the session");
assert.match(source, /if \(routeFormMode === "edit" && existingRoute\) Object\.assign\(existingRoute, data\)/);
assert.match(source, /routeCode: getNextRouteCode\(\)/);
console.log("Route code generation test passed");
