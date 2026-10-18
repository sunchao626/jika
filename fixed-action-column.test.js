const assert = require("assert");
const fs = require("fs");

const html = fs.readFileSync("index.html", "utf8");
const app = fs.readFileSync("app.js", "utf8");
const customer = fs.readFileSync("customer.js", "utf8");
const autoDispatch = fs.readFileSync("auto-dispatch.js", "utf8");
const styles = fs.readFileSync("styles.css", "utf8");

[
  'aria-label="固定线路列表"',
  'aria-label="派单列表"',
  'aria-label="往来单位档案列表"',
  'aria-label="车辆档案列表"',
  'aria-label="司机信息列表"',
].forEach((label) => {
  const sectionStart = html.indexOf(label);
  assert(sectionStart >= 0, `Missing table section: ${label}`);
  const section = html.slice(sectionStart, sectionStart + 2400);
  assert(section.includes('class="fixed-action-table"'), `${label} must opt into the fixed action table behavior`);
  assert(section.includes('class="fixed-action-column">操作</th>'), `${label} must mark its action header as fixed`);
});

assert(html.includes('class="auto-table-wrap"><table class="fixed-action-table"'), "Automatic dispatch must use the fixed action table behavior");
assert(app.match(/<td class="fixed-action-column">/g)?.length >= 4, "Vehicle, driver, route and dispatch rows must mark fixed action cells");
assert(customer.includes('<td class="fixed-action-column">'), "Customer rows must mark the fixed action cell");
assert(autoDispatch.match(/<td class="fixed-action-column">/g)?.length >= 2, "Automatic dispatch rows must mark fixed action cells");
assert(styles.includes(".fixed-action-table .fixed-action-column"), "Fixed action column styles must exist");
assert(styles.includes("position: sticky"), "Fixed action columns must use sticky positioning");
assert(styles.includes("right: 0"), "Fixed action columns must stay aligned to the right edge");
assert(/#dispatchPage \.fixed-action-table\s*\{[^}]*width:\s*100%/s.test(styles), "Dispatch table must fill the available card width");

console.log("Fixed backend action column test passed");
