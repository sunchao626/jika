(function () {
  const STORAGE_KEY = "container-logistics-photo-requirements-v1";
  const seed = {
    "提空装货": [
      { id: "PR-TE-01", name: "左侧箱体", description: "拍摄空箱左侧整体，画面需包含箱体外观。", quantity: 1 },
      { id: "PR-TE-02", name: "右侧箱体", description: "拍摄空箱右侧整体，画面需包含箱体外观。", quantity: 1 },
      { id: "PR-TE-03", name: "前侧箱体", description: "拍摄空箱前侧整体。", quantity: 1 },
      { id: "PR-TE-04", name: "后侧箱体", description: "拍摄空箱后侧整体。", quantity: 1 },
      { id: "PR-TE-05", name: "空箱全开门", description: "箱门完全打开，拍清箱内情况。", quantity: 1 },
      { id: "PR-TE-06", name: "临封照片", description: "拍清临时封条及封号。", quantity: 1 },
      { id: "PR-TE-07", name: "装货过程与完成照片", description: "记录装货过程、装货完成状态及封门情况。", quantity: 6 },
      { id: "PR-TE-08", name: "铁路临封照片", description: "拍清铁路进站临封及封号。", quantity: 3 },
    ],
    "提重送货": [
      { id: "PR-TZ-01", name: "全关门箱门照片", description: "拍摄重箱箱门关闭后的整体状态。", quantity: 1 },
      { id: "PR-TZ-02", name: "封号照片", description: "近距离拍摄封条，确保封号清晰可辨。", quantity: 1 },
      { id: "PR-TZ-03", name: "卸货过程照片", description: "记录卸货现场和作业过程。", quantity: 3 },
      { id: "PR-TZ-04", name: "空箱照片", description: "拍摄返还空箱的外观和箱内情况。", quantity: 5 },
    ],
    "排空箱（A→B）": [
      { id: "PR-PA-01", name: "左侧箱体", description: "拍摄空箱左侧整体，画面需包含箱体外观。", quantity: 1 },
      { id: "PR-PA-02", name: "右侧箱体", description: "拍摄空箱右侧整体，画面需包含箱体外观。", quantity: 1 },
      { id: "PR-PA-03", name: "前侧箱体", description: "拍摄空箱前侧整体。", quantity: 1 },
      { id: "PR-PA-04", name: "后侧箱体", description: "拍摄空箱后侧整体。", quantity: 1 },
      { id: "PR-PA-05", name: "空箱全开门", description: "箱门完全打开，拍清箱内情况。", quantity: 1 },
      { id: "PR-PA-06", name: "临封照片", description: "拍清临时封条及封号。", quantity: 1 },
    ],
    "排重箱（A→B）": [
      { id: "PR-PZ-01", name: "全关门箱门照片", description: "拍摄重箱箱门关闭后的整体状态。", quantity: 1 },
      { id: "PR-PZ-02", name: "封条照片", description: "近距离拍摄封条，确保封号清晰可辨。", quantity: 1 },
      { id: "PR-PZ-03", name: "铁路临封照片", description: "拍清铁路进站临封及封号。", quantity: 3 },
    ],
  };

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function normalizeRequirement(requirement, index, taskType) {
    return {
      id: String(requirement?.id || `${taskType}-${index + 1}`),
      name: String(requirement?.name || "").trim(),
      description: String(requirement?.description || "").trim(),
      quantity: Math.max(1, Math.min(99, Number(requirement?.quantity) || 1)),
    };
  }

  function load() {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      if (stored && typeof stored === "object" && !Array.isArray(stored)) {
        return Object.fromEntries(Object.keys(window.DispatchTaskNodes.sequences).map((taskType) => [
          taskType,
          Array.isArray(stored[taskType])
            ? stored[taskType].map((item, index) => normalizeRequirement(item, index, taskType))
            : clone(seed[taskType] || []),
        ]));
      }
    } catch (error) {
      console.warn("司机拍照要求读取失败，使用默认配置。", error);
    }
    return clone(seed);
  }

  function save(configuration) {
    const normalized = Object.fromEntries(Object.keys(window.DispatchTaskNodes.sequences).map((taskType) => [
      taskType,
      (Array.isArray(configuration?.[taskType]) ? configuration[taskType] : [])
        .map((item, index) => normalizeRequirement(item, index, taskType)),
    ]));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    window.dispatchEvent(new CustomEvent("photo-requirements-updated", { detail: clone(normalized) }));
    return normalized;
  }

  function forTaskType(taskType, configuration = load()) {
    return clone(configuration[taskType] || []);
  }

  window.PhotoRequirementConfig = { STORAGE_KEY, load, save, forTaskType };
})();
