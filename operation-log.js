(function (root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (root) root.OperationLog = api;
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  const STORAGE_KEY = "container-logistics-operation-logs-v1";
  const ACTION_LABELS = {
    login: "登录",
    view_sensitive: "查看敏感数据",
    create: "新增",
    update: "修改",
    delete: "删除",
    void: "作废",
    confirm: "确认",
    revoke: "撤销",
    export: "导出",
    permission: "权限变更",
    config: "配置变更",
  };
  const FIELD_LABELS = {
    status: "状态",
    role: "所属角色",
    dataScope: "数据范围",
    dispatchMode: "派单方式",
    amount: "金额",
    driver: "司机",
    vehicle: "车辆",
    trailer: "挂车",
    vehicleType: "车型",
    route: "线路",
    project: "项目",
    boxes: "箱封信息",
    node: "运输节点",
    consignee: "收货人",
    arrivalTime: "到达时间",
    arrivalLocation: "到达地点",
    note: "备注",
    visibleFields: "可见字段",
  };
  const seedLogs = [
    { id: "LOG-20261018-001", time: "2026-10-18 09:42:18", moduleId: "dispatch", moduleName: "派单管理", actionId: "update", actionName: "修改", operatorId: "user-current", operatorName: "张调度", operatorAccount: "zhangdd", roleName: "调度员", targetType: "派单", targetId: "PD20261018006", targetLabel: "宁波港 → 苏州园区", content: "调整派单 PD20261018006 的承运车辆和司机", result: "success", ip: "10.18.2.36", device: "Windows 11 · Edge 141", traceId: "TRC-6F40D31A", changes: [{ field: "driver", before: "陈涛", after: "刘军" }, { field: "vehicle", before: "浙A·F2190", after: "苏E·T5568" }] },
    { id: "LOG-20261018-002", time: "2026-10-18 09:28:43", moduleId: "waybill", moduleName: "计划与任务", actionId: "create", actionName: "新增", operatorId: "user-current", operatorName: "张调度", operatorAccount: "zhangdd", roleName: "调度员", targetType: "运单", targetId: "WB20261018012", targetLabel: "上海港 → 杭州临平", content: "新增运单 WB20261018012，并保存为待派单", result: "success", ip: "10.18.2.36", device: "Windows 11 · Edge 141", traceId: "TRC-5B82E944", changes: [{ field: "status", before: "-", after: "待派单" }] },
    { id: "LOG-20261018-003", time: "2026-10-18 09:16:09", moduleId: "auth", moduleName: "账号安全", actionId: "login", actionName: "登录", operatorId: "user-current", operatorName: "张调度", operatorAccount: "zhangdd", roleName: "调度员", targetType: "系统", targetId: "PC-ADMIN", targetLabel: "运营后台", content: "账号 zhangdd 登录运营后台", result: "success", ip: "10.18.2.36", device: "Windows 11 · Edge 141", traceId: "TRC-A163C120", changes: [] },
    { id: "LOG-20261018-004", time: "2026-10-18 08:55:31", moduleId: "settlement", moduleName: "结算管理", actionId: "confirm", actionName: "确认", operatorId: "user-finance", operatorName: "王财务", operatorAccount: "wangcw", roleName: "财务专员", targetType: "结算单", targetId: "JS20261018003", targetLabel: "10月上半月司机结算", content: "确认结算单 JS20261018003，确认金额 ¥28,460.00", result: "success", ip: "10.18.3.18", device: "Windows 10 · Chrome 141", traceId: "TRC-BB2E76A1", changes: [{ field: "status", before: "待确认", after: "已确认" }, { field: "amount", before: "¥28,460.00", after: "¥28,460.00" }] },
    { id: "LOG-20261018-005", time: "2026-10-18 08:42:05", moduleId: "auth", moduleName: "账号安全", actionId: "login", actionName: "登录", operatorId: "unknown", operatorName: "未知用户", operatorAccount: "admin-test", roleName: "未识别", targetType: "系统", targetId: "PC-ADMIN", targetLabel: "运营后台", content: "账号 admin-test 登录失败", result: "failure", failureReason: "账号或密码错误", ip: "117.143.28.91", device: "Windows · Chrome 141", traceId: "TRC-4282D1F3", changes: [] },
    { id: "LOG-20261017-006", time: "2026-10-17 17:36:52", moduleId: "userAccess", moduleName: "用户与权限", actionId: "permission", actionName: "权限变更", operatorId: "user-admin", operatorName: "系统管理员", operatorAccount: "admin", roleName: "系统管理员", targetType: "角色", targetId: "role-finance", targetLabel: "财务专员", content: "调整角色“财务专员”的数据范围", result: "success", ip: "10.18.1.8", device: "Windows 11 · Edge 141", traceId: "TRC-26F3DCA5", changes: [{ field: "dataScope", before: "全部客户", after: "华贸物流、联港供应链" }] },
    { id: "LOG-20261017-007", time: "2026-10-17 16:18:27", moduleId: "driver", moduleName: "司机管理", actionId: "view_sensitive", actionName: "查看敏感数据", operatorId: "user-finance", operatorName: "王财务", operatorAccount: "wangcw", roleName: "财务专员", targetType: "司机", targetId: "SJ-1002", targetLabel: "刘军", content: "查看司机 SJ-1002 的结算银行卡信息（已脱敏记录）", result: "success", ip: "10.18.3.18", device: "Windows 10 · Chrome 141", traceId: "TRC-9AA4EC10", changes: [] },
    { id: "LOG-20261017-008", time: "2026-10-17 15:46:11", moduleId: "finance", moduleName: "运输成本台账", actionId: "export", actionName: "导出", operatorId: "user-finance", operatorName: "王财务", operatorAccount: "wangcw", roleName: "财务专员", targetType: "报表", targetId: "EXPORT-20261017-09", targetLabel: "运输成本明细", content: "导出 2026-10-01 至 2026-10-15 的运输成本明细，共 386 条", result: "success", ip: "10.18.3.18", device: "Windows 10 · Chrome 141", traceId: "TRC-1D83C742", changes: [] },
    { id: "LOG-20261017-009", time: "2026-10-17 14:25:40", moduleId: "waybill", moduleName: "计划与任务", actionId: "void", actionName: "作废", operatorId: "user-current", operatorName: "张调度", operatorAccount: "zhangdd", roleName: "调度员", targetType: "运单", targetId: "WB20261016021", targetLabel: "外高桥 → 昆山开发区", content: "作废运单 WB20261016021，原因：客户取消运输计划", result: "success", ip: "10.18.2.36", device: "Windows 11 · Edge 141", traceId: "TRC-31DC8EA9", changes: [{ field: "status", before: "待派单", after: "已作废" }] },
    { id: "LOG-20261017-010", time: "2026-10-17 11:03:16", moduleId: "dispatch", moduleName: "派单管理", actionId: "revoke", actionName: "撤销", operatorId: "user-current", operatorName: "张调度", operatorAccount: "zhangdd", roleName: "调度员", targetType: "派单", targetId: "PD20261017008", targetLabel: "洋山港 → 无锡新区", content: "撤销派单 PD20261017008", result: "failure", failureReason: "运单已完成提货，不允许普通撤销", ip: "10.18.2.36", device: "Windows 11 · Edge 141", traceId: "TRC-7F2B501C", changes: [] },
    { id: "LOG-20261016-011", time: "2026-10-16 18:12:33", moduleId: "systemConfig", moduleName: "系统配置", actionId: "config", actionName: "配置变更", operatorId: "user-admin", operatorName: "系统管理员", operatorAccount: "admin", roleName: "系统管理员", targetType: "自动派单规则", targetId: "RULE-DEFAULT", targetLabel: "默认派单策略", content: "更新默认自动派单策略的运力匹配方式", result: "success", ip: "10.18.1.8", device: "Windows 11 · Edge 141", traceId: "TRC-624D8E37", changes: [{ field: "dispatchMode", before: "距离优先", after: "综合评分优先" }] },
    { id: "LOG-20261016-012", time: "2026-10-16 16:50:24", moduleId: "driver", moduleName: "司机管理", actionId: "update", actionName: "修改", operatorId: "user-fleet", operatorName: "李建", operatorAccount: "lijiang", roleName: "车队管理员", targetType: "司机", targetId: "SJ-1004", targetLabel: "陈涛", content: "更新司机 SJ-1004 的从业资格证有效期", result: "success", ip: "10.18.4.22", device: "Windows 11 · Chrome 141", traceId: "TRC-EB18460D", changes: [{ field: "status", before: "证件即将到期", after: "正常" }] },
    { id: "LOG-20261016-013", time: "2026-10-16 13:27:58", moduleId: "userAccess", moduleName: "用户与权限", actionId: "create", actionName: "新增", operatorId: "user-admin", operatorName: "系统管理员", operatorAccount: "admin", roleName: "系统管理员", targetType: "用户", targetId: "user-fleet", targetLabel: "李建 / lijiang", content: "新增后台用户 lijiang，并分配角色“车队管理员”", result: "success", ip: "10.18.1.8", device: "Windows 11 · Edge 141", traceId: "TRC-529C177B", changes: [{ field: "role", before: "-", after: "车队管理员" }] },
    { id: "LOG-20261015-014", time: "2026-10-15 10:08:47", moduleId: "finance", moduleName: "运输成本台账", actionId: "confirm", actionName: "确认", operatorId: "user-finance", operatorName: "王财务", operatorAccount: "wangcw", roleName: "财务专员", targetType: "费用", targetId: "FY20261015009", targetLabel: "过路费 · WB20261014016", content: "确认费用 FY20261015009，金额 ¥1,280.00", result: "success", ip: "10.18.3.18", device: "Windows 10 · Chrome 141", traceId: "TRC-F6018B2E", changes: [{ field: "status", before: "待确认", after: "已确认" }] },
  ];

  const clone = (value) => JSON.parse(JSON.stringify(value));
  const clean = (value) => String(value == null ? "" : value).trim();
  function formatShanghaiTimestamp(date = new Date()) {
    const parts = Object.fromEntries(new Intl.DateTimeFormat("zh-CN", {
      timeZone: "Asia/Shanghai",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
    }).formatToParts(date).filter((part) => part.type !== "literal").map((part) => [part.type, part.value]));
    return `${parts.year}-${parts.month}-${parts.day} ${parts.hour}:${parts.minute}:${parts.second}`;
  }
  const uniqueOptions = (logs, idKey, labelKey) => {
    const entries = new Map();
    logs.forEach((item) => entries.set(item[idKey], item[labelKey]));
    return [...entries].filter(([id]) => id).map(([value, label]) => ({ value, label }));
  };
  function filterLogs(logs, filters = {}) {
    const keyword = clean(filters.keyword).toLowerCase();
    const start = clean(filters.startDate);
    const end = clean(filters.endDate);
    return logs.filter((item) => {
      const text = [item.content, item.targetId, item.targetLabel, item.operatorName, item.operatorAccount, item.roleName, item.moduleName, item.actionName].join(" ").toLowerCase();
      if (keyword && !text.includes(keyword)) return false;
      if (filters.module && item.moduleId !== filters.module) return false;
      if (filters.action && item.actionId !== filters.action) return false;
      if (filters.operator && item.operatorId !== filters.operator) return false;
      if (filters.result && item.result !== filters.result) return false;
      const day = item.time.slice(0, 10);
      if (start && day < start) return false;
      if (end && day > end) return false;
      return true;
    }).sort((a, b) => b.time.localeCompare(a.time));
  }
  function paginate(logs, page = 1, pageSize = 10) {
    const size = Math.max(1, Number(pageSize) || 10);
    const totalPages = Math.max(1, Math.ceil(logs.length / size));
    const currentPage = Math.min(Math.max(1, Number(page) || 1), totalPages);
    return { rows: logs.slice((currentPage - 1) * size, currentPage * size), currentPage, totalPages, total: logs.length };
  }
  function normalizeLog(input = {}) {
    return {
      id: clean(input.id) || `LOG-${Date.now().toString(36).toUpperCase()}`,
      time: clean(input.time) || formatShanghaiTimestamp(),
      moduleId: clean(input.moduleId) || "systemConfig",
      moduleName: clean(input.moduleName) || "系统配置",
      actionId: clean(input.actionId) || "update",
      actionName: clean(input.actionName) || ACTION_LABELS[input.actionId] || "修改",
      operatorId: clean(input.operatorId) || "user-current",
      operatorName: clean(input.operatorName) || "当前用户",
      operatorAccount: clean(input.operatorAccount) || "-",
      roleName: clean(input.roleName) || "-",
      targetType: clean(input.targetType) || "系统记录",
      targetId: clean(input.targetId) || "-",
      targetLabel: clean(input.targetLabel) || "-",
      content: clean(input.content) || "更新系统记录",
      result: input.result === "failure" ? "failure" : "success",
      failureReason: clean(input.failureReason),
      ip: clean(input.ip) || "127.0.0.1",
      device: clean(input.device) || "运营后台",
      traceId: clean(input.traceId) || `TRC-${Date.now().toString(16).toUpperCase()}`,
      changes: Array.isArray(input.changes) ? clone(input.changes) : [],
    };
  }

  function upsertLog(logs, input = {}) {
    const normalized = normalizeLog(input);
    const existingIndex = logs.findIndex((item) => item.traceId === normalized.traceId);
    if (existingIndex >= 0) logs.splice(existingIndex, 1, normalized);
    else logs.unshift(normalized);
    return normalized;
  }

  function createBrowserManager() {
    if (typeof document === "undefined") return null;
    const page = document.querySelector("#operationLogPage");
    if (!page) return null;
    const form = document.querySelector("#operationLogQueryForm");
    const body = document.querySelector("#operationLogBody");
    const detailDialog = document.querySelector("#operationLogDetailDialog");
    const detailBody = document.querySelector("#operationLogDetailBody");
    const detailSubtitle = document.querySelector("#operationLogDetailSubtitle");
    let logs;
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      logs = Array.isArray(saved) && saved.length ? saved.map(normalizeLog) : clone(seedLogs);
    } catch (error) {
      logs = clone(seedLogs);
    }
    let currentPage = 1;
    let lastDetailTrigger = null;

    const escapeHtml = (value) => String(value == null ? "" : value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
    const optionMarkup = (items) => items.map((item) => `<option value="${escapeHtml(item.value)}">${escapeHtml(item.label)}</option>`).join("");
    const formFilters = () => Object.fromEntries(new FormData(form).entries());
    const save = () => {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(logs)); } catch (error) { console.warn("操作日志保存失败。", error); }
    };
    function refreshOptions() {
      const selections = {
        module: uniqueOptions(logs, "moduleId", "moduleName"),
        action: Object.entries(ACTION_LABELS).map(([value, label]) => ({ value, label })),
        operator: uniqueOptions(logs, "operatorId", "operatorName").map((item) => {
          const source = logs.find((log) => log.operatorId === item.value);
          return { value: item.value, label: `${item.label}${source?.operatorAccount && source.operatorAccount !== "-" ? `（${source.operatorAccount}）` : ""}` };
        }),
      };
      Object.entries(selections).forEach(([name, items]) => {
        const select = form.elements[name];
        const value = select.value;
        select.innerHTML = `<option value="">全部${name === "module" ? "模块" : name === "action" ? "类型" : "操作人"}</option>${optionMarkup(items)}`;
        select.value = value;
      });
    }
    function render() {
      const filtered = filterLogs(logs, formFilters());
      const pageSize = Number(document.querySelector("#operationLogPageSize").value) || 10;
      const pageData = paginate(filtered, currentPage, pageSize);
      currentPage = pageData.currentPage;
      body.innerHTML = pageData.rows.length ? pageData.rows.map((item) => `
        <tr>
          <td data-label="操作时间"><time datetime="${escapeHtml(item.time.replace(" ", "T"))}">${escapeHtml(item.time)}</time></td>
          <td data-label="操作模块"><span class="operation-log-module">${escapeHtml(item.moduleName)}</span></td>
          <td data-label="操作类型"><span class="operation-log-action action-${escapeHtml(item.actionId)}">${escapeHtml(item.actionName)}</span></td>
          <td data-label="操作人"><strong class="operation-log-operator">${escapeHtml(item.operatorName)}</strong><small>${escapeHtml(item.operatorAccount)} · ${escapeHtml(item.roleName)}</small></td>
          <td data-label="操作对象"><strong>${escapeHtml(item.targetId)}</strong><small>${escapeHtml(item.targetLabel)}</small></td>
          <td class="operation-log-content" data-label="操作内容">${escapeHtml(item.content)}</td>
          <td data-label="结果"><span class="operation-log-result ${item.result}">${item.result === "success" ? "成功" : "失败"}</span></td>
          <td class="fixed-action-column" data-label="操作"><button class="link-btn" data-operation-log-detail="${escapeHtml(item.id)}" type="button">查看详情</button></td>
        </tr>`).join("") : `<tr><td colspan="8"><div class="operation-log-empty"><i data-lucide="search-x" aria-hidden="true"></i><strong>未找到匹配日志</strong><span>调整筛选条件，或重置后查看全部操作记录。</span><button class="btn quiet" data-operation-log-reset type="button">清空筛选</button></div></td></tr>`;
      document.querySelector("#operationLogCount").textContent = `${pageData.total} 条`;
      document.querySelector("#operationLogFilterSummary").textContent = `筛选结果 ${pageData.total} 条`;
      document.querySelector("#operationLogCurrentPage").textContent = String(currentPage);
      document.querySelector("#operationLogPrevPage").disabled = currentPage <= 1;
      document.querySelector("#operationLogNextPage").disabled = currentPage >= pageData.totalPages;
      document.querySelector("#operationLogTotal").textContent = `共 ${pageData.total} 条记录 · 第 ${currentPage}/${pageData.totalPages} 页`;
      window.lucide?.createIcons();
    }
    function closeDetail() {
      if (detailDialog.open) detailDialog.close();
      lastDetailTrigger?.focus();
      lastDetailTrigger = null;
    }
    function openDetail(id, trigger) {
      const item = logs.find((log) => log.id === id);
      if (!item) return;
      lastDetailTrigger = trigger || null;
      detailSubtitle.textContent = `${item.id} · ${item.time}`;
      const changes = item.changes.length ? `<div class="operation-log-change-table"><div class="operation-log-change-head"><span>变更字段</span><span>变更前</span><span>变更后</span></div>${item.changes.map((change) => `<div><strong>${escapeHtml(FIELD_LABELS[change.field] || change.field)}</strong><span>${escapeHtml(change.before || "-")}</span><span>${escapeHtml(change.after || "-")}</span></div>`).join("")}</div>` : `<div class="operation-log-no-change"><i data-lucide="info" aria-hidden="true"></i><span>该操作未产生字段变更，或仅记录了访问行为。</span></div>`;
      detailBody.innerHTML = `
        <section class="operation-log-detail-section"><h3>操作摘要</h3><p class="operation-log-detail-summary">${escapeHtml(item.content)}</p><div class="operation-log-detail-grid"><div><span>操作模块</span><strong>${escapeHtml(item.moduleName)}</strong></div><div><span>操作类型</span><strong>${escapeHtml(item.actionName)}</strong></div><div><span>执行结果</span><strong><em class="operation-log-result ${item.result}">${item.result === "success" ? "成功" : "失败"}</em></strong></div><div><span>操作时间</span><strong>${escapeHtml(item.time)}</strong></div></div></section>
        <section class="operation-log-detail-section"><h3>操作人及环境</h3><div class="operation-log-detail-grid"><div><span>操作人</span><strong>${escapeHtml(item.operatorName)}</strong></div><div><span>账号 / 角色</span><strong>${escapeHtml(item.operatorAccount)} · ${escapeHtml(item.roleName)}</strong></div><div><span>IP 地址</span><strong>${escapeHtml(item.ip)}</strong></div><div><span>设备</span><strong>${escapeHtml(item.device)}</strong></div></div></section>
        <section class="operation-log-detail-section"><h3>操作对象</h3><div class="operation-log-detail-grid"><div><span>对象类型</span><strong>${escapeHtml(item.targetType)}</strong></div><div><span>业务编号</span><strong>${escapeHtml(item.targetId)}</strong></div><div class="operation-log-detail-wide"><span>对象名称</span><strong>${escapeHtml(item.targetLabel)}</strong></div>${item.failureReason ? `<div class="operation-log-detail-wide operation-log-failure"><span>失败原因</span><strong>${escapeHtml(item.failureReason)}</strong></div>` : ""}<div class="operation-log-detail-wide"><span>追踪编号</span><strong>${escapeHtml(item.traceId)}</strong></div></div></section>
        <section class="operation-log-detail-section"><h3>变更内容</h3>${changes}</section>`;
      if (typeof detailDialog.showModal === "function") detailDialog.showModal(); else detailDialog.setAttribute("open", "");
      window.lucide?.createIcons();
    }
    function record(input) {
      upsertLog(logs, input);
      save();
      refreshOptions();
      if (page.classList.contains("active")) {
        currentPage = 1;
        render();
      }
    }

    refreshOptions();
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const start = form.elements.startDate.value;
      const end = form.elements.endDate.value;
      form.elements.endDate.setCustomValidity(start && end && start > end ? "结束日期不能早于开始日期。" : "");
      if (!form.reportValidity()) return;
      currentPage = 1;
      render();
    });
    form.addEventListener("reset", () => setTimeout(() => { form.elements.endDate.setCustomValidity(""); currentPage = 1; render(); }, 0));
    page.addEventListener("click", (event) => {
      const detailButton = event.target.closest("[data-operation-log-detail]");
      if (detailButton) return openDetail(detailButton.dataset.operationLogDetail, detailButton);
      if (event.target.closest("[data-operation-log-reset]")) form.reset();
    });
    document.querySelector("#operationLogPageSize").addEventListener("change", () => { currentPage = 1; render(); });
    document.querySelector("#operationLogPrevPage").addEventListener("click", () => { currentPage -= 1; render(); });
    document.querySelector("#operationLogNextPage").addEventListener("click", () => { currentPage += 1; render(); });
    document.querySelector("#closeOperationLogDetailBtn").addEventListener("click", closeDetail);
    document.querySelector("#operationLogDetailCloseBtn").addEventListener("click", closeDetail);
    detailDialog.addEventListener("cancel", (event) => { event.preventDefault(); closeDetail(); });
    render();
    return { render, record, getLogs: () => clone(logs), filter: (filters) => filterLogs(logs, filters) };
  }

  const manager = createBrowserManager();
  if (typeof window !== "undefined" && manager) window.OperationLogManager = manager;
  return { STORAGE_KEY, ACTION_LABELS, FIELD_LABELS, seedLogs: clone(seedLogs), filterLogs, paginate, normalizeLog, upsertLog, formatShanghaiTimestamp };
});
