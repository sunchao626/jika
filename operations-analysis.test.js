const assert = require("node:assert/strict");
const { SAMPLE_ROWS, enrich, aggregateOperations } = require("./operations-analysis.js");

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

const profitRows = aggregateOperations([
  { customerId: "C1", customerName: "客户甲", revenue: 100, cost: 60, taxBasisConfirmed: false },
  { customerId: "C1", customerName: "客户甲", revenue: 200, cost: 100, taxBasisConfirmed: true },
], "customer");
assert.equal(profitRows[0].profit, 100);
assert.equal(profitRows[0].profitKnown, 1);
assert.equal(profitRows[0].knownRevenue, 200);
assert.equal(profitRows[0].taxPending, 1);

console.log("Operations analysis contract test passed");
