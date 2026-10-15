const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

const source = fs.readFileSync("photo-requirements.js", "utf8");
const taskNodesSource = fs.readFileSync("dispatch-task-nodes.js", "utf8");
const storage = new Map();
const events = [];
const context = vm.createContext({
  window: { dispatchEvent: (event) => events.push(event) },
  localStorage: {
    getItem: (key) => storage.get(key) || null,
    setItem: (key, value) => storage.set(key, value),
  },
  CustomEvent: function CustomEvent(type, init) { this.type = type; this.detail = init.detail; },
  console,
});

vm.runInContext(taskNodesSource, context);
vm.runInContext(source, context);

const api = context.window.PhotoRequirementConfig;
const initial = api.load();
const taskTypes = Object.keys(context.window.DispatchTaskNodes.sequences);
assert.deepEqual([...Object.keys(initial)], taskTypes);
for (const taskType of taskTypes) {
  assert.ok(initial[taskType].length > 0, `${taskType} should have starter requirements`);
  for (const requirement of initial[taskType]) {
    assert.ok(requirement.id);
    assert.ok(requirement.name);
    assert.ok(requirement.description);
    assert.ok(Number.isInteger(requirement.quantity) && requirement.quantity >= 1 && requirement.quantity <= 99);
  }
}

const updated = api.load();
updated[taskTypes[0]] = [{ id: "custom-1", name: "封号照片", description: "封号完整清楚", quantity: 2 }];
updated[taskTypes[1]] = [];
const saved = api.save(updated);
assert.equal(JSON.parse(storage.get(api.STORAGE_KEY))[taskTypes[0]][0].quantity, 2);
assert.deepEqual([...api.forTaskType(taskTypes[0], saved)].map((item) => item.name), ["封号照片"]);
assert.deepEqual([...api.forTaskType(taskTypes[1], saved)], [], "an intentionally empty task type stays empty");
assert.equal(events.at(-1).type, "photo-requirements-updated");

const escaped = api.load();
escaped[taskTypes[0]][0].quantity = 0;
const normalized = api.save(escaped);
assert.equal(normalized[taskTypes[0]][0].quantity, 1, "saved quantities are normalized to the supported range");
assert.notEqual(api.forTaskType(taskTypes[0])[0], api.forTaskType(taskTypes[0])[0], "consumers receive independent requirement copies");

console.log("Photo requirement configuration test passed");
