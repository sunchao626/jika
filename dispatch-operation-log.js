(function (root, factory) {
  const api = factory(root || globalThis);
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (root) root.DispatchOperationLog = api;
})(typeof window !== "undefined" ? window : globalThis, function (root) {
  "use strict";

  const CATEGORY_LABELS = { dispatch: "派单操作", status: "司机节点", system: "系统动作" };
  const FIELD_LABELS = {
    driver: "司机",
    vehicle: "车辆",
    trailer: "挂车",
    route: "线路",
    project: "项目",
    boxes: "箱封信息",
    status: "派单状态",
    node: "运输节点",
    dispatchMode: "派单方式",
  };
  const clone = (value) => JSON.parse(JSON.stringify(value));
  const clean = (value) => String(value == null ? "" : value).trim();

  function createRecordId() {
    return `DOP-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
  }

  function normalizeChanges(changes) {
    return (Array.isArray(changes) ? changes : []).map((change) => ({
      field: clean(change.field) || "status",
      label: clean(change.label) || FIELD_LABELS[change.field] || clean(change.field) || "变更字段",
      before: clean(change.before) || "-",
      after: clean(change.after) || "-",
    }));
  }

  function normalizeRecord(dispatch, input = {}) {
    return {
      id: clean(input.id) || createRecordId(),
      signature: clean(input.signature),
      dispatchId: clean(input.dispatchId) || clean(dispatch?.id) || "-",
      waybillNo: clean(input.waybillNo) || clean(dispatch?.waybillNo) || "-",
      time: clean(input.time) || new Date().toLocaleString("zh-CN", { hour12: false }).replaceAll("/", "-"),
      category: ["dispatch", "status", "system"].includes(input.category) ? input.category : "dispatch",
      action: clean(input.action) || "更新派单",
      summary: clean(input.summary) || "更新派单信息",
      operatorName: clean(input.operatorName) || "张调度",
      operatorAccount: clean(input.operatorAccount) || "zhangdd",
      operatorRole: clean(input.operatorRole) || "调度员",
      source: clean(input.source) || "运营后台",
      result: input.result === "failure" ? "failure" : "success",
      reason: clean(input.reason),
      changes: normalizeChanges(input.changes),
    };
  }

  function inferTimelineRecord(dispatch, item, index) {
    const node = clean(item?.node) || "状态更新";
    const automatic = dispatch?.dispatchMode === "auto";
    const isDispatchAction = ["已派单", "派单调整", "取消"].includes(node);
    const category = isDispatchAction ? (automatic && node === "已派单" ? "system" : "dispatch") : "status";
    const operator = category === "status"
      ? { name: dispatch?.driverName || "司机", account: dispatch?.driverId || "driver", role: "司机", source: "司机移动端" }
      : category === "system"
        ? { name: "自动派单引擎", account: "system", role: "系统", source: "系统任务" }
        : { name: "张调度", account: "zhangdd", role: "调度员", source: "运营后台" };
    const action = node === "已派单" ? (automatic ? "系统自动派单" : "创建并推送派单") : node === "派单调整" ? "编辑派单" : node === "取消" ? "撤销派单" : `${node}上报`;
    return normalizeRecord(dispatch, {
      signature: `timeline:${index}:${clean(item?.time)}:${node}`,
      time: clean(item?.time) || clean(dispatch?.dispatchTime) || clean(dispatch?.orderDate),
      category,
      action,
      summary: clean(item?.desc) || `${operator.name}完成${action}`,
      operatorName: operator.name,
      operatorAccount: operator.account,
      operatorRole: operator.role,
      source: operator.source,
      changes: [{ field: node === "已派单" ? "status" : "node", before: index ? clean(dispatch?.timeline?.[index - 1]?.node) || "-" : "-", after: node }],
    });
  }

  function ensureRecords(dispatch) {
    if (!dispatch) return [];
    if (!Array.isArray(dispatch.operationRecords)) dispatch.operationRecords = [];
    const signatures = new Set(dispatch.operationRecords.map((record) => record.signature).filter(Boolean));
    const timeline = Array.isArray(dispatch.timeline) ? dispatch.timeline : [];
    timeline.forEach((item, index) => {
      const inferred = inferTimelineRecord(dispatch, item, index);
      if (!signatures.has(inferred.signature)) {
        dispatch.operationRecords.push(inferred);
        signatures.add(inferred.signature);
      }
    });
    if (!timeline.length && !signatures.has("pending-created")) {
      dispatch.operationRecords.push(normalizeRecord(dispatch, {
        signature: "pending-created",
        time: clean(dispatch.orderDate) ? `${dispatch.orderDate} 08:00` : "",
        category: "system",
        action: "生成待派单任务",
        summary: `运单 ${dispatch.waybillNo || "-"} 进入待派单池，等待调度分配运力`,
        operatorName: "系统",
        operatorAccount: "system",
        operatorRole: "系统",
        source: "运单状态联动",
        changes: [{ field: "status", before: "计划任务", after: "待派单" }],
      }));
    }
    return dispatch.operationRecords;
  }

  function mapActionId(record) {
    if (record.action.includes("撤销")) return "revoke";
    if (record.action.includes("创建") || record.action.includes("生成") || record.action.includes("自动派单")) return "create";
    return "update";
  }

  function syncRecordToSystem(record, dispatch) {
    const manager = root.OperationLogManager;
    if (!manager?.record) return;
    const traceId = `DISPATCH-${record.id}`;
    manager.record({
      time: record.time,
      moduleId: "dispatch",
      moduleName: "派单管理",
      actionId: mapActionId(record),
      actionName: record.action,
      operatorId: record.operatorAccount,
      operatorName: record.operatorName,
      operatorAccount: record.operatorAccount,
      roleName: record.operatorRole,
      targetType: "运单 / 派单",
      targetId: record.waybillNo,
      targetLabel: `${record.dispatchId} · ${dispatch?.routeName || "未指定线路"}`,
      content: record.summary,
      result: record.result,
      failureReason: record.result === "failure" ? record.reason : "",
      device: record.source,
      traceId,
      changes: record.changes.map((change) => ({ field: change.field, before: change.before, after: change.after })),
    });
  }

  function record(dispatch, input = {}) {
    const records = ensureRecords(dispatch);
    if (input.signature && records.some((item) => item.signature === input.signature)) {
      const existing = records.find((item) => item.signature === input.signature);
      Object.assign(existing, normalizeRecord(dispatch, { ...input, id: existing.id }));
      syncRecordToSystem(existing, dispatch);
      return existing;
    }
    const next = normalizeRecord(dispatch, input);
    records.push(next);
    syncRecordToSystem(next, dispatch);
    return next;
  }

  function getWaybillRecords(dispatches, waybillNo) {
    return (dispatches || []).filter((dispatch) => dispatch.waybillNo === waybillNo).flatMap((dispatch) => ensureRecords(dispatch).map((entry) => ({ ...clone(entry), routeName: dispatch.routeName || "未指定线路" }))).sort((left, right) => right.time.localeCompare(left.time) || right.id.localeCompare(left.id));
  }

  function filterRecords(records, filters = {}) {
    const category = clean(filters.category) || "all";
    const keyword = clean(filters.keyword).toLowerCase();
    return (records || []).filter((record) => {
      if (category !== "all" && record.category !== category) return false;
      const text = [record.action, record.summary, record.operatorName, record.operatorAccount, record.operatorRole, record.dispatchId, record.waybillNo, ...record.changes.flatMap((item) => [item.label, item.before, item.after])].join(" ").toLowerCase();
      return !keyword || text.includes(keyword);
    });
  }

  function summarize(records) {
    return {
      total: records.length,
      operators: new Set(records.map((item) => item.operatorAccount).filter(Boolean)).size,
      changes: records.reduce((sum, item) => sum + item.changes.length, 0),
      failures: records.filter((item) => item.result === "failure").length,
    };
  }

  function createDrawerManager() {
    if (typeof document === "undefined") return null;
    const drawer = document.querySelector("#dispatchOperationLogDrawer");
    if (!drawer) return null;
    const subtitle = document.querySelector("#dispatchOperationLogSubtitle");
    const overview = document.querySelector("#dispatchOperationOverview");
    const list = document.querySelector("#dispatchOperationList");
    const search = document.querySelector("#dispatchOperationSearch");
    const filters = document.querySelector("#dispatchOperationFilters");
    let records = [];
    let activeWaybillNo = "";
    let activeCategory = "all";
    let lastTrigger = null;

    const escapeHtml = (value) => String(value == null ? "" : value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
    const iconFor = (category) => ({ dispatch: "user-cog", status: "route", system: "settings-2" }[category] || "history");

    function render() {
      const visible = filterRecords(records, { category: activeCategory, keyword: search.value });
      list.innerHTML = visible.length ? visible.map((item) => {
        const changes = item.changes.length ? `<div class="dispatch-operation-changes">${item.changes.map((change) => `<div><strong>${escapeHtml(change.label)}</strong><span>${escapeHtml(change.before)}</span><i data-lucide="arrow-right" aria-hidden="true"></i><span>${escapeHtml(change.after)}</span></div>`).join("")}</div>` : "";
        return `<article class="dispatch-operation-item ${escapeHtml(item.category)}">
          <div class="dispatch-operation-marker"><i data-lucide="${iconFor(item.category)}" aria-hidden="true"></i></div>
          <div class="dispatch-operation-card"><header><div><span class="dispatch-operation-type">${escapeHtml(CATEGORY_LABELS[item.category])}</span><strong>${escapeHtml(item.action)}</strong></div><em class="${item.result}">${item.result === "success" ? "成功" : "失败"}</em></header><p>${escapeHtml(item.summary)}</p>${changes}${item.reason ? `<div class="dispatch-operation-reason"><strong>操作原因</strong><span>${escapeHtml(item.reason)}</span></div>` : ""}<footer><span><i data-lucide="user-round" aria-hidden="true"></i>${escapeHtml(item.operatorName)} · ${escapeHtml(item.operatorRole)}</span><span><i data-lucide="monitor-smartphone" aria-hidden="true"></i>${escapeHtml(item.source)}</span><time datetime="${escapeHtml(item.time.replace(" ", "T"))}">${escapeHtml(item.time)}</time><code>${escapeHtml(item.dispatchId)}</code></footer></div>
        </article>`;
      }).join("") : `<div class="dispatch-operation-empty"><i data-lucide="search-x" aria-hidden="true"></i><strong>未找到匹配记录</strong><span>调整类型或搜索关键词后重试。</span></div>`;
      root.lucide?.createIcons();
    }

    function open(dispatches, dispatchId, trigger) {
      const selected = (dispatches || []).find((item) => item.id === dispatchId);
      if (!selected) return;
      lastTrigger = trigger || null;
      activeWaybillNo = selected.waybillNo;
      activeCategory = "all";
      search.value = "";
      records = getWaybillRecords(dispatches, activeWaybillNo);
      (dispatches || []).filter((item) => item.waybillNo === activeWaybillNo).forEach((dispatch) => ensureRecords(dispatch).forEach((entry) => syncRecordToSystem(entry, dispatch)));
      const relatedDispatches = new Set(records.map((item) => item.dispatchId)).size;
      subtitle.textContent = `${activeWaybillNo} · ${relatedDispatches} 次派单 · ${selected.routeName || "未指定线路"}`;
      const summary = summarize(records);
      overview.innerHTML = `<div><span>记录总数</span><strong>${summary.total}</strong><small>全部追责记录</small></div><div><span>操作主体</span><strong>${summary.operators}</strong><small>账号与系统</small></div><div><span>字段变更</span><strong>${summary.changes}</strong><small>可核对前后值</small></div><div class="${summary.failures ? "has-failure" : ""}"><span>失败操作</span><strong>${summary.failures}</strong><small>${summary.failures ? "需要关注" : "暂无异常"}</small></div>`;
      filters.querySelectorAll("[data-operation-category]").forEach((button) => {
        const active = button.dataset.operationCategory === "all";
        button.classList.toggle("active", active);
        button.setAttribute("aria-pressed", String(active));
      });
      render();
      if (typeof drawer.showModal === "function") drawer.showModal(); else drawer.setAttribute("open", "");
    }

    function close() {
      if (drawer.open) drawer.close();
      lastTrigger?.focus();
      lastTrigger = null;
    }

    filters.addEventListener("click", (event) => {
      const button = event.target.closest("[data-operation-category]");
      if (!button) return;
      activeCategory = button.dataset.operationCategory;
      filters.querySelectorAll("[data-operation-category]").forEach((item) => {
        const active = item === button;
        item.classList.toggle("active", active);
        item.setAttribute("aria-pressed", String(active));
      });
      render();
    });
    search.addEventListener("input", render);
    document.querySelector("#closeDispatchOperationLogBtn").addEventListener("click", close);
    document.querySelector("#viewFullOperationLogBtn").addEventListener("click", () => {
      const keyword = activeWaybillNo;
      close();
      document.querySelector('[data-page="operation-logs"]')?.click();
      setTimeout(() => {
        const form = document.querySelector("#operationLogQueryForm");
        if (!form) return;
        form.elements.keyword.value = keyword;
        form.requestSubmit?.();
      }, 0);
    });
    drawer.addEventListener("cancel", (event) => { event.preventDefault(); close(); });
    return { open, close, render };
  }

  const manager = createDrawerManager();
  if (root && manager) root.DispatchOperationLogManager = manager;
  return { CATEGORY_LABELS, FIELD_LABELS, normalizeRecord, inferTimelineRecord, ensureRecords, record, getWaybillRecords, filterRecords, summarize, syncRecordToSystem };
});
