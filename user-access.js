(function () {
  const STORAGE_KEY = "container-logistics-user-access-v1";
  const ACTIONS = ["view", "create", "edit", "delete", "export", "special"];
  const ACTION_LABELS = { view: "查看", create: "新增", edit: "编辑", delete: "删除", export: "导出" };
  const MODULES = [
    { group: "计划与派单", id: "waybill", name: "计划与任务", actions: ["view", "create", "edit", "delete", "export"] },
    { group: "计划与派单", id: "dispatchManagement", name: "任务派单", actions: ["view", "special"], special: "派单" },
    { group: "计划与派单", id: "dispatchList", name: "派单列表", actions: ["view", "edit", "export", "special"], special: "调整运力" },
    { group: "计划与派单", id: "capacity", name: "运力管理", actions: ["view", "export"] },
    { group: "线路管理", id: "routes", name: "固定线路管理", actions: ["view", "create", "edit", "delete", "export"] },
    { group: "车辆管理", id: "vehicles", name: "车辆档案管理", actions: ["view", "create", "edit", "delete", "export"] },
    { group: "车辆管理", id: "trailers", name: "挂车档案管理", actions: ["view", "create", "edit", "delete", "export"] },
    { group: "车辆管理", id: "repairs", name: "车辆维修管理", actions: ["view", "create", "edit", "special"], special: "维修审核" },
    { group: "司机管理", id: "drivers", name: "司机档案管理", actions: ["view", "create", "edit", "delete", "export"] },
    { group: "财务管理", id: "finance", name: "运输成本台账", actions: ["view", "edit", "export", "special"], special: "费用审核" },
    { group: "财务管理", id: "driverExpenses", name: "司机费用上报", actions: ["view", "special", "export"], special: "费用审核" },
    { group: "基础资料", id: "customers", name: "客户管理", actions: ["view", "create", "edit", "delete", "export"] },
    { group: "系统配置", id: "reminders", name: "消息提醒模板", actions: ["view", "create", "edit", "delete"] },
    { group: "系统配置", id: "announcements", name: "公告管理", actions: ["view", "create", "edit", "delete"] },
    { group: "系统配置", id: "photoRequirements", name: "司机拍照要求", actions: ["view", "create", "edit", "delete"] },
    { group: "系统配置", id: "autoDispatchConfig", name: "自动派单配置", actions: ["view", "edit", "special"], special: "规则配置" },
    { group: "系统配置", id: "userAccess", name: "用户与权限", actions: ["view", "create", "edit", "delete"] },
  ];
  const EMPTY_PERMISSIONS = () => Object.fromEntries(MODULES.map((module) => [module.id, Object.fromEntries(module.actions.map((action) => [action, false]))]));
  const ALL_PERMISSIONS = () => Object.fromEntries(MODULES.map((module) => [module.id, Object.fromEntries(module.actions.map((action) => [action, true]))]));
  const seed = {
    roles: [
      { id: "role-admin", name: "系统管理员", description: "管理全部业务模块和系统配置", status: "active", isSystem: true, permissions: ALL_PERMISSIONS(), scope: { type: "all", customers: [], projects: [], routes: [] }, updatedAt: "2026-10-01" },
      { id: "role-dispatch", name: "调度员", description: "维护计划并执行日常派单", status: "active", permissions: { ...EMPTY_PERMISSIONS(), waybill: { view: true, create: true, edit: true, delete: false, export: true }, dispatchManagement: { view: true, special: true }, dispatchList: { view: true, edit: true, export: true, special: true }, capacity: { view: true }, routes: { view: true }, vehicles: { view: true }, trailers: { view: true }, drivers: { view: true }, customers: { view: true } }, scope: { type: "all", customers: [], projects: [], routes: [] }, updatedAt: "2026-10-08" },
      { id: "role-finance", name: "财务专员", description: "查看运输费用并审核司机费用上报", status: "active", permissions: { ...EMPTY_PERMISSIONS(), finance: { view: true, edit: true, export: true, special: true }, driverExpenses: { view: true, export: true, special: true }, customers: { view: true } }, scope: { type: "custom", customers: ["customer-hm", "customer-lg"], projects: [], routes: [] }, updatedAt: "2026-10-10" },
      { id: "role-fleet", name: "车队管理员", description: "维护车辆、挂车、司机及维修记录", status: "active", permissions: { ...EMPTY_PERMISSIONS(), vehicles: { view: true, create: true, edit: true, delete: true, export: true }, trailers: { view: true, create: true, edit: true, delete: true, export: true }, repairs: { view: true, create: true, edit: true, special: true }, drivers: { view: true, create: true, edit: true, export: true }, capacity: { view: true } }, scope: { type: "self", customers: [], projects: [], routes: [] }, updatedAt: "2026-10-12" },
    ],
    users: [
      { id: "user-current", account: "zhangdd", name: "张调度", roleId: "role-dispatch", status: "active", lastLogin: "2026-10-14 09:18", isCurrentUser: true },
      { id: "user-admin", account: "admin", name: "系统管理员", roleId: "role-admin", status: "active", lastLogin: "2026-10-14 08:42" },
      { id: "user-finance", account: "wangcw", name: "王财务", roleId: "role-finance", status: "active", lastLogin: "2026-10-13 17:26" },
      { id: "user-fleet", account: "lijiang", name: "李建", roleId: "role-fleet", status: "active", lastLogin: "2026-10-12 18:04" },
    ],
  };

  const clone = (value) => JSON.parse(JSON.stringify(value));
  const clean = (value) => String(value || "").trim();
  const normalizeScope = (scope) => ({
    type: ["all", "self", "custom"].includes(scope?.type) ? scope.type : "all",
    customers: [...new Set(Array.isArray(scope?.customers) ? scope.customers.map(String) : [])],
    projects: [...new Set(Array.isArray(scope?.projects) ? scope.projects.map(String) : [])],
    routes: [...new Set(Array.isArray(scope?.routes) ? scope.routes.map(String) : [])],
  });
  function normalizeRole(role, index = 0) {
    const source = role?.permissions || {};
    const permissions = EMPTY_PERMISSIONS();
    MODULES.forEach((module) => {
      module.actions.forEach((action) => {
        permissions[module.id][action] = Boolean(source[module.id]?.[action]);
      });
      if (Object.values(permissions[module.id]).some(Boolean)) permissions[module.id].view = true;
    });
    return {
      id: clean(role?.id) || `role-${index + 1}`,
      name: clean(role?.name),
      description: clean(role?.description),
      status: role?.status === "disabled" ? "disabled" : "active",
      isSystem: Boolean(role?.isSystem),
      permissions,
      scope: normalizeScope(role?.scope),
      updatedAt: clean(role?.updatedAt),
    };
  }
  function normalizeUser(user, index = 0) {
    return {
      id: clean(user?.id) || `user-${index + 1}`,
      account: clean(user?.account),
      name: clean(user?.name),
      roleId: clean(user?.roleId),
      status: user?.status === "disabled" ? "disabled" : "active",
      lastLogin: clean(user?.lastLogin) || "从未登录",
      isCurrentUser: Boolean(user?.isCurrentUser),
    };
  }
  function normalizeConfiguration(configuration) {
    const roles = Array.isArray(configuration?.roles) ? configuration.roles.map(normalizeRole) : clone(seed.roles);
    const users = Array.isArray(configuration?.users) ? configuration.users.map(normalizeUser) : clone(seed.users);
    return { roles: roles.length ? roles : clone(seed.roles), users };
  }
  function load(storage = localStorage) {
    try {
      const stored = JSON.parse(storage.getItem(STORAGE_KEY) || "null");
      return stored ? normalizeConfiguration(stored) : clone(seed);
    } catch (error) {
      return clone(seed);
    }
  }
  function save(configuration, storage = localStorage) {
    const normalized = normalizeConfiguration(configuration);
    storage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    return clone(normalized);
  }
  function makeId(prefix) {
    return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
  }
  function createUser(configuration, input) {
    const state = normalizeConfiguration(configuration);
    const account = clean(input?.account);
    const name = clean(input?.name);
    const roleId = clean(input?.roleId);
    if (!account || !name || !roleId) return { error: "请填写账号、姓名并选择角色。" };
    if (state.users.some((user) => user.account.toLowerCase() === account.toLowerCase())) return { error: "该登录账号已存在。" };
    if (!state.roles.some((role) => role.id === roleId && role.status === "active")) return { error: "请选择一个已启用的角色。" };
    state.users.push(normalizeUser({ id: makeId("user"), account, name, roleId, status: input.status }));
    return { configuration: state };
  }
  function updateUser(configuration, userId, input) {
    const state = normalizeConfiguration(configuration);
    const user = state.users.find((item) => item.id === userId);
    if (!user) return { error: "未找到该用户。" };
    const account = clean(input?.account);
    const name = clean(input?.name);
    const roleId = clean(input?.roleId);
    if (!account || !name || !roleId) return { error: "请填写账号、姓名并选择角色。" };
    if (state.users.some((item) => item.id !== userId && item.account.toLowerCase() === account.toLowerCase())) return { error: "该登录账号已存在。" };
    if (!state.roles.some((role) => role.id === roleId && (role.status === "active" || roleId === user.roleId))) return { error: "请选择一个已启用的角色。" };
    Object.assign(user, { account, name, roleId, status: input.status === "disabled" ? "disabled" : "active" });
    return { configuration: state };
  }
  function deleteUser(configuration, userId) {
    const state = normalizeConfiguration(configuration);
    const user = state.users.find((item) => item.id === userId);
    if (!user) return { error: "未找到该用户。" };
    if (user.isCurrentUser) return { error: "不能删除当前登录账号；可将其停用以外的账号另行维护。" };
    state.users = state.users.filter((item) => item.id !== userId);
    return { configuration: state };
  }
  function createRole(configuration, input) {
    const state = normalizeConfiguration(configuration);
    const name = clean(input?.name);
    if (!name) return { error: "请输入角色名称。" };
    if (state.roles.some((role) => role.name.toLowerCase() === name.toLowerCase())) return { error: "该角色名称已存在。" };
    state.roles.push(normalizeRole({ id: makeId("role"), ...input, name, updatedAt: new Date().toISOString().slice(0, 10) }));
    return { configuration: state };
  }
  function updateRole(configuration, roleId, input) {
    const state = normalizeConfiguration(configuration);
    const role = state.roles.find((item) => item.id === roleId);
    if (!role) return { error: "未找到该角色。" };
    if (role.isSystem) return { error: "系统内置管理员角色受保护，不能修改。" };
    const name = clean(input?.name);
    if (!name) return { error: "请输入角色名称。" };
    if (state.roles.some((item) => item.id !== roleId && item.name.toLowerCase() === name.toLowerCase())) return { error: "该角色名称已存在。" };
    Object.assign(role, normalizeRole({ ...role, ...input, name, isSystem: false, updatedAt: new Date().toISOString().slice(0, 10) }));
    return { configuration: state };
  }
  function duplicateRole(configuration, roleId) {
    const state = normalizeConfiguration(configuration);
    const role = state.roles.find((item) => item.id === roleId);
    if (!role) return { error: "未找到该角色。" };
    let name = `${role.name}（副本）`;
    let suffix = 2;
    while (state.roles.some((item) => item.name === name)) name = `${role.name}（副本 ${suffix++}）`;
    state.roles.push(normalizeRole({ ...clone(role), id: makeId("role"), name, isSystem: false, updatedAt: new Date().toISOString().slice(0, 10) }));
    return { configuration: state };
  }
  function deleteRole(configuration, roleId) {
    const state = normalizeConfiguration(configuration);
    const role = state.roles.find((item) => item.id === roleId);
    if (!role) return { error: "未找到该角色。" };
    if (role.isSystem) return { error: "系统内置管理员角色受保护，不能删除。" };
    const assigned = state.users.filter((user) => user.roleId === roleId).length;
    if (assigned) return { error: `该角色仍关联 ${assigned} 个用户，请先调整这些用户的角色。` };
    state.roles = state.roles.filter((item) => item.id !== roleId);
    return { configuration: state };
  }
  function setPermission(role, moduleId, action, checked) {
    const module = MODULES.find((item) => item.id === moduleId);
    if (!module || !module.actions.includes(action)) return false;
    if (!role.permissions[moduleId]) role.permissions[moduleId] = Object.fromEntries(module.actions.map((name) => [name, false]));
    if (action === "view" && !checked) {
      module.actions.forEach((name) => { role.permissions[moduleId][name] = false; });
    } else {
      role.permissions[moduleId][action] = Boolean(checked);
      if (checked && action !== "view") role.permissions[moduleId].view = true;
    }
    return true;
  }
  function permissionCount(role) {
    return MODULES.reduce((total, module) => total + module.actions.filter((action) => role.permissions?.[module.id]?.[action]).length, 0);
  }
  function scopeLabel(scope) {
    if (scope?.type === "self") return "仅本人负责 / 创建";
    if (scope?.type !== "custom") return "全部数据";
    const count = ["customers", "projects", "routes"].reduce((total, key) => total + (scope[key]?.length || 0), 0);
    return count ? `指定范围 · ${count} 项` : "指定范围 · 未选择数据";
  }

  if (typeof window !== "undefined") window.UserAccess = { STORAGE_KEY, ACTIONS, ACTION_LABELS, MODULES, clone, load, save, createUser, updateUser, deleteUser, createRole, updateRole, duplicateRole, deleteRole, setPermission, permissionCount, scopeLabel, normalizeConfiguration };
  if (typeof document === "undefined" || !document.querySelector("#userAccessPage")) return;

  const page = document.querySelector("#userAccessPage");
  const userBody = document.querySelector("#userAccessUserBody");
  const roleBody = document.querySelector("#userAccessRoleBody");
  const userForm = document.querySelector("#userAccessUserForm");
  const roleForm = document.querySelector("#userAccessRoleForm");
  const userDialog = document.querySelector("#userAccessUserDialog");
  const roleDialog = document.querySelector("#userAccessRoleDialog");
  const confirmDialog = document.querySelector("#userAccessConfirmDialog");
  const feedback = document.querySelector("#userAccessFeedback");
  let state = load();
  let userRows = state.users.slice();
  let roleRows = state.roles.slice();
  let editingUserId = "";
  let editingRoleId = "";
  let roleDraft = null;
  let userPage = 1;
  let rolePage = 1;
  let pendingAction = null;
  let feedbackTimer = 0;

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
  }
  function persist(message) {
    state = save(state);
    render();
    if (message) showFeedback(message);
  }
  function showFeedback(message) {
    feedback.textContent = message;
    feedback.hidden = false;
    clearTimeout(feedbackTimer);
    feedbackTimer = setTimeout(() => { feedback.hidden = true; }, 2500);
  }
  function roleFor(user) { return state.roles.find((role) => role.id === user.roleId); }
  function refreshRoleOptions() {
    const current = document.querySelector('#userAccessUserQuery [name="role"]');
    const currentValue = current.value;
    current.innerHTML = '<option value="">全部角色</option>' + state.roles.map((role) => `<option value="${escapeHtml(role.id)}">${escapeHtml(role.name)}</option>`).join("");
    current.value = currentValue;
    const input = userForm.elements.roleId;
    const selected = input.value;
    const user = state.users.find((item) => item.id === editingUserId);
    input.innerHTML = '<option value="">请选择角色</option>' + state.roles.filter((role) => role.status === "active" || role.id === user?.roleId).map((role) => `<option value="${escapeHtml(role.id)}">${escapeHtml(role.name)}${role.status === "disabled" ? "（已停用）" : ""}</option>`).join("");
    input.value = selected;
  }
  function updatePageControls(kind, rows, pageNumber) {
    const pageSize = Number(document.querySelector(`#userAccess${kind}PageSize`).value) || 10;
    const pages = Math.max(1, Math.ceil(rows.length / pageSize));
    pageNumber = Math.min(Math.max(1, pageNumber), pages);
    if (kind === "User") userPage = pageNumber; else rolePage = pageNumber;
    document.querySelector(`#userAccess${kind}Current`).textContent = String(pageNumber);
    document.querySelector(`#userAccess${kind}Prev`).disabled = pageNumber <= 1;
    document.querySelector(`#userAccess${kind}Next`).disabled = pageNumber >= pages;
    document.querySelector(`#userAccess${kind}Total`).textContent = `共 ${rows.length} 条记录`;
    return rows.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
  }
  function queryUsers() {
    const values = new FormData(document.querySelector("#userAccessUserQuery"));
    const keyword = clean(values.get("keyword")).toLowerCase();
    userRows = state.users.filter((user) => {
      const role = roleFor(user);
      return (!keyword || `${user.account} ${user.name}`.toLowerCase().includes(keyword)) && (!values.get("role") || user.roleId === values.get("role")) && (!values.get("status") || user.status === values.get("status")) && (role || !user.roleId);
    });
    userPage = 1;
    renderUsers();
  }
  function queryRoles() {
    const values = new FormData(document.querySelector("#userAccessRoleQuery"));
    const keyword = clean(values.get("keyword")).toLowerCase();
    roleRows = state.roles.filter((role) => (!keyword || `${role.name} ${role.description}`.toLowerCase().includes(keyword)) && (!values.get("status") || role.status === values.get("status")));
    rolePage = 1;
    renderRoles();
  }
  function renderUsers() {
    const visible = updatePageControls("User", userRows, userPage);
    document.querySelector("#userAccessUserCount").textContent = `${state.users.length} 人`;
    document.querySelector("#userAccessUserSummary").textContent = `筛选结果 ${userRows.length} 人`;
    userBody.innerHTML = visible.length ? visible.map((user) => {
      const role = roleFor(user);
      return `<tr><td data-label="账号"><strong>${escapeHtml(user.account)}</strong>${user.isCurrentUser ? '<small class="user-access-current-tag">当前账号</small>' : ""}</td><td data-label="姓名">${escapeHtml(user.name)}</td><td data-label="角色">${escapeHtml(role?.name || "未分配")}</td><td data-label="数据范围">${escapeHtml(scopeLabel(role?.scope))}</td><td data-label="状态"><span class="user-access-status ${user.status}">${user.status === "active" ? "启用" : "停用"}</span></td><td data-label="最近登录">${escapeHtml(user.lastLogin || "从未登录")}</td><td class="fixed-action-column" data-label="操作"><div class="vehicle-action-group"><button class="link-btn" data-user-action="edit" data-user-id="${escapeHtml(user.id)}" type="button">编辑</button><button class="link-btn" data-user-action="password" data-user-id="${escapeHtml(user.id)}" type="button">重置密码</button><button class="link-btn" data-user-action="toggle" data-user-id="${escapeHtml(user.id)}" type="button">${user.status === "active" ? "停用" : "启用"}</button><button class="link-btn danger-link" data-user-action="delete" data-user-id="${escapeHtml(user.id)}" type="button" ${user.isCurrentUser ? "disabled title=\"不能删除当前登录账号\"" : ""}>删除</button></div></td></tr>`;
    }).join("") : '<tr><td class="user-access-empty" colspan="7"><strong>没有匹配的用户</strong><span>调整筛选条件，或新增用户账号。</span></td></tr>';
  }
  function renderRoles() {
    const visible = updatePageControls("Role", roleRows, rolePage);
    document.querySelector("#userAccessRoleCount").textContent = `${state.roles.length} 个角色`;
    document.querySelector("#userAccessRoleSummary").textContent = `筛选结果 ${roleRows.length} 个角色`;
    roleBody.innerHTML = visible.length ? visible.map((role) => {
      const userCount = state.users.filter((user) => user.roleId === role.id).length;
      return `<tr><td data-label="角色名称"><strong>${escapeHtml(role.name)}</strong>${role.isSystem ? '<small class="user-access-system-tag"><i data-lucide="shield-check" aria-hidden="true"></i>系统内置</small>' : ""}</td><td data-label="说明">${escapeHtml(role.description || "-")}</td><td data-label="关联用户">${userCount} 人</td><td data-label="功能权限">${permissionCount(role)} 项</td><td data-label="数据范围">${escapeHtml(scopeLabel(role.scope))}</td><td data-label="状态"><span class="user-access-status ${role.status}">${role.status === "active" ? "启用" : "停用"}</span></td><td data-label="更新时间">${escapeHtml(role.updatedAt || "-")}</td><td class="fixed-action-column" data-label="操作"><div class="vehicle-action-group"><button class="link-btn" data-role-action="edit" data-role-id="${escapeHtml(role.id)}" type="button" ${role.isSystem ? "disabled title=\"系统内置管理员角色受保护\"" : ""}>编辑权限</button><button class="link-btn" data-role-action="copy" data-role-id="${escapeHtml(role.id)}" type="button">复制</button><button class="link-btn" data-role-action="toggle" data-role-id="${escapeHtml(role.id)}" type="button" ${role.isSystem ? "disabled title=\"系统内置管理员角色受保护\"" : ""}>${role.status === "active" ? "停用" : "启用"}</button><button class="link-btn danger-link" data-role-action="delete" data-role-id="${escapeHtml(role.id)}" type="button" ${role.isSystem ? "disabled title=\"系统内置管理员角色受保护\"" : ""}>删除</button></div></td></tr>`;
    }).join("") : '<tr><td class="user-access-empty" colspan="8"><strong>没有匹配的角色</strong><span>调整筛选条件，或新增一个角色。</span></td></tr>';
    window.lucide?.createIcons();
  }
  function render() {
    state = normalizeConfiguration(state);
    refreshRoleOptions();
    queryUsers();
    queryRoles();
    window.lucide?.createIcons();
  }
  function renderPermissionMatrix() {
    const body = document.querySelector("#userAccessPermissionBody");
    let group = "";
    body.innerHTML = MODULES.map((module) => {
      const heading = module.group !== group ? `<tr class="user-access-module-group"><th colspan="7">${escapeHtml(module.group)}</th></tr>` : "";
      group = module.group;
      const actions = ["view", "create", "edit", "delete", "export", "special"];
      const cells = actions.map((action) => {
        if (!module.actions.includes(action)) return '<td><span class="user-access-not-applicable" aria-label="不适用">—</span></td>';
        const checked = Boolean(roleDraft.permissions[module.id]?.[action]);
        const label = action === "special" ? module.special : ACTION_LABELS[action];
        return `<td><label class="user-access-permission-check" title="${escapeHtml(label)}"><input type="checkbox" data-permission-module="${module.id}" data-permission-action="${action}" ${checked ? "checked" : ""} /><span class="sr-only">${escapeHtml(module.name)}${escapeHtml(label)}权限</span></label></td>`;
      }).join("");
      return `${heading}<tr><th scope="row">${escapeHtml(module.name)}</th>${cells}</tr>`;
    }).join("");
    body.querySelectorAll('[data-permission-module][data-permission-action="view"]').forEach((checkbox) => {
      const module = MODULES.find((item) => item.id === checkbox.dataset.permissionModule);
      body.querySelectorAll(`[data-permission-module="${module.id}"]`).forEach((item) => { if (item.dataset.permissionAction !== "view") item.disabled = !checkbox.checked; });
    });
  }
  function dataOptions() {
    const snapshot = window.AdminDataBridge?.read?.() || {};
    const customers = window.AdminDataBridge?.readCustomers?.() || [];
    const customerOptions = customers.map((item) => ({ id: item.customerId || item.id || item.customerNo, name: item.customerName || item.fullName || item.name })).filter((item) => item.id && item.name);
    const projects = new Map();
    (snapshot.waybills || []).forEach((item) => { if (item.projectId && item.projectName) projects.set(item.projectId, item.projectName); });
    const routes = (snapshot.fixedRoutes || []).map((item) => ({ id: item.id, name: item.routeName || item.name })).filter((item) => item.id && item.name);
    return [
      { key: "customers", title: "客户", options: customerOptions.length ? customerOptions : [{ id: "customer-hm", name: "华贸" }, { id: "customer-lg", name: "陆港多联" }] },
      { key: "projects", title: "项目", options: [...projects].map(([id, name]) => ({ id, name })) },
      { key: "routes", title: "线路", options: routes },
    ];
  }
  function renderScopePicker() {
    const picker = document.querySelector("#userAccessScopePicker");
    const scope = roleDraft.scope;
    picker.hidden = scope.type !== "custom";
    if (scope.type !== "custom") return;
    picker.innerHTML = dataOptions().map((group) => `<fieldset class="user-access-scope-group"><legend>${escapeHtml(group.title)} <small>${scope[group.key].length} 项已选</small></legend>${group.options.length ? `<div>${group.options.map((option) => `<label><input type="checkbox" data-scope-key="${group.key}" value="${escapeHtml(option.id)}" ${scope[group.key].includes(String(option.id)) ? "checked" : ""} /><span>${escapeHtml(option.name)}</span></label>`).join("")}</div>` : '<p class="user-access-scope-empty">暂无可选项目，可先维护基础资料。</p>'}</fieldset>`).join("");
  }
  function openUser(userId = "") {
    editingUserId = userId;
    userForm.reset();
    const user = state.users.find((item) => item.id === userId);
    userForm.elements.account.value = user?.account || "";
    userForm.elements.name.value = user?.name || "";
    userForm.elements.roleId.value = user?.roleId || "";
    userForm.elements.status.value = user?.status || "active";
    userForm.elements.account.readOnly = Boolean(user?.isCurrentUser);
    userForm.elements.roleId.disabled = Boolean(user?.isCurrentUser);
    userForm.elements.status.disabled = Boolean(user?.isCurrentUser);
    document.querySelector("#userAccessUserFormTitle").textContent = user ? "编辑用户" : "新增用户";
    document.querySelector("#userAccessUserFormTip").textContent = user?.isCurrentUser ? "当前登录账号受保护，仅可修改姓名" : "权限和数据范围继承所选角色";
    userDialog.showModal();
  }
  function openRole(roleId = "") {
    editingRoleId = roleId;
    const role = state.roles.find((item) => item.id === roleId);
    roleDraft = role ? clone(role) : normalizeRole({ id: "draft", name: "", permissions: EMPTY_PERMISSIONS(), scope: { type: "all" } });
    roleForm.reset();
    roleForm.elements.name.value = role?.name || "";
    roleForm.elements.description.value = role?.description || "";
    roleForm.elements.status.value = role?.status || "active";
    roleForm.querySelectorAll('[name="scopeType"]').forEach((input) => { input.checked = input.value === (roleDraft.scope.type || "all"); });
    const locked = Boolean(role?.isSystem);
    roleForm.elements.name.readOnly = locked;
    roleForm.elements.description.readOnly = locked;
    roleForm.elements.status.disabled = locked;
    document.querySelector("#userAccessLockedRoleNote").hidden = !locked;
    document.querySelector("#userAccessRoleFormTitle").textContent = role ? `编辑角色：${role.name}` : "新增角色";
    renderPermissionMatrix();
    renderScopePicker();
    roleDialog.showModal();
    window.lucide?.createIcons();
  }
  function closeDialog(dialog) { if (dialog.open) dialog.close(); }
  function askConfirm(title, message, label, action, danger = true) {
    document.querySelector("#userAccessConfirmTitle").textContent = title;
    document.querySelector("#userAccessConfirmText").textContent = message;
    const button = document.querySelector("#confirmUserAccessAction");
    button.textContent = label;
    button.classList.toggle("danger", danger);
    button.classList.toggle("primary", !danger);
    pendingAction = action;
    confirmDialog.showModal();
  }
  function collectRoleForm() {
    roleDraft.name = clean(roleForm.elements.name.value);
    roleDraft.description = clean(roleForm.elements.description.value);
    roleDraft.status = roleForm.elements.status.value;
    roleDraft.scope.type = roleForm.querySelector('[name="scopeType"]:checked')?.value || "all";
    return clone(roleDraft);
  }
  function collectScopeChange(input) {
    const key = input.dataset.scopeKey;
    const values = new Set(roleDraft.scope[key]);
    if (input.checked) values.add(input.value); else values.delete(input.value);
    roleDraft.scope[key] = [...values];
    renderScopePicker();
  }
  function handleUserAction(action, userId) {
    const user = state.users.find((item) => item.id === userId);
    if (!user) return;
    if (action === "edit") return openUser(userId);
    if (action === "toggle") {
      if (user.isCurrentUser) return showFeedback("不能停用当前登录账号。");
      user.status = user.status === "active" ? "disabled" : "active";
      return persist(user.status === "active" ? "用户已启用。" : "用户已停用。已登录会话需由服务端策略处理。 ");
    }
    if (action === "delete") return askConfirm("删除用户", `确认删除用户“${user.name}”（${user.account}）？删除后该演示账号将从列表移除。`, "确认删除用户", () => {
      const result = deleteUser(state, userId);
      if (result.error) return showFeedback(result.error);
      state = result.configuration; persist("用户已删除。");
    });
    if (action === "password") return askConfirm("重置用户密码", `确认重置“${user.name}”的演示密码？实际系统应通过服务端生成并安全交付临时凭据。`, "确认重置密码", () => showFeedback("演示密码重置操作已记录；当前原型不生成真实登录凭据。"), false);
  }
  function handleRoleAction(action, roleId) {
    const role = state.roles.find((item) => item.id === roleId);
    if (!role) return;
    if (action === "edit") return openRole(roleId);
    if (action === "copy") {
      const result = duplicateRole(state, roleId);
      if (result.error) return showFeedback(result.error);
      state = result.configuration; persist(`已复制角色“${role.name}”。`);
      return openRole(state.roles.at(-1).id);
    }
    if (action === "toggle") {
      if (role.isSystem) return showFeedback("系统内置管理员角色受保护。");
      if (role.status === "active") return askConfirm("停用角色", `停用“${role.name}”后，${state.users.filter((user) => user.roleId === role.id).length} 个关联用户将失去此角色提供的可用权限。确认停用？`, "确认停用角色", () => { role.status = "disabled"; role.updatedAt = new Date().toISOString().slice(0, 10); persist("角色已停用。关联用户仍可登录，但不再获得该角色配置的权限。"); });
      role.status = "active"; role.updatedAt = new Date().toISOString().slice(0, 10); persist("角色已启用。");
      return;
    }
    if (action === "delete") return askConfirm("删除角色", `确认删除角色“${role.name}”？${state.users.some((user) => user.roleId === role.id) ? "此角色仍有关联用户，删除前需先调整用户角色。" : "删除后角色配置无法恢复。"}`, "确认删除角色", () => {
      const result = deleteRole(state, roleId);
      if (result.error) return showFeedback(result.error);
      state = result.configuration; persist("角色已删除。");
    });
  }

  document.querySelectorAll("[data-access-tab]").forEach((tab) => tab.addEventListener("click", () => {
    const roles = tab.dataset.accessTab === "roles";
    document.querySelectorAll("[data-access-tab]").forEach((item) => { const active = item === tab; item.classList.toggle("active", active); item.setAttribute("aria-selected", String(active)); });
    document.querySelector("#userAccessUsersPanel").hidden = roles;
    document.querySelector("#userAccessRolesPanel").hidden = !roles;
  }));
  document.querySelector("#userAccessUserQuery").addEventListener("submit", (event) => { event.preventDefault(); queryUsers(); });
  document.querySelector("#userAccessUserQuery").addEventListener("reset", () => setTimeout(queryUsers));
  document.querySelector("#userAccessRoleQuery").addEventListener("submit", (event) => { event.preventDefault(); queryRoles(); });
  document.querySelector("#userAccessRoleQuery").addEventListener("reset", () => setTimeout(queryRoles));
  document.querySelector("#addAccessUserBtn").addEventListener("click", () => openUser());
  document.querySelector("#addAccessRoleBtn").addEventListener("click", () => openRole());
  userBody.addEventListener("click", (event) => { const button = event.target.closest("[data-user-action]"); if (button) handleUserAction(button.dataset.userAction, button.dataset.userId); });
  roleBody.addEventListener("click", (event) => { const button = event.target.closest("[data-role-action]"); if (button) handleRoleAction(button.dataset.roleAction, button.dataset.roleId); });
  userForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = Object.fromEntries(new FormData(userForm));
    if (editingUserId && state.users.find((item) => item.id === editingUserId)?.isCurrentUser) { input.account = state.users.find((item) => item.id === editingUserId).account; input.roleId = state.users.find((item) => item.id === editingUserId).roleId; }
    const result = editingUserId ? updateUser(state, editingUserId, input) : createUser(state, input);
    if (result.error) return showFeedback(result.error);
    state = result.configuration; closeDialog(userDialog); persist(editingUserId ? "用户信息已保存。" : "用户已新增。");
  });
  roleForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (roleDraft.isSystem) return showFeedback("系统内置管理员角色不能修改。");
    const input = collectRoleForm();
    const linkedUsers = state.users.filter((user) => user.roleId === editingRoleId && user.status === "active");
    if (editingRoleId && input.status === "disabled" && linkedUsers.length) return askConfirm("停用关联角色", `停用后 ${linkedUsers.length} 个启用用户将失去此角色提供的可用权限。确认保存？`, "确认停用并保存", () => saveRole(input), false);
    saveRole(input);
  });
  function saveRole(input) {
    const result = editingRoleId ? updateRole(state, editingRoleId, input) : createRole(state, input);
    if (result.error) return showFeedback(result.error);
    state = result.configuration; closeDialog(roleDialog); persist(editingRoleId ? "角色权限已保存。" : "角色已新增。");
  }
  document.querySelector("#userAccessPermissionBody").addEventListener("change", (event) => {
    const input = event.target.closest("[data-permission-module]");
    if (!input) return;
    setPermission(roleDraft, input.dataset.permissionModule, input.dataset.permissionAction, input.checked);
    renderPermissionMatrix();
  });
  document.querySelector("#userAccessToggleAllPermissions").addEventListener("click", (event) => {
    const checkAll = event.currentTarget.dataset.all !== "true";
    MODULES.forEach((module) => module.actions.forEach((action) => setPermission(roleDraft, module.id, action, checkAll)));
    event.currentTarget.dataset.all = String(checkAll);
    event.currentTarget.textContent = checkAll ? "清空功能权限" : "全选功能权限";
    renderPermissionMatrix();
  });
  roleForm.querySelectorAll('[name="scopeType"]').forEach((input) => input.addEventListener("change", () => { roleDraft.scope.type = input.value; renderScopePicker(); }));
  document.querySelector("#userAccessScopePicker").addEventListener("change", (event) => { const input = event.target.closest("[data-scope-key]"); if (input) collectScopeChange(input); });
  document.querySelector("#confirmUserAccessAction").addEventListener("click", () => { const action = pendingAction; pendingAction = null; closeDialog(confirmDialog); action?.(); });
  document.querySelector("#cancelUserAccessConfirm").addEventListener("click", () => { pendingAction = null; closeDialog(confirmDialog); });
  document.querySelectorAll("#closeUserAccessUserDialog, #cancelUserAccessUserDialog").forEach((button) => button.addEventListener("click", () => closeDialog(userDialog)));
  document.querySelectorAll("#closeUserAccessRoleDialog, #cancelUserAccessRoleDialog").forEach((button) => button.addEventListener("click", () => closeDialog(roleDialog)));
  [userDialog, roleDialog, confirmDialog].forEach((dialog) => dialog.addEventListener("cancel", (event) => { event.preventDefault(); closeDialog(dialog); pendingAction = null; }));
  ["User", "Role"].forEach((kind) => {
    document.querySelector(`#userAccess${kind}PageSize`).addEventListener("change", () => { if (kind === "User") renderUsers(); else renderRoles(); });
    document.querySelector(`#userAccess${kind}Prev`).addEventListener("click", () => { if (kind === "User") { userPage -= 1; renderUsers(); } else { rolePage -= 1; renderRoles(); } });
    document.querySelector(`#userAccess${kind}Next`).addEventListener("click", () => { if (kind === "User") { userPage += 1; renderUsers(); } else { rolePage += 1; renderRoles(); } });
  });
  window.addEventListener("storage", (event) => { if (event.key === STORAGE_KEY) { state = load(); render(); } });
  window.UserAccessManager = { render, loadState: () => clone(state) };
  render();
})();
