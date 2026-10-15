const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = __dirname;
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
const source = fs.readFileSync(path.join(root, "user-access.js"), "utf8");
const styles = fs.readFileSync(path.join(root, "styles.css"), "utf8");
const storage = new Map();
const context = vm.createContext({
  window: {},
  localStorage: {
    getItem: (key) => storage.get(key) || null,
    setItem: (key, value) => storage.set(key, value),
  },
  Date,
  Math,
});
vm.runInContext(source, context);
const api = context.window.UserAccess;

test("user and role management is linked from system settings", () => {
  assert.match(html, /data-page="user-access"[^>]*>用户与权限/);
  assert.match(app, /"user-access": \{ title: "用户与权限", kicker: "系统配置 \/ 用户与权限", view: "userAccess" \}/);
  assert.match(html, /id="userAccessPermissionBody"/);
  assert.match(html, /id="userAccessScopePicker"/);
  assert.match(html, /未接入服务端鉴权/);
  assert.match(html, /<dialog class="vehicle-dialog admin-form-dialog user-access-user-dialog" id="userAccessUserDialog"/);
  assert.match(html, /<dialog class="vehicle-dialog admin-form-dialog user-access-role-dialog" id="userAccessRoleDialog"/);
  assert.match(source, /addAccessUserBtn"\)\.addEventListener\("click", \(\) => openUser\(\)\)/);
  assert.match(source, /addAccessRoleBtn"\)\.addEventListener\("click", \(\) => openRole\(\)/);
  assert.match(styles, /dialog\.admin-form-dialog\.user-access-user-dialog\[open\][\s\S]*?margin: auto !important/);
  assert.match(styles, /\.user-access-table \{ width: 100%; min-width: 0; table-layout: fixed/);
  assert.match(styles, /@media \(max-width: 900px\)[\s\S]*?\.user-access-table tbody tr \{ display: grid/);
});

test("user CRUD validates account uniqueness and protects the current account", () => {
  const initial = api.load();
  assert.match(api.createUser(initial, { account: "ZHANGDD", name: "重复账号", roleId: "role-dispatch" }).error, /已存在/);
  assert.match(api.createUser(initial, { account: "new-user", name: "新用户", roleId: "missing-role" }).error, /已启用的角色/);
  const disabledRoleState = api.clone(initial);
  disabledRoleState.roles.find((role) => role.id === "role-dispatch").status = "disabled";
  assert.match(api.createUser(disabledRoleState, { account: "new-user", name: "新用户", roleId: "role-dispatch" }).error, /已启用的角色/);
  assert.equal(api.updateUser(disabledRoleState, "user-current", { account: "zhangdd", name: "张调度甲", roleId: "role-dispatch", status: "active" }).configuration.users[0].name, "张调度甲", "users can still edit profile fields while retaining a disabled assigned role");
  const created = api.createUser(initial, { account: "new-user", name: "新用户", roleId: "role-dispatch" });
  assert.equal(created.configuration.users.at(-1).name, "新用户");
  const updated = api.updateUser(created.configuration, created.configuration.users.at(-1).id, { account: "new-user", name: "新用户甲", roleId: "role-fleet", status: "disabled" });
  assert.equal(updated.configuration.users.at(-1).status, "disabled");
  assert.match(api.deleteUser(initial, "user-current").error, /当前登录账号/);
  assert.equal(api.deleteUser(updated.configuration, updated.configuration.users.at(-1).id).configuration.users.length, initial.users.length);
});

test("roles support create, edit, copy, and delete with assignment and system safeguards", () => {
  const initial = api.load();
  assert.match(api.updateRole(initial, "role-admin", { name: "改名" }).error, /内置管理员/);
  assert.match(api.deleteRole(initial, "role-admin").error, /内置管理员/);
  assert.match(api.deleteRole(initial, "role-dispatch").error, /仍关联/);
  const duplicate = api.duplicateRole(initial, "role-dispatch");
  const copied = duplicate.configuration.roles.at(-1);
  assert.equal(copied.name, "调度员（副本）");
  assert.equal(copied.permissions.dispatchManagement.special, true);
  const saved = api.updateRole(duplicate.configuration, copied.id, { ...copied, name: "区域调度", scope: { type: "custom", customers: ["c1"], projects: [], routes: ["r1"] } });
  assert.equal(saved.configuration.roles.at(-1).scope.routes[0], "r1");
  const removed = api.deleteRole(saved.configuration, copied.id);
  assert.equal(removed.configuration.roles.some((role) => role.id === copied.id), false);
});

test("permission dependencies and data scope summaries stay consistent", () => {
  const role = api.load().roles.find((item) => item.id === "role-dispatch");
  assert.equal(api.setPermission(role, "finance", "edit", true), true);
  assert.equal(role.permissions.finance.view, true, "granting an operation also grants module view");
  api.setPermission(role, "finance", "view", false);
  assert.equal(Object.values(role.permissions.finance).some(Boolean), false, "revoking view clears all module actions");
  assert.equal(api.scopeLabel({ type: "self" }), "仅本人负责 / 创建");
  assert.equal(api.scopeLabel({ type: "custom", customers: ["c1"], projects: [], routes: ["r1"] }), "指定范围 · 2 项");
  assert.match(api.scopeLabel({ type: "custom", customers: [], projects: [], routes: [] }), /未选择数据/);
});

test("renamed modules keep stable permission identifiers and grants", () => {
  assert.equal(api.MODULES.find((module) => module.id === "waybill").name, "计划与任务");
  assert.equal(api.MODULES.find((module) => module.id === "dispatchManagement").name, "任务派单");
  const dispatcher = api.load().roles.find((role) => role.id === "role-dispatch");
  assert.equal(dispatcher.permissions.waybill.view, true);
  assert.equal(dispatcher.permissions.dispatchManagement.special, true);
});

test("configuration persists normalized permission and scope data", () => {
  const initial = api.load();
  initial.roles.find((role) => role.id === "role-finance").scope = { type: "custom", customers: ["c1"], projects: [], routes: [] };
  const saved = api.save(initial);
  const reloaded = api.load();
  assert.equal(JSON.parse(storage.get(api.STORAGE_KEY)).roles.length, saved.roles.length);
  assert.deepEqual([...reloaded.roles.find((role) => role.id === "role-finance").scope.customers], ["c1"]);
  assert.equal(reloaded.roles.find((role) => role.id === "role-finance").permissions.finance.view, true);
});

console.log("User access configuration tests passed");
