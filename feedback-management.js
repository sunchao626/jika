(function () {
  const STORAGE_KEY = "container-logistics-feedback-v1";
  const LEGACY_MANAGER_KEY = "container-logistics-manager-feedback-v1";
  const DATABASE_NAME = `${STORAGE_KEY}-attachments`;
  const ATTACHMENT_STORE = "attachments";
  const SOURCE_LABELS = { driver: "司机端", manager: "管理端" };
  const STATUS_META = {
    pending: { label: "待处理", className: "pending" },
    processing: { label: "处理中", className: "processing" },
    resolved: { label: "已处理", className: "resolved" },
    closed: { label: "已关闭", className: "closed" },
  };
  const PRIORITY_META = {
    normal: { label: "普通", className: "normal" },
    high: { label: "重要", className: "high" },
    urgent: { label: "紧急", className: "urgent" },
  };
  const CATEGORIES = [
    { code: "system_error", label: "系统异常", sources: ["driver", "manager"] },
    { code: "experience", label: "页面或操作体验", sources: ["driver", "manager"] },
    { code: "feature", label: "功能建议", sources: ["driver", "manager"] },
    { code: "data_error", label: "数据错误", sources: ["driver", "manager"] },
    { code: "driver_dispatch", label: "运单与派单", sources: ["driver"] },
    { code: "driver_node", label: "运输节点与拍照", sources: ["driver"] },
    { code: "driver_expense", label: "费用与结算", sources: ["driver"] },
    { code: "driver_vehicle", label: "车辆与证件", sources: ["driver"] },
    { code: "driver_account", label: "账号与实名认证", sources: ["driver"] },
    { code: "manager_dispatch", label: "计划与派单", sources: ["manager"] },
    { code: "manager_archive", label: "车辆、司机与客户档案", sources: ["manager"] },
    { code: "manager_finance", label: "财务与结算", sources: ["manager"] },
    { code: "manager_report", label: "数据报表", sources: ["manager"] },
    { code: "manager_access", label: "用户与权限", sources: ["manager"] },
    { code: "manager_message", label: "消息与公告", sources: ["manager"] },
    { code: "other", label: "其他问题", sources: ["driver", "manager"] },
  ];

  const clone = (value) => JSON.parse(JSON.stringify(value));
  const clean = (value) => String(value || "").trim();
  const pad = (value) => String(value).padStart(2, "0");
  const localDateText = (date = new Date()) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  const localDateTimeText = (date = new Date()) => `${localDateText(date)} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
  const categoryFor = (code) => CATEGORIES.find((item) => item.code === code) || CATEGORIES.at(-1);

  function makeId(date = new Date()) {
    const sequence = String(date.getTime()).slice(-5);
    return `FB-${localDateText(date).replaceAll("-", "")}-${sequence}`;
  }

  function normalize(item, index = 0) {
    const createdAt = clean(item?.createdAt) || localDateTimeText();
    const source = item?.source === "manager" ? "manager" : "driver";
    const category = categoryFor(item?.categoryCode);
    const status = STATUS_META[item?.status] ? item.status : "pending";
    const priority = PRIORITY_META[item?.priority] ? item.priority : "normal";
    const attachments = Array.isArray(item?.attachments) ? item.attachments.map((attachment, attachmentIndex) => ({
      id: clean(attachment?.id) || `feedback-attachment-${index}-${attachmentIndex}`,
      name: clean(attachment?.name) || `附件${attachmentIndex + 1}`,
      type: clean(attachment?.type) || "application/octet-stream",
      size: Math.max(0, Number(attachment?.size) || 0),
      uploadedAt: clean(attachment?.uploadedAt) || createdAt,
    })) : [];
    const history = Array.isArray(item?.history) && item.history.length ? item.history.map((entry) => ({
      action: clean(entry?.action) || "updated",
      label: clean(entry?.label) || "更新反馈",
      operator: clean(entry?.operator) || "系统",
      createdAt: clean(entry?.createdAt) || createdAt,
    })) : [{ action: "submitted", label: "提交反馈", operator: clean(item?.submitterName) || "提交人", createdAt }];
    return {
      id: clean(item?.id) || `FB-${index + 1}`,
      source,
      sourceLabel: SOURCE_LABELS[source],
      submitterId: clean(item?.submitterId),
      submitterName: clean(item?.submitterName) || "未知提交人",
      submitterPhone: clean(item?.submitterPhone),
      submitterAccount: clean(item?.submitterAccount),
      submitterRole: clean(item?.submitterRole),
      submitterDepartment: clean(item?.submitterDepartment),
      organizationName: clean(item?.organizationName),
      fleetName: clean(item?.fleetName),
      capacityOwnership: clean(item?.capacityOwnership),
      vehicleId: clean(item?.vehicleId),
      categoryCode: category.code,
      categoryLabel: clean(item?.categoryLabel) || category.label,
      description: clean(item?.description),
      contactPhone: clean(item?.contactPhone) || clean(item?.submitterPhone),
      relatedType: clean(item?.relatedType),
      relatedId: clean(item?.relatedId),
      relatedLabel: clean(item?.relatedLabel),
      clientVersion: clean(item?.clientVersion) || "1.0.0",
      deviceInfo: clean(item?.deviceInfo),
      status,
      priority,
      handlerName: clean(item?.handlerName),
      publicReply: clean(item?.publicReply),
      internalNote: clean(item?.internalNote),
      closeReason: clean(item?.closeReason),
      attachments,
      history,
      createdAt,
      updatedAt: clean(item?.updatedAt) || createdAt,
      handledAt: clean(item?.handledAt),
      legacy: Boolean(item?.legacy),
    };
  }

  function readStored(storage = window.localStorage) {
    try {
      const stored = JSON.parse(storage.getItem(STORAGE_KEY) || "null");
      if (Array.isArray(stored)) return stored.map(normalize);
    } catch (error) {
      console.warn("意见反馈读取失败。", error);
    }
    return [];
  }

  function migrateLegacyManagerFeedback(records, storage = window.localStorage) {
    if (records.length) return records;
    try {
      const legacy = JSON.parse(storage.getItem(LEGACY_MANAGER_KEY) || "null");
      if (!Array.isArray(legacy) || !legacy.length) return records;
      return legacy.map((item, index) => normalize({
        id: `FB-LEGACY-${String(index + 1).padStart(3, "0")}`,
        source: "manager",
        submitterId: "legacy-manager",
        submitterName: "管理端用户",
        submitterRole: "历史记录",
        categoryCode: "other",
        description: item?.content,
        createdAt: item?.createdAt,
        legacy: true,
      }, index));
    } catch (error) {
      return records;
    }
  }

  function load(storage = window.localStorage) {
    const records = migrateLegacyManagerFeedback(readStored(storage), storage);
    if (records.length && !storage.getItem(STORAGE_KEY)) save(records, storage);
    return records;
  }

  function save(records, storage = window.localStorage) {
    const normalized = records.map(normalize);
    storage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    if (typeof window.dispatchEvent === "function" && typeof CustomEvent !== "undefined") {
      window.dispatchEvent(new CustomEvent("feedbacks-updated", { detail: clone(normalized) }));
    }
    return normalized;
  }

  function create(input, storage = window.localStorage) {
    const now = new Date();
    const createdAt = clean(input?.createdAt) || localDateTimeText(now);
    const record = normalize({
      ...input,
      id: clean(input?.id) || makeId(now),
      status: "pending",
      priority: clean(input?.priority) || "normal",
      createdAt,
      updatedAt: createdAt,
      history: [{ action: "submitted", label: "提交反馈", operator: clean(input?.submitterName) || "提交人", createdAt }],
    });
    const records = load(storage);
    records.unshift(record);
    save(records, storage);
    return record;
  }

  function update(id, changes, operator = "系统管理员", storage = window.localStorage) {
    const records = load(storage);
    const index = records.findIndex((item) => item.id === id);
    if (index < 0) return null;
    const current = records[index];
    const updatedAt = localDateTimeText();
    const statusChanged = changes.status && changes.status !== current.status;
    const replyChanged = clean(changes.publicReply) && clean(changes.publicReply) !== current.publicReply;
    const next = normalize({ ...current, ...changes, updatedAt });
    if (statusChanged) next.history.push({ action: "status", label: `状态更新为${STATUS_META[next.status].label}`, operator, createdAt: updatedAt });
    if (replyChanged) next.history.push({ action: "reply", label: "回复提交人", operator, createdAt: updatedAt });
    if (["resolved", "closed"].includes(next.status) && !next.handledAt) next.handledAt = updatedAt;
    records[index] = next;
    save(records, storage);
    return next;
  }

  function categories(source = "") {
    return CATEGORIES.filter((item) => !source || item.sources.includes(source)).map((item) => ({ ...item, sources: [...item.sources] }));
  }

  function bySubmitter(source, submitterId, storage = window.localStorage) {
    return load(storage).filter((item) => item.source === source && item.submitterId === submitterId)
      .sort((left, right) => right.createdAt.localeCompare(left.createdAt));
  }

  function periodBounds(now = new Date()) {
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const day = today.getDay() || 7;
    const week = new Date(today);
    week.setDate(today.getDate() - day + 1);
    const month = new Date(now.getFullYear(), now.getMonth(), 1);
    return { today, week, month };
  }

  function dateValue(value) {
    const normalized = clean(value).replace(" ", "T");
    const date = new Date(normalized);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  function matchesPeriod(record, period = "all", now = new Date()) {
    if (period === "all") return true;
    const createdAt = dateValue(record.createdAt);
    if (!createdAt) return false;
    const bounds = periodBounds(now);
    return createdAt >= (bounds[period] || bounds.today) && createdAt <= now;
  }

  function stats(records, now = new Date()) {
    return {
      all: records.length,
      today: records.filter((item) => matchesPeriod(item, "today", now)).length,
      week: records.filter((item) => matchesPeriod(item, "week", now)).length,
      month: records.filter((item) => matchesPeriod(item, "month", now)).length,
    };
  }

  function filter(records, filters = {}, now = new Date()) {
    const keyword = clean(filters.keyword).toLowerCase();
    return records.filter((item) => {
      const searchText = [item.id, item.submitterName, item.submitterPhone, item.submitterAccount, item.description, item.relatedId, item.relatedLabel].join(" ").toLowerCase();
      const created = item.createdAt.slice(0, 10);
      return (!filters.source || filters.source === "all" || item.source === filters.source)
        && (!filters.categoryCode || item.categoryCode === filters.categoryCode)
        && (!filters.status || item.status === filters.status)
        && (!keyword || searchText.includes(keyword))
        && (!filters.startDate || created >= filters.startDate)
        && (!filters.endDate || created <= filters.endDate)
        && matchesPeriod(item, filters.period || "all", now);
    });
  }

  function validateFiles(fileList) {
    const files = Array.from(fileList || []);
    if (files.length > 9) return { error: "最多上传 9 个附件。", files: [] };
    if (files.filter((file) => String(file.type).startsWith("video/")).length > 2) return { error: "视频附件最多上传 2 个。", files: [] };
    for (const file of files) {
      const isImage = String(file.type).startsWith("image/");
      const isVideo = String(file.type).startsWith("video/");
      if (!isImage && !isVideo) return { error: `不支持文件“${file.name}”，请上传图片或视频。`, files: [] };
      if (isImage && file.size > 10 * 1024 * 1024) return { error: `图片“${file.name}”超过 10 MB。`, files: [] };
      if (isVideo && file.size > 100 * 1024 * 1024) return { error: `视频“${file.name}”超过 100 MB。`, files: [] };
    }
    return { error: "", files };
  }

  function openAttachmentDatabase() {
    return new Promise((resolve, reject) => {
      if (!window.indexedDB) return reject(new Error("当前浏览器不支持附件存储"));
      const request = window.indexedDB.open(DATABASE_NAME, 1);
      request.onupgradeneeded = () => request.result.createObjectStore(ATTACHMENT_STORE, { keyPath: "id" });
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error("附件存储初始化失败"));
    });
  }

  async function saveAttachments(feedbackId, fileList) {
    const validation = validateFiles(fileList);
    if (validation.error) throw new Error(validation.error);
    const createdAt = localDateTimeText();
    const metadata = validation.files.map((file, index) => ({
      id: `feedback-${feedbackId}-${Date.now()}-${index}`,
      name: file.name,
      type: file.type || "application/octet-stream",
      size: file.size,
      uploadedAt: createdAt,
    }));
    if (!metadata.length) return [];
    const database = await openAttachmentDatabase();
    await new Promise((resolve, reject) => {
      const transaction = database.transaction(ATTACHMENT_STORE, "readwrite");
      const store = transaction.objectStore(ATTACHMENT_STORE);
      metadata.forEach((item, index) => store.put({ id: item.id, blob: validation.files[index] }));
      transaction.oncomplete = resolve;
      transaction.onerror = () => reject(transaction.error || new Error("附件保存失败"));
      transaction.onabort = () => reject(transaction.error || new Error("附件保存已取消"));
    }).finally(() => database.close());
    return metadata;
  }

  async function getAttachment(id) {
    const database = await openAttachmentDatabase();
    try {
      return await new Promise((resolve, reject) => {
        const request = database.transaction(ATTACHMENT_STORE, "readonly").objectStore(ATTACHMENT_STORE).get(id);
        request.onsuccess = () => resolve(request.result?.blob || null);
        request.onerror = () => reject(request.error || new Error("附件读取失败"));
      });
    } finally {
      database.close();
    }
  }

  const api = {
    STORAGE_KEY, LEGACY_MANAGER_KEY, SOURCE_LABELS, STATUS_META, PRIORITY_META, CATEGORIES,
    normalize, load, save, create, update, categories, bySubmitter, stats, filter, matchesPeriod,
    validateFiles, saveAttachments, getAttachment, makeId, localDateTimeText,
  };
  if (typeof window !== "undefined") window.FeedbackManager = api;
  if (typeof document === "undefined" || !document.querySelector("#feedbackManagementPage")) return;

  const escapeHtml = (value) => String(value ?? "").replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[character]));
  const page = document.querySelector("#feedbackManagementPage");
  const queryForm = document.querySelector("#feedbackQueryForm");
  const body = document.querySelector("#feedbackManagementBody");
  const detailDialog = document.querySelector("#feedbackDetailDialog");
  const detailForm = document.querySelector("#feedbackDetailForm");
  const objectUrls = [];
  let currentPage = 1;
  let pageSize = 10;
  let period = "all";
  let source = "all";
  let detailId = "";

  function clearObjectUrls() {
    objectUrls.splice(0).forEach((url) => URL.revokeObjectURL(url));
  }

  function formFilters(includePeriod = true) {
    const values = new FormData(queryForm);
    return {
      source,
      period: includePeriod ? period : "all",
      keyword: clean(values.get("keyword")),
      categoryCode: clean(values.get("categoryCode")),
      status: clean(values.get("status")),
      startDate: clean(values.get("startDate")),
      endDate: clean(values.get("endDate")),
    };
  }

  function baseRows() {
    return filter(load(), formFilters(false));
  }

  function visibleRows() {
    return filter(load(), formFilters(true)).sort((left, right) => right.createdAt.localeCompare(left.createdAt));
  }

  function renderStats() {
    const values = stats(baseRows());
    const config = [
      ["all", "意见反馈总数", values.all, "全部历史反馈"],
      ["today", "今日反馈", values.today, "今日 00:00 至现在"],
      ["week", "本周反馈", values.week, "本周一至现在"],
      ["month", "本月反馈", values.month, "本月 1 日至现在"],
    ];
    document.querySelector("#feedbackSummary").innerHTML = config.map(([key, label, value, note]) => `<button class="feedback-stat-card ${period === key ? "active" : ""}" data-feedback-period="${key}" type="button" aria-pressed="${period === key}"><span>${label}</span><strong>${value}</strong><small>${note}</small></button>`).join("");
  }

  function submitterMarkup(item) {
    const identity = item.source === "driver"
      ? [item.capacityOwnership, item.organizationName || item.fleetName].filter(Boolean).join(" · ")
      : [item.submitterDepartment, item.submitterRole].filter(Boolean).join(" · ");
    return `<strong>${escapeHtml(item.submitterName)}</strong><small>${escapeHtml(identity || item.submitterAccount || "-")}</small>`;
  }

  function renderTable(rows) {
    const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
    currentPage = Math.min(Math.max(1, currentPage), pageCount);
    const visible = rows.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    body.innerHTML = visible.length ? visible.map((item) => {
      const statusMeta = STATUS_META[item.status];
      const priorityMeta = PRIORITY_META[item.priority];
      const related = item.relatedLabel || item.relatedId || "未关联";
      return `<tr><td><strong class="primary-text">${escapeHtml(item.id)}</strong></td><td><span class="feedback-source ${item.source}">${escapeHtml(item.sourceLabel)}</span></td><td class="feedback-submitter">${submitterMarkup(item)}</td><td>${escapeHtml(item.categoryLabel)}</td><td><div class="feedback-description-cell">${escapeHtml(item.description)}</div></td><td>${escapeHtml(related)}</td><td>${item.attachments.length ? `${item.attachments.length} 个` : "无"}</td><td><time>${escapeHtml(item.createdAt)}</time></td><td><span class="feedback-status ${statusMeta.className}">${statusMeta.label}</span><small class="feedback-priority ${priorityMeta.className}">${priorityMeta.label}</small></td><td>${escapeHtml(item.handlerName || "未指派")}</td><td class="fixed-action-column"><button class="link-btn" data-feedback-view="${escapeHtml(item.id)}" type="button">查看处理</button></td></tr>`;
    }).join("") : '<tr><td colspan="11"><div class="feedback-empty"><strong>暂无匹配的意见反馈</strong><span>可以调整来源、状态或日期条件后重新查询。</span></div></td></tr>';
    document.querySelector("#feedbackResultText").textContent = `筛选结果 ${rows.length} 条反馈`;
    document.querySelector("#feedbackCountBadge").textContent = `${rows.filter((item) => item.status === "pending").length} 条待处理`;
    document.querySelector("#feedbackCurrentPage").textContent = String(currentPage);
    document.querySelector("#feedbackPrevPage").disabled = currentPage <= 1;
    document.querySelector("#feedbackNextPage").disabled = currentPage >= pageCount;
    document.querySelector("#feedbackTotalText").textContent = `共 ${rows.length} 条记录`;
  }

  function renderPage() {
    renderStats();
    renderTable(visibleRows());
    document.querySelectorAll("[data-feedback-source]").forEach((button) => {
      const active = button.dataset.feedbackSource === source;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    window.lucide?.createIcons();
  }

  function detailInfo(item) {
    const identity = item.source === "driver"
      ? [["司机编号", item.submitterId], ["手机号", item.submitterPhone], ["运力归属", item.capacityOwnership], ["所属单位", item.organizationName], ["所属车队", item.fleetName], ["当前车辆", item.vehicleId]]
      : [["账号", item.submitterAccount], ["手机号", item.submitterPhone], ["所属部门", item.submitterDepartment], ["当前角色", item.submitterRole]];
    return [["来源端", item.sourceLabel], ["提交人", item.submitterName], ...identity, ["问题类型", item.categoryLabel], ["关联业务", item.relatedLabel || item.relatedId || "未关联"], ["联系方式", item.contactPhone || "未提供"], ["提交时间", item.createdAt], ["客户端", `${item.clientVersion}${item.deviceInfo ? ` · ${item.deviceInfo}` : ""}`]];
  }

  async function renderDetailAttachments(item) {
    const container = document.querySelector("#feedbackDetailAttachments");
    clearObjectUrls();
    if (!item.attachments.length) {
      container.innerHTML = '<div class="feedback-media-empty">未上传图片或视频</div>';
      return;
    }
    container.innerHTML = '<div class="feedback-media-empty">正在加载附件…</div>';
    const loaded = await Promise.all(item.attachments.map(async (attachment) => ({ ...attachment, blob: await getAttachment(attachment.id).catch(() => null) })));
    if (!detailDialog.open || item.id !== detailId) return;
    container.innerHTML = loaded.map((attachment) => {
      if (!attachment.blob) return `<article class="feedback-media-missing"><i data-lucide="file-warning"></i><span>${escapeHtml(attachment.name)}</span><small>附件当前不可读取</small></article>`;
      const url = URL.createObjectURL(attachment.blob);
      objectUrls.push(url);
      return attachment.type.startsWith("video/")
        ? `<figure class="feedback-media-item"><video src="${url}" controls preload="metadata"></video><figcaption>${escapeHtml(attachment.name)}</figcaption></figure>`
        : `<figure class="feedback-media-item"><img src="${url}" alt="${escapeHtml(attachment.name)}" /><figcaption>${escapeHtml(attachment.name)}</figcaption></figure>`;
    }).join("");
    window.lucide?.createIcons();
  }

  function openDetail(id) {
    const item = load().find((record) => record.id === id);
    if (!item) return;
    detailId = item.id;
    document.querySelector("#feedbackDetailTitle").textContent = "意见反馈详情";
    document.querySelector("#feedbackDetailSubtitle").textContent = `${item.id} · ${item.sourceLabel} · ${item.submitterName}`;
    document.querySelector("#feedbackDetailInfo").innerHTML = detailInfo(item).map(([label, value]) => `<div><span>${escapeHtml(label)}</span><strong>${escapeHtml(value || "-")}</strong></div>`).join("");
    document.querySelector("#feedbackDetailDescription").textContent = item.description;
    document.querySelector("#feedbackDetailTimeline").innerHTML = item.history.slice().reverse().map((entry) => `<div><i></i><span><strong>${escapeHtml(entry.label)}</strong><small>${escapeHtml(entry.operator)} · ${escapeHtml(entry.createdAt)}</small></span></div>`).join("");
    detailForm.elements.status.value = item.status;
    detailForm.elements.priority.value = item.priority;
    detailForm.elements.handlerName.value = item.handlerName || "系统管理员";
    detailForm.elements.publicReply.value = item.publicReply;
    detailForm.elements.internalNote.value = item.internalNote;
    detailDialog.showModal();
    renderDetailAttachments(item);
  }

  function closeDetail() {
    if (detailDialog.open) detailDialog.close();
    detailId = "";
    clearObjectUrls();
  }

  function recordOperation(item) {
    window.OperationLogManager?.record?.({
      moduleId: "feedbackManagement",
      moduleName: "意见反馈管理",
      actionId: "edit",
      actionName: "处理反馈",
      operatorId: "user-current",
      operatorName: detailForm.elements.handlerName.value || "系统管理员",
      operatorAccount: "zhangdd",
      roleName: "系统管理员",
      targetType: "意见反馈",
      targetId: item.id,
      targetLabel: `${item.sourceLabel} · ${item.submitterName}`,
      content: `将反馈状态更新为${STATUS_META[item.status].label}`,
      result: "success",
    });
  }

  function exportCsv() {
    const rows = visibleRows();
    const values = [["反馈编号", "来源端", "提交人", "问题类型", "问题描述", "关联业务", "提交时间", "状态", "处理人"], ...rows.map((item) => [item.id, item.sourceLabel, item.submitterName, item.categoryLabel, item.description, item.relatedLabel || item.relatedId, item.createdAt, STATUS_META[item.status].label, item.handlerName])];
    const csv = `\ufeff${values.map((row) => row.map((cell) => `"${String(cell || "").replaceAll('"', '""')}"`).join(",")).join("\n")}`;
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `意见反馈-${localDateText()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  document.querySelector("#feedbackCategoryFilter").innerHTML += categories().map((item) => `<option value="${item.code}">${item.label}</option>`).join("");
  queryForm.addEventListener("submit", (event) => { event.preventDefault(); currentPage = 1; renderPage(); });
  document.querySelector("#feedbackClearBtn").addEventListener("click", () => { queryForm.reset(); source = "all"; period = "all"; currentPage = 1; renderPage(); });
  document.querySelector("#feedbackSourceFilters").addEventListener("click", (event) => {
    const button = event.target.closest("[data-feedback-source]");
    if (!button) return;
    source = button.dataset.feedbackSource;
    currentPage = 1;
    renderPage();
  });
  document.querySelector("#feedbackSummary").addEventListener("click", (event) => {
    const button = event.target.closest("[data-feedback-period]");
    if (!button) return;
    period = button.dataset.feedbackPeriod;
    currentPage = 1;
    renderPage();
  });
  body.addEventListener("click", (event) => {
    const button = event.target.closest("[data-feedback-view]");
    if (button) openDetail(button.dataset.feedbackView);
  });
  document.querySelector("#feedbackPageSize").addEventListener("change", (event) => { pageSize = Number(event.target.value) || 10; currentPage = 1; renderPage(); });
  document.querySelector("#feedbackPrevPage").addEventListener("click", () => { currentPage -= 1; renderPage(); });
  document.querySelector("#feedbackNextPage").addEventListener("click", () => { currentPage += 1; renderPage(); });
  document.querySelector("#feedbackExportBtn").addEventListener("click", exportCsv);
  document.querySelector("#closeFeedbackDetailBtn").addEventListener("click", closeDetail);
  document.querySelector("#cancelFeedbackDetailBtn").addEventListener("click", closeDetail);
  detailDialog.addEventListener("close", clearObjectUrls);
  detailForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const values = new FormData(detailForm);
    const item = update(detailId, {
      status: clean(values.get("status")),
      priority: clean(values.get("priority")),
      handlerName: clean(values.get("handlerName")),
      publicReply: clean(values.get("publicReply")),
      internalNote: clean(values.get("internalNote")),
    }, clean(values.get("handlerName")) || "系统管理员");
    if (item) recordOperation(item);
    closeDetail();
    renderPage();
  });
  window.addEventListener("storage", (event) => { if (event.key === STORAGE_KEY) renderPage(); });
  window.addEventListener("feedbacks-updated", renderPage);
  page.addEventListener("feedback-page-open", renderPage);
  renderPage();
})();
