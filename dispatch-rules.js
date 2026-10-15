(() => {
  const SETTINGS_KEY = "container-logistics-auto-dispatch-settings-v1";
  const defaultRuleConfig = {
    filters: { filterVehicleStatus: true, filterDriverStatus: true, filterDailyTrips: true, filterCapacity: true, filterTimeWindow: true, filterCrossRoute: true },
    scores: { scoreIdle: true, scoreIdleValue: 100, scoreInTransit: true, scoreInTransitValue: 20, scoreRouteMatch: true, scoreRouteMatchValue: 30, scoreDriverLoad: true, scoreDriverLoadValue: 20, scoreDistance: true, scoreDistanceValue: 20, scoreDelay: true, scoreDelayValue: -15, scoreTimeTight: true, scoreTimeTightValue: -10 },
  };

  const cloneDefaults = () => ({
    filters: { ...defaultRuleConfig.filters },
    scores: { ...defaultRuleConfig.scores },
  });

  function loadRuleConfig() {
    try {
      const saved = JSON.parse(window.localStorage?.getItem(SETTINGS_KEY) || "{}");
      return {
        filters: { ...defaultRuleConfig.filters, ...(saved.ruleConfig?.filters || {}) },
        scores: { ...defaultRuleConfig.scores, ...(saved.ruleConfig?.scores || {}) },
      };
    } catch (error) {
      return cloneDefaults();
    }
  }

  function scoreMatch(signals = {}, ruleConfig = loadRuleConfig()) {
    const scores = ruleConfig.scores || defaultRuleConfig.scores;
    const tags = [];
    let positive = 0;
    let penalty = 0;
    let maximum = 0;

    const addPositive = (enabledKey, valueKey, matched, label, detail = "") => {
      if (!scores[enabledKey]) return;
      const value = Math.max(0, Number(scores[valueKey]) || 0);
      maximum += value;
      if (!matched) return;
      positive += value;
      tags.push({ label, detail, value });
    };
    const addPenalty = (enabledKey, valueKey, matched, label, detail = "") => {
      if (!scores[enabledKey] || !matched) return;
      const value = Math.min(0, Number(scores[valueKey]) || 0);
      penalty += value;
      tags.push({ label, detail, value });
    };

    // The two vehicle-state rules are alternatives, so only the larger enabled value
    // contributes to the score ceiling.
    const idleValue = scores.scoreIdle ? Math.max(0, Number(scores.scoreIdleValue) || 0) : 0;
    const transitValue = scores.scoreInTransit ? Math.max(0, Number(scores.scoreInTransitValue) || 0) : 0;
    maximum += Math.max(idleValue, transitValue);
    if (signals.idle && scores.scoreIdle) {
      positive += idleValue;
      tags.push({ label: "空闲优先", detail: "车辆当前空闲", value: idleValue });
    } else if (signals.inTransit && scores.scoreInTransit) {
      positive += transitValue;
      tags.push({ label: "在途可调度", detail: "保留可调度的在途运力", value: transitValue });
    }

    const routeValue = scores.scoreRouteMatch ? Math.max(0, Number(scores.scoreRouteMatchValue) || 0) : 0;
    if (scores.scoreRouteMatch) maximum += routeValue;
    if (scores.scoreRouteMatch && (signals.routeVehicle || signals.familiarDriver)) {
      positive += routeValue;
      if (signals.routeVehicle) tags.push({ label: "线路专属车辆", detail: "车辆归属线路一致", value: routeValue });
      if (signals.familiarDriver) tags.push({ label: "司机熟悉线路", detail: "司机为线路常用司机", value: routeValue });
    }
    addPositive("scoreDriverLoad", "scoreDriverLoadValue", signals.lowDriverLoad, "司机任务较少", "按司机近期接单量优先");
    addPositive("scoreDistance", "scoreDistanceValue", signals.closeToPickup, "距离装货点较近", "预计可较快抵达装货点");
    addPenalty("scoreDelay", "scoreDelayValue", signals.recentDelay, "近期存在延误", "近 30 天存在延误记录");
    addPenalty("scoreTimeTight", "scoreTimeTightValue", signals.timeTight, "可用时间紧张", "当前任务剩余可用时间偏紧");

    const ratio = maximum > 0 ? positive / maximum : 0;
    const normalizedPenalty = maximum > 0 ? penalty / maximum * 100 : penalty;
    const score = signals.unavailable || maximum <= 0 ? 0 : Math.round(Math.max(0, Math.min(100, 60 + ratio * 40 + normalizedPenalty)));
    return { score, tags, ruleConfig };
  }

  window.DispatchRuleRegistry = {
    SETTINGS_KEY,
    defaultRuleConfig,
    loadRuleConfig,
    scoreMatch,
  };
})();
