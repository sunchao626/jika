const assert = require("node:assert/strict");
const fs = require("node:fs");

const html = fs.readFileSync("index.html", "utf8");
const app = fs.readFileSync("app.js", "utf8");
const styles = fs.readFileSync("styles.css", "utf8");

assert.match(html, /data-page="trailer-archives"[^>]*>车辆档案管理/);
assert.match(html, /id="trailerPage"/);
assert.match(html, /id="trailerQueryForm"/);
assert.match(html, /id="trailerForm"/);
assert.match(html, /id="vehicleTrailerSelect"/);
assert.match(html, /name="trailerId"/);
assert.match(app, /"trailer-archives":\s*\{[\s\S]*view: "trailer"/);
assert.match(app, /const trailers = \[/);
assert.match(app, /function filterTrailers\(/);
assert.match(app, /function openTrailerForm\(/);
assert.match(app, /function getTrailerFormData\(/);
assert.match(app, /该挂车已被车辆档案关联/);
assert.match(app, /populateVehicleTrailerOptions\(/);
assert.match(app, /const vehiclePage = document\.querySelector\("#vehiclePage"\);/);
assert.match(app, /vehiclePage\.querySelectorAll\("\.vehicle-module"\)/);
assert.match(styles, /#trailerPage \.fixed-action-table/);

console.log("Trailer management UI test passed");
