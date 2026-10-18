const assert = require("node:assert/strict");
const fs = require("node:fs");

const driverHtml = fs.readFileSync("mobile.html", "utf8");
const driverScript = fs.readFileSync("mobile.js", "utf8");
const managerHtml = fs.readFileSync("admin-mobile.html", "utf8");
const managerScript = fs.readFileSync("admin-mobile.js", "utf8");

assert.doesNotMatch(driverHtml, /notificationButton|switchDriverButton|driverDialog|切换演示司机/);
assert.doesNotMatch(driverScript, /notificationButton|switchDriverButton|driverDialog|renderDriverOptions/);
assert.doesNotMatch(driverHtml, /taskDrawerButton|class="task-drawer"/);
assert.match(driverHtml, /data-view="messages"/);

assert.doesNotMatch(managerHtml, /managerDrawerButton|headerMessageButton|class="manager-drawer/);
assert.doesNotMatch(managerScript, /openManagerDrawer|closeManagerDrawer|renderManagerDrawer|headerMessageButton|managerDrawerButton/);
assert.match(managerHtml, /data-view="messages"/);

console.log("Mobile header simplification test passed");
