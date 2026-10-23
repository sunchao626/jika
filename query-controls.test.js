const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

const html = fs.readFileSync("index.html", "utf8");
const ids = ["queryForm", "routeQueryForm", "dispatchQueryForm", "customerQueryForm", "vehicleQueryForm", "driverQueryForm"];
for (const id of ids) {
  const start = html.indexOf(`id="${id}"`);
  const end = html.indexOf("</form>", start);
  assert.ok(start > 0 && end > start, `${id} must exist`);
  const form = html.slice(start, end);
  assert.match(form, /class="btn quiet query-clear"[^>]*>清空/);
  assert.match(form, /class="btn quiet query-toggle"[^>]*aria-expanded="false"[^>]*>展开/);
  assert.match(form, /class="btn primary" type="submit">查询/);
  assert.match(form, /query-extra/);
}
const waybill = html.slice(html.indexOf('id="queryForm"'), html.indexOf("</form>", html.indexOf('id="queryForm"')));
assert.match(waybill, /name="planExecutionDate"\s*\/>/);
assert.doesNotMatch(waybill, /回单状态|receiptStatus/);
assert.match(html, /name="warningDays" min="1" value="30"/);

function button() {
  return {
    textContent: "展开", attrs: {},
    addEventListener(name, handler) { this[name] = handler; },
    setAttribute(name, value) { this.attrs[name] = value; },
  };
}
function form() {
  const toggle = button();
  const clear = button();
  const classes = new Set(["query-collapsed"]);
  return {
    toggle, clear, classes, value: "some filter", submissions: 0,
    classList: {
      toggle(name) {
        if (classes.has(name)) { classes.delete(name); return false; }
        classes.add(name); return true;
      },
    },
    querySelector(selector) { return selector === ".query-toggle" ? toggle : clear; },
    reset() { this.value = ""; },
    requestSubmit() { this.submissions += 1; },
  };
}
const forms = ids.map(form);
vm.runInNewContext(fs.readFileSync("query-controls.js", "utf8"), {
  document: { querySelectorAll: () => forms },
});
for (const item of forms) {
  item.toggle.click();
  assert.equal(item.toggle.textContent, "收起");
  assert.equal(item.toggle.attrs["aria-expanded"], "true");
  assert.equal(item.value, "some filter");
  assert.equal(item.submissions, 0);
  item.toggle.click();
  assert.equal(item.toggle.textContent, "展开");
  assert.equal(item.toggle.attrs["aria-expanded"], "false");
  item.clear.click();
  assert.equal(item.value, "");
  assert.equal(item.submissions, 1);
}
console.log("Backend query controls test passed");
