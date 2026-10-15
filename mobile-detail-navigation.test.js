const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

const source = fs.readFileSync("mobile.js", "utf8");
assert.match(source, /还箱地/);
assert.match(source, /到达时间/);
assert.match(source, /到达地点/);
assert.match(source, /收货人/);
const start = source.indexOf("function openDetail(");
const end = source.indexOf("let toastTimer", start);
assert.ok(start >= 0 && end > start, "detail navigation functions must exist");

function classList() {
  const values = new Set();
  return {
    add: (...names) => names.forEach((name) => values.add(name)),
    remove: (...names) => names.forEach((name) => values.delete(name)),
    contains: (name) => values.has(name),
  };
}

function element() {
  const attributes = new Map();
  return {
    hidden: false,
    classList: classList(),
    setAttribute: (name, value) => attributes.set(name, value),
    getAttribute: (name) => attributes.get(name),
  };
}

const detailView = element();
const bottomNav = element();
const phoneShell = element();
const state = { activeDispatchId: "" };
const context = vm.createContext({
  state,
  elements: { detailView, bottomNav },
  renderDetail: () => {},
  clearTimelinePhotoUrls: () => {},
  document: {
    body: { style: { overflow: "" } },
    querySelector: (selector) => selector === ".phone-shell" ? phoneShell : null,
  },
});

vm.runInContext(source.slice(start, end), context);

context.openDetail("PD-1001");
assert.equal(bottomNav.hidden, true, "main tabs must be hidden in dispatch detail");
assert.equal(bottomNav.getAttribute("aria-hidden"), "true");
assert.equal(detailView.classList.contains("open"), true);
assert.equal(state.activeDispatchId, "PD-1001");

context.closeDetail();
assert.equal(bottomNav.hidden, false, "main tabs must return after leaving dispatch detail");
assert.equal(bottomNav.getAttribute("aria-hidden"), "false");
assert.equal(detailView.classList.contains("open"), false);
assert.equal(state.activeDispatchId, "");

console.log("Mobile detail navigation test passed");
