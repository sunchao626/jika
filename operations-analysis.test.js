const assert = require("node:assert/strict");
const { SAMPLE_ROWS, enrich } = require("./operations-analysis.js");

const rows = enrich(SAMPLE_ROWS);
assert.equal(rows.length, 8);
assert.equal(rows.find((row) => row.waybillNo === "样例-WB-001").profit, 920);
assert.equal(rows.find((row) => row.waybillNo === "样例-WB-002").profit, 480);
assert.equal(rows.find((row) => row.waybillNo === "样例-WB-004").state, "unfinished");
assert.equal(rows.find((row) => row.waybillNo === "样例-WB-005").state, "negative");
assert.equal(rows.find((row) => row.waybillNo === "样例-WB-006").state, "pending");
assert.equal(rows.filter((row) => row.source === "sample").length, 8);
assert.equal(rows.filter((row) => row.ownership === "自营").length, 6);
assert.equal(rows.filter((row) => row.ownership === "三方").length, 2);

console.log("Operations analysis contract test passed");
