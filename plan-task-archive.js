(function (root, factory) {
  const api = factory(root || globalThis);
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (root) root.PlanTaskArchive = api.manager || api;
})(typeof window !== "undefined" ? window : globalThis, function (root) {
  "use strict";

  const DB_NAME = "container-logistics-plan-task-archives";
  const STORE_NAME = "attachments";
  const DB_VERSION = 1;
  const MAX_FILE_SIZE = 25 * 1024 * 1024;
  const CATEGORIES = ["合同资料", "委托资料", "箱货资料", "报关资料", "签收回单", "结算票据", "现场凭证", "其他"];
  const memoryRecords = [];
  let databasePromise = null;

  const clean = (value) => String(value == null ? "" : value).trim();
  const escapeHtml = (value) => String(value == null ? "" : value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);

  function formatFileSize(bytes) {
    const size = Number(bytes) || 0;
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${Math.ceil(size / 1024)} KB`;
    return `${(size / 1024 / 1024).toFixed(1)} MB`;
  }

  function extensionOf(name) {
    const match = clean(name).toLowerCase().match(/\.([a-z0-9]+)$/);
    return match ? match[1] : "";
  }

  function previewKind(file = {}) {
    const type = clean(file.type).toLowerCase();
    const extension = extensionOf(file.name);
    if (type.startsWith("image/") || ["jpg", "jpeg", "png", "gif", "webp", "bmp"].includes(extension)) return "image";
    if (type === "application/pdf" || extension === "pdf") return "pdf";
    if (type.startsWith("text/") || ["txt", "csv", "json", "xml", "md"].includes(extension)) return "text";
    return "download";
  }

  function filterRecords(records, filters = {}) {
    const keyword = clean(filters.keyword).toLowerCase();
    const category = clean(filters.category);
    return (records || []).filter((record) => {
      if (category && record.category !== category) return false;
      return !keyword || [record.name, record.category, record.uploadedBy].join(" ").toLowerCase().includes(keyword);
    }).sort((left, right) => String(right.uploadedAt).localeCompare(String(left.uploadedAt)) || String(right.id).localeCompare(String(left.id)));
  }

  function openDatabase() {
    if (!root.indexedDB) return Promise.resolve(null);
    if (databasePromise) return databasePromise;
    databasePromise = new Promise((resolve, reject) => {
      const request = root.indexedDB.open(DB_NAME, DB_VERSION);
      request.addEventListener("upgradeneeded", () => {
        const database = request.result;
        const store = database.objectStoreNames.contains(STORE_NAME)
          ? request.transaction.objectStore(STORE_NAME)
          : database.createObjectStore(STORE_NAME, { keyPath: "id" });
        if (!store.indexNames.contains("planTaskId")) store.createIndex("planTaskId", "planTaskId", { unique: false });
      });
      request.addEventListener("success", () => resolve(request.result));
      request.addEventListener("error", () => reject(request.error));
    });
    return databasePromise;
  }

  async function listRecords(planTaskId) {
    const database = await openDatabase();
    if (!database) return memoryRecords.filter((item) => item.planTaskId === planTaskId);
    return new Promise((resolve, reject) => {
      const request = database.transaction(STORE_NAME, "readonly").objectStore(STORE_NAME).index("planTaskId").getAll(planTaskId);
      request.addEventListener("success", () => resolve(request.result || []));
      request.addEventListener("error", () => reject(request.error));
    });
  }

  async function saveRecords(records) {
    const database = await openDatabase();
    if (!database) {
      memoryRecords.push(...records);
      return records;
    }
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      records.forEach((record) => store.put(record));
      transaction.addEventListener("complete", () => resolve(records));
      transaction.addEventListener("error", () => reject(transaction.error));
    });
  }

  async function getRecord(id) {
    const database = await openDatabase();
    if (!database) return memoryRecords.find((item) => item.id === id) || null;
    return new Promise((resolve, reject) => {
      const request = database.transaction(STORE_NAME, "readonly").objectStore(STORE_NAME).get(id);
      request.addEventListener("success", () => resolve(request.result || null));
      request.addEventListener("error", () => reject(request.error));
    });
  }

  async function deleteRecord(id) {
    const database = await openDatabase();
    if (!database) {
      const index = memoryRecords.findIndex((item) => item.id === id);
      if (index >= 0) memoryRecords.splice(index, 1);
      return;
    }
    return new Promise((resolve, reject) => {
      const request = database.transaction(STORE_NAME, "readwrite").objectStore(STORE_NAME).delete(id);
      request.addEventListener("success", resolve);
      request.addEventListener("error", () => reject(request.error));
    });
  }

  function createManager() {
    if (typeof document === "undefined") return null;
    const uploadDialog = document.querySelector("#planArchiveUploadDialog");
    const previewDialog = document.querySelector("#planArchivePreviewDialog");
    if (!uploadDialog || !previewDialog) return null;
    const uploadInput = document.querySelector("#planArchiveFiles");
    const uploadCategory = document.querySelector("#planArchiveUploadCategory");
    const uploadList = document.querySelector("#planArchiveSelectedFiles");
    const uploadConfirm = document.querySelector("#confirmPlanArchiveUpload");
    const previewTitle = document.querySelector("#planArchivePreviewTitle");
    const previewMeta = document.querySelector("#planArchivePreviewMeta");
    const previewBody = document.querySelector("#planArchivePreviewBody");
    const previewDownload = document.querySelector("#downloadPlanArchivePreview");
    let activePlanTaskId = "";
    let activeTaskNo = "";
    let activeRoot = null;
    let activeObjectUrl = "";
    let previewRecordId = "";

    uploadCategory.innerHTML = CATEGORIES.map((category) => `<option>${escapeHtml(category)}</option>`).join("");

    function recordAudit(action, content, attachment, changes = []) {
      root.OperationLogManager?.record?.({
        moduleId: "waybill",
        moduleName: "计划与任务",
        actionId: action,
        actionName: action === "create" ? "上传附件" : action === "delete" ? "删除附件" : "下载附件",
        operatorId: "user-current",
        operatorName: "张调度",
        operatorAccount: "zhangdd",
        roleName: "调度员",
        targetType: "计划任务档案",
        targetId: activeTaskNo || activePlanTaskId,
        targetLabel: attachment?.name || "档案附件",
        content,
        changes,
      });
    }

    function showNotice(message) {
      if (typeof root.showApplicationAlert === "function") root.showApplicationAlert(message);
      else root.alert(message);
    }

    async function render() {
      if (!activeRoot || !activePlanTaskId) return;
      const renderRoot = activeRoot;
      const planTaskId = activePlanTaskId;
      const list = renderRoot.querySelector("[data-plan-archive-list]");
      const keyword = renderRoot.querySelector("[data-plan-archive-search]").value;
      const category = renderRoot.querySelector("[data-plan-archive-filter]").value;
      const records = await listRecords(planTaskId);
      if (renderRoot !== activeRoot || planTaskId !== activePlanTaskId) return;
      const visible = filterRecords(records, { keyword, category });
      const totalSize = records.reduce((sum, item) => sum + (Number(item.size) || 0), 0);
      renderRoot.querySelector("[data-plan-archive-summary]").textContent = `${visible.length === records.length ? `共 ${records.length}` : `筛选 ${visible.length} / ${records.length}`} 个附件 · ${formatFileSize(totalSize)}`;
      list.innerHTML = visible.length ? visible.map((record) => {
        const kind = previewKind(record);
        const icon = kind === "image" ? "image" : kind === "pdf" ? "file-text" : kind === "text" ? "file-code-2" : "file-archive";
        return `<article class="plan-archive-item" data-archive-id="${escapeHtml(record.id)}"><div class="plan-archive-file-icon ${kind}"><i data-lucide="${icon}" aria-hidden="true"></i></div><div class="plan-archive-file-main"><strong title="${escapeHtml(record.name)}">${escapeHtml(record.name)}</strong><div><span class="plan-archive-category">${escapeHtml(record.category)}</span><span>${escapeHtml(formatFileSize(record.size))}</span><span>${escapeHtml(record.uploadedBy)} · ${escapeHtml(record.uploadedAt)}</span></div></div><div class="plan-archive-actions"><button class="link-btn" data-archive-preview type="button">${kind === "download" ? "查看信息" : "预览"}</button><button class="link-btn" data-archive-download type="button">下载</button><button class="link-btn delete-btn" data-archive-delete type="button">删除</button></div></article>`;
      }).join("") : `<div class="plan-archive-empty"><i data-lucide="folder-open" aria-hidden="true"></i><strong>${records.length ? "没有匹配的档案附件" : "暂未归档附件"}</strong><span>${records.length ? "调整名称或分类筛选后重试。" : "上传合同、委托资料、箱货资料、回单或其他业务文件。"}</span></div>`;
      root.lucide?.createIcons();
    }

    function mount(planTaskId, taskNo, container) {
      activePlanTaskId = clean(planTaskId);
      activeTaskNo = clean(taskNo);
      container.querySelector("[data-plan-archive-root]")?.remove();
      container.insertAdjacentHTML("beforeend", `<section class="plan-detail-section plan-archive-section" data-plan-archive-root><div class="plan-detail-section-heading plan-archive-heading"><div><strong>档案附件</strong><small>归档该计划任务的合同、单据、回单及其他业务资料</small></div><button class="btn primary" data-plan-archive-upload type="button"><i data-lucide="upload" aria-hidden="true"></i>上传附件</button></div><div class="plan-archive-toolbar"><label class="plan-archive-search"><i data-lucide="search" aria-hidden="true"></i><input data-plan-archive-search type="search" placeholder="搜索附件名称、分类或上传人" /></label><label><span>附件分类</span><select data-plan-archive-filter><option value="">全部分类</option>${CATEGORIES.map((item) => `<option>${escapeHtml(item)}</option>`).join("")}</select></label><span class="plan-archive-summary" data-plan-archive-summary>读取中…</span></div><div class="plan-archive-list" data-plan-archive-list aria-live="polite"></div></section>`);
      activeRoot = container.querySelector("[data-plan-archive-root]");
      activeRoot.querySelector("[data-plan-archive-search]").addEventListener("input", render);
      activeRoot.querySelector("[data-plan-archive-filter]").addEventListener("change", render);
      activeRoot.querySelector("[data-plan-archive-upload]").addEventListener("click", () => {
        uploadInput.value = "";
        uploadList.innerHTML = '<div class="plan-archive-upload-empty">请选择一个或多个文件，业务数量不限制</div>';
        uploadConfirm.disabled = true;
        if (typeof uploadDialog.showModal === "function") uploadDialog.showModal(); else uploadDialog.setAttribute("open", "");
      });
      activeRoot.querySelector("[data-plan-archive-list]").addEventListener("click", handleListAction);
      render();
    }

    function closeUpload() {
      if (uploadDialog.open) uploadDialog.close();
      uploadInput.value = "";
    }

    function closePreview() {
      if (previewDialog.open) previewDialog.close();
      if (activeObjectUrl) URL.revokeObjectURL(activeObjectUrl);
      activeObjectUrl = "";
      previewRecordId = "";
      previewBody.innerHTML = "";
    }

    uploadInput.addEventListener("change", () => {
      const files = [...(uploadInput.files || [])];
      const oversized = files.filter((file) => file.size > MAX_FILE_SIZE);
      uploadConfirm.disabled = !files.length || Boolean(oversized.length);
      uploadList.innerHTML = files.length ? files.map((file) => `<div class="${file.size > MAX_FILE_SIZE ? "invalid" : ""}"><i data-lucide="file" aria-hidden="true"></i><span><strong>${escapeHtml(file.name)}</strong><small>${escapeHtml(formatFileSize(file.size))}${file.size > MAX_FILE_SIZE ? " · 超过 25 MB" : ""}</small></span></div>`).join("") : '<div class="plan-archive-upload-empty">请选择一个或多个文件，业务数量不限制</div>';
      root.lucide?.createIcons();
    });

    uploadConfirm.addEventListener("click", async () => {
      const files = [...(uploadInput.files || [])];
      if (!files.length || files.some((file) => file.size > MAX_FILE_SIZE)) return;
      uploadConfirm.disabled = true;
      uploadConfirm.textContent = "保存中…";
      const uploadedAt = new Date().toLocaleString("zh-CN", { hour12: false }).replaceAll("/", "-");
      const category = uploadCategory.value || "其他";
      const records = files.map((file) => ({ id: `PTA-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`, planTaskId: activePlanTaskId, taskNo: activeTaskNo, name: file.name, type: file.type, size: file.size, category, uploadedAt, uploadedBy: "张调度", blob: file }));
      try {
        await saveRecords(records);
        recordAudit("create", `为计划任务 ${activeTaskNo} 上传 ${records.length} 个档案附件`, records[0], [{ field: "attachment", before: "-", after: records.map((item) => item.name).join("、") }]);
        closeUpload();
        await render();
      } catch (error) {
        console.error(error);
        showNotice("附件保存失败，请检查浏览器存储空间后重试。");
      } finally {
        uploadConfirm.textContent = "确认上传";
        uploadConfirm.disabled = false;
      }
    });

    async function download(id, audit = true) {
      const record = await getRecord(id);
      if (!record?.blob) return;
      const url = URL.createObjectURL(record.blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = record.name;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 0);
      if (audit) recordAudit("export", `下载计划任务 ${activeTaskNo} 的档案附件 ${record.name}`, record);
    }

    async function preview(id) {
      const record = await getRecord(id);
      if (!record) return;
      closePreview();
      previewRecordId = id;
      previewTitle.textContent = record.name;
      previewMeta.textContent = `${record.category} · ${formatFileSize(record.size)} · ${record.uploadedBy}上传`;
      const kind = previewKind(record);
      if (kind === "text") {
        const text = await record.blob.text();
        previewBody.innerHTML = `<pre>${escapeHtml(text.slice(0, 200000))}</pre>`;
      } else if (["image", "pdf"].includes(kind)) {
        activeObjectUrl = URL.createObjectURL(record.blob);
        previewBody.innerHTML = kind === "image" ? `<img src="${activeObjectUrl}" alt="${escapeHtml(record.name)}" />` : `<iframe src="${activeObjectUrl}" title="${escapeHtml(record.name)}"></iframe>`;
      } else {
        previewBody.innerHTML = `<div class="plan-archive-preview-unavailable"><i data-lucide="file-down" aria-hidden="true"></i><strong>该格式暂不支持在线预览</strong><span>文件已安全归档，可下载后使用本地应用查看。</span></div>`;
      }
      if (typeof previewDialog.showModal === "function") previewDialog.showModal(); else previewDialog.setAttribute("open", "");
      root.lucide?.createIcons();
    }

    async function handleListAction(event) {
      const item = event.target.closest("[data-archive-id]");
      if (!item) return;
      const id = item.dataset.archiveId;
      if (event.target.closest("[data-archive-preview]")) return preview(id);
      if (event.target.closest("[data-archive-download]")) return download(id);
      if (!event.target.closest("[data-archive-delete]")) return;
      const record = await getRecord(id);
      const remove = async () => {
        await deleteRecord(id);
        recordAudit("delete", `删除计划任务 ${activeTaskNo} 的档案附件 ${record?.name || id}`, record, [{ field: "attachment", before: record?.name || id, after: "已删除" }]);
        await render();
      };
      if (typeof root.askApplicationConfirm === "function") root.askApplicationConfirm(`确定删除附件“${record?.name || "该文件"}”吗？删除后无法预览或下载。`, { label: "确认删除附件", danger: true }, remove);
      else if (root.confirm(`确定删除附件“${record?.name || "该文件"}”吗？`)) remove();
    }

    document.querySelector("#cancelPlanArchiveUpload").addEventListener("click", closeUpload);
    document.querySelector("#closePlanArchiveUpload").addEventListener("click", closeUpload);
    uploadDialog.addEventListener("cancel", (event) => { event.preventDefault(); closeUpload(); });
    document.querySelector("#closePlanArchivePreview").addEventListener("click", closePreview);
    document.querySelector("#closePlanArchivePreviewFooter").addEventListener("click", closePreview);
    previewDialog.addEventListener("cancel", (event) => { event.preventDefault(); closePreview(); });
    previewDownload.addEventListener("click", () => previewRecordId && download(previewRecordId));
    return { mount, render, listRecords };
  }

  const manager = createManager();
  return { DB_NAME, STORE_NAME, MAX_FILE_SIZE, CATEGORIES, formatFileSize, extensionOf, previewKind, filterRecords, manager };
});
