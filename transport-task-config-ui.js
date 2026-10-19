(() => {
  const page = document.querySelector("#transportTaskConfigPage");
  const dialog = document.querySelector("#transportTaskEditorDialog");
  const form = document.querySelector("#transportTaskEditorForm");
  const list = document.querySelector("#transportNodeEditorList");
  const body = document.querySelector("#transportTaskConfigBody");
  if (!page || !dialog || !form || !list || !body) return;

  const escape = (value) => String(value ?? "").replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
  const reminderTemplates = () => window.ReminderTemplateManager?.list?.({ enabledOnly: true }) || [];
  let profiles = window.DispatchTaskNodes.load();
  let editingId = "";
  let draftNodes = [];
  let nodeCounter = 0;

  function ruleEditor(rule = {}) {
    return `<div class="transport-photo-rule" data-photo-rule>
      <label><span>拍照要求</span><input data-rule-name maxlength="60" value="${escape(rule.name || "")}" placeholder="如：车牌照片" /></label>
      <label><span>数量（张）</span><input data-rule-quantity type="number" min="1" max="99" value="${Number(rule.quantity) || 1}" /></label>
      <label class="transport-photo-description"><span>拍摄说明</span><input data-rule-description maxlength="160" value="${escape(rule.description || "")}" placeholder="说明需要拍摄的内容和清晰度要求" /></label>
      <button class="icon-btn transport-remove-rule" data-remove-rule type="button" aria-label="删除拍照要求" title="删除拍照要求"><i data-lucide="trash-2" aria-hidden="true"></i></button>
    </div>`;
  }

  function renderNodes() {
    list.innerHTML = draftNodes.length ? draftNodes.map((node, index) => {
      const reminder = (eventName, label) => {
        const rule = node.reminders?.[eventName] || { enabled: false, templateId: "", roles: [] };
        const legacyId = rule.enabled && !rule.templateId && rule.roles?.length ? "__legacy__" : "";
        const templates = reminderTemplates();
        const options = templates.map((template) => `<option value="${escape(template.id)}" ${rule.templateId === template.id ? "selected" : ""}>${escape(template.name)} · ${escape(template.eventType || "业务提醒")}</option>`).join("");
        const savedTemplate = rule.templateId && !templates.some((template) => template.id === rule.templateId)
          ? `<option value="${escape(rule.templateId)}" selected>${escape(rule.templateSnapshot?.name || rule.templateId)}（已停用）</option>`
          : "";
        return `<label class="transport-reminder-rule"><span class="transport-reminder-label">节点${label}时提醒</span><select data-reminder-template="${eventName}"><option value="">不提醒</option>${legacyId ? '<option value="__legacy__" selected>旧版角色提醒（兼容）</option>' : ""}${savedTemplate}${options}</select>${legacyId ? `<small>旧接收角色：${escape(rule.roles.join("、"))}</small>` : ""}</label>`;
      };
      return `<article class="transport-node-editor" data-node-index="${index}">
        <header><div class="transport-node-order"><span>${String(index + 1).padStart(2, "0")}</span><div><button class="icon-btn" data-node-up type="button" aria-label="节点上移" title="上移" ${index === 0 ? "disabled" : ""}><i data-lucide="chevron-up" aria-hidden="true"></i></button><button class="icon-btn" data-node-down type="button" aria-label="节点下移" title="下移" ${index === draftNodes.length - 1 ? "disabled" : ""}><i data-lucide="chevron-down" aria-hidden="true"></i></button></div></div><label class="transport-node-name"><span>运输节点名称</span><input data-node-name maxlength="60" required value="${escape(node.name)}" placeholder="请输入运输节点名称" /></label><button class="icon-btn transport-remove-node" data-node-remove type="button" title="删除节点" aria-label="删除节点"><i data-lucide="trash-2" aria-hidden="true"></i></button></header>
        <section class="transport-node-photos" data-node-photos data-has-photo="${node.photoRequirements?.length ? "true" : "false"}"><div class="transport-subheading"><strong>拍照要求</strong><button class="link-btn" data-add-rule type="button"><i data-lucide="plus" aria-hidden="true"></i>添加拍照要求</button></div><div class="transport-photo-rule-list">${(node.photoRequirements || []).map(ruleEditor).join("") || '<p class="transport-node-empty">此节点无需拍照</p>'}</div></section>
        <section class="transport-node-reminders"><div class="transport-subheading"><strong>消息提醒</strong><small>订单操作人员会与模板接收对象一同收到提醒</small></div>${reminder("start", "开始")}${reminder("completion", "完成")}</section>
      </article>`;
    }).join("") : '<div class="transport-node-empty transport-node-empty-large">请添加至少一个运输节点</div>';
    window.lucide?.createIcons();
  }

  function refreshTaskTypeChoices() {
    const enabled = window.DispatchTaskNodes.taskTypes();
    const taskTypeSelect = document.querySelector("#planTaskTypeSelect");
    if (taskTypeSelect) {
      const value = taskTypeSelect.value;
      taskTypeSelect.innerHTML = enabled.map((item) => `<option value="${escape(item.name)}">${escape(item.name)}</option>`).join("");
      taskTypeSelect.value = enabled.some((item) => item.name === value) ? value : (enabled[0]?.name || "");
    }
    const select = document.querySelector("#planTaskTemplateTaskType");
    if (select) {
      const value = select.value;
      select.innerHTML = enabled.map((type) => `<option value="${escape(type.name)}">${escape(type.name)}</option>`).join("");
      select.value = enabled.some((type) => type.name === value) ? value : (enabled[0]?.name || "");
    }
    const dispatchFilter = document.querySelector("#dispatchManagementTaskTypeFilter");
    if (dispatchFilter) {
      const value = dispatchFilter.value;
      dispatchFilter.innerHTML = '<option value="">全部类型</option>' + enabled.map((type) => `<option value="${escape(type.name)}">${escape(type.name)}</option>`).join("");
      dispatchFilter.value = enabled.some((type) => type.name === value) ? value : "";
    }
    window.dispatchEvent(new CustomEvent("task-types-refreshed", { detail: enabled }));
  }

  function render() {
    profiles = window.DispatchTaskNodes.load();
    body.innerHTML = profiles.map((profile) => {
      const photoCount = profile.nodes.reduce((sum, node) => sum + node.photoRequirements.length, 0);
      const nodeNames = profile.nodes.map((node) => escape(node.name)).join(" → ") || "暂无节点";
      return `<tr><td><strong>${escape(profile.name)}</strong></td><td class="transport-config-nodes"><button class="transport-config-jump link-btn" data-jump-nodes="${escape(profile.id)}" type="button">${nodeNames}</button></td><td><button class="transport-config-jump link-btn" data-jump-photos="${escape(profile.id)}" type="button">${photoCount} 项</button></td><td><span class="transport-config-state ${profile.enabled ? "enabled" : "disabled"}">${profile.enabled ? "启用" : "停用"}</span></td><td class="fixed-action-column"><div class="transport-config-actions"><button class="link-btn" data-edit-profile="${escape(profile.id)}" type="button">编辑</button><button class="link-btn" data-toggle-profile="${escape(profile.id)}" type="button">${profile.enabled ? "停用" : "启用"}</button></div></td></tr>`;
    }).join("") || '<tr><td colspan="5" class="no-data-cell">暂无任务类型</td></tr>';
    refreshTaskTypeChoices();
    window.lucide?.createIcons();
  }

  function recordChange(action, profile, before = null) {
    window.OperationLogManager?.record?.({
      moduleId: "platform",
      moduleName: "任务类型配置",
      actionId: action,
      actionName: action === "create" ? "新增任务类型" : action === "toggle" ? "调整任务类型状态" : "修改任务类型配置",
      operatorId: "user-current",
      operatorName: "张调度",
      operatorAccount: "zhangdd",
      roleName: "调度管理员",
      targetType: "任务类型配置",
      targetId: profile.id,
      targetLabel: profile.name,
      content: `任务类型“${profile.name}”的运输节点、拍照要求和提醒配置已保存。`,
      changes: [{ field: "configuration", label: "任务配置快照", before: before ? JSON.stringify(before) : "新增", after: JSON.stringify(profile) }],
    });
  }

  function openEditor(profile = null, target = "nodes") {
    editingId = profile?.id || "";
    form.reset();
    form.elements.name.value = profile?.name || "";
    form.elements.enabled.checked = profile?.enabled !== false;
    draftNodes = profile ? JSON.parse(JSON.stringify(profile.nodes)) : [];
    nodeCounter = draftNodes.length;
    document.querySelector("#transportTaskEditorTitle").textContent = profile ? "编辑任务类型" : "新增任务类型";
    renderNodes();
    dialog.showModal();
    requestAnimationFrame(() => {
      const targetElement = target === "photos"
        ? list.querySelector('[data-node-photos][data-has-photo="true"]') || list.querySelector("[data-node-photos]")
        : target === "node-list" ? document.querySelector(".transport-node-editor-section") : list.querySelector("[data-node-index]");
      targetElement?.scrollIntoView({ behavior: "smooth", block: "center" });
      if (target === "nodes") list.querySelector("[data-node-index] [data-node-name]")?.focus({ preventScroll: true });
    });
  }

  function collectNodes() {
    return [...list.querySelectorAll("[data-node-index]")].map((element) => {
      const name = element.querySelector("[data-node-name]").value.trim();
      const photoRequirements = [...element.querySelectorAll("[data-photo-rule]")].map((rule, index) => ({
        id: `${draftNodes[Number(element.dataset.nodeIndex)]?.id || element.dataset.nodeIndex}-PR-${index + 1}`,
        name: rule.querySelector("[data-rule-name]").value.trim(),
        quantity: Number(rule.querySelector("[data-rule-quantity]").value),
        description: rule.querySelector("[data-rule-description]").value.trim(),
      })).filter((rule) => rule.name);
      const reminders = Object.fromEntries(["start", "completion"].map((eventName) => {
        const templateId = element.querySelector(`[data-reminder-template="${eventName}"]`).value;
        const previous = draftNodes[Number(element.dataset.nodeIndex)]?.reminders?.[eventName] || {};
        const template = templateId && templateId !== "__legacy__" ? window.ReminderTemplateManager?.get?.(templateId) : null;
        return [eventName, templateId === "__legacy__"
          ? { ...previous, enabled: true }
          : { enabled: Boolean(templateId), templateId, templateSnapshot: template ? JSON.parse(JSON.stringify(template)) : null, roles: [] }];
      }));
      return { id: draftNodes[Number(element.dataset.nodeIndex)]?.id || `${form.elements.name.value.trim()}-${element.dataset.nodeIndex}`, name, photoRequirements, reminders };
    });
  }

  document.querySelector("#addTransportTaskTypeBtn").addEventListener("click", () => openEditor());
  document.querySelector("#closeTransportTaskEditorBtn").addEventListener("click", () => dialog.close());
  document.querySelector("#cancelTransportTaskEditorBtn").addEventListener("click", () => dialog.close());
  document.querySelector("#addTransportNodeBtn").addEventListener("click", () => {
    draftNodes = collectNodes();
    draftNodes.push({ id: `NODE-${Date.now()}-${nodeCounter++}`, name: "", photoRequirements: [], reminders: { start: { enabled: false, roles: [] }, completion: { enabled: false, roles: [] } } });
    renderNodes();
    list.querySelector("[data-node-index]:last-child [data-node-name]")?.focus();
  });
  list.addEventListener("click", (event) => {
    const nodeElement = event.target.closest("[data-node-index]");
    if (!nodeElement) return;
    const index = Number(nodeElement.dataset.nodeIndex);
    if (event.target.closest("[data-node-up]") || event.target.closest("[data-node-down]") || event.target.closest("[data-node-remove]") || event.target.closest("[data-add-rule]") || event.target.closest("[data-remove-rule]")) draftNodes = collectNodes();
    if (event.target.closest("[data-node-up]") && index > 0) [draftNodes[index - 1], draftNodes[index]] = [draftNodes[index], draftNodes[index - 1]];
    else if (event.target.closest("[data-node-down]") && index < draftNodes.length - 1) [draftNodes[index + 1], draftNodes[index]] = [draftNodes[index], draftNodes[index + 1]];
    else if (event.target.closest("[data-node-remove]")) draftNodes.splice(index, 1);
    else if (event.target.closest("[data-add-rule]")) draftNodes[index].photoRequirements.push({ id: `PR-${Date.now()}`, name: "", description: "", quantity: 1 });
    else if (event.target.closest("[data-remove-rule]")) {
      const ruleIndex = [...nodeElement.querySelectorAll("[data-photo-rule]")].indexOf(event.target.closest("[data-photo-rule]"));
      draftNodes[index].photoRequirements.splice(ruleIndex, 1);
    } else return;
    renderNodes();
  });
  body.addEventListener("click", (event) => {
    const edit = event.target.closest("[data-edit-profile]");
    const toggle = event.target.closest("[data-toggle-profile]");
    const jumpNodes = event.target.closest("[data-jump-nodes]");
    const jumpPhotos = event.target.closest("[data-jump-photos]");
    if (edit) openEditor(profiles.find((profile) => profile.id === edit.dataset.editProfile), "node-list");
    if (jumpNodes) openEditor(profiles.find((profile) => profile.id === jumpNodes.dataset.jumpNodes), "nodes");
    if (jumpPhotos) openEditor(profiles.find((profile) => profile.id === jumpPhotos.dataset.jumpPhotos), "photos");
    if (toggle) {
      const profile = profiles.find((item) => item.id === toggle.dataset.toggleProfile);
      if (!profile) return;
      const before = JSON.parse(JSON.stringify(profile));
      profile.enabled = !profile.enabled;
      if (!profiles.some((item) => item.enabled)) { profile.enabled = true; return window.alert("至少保留一个启用中的任务类型。"); }
      try { window.DispatchTaskNodes.save(profiles); recordChange("toggle", profile, before); render(); } catch (error) { window.alert(error.message); }
    }
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = form.elements.name.value.trim();
    const nextProfile = { id: editingId || `TT-${Date.now()}`, name, enabled: form.elements.enabled.checked, nodes: collectNodes() };
    const next = profiles.slice();
    const index = next.findIndex((item) => item.id === editingId);
    const before = index >= 0 ? JSON.parse(JSON.stringify(next[index])) : null;
    if (index >= 0) next[index] = nextProfile;
    else next.push(nextProfile);
    try {
      window.DispatchTaskNodes.save(next);
      recordChange(index >= 0 ? "update" : "create", nextProfile, before);
      dialog.close();
      render();
    } catch (error) { window.alert(error.message); }
  });
  window.addEventListener("transport-task-config-updated", render);
  window.addEventListener("reminder-templates-updated", renderNodes);
  window.addEventListener("storage", (event) => { if (event.key === window.DispatchTaskNodes.STORAGE_KEY) render(); });
  window.TransportTaskConfigManager = { render };
  render();
})();
