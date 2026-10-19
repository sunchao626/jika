(() => {
  const STORAGE_KEY = "container-logistics-transport-task-config-v1";
  const NOTIFICATION_STORAGE_KEY = "container-logistics-transport-node-notifications-v1";
  const PHOTO_STORAGE_KEY = "container-logistics-photo-requirements-v1";
  const legacySequences = {
    "提空装货": ["已提空", "空箱在途", "到达仓库", "完成装货", "重箱在途", "重箱进站", "完成落重"],
    "提重送货": ["已提重", "重箱在途", "到达仓库", "完成卸货", "空箱在途", "空箱进站", "完成落空"],
    "排空箱（A→B）": ["已提空", "空箱在途", "完成落空"],
    "排重箱（A→B）": ["已提重", "重箱在途", "箱进站", "完成落重"],
  };
  const legacyPhotoRules = {
    "提空装货": [
      ["左侧箱体", "拍摄空箱左侧整体，画面需包含箱体外观。", 1], ["右侧箱体", "拍摄空箱右侧整体，画面需包含箱体外观。", 1],
      ["前侧箱体", "拍摄空箱前侧整体。", 1], ["后侧箱体", "拍摄空箱后侧整体。", 1],
      ["空箱全开门", "箱门完全打开，拍清箱内情况。", 1], ["临封照片", "拍清临时封条及封号。", 1],
      ["装货过程与完成照片", "记录装货过程、装货完成状态及封门情况。", 6], ["铁路临封照片", "拍清铁路进站临封及封号。", 3],
    ],
    "提重送货": [["全关门箱门照片", "拍摄重箱箱门关闭后的整体状态。", 1], ["封号照片", "近距离拍摄封条，确保封号清晰可辨。", 1], ["卸货过程照片", "记录卸货现场和作业过程。", 3], ["空箱照片", "拍摄返还空箱的外观和箱内情况。", 5]],
    "排空箱（A→B）": [["左侧箱体", "拍摄空箱左侧整体，画面需包含箱体外观。", 1], ["右侧箱体", "拍摄空箱右侧整体，画面需包含箱体外观。", 1], ["前侧箱体", "拍摄空箱前侧整体。", 1], ["后侧箱体", "拍摄空箱后侧整体。", 1], ["空箱全开门", "箱门完全打开，拍清箱内情况。", 1], ["临封照片", "拍清临时封条及封号。", 1]],
    "排重箱（A→B）": [["全关门箱门照片", "拍摄重箱箱门关闭后的整体状态。", 1], ["封条照片", "近距离拍摄封条，确保封号清晰可辨。", 1], ["铁路临封照片", "拍清铁路进站临封及封号。", 3]],
  };
  const roleOptions = ["调度员", "调度管理员", "车队管理员", "管理员"];
  const clone = (value) => JSON.parse(JSON.stringify(value));

  function assignPhotos(taskType, nodeName, rules) {
    const text = Array.isArray(rules) ? rules[0] || "" : rules.name || "";
    if (taskType === "提空装货") {
      if (["左侧箱体", "右侧箱体", "前侧箱体", "后侧箱体", "空箱全开门"].includes(text)) return nodeName === "已提空";
      if (text === "临封照片" || text === "装货过程与完成照片") return nodeName === "完成装货";
      return nodeName === "重箱进站";
    }
    if (taskType === "提重送货") {
      if (["全关门箱门照片", "封号照片"].includes(text)) return nodeName === "已提重";
      if (text === "卸货过程照片") return nodeName === "完成卸货";
      return nodeName === "空箱进站";
    }
    if (taskType === "排空箱（A→B）") return nodeName === "已提空";
    if (text === "铁路临封照片") return nodeName === "箱进站";
    return nodeName === "已提重";
  }

  function legacyPhotosFor(taskType) {
    try {
      const stored = JSON.parse(localStorage.getItem(PHOTO_STORAGE_KEY) || "null");
      if (Array.isArray(stored?.[taskType])) return stored[taskType];
    } catch (_error) { /* Fall back to the bundled legacy rules. */ }
    return legacyPhotoRules[taskType].map(([name, description, quantity], index) => ({ id: `${taskType}-PR-${index + 1}`, name, description, quantity }));
  }

  function createLegacyConfig() {
    return Object.entries(legacySequences).map(([taskType, names], typeIndex) => ({
      id: `TT-${String(typeIndex + 1).padStart(3, "0")}`,
      name: taskType,
      enabled: true,
      nodes: names.map((name, nodeIndex) => ({
        id: `${taskType}-${nodeIndex + 1}`,
        name,
        photoRequirements: legacyPhotosFor(taskType)
          .filter((rule) => assignPhotos(taskType, name, rule)),
        reminders: { start: { enabled: false, roles: [] }, completion: { enabled: false, roles: [] } },
      })),
    }));
  }

  function normalizeRequirement(item = {}, index = 0) {
    return {
      id: String(item.id || `PR-${index + 1}`),
      name: String(item.name || "").trim(),
      description: String(item.description || "").trim(),
      quantity: Math.max(1, Math.min(99, Number(item.quantity) || 1)),
    };
  }

  function normalizeNode(node = {}, index = 0, taskType = "") {
    const normalizeReminder = (rule) => ({
      enabled: Boolean(rule?.enabled),
      templateId: String(rule?.templateId || ""),
      templateSnapshot: rule?.templateSnapshot && typeof rule.templateSnapshot === "object" ? clone(rule.templateSnapshot) : null,
      roles: [...new Set((Array.isArray(rule?.roles) ? rule.roles : []).map((role) => String(role || "").trim()).filter(Boolean))],
    });
    return {
      id: String(node.id || `${taskType}-${index + 1}`),
      name: String(node.name || "").trim(),
      photoRequirements: (Array.isArray(node.photoRequirements) ? node.photoRequirements : []).map(normalizeRequirement).filter((item) => item.name),
      reminders: { start: normalizeReminder(node.reminders?.start), completion: normalizeReminder(node.reminders?.completion) },
    };
  }

  function normalizeTaskType(item = {}, index = 0) {
    const name = String(item.name || "").trim();
    return {
      id: String(item.id || `TT-${Date.now()}-${index}`),
      name,
      enabled: item.enabled !== false,
      nodes: (Array.isArray(item.nodes) ? item.nodes : []).map((node, nodeIndex) => normalizeNode(node, nodeIndex, name)).filter((node) => node.name),
    };
  }

  function load() {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      const storedTypes = Array.isArray(stored) ? stored : (Array.isArray(stored?.taskTypes) ? stored.taskTypes : []);
      if (storedTypes.length) {
        const normalized = storedTypes.map(normalizeTaskType).filter((item) => item.name);
        if (normalized.length) {
          if (!Array.isArray(stored) || JSON.stringify(stored) !== JSON.stringify(normalized)) {
            try { localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized)); } catch (_error) { /* Keep the migrated in-memory configuration if storage is unavailable. */ }
          }
          return normalized;
        }
      }
    } catch (error) {
      console.warn("任务类型配置读取失败，使用默认配置。", error);
    }
    const initial = createLegacyConfig();
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(initial)); } catch (_error) { /* local demo storage may be unavailable */ }
    return initial;
  }

  let configuration = load();

  function save(nextConfiguration) {
    const normalized = (Array.isArray(nextConfiguration) ? nextConfiguration : []).map(normalizeTaskType).filter((item) => item.name);
    if (!normalized.length) throw new Error("至少保留一个任务类型");
    const names = normalized.map((item) => item.name);
    if (new Set(names).size !== names.length) throw new Error("任务类型名称不能重复");
    normalized.forEach((item) => {
      if (!item.nodes.length) throw new Error(`请为“${item.name}”配置至少一个运输节点`);
      if (new Set(item.nodes.map((node) => node.name)).size !== item.nodes.length) throw new Error(`“${item.name}”中节点名称不能重复`);
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    configuration = normalized;
    window.dispatchEvent(new CustomEvent("transport-task-config-updated", { detail: clone(configuration) }));
    window.dispatchEvent(new CustomEvent("task-types-refreshed", { detail: clone(configuration) }));
    return clone(configuration);
  }

  function taskTypes(options = {}) {
    return clone(configuration.filter((item) => options.includeDisabled || item.enabled));
  }
  function resolve(taskType) {
    return configuration.some((item) => item.name === taskType) ? taskType : (configuration.find((item) => item.enabled)?.name || "");
  }
  function get(taskType) {
    const profile = configuration.find((item) => item.name === resolve(taskType));
    return profile ? profile.nodes.map((node) => node.name) : [];
  }
  function profile(taskType) {
    const item = configuration.find((entry) => entry.name === resolve(taskType));
    return item ? clone(item) : null;
  }
  function snapshot(taskType) {
    const item = profile(taskType);
    return item ? { ...item, nodes: item.nodes.map((node, index) => ({ ...node, order: index + 1 })) } : null;
  }
  function distributeLegacyPhotoRequirements(taskType, requirements, nodes) {
    const rows = (Array.isArray(requirements) ? requirements : []).map(normalizeRequirement).filter((item) => item.name);
    return (Array.isArray(nodes) ? nodes : []).map((node) => ({
      ...clone(node),
      photoRequirements: rows.filter((rule) => assignPhotos(taskType, node.name, rule)),
    }));
  }
  function requirementsFor(taskType, nodeName = "") {
    const task = profile(taskType);
    if (task) {
      const node = task.nodes.find((entry) => entry.name === nodeName);
      if (node) return clone(node.photoRequirements);
    }
    try {
      const stored = JSON.parse(localStorage.getItem(PHOTO_STORAGE_KEY) || "null");
      return clone(Array.isArray(stored?.[taskType]) ? stored[taskType].map(normalizeRequirement) : []);
    } catch (_error) { return []; }
  }

  function notify(dispatch, nodeName, eventType) {
    if (!dispatch || !nodeName || !["start", "completion"].includes(eventType)) return null;
    const node = dispatch.taskConfigSnapshot?.nodes?.find((item) => item.name === nodeName)
      || profile(dispatch.taskType)?.nodes.find((item) => item.name === nodeName);
    const rule = node?.reminders?.[eventType];
    if (!rule || (!rule.enabled && !rule.templateId && !rule.templateSnapshot)) return null;
    const template = rule.templateSnapshot || window.ReminderTemplateManager?.get?.(rule.templateId) || null;
    const recipients = [...new Set([...(template?.recipients || rule.roles || []), dispatch.orderOperatorName || "订单操作人员"])];
    const variables = {
      当前节点: nodeName,
      运单号: dispatch.waybillNo || "",
      司机姓名: dispatch.driverName || "",
      车牌号: dispatch.vehicleId || "",
    };
    const renderMessage = (value) => String(value || "").replace(/\{\{([^}]+)\}\}/g, (_match, key) => variables[key.trim()] || "");
    let records = [];
    try { records = JSON.parse(localStorage.getItem(NOTIFICATION_STORAGE_KEY) || "[]"); } catch (_error) { records = []; }
    const record = {
      id: `NR-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      dispatchId: dispatch.id || "",
      driverId: dispatch.driverId || "",
      driverName: dispatch.driverName || "",
      waybillNo: dispatch.waybillNo || "",
      taskType: dispatch.taskConfigSnapshot?.name || dispatch.taskType || "",
      nodeName,
      eventType,
      templateId: rule.templateId || template?.id || "",
      templateName: template?.name || "旧版节点提醒",
      title: renderMessage(template?.title || (eventType === "start" ? `节点开始：${nodeName}` : `节点完成：${nodeName}`)),
      content: renderMessage(template?.content || `${nodeName}${eventType === "start" ? "已开始" : "已完成"}。`),
      triggerTiming: template?.triggerTiming || "immediate",
      offsetMinutes: Number(template?.offsetMinutes) || 0,
      recipients,
      channels: [...(template?.channels || ["站内消息"])],
      status: "已生成",
      createdAt: new Date().toISOString(),
    };
    records.unshift(record);
    localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(records.slice(0, 500)));
    window.dispatchEvent(new CustomEvent("transport-node-notification-created", { detail: clone(record) }));
    return clone(record);
  }

  const api = {
    STORAGE_KEY, NOTIFICATION_STORAGE_KEY, roleOptions, legacySequences,
    get defaultType() { return configuration.find((item) => item.enabled)?.name || ""; },
    get sequences() { return Object.fromEntries(configuration.map((item) => [item.name, item.nodes.map((node) => node.name)])); },
    load: () => clone(configuration), save, taskTypes, resolve, get, profile, snapshot, requirementsFor, notify,
    distributeLegacyPhotoRequirements,
  };
  window.DispatchTaskNodes = api;
  window.addEventListener?.("storage", (event) => {
    if (event.key !== STORAGE_KEY) return;
    try {
      const stored = JSON.parse(event.newValue || "[]");
      const storedTypes = Array.isArray(stored) ? stored : stored?.taskTypes;
      if (!Array.isArray(storedTypes) || !storedTypes.length) return;
      configuration = storedTypes.map(normalizeTaskType).filter((item) => item.name);
      window.dispatchEvent(new CustomEvent("transport-task-config-updated", { detail: clone(configuration) }));
      window.dispatchEvent(new CustomEvent("task-types-refreshed", { detail: clone(configuration) }));
    } catch (error) {
      console.warn("任务类型配置同步失败。", error);
    }
  });
})();
