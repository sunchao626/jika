const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

const html = fs.readFileSync("index.html", "utf8");
const editorUi = fs.readFileSync("transport-task-config-ui.js", "utf8");
assert.doesNotMatch(html, /运输类型选项|name="transportType"|<th>运输类型<\/th>/, "transport type controls are removed from task configuration");
assert.match(html, /<th>任务类型<\/th><th>运输节点流程<\/th><th>拍照要求<\/th>/);
assert.match(html, /任务类型配置/);
assert.doesNotMatch(html, /transportTaskTypesPanel|运输任务名称|新增运输任务类型/);
assert.match(html, /<select name="taskType" id="planTaskTypeSelect"/);
assert.match(editorUi, /<span>运输节点名称<\/span><input data-node-name/);
assert.doesNotMatch(editorUi, /照片类别/);
assert.match(editorUi, /添加拍照要求/);
assert.match(editorUi, /data-jump-nodes/);
assert.match(editorUi, /data-jump-photos/);
assert.match(editorUi, /target === "photos"/);

const storage = new Map();
const events = [];
const context = vm.createContext({
  localStorage: {
    getItem: (key) => storage.get(key) || null,
    setItem: (key, value) => storage.set(key, value),
  },
  CustomEvent: function CustomEvent(type, init = {}) { this.type = type; this.detail = init.detail; },
  console,
  Date,
  Math,
  window: { dispatchEvent: (event) => events.push(event) },
});
vm.runInContext(fs.readFileSync("dispatch-task-nodes.js", "utf8"), context);

const api = context.window.DispatchTaskNodes;
assert.equal(api.taskTypes().length, 4, "legacy task types are available initially");
assert.equal(api.transportTaskTypes, undefined, "transport task type layer is removed");
assert.deepEqual([...api.get("提空装货")], ["已提空", "空箱在途", "到达仓库", "完成装货", "重箱在途", "重箱进站", "完成落重"]);
assert.equal(api.profile("提空装货").nodes[0].photoRequirements.length, 5, "legacy photo rules migrate to their related node");
assert.deepEqual([...api.distributeLegacyPhotoRequirements("提空装货", [{ id: "X", name: "左侧箱体", quantity: 1 }], api.profile("提空装货").nodes)[0].photoRequirements.map((item) => item.name)], ["左侧箱体"]);
assert.equal(api.transportTypes, undefined, "transport types are not part of the task configuration API");

const profile = {
  id: "TT-CUSTOM",
  name: "冷链回空",
  enabled: true,
  nodes: [
    { id: "COLD-1", name: "冷柜提货", photoRequirements: [{ id: "PHOTO-1", name: "温度屏幕", description: "拍清温度显示值", quantity: 2 }], reminders: { start: { enabled: true, roles: ["调度员"] }, completion: { enabled: false, roles: [] } } },
    { id: "COLD-2", name: "送达签收", photoRequirements: [], reminders: { start: { enabled: false, roles: [] }, completion: { enabled: true, roles: ["车队管理员"] } } },
  ],
};
api.save([...api.load(), profile]);
assert.deepEqual([...api.get("冷链回空")], ["冷柜提货", "送达签收"]);
assert.equal(api.requirementsFor("冷链回空", "冷柜提货")[0].quantity, 2);

const taskSnapshot = api.snapshot("冷链回空");
profile.nodes[0].name = "后台新节点名";
api.save([...api.load().filter((item) => item.name !== "冷链回空"), profile]);
assert.equal(taskSnapshot.nodes[0].name, "冷柜提货", "task snapshots are detached from later configuration edits");

const dispatch = { id: "PD-CUSTOM", taskType: "冷链回空", taskConfigSnapshot: taskSnapshot, orderOperatorName: "李调度", waybillNo: "WB-TEST" };
api.notify(dispatch, "冷柜提货", "start");
const notification = JSON.parse(storage.get(api.NOTIFICATION_STORAGE_KEY))[0];
assert.deepEqual([...notification.recipients], ["调度员", "李调度"]);
assert.equal(events.at(-1).type, "transport-node-notification-created");
const template = { id: "NT-TEST", name: "节点启动提醒", title: "{{当前节点}}已启动", content: "请跟进", recipients: ["车队管理员"], channels: ["站内消息"] };
const templateDispatch = { ...dispatch, id: "PD-TEMPLATE", taskConfigSnapshot: { ...taskSnapshot, nodes: [{ ...taskSnapshot.nodes[0], reminders: { start: { enabled: true, templateId: template.id, templateSnapshot: template } } }] } };
api.notify(templateDispatch, "冷柜提货", "start");
const templateNotification = JSON.parse(storage.get(api.NOTIFICATION_STORAGE_KEY))[0];
assert.equal(templateNotification.templateId, template.id);
assert.equal(templateNotification.title, "冷柜提货已启动");
assert.deepEqual([...templateNotification.recipients], ["车队管理员", "李调度"]);
assert.deepEqual([...templateNotification.channels], ["站内消息"]);
assert.deepEqual([...api.profile("冷链回空").nodes[1].photoRequirements], [], "a node may have no photo requirements");
assert.equal(Object.hasOwn(api.profile("冷链回空"), "transportType"), false, "saved profiles do not expose a transport type");
assert.equal(api.snapshot("冷链回空").name, "冷链回空", "the managed task type itself is selected for new plan tasks");

