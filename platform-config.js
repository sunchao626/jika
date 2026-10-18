(function () {
  "use strict";

  const PUBLISHED_KEY = "logistics-platform-config-published-v1";
  const DRAFT_KEY = "logistics-platform-config-draft-v1";
  const HISTORY_KEY = "logistics-platform-config-history-v1";

  const DEFAULT_CONFIG = {
    version: 3,
    enterpriseFullName: "浙江集卡物流运输有限公司",
    enterpriseShortName: "集卡物流",
    creditCode: "91330206MA2J5K8X3P",
    enterpriseContact: "王经理",
    enterprisePhone: "0574-8688 6688",
    serviceHours: "工作日 08:30–18:00",
    enterpriseAddress: "浙江省宁波市北仑区港城路 88 号",
    platformName: "集卡物流系统",
    platformEnglishName: "Container Trucking",
    browserTitleSuffix: "集卡物流系统",
    inheritApplicationNames: true,
    adminMobileName: "集卡物流管理端",
    driverAppName: "集卡司机端",
    primaryLogo: "",
    squareIcon: "",
    favicon: "",
    administratorName: "系统管理员",
    administratorAccount: "admin",
    publishedAt: "2026-10-18 09:30",
    publishedBy: "系统管理员",
  };

  const DEFAULT_HISTORY = [
    { version: 3, title: "完善企业主体与各端品牌名称", changes: "企业信息、平台名称、管理移动端与司机端名称", operator: "系统管理员", time: "2026-10-18 09:30", current: true },
    { version: 2, title: "更新平台品牌展示", changes: "平台 Logo、浏览器图标", operator: "系统管理员", time: "2026-10-12 16:08" },
    { version: 1, title: "初始化平台配置", changes: "企业名称、默认超级管理员", operator: "系统管理员", time: "2026-10-01 10:20" },
  ];

  const clone = (value) => JSON.parse(JSON.stringify(value));
  const readJson = (key, fallback) => {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      return value && typeof value === "object" ? value : clone(fallback);
    } catch (_error) {
      return clone(fallback);
    }
  };
  const saveJson = (key, value) => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (_error) { /* demo storage may be unavailable */ }
  };
  const normalize = (value) => String(value || "").trim();
  const escapeHtml = (value) => String(value ?? "").replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[character]));

  function getPublished() {
    return { ...clone(DEFAULT_CONFIG), ...readJson(PUBLISHED_KEY, DEFAULT_CONFIG) };
  }

  function effectiveApplicationName(config, type) {
    if (config.inheritApplicationNames) {
      const suffix = type === "admin" ? "管理端" : "司机端";
      const base = normalize(config.enterpriseShortName) || normalize(config.platformName);
      return `${base}${suffix}`;
    }
    return type === "admin" ? normalize(config.adminMobileName) : normalize(config.driverAppName);
  }

  function applyPublishedBrand(config = getPublished()) {
    const shortName = normalize(config.enterpriseShortName) || normalize(config.platformName) || "集卡物流";
    const mark = shortName.slice(0, 1);
    const brandName = document.querySelector(".brand strong");
    const brandSub = document.querySelector(".brand span");
    const brandMark = document.querySelector(".brand-mark");
    if (brandName) brandName.textContent = config.platformName;
    if (brandSub) brandSub.textContent = config.platformEnglishName || shortName;
    if (brandMark) {
      brandMark.textContent = mark;
      if (config.squareIcon) brandMark.innerHTML = `<img src="${config.squareIcon}" alt="" />`;
    }

    const adminName = effectiveApplicationName(config, "admin");
    const driverName = effectiveApplicationName(config, "driver");
    if (document.querySelector(".manager-shell")) {
      document.title = adminName;
      document.querySelectorAll("#headerEyebrow, .manager-version, .manager-drawer-brand small").forEach((element) => {
        element.textContent = element.classList.contains("manager-version") ? `${adminName} · 1.0` : adminName;
      });
    } else if (document.querySelector(".phone-shell")) {
      document.title = driverName;
      const eyebrow = document.querySelector("#headerEyebrow");
      if (eyebrow) eyebrow.textContent = driverName;
    } else if (!document.querySelector("#platformConfigPage")?.classList.contains("active")) {
      document.title = `${document.querySelector("#pageTitle")?.textContent || "首页看板"} - ${config.browserTitleSuffix || config.platformName}`;
    }

    let favicon = document.querySelector('link[rel="icon"]');
    if (config.favicon) {
      if (!favicon) {
        favicon = document.createElement("link");
        favicon.rel = "icon";
        document.head.appendChild(favicon);
      }
      favicon.href = config.favicon;
    }
  }

  applyPublishedBrand();

  const form = document.querySelector("#platformConfigForm");
  if (!form) {
    window.PlatformConfigManager = { getPublished, applyPublishedBrand };
    return;
  }

  let published = getPublished();
  let current = { ...clone(published), ...readJson(DRAFT_KEY, published) };
  let history = readJson(HISTORY_KEY, DEFAULT_HISTORY);
  let activeTab = "enterprise";
  let feedbackTimer = null;

  const fieldNames = [
    "enterpriseFullName", "enterpriseShortName", "creditCode", "enterpriseContact", "enterprisePhone", "serviceHours", "enterpriseAddress",
    "platformName", "platformEnglishName", "browserTitleSuffix", "adminMobileName", "driverAppName",
  ];

  function setFieldValues(config) {
    fieldNames.forEach((name) => {
      if (form.elements[name]) form.elements[name].value = config[name] || "";
    });
    form.elements.inheritApplicationNames.checked = Boolean(config.inheritApplicationNames);
    current = { ...clone(config) };
    syncInheritance();
  }

  function readForm() {
    const next = { ...current };
    fieldNames.forEach((name) => { next[name] = normalize(form.elements[name]?.value); });
    next.inheritApplicationNames = Boolean(form.elements.inheritApplicationNames.checked);
    return next;
  }

  function comparable(config) {
    const value = clone(config);
    delete value.publishedAt;
    delete value.publishedBy;
    delete value.version;
    return JSON.stringify(value);
  }

  function isDirty() {
    return comparable(readForm()) !== comparable(published);
  }

  function syncInheritance() {
    const inherit = form.elements.inheritApplicationNames.checked;
    const wrapper = document.querySelector("#platformApplicationNames");
    wrapper?.setAttribute("aria-disabled", String(inherit));
    [form.elements.adminMobileName, form.elements.driverAppName].forEach((input) => { input.disabled = inherit; });
  }

  function showFeedback(message) {
    const feedback = document.querySelector("#platformConfigFeedback");
    if (!feedback) return;
    feedback.textContent = message;
    feedback.hidden = false;
    clearTimeout(feedbackTimer);
    feedbackTimer = setTimeout(() => { feedback.hidden = true; }, 3200);
  }

  function recordAudit({ actionId = "config", actionName = "配置变更", content, changes = [], operatorName, operatorAccount }) {
    window.OperationLogManager?.record({
      moduleId: "systemConfig",
      moduleName: "系统配置",
      actionId,
      actionName,
      operatorId: "user-admin",
      operatorName: operatorName || current.administratorName || "系统管理员",
      operatorAccount: operatorAccount || current.administratorAccount || "admin",
      roleName: "系统管理员",
      targetType: "平台配置",
      targetId: "PLATFORM-CONFIG",
      targetLabel: current.platformName || "集卡物流系统",
      content,
      result: "success",
      changes,
    });
  }

  function updatePreview() {
    current = readForm();
    const shortName = current.enterpriseShortName || current.platformName || "集";
    const adminName = effectiveApplicationName(current, "admin");
    const driverName = effectiveApplicationName(current, "driver");
    const values = {
      platformPreviewMark: shortName.slice(0, 1),
      platformPreviewName: current.platformName || "未命名平台",
      platformPreviewEnglish: current.platformEnglishName || current.enterpriseShortName || "",
      platformPreviewBrowserTitle: `平台配置 - ${current.browserTitleSuffix || current.platformName || "平台"}`,
      platformPreviewAdminName: adminName,
      platformPreviewDriverName: driverName,
    };
    Object.entries(values).forEach(([id, value]) => {
      const element = document.querySelector(`#${id}`);
      if (element) element.textContent = value;
    });
    const mark = document.querySelector("#platformPreviewMark");
    if (mark && current.squareIcon) mark.innerHTML = `<img src="${current.squareIcon}" alt="" />`;
    document.querySelector("#platformAdminName").textContent = current.administratorName || "系统管理员";
    document.querySelector("#platformAdminAccount").textContent = `${current.administratorAccount || "admin"} · 超级管理员`;
    updateDirtyState();
  }

  function updateDirtyState() {
    const state = document.querySelector("#platformUnsavedState");
    if (!state) return;
    const dirty = isDirty();
    state.classList.toggle("dirty", dirty);
    state.innerHTML = `<i></i>${dirty ? "有未发布的配置变更" : "当前配置与已发布版本一致"}`;
    const status = document.querySelector("#platformConfigStatus");
    if (status) status.innerHTML = `<i></i>${dirty ? `草稿待发布 · V${published.version + 1}` : `已发布 · V${published.version}`}`;
  }

  function updatePublishedMeta() {
    const meta = document.querySelector("#platformConfigPublishedAt");
    if (meta) meta.textContent = `${published.publishedAt} · ${published.publishedBy}`;
  }

  function switchTab(tab) {
    activeTab = tab;
    document.querySelectorAll("[data-platform-tab]").forEach((button) => {
      button.classList.toggle("active", button.dataset.platformTab === tab);
    });
    document.querySelectorAll("[data-platform-panel]").forEach((panel) => {
      const active = panel.dataset.platformPanel === tab;
      panel.classList.toggle("active", active);
      panel.hidden = !active;
    });
    if (tab === "history") renderHistory();
  }

  function renderHistory() {
    const list = document.querySelector("#platformHistoryList");
    const count = document.querySelector("#platformHistoryCount");
    if (count) count.textContent = `${history.length} 个版本`;
    if (!list) return;
    list.innerHTML = history.map((item) => `<article class="platform-history-item"><i>V${escapeHtml(item.version)}</i><div><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(item.changes)}</span><small>${escapeHtml(item.time)} · ${escapeHtml(item.operator)}</small></div><em>${item.current ? "当前版本" : "历史版本"}</em></article>`).join("");
  }

  function clearValidity() {
    ["enterpriseFullName", "enterpriseShortName", "creditCode", "platformName", "adminMobileName", "driverAppName"].forEach((name) => form.elements[name]?.setCustomValidity(""));
  }

  function validate() {
    clearValidity();
    const config = readForm();
    if (config.enterpriseFullName.length < 2) form.elements.enterpriseFullName.setCustomValidity("企业全称至少需要 2 个字符。");
    if (config.enterpriseShortName.length < 2) form.elements.enterpriseShortName.setCustomValidity("企业简称至少需要 2 个字符。");
    if (config.platformName.length < 2) form.elements.platformName.setCustomValidity("平台名称至少需要 2 个字符。");
    if (config.creditCode && !/^[0-9A-Z]{18}$/.test(config.creditCode)) form.elements.creditCode.setCustomValidity("请输入 18 位数字或大写字母组成的统一社会信用代码。");
    if (!config.inheritApplicationNames) {
      if (config.adminMobileName.length < 2) form.elements.adminMobileName.setCustomValidity("管理移动端名称至少需要 2 个字符。");
      if (config.driverAppName.length < 2) form.elements.driverAppName.setCustomValidity("司机端名称至少需要 2 个字符。");
    }
    const firstInvalid = form.querySelector(":invalid");
    if (firstInvalid) {
      const panel = firstInvalid.closest("[data-platform-panel]");
      if (panel) switchTab(panel.dataset.platformPanel);
      firstInvalid.reportValidity();
      return false;
    }
    return true;
  }

  function saveDraft() {
    current = readForm();
    saveJson(DRAFT_KEY, current);
    updatePreview();
    showFeedback("平台配置草稿已保存，尚未影响线上展示。");
    recordAudit({ content: "保存平台配置草稿，尚未发布生效" });
  }

  function requestPublish() {
    if (!validate()) return;
    current = readForm();
    saveJson(DRAFT_KEY, current);
    const dialog = document.querySelector("#platformPublishDialog");
    if (typeof dialog?.showModal === "function") dialog.showModal();
  }

  function publish() {
    const now = new Date();
    const date = now.toLocaleString("zh-CN", { hour12: false }).replaceAll("/", "-");
    const version = Number(published.version || 0) + 1;
    published = {
      ...readForm(),
      version,
      publishedAt: date,
      publishedBy: current.administratorName || "系统管理员",
    };
    history = history.map((item) => ({ ...item, current: false }));
    history.unshift({
      version,
      title: "发布平台配置更新",
      changes: "企业信息、品牌名称、应用展示与管理员配置",
      operator: published.publishedBy,
      time: date,
      current: true,
    });
    current = clone(published);
    saveJson(PUBLISHED_KEY, published);
    saveJson(DRAFT_KEY, current);
    saveJson(HISTORY_KEY, history);
    document.querySelector("#platformPublishDialog")?.close();
    updatePublishedMeta();
    renderHistory();
    updatePreview();
    applyPublishedBrand(published);
    showFeedback(`平台配置 V${version} 已发布，各端刷新后生效。`);
    recordAudit({ content: `发布平台配置 V${version}，各端刷新后生效` });
  }

  function resetToPublished() {
    setFieldValues(published);
    saveJson(DRAFT_KEY, published);
    updatePreview();
    showFeedback("已恢复到当前已发布版本。");
    recordAudit({ content: `将平台配置草稿恢复至已发布版本 V${published.version}` });
  }

  function handleUpload(event) {
    const input = event.currentTarget;
    const file = input.files?.[0];
    if (!file) return;
    const allowedTypes = input.name === "favicon"
      ? ["image/png", "image/x-icon", "image/vnd.microsoft.icon"]
      : ["image/png", "image/jpeg", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      input.value = "";
      showFeedback(input.name === "favicon" ? "浏览器图标仅支持 PNG 或 ICO。" : "品牌图片仅支持 PNG、JPG 或 WebP。");
      return;
    }
    const limit = input.name === "favicon" ? 512 * 1024 : 2 * 1024 * 1024;
    if (file.size > limit) {
      input.value = "";
      showFeedback(input.name === "favicon" ? "浏览器图标不能超过 512KB。" : "图片文件不能超过 2MB。");
      return;
    }
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      current[input.name] = String(reader.result || "");
      const preview = document.querySelector(`[data-upload-preview="${input.name}"]`);
      if (preview) preview.innerHTML = `<img src="${current[input.name]}" alt="${input.name === "primaryLogo" ? "平台主 Logo 预览" : "平台图标预览"}" />`;
      updatePreview();
      showFeedback("图片已加入当前草稿，发布后正式生效。");
    });
    reader.readAsDataURL(file);
  }

  function openAdminDialog() {
    const dialog = document.querySelector("#platformAdminDialog");
    const adminForm = document.querySelector("#platformAdminForm");
    adminForm?.reset();
    if (typeof dialog?.showModal === "function") dialog.showModal();
  }

  function changeAdministrator(event) {
    event.preventDefault();
    const adminForm = event.currentTarget;
    if (!adminForm.reportValidity()) return;
    const [name, account] = String(adminForm.elements.administrator.value).split("|");
    const previousName = current.administratorName || "系统管理员";
    const previousAccount = current.administratorAccount || "admin";
    const previousAdministrator = `${previousName}（${previousAccount}）`;
    current = readForm();
    current.administratorName = name;
    current.administratorAccount = account;
    document.querySelector("#platformAdminName").textContent = name;
    document.querySelector("#platformAdminAccount").textContent = `${account} · 超级管理员`;
    document.querySelector("#platformAdminDialog")?.close();
    updatePreview();
    showFeedback(`已将 ${name} 设为草稿中的超级管理员，发布后生效。`);
    recordAudit({ actionId: "permission", actionName: "权限变更", content: `将 ${name} 设为草稿中的超级管理员，发布后生效`, changes: [{ field: "role", before: previousAdministrator, after: `${name}（${account}）` }], operatorName: previousName, operatorAccount: previousAccount });
  }

  function render() {
    setFieldValues(current);
    updatePublishedMeta();
    renderHistory();
    ["primaryLogo", "squareIcon", "favicon"].forEach((name) => {
      if (!current[name]) return;
      const preview = document.querySelector(`[data-upload-preview="${name}"]`);
      if (preview) preview.innerHTML = `<img src="${current[name]}" alt="品牌资源预览" />`;
    });
    updatePreview();
    window.lucide?.createIcons();
  }

  document.querySelectorAll("[data-platform-tab]").forEach((button) => button.addEventListener("click", () => switchTab(button.dataset.platformTab)));
  form.addEventListener("input", (event) => {
    if (event.target === form.elements.inheritApplicationNames) syncInheritance();
    updatePreview();
  });
  form.addEventListener("change", (event) => {
    if (event.target.matches('input[type="file"]')) handleUpload(event);
  });
  document.querySelector("#savePlatformDraftBtn")?.addEventListener("click", saveDraft);
  document.querySelector("#publishPlatformConfigBtn")?.addEventListener("click", requestPublish);
  document.querySelector("#resetPlatformConfigBtn")?.addEventListener("click", resetToPublished);
  document.querySelector("#cancelPlatformPublish")?.addEventListener("click", () => document.querySelector("#platformPublishDialog")?.close());
  document.querySelector("#confirmPlatformPublish")?.addEventListener("click", publish);
  document.querySelector("#changePlatformAdminBtn")?.addEventListener("click", openAdminDialog);
  document.querySelector("#closePlatformAdminDialog")?.addEventListener("click", () => document.querySelector("#platformAdminDialog")?.close());
  document.querySelector("#cancelPlatformAdminDialog")?.addEventListener("click", () => document.querySelector("#platformAdminDialog")?.close());
  document.querySelector("#platformAdminForm")?.addEventListener("submit", changeAdministrator);
  document.querySelector("#openUserAccessBtn")?.addEventListener("click", () => document.querySelector('[data-page="user-access"]')?.click());
  window.addEventListener("beforeunload", (event) => {
    if (!isDirty()) return;
    event.preventDefault();
    event.returnValue = "";
  });

  window.PlatformConfigManager = { render, getPublished, applyPublishedBrand, validate };
  render();
  const requestedTab = new URLSearchParams(window.location.search).get("platformTab");
  if (["enterprise", "brand", "administrators", "history"].includes(requestedTab)) switchTab(requestedTab);
})();