assert.throws(() => api.save([{ ...profile, nodes: [] }]), /配置至少一个运输节点/);
console.log("Transport task type configuration test passed");

const migratedStorage = new Map([
  ["container-logistics-photo-requirements-v1", JSON.stringify({ "提空装货": [{ id: "OLD-1", name: "左侧箱体", description: "历史照片说明", quantity: 2 }] })],
  ["container-logistics-transport-task-config-v1", JSON.stringify([{ id: "TT-OLD", name: "历史任务", transportType: "公路运输", nodes: [{ id: "N-1", name: "历史节点", photoRequirements: [], reminders: { start: { enabled: true, roles: ["调度员"] } } }] }])],
  ["container-logistics-transport-types-v1", JSON.stringify(["公路运输"])],
]);
const migrationContext = vm.createContext({
  localStorage: {
    getItem: (key) => migratedStorage.get(key) || null,
    setItem: (key, value) => migratedStorage.set(key, value),
  },
  CustomEvent: function CustomEvent(type, init = {}) { this.type = type; this.detail = init.detail; },
  console,
  Date,
  Math,
  window: { dispatchEvent() {}, addEventListener() {} },
});
vm.runInContext(fs.readFileSync("dispatch-task-nodes.js", "utf8"), migrationContext);
const migratedApi = migrationContext.window.DispatchTaskNodes;
assert.equal(migratedApi.profile("历史任务").nodes[0].reminders.start.roles[0], "调度员", "legacy role reminders survive normalization");
assert.equal(Object.hasOwn(migratedApi.profile("历史任务"), "transportType"), false, "legacy task profiles are normalized without transport types");
const migratedConfig = JSON.parse(migratedStorage.get("container-logistics-transport-task-config-v1"));
assert.ok(Array.isArray(migratedConfig), "active configuration stores task types directly");
assert.equal(Object.hasOwn(migratedConfig[0], "transportType"), false, "legacy transport type fields are removed from active configuration storage");
assert.equal(migratedConfig[0].name, "历史任务", "legacy task type names are preserved");
assert.equal(migratedStorage.get("container-logistics-transport-types-v1"), JSON.stringify(["公路运输"]), "obsolete option storage is left untouched as inert legacy data");

const splitStorage = new Map([["container-logistics-transport-task-config-v1", JSON.stringify({
  version: 2,
  taskTypes: [{ id: "TYPE-A", name: "冷链任务", enabled: true, nodes: [{ id: "NODE-A", name: "冷柜提货", photoRequirements: [{ id: "PHOTO-A", name: "温度屏幕", description: "拍清屏幕", quantity: 2 }], reminders: { start: { enabled: false }, completion: { enabled: false } } }] }],
  transportTaskTypes: [{ id: "TT-A", name: "客户冷链", taskTypeId: "TYPE-A", taskTypeName: "冷链任务", enabled: true }],
})]]);
const splitContext = vm.createContext({
  localStorage: { getItem: (key) => splitStorage.get(key) || null, setItem: (key, value) => splitStorage.set(key, value) },
  CustomEvent: function CustomEvent(type, init = {}) { this.type = type; this.detail = init.detail; },
  console, Date, Math, window: { dispatchEvent() {}, addEventListener() {} },
});
vm.runInContext(fs.readFileSync("dispatch-task-nodes.js", "utf8"), splitContext);
const splitApi = splitContext.window.DispatchTaskNodes;
assert.equal(splitApi.profile("冷链任务").nodes[0].photoRequirements[0].quantity, 2, "split-model migration retains node photo requirements");
assert.deepEqual([...splitApi.taskTypes()].map((item) => item.name), ["冷链任务"]);
assert.ok(Array.isArray(JSON.parse(splitStorage.get("container-logistics-transport-task-config-v1"))), "split model migrates back to direct task type storage");
const seedStorage = new Map([
  ["container-logistics-photo-requirements-v1", JSON.stringify({ "提空装货": [{ id: "OLD-SEED", name: "左侧箱体", description: "旧配置照片", quantity: 2 }] })],
]);
const seedContext = vm.createContext({
  localStorage: {
    getItem: (key) => seedStorage.get(key) || null,
    setItem: (key, value) => seedStorage.set(key, value),
  },
  CustomEvent: function CustomEvent(type, init = {}) { this.type = type; this.detail = init.detail; },
  console,
  Date,
  Math,
  window: { dispatchEvent() {}, addEventListener() {} },
});
vm.runInContext(fs.readFileSync("dispatch-task-nodes.js", "utf8"), seedContext);
assert.equal(seedContext.window.DispatchTaskNodes.profile("提空装货").nodes[0].photoRequirements[0].description, "旧配置照片", "initial task profiles migrate saved legacy photo requirements into their node");
console.log("Transport configuration initialization migration test passed");
