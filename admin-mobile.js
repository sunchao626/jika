const moduleCatalog = {
  waybill: {
    title: "运单管理", eyebrow: "集卡业务", icon: "file-text", primary: "新增运单",
    filters: ["全部", "草拟", "已审核"],
    items: [
      { id: "WB20260916001", title: "宁波远海供应链有限公司", subtitle: "北仑港至江北仓", status: "草拟", statusClass: "warning", fields: [["接单日期", "2026-09-16"], ["箱型", "40HQ"], ["装卸地址", "北仑港区二期 / 江北仓"], ["回单", "未收到"]], note: "上午装柜" },
      { id: "WB20260916002", title: "上海嘉航国际物流有限公司", subtitle: "洋山港至昆山保税区", status: "草拟", statusClass: "warning", fields: [["接单日期", "2026-09-16"], ["箱型", "20GP*2"], ["装卸地址", "上海洋山港 / 昆山综保区"], ["回单", "未收到"]], note: "双拖作业" },
      { id: "WB20260916003", title: "杭州联贸进出口有限公司", subtitle: "萧山仓至梅山码头", status: "已审核", statusClass: "success", fields: [["接单日期", "2026-09-15"], ["箱型", "40GP"], ["装卸地址", "杭州萧山仓 / 梅山码头"], ["回单", "无需回单"]], note: "夜间进港" },
      { id: "WB20260916004", title: "苏州新程电子科技有限公司", subtitle: "苏州园区至外高桥", status: "草拟", statusClass: "warning", fields: [["接单日期", "2026-09-14"], ["箱型", "20GP"], ["装卸地址", "苏州工业园 / 外高桥"], ["回单", "未收到"]], note: "客户指定司机" },
    ],
  },
  route: {
    title: "固定线路管理", eyebrow: "集卡业务", icon: "route", primary: "新增线路",
    filters: ["全部", "启用", "停用"],
    items: [
      { id: "XL-001", title: "北仑港—比亚迪宁波基地", subtitle: "XL-HM-BYD · 宁波北仑港区二期 → 北仑三期堆场", status: "启用", statusClass: "success", fields: [["线路编号", "XL-HM-BYD"], ["客户 / 项目", "华贸 / 比亚迪"], ["起运地 → 目的地", "宁波北仑港区二期 → 北仑三期堆场"], ["里程", "46.2 KM"], ["预估收入", "¥2860"], ["提成方式", "固定金额提成"]], note: "比亚迪项目日常线路", raw: { id: "XL-001", routeCode: "XL-HM-BYD", customerId: "KH-HM", customerName: "华贸", projectId: "PR-HM-BYD", projectName: "比亚迪", routeName: "北仑港—比亚迪宁波基地", origin: "宁波北仑港区二期", destination: "北仑三期堆场", pickupPoint: "北仑二期空箱堆场", loadingPoint: "比亚迪宁波基地", unloadingPoint: "宁波铁路北站", dropoffPoint: "北仑三期堆场", viaPoints: "北仑收费站", mileage: 46.2, routeState: "启用", estimatedRevenue: 2860, baseFreight: 2600, commissionType: "fixed", commissionValue: 420, commissionRemark: "含港区等待补贴", defaultVehicle: "浙B·K7812", defaultDriver: "王海", remark: "比亚迪项目日常线路" } },
      { id: "XL-002", title: "洋山港—昆山保税区", subtitle: "XL-LG-TH · 上海洋山港 → 洋山一期堆场", status: "启用", statusClass: "success", fields: [["线路编号", "XL-LG-TH"], ["客户 / 项目", "陆港多联 / 提箱装货"], ["起运地 → 目的地", "上海洋山港 → 洋山一期堆场"], ["里程", "122.5 KM"], ["预估收入", "¥3520"], ["提成方式", "按收入比例提成"]], note: "提箱装货项目双拖线路", raw: { id: "XL-002", routeCode: "XL-LG-TH", customerId: "KH-LG", customerName: "陆港多联", projectId: "PR-LG-TH", projectName: "提箱装货", routeName: "洋山港—昆山保税区", origin: "上海洋山港", destination: "洋山一期堆场", pickupPoint: "洋山港空箱区", loadingPoint: "昆山综合保税区", unloadingPoint: "上海芦潮港铁路站", dropoffPoint: "洋山一期堆场", viaPoints: "东海大桥、沪昆高速", mileage: 122.5, routeState: "启用", estimatedRevenue: 3520, baseFreight: 3200, commissionType: "rate", commissionValue: 16, commissionRemark: "按预估收入 16% 计提", defaultVehicle: "沪D·A9021", defaultDriver: "赵亮", remark: "提箱装货项目双拖线路" } },
      { id: "XL-003", title: "梅山港—金华南站", subtitle: "XL-ZT-X387 · 宁波梅山港 → 梅山保税港区", status: "启用", statusClass: "success", fields: [["线路编号", "XL-ZT-X387"], ["客户 / 项目", "中铁联集项目 / X387"], ["起运地 → 目的地", "宁波梅山港 → 梅山保税港区"], ["里程", "191.8 KM"], ["预估收入", "¥2550"], ["提成方式", "固定金额提成"]], note: "X387 项目出口线路", raw: { id: "XL-003", routeCode: "XL-ZT-X387", customerId: "KH-ZT", customerName: "中铁联集项目", projectId: "PR-ZT-X387", projectName: "X387", routeName: "梅山港—金华南站", origin: "宁波梅山港", destination: "梅山保税港区", pickupPoint: "梅山港空箱区", loadingPoint: "杭州萧山仓", unloadingPoint: "金华南站", dropoffPoint: "梅山保税港区", viaPoints: "杭甬高速", mileage: 191.8, routeState: "启用", estimatedRevenue: 2550, baseFreight: 2380, commissionType: "fixed", commissionValue: 350, commissionRemark: "夜间进港另补 80 元", defaultVehicle: "浙A·F2190", defaultDriver: "陈涛", remark: "X387 项目出口线路" } },
      { id: "XL-004", title: "外高桥—苏州园区", subtitle: "XL-ZT-X8588 · 上海外高桥 → 外高桥五期", status: "启用", statusClass: "success", fields: [["线路编号", "XL-ZT-X8588"], ["客户 / 项目", "中铁联集项目 / X8588"], ["起运地 → 目的地", "上海外高桥 → 外高桥五期"], ["里程", "165.4 KM"], ["预估收入", "¥1980"], ["提成方式", "按收入比例提成"]], note: "X8588 项目固定线路", raw: { id: "XL-004", routeCode: "XL-ZT-X8588", customerId: "KH-ZT", customerName: "中铁联集项目", projectId: "PR-ZT-X8588", projectName: "X8588", routeName: "外高桥—苏州园区", origin: "上海外高桥", destination: "外高桥五期", pickupPoint: "外高桥空箱区", loadingPoint: "苏州工业园区", unloadingPoint: "上海芦潮港站", dropoffPoint: "外高桥五期", viaPoints: "京沪高速", mileage: 165.4, routeState: "启用", estimatedRevenue: 1980, baseFreight: 1850, commissionType: "rate", commissionValue: 15, commissionRemark: "按实际确认收入核算", defaultVehicle: "苏E·T5568", defaultDriver: "刘军", remark: "X8588 项目固定线路" } },
    ],
  },
  dispatch: {
    title: "派单列表", eyebrow: "集卡业务", icon: "send", primary: "新增派单",
    filters: ["全部", "待派单", "已派单", "运输中", "已完成"], listFieldLimit: 6,
    items: [
      { id: "PD-1005", title: "北仑港至江北仓", subtitle: "WB20260916005", status: "待派单", statusClass: "warning", fields: [["司机", "待分配"], ["车辆", "待分配"], ["当前节点", "待派单"], ["派单方式", "待分配"]], note: "等待调度" },
      { id: "PD-1002", title: "洋山港至昆山保税区", subtitle: "WB20260916002", status: "已派单", statusClass: "", fields: [["司机", "赵亮"], ["车辆", "沪D·A9021"], ["当前节点", "待提货"], ["派单方式", "自动派单"]], note: "双拖作业，按现场指引进港" },
      { id: "PD-1001", title: "北仑港至江北仓", subtitle: "WB20260916001", status: "运输中", statusClass: "", fields: [["司机", "王海"], ["车辆", "浙B·K7812"], ["当前节点", "在途"], ["派单方式", "自动派单"]], note: "上午装柜" },
      { id: "PD-1003", title: "萧山仓至梅山码头", subtitle: "WB20260916003", status: "已完成", statusClass: "success", fields: [["司机", "陈涛"], ["车辆", "浙A·F2190"], ["当前节点", "已送达"], ["派单方式", "手动派单"]], note: "夜间进港" },
    ],
  },
  "dispatch-management": {
    title: "任务派单", eyebrow: "计划与派单", icon: "list-checks", primary: "进入调度工作台",
    filters: ["全部", "待匹配", "已匹配", "异常"], listFieldLimit: 6,
    items: [],
  },
  auto: {
    title: "自动派单", eyebrow: "智能调度", icon: "wand-sparkles", primary: "立即执行",
    filters: ["全部", "待处理", "已完成", "异常"],
    items: [
      { id: "AUTO-260916-01", title: "自动执行任务", subtitle: "2026-09-16 09:30", status: "已完成", statusClass: "success", fields: [["接入任务", "4 条"], ["成功派单", "3 条"], ["待人工处理", "1 条"], ["执行耗时", "18 秒"]], note: "线路优先、闲置车辆优先、司机负载均衡" },
      { id: "RULE-01", title: "线路专属车辆优先", subtitle: "匹配规则 01", status: "已启用", statusClass: "success", fields: [["优先级", "最高"], ["适用线路", "全部固定线路"], ["冲突处理", "转入通用车辆池"], ["自动执行", "开启"]], note: "固定线路优先匹配绑定车辆" },
      { id: "RULE-02", title: "闲置运力优先", subtitle: "匹配规则 02", status: "已启用", statusClass: "success", fields: [["优先级", "高"], ["车辆状态", "仅闲置"], ["排除状态", "在途、维修中"], ["自动识别", "开启"]], note: "不分配在途或作业中的车辆" },
      { id: "AUTO-EX-01", title: "WB20260916005", subtitle: "北仑港至江北仓", status: "待处理", statusClass: "warning", fields: [["异常原因", "暂无闲置车辆"], ["建议操作", "人工补派"], ["进入时间", "10:08"], ["优先级", "高"]], note: "当前线路车辆均在执行任务" },
    ],
  },
  vehicle: {
    title: "车辆档案管理", eyebrow: "车辆管理", icon: "truck", primary: "新增车辆",
    filters: ["全部", "自营", "三方", "在用", "维修中", "停用"], listFieldLimit: 6,
    items: [
      { id: "浙B·K7812", title: "集装箱牵引车", subtitle: "宁波港区集卡车队", status: "在用", statusClass: "success", fields: [["司机", "王海"], ["当前状态", "运输中"], ["审验到期", "2026-10-18"], ["保险到期", "2026-10-05"]], note: "港区短驳主力车辆" },
      { id: "沪D·A9021", title: "重型半挂牵引车", subtitle: "临港集卡车队", status: "在用", statusClass: "success", fields: [["司机", "赵亮"], ["当前状态", "已派单"], ["审验到期", "2026-09-28"], ["保险到期", "2026-11-12"]], note: "临港主力运力" },
      { id: "苏E·T5568", title: "集装箱骨架车", subtitle: "苏州园区集卡车队", status: "维修中", statusClass: "warning", fields: [["司机", "刘军"], ["当前状态", "维修中"], ["审验到期", "2026-08-30"], ["保险到期", "2026-09-10"]], note: "待复检，暂不排班" },
      { id: "浙A·F2190", title: "危险品牵引车", subtitle: "杭州危险品运输车队", status: "在用", statusClass: "success", fields: [["司机", "陈涛"], ["当前状态", "已完工"], ["审验到期", "2026-12-20"], ["保险到期", "2026-09-30"]], note: "需随车携带危化品资质" },
    ],
  },
  driver: {
    title: "司机档案", eyebrow: "司机管理", icon: "user-round", primary: "新增司机",
    filters: ["全部", "自营", "三方", "空闲", "运输中", "停用"], listFieldLimit: 6,
    items: [
      { id: "SJ-1001", title: "王海", subtitle: "宁波一队 · 138****8881", status: "运输中", statusClass: "", fields: [["准驾车型", "A2"], ["车辆", "浙B·K7812"], ["认证", "已认证"], ["证件到期", "2027-05-18"]], note: "自有司机" },
      { id: "SJ-1002", title: "赵亮", subtitle: "临港车队 · 139****6662", status: "运输中", statusClass: "", fields: [["准驾车型", "A2"], ["车辆", "沪D·A9021"], ["认证", "已认证"], ["证件到期", "2026-09-28"]], note: "自有司机" },
      { id: "SJ-1003", title: "刘军", subtitle: "苏州二队 · 137****3335", status: "停用", statusClass: "muted", fields: [["准驾车型", "A2"], ["车辆", "苏E·T5568"], ["认证", "审核中"], ["证件到期", "2026-08-30"]], note: "证件续办中" },
      { id: "SJ-1004", title: "陈涛", subtitle: "杭州车队 · 136****2228", status: "空闲", statusClass: "success", fields: [["准驾车型", "A2"], ["车辆", "浙A·F2190"], ["认证", "已认证"], ["证件到期", "2028-03-15"]], note: "自有司机" },
      { id: "SJ-1005", title: "周凯", subtitle: "宁波二队 · 135****7719", status: "停用", statusClass: "muted", fields: [["准驾车型", "A2"], ["车辆", "未绑定"], ["认证", "未认证"], ["证件到期", "2029-11-08"]], note: "入职资料待复核" },
    ],
  },
  customer: {
    title: "客户管理", eyebrow: "基础资料", icon: "building-2", primary: "新增客户",
    filters: ["全部", "启用", "停用"], listFieldLimit: 6,
    items: [
      { id: "KH-1008", title: "宁波远海供应链有限公司", subtitle: "简称：宁波远海", status: "启用", statusClass: "success", businessRole: "客户", fields: [["单位角色", "客户"], ["客户类型", "第三方物流 / 供应链公司"], ["联系人", "李经理"], ["手机", "13800001008"], ["结算周期", "月结30天"]], note: "默认装货地址：宁波北仑港区二期" },
      { id: "KH-1022", title: "上海嘉航国际物流有限公司", subtitle: "简称：上海嘉航", status: "启用", statusClass: "success", businessRole: "客户", fields: [["单位角色", "客户"], ["客户类型", "国际货运代理（货代）"], ["联系人", "陈主管"], ["手机", "13900001022"], ["结算周期", "月结15天"]], note: "默认装货地址：上海洋山港" },
      { id: "KH-1035", title: "杭州联贸进出口有限公司", subtitle: "简称：杭州联贸", status: "启用", statusClass: "success", businessRole: "客户", fields: [["单位角色", "客户"], ["客户类型", "跨境电商物流商"], ["联系人", "周女士"], ["手机", "13600001035"], ["结算周期", "月结30天"]], note: "默认装货地址：杭州萧山仓" },
      { id: "KH-1120", title: "上海港联贸易有限公司", subtitle: "简称：上海港联", status: "停用", statusClass: "muted", businessRole: "客户", fields: [["单位角色", "客户"], ["客户类型", "跨境电商物流商"], ["联系人", "何经理"], ["手机", "13100001120"], ["结算周期", "月结60天"]], note: "默认装货地址：上海外高桥" },
      { id: "KH-1201", title: "宁波安达汽车维修有限公司", subtitle: "简称：宁波安达维修", status: "启用", statusClass: "success", businessRole: "客户", fields: [["单位角色", "客户"], ["客户类型", "维修厂"], ["联系人", "周师傅"], ["手机", "13800001201"], ["结算周期", "月结30天"]], note: "集卡车辆维修与保养" },
    ],
  },
  reminder: {
    title: "到期提醒", eyebrow: "车辆管理", icon: "shield-alert", primary: "消息提醒",
    filters: ["全部", "保险即将到期", "审验即将到期", "已过期"],
    items: [
      { id: "苏E·T5568", title: "车辆证件已过期", subtitle: "苏州园区集卡车队", status: "已过期", statusClass: "danger", fields: [["保险到期", "2026-09-10"], ["审验到期", "2026-08-30"], ["司机", "刘军"], ["车辆状态", "维修中"]], note: "立即补办审验或续保，暂停派车" },
      { id: "浙B·K7812", title: "保险即将到期", subtitle: "宁波港区集卡车队", status: "保险即将到期", statusClass: "warning", fields: [["保险到期", "2026-10-05"], ["剩余天数", "19 天"], ["司机", "王海"], ["车辆状态", "在用"]], note: "联系保险公司续保并上传新保单" },
    ],
  },
  plan: {
    title: "计划与任务", eyebrow: "计划与派单", icon: "clipboard-list", primary: "新建计划任务",
    filters: ["全部", "待派发", "进行中", "已完成", "异常"], listFieldLimit: 6, items: [],
  },
  capacity: {
    title: "运力管理", eyebrow: "计划与派单", icon: "gauge", primary: "查看运力",
    filters: ["全部", "自营", "三方", "闲置", "运输中", "维修中", "停用"], listFieldLimit: 6, items: [],
  },
  trailer: {
    title: "挂车档案", eyebrow: "车辆管理", icon: "container", primary: "新增挂车",
    filters: ["全部", "自营", "三方", "在用", "停用", "维修中"], listFieldLimit: 6, items: [],
  },
};

const messages = [
  { id: "M-1", type: "task", title: "自动派单存在待处理任务", desc: "WB20260916005 暂无可用车辆，请人工补派。", time: "10:08", icon: "wand-sparkles", style: "warning", module: "auto", unread: true },
  { id: "M-2", type: "warning", title: "车辆保险即将到期", desc: "浙B·K7812 的保险将在 19 天后到期。", time: "09:30", icon: "shield-alert", style: "warning", module: "reminder", unread: true },
  { id: "M-3", type: "task", title: "司机已上报运输节点", desc: "王海已完成提货，当前节点更新为在途。", time: "09:12", icon: "map-pinned", style: "success", module: "dispatch", unread: true },
  { id: "M-4", type: "warning", title: "车辆审验已过期", desc: "苏E·T5568 年检已过期，当前不可参与派车。", time: "昨天", icon: "triangle-alert", style: "warning", module: "reminder", unread: false },
  { id: "M-5", type: "task", title: "今日自动派单执行完成", desc: "接入 4 条任务，成功派单 3 条。", time: "昨天", icon: "circle-check", style: "success", module: "auto", unread: false },
];

const mobileFormDefinitions = {
  route: {
    intro: "维护客户项目、线路节点、里程、运价与关联运力，与后台固定线路资料保持一致。",
    sections: [
      { title: "线路基础信息", hint: "客户项目、起止地址与线路状态", fields: [
        { name: "routeName", label: "线路名称", required: true, full: true, placeholder: "请输入线路名称" },
        { name: "customerId", label: "客户", type: "select", required: true, options: [] },
        { name: "projectId", label: "项目", type: "select", required: true, options: [] },
        { name: "origin", label: "提箱地", required: true, placeholder: "请输入提箱地" },
        { name: "destination", label: "装卸地", required: true, placeholder: "请输入装卸地" },
        { name: "pickupPoint", label: "提箱点", required: true, placeholder: "请输入提箱点" },
        { name: "loadingPoint", label: "装货地", required: true, placeholder: "请输入装货地" },
        { name: "unloadingPoint", label: "卸货地", required: true, placeholder: "请输入卸货地" },
        { name: "dropoffPoint", label: "落箱点", required: true, placeholder: "请输入落箱点" },
        { name: "viaPoints", label: "途经点", full: true, placeholder: "多个地点用顿号分隔" },
        { name: "mileage", label: "里程（KM）", type: "number", min: "0", step: "0.1", required: true, placeholder: "请输入单程里程" },
        { name: "routeState", label: "线路状态", type: "select", required: true, options: ["启用", "停用"] },
        { name: "remark", label: "备注", full: true, type: "textarea", placeholder: "请输入线路备注" },
      ] },
      { title: "收入与提成", hint: "配置单次运输核算基准", fields: [
        { name: "estimatedRevenue", label: "单次预估收入（元）", type: "number", min: "0", step: "0.01", required: true },
        { name: "baseFreight", label: "线路基础运价（元）", type: "number", min: "0", step: "0.01", required: true },
        { name: "commissionType", label: "提成方式", type: "select", required: true, options: [["fixed", "固定金额提成"], ["rate", "按收入比例提成"]] },
        { name: "commissionValue", label: "提成规则值", type: "number", min: "0", step: "0.01", required: true },
        { name: "commissionRemark", label: "提成规则说明", full: true, placeholder: "例如：含往返空驶补贴" },
      ] },
      { title: "关联配置", hint: "派单时优先推荐，可不指定", fields: [
        { name: "defaultVehicle", label: "线路专属车辆", type: "select", options: [["", "不指定"], ["浙B·K7812", "浙B·K7812"], ["沪D·A9021", "沪D·A9021"], ["浙A·F2190", "浙A·F2190"]] },
        { name: "defaultDriver", label: "常用司机", type: "select", options: [["", "不指定"], ["王海", "王海"], ["赵亮", "赵亮"], ["陈涛", "陈涛"]] },
      ] },
    ],
  },
  vehicle: {
    intro: "建立车辆身份、参数、证照审验和保险资料，附件统一归档。",
    sections: [
      { title: "身份与归属", hint: "车辆识别与车队信息", fields: [
        { name: "plateNo", label: "车牌号码", required: true, placeholder: "例如 浙B·A1234" },
        { name: "vehicleType", label: "车辆类型", required: true, placeholder: "例如 集装箱牵引车" },
        { name: "vin", label: "车架号", required: true }, { name: "engineNo", label: "发动机号", required: true },
        { name: "driver", label: "驾驶员", required: true }, { name: "fleet", label: "所属车队" },
        { name: "fleetName", label: "车队名称" },
        { name: "capacityOwnership", label: "运力归属", type: "select", required: true, options: ["自营", "三方"] },
        { name: "supplierName", label: "三方供应商", type: "select", options: [["", "自营无需选择"], ...window.CapacityOwnership.readSuppliers().filter((item) => item.status === "启用").map((item) => [item.name, item.name])] },
        { name: "vehicleState", label: "车辆状态", type: "select", required: true, options: ["在用", "停用", "维修中"] },
      ] },
      { title: "车辆参数", hint: "载重、油耗与技术等级", fields: [
        { name: "curbWeight", label: "整备质量（吨）", type: "number", min: "0", step: "0.01" },
        { name: "fuelConsumption", label: "百公里油耗（升）", type: "number", min: "0", step: "0.01" },
        { name: "ratedLoad", label: "核定载质量（吨）", type: "number", min: "0", step: "0.01" },
        { name: "registrationCertNo", label: "车辆登记证号" }, { name: "technicalLevel", label: "车辆技术等级" },
        { name: "technicalLevelExpiry", label: "技术等级有效期", type: "date" },
      ] },
      { title: "证照与审验", hint: "行驶证、营运证和审验资料", fields: [
        { name: "drivingLicenseNo", label: "行驶证号" }, { name: "drivingLicenseExpiry", label: "行驶证有效期", type: "date" },
        { name: "permitNo", label: "营运证号", required: true }, { name: "operatingPermitExpiry", label: "营运证有效期", type: "date" },
        { name: "inspectionDue", label: "审验到期日期", type: "date", required: true },
        { name: "attachments", label: "附件资料", placeholder: "例如：行驶证、营运证、保单", full: true },
      ] },
      { title: "保险与备注", hint: "保单及到期日期", fields: [
        { name: "commercialInsuranceCompany", label: "商业险保险公司" }, { name: "commercialInsuranceNo", label: "商业险单号" }, { name: "commercialInsuranceExpiry", label: "商业险有效期", type: "date" },
        { name: "mandatoryInsuranceCompany", label: "强制险保险公司" }, { name: "mandatoryInsuranceNo", label: "强制险单号" }, { name: "mandatoryInsuranceExpiry", label: "强制险有效期", type: "date" },
        { name: "cargoInsuranceNo", label: "货物险单号" }, { name: "cargoInsuranceExpiry", label: "货物险有效期", type: "date" },
        { name: "insuranceDue", label: "保险到期日期", type: "date", required: true },
        { name: "remark", label: "备注", type: "textarea", full: true },
      ] },
    ],
  },
  driver: {
    intro: "建立司机基础资料、运力归属、驾驶证、从业资格证和结算信息。",
    sections: [
      { title: "基础信息", hint: "司机身份与车队归属", fields: [
        { name: "name", label: "姓名", required: true }, { name: "gender", label: "性别", type: "select", required: true, options: ["男", "女"] },
        { name: "idCard", label: "身份证号码", required: true, full: true, inputmode: "text" },
        { name: "phone", label: "手机号", type: "tel", required: true, pattern: "1[0-9]{10}", inputmode: "numeric" },
        { name: "address", label: "住址", required: true, full: true },
        { name: "emergencyContact", label: "紧急联系人", required: true },
        { name: "emergencyPhone", label: "紧急联系电话", type: "tel", required: true, pattern: "1[0-9]{10}", inputmode: "numeric" },
        { name: "entryDate", label: "入职日期", type: "date", required: true },
        { name: "driverState", label: "司机状态", type: "select", required: true, options: ["空闲", "运输中", "停用"] },
        { name: "capacityOwnership", label: "运力归属", type: "select", required: true, options: ["自营", "三方"] },
        { name: "supplierName", label: "三方供应商", type: "select", options: [["", "自营无需选择"], ...window.CapacityOwnership.readSuppliers().filter((item) => item.status === "启用").map((item) => [item.name, item.name])] },
        { name: "certificationStatus", label: "认证状态", type: "select", options: [["unverified", "未认证"], ["pending", "审核中"], ["verified", "已认证"], ["rejected", "已驳回"]] },
        { name: "fleet", label: "所属车队", required: true },
      ] },
      { title: "驾驶证", hint: "驾驶证信息与电子附件", fields: [
        { name: "licenseNo", label: "驾驶证号", required: true }, { name: "licenseClass", label: "准驾车型", required: true, value: "A2" },
        { name: "licenseIssueDate", label: "发证日期", type: "date", required: true },
        { name: "licenseExpiry", label: "有效期截止日期", type: "date", required: true },
        { name: "licenseAttachment", label: "驾驶证附件", type: "file", full: true },
      ] },
      { title: "道路运输从业资格证", hint: "资格证信息与附件", fields: [
        { name: "qualificationNo", label: "资格证号", required: true },
        { name: "qualificationExpiry", label: "有效期截止日期", type: "date", required: true },
        { name: "qualificationAttachment", label: "证件附件", type: "file", full: true },
      ] },
      { title: "其他信息", hint: "运费结算与补充说明", fields: [
        { name: "bankCard", label: "银行卡号", inputmode: "numeric" }, { name: "bankName", label: "开户银行" },
        { name: "remark", label: "备注", type: "textarea", full: true },
      ] },
    ],
  },
  customer: {
    intro: "客户与三方供应商统一建档，单位角色决定其可用于哪些业务。",
    sections: [
      { title: "基础信息", hint: "往来单位主体、角色和可用状态", fields: [
        { name: "customerNo", label: "单位编号", readonly: true, hint: "系统自动生成，无需填写" },
        { name: "customerName", label: "单位全称", required: true, full: true, placeholder: "营业执照上的企业全称" },
        { name: "shortName", label: "简称" },
        { name: "businessRole", label: "单位角色", type: "select", required: true, options: ["客户", "三方供应商", "客户+三方供应商"] },
        { name: "customerType", label: "客户类型", type: "select", required: true, options: [["", "请选择"], "直客", "货代", "贸易企业", "国际货运代理（货代）", "船公司 / 船代", "第三方物流 / 供应链公司", "跨境电商物流商", "维修厂"] },
        { name: "creditCode", label: "统一社会信用代码", required: true, full: true, pattern: "[0-9A-Z]{18}", maxlength: "18", hint: "18 位数字或大写字母" },
        { name: "customerStatus", label: "客户状态", type: "select", required: true, options: ["启用", "停用"] },
      ] },
      { title: "联系信息", hint: "日常运输协调联系人", fields: [
        { name: "contactName", label: "主要联系人", required: true },
        { name: "mobile", label: "手机", type: "tel", required: true, pattern: "1[0-9]{10}", maxlength: "11", inputmode: "numeric" },
        { name: "phone", label: "电话", type: "tel" }, { name: "email", label: "邮箱", type: "email" },
      ] },
      { title: "地址信息", hint: "运单选择客户后自动带出", fields: [
        { name: "registeredAddress", label: "注册地址", full: true },
        { name: "loadAddress", label: "默认装货地址", required: true, full: true },
        { name: "unloadAddress", label: "默认卸货地址", required: true, full: true },
      ] },
      { title: "结算信息", hint: "默认结算和开票资料", fields: [
        { name: "settlementCycle", label: "结算周期", type: "select", required: true, options: [["", "请选择"], "现结", "月结15天", "月结30天", "月结45天", "月结60天"] },
        { name: "invoiceTitle", label: "开票抬头", full: true }, { name: "taxNo", label: "税号" },
        { name: "bankName", label: "开户银行", full: true }, { name: "bankAccount", label: "银行账号", inputmode: "numeric" },
        { name: "remark", label: "备注", type: "textarea", full: true },
      ] },
    ],
  },
  trailer: {
    intro: "维护挂车身份、营运证、审验和保险资料，供车辆和派单关联使用。",
    sections: [{ title: "挂车档案", hint: "身份、归属与证照", fields: [
      { name: "plateNo", label: "挂车车牌", required: true }, { name: "trailerType", label: "挂车类型", required: true },
      { name: "vin", label: "车架号", required: true }, { name: "fleet", label: "所属车队" },
      { name: "capacityOwnership", label: "运力归属", type: "select", required: true, options: ["自营", "三方"] },
      { name: "supplierName", label: "三方供应商", type: "select", options: [["", "自营无需选择"], ...window.CapacityOwnership.readSuppliers().filter((item) => item.status === "启用").map((item) => [item.name, item.name])] },
      { name: "trailerState", label: "挂车状态", type: "select", required: true, options: ["在用", "停用", "维修中"] },
      { name: "registrationCertNo", label: "车辆登记证号" }, { name: "permitNo", label: "营运证号", required: true },
      { name: "operatingPermitExpiry", label: "营运证有效期", type: "date" }, { name: "inspectionDue", label: "审验到期", type: "date" },
      { name: "engineNo", label: "发动机号" },
      { name: "mandatoryInsuranceCompany", label: "强制险保险公司" }, { name: "mandatoryInsuranceNo", label: "强制险单号" }, { name: "mandatoryInsuranceExpiry", label: "强制险有效期", type: "date" },
      { name: "commercialInsuranceCompany", label: "商业险保险公司" }, { name: "commercialInsuranceNo", label: "商业险单号" }, { name: "commercialInsuranceExpiry", label: "商业险有效期", type: "date" },
      { name: "attachments", label: "附件" }, { name: "remark", label: "备注", type: "textarea", full: true },
    ] }],
  },
  plan: {
    intro: "创建计划任务后生成子运单，统一进入待派发池。",
    sections: [{ title: "计划任务", hint: "计划执行日期、子任务靠台时间和客户项目", fields: [
      { name: "planExecutionDate", label: "计划执行日期", type: "date", required: true },
      { name: "plannedBerthingTime", label: "子任务计划靠台时间", type: "datetime-local", required: true },
      { name: "customerName", label: "客户名称", required: true }, { name: "projectName", label: "项目名称", required: true },
      { name: "routeId", label: "固定线路", type: "select", required: true, options: [] },
      { name: "boxType", label: "柜型", type: "select", required: true, options: ["40HQ", "40GP", "20GP", "45HQ"] },
      { name: "quantity", label: "任务数量", type: "number", min: "1", max: "100", required: true, value: "1" },
      { name: "taskType", label: "任务类型", type: "select", required: true, options: ["提空装货", "提重送货", "排空箱（A→B）", "排重箱（A→B）"] },
      { name: "remark", label: "备注", type: "textarea", full: true },
    ] }],
  },
};

const state = { currentView: "workbench", currentModule: "", moduleFilter: "全部", messageFilter: "all", search: "", detailItem: null, entryModule: "", entryEditId: "", entryOriginalId: "", entryOriginalRaw: null, profilePage: "", feedbackTab: "submit" };
const MANAGER_PROFILE_STORAGE_KEY = "container-logistics-manager-profile-v1";
const MANAGER_NOTIFICATION_STORAGE_KEY = "container-logistics-manager-notifications-v1";
const NODE_NOTIFICATION_STORAGE_KEY = "container-logistics-transport-node-notifications-v1";
const NODE_NOTIFICATION_READ_STORAGE_KEY = "container-logistics-transport-node-notifications-read-v1";
const defaultManagerProfile = { name: "张调度", phone: "13866686688", department: "运营中心", role: "调度管理员", account: "ZD-1008", avatar: "" };
const defaultManagerNotifications = { task: true, warning: true, system: false };
const reportPlanRecords = [
  { customerId: "KH-HM", customerName: "华贸", projectId: "PR-HM-BYD", projectName: "比亚迪", routeId: "XL-001", planned: 2, completed: 0, monthAmount: 78650, totalAmount: 962400 },
  { customerId: "KH-LG", customerName: "陆港多联", projectId: "PR-LG-TH", projectName: "提箱装货", routeId: "XL-002", planned: 1, completed: 0, monthAmount: 96480, totalAmount: 1285600 },
  { customerId: "KH-ZT", customerName: "中铁联集项目", projectId: "PR-ZT-X387", projectName: "X387", routeId: "XL-003", planned: 1, completed: 1, monthAmount: 61200, totalAmount: 884700 },
  { customerId: "KH-ZT", customerName: "中铁联集项目", projectId: "PR-ZT-X8588", projectName: "X8588", routeId: "XL-004", planned: 1, completed: 0, monthAmount: 50160, totalAmount: 710000 },
];
const reportRanges = { yesterday: { label: "昨日", days: 1, endOffset: -1 }, today: { label: "今日", days: 1, endOffset: 0 }, last7: { label: "近7天", days: 7, endOffset: 0 }, month: { label: "近一月", days: 30, endOffset: 0 } };
const reportNodeSequences = {
  "提空装货": ["已提空", "空箱在途", "到达仓库", "完成装货", "重箱在途", "重箱进站", "完成落重"],
  "提重送货": ["已提重", "重箱在途", "到达仓库", "完成卸货", "空箱在途", "空箱进站", "完成落空"],
  "排空箱（A→B）": ["已提空", "空箱在途", "完成落空"],
  "排重箱（A→B）": ["已提重", "重箱在途", "箱进站", "完成落重"],
};
const reportState = { amountDimension: "customer", capacityFilter: null };
const $ = (selector) => document.querySelector(selector);
let entryPreviousFocus = null;
let profilePreviousFocus = null;
let profileEditDirty = false;
let profileDraftAvatar = "";
const $$ = (selector) => [...document.querySelectorAll(selector)];
const h = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));

function readManagerProfile() {
  try {
    const stored = JSON.parse(localStorage.getItem(MANAGER_PROFILE_STORAGE_KEY) || "null");
    if (!stored || typeof stored !== "object") return { ...defaultManagerProfile };
    return {
      ...defaultManagerProfile,
      name: typeof stored.name === "string" && stored.name.trim() ? stored.name.trim().slice(0, 20) : defaultManagerProfile.name,
      phone: /^1\d{10}$/.test(stored.phone || "") ? stored.phone : defaultManagerProfile.phone,
      avatar: typeof stored.avatar === "string" && stored.avatar.startsWith("data:image/") ? stored.avatar : "",
    };
  } catch (error) { return { ...defaultManagerProfile }; }
}

function readManagerNotifications() {
  try {
    const stored = JSON.parse(localStorage.getItem(MANAGER_NOTIFICATION_STORAGE_KEY) || "null");
    return stored && typeof stored === "object" ? { ...defaultManagerNotifications, ...stored } : { ...defaultManagerNotifications };
  } catch (error) { return { ...defaultManagerNotifications }; }
}

let managerProfile = readManagerProfile();
let managerNotifications = readManagerNotifications();

function readNodeNotifications() {
  if (!managerNotifications.task) return [];
  try {
    const records = JSON.parse(localStorage.getItem(NODE_NOTIFICATION_STORAGE_KEY) || "[]");
    const readIds = new Set(JSON.parse(localStorage.getItem(NODE_NOTIFICATION_READ_STORAGE_KEY) || "[]"));
    return (Array.isArray(records) ? records : []).filter((record) =>
      (record.channels || ["站内消息"]).includes("站内消息")
      && ((record.recipients || []).includes(managerProfile.role) || (record.recipients || []).includes(managerProfile.name)))
      .map((record) => ({ ...record, id: `node-${record.id}`, type: "task", title: record.title, desc: `${record.content || `${record.waybillNo} · ${record.taskType} / ${record.nodeName}`} · 通知：${(record.recipients || []).join("、")}`, time: record.createdAt ? new Date(record.createdAt).toLocaleString("zh-CN", { hour12: false }) : "", icon: "map-pinned", style: "success", module: "dispatch", unread: !readIds.has(record.id), nodeNotificationId: record.id }));
  } catch (_error) { return []; }
}

function allMessages() { return [...readNodeNotifications(), ...messages]; }

function localDate() {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function optionMarkup(option, selectedValue = "") {
  const [value, label] = Array.isArray(option) ? option : [option, option];
  return `<option value="${h(value)}" ${String(value) === String(selectedValue) ? "selected" : ""}>${h(label)}</option>`;
}

function fieldMarkup(field) {
  const className = `mobile-field ${field.full ? "full" : ""} ${field.required ? "required" : ""}`;
  if (field.type === "file") return `<div class="${className}"><span>${h(field.label)}</span><label class="file-picker"><input name="${h(field.name)}" type="file" accept=".jpg,.jpeg,.png,.pdf" /><i data-lucide="upload-cloud"></i><strong>点击选择附件</strong><small>支持 JPG、PNG、PDF，单个文件不超过 10 MB</small></label></div>`;
  const attributes = [
    field.required ? "required" : "", field.placeholder ? `placeholder="${h(field.placeholder)}"` : "",
    field.min != null ? `min="${h(field.min)}"` : "", field.max != null ? `max="${h(field.max)}"` : "",
    field.step ? `step="${h(field.step)}"` : "", field.pattern ? `pattern="${h(field.pattern)}"` : "",
    field.maxlength ? `maxlength="${h(field.maxlength)}"` : "", field.inputmode ? `inputmode="${h(field.inputmode)}"` : "",
    field.readonly ? "readonly" : "", field.disabled ? "disabled" : "",
  ].filter(Boolean).join(" ");
  let control;
  if (field.type === "select") control = `<select name="${h(field.name)}" ${attributes}>${(field.options || []).map((item) => optionMarkup(item, field.value)).join("")}</select>`;
  else if (field.type === "textarea") control = `<textarea name="${h(field.name)}" ${attributes}>${h(field.value || "")}</textarea>`;
  else control = `<input name="${h(field.name)}" type="${h(field.type || "text")}" value="${h(field.value || "")}" ${attributes} />`;
  return `<label class="${className}"><span>${h(field.label)}</span>${control}${field.hint ? `<small>${h(field.hint)}</small>` : ""}</label>`;
}

function sectionMarkup(section, index) {
  return `<section class="mobile-form-section"><header class="mobile-form-section-heading"><span>${String(index + 1).padStart(2, "0")}</span><div><strong>${h(section.title)}</strong><small>${h(section.hint || "")}</small></div></header><div class="mobile-form-grid">${section.fields.map(fieldMarkup).join("")}${section.title === "收入与提成" ? '<div class="commission-preview"><span>预计司机提成</span><strong id="mobileCommissionPreview">¥0.00</strong></div>' : ""}</div></section>`;
}

function formIntro(icon, text) {
  return `<div class="entry-intro"><span><i data-lucide="${h(icon)}"></i></span><div><strong>资料填写</strong><small>${h(text)}</small></div></div>`;
}

function genericEntryMarkup(moduleName) {
  const definition = mobileFormDefinitions[moduleName];
  const suppliers = [["", "自营无需选择"], ...window.CapacityOwnership.readSuppliers().filter((item) => item.status === "启用").map((item) => [item.name, item.name])];
  const sections = definition.sections.map((section) => ({ ...section, fields: section.fields.map((field) => field.name === "supplierName" ? { ...field, options: suppliers } : field) }));
  return `${formIntro(moduleCatalog[moduleName].icon, definition.intro)}${sections.map(sectionMarkup).join("")}`;
}

function routeInfo(item) {
  if (item.raw) return item.raw;
  const [origin = "", destination = ""] = item.subtitle.split("→").map((value) => value.trim());
  return {
    routeName: item.title, origin, destination,
    estimatedRevenue: (item.fields.find(([label]) => label === "预估收入") || [null, "2600"])[1].replace(/[^0-9.]/g, "") || "2600",
    commissionValue: (item.fields.find(([label]) => label === "提成金额") || [null, "350"])[1].replace(/[^0-9.]/g, "") || "350",
  };
}

function customerInfo(item) {
  if (item.raw) return item.raw;
  const defaults = {
    "宁波远海供应链有限公司": ["宁波北仑港区二期", "宁波江北物流园"],
    "上海嘉航国际物流有限公司": ["上海洋山港", "昆山综合保税区"],
    "杭州联贸进出口有限公司": ["杭州萧山仓", "宁波梅山码头"],
    "上海港联贸易有限公司": ["上海外高桥", "苏州工业园区"],
  };
  const [loadAddress = "", unloadAddress = ""] = defaults[item.title] || ["", ""];
  return { customerName: item.title, loadAddress, unloadAddress };
}

function customerHasRole(item, role) {
  const value = String(item?.raw?.businessRole || item?.businessRole || "客户");
  return value.split("+").includes(role);
}

function nextBusinessId(prefix, count) {
  return `${prefix}${localDate().replaceAll("-", "")}${String(count + 1).padStart(3, "0")}`;
}

function sharedStatusClass(status) {
  return ["已完成", "启用", "在用", "空闲", "已确认"].includes(status) ? "success" : ["已过期", "停用", "作废"].includes(status) ? "danger" : ["待派单", "待派发", "维修中", "待处理", "草稿"].includes(status) ? "warning" : "";
}

function certificationStatusLabel(status) {
  return ({ verified: "已认证", pending: "审核中", unverified: "未认证", rejected: "已驳回" })[status] || status || "未认证";
}

function loadSharedCatalog() {
  const snapshot = window.AdminDataBridge?.read?.();
  if (!snapshot) return;
  const routes = Array.isArray(snapshot.fixedRoutes) ? snapshot.fixedRoutes : [];
  const waybills = Array.isArray(snapshot.waybills) ? snapshot.waybills : [];
  const dispatches = Array.isArray(snapshot.dispatches) ? snapshot.dispatches : [];
  const vehicles = Array.isArray(snapshot.vehicles) ? snapshot.vehicles : [];
  const trailers = Array.isArray(snapshot.trailers) ? snapshot.trailers : [];
  const drivers = Array.isArray(snapshot.drivers) ? snapshot.drivers : [];
  const customers = Array.isArray(snapshot.customers) && snapshot.customers.length ? snapshot.customers : (window.AdminDataBridge.readCustomers?.() || []);
  if (routes.length) moduleCatalog.route.items = routes.map((route) => ({
    id: route.id, title: route.routeName, subtitle: `${route.routeCode || route.id} · ${route.origin || ""} → ${route.destination || ""}`,
    status: route.routeState || "启用", statusClass: sharedStatusClass(route.routeState),
    fields: [["线路编号", route.routeCode || route.id], ["客户 / 项目", `${route.customerName || route.customerId || "-"} / ${route.projectName || route.projectId || "-"}`], ["提箱地 → 装卸地", `${route.origin || "-"} → ${route.destination || "-"}`], ["里程", route.mileage === "" || route.mileage == null ? "待维护" : `${route.mileage} KM`], ["预估收入", `¥${route.estimatedRevenue || 0}`], ["提成方式", route.commissionType === "rate" ? "按收入比例提成" : "固定金额提成"]], note: route.remark || "", raw: route,
  }));
  if (waybills.length) moduleCatalog.waybill.items = waybills.map((waybill) => {
    const route = routes.find((item) => item.id === waybill.routeId);
    const containers = Array.isArray(waybill.containers) ? waybill.containers : [];
    const boxLabel = containers.map((item) => item.containerType || item.boxType).filter(Boolean).join("、") || waybill.boxType || "待装箱";
    return { id: waybill.waybillNo, title: waybill.customerName || "未指定客户", subtitle: route?.routeName || waybill.routeName || "未指定线路", status: waybill.status === "草稿" ? "草拟" : waybill.status || "草拟", statusClass: sharedStatusClass(waybill.status), fields: [["接单日期", waybill.orderDate || "-"], ["计划任务", waybill.planTaskNo || waybill.planTaskId || "-"], ["箱型", boxLabel], ["装卸地址", waybill.loadAddress || "-"], ["应收金额", `¥${waybill.receivable || 0}`], ["应付金额", `¥${waybill.payable || 0}`]], note: waybill.remark || "", raw: waybill };
  });
  if (dispatches.length) moduleCatalog.dispatch.items = dispatches.map((dispatch) => ({
    id: dispatch.id, title: dispatch.routeName || "未指定线路", subtitle: dispatch.waybillNo || "-", status: dispatch.status || "待派单", statusClass: sharedStatusClass(dispatch.status), fields: [["计划靠台时间", dispatch.plannedBerthingTime || dispatch.executionTime || "-"], ["运力归属", dispatch.capacityOwnershipSnapshot || "待确定"], ["司机", dispatch.driverName || "待分配"], ["司机所属单位", dispatch.driverOrganizationSnapshot || "待确定"], ["车辆", dispatch.vehicleId || "待分配"], ["车辆所属单位", dispatch.vehicleOrganizationSnapshot || "待确定"], ["挂车", dispatch.trailerId || "未绑定"], ["挂车所属单位", dispatch.trailerOrganizationSnapshot || "未绑定"], ["当前节点", dispatch.currentNode || "待派单"], ["派单方式", dispatch.dispatchMode === "auto" ? "自动派单" : dispatch.dispatchMode === "manual" ? "手动派单" : "待分配"], ["派单时间", dispatch.dispatchTime || "-"]], note: dispatch.note || "", raw: dispatch }));
  vehicles.forEach((item) => window.CapacityOwnership.normalizeResource(item, "vehicle"));
  trailers.forEach((item) => window.CapacityOwnership.normalizeResource(item, "trailer"));
  drivers.forEach((item) => window.CapacityOwnership.normalizeResource(item, "driver"));
  if (vehicles.length) moduleCatalog.vehicle.items = vehicles.map((vehicle) => ({ id: vehicle.plateNo, title: vehicle.vehicleType || "集装箱牵引车", subtitle: vehicle.fleetName || vehicle.fleet || "未设置车队", status: vehicle.vehicleState || "停用", statusClass: sharedStatusClass(vehicle.vehicleState), fields: [["运力归属", vehicle.capacityOwnership], ["所属单位", window.CapacityOwnership.organizationName(vehicle)], ["司机", vehicle.driver || "未绑定"], ["挂车", vehicle.trailerId || "未绑定"], ["VIN", vehicle.vin || "-"], ["营运证号", vehicle.permitNo || "-"]], note: vehicle.remark || "", raw: vehicle }));
  if (trailers.length) moduleCatalog.trailer.items = trailers.map((trailer) => ({ id: trailer.id, title: trailer.plateNo, subtitle: trailer.trailerType || "挂车", status: trailer.trailerState || "停用", statusClass: sharedStatusClass(trailer.trailerState), fields: [["运力归属", trailer.capacityOwnership], ["所属单位", window.CapacityOwnership.organizationName(trailer)], ["车架号", trailer.vin || "-"], ["所属车队", trailer.fleet || "-"], ["营运证号", trailer.permitNo || "-"], ["审验到期", trailer.inspectionDue || "-"]], note: trailer.remark || "", raw: trailer }));
  if (drivers.length) moduleCatalog.driver.items = drivers.map((driver) => ({ id: driver.id, title: driver.name, subtitle: `${driver.fleet || "未设置车队"} · ${driver.phone || "-"}`, status: driver.driverState || "停用", statusClass: sharedStatusClass(driver.driverState), fields: [["运力归属", driver.capacityOwnership], ["所属单位", window.CapacityOwnership.organizationName(driver)], ["司机编号", driver.id], ["准驾车型", driver.licenseClass || "A2"], ["车辆", driver.vehiclePlate || driver.vehicle || "未绑定"], ["认证状态", certificationStatusLabel(driver.certificationStatus)]], note: driver.remark || "", raw: driver }));
  if (customers.length) moduleCatalog.customer.items = customers.map((customer) => ({ id: customer.customerNo, title: customer.customerName, subtitle: `简称：${customer.shortName || "-"}`, status: customer.customerStatus || "启用", statusClass: sharedStatusClass(customer.customerStatus), fields: [["单位编号", customer.customerNo], ["单位角色", customer.businessRole || "客户"], ["客户类型", customer.customerType || "-"], ["联系人", customer.contactName || "-"], ["手机", customer.mobile || "-"], ["结算周期", customer.settlementCycle || "-"]], note: customer.remark || "", raw: customer }));
  const groups = new Map();
  waybills.forEach((waybill) => { const id = waybill.planTaskId || `PT-LEGACY-${waybill.waybillNo}`; const group = groups.get(id) || { id, no: waybill.planTaskNo || id, first: waybill, rows: [] }; group.rows.push(waybill); groups.set(id, group); });
  moduleCatalog.plan.items = [...groups.values()].map((group) => {
    const linkedDispatches = group.rows.flatMap((row) => dispatches.filter((dispatch) => dispatch.waybillNo === row.waybillNo));
    const done = linkedDispatches.filter((dispatch) => dispatch.status === "已完成").length;
    const active = linkedDispatches.filter((dispatch) => ["已派单", "运输中"].includes(dispatch.status)).length;
    const pending = Math.max(0, group.rows.length - done - active);
    const status = linkedDispatches.some((dispatch) => ["异常", "取消"].includes(dispatch.status)) ? "异常" : done === group.rows.length ? "已完成" : active ? "进行中" : "待派发";
    const routeIds = [...new Set(group.rows.map((row) => row.routeId).filter(Boolean))];
    const routeNames = routeIds.map((id) => routes.find((route) => route.id === id)?.routeName || id).join("、") || "-";
    return {
      id: group.id, title: group.no,
      subtitle: `${group.first.customerName || "-"} · ${group.first.projectName || "未分配项目"}`,
      status, statusClass: sharedStatusClass(status),
      fields: [["客户 / 项目", `${group.first.customerName || "-"} / ${group.first.projectName || "未分配项目"}`], ["线路", routeNames], ["任务类型", group.first.taskType || "提空装货"], ["计划执行日期", group.first.planExecutionDate || String(group.first.executionTime || group.first.orderDate || "-").slice(0, 10)], ["子任务执行情况", `待派单 ${pending} · 进行中 ${active} · 已完成 ${done}`]],
      note: `${group.rows.length} 条子任务`, raw: { ...group, linkedDispatches, routeIds },
    };
  });
  ensurePendingDispatchSamples();
  rebuildDispatchManagementCatalog();
  rebuildCapacityCatalog(dispatches);
}

function dispatchModeLabel(mode) {
  return ({ auto: "自动派单", manual: "手动派单", pending: "待分配" })[mode] || (mode ? String(mode) : "待分配");
}

function dispatchRawForItem(item) {
  if (item?.raw) return item.raw;
  const field = (label) => item?.fields?.find(([name]) => name === label)?.[1] || "";
  return {
    id: item?.id || "", waybillNo: item?.subtitle || "", routeName: item?.title || "", status: item?.status || "待派单",
    driverName: field("司机"), vehicleId: field("车辆"), trailerId: field("挂车"), currentNode: field("当前节点"),
    dispatchMode: field("派单方式") === "自动派单" ? "auto" : field("派单方式") === "手动派单" ? "manual" : "pending",
    dispatchTime: field("派单时间"), note: item?.note || "",
  };
}

const pendingDispatchSamples = [
  { id: "PD-M-2101", waybillNo: "WBM20261012001", planTaskNo: "JH20261012001", customerName: "宁波海盛集装箱服务有限公司", projectName: "穿山港短驳", taskType: "提空装货", routeId: "XL-001", orderDate: "2026-10-12", executionTime: "2026-10-12 13:30", boxType: "40HQ", boxes: "40HQ / 待补箱号", note: "13:30 前完成车辆确认" },
  { id: "PD-M-2102", waybillNo: "WBM20261012002", planTaskNo: "JH20261012002", customerName: "上海嘉航国际物流有限公司", projectName: "出口双拖", taskType: "提重送货", routeId: "XL-002", orderDate: "2026-10-12", executionTime: "2026-10-12 14:20", boxType: "20GP", boxes: "20GP × 2 / 待补箱号", note: "双拖任务，优先匹配临港车队" },
  { id: "PD-M-2103", waybillNo: "WBM20261012003", planTaskNo: "JH20261012003", customerName: "杭州联贸进出口有限公司", projectName: "梅山港出口", taskType: "排重箱（A→B）", routeId: "XL-003", orderDate: "2026-10-12", executionTime: "2026-10-12 15:10", boxType: "40GP", boxes: "40GP / 待补箱号", note: "夜间进港，需确认司机证件" },
  { id: "PD-M-2104", waybillNo: "WBM20261012004", planTaskNo: "JH20261012004", customerName: "苏州新程电子科技有限公司", projectName: "园区调拨", taskType: "排空箱（A→B）", routeId: "XL-004", orderDate: "2026-10-12", executionTime: "2026-10-12 16:00", boxType: "20GP", boxes: "20GP / 待补箱号", note: "客户要求到场前电话确认" },
];

function ensurePendingDispatchSamples() {
  pendingDispatchSamples.forEach((sample) => {
    if (moduleCatalog.dispatch.items.some((item) => item.id === sample.id)) return;
    const route = moduleCatalog.route.items.find((item) => item.id === sample.routeId);
    const routeRaw = route?.raw || {};
    const waybillRaw = {
      waybillNo: sample.waybillNo, planTaskId: sample.planTaskNo, planTaskNo: sample.planTaskNo, orderDate: sample.orderDate,
      executionTime: sample.plannedBerthingTime || sample.executionTime, planExecutionDate: sample.planExecutionDate || sample.orderDate, plannedBerthingTime: sample.plannedBerthingTime || sample.executionTime, customerName: sample.customerName, projectName: sample.projectName, taskType: sample.taskType,
      routeId: sample.routeId, routeName: route?.title || "待确认线路", boxType: sample.boxType, loadAddress: [routeRaw.loadingPoint || routeRaw.origin, routeRaw.unloadingPoint || routeRaw.destination].filter(Boolean).join(" / "), remark: sample.note,
    };
    moduleCatalog.waybill.items.push({ id: sample.waybillNo, title: sample.customerName, subtitle: route?.title || "待确认线路", status: "已审核", statusClass: "success", fields: [["接单日期", sample.orderDate], ["计划任务", sample.planTaskNo], ["箱型", sample.boxType], ["任务类型", sample.taskType], ["装卸地址", waybillRaw.loadAddress || "待维护"]], note: sample.note, raw: waybillRaw });
    const dispatchRaw = {
      ...sample, routeName: route?.title || "待确认线路", origin: routeRaw.origin || "", destination: routeRaw.destination || "", loadAddress: waybillRaw.loadAddress,
      dispatchMode: "pending", dispatchTime: "", driverId: "", driverName: "待分配", phone: "-", vehicleId: "", vehicleType: "燃油车", trailerId: "",
      status: "待派单", currentNode: "待派单", estimatedRevenue: Number(routeRaw.estimatedRevenue || 0), commission: 0, pushed: false, timeline: [],
    };
    moduleCatalog.dispatch.items.push({ id: sample.id, title: dispatchRaw.routeName, subtitle: sample.waybillNo, status: "待派单", statusClass: "warning", fields: [["司机", "待分配"], ["车辆", "待分配"], ["挂车", "未绑定"], ["当前节点", "待派单"], ["派单方式", "待分配"], ["派单时间", "-"]], note: sample.note, raw: dispatchRaw });
  });

  moduleCatalog.dispatch.items.filter((item) => item.status === "待派单").forEach((item, index) => {
    const dispatch = dispatchRawForItem(item);
    if (!dispatch.waybillNo || moduleCatalog.waybill.items.some((entry) => entry.id === dispatch.waybillNo)) return;
    const route = moduleCatalog.route.items.find((entry) => entry.id === dispatch.routeId) || moduleCatalog.route.items.find((entry) => entry.title === dispatch.routeName);
    const raw = { waybillNo: dispatch.waybillNo, planTaskNo: dispatch.planTaskNo || `JH-PENDING-${String(index + 1).padStart(3, "0")}`, orderDate: dispatch.orderDate || localDate(), planExecutionDate: dispatch.planExecutionDate || dispatch.orderDate || localDate(), plannedBerthingTime: dispatch.plannedBerthingTime || dispatch.executionTime || dispatch.orderDate || localDate(), executionTime: dispatch.plannedBerthingTime || dispatch.executionTime || dispatch.orderDate || localDate(), customerName: dispatch.customerName || "待补充客户", projectName: dispatch.projectName || "待分配项目", taskType: dispatch.taskType || "提空装货", routeId: dispatch.routeId || route?.id || "", boxType: dispatch.boxType || dispatch.boxes || "待补录", loadAddress: dispatch.loadAddress || "", remark: dispatch.note || "" };
    moduleCatalog.waybill.items.push({ id: raw.waybillNo, title: raw.customerName, subtitle: route?.title || dispatch.routeName || "待确认线路", status: "已审核", statusClass: "success", fields: [["接单日期", raw.orderDate], ["计划任务", raw.planTaskNo], ["箱型", raw.boxType], ["任务类型", raw.taskType], ["装卸地址", raw.loadAddress || "待维护"]], note: raw.remark, raw });
  });
}

function rebuildDispatchManagementCatalog() {
  moduleCatalog["dispatch-management"].items = moduleCatalog.dispatch.items
    .filter((item) => item.status === "待派单" || item.status === "异常")
    .map((item) => {
      const dispatch = dispatchRawForItem(item);
      const waybill = moduleCatalog.waybill.items.find((entry) => entry.id === (dispatch.waybillNo || item.subtitle));
      const task = waybill?.raw || {};
      const matched = Boolean(dispatch.driverId && dispatch.vehicleId);
      const status = item.status === "异常" ? "异常" : matched ? "已匹配" : "待匹配";
      return {
        id: item.id, title: task.customerName || waybill?.title || dispatch.routeName || "待匹配任务",
        subtitle: `${dispatch.waybillNo || item.subtitle || "-"} · ${task.projectName || "未分配项目"}`,
        status, statusClass: status === "已匹配" ? "success" : status === "异常" ? "danger" : "warning",
        fields: [
          ["计划任务", task.planTaskNo || task.planTaskId || dispatch.planTaskNo || "-"], ["任务类型", task.taskType || dispatch.taskType || "-"],
          ["计划靠台时间", String(task.plannedBerthingTime || dispatch.plannedBerthingTime || task.executionTime || task.orderDate || dispatch.orderDate || "-").replace("T", " ").slice(0, 16)], ["固定线路", dispatch.routeName || waybill?.subtitle || "-"],
          ["柜型 / 箱信息", dispatch.boxes || task.boxType || "待补录"], ["已选运力", matched ? `${dispatch.driverName || dispatch.driverId} / ${dispatch.vehicleId}` : "待分配"],
        ],
        note: dispatch.note || task.remark || "等待匹配司机和车辆", raw: { dispatch, waybill: task },
      };
    });
}

function rebuildCapacityCatalog(dispatches = []) {
  const vehicles = moduleCatalog.vehicle.items;
  const drivers = moduleCatalog.driver.items;
  moduleCatalog.capacity.items = [
    ...vehicles.map((item) => {
      const vehicle = item.raw || { plateNo: item.id, vehicleType: item.title, fleetName: item.subtitle, vehicleState: item.status };
      const active = dispatches.find((dispatch) => dispatch.vehicleId === vehicle.plateNo && ["已派单", "运输中"].includes(dispatch.status));
      const status = vehicle.vehicleState === "维修中" ? "维修中" : vehicle.vehicleState === "停用" ? "停用" : active ? "运输中" : "闲置";
      const driver = moduleCatalog.driver.items.find((entry) => entry.id === active?.driverId)?.raw;
      const trailer = moduleCatalog.trailer.items.find((entry) => entry.id === vehicle.trailerId)?.raw;
      const ownership = window.CapacityOwnership.groupSnapshot([driver && { ...driver, role: "司机", name: driver.name }, { ...vehicle, role: "车辆", name: vehicle.plateNo }, trailer && { ...trailer, role: "挂车", name: trailer.plateNo }], { missingRequired: !driver || Boolean(vehicle.trailerId && !trailer) });
      return { id: `vehicle-${vehicle.plateNo}`, title: vehicle.plateNo, subtitle: vehicle.vehicleType || "车辆", status, statusClass: sharedStatusClass(status), fields: [["运力归属", ownership.type], ["运力类型", "车辆"], ["司机", active?.driverName || vehicle.driver || "未绑定"], ["挂车", vehicle.trailerId || "未绑定"], ["当前任务", active?.waybillNo || "无"], ["所属单位", window.CapacityOwnership.organizationName(vehicle)]], note: active?.routeName || ownership.tooltip || "当前无执行任务", raw: { ...vehicle, capacityOwnershipSnapshot: ownership.type } };
    }),
    ...drivers.map((item) => {
      const driver = item.raw || { id: item.id, name: item.title, driverState: item.status, fleet: item.subtitle };
      const active = dispatches.find((dispatch) => dispatch.driverId === driver.id && ["已派单", "运输中"].includes(dispatch.status));
      const status = active ? "运输中" : driver.driverState === "运输中" ? "运输中" : driver.driverState === "停用" ? "停用" : "闲置";
      return { id: `driver-${driver.id}`, title: driver.name, subtitle: "司机运力", status, statusClass: sharedStatusClass(status), fields: [["运力归属", driver.capacityOwnership], ["运力类型", "司机"], ["司机编号", driver.id], ["车辆", active?.vehicleId || driver.vehiclePlate || driver.vehicle || "未绑定"], ["当前任务", active?.waybillNo || "无"], ["所属单位", window.CapacityOwnership.organizationName(driver)]], note: active?.routeName || "司机运力状态", raw: driver };
    }),
  ];
}

function containerCardMarkup() {
  return `<div class="repeat-card" data-repeat-card="container"><div class="mobile-form-grid">
    ${fieldMarkup({ name: "containerNo", label: "箱号", required: true, placeholder: "请输入箱号" })}
    ${fieldMarkup({ name: "sealNo", label: "封号", required: true, placeholder: "请输入封号" })}
    ${fieldMarkup({ name: "containerType", label: "箱型", type: "select", options: ["40HQ", "40GP", "20GP", "20HQ"] })}
    ${fieldMarkup({ name: "pickupPoint", label: "提箱点", required: true })}
    ${fieldMarkup({ name: "returnPoint", label: "还箱点", required: true, full: true })}
  </div><button class="repeat-card-remove" data-remove-repeat type="button">删除此箱</button></div>`;
}

function feeCardMarkup(type) {
  const settlementLabel = type === "receivable" ? "已收金额" : "已付金额";
  const targetOptions = type === "receivable" ? ["客户", "其他"] : ["司机", "承运商", "其他"];
  return `<div class="repeat-card" data-repeat-card="fee" data-fee-type="${type}"><div class="mobile-form-grid">
    ${fieldMarkup({ name: `${type}Target`, label: "结算对象", type: "select", options: targetOptions })}
    ${fieldMarkup({ name: `${type}Unit`, label: "单位名称", required: true })}
    ${fieldMarkup({ name: `${type}Kind`, label: "费用类型", required: true, placeholder: "例如 运费" })}
    ${fieldMarkup({ name: `${type}Quantity`, label: "数量", type: "number", min: "0", step: "1", required: true, value: "1" })}
    ${fieldMarkup({ name: `${type}Price`, label: "单价", type: "number", min: "0", step: "0.01", required: true })}
    ${fieldMarkup({ name: `${type}Settled`, label: settlementLabel, type: "number", min: "0", step: "0.01", value: "0" })}
    ${fieldMarkup({ name: `${type}Invoice`, label: "需开票", type: "select", options: ["否", "是"] })}
    <div class="commission-preview"><span>金额 / 未结</span><strong data-fee-total>¥0.00 / ¥0.00</strong></div>
  </div><button class="repeat-card-remove" data-remove-repeat type="button">删除此费用</button></div>`;
}

function waybillEntryMarkup() {
  const waybillNo = nextBusinessId("WB", moduleCatalog.waybill.items.length);
  const routeOptions = [["", "请选择固定线路"], ...moduleCatalog.route.items.filter((item) => item.status === "启用").map((item) => [item.id, item.title])];
  const customerOptions = [["", "请选择客户"], ...moduleCatalog.customer.items.filter((item) => item.status === "启用" && customerHasRole(item, "客户")).map((item) => [item.id, item.title])];
  return `${formIntro("file-plus-2", "运单号与接单日期自动生成，客户和线路可联动带出业务信息。")}
    <section class="mobile-form-section"><header class="mobile-form-section-heading"><span>01</span><div><strong>业务信息</strong><small>客户委托、箱货资料和回单要求</small></div></header>
      <div class="generated-strip"><div><span>运单号</span><strong id="mobileGeneratedWaybillNo">${waybillNo}</strong></div><div><span>接单日期</span><strong>${localDate()}</strong></div></div>
      <input name="waybillNo" type="hidden" value="${waybillNo}" /><input name="orderDate" type="hidden" value="${localDate()}" />
      <div class="mobile-form-grid">
        ${fieldMarkup({ name: "routeId", label: "固定线路", type: "select", required: true, options: routeOptions })}
        ${fieldMarkup({ name: "customerId", label: "客户名称", type: "select", required: true, options: customerOptions })}
        ${fieldMarkup({ name: "billNo", label: "提单号" })}${fieldMarkup({ name: "receiptDate", label: "回单日期", type: "date" })}
        ${fieldMarkup({ name: "loadAddress", label: "装卸地址", required: true, full: true, placeholder: "选择客户后自动带出" })}
        <div class="mobile-switches"><label><input name="needReceipt" type="checkbox" />需要回单</label><label><input name="receivedReceipt" type="checkbox" />收到回单</label></div>
        ${fieldMarkup({ name: "remark", label: "备注", type: "textarea", full: true })}
      </div>
    </section>
    <section class="mobile-form-section"><div class="repeat-heading"><div><strong>箱信息</strong><small>默认 1 个，可继续新增</small></div><button data-add-repeat="container" type="button">新增箱信息</button></div><div class="repeat-list" id="mobileContainerList">${containerCardMarkup()}</div></section>
    <section class="mobile-form-section"><div class="repeat-heading"><div><strong>应收费用</strong><small>向客户结算的收入项目</small></div><button data-add-repeat="receivable" type="button">添加费用</button></div><div class="repeat-list" id="mobileReceivableList">${feeCardMarkup("receivable")}</div></section>
    <section class="mobile-form-section"><div class="repeat-heading"><div><strong>应付费用</strong><small>向司机或承运商结算的成本</small></div><button data-add-repeat="payable" type="button">添加费用</button></div><div class="repeat-list" id="mobilePayableList">${feeCardMarkup("payable")}</div></section>`;
}

function dispatchEntryMarkup() {
  const waybillOptions = [["", "请选择已有运单"], ...moduleCatalog.waybill.items.map((item) => [item.id, `${item.id} · ${item.title}`])];
  const routeOptions = [["", "请选择固定线路"], ...moduleCatalog.route.items.filter((item) => item.status === "启用").map((item) => [item.id, item.title])];
  const projects = [...new Map((window.AdminDataBridge?.read?.()?.routeAccounts || []).map((item) => [item.projectId, item])).values()];
  const projectOptions = [["", "请选择项目"], ...projects.map((item) => [item.projectId, item.projectName || item.projectId])];
  const trailerOptions = [["", "未绑定挂车"], ...moduleCatalog.trailer.items.filter((item) => item.status === "在用").map((item) => [item.id, `${item.title} · ${item.subtitle}`])];
  return `${formIntro("send", "先选择已有运单，再维护箱封号、运力及到达信息；保存后同步司机移动端。")}
    <section class="mobile-form-section"><header class="mobile-form-section-heading"><span>01</span><div><strong>选择任务</strong><small>运单、项目和固定线路</small></div></header><div class="mobile-form-grid">${fieldMarkup({ name: "waybillId", label: "运单号", type: "select", required: true, full: true, options: waybillOptions })}${fieldMarkup({ name: "projectId", label: "项目", type: "select", options: projectOptions })}${fieldMarkup({ name: "routeId", label: "固定线路", type: "select", required: true, options: routeOptions })}</div>
      <div class="readonly-summary" id="mobileDispatchSummary"><div><span>固定线路</span><strong data-summary="route"></strong></div><div><span>提箱地</span><strong data-summary="origin"></strong></div><div><span>装卸地</span><strong data-summary="destination"></strong></div><div><span>还箱地</span><strong data-summary="address"></strong></div><div><span>箱信息</span><strong data-summary="boxes"></strong></div><div><span>预估收入</span><strong data-summary="revenue"></strong></div><div><span>司机提成</span><strong data-summary="commission"></strong></div></div>
      <section class="mobile-form-section" id="mobileDispatchJobLocations"><header class="mobile-form-section-heading"><span>作业</span><div><strong>作业地点</strong><small>按任务类型配置的顺序维护每个作业地址</small></div></header><div class="mobile-form-grid" data-job-location-fields></div></section>
    </section>
    <section class="mobile-form-section"><header class="mobile-form-section-heading"><span>02</span><div><strong>箱信息</strong><small>每个集装箱对应填写自己的铅封号</small></div></header><div class="mobile-form-grid mobile-dispatch-box-grid">
      ${fieldMarkup({ name: "boxType", label: "箱型", type: "select", required: true, options: ["40HQ", "40GP", "20GP", "45HQ"] })}
      <fieldset class="mobile-container-group"><legend>集装箱 1</legend><div class="mobile-container-fields">
        ${fieldMarkup({ name: "boxNo1", label: "箱号", placeholder: "请输入集装箱号" })}
        ${fieldMarkup({ name: "sealNo1", label: "对应铅封号", placeholder: "请输入该箱铅封号" })}
      </div></fieldset>
      <fieldset class="mobile-container-group"><legend>集装箱 2</legend><div class="mobile-container-fields">
        ${fieldMarkup({ name: "boxNo2", label: "箱号", placeholder: "无第二个箱时留空" })}
        ${fieldMarkup({ name: "sealNo2", label: "对应铅封号", placeholder: "请输入该箱铅封号" })}
      </div></fieldset>
    </div></section>
    <section class="mobile-form-section"><header class="mobile-form-section-heading"><span>03</span><div><strong>调度安排</strong><small>选择司机、车辆和挂车</small></div></header><div class="mobile-form-grid">
      ${fieldMarkup({ name: "driverId", label: "司机", type: "select", required: true, disabled: true, options: [["", "请选择司机"], ...window.CapacityOwnership.sortSelfFirst(moduleCatalog.driver.items.filter((item) => item.status !== "停用"), (item) => item.raw?.capacityOwnership).map((item) => [item.id, `【${item.raw?.capacityOwnership || "待确定"}】${item.title}${item.raw?.capacityOwnership === "三方" ? ` / ${window.CapacityOwnership.organizationName(item.raw)}` : ""}`])] })}
      ${fieldMarkup({ name: "vehicleId", label: "车辆", type: "select", required: true, disabled: true, options: [["", "请选择车辆"], ...window.CapacityOwnership.sortSelfFirst(moduleCatalog.vehicle.items.filter((item) => item.status === "在用"), (item) => item.raw?.capacityOwnership).map((item) => [item.id, `【${item.raw?.capacityOwnership || "待确定"}】${item.id}${item.raw?.capacityOwnership === "三方" ? ` / ${window.CapacityOwnership.organizationName(item.raw)}` : ""}`])] })}
      ${fieldMarkup({ name: "trailerId", label: "挂车", type: "select", options: trailerOptions })}
      ${fieldMarkup({ name: "vehicleType", label: "车辆动力类型", type: "select", options: ["燃油车", "LNG", "新能源车"] })}
      ${fieldMarkup({ name: "consignee", label: "收货人" })}
      ${fieldMarkup({ name: "arrivalTime", label: "到达时间", type: "datetime-local" })}
      ${fieldMarkup({ name: "arrivalLocation", label: "到达地点" })}
      ${fieldMarkup({ name: "note", label: "备注", full: true, type: "textarea" })}
    </div></section>`;
}

function autoEntryMarkup() {
  return `${formIntro("wand-sparkles", "设置自动执行方式和匹配规则，配置保存后立即生效。")}
    <div class="auto-setting-banner"><span><i data-lucide="refresh-cw"></i></span><div><strong>自动执行已开启</strong><small>新任务进入后自动匹配并派单</small></div></div>
    <section class="mobile-form-section"><header class="mobile-form-section-heading"><span>01</span><div><strong>执行设置</strong><small>控制触发方式与异常重试</small></div></header><div class="mobile-form-grid">
      <label class="toggle-field"><span>启用自动执行</span><input name="enabled" type="checkbox" checked /></label>
      ${fieldMarkup({ name: "triggerMode", label: "执行方式", type: "select", full: true, options: [["realtime", "新任务立即执行"], ["interval", "定时批量执行"]] })}
      ${fieldMarkup({ name: "intervalMinutes", label: "执行间隔", type: "select", full: true, options: [["5", "每 5 分钟"], ["10", "每 10 分钟"], ["30", "每 30 分钟"], ["60", "每 60 分钟"]] })}
      <label class="toggle-field"><span>异常自动重试</span><input name="retry" type="checkbox" checked /></label>
    </div></section>
    <section class="mobile-form-section"><header class="mobile-form-section-heading"><span>02</span><div><strong>匹配规则</strong><small>线路优先、闲置优先、负载均衡</small></div></header><div class="mobile-form-grid">
      ${fieldMarkup({ name: "maxTrips", label: "司机单日任务上限", type: "select", options: [["1", "1 趟 / 天"], ["2", "2 趟 / 天"], ["3", "3 趟 / 天"]] })}
      ${fieldMarkup({ name: "warningDays", label: "临期提示阈值", type: "select", value: "30", options: [["7", "提前 7 天"], ["30", "提前 30 天"], ["60", "提前 60 天"]] })}
    </div></section>`;
}

function refreshIcons() { window.lucide?.createIcons(); }

function showToast(message) {
  const toast = $("#managerToast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2500);
}

function maskManagerPhone(phone) {
  return /^1\d{10}$/.test(phone || "") ? `${phone.slice(0, 3)}****${phone.slice(-4)}` : "未绑定";
}

function setManagerAvatar(node, profile = managerProfile) {
  if (!node) return;
  node.textContent = profile.avatar ? "" : (profile.name.trim().slice(0, 1) || "管");
  node.style.backgroundImage = profile.avatar ? `url(${JSON.stringify(profile.avatar)})` : "";
}

function notificationSummary() {
  const enabled = Object.values(managerNotifications).filter(Boolean).length;
  if (managerNotifications.task && managerNotifications.warning) return "任务与预警已开启";
  return enabled ? `已开启 ${enabled} 项` : "通知已关闭";
}

function renderManagerProfile() {
  $("#managerProfileName").textContent = managerProfile.name;
  $("#managerProfileIdentity").textContent = `${managerProfile.department} · ${managerProfile.role}`;
  $("#managerProfileAccount").textContent = `账号 ${managerProfile.account}`;
  $("#managerRoleSummary").textContent = managerProfile.role;
  $("#managerNotificationSummary").textContent = notificationSummary();
  $("#managerSecuritySummary").textContent = `${maskManagerPhone(managerProfile.phone)} · 状态正常`;
  setManagerAvatar($("#managerProfileAvatar"));
}

function profileEditorMarkup() {
  return `<form class="profile-editor" id="managerProfileForm" novalidate>
    <div class="profile-editor-body">
      <section class="profile-avatar-editor">
        <div class="profile-avatar-preview" id="profileAvatarPreview" aria-hidden="true"></div>
        <div><strong>个人头像</strong><small>用于管理端个人身份识别</small><label class="profile-avatar-upload"><input id="profileAvatarInput" type="file" accept="image/png,image/jpeg,image/webp" /><i data-lucide="camera"></i>更换头像</label></div>
      </section>
      <section class="profile-form-card">
        <label class="profile-form-row"><span>姓名</span><input name="name" value="${h(managerProfile.name)}" maxlength="20" autocomplete="name" required /></label>
        <label class="profile-form-row"><span>手机号</span><input name="phone" value="${h(managerProfile.phone)}" inputmode="numeric" maxlength="11" autocomplete="tel" required /></label>
        <label class="profile-form-row"><span>账号编号</span><input value="${h(managerProfile.account)}" readonly aria-readonly="true" /></label>
        <label class="profile-form-row"><span>所属部门</span><input value="${h(managerProfile.department)}" readonly aria-readonly="true" /></label>
        <label class="profile-form-row"><span>当前角色</span><input value="${h(managerProfile.role)}" readonly aria-readonly="true" /></label>
      </section>
      <p class="profile-form-note"><i data-lucide="info"></i><span>部门和角色由系统管理员维护；更换手机号时需填写完整的 11 位号码。</span></p>
    </div>
    <footer class="profile-editor-actions"><button class="profile-editor-cancel" data-profile-cancel type="button">取消</button><button class="profile-editor-save" id="profileSaveButton" type="submit" disabled>保存修改</button></footer>
  </form>`;
}

function rolePageMarkup() {
  return `<section class="profile-page-intro"><span><i data-lucide="shield-check"></i></span><div><strong>${h(managerProfile.role)}</strong><small>当前角色由系统管理员分配，本人仅可查看</small></div></section>
    <section class="profile-settings-card">
      <div class="profile-setting-row"><span><i data-lucide="user-round-check"></i></span><span class="profile-setting-copy"><strong>当前角色</strong><small>决定可查看和办理的业务范围</small></span><em class="profile-setting-value">${h(managerProfile.role)}</em></div>
      <div class="profile-setting-row"><span><i data-lucide="building-2"></i></span><span class="profile-setting-copy"><strong>所属部门</strong><small>当前账号所在组织</small></span><em class="profile-setting-value">${h(managerProfile.department)}</em></div>
      <div class="profile-setting-row"><span><i data-lucide="badge-check"></i></span><span class="profile-setting-copy"><strong>账号编号</strong><small>系统内唯一身份标识</small></span><em class="profile-setting-value">${h(managerProfile.account)}</em></div>
    </section>
    <p class="profile-page-note">如需调整所属部门或角色权限，请联系有权限的系统管理员处理。</p>`;
}

function notificationPageMarkup() {
  const row = (key, icon, title, note) => `<label class="profile-setting-row"><span><i data-lucide="${icon}"></i></span><span class="profile-setting-copy"><strong>${title}</strong><small>${note}</small></span><span class="profile-toggle"><input data-notification-setting="${key}" type="checkbox" ${managerNotifications[key] ? "checked" : ""} /><i aria-hidden="true"></i></span></label>`;
  return `<section class="profile-page-intro"><span><i data-lucide="bell-cog"></i></span><div><strong>通知设置</strong><small>这里只管理接收偏好，消息内容仍在“消息”页查看</small></div></section>
    <section class="profile-settings-card">
      ${row("task", "list-checks", "任务通知", "派单、任务变更与执行进度")}
      ${row("warning", "shield-alert", "预警通知", "证件到期与异常任务提醒")}
      ${row("system", "info", "系统通知", "版本更新与服务公告")}
    </section>
    <p class="profile-page-note">关闭某类通知后，对应消息仍会保留在消息中心，不影响业务数据。</p>`;
}

function securityPageMarkup() {
  return `<section class="profile-page-intro"><span><i data-lucide="lock-keyhole"></i></span><div><strong>账号状态正常</strong><small>当前账号未发现异常登录或安全风险</small></div></section>
    <section class="profile-settings-card">
      <div class="profile-setting-row"><span><i data-lucide="smartphone"></i></span><span class="profile-setting-copy"><strong>绑定手机号</strong><small>用于身份确认和重要提醒</small></span><em class="profile-setting-value">${h(maskManagerPhone(managerProfile.phone))}</em></div>
      <div class="profile-setting-row"><span><i data-lucide="monitor-smartphone"></i></span><span class="profile-setting-copy"><strong>当前登录设备</strong><small>微信小程序 · 本机</small></span><em class="profile-setting-value">正常</em></div>
      <div class="profile-setting-row"><span><i data-lucide="activity"></i></span><span class="profile-setting-copy"><strong>最近登录</strong><small>登录记录仅用于安全核验</small></span><em class="profile-setting-value">刚刚</em></div>
    </section>
    <button class="profile-page-button" data-profile-nested-action="profile" type="button">更新个人资料</button>`;
}

function helpPageMarkup() {
  const records = window.FeedbackManager.bySubmitter("manager", managerProfile.account);
  const categories = window.FeedbackManager.categories("manager");
  const statusMeta = window.FeedbackManager.STATUS_META;
  const tabs = `<div class="feedback-mobile-tabs" role="tablist" aria-label="管理端反馈视图"><button class="${state.feedbackTab === "submit" ? "active" : ""}" data-manager-feedback-tab="submit" type="button" role="tab" aria-selected="${state.feedbackTab === "submit"}">提交反馈</button><button class="${state.feedbackTab === "history" ? "active" : ""}" data-manager-feedback-tab="history" type="button" role="tab" aria-selected="${state.feedbackTab === "history"}">我的反馈${records.length ? `（${records.length}）` : ""}</button></div>`;
  if (state.feedbackTab === "history") {
    return `<div class="manager-feedback-page feedback-mobile-page">${tabs}<div class="feedback-history-list">${records.length ? records.map((item) => {
      const status = statusMeta[item.status];
      return `<article class="feedback-history-card"><header><span><strong>${h(item.categoryLabel)}</strong><small>${h(item.id)} · ${h(item.createdAt)}</small></span><em class="feedback-status ${status.className}">${status.label}</em></header><p>${h(item.description)}</p><div class="feedback-history-meta"><span>${h(item.relatedLabel || "未关联模块")}</span><span>${item.attachments.length ? `${item.attachments.length} 个附件` : "无附件"}</span></div>${item.publicReply ? `<div class="feedback-history-reply"><strong>处理回复：</strong>${h(item.publicReply)}</div>` : ""}</article>`;
    }).join("") : '<div class="feedback-history-empty"><i data-lucide="message-square-dashed"></i><strong>暂无反馈记录</strong><span>提交后的处理状态会显示在这里</span></div>'}</div></div>`;
  }
  return `<div class="manager-feedback-page feedback-mobile-page">${tabs}
    <section class="profile-page-intro"><span><i data-lucide="circle-help"></i></span><div><strong>帮助与反馈</strong><small>反馈将进入 PC 后台统一处理</small></div></section>
    <section class="profile-settings-card">
      <div class="profile-setting-row"><span><i data-lucide="book-open"></i></span><span class="profile-setting-copy"><strong>使用指南</strong><small>工作台、报表、消息和账号设置说明</small></span><em class="profile-setting-value">管理端 1.0</em></div>
      <div class="profile-setting-row"><span><i data-lucide="file-lock-2"></i></span><span class="profile-setting-copy"><strong>隐私与协议</strong><small>账号数据仅用于业务协同</small></span><em class="profile-setting-value">已同意</em></div>
    </section>
    <form id="managerFeedbackForm" class="feedback-form-card">
      <div class="feedback-form-intro"><span><i data-lucide="message-square-plus"></i></span><div><strong>提交问题或建议</strong><small>账号、部门和角色信息会自动记录</small></div></div>
      <label class="feedback-field"><span>问题类型</span><select name="categoryCode" required><option value="">请选择问题类型</option>${categories.map((item) => `<option value="${h(item.code)}">${h(item.label)}</option>`).join("")}</select></label>
      <label class="feedback-field"><span>相关功能模块 <em>选填</em></span><select name="relatedId"><option value="">不关联模块</option><option value="workbench">工作台</option><option value="waybill">计划与任务</option><option value="dispatch">任务派单</option><option value="capacity">运力管理</option><option value="archive">车辆、司机与客户档案</option><option value="finance">财务与结算</option><option value="reports">数据报表</option><option value="access">用户与权限</option><option value="messages">消息与公告</option></select></label>
      <label class="feedback-field"><span>业务编号 <em>选填</em></span><input name="businessId" maxlength="60" placeholder="例如运单号、派单号或车辆编号" /></label>
      <label class="feedback-field"><span>问题描述 <em data-manager-feedback-count>0/1000</em></span><textarea name="description" rows="5" minlength="10" maxlength="1000" placeholder="请描述发生了什么、期望如何改进，至少填写 10 个字" required></textarea></label>
      <label class="feedback-field"><span>图片或视频 <em>选填</em></span><label class="feedback-upload"><input name="attachments" type="file" accept="image/*,video/mp4,video/quicktime" multiple /><span class="feedback-upload-icon"><i data-lucide="image-plus"></i></span><span><strong>上传截图或视频</strong><small>最多 9 个附件，视频最多 2 个；图片≤10MB，视频≤100MB</small></span></label><small class="feedback-file-summary" data-manager-feedback-files>尚未选择附件</small></label>
      <label class="feedback-field"><span>联系电话</span><input name="contactPhone" inputmode="tel" maxlength="11" value="${h(managerProfile.phone)}" required /></label>
      <button class="feedback-submit-button" type="submit">提交意见反馈</button>
    </form></div>`;
}

function openProfileSubpage(action) {
  const page = $("#managerProfileSubpage");
  if (!page.classList.contains("open")) profilePreviousFocus = document.activeElement;
  state.profilePage = action;
  profileEditDirty = false;
  profileDraftAvatar = managerProfile.avatar;
  const meta = {
    profile: ["个人资料", "编辑个人资料"], role: ["账号与设置", "角色权限"],
    notification: ["账号与设置", "通知设置"], security: ["账号与设置", "账号安全"], help: ["系统服务", "帮助与反馈"],
  }[action] || ["账号与设置", "个人资料"];
  $("#profileSubpageEyebrow").textContent = meta[0];
  $("#profileSubpageTitle").textContent = meta[1];
  $("#profileSubpageContent").innerHTML = action === "profile" ? profileEditorMarkup() : action === "role" ? rolePageMarkup() : action === "notification" ? notificationPageMarkup() : action === "security" ? securityPageMarkup() : helpPageMarkup();
  page.classList.add("open");
  page.setAttribute("aria-hidden", "false");
  $(".manager-shell").classList.add("subpage-open");
  if (action === "profile") setManagerAvatar($("#profileAvatarPreview"), { ...managerProfile, avatar: profileDraftAvatar });
  refreshIcons();
  requestAnimationFrame(() => $("#profileSubpageBack")?.focus());
}

function closeProfileSubpage(force = false) {
  if (!force && state.profilePage === "profile" && profileEditDirty && !window.confirm("个人资料尚未保存，确定放弃修改吗？")) return false;
  const page = $("#managerProfileSubpage");
  page.classList.remove("open");
  page.setAttribute("aria-hidden", "true");
  $(".manager-shell").classList.remove("subpage-open");
  state.profilePage = "";
  profileEditDirty = false;
  const fallback = $("#profileView [data-profile-action=profile]");
  (profilePreviousFocus?.isConnected ? profilePreviousFocus : fallback)?.focus();
  profilePreviousFocus = null;
  return true;
}

function syncProfileEditorState() {
  const form = $("#managerProfileForm");
  if (!form) return;
  const name = form.elements.name.value.trim();
  const phone = form.elements.phone.value;
  profileEditDirty = name !== managerProfile.name || phone !== managerProfile.phone || profileDraftAvatar !== managerProfile.avatar;
  $("#profileSaveButton").disabled = !profileEditDirty;
  const previewProfile = { ...managerProfile, name: name || managerProfile.name, avatar: profileDraftAvatar };
  setManagerAvatar($("#profileAvatarPreview"), previewProfile);
}

function saveManagerProfile(event) {
  event.preventDefault();
  const form = event.target;
  const name = form.elements.name.value.trim();
  const phone = form.elements.phone.value.replace(/\D/g, "");
  if (!name) { form.elements.name.focus(); showToast("请填写姓名"); return; }
  if (!/^1\d{10}$/.test(phone)) { form.elements.phone.focus(); showToast("请输入正确的 11 位手机号"); return; }
  const nextProfile = { ...managerProfile, name, phone, avatar: profileDraftAvatar };
  try { localStorage.setItem(MANAGER_PROFILE_STORAGE_KEY, JSON.stringify(nextProfile)); }
  catch (error) { showToast("资料保存失败，请缩小头像后重试"); return; }
  managerProfile = nextProfile;
  renderManagerProfile();
  profileEditDirty = false;
  closeProfileSubpage(true);
  showToast("个人资料已保存");
}

function reportShiftDate(dateText, days) {
  const date = new Date(`${dateText}T12:00:00`);
  date.setDate(date.getDate() + days);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function reportRange() {
  const key = $("#reportDateRange").value || "today";
  const profile = reportRanges[key] || reportRanges.today;
  const end = reportShiftDate(localDate(), profile.endOffset);
  return { ...profile, start: reportShiftDate(end, 1 - profile.days), end };
}

function reportRawData() {
  const snapshot = window.AdminDataBridge?.read?.() || {};
  const fromCatalog = (name) => moduleCatalog[name].items.map((item) => item.raw).filter((item) => item && !(name === "dispatch" && String(item.id || "").startsWith("PD-M-")));
  const fallbackDispatches = moduleCatalog.dispatch.items.filter((item) => /^PD-100[1-5]$/.test(item.id)).map((item) => {
    const routeById = { "PD-1001": "XL-001", "PD-1002": "XL-002", "PD-1003": "XL-003", "PD-1005": "XL-001" };
    const routeId = routeById[item.id];
    const route = moduleCatalog.route.items.find((entry) => entry.id === routeId);
    const raw = item.raw || dispatchRawForItem(item);
    return {
      ...raw, id: item.id, routeId, routeName: route?.title || item.title, orderDate: item.id === "PD-1003" ? "2026-09-15" : "2026-09-16",
      taskType: item.id === "PD-1002" ? "提重送货" : item.id === "PD-1003" ? "排空箱（A→B）" : "提空装货",
      customerId: ({ "PD-1001": "KH-HM", "PD-1002": "KH-LG", "PD-1003": "KH-ZT", "PD-1005": "KH-HM" })[item.id],
      projectId: ({ "PD-1001": "PR-HM-BYD", "PD-1002": "PR-LG-TH", "PD-1003": "PR-ZT-X387", "PD-1005": "PR-HM-BYD" })[item.id],
      dispatchMode: item.id === "PD-1002" ? "manual" : item.id === "PD-1001" ? "auto" : "pending",
    };
  });
  const fallbackVehicles = moduleCatalog.vehicle.items.map((item) => item.raw || ({ plateNo: item.id, vehicleState: item.status, remark: item.note }));
  const fallbackDrivers = moduleCatalog.driver.items.map((item) => item.raw || ({ id: item.id, name: item.title, driverState: item.status }));
  return {
    routes: Array.isArray(snapshot.fixedRoutes) && snapshot.fixedRoutes.length ? snapshot.fixedRoutes : fromCatalog("route"),
    waybills: Array.isArray(snapshot.waybills) && snapshot.waybills.length ? snapshot.waybills : fromCatalog("waybill"),
    dispatches: Array.isArray(snapshot.dispatches) && snapshot.dispatches.length ? snapshot.dispatches : fallbackDispatches,
    vehicles: Array.isArray(snapshot.vehicles) && snapshot.vehicles.length ? snapshot.vehicles : fromCatalog("vehicle").length ? fromCatalog("vehicle") : fallbackVehicles,
    drivers: Array.isArray(snapshot.drivers) && snapshot.drivers.length ? snapshot.drivers : fromCatalog("driver").length ? fromCatalog("driver") : fallbackDrivers,
  };
}

function reportPopulateFilters() {
  const customer = $("#reportCustomer");
  const project = $("#reportProject");
  const route = $("#reportRoute");
  const keep = (select, options, placeholder) => {
    const current = select.value;
    select.innerHTML = `<option value="">${placeholder}</option>${options.map((item) => `<option value="${h(item.value)}">${h(item.label)}</option>`).join("")}`;
    if (options.some((item) => item.value === current)) select.value = current;
  };
  const customers = [...new Map(reportPlanRecords.map((item) => [item.customerId, { value: item.customerId, label: item.customerName }])).values()];
  keep(customer, customers, "全部客户");
  const projectRows = reportPlanRecords.filter((item) => !customer.value || item.customerId === customer.value);
  keep(project, [...new Map(projectRows.map((item) => [item.projectId, { value: item.projectId, label: item.projectName }])).values()], "全部项目");
  const routeRows = projectRows.filter((item) => !project.value || item.projectId === project.value);
  const routes = reportRawData().routes;
  keep(route, routeRows.map((item) => ({ value: item.routeId, label: routes.find((candidate) => candidate.id === item.routeId)?.routeName || item.routeId })), "全部线路");
}

function reportPlanRows(range = reportRange()) {
  return reportPlanRecords.filter((item) =>
    (!$("#reportCustomer").value || item.customerId === $("#reportCustomer").value) &&
    (!$("#reportProject").value || item.projectId === $("#reportProject").value) &&
    (!$("#reportRoute").value || item.routeId === $("#reportRoute").value)
  ).map((item) => ({ ...item, planned: item.planned * range.days, completed: item.completed * range.days }));
}

function reportDispatchDate(dispatch) {
  const source = String(dispatch.orderDate || dispatch.dispatchTime || dispatch.timeline?.[0]?.time || "").slice(0, 10);
  if (!source) return "";
  if (/^PD-100[1-5]$/.test(dispatch.id || "")) {
    const days = Math.round((new Date(`${source}T12:00:00`) - new Date("2026-09-16T12:00:00")) / 86400000);
    return reportShiftDate(localDate(), days);
  }
  return source;
}

function reportTaskRows(data, range) {
  return data.dispatches.filter((dispatch) => {
    const date = reportDispatchDate(dispatch);
    if (!date || date < range.start || date > range.end || ["取消", "作废"].includes(dispatch.status)) return false;
    const plan = reportPlanRecords.find((item) => item.routeId === dispatch.routeId && (!dispatch.customerId || item.customerId === dispatch.customerId)) || reportPlanRecords.find((item) => item.routeId === dispatch.routeId);
    return (!$("#reportCustomer").value || plan?.customerId === $("#reportCustomer").value) &&
      (!$("#reportProject").value || plan?.projectId === $("#reportProject").value) &&
      (!$("#reportRoute").value || dispatch.routeId === $("#reportRoute").value);
  });
}

function reportTaskMeta(dispatch, data) {
  const waybill = data.waybills.find((item) => item.waybillNo === dispatch.waybillNo);
  const isSupported = (value) => Object.prototype.hasOwnProperty.call(reportNodeSequences, value);
  const taskType = isSupported(dispatch.taskType) ? dispatch.taskType : isSupported(waybill?.taskType) ? waybill.taskType : "提空装货";
  const nodes = reportNodeSequences[taskType];
  const current = String(dispatch.currentNode || "").trim();
  let index = dispatch.status === "已完成" || ["已送达", "完成", "完成落重", "完成落空"].includes(current) ? nodes.length - 1 : nodes.indexOf(current);
  const timelineIndex = [...(dispatch.timeline || [])].reverse().map((item) => nodes.indexOf(String(item.node || "").trim())).find((value) => value >= 0);
  if (index < 0 && ["在途", "进站", "落箱"].includes(current) && timelineIndex >= 0) {
    const lastNode = nodes[timelineIndex];
    const samePhase = current === "在途" ? lastNode.includes("在途") : current === "进站" ? lastNode.includes("进站") : lastNode.includes("落") || lastNode.includes("完成");
    if (samePhase) index = timelineIndex;
    else if (timelineIndex + 1 < nodes.length) index = timelineIndex + 1;
  }
  if (index < 0) index = ({ 待派单: -1, 待提货: -1, 已提货: 0, 已提箱: 0, 在途: Math.min(1, nodes.length - 1), 装卸: Math.min(3, nodes.length - 1), 进站: Math.min(5, nodes.length - 1), 落箱: nodes.length - 1 })[current] ?? -1;
  const completedCount = Math.max(0, Math.min(nodes.length, index + 1));
  const progress = Math.round(completedCount / nodes.length * 100);
  const threshold = Number($("#reportThreshold").value) || 70;
  return { nodes, index, progress, stage: index >= 0 ? nodes[index] : "待开始", nearComplete: progress >= threshold && progress < 100, exception: dispatch.status === "已派单" && current === "待提货" };
}

function reportCapacityGroups(data, range) {
  const active = (dispatch) => {
    const date = reportDispatchDate(dispatch);
    return date >= range.start && date <= range.end && ["已派单", "运输中"].includes(dispatch.status);
  };
  const vehicleState = (vehicle) => {
    if (vehicle.vehicleState === "维修中") return "维修";
    if (vehicle.vehicleState !== "在用") return /复检|维修/.test(vehicle.remark || "") ? "维修" : "停用";
    return data.dispatches.some((dispatch) => dispatch.vehicleId === vehicle.plateNo && active(dispatch)) ? "在途" : "空闲";
  };
  const driverState = (driver) => {
    if (driver.driverState === "停用") return "休假";
    if (data.dispatches.some((dispatch) => dispatch.driverId === driver.id && active(dispatch))) return "在途";
    return driver.driverState === "空闲" ? "空闲" : "出勤";
  };
  return {
    vehicles: ["空闲", "在途", "维修", "停用"].map((status) => [status, data.vehicles.filter((item) => vehicleState(item) === status).length, ({ 空闲: "#35a578", 在途: "#3889bd", 维修: "#d69a46", 停用: "#99a3ae" })[status], data.vehicles.filter((item) => vehicleState(item) === status).map((item) => item.plateNo)]),
    drivers: ["出勤", "休假", "在途", "空闲"].map((status) => [status, data.drivers.filter((item) => driverState(item) === status).length, ({ 出勤: "#259ca7", 休假: "#99a3ae", 在途: "#3889bd", 空闲: "#35a578" })[status], data.drivers.filter((item) => driverState(item) === status).map((item) => item.id)]),
  };
}

function reportMoney(value) {
  return `¥${Number(value || 0).toLocaleString("zh-CN", { maximumFractionDigits: 0 })}`;
}

function renderReportStatus(key, scope, items) {
  const total = items.reduce((sum, item) => sum + item[1], 0);
  $(`#report${key}Total`).textContent = `${total}${key === "Vehicle" ? " 台" : " 名"}`;
  $(`#report${key}Bar`).innerHTML = items.map(([, count, color]) => `<i style="width:${total ? count / total * 100 : 0}%;background:${color}"></i>`).join("");
  $(`#report${key}Status`).innerHTML = items.map(([label, count, color, ids]) => {
    const active = reportState.capacityFilter?.scope === scope && reportState.capacityFilter.status === label;
    return `<button class="report-status-item ${active ? "active" : ""}" data-report-capacity-scope="${scope}" data-report-capacity-status="${h(label)}" aria-pressed="${active}" type="button"><i style="--status-color:${color}"></i><span>${h(label)}</span><strong>${count}</strong></button>`;
  }).join("");
}

function renderReports() {
  if (!$("#reportsView")) return;
  const thresholdSelect = $("#reportThreshold");
  if (!thresholdSelect.dataset.ready) {
    const saved = localStorage.getItem("container-logistics-dashboard-near-complete") || "70";
    if ([...thresholdSelect.options].some((option) => option.value === saved)) thresholdSelect.value = saved;
    thresholdSelect.dataset.ready = "true";
  }
  reportPopulateFilters();
  const range = reportRange();
  const data = reportRawData();
  const planRows = reportPlanRows(range);
  const tasks = reportTaskRows(data, range);
  const planned = planRows.reduce((sum, item) => sum + item.planned, 0);
  const completedPlans = planRows.reduce((sum, item) => sum + item.completed, 0);
  const completionRate = planned ? Math.round(completedPlans / planned * 100) : 0;
  const completed = tasks.filter((item) => item.status === "已完成").length;
  const pending = tasks.filter((item) => item.status === "待派单").length;
  const moving = tasks.filter((item) => item.status === "运输中").length;
  const assigned = tasks.filter((item) => item.status !== "待派单");
  const automatic = assigned.filter((item) => item.dispatchMode === "auto").length;
  const manual = assigned.filter((item) => item.dispatchMode === "manual").length;
  let metas = tasks.map((dispatch) => ({ dispatch, meta: reportTaskMeta(dispatch, data) }));
  const exceptions = metas.filter(({ meta }) => meta.exception).length;
  const allAmount = planRows.map((item) => {
    const route = data.routes.find((candidate) => candidate.id === item.routeId);
    return { ...item, routeName: route?.routeName || item.routeId, amount: item.planned * Number(route?.estimatedRevenue || 0) };
  });
  const amount = allAmount.reduce((sum, item) => sum + item.amount, 0);
  const monthAmount = allAmount.reduce((sum, item) => sum + item.monthAmount, 0);
  const totalAmount = allAmount.reduce((sum, item) => sum + item.totalAmount, 0);
  const amountGroups = new Map();
  allAmount.forEach((item) => {
    const name = reportState.amountDimension === "customer" ? item.customerName : item.routeName;
    amountGroups.set(name, (amountGroups.get(name) || 0) + item.amount);
  });
  const amountEntries = [...amountGroups.entries()].sort((a, b) => b[1] - a[1]);
  const maxAmount = Math.max(...amountEntries.map((item) => item[1]), 1);

  $("#reportScopeLabel").textContent = `${range.label}运营全局`;
  $("#reportTaskTitle").textContent = `${range.label}任务`;
  $("#reportTaskSummary").textContent = `${range.start.slice(5)} 至 ${range.end.slice(5)} · ${tasks.length} 条任务进入调度`;
  $("#reportCompletionRate").textContent = `${completionRate}%`;
  $("#reportCompletionBar").style.width = `${completionRate}%`;
  $("#reportCompletionNote").textContent = `已完成 ${completedPlans} / ${planned}`;
  $("#reportTaskMetrics").innerHTML = [
    ["计划数", planned, range.label], ["已派单", assigned.length, `自动 ${automatic} / 手动 ${manual}`], ["进行中", moving, "节点执行中"],
    ["待派发", pending, "等待运力"], ["异常任务", exceptions, "需要处理"], ["已完成", completed, `${range.label}完成`],
  ].map(([label, value, note]) => `<div class="report-task-metric"><span>${label}</span><strong>${value}</strong><small>${note}</small></div>`).join("");
  $("#reportAmountTotals").innerHTML = [[`${range.label}预估`, amount], ["本月金额", monthAmount], ["累计金额", totalAmount]].map(([label, value]) => `<div class="report-amount-total"><span>${label}</span><strong>${reportMoney(value)}</strong></div>`).join("");
  $("#reportAmountDistribution").innerHTML = amountEntries.length ? amountEntries.map(([name, value]) => `<div class="report-bar-row"><span title="${h(name)}">${h(name)}</span><span class="report-bar-track"><i style="width:${Math.round(value / maxAmount * 100)}%"></i></span><strong>${reportMoney(value)}</strong></div>`).join("") : `<div class="report-empty">暂无金额数据</div>`;
  const capacity = reportCapacityGroups(data, range);
  renderReportStatus("Vehicle", "vehicle", capacity.vehicles);
  renderReportStatus("Driver", "driver", capacity.drivers);
  if (reportState.capacityFilter) {
    const matchingIds = (reportState.capacityFilter.scope === "vehicle" ? capacity.vehicles : capacity.drivers).find((item) => item[0] === reportState.capacityFilter.status)?.[3] || [];
    metas = metas.filter(({ dispatch }) => matchingIds.includes(reportState.capacityFilter.scope === "vehicle" ? dispatch.vehicleId : dispatch.driverId));
  }
  $("#reportOperatingDate").textContent = range.start === range.end ? range.end.slice(5) : `${range.start.slice(5)} 至 ${range.end.slice(5)}`;
  $("#reportDispatchList").innerHTML = metas.length ? metas.sort((a, b) => Number(b.meta.nearComplete) - Number(a.meta.nearComplete) || b.meta.progress - a.meta.progress || Number(b.meta.exception) - Number(a.meta.exception)).map(({ dispatch, meta }) => `<article class="report-dispatch-item ${meta.exception ? "exception" : ""}"><div class="report-dispatch-top"><strong>${h(dispatch.waybillNo || dispatch.id)} · ${h(dispatch.routeName || "未指定线路")}</strong><span class="report-dispatch-state">${meta.exception ? "异常" : h(meta.stage)}</span></div><div class="report-dispatch-meta"><span>${h(dispatch.driverName || "待分配")} · ${h(dispatch.vehicleId || "车辆待分配")}</span><span>${meta.progress}%${meta.nearComplete ? " · 快完成" : ""}</span></div><div class="report-dispatch-progress"><i style="width:${meta.progress}%"></i></div></article>`).join("") : `<div class="report-empty">当前筛选下无执行中任务</div>`;
  $("#reportPlanList").innerHTML = planRows.length ? planRows.map((item) => {
    const route = data.routes.find((candidate) => candidate.id === item.routeId);
    const rate = item.planned ? Math.round(item.completed / item.planned * 100) : 0;
    return `<div class="report-plan-row"><span class="report-plan-owner"><strong>${h(item.customerName)}</strong><small>${h(item.projectName)}</small></span><span class="report-plan-route" title="${h(route?.routeName || item.routeId)}">${h(route?.routeName || item.routeId)}</span><span class="report-plan-result"><strong>${item.completed}/${item.planned}</strong><small>${rate}%</small></span></div>`;
  }).join("") : `<div class="report-empty">暂无计划数据，请调整客户、项目或线路筛选</div>`;
  $("#reportUpdatedAt").textContent = `更新于 ${new Intl.DateTimeFormat("zh-CN", { hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date())}`;
  refreshIcons();
}

function switchView(view) {
  state.currentView = view;
  if ($("#managerProfileSubpage").classList.contains("open")) closeProfileSubpage(true);
  $(".manager-shell").classList.remove("subpage-open");
  $$(".manager-view").forEach((item) => item.classList.toggle("active", item.id === `${view}View`));
  $$("#managerBottomNav button").forEach((button) => button.classList.toggle("active", button.dataset.view === view));
  $("#managerTitle").textContent = { workbench: "工作台", reports: "数据报表", messages: "消息", profile: "我的" }[view];
  $("#headerEyebrow").textContent = view === "workbench" ? "集卡物流管理端" : view === "reports" ? "运营数据概览" : view === "messages" ? "任务与预警通知" : "运营中心账号";
  if (view === "messages") renderMessages();
  if (view === "reports") renderReports();
  $("#moduleView").classList.remove("open");
  $("#managerDetailView").classList.remove("open");
  $("#managerEntryView").classList.remove("open");
  $("#managerEntryView").setAttribute("aria-hidden", "true");
  $("#managerProfileSubpage").classList.remove("open");
  $("#managerProfileSubpage").setAttribute("aria-hidden", "true");
}

function renderWorkbench() {
  const pendingCount = moduleCatalog.dispatch.items.filter((item) => item.status === "待派单").length;
  const expiredCount = moduleCatalog.reminder.items.filter((item) => item.status === "已过期").length;
  const alertCount = expiredCount + allMessages().filter((item) => item.unread && item.type === "warning").length;
  $("#focusList").innerHTML = `
    <button class="focus-row" data-open-module="dispatch-management" type="button"><span class="focus-symbol"><i data-lucide="circle-alert"></i></span><span><strong>${pendingCount} 条任务等待派单</strong><small>优先完成司机和车辆匹配</small></span><em>开始派单</em></button>
    <button class="focus-row" data-open-module="reminder" type="button"><span class="focus-symbol blue"><i data-lucide="shield-alert"></i></span><span><strong>${alertCount} 项车辆证件预警</strong><small>包含 ${expiredCount} 项已过期记录</small></span><em>查看</em></button>`;
  refreshIcons();
}

function moduleStatusMatches(item, filter) {
  if (filter === "全部") return true;
  if (["自营", "三方"].includes(filter)) {
    const ownership = window.CapacityOwnership.normalizeType(item.raw?.capacityOwnershipSnapshot || item.raw?.capacityOwnership || item.raw?.ownership || item.raw?.driverType);
    return ownership === filter;
  }
  if (filter === "空闲") return item.fields.some(([, value]) => value === "已完工") || item.status === "空闲";
  if (filter === "保险即将到期" || filter === "审验即将到期" || filter === "已过期") return item.status === filter;
  return item.status === filter;
}

function renderModule() {
  const meta = moduleCatalog[state.currentModule];
  if (!meta) return;
  const query = state.search.trim().toLowerCase();
  const items = meta.items.filter((item) => moduleStatusMatches(item, state.moduleFilter) && (!query || JSON.stringify(item).toLowerCase().includes(query)));
  $("#moduleFilters").innerHTML = meta.filters.map((filter) => { const active = filter === state.moduleFilter; return `<button class="filter-chip ${active ? "active" : ""}" data-module-filter="${h(filter)}" aria-pressed="${active}" type="button">${h(filter)}</button>`; }).join("");
  $("#moduleSummary").innerHTML = `<span>当前结果</span><strong>${items.length} 条</strong>`;
  $("#moduleList").innerHTML = items.length ? items.map((item) => `
    <article class="manager-list-card">
      <div class="list-card-top"><div><strong>${h(item.title)}</strong><small>${h(item.id)} · ${h(item.subtitle)}</small></div><span class="status-tag ${h(item.statusClass)}">${h(item.status)}</span></div>
      <div class="list-card-grid">${item.fields.slice(0, meta.listFieldLimit || 4).map(([label, value]) => `<div class="list-field"><span>${h(label)}</span><strong>${h(value)}</strong></div>`).join("")}</div>
      <div class="list-card-footer"><span>${h(item.note || "资料已同步")}</span><div class="list-card-actions"><button data-module-detail="${h(item.id)}" type="button">查看详情</button>${["待派单", "待匹配"].includes(item.status) && ["dispatch", "dispatch-management"].includes(state.currentModule) ? `<button class="primary" data-start-dispatch="${h(item.id)}" type="button">开始派单</button>` : item.status === "待处理" ? `<button class="primary" data-module-detail="${h(item.id)}" type="button">去处理</button>` : ""}</div></div>
    </article>`).join("") : `<div class="module-empty"><span><i data-lucide="inbox"></i></span><strong>暂无匹配数据</strong><small>调整搜索或筛选条件后重试</small></div>`;
  refreshIcons();
}

function openModule(moduleName, filter = "全部") {
  const meta = moduleCatalog[moduleName];
  if (!meta) return;
  if (moduleName === "dispatch-management") rebuildDispatchManagementCatalog();
  state.currentModule = moduleName;
  state.moduleFilter = meta.filters.includes(filter) ? filter : "全部";
  state.search = "";
  $("#moduleSearch").value = "";
  $("#clearModuleSearch").classList.remove("visible");
  $("#moduleEyebrow").textContent = meta.eyebrow;
  $("#moduleTitle").textContent = meta.title;
  $("#modulePrimaryButton").setAttribute("aria-label", meta.primary);
  $("#modulePrimaryButton").hidden = ["capacity", "dispatch-management"].includes(moduleName);
  $("#moduleView").classList.add("open");
  $("#moduleView").setAttribute("aria-hidden", "false");
  $(".manager-shell").classList.add("subpage-open");
  renderModule();
}

function closeModule() {
  $("#moduleView").classList.remove("open");
  $("#moduleView").setAttribute("aria-hidden", "true");
  $("#managerDetailView").classList.remove("open");
  $("#managerDetailView").setAttribute("aria-hidden", "true");
  $("#managerEntryView").classList.remove("open");
  $("#managerEntryView").setAttribute("aria-hidden", "true");
  $(".manager-shell").classList.remove("subpage-open");
}

function updateRouteCommission() {
  const form = $("#managerEntryForm");
  if (state.entryModule !== "route" || !form.elements.commissionType) return;
  const isRate = form.elements.commissionType.value === "rate";
  const value = Number(form.elements.commissionValue.value) || 0;
  const revenue = Number(form.elements.estimatedRevenue.value) || 0;
  form.elements.commissionValue.max = isRate ? "100" : "";
  form.elements.commissionValue.closest(".mobile-field").querySelector("span").textContent = isRate ? "收入提成比例（%）" : "固定提成金额（元）";
  $("#mobileCommissionPreview").textContent = `¥${(isRate ? revenue * value / 100 : value).toFixed(2)}`;
}

function updateDispatchSummary() {
  const form = $("#managerEntryForm");
  if (state.entryModule !== "dispatch" || !form.elements.waybillId) return;
  const waybill = moduleCatalog.waybill.items.find((item) => item.id === form.elements.waybillId.value);
  const driver = form.elements.driverId;
  const vehicle = form.elements.vehicleId;
  driver.disabled = !waybill;
  vehicle.disabled = !waybill;
  if (!waybill) { driver.value = ""; vehicle.value = ""; }
  if (waybill && !form.elements.routeId.value) form.elements.routeId.value = waybill.raw?.routeId || "";
  const route = waybill ? moduleCatalog.route.items.find((item) => item.id === form.elements.routeId.value) || moduleCatalog.route.items.find((item) => item.title === waybill.subtitle) : null;
  const routeRaw = route ? routeInfo(route) : {};
  const taskType = waybill?.raw?.taskType || state.entryOriginalRaw?.taskType || "提空装货";
  const templates = window.DispatchTaskNodes?.profile?.(taskType)?.jobLocations || [];
  const fields = document.querySelector("[data-job-location-fields]");
  if (fields) {
    const prior = state.entryOriginalRaw?.jobLocations || waybill?.raw?.jobLocations || [];
    fields.innerHTML = templates.map((location, index) => {
      const stored = prior.find((item) => item.id === location.id) || prior[index] || {};
      const addresses = [routeRaw.pickupPoint || routeRaw.origin, routeRaw.loadingPoint || routeRaw.destination, routeRaw.unloadingPoint || routeRaw.dropoffPoint || routeRaw.destination];
      return fieldMarkup({ name: `jobLocation_${location.id}`, label: location.name, required: true, value: stored.address || addresses[index] || "", placeholder: `请输入${location.name}地址`, full: true });
    }).join("");
  }
  if (waybill && !form.elements.projectId.value) form.elements.projectId.value = waybill.raw?.projectId || routeRaw.projectId || "";
  const field = (label) => waybill?.fields.find(([name]) => name === label)?.[1] || "";
  const values = {
    route: waybill?.subtitle || "", origin: routeRaw.pickupPoint || routeRaw.origin || "", destination: routeRaw.unloadingPoint || routeRaw.loadingPoint || routeRaw.destination || "",
    address: routeRaw.dropoffPoint || waybill?.raw?.returnPoint || routeRaw.destination || routeRaw.loadingPoint || "", boxes: waybill?.raw?.containers?.map((item) => `${item.containerType || item.boxType || ""} ${item.containerNo || item.boxNo || ""}`.trim()).filter(Boolean).join("、") || field("箱型"),
    revenue: routeRaw.estimatedRevenue ? `¥${routeRaw.estimatedRevenue}` : "", commission: routeRaw.commissionValue ? `¥${routeRaw.commissionValue}` : "",
  };
  $$("#mobileDispatchSummary [data-summary]").forEach((node) => { node.textContent = values[node.dataset.summary] || ""; });
  const raw = waybill?.raw || {};
  const boxValues = {
    boxType: String(raw.boxType || raw.containers?.[0]?.containerType || "40HQ").replace(/\*\d+$/, ""),
    boxNo1: raw.boxNo1 || raw.containers?.[0]?.containerNo || raw.containers?.[0]?.boxNo || "",
    sealNo1: raw.sealNo1 || raw.containers?.[0]?.sealNo || "",
    boxNo2: raw.boxNo2 || raw.containers?.[1]?.containerNo || raw.containers?.[1]?.boxNo || "",
    sealNo2: raw.sealNo2 || raw.containers?.[1]?.sealNo || "",
  };
  Object.entries(boxValues).forEach(([name, value]) => {
    const control = form.elements[name];
    if (control && !control.value) control.value = value;
  });
}

function updateDispatchVehicle() {
  const form = $("#managerEntryForm");
  if (state.entryModule !== "dispatch" || !form.elements.vehicleId) return;
  const vehicle = moduleCatalog.vehicle.items.find((item) => item.id === form.elements.vehicleId.value);
  if (vehicle?.raw?.trailerId && form.elements.trailerId && !form.elements.trailerId.value) form.elements.trailerId.value = vehicle.raw.trailerId;
}

function updateWaybillCustomer() {
  const form = $("#managerEntryForm");
  if (state.entryModule !== "waybill" || !form.elements.customerId) return;
  const customer = moduleCatalog.customer.items.find((item) => item.id === form.elements.customerId.value);
  const info = customer ? customerInfo(customer) : null;
  if (info) form.elements.loadAddress.value = [info.loadAddress, info.unloadAddress].filter(Boolean).join(" / ");
  const unit = form.querySelector('[name="receivableUnit"]');
  if (unit && customer) unit.value = customer.title;
}

function loadWaybillRouteDefaults() {
  const form = $("#managerEntryForm");
  if (state.entryModule !== "waybill" || !form.elements.routeId) return;
  const route = moduleCatalog.route.items.find((item) => item.id === form.elements.routeId.value);
  if (!route) return;
  const info = routeInfo(route);
  const receivablePrice = form.querySelector('[name="receivablePrice"]');
  const payablePrice = form.querySelector('[name="payablePrice"]');
  if (receivablePrice && !receivablePrice.value) receivablePrice.value = info.estimatedRevenue || "";
  if (payablePrice && !payablePrice.value) payablePrice.value = info.commissionValue || "";
  const receivableKind = form.querySelector('[name="receivableKind"]');
  const payableKind = form.querySelector('[name="payableKind"]');
  if (receivableKind && !receivableKind.value) receivableKind.value = "运费";
  if (payableKind && !payableKind.value) payableKind.value = "司机提成";
  updateAllFeeTotals();
}

function updateFeeTotal(card) {
  const type = card.dataset.feeType;
  const quantity = Number(card.querySelector(`[name="${type}Quantity"]`)?.value) || 0;
  const price = Number(card.querySelector(`[name="${type}Price"]`)?.value) || 0;
  const settled = Number(card.querySelector(`[name="${type}Settled"]`)?.value) || 0;
  const total = quantity * price;
  card.querySelector("[data-fee-total]").textContent = `¥${total.toFixed(2)} / ¥${Math.max(0, total - settled).toFixed(2)}`;
}

function updateAllFeeTotals() {
  $$("#managerEntryContent [data-repeat-card=fee]").forEach(updateFeeTotal);
}

function setupEntryBehavior(moduleName) {
  const form = $("#managerEntryForm");
  if (moduleName === "route") updateRouteCommission();
  if (moduleName === "dispatch") updateDispatchSummary();
  if (moduleName === "waybill") { updateWaybillCustomer(); loadWaybillRouteDefaults(); }
  if (moduleName === "auto") updateAutoMode();
  if (moduleName === "customer") {
    const customerRequired = ["customerType", "creditCode", "contactName", "mobile", "loadAddress", "unloadAddress", "settlementCycle"];
    const syncCustomerRole = () => {
      const supplierOnly = form.elements.businessRole?.value === "三方供应商";
      customerRequired.forEach((name) => {
        if (!form.elements[name]) return;
        form.elements[name].required = !supplierOnly;
        form.elements[name].closest(".mobile-field")?.classList.toggle("required", !supplierOnly);
      });
    };
    form.elements.businessRole?.addEventListener("change", syncCustomerRole);
    syncCustomerRole();
  }
  form.querySelectorAll("[required]").forEach((control) => control.addEventListener("invalid", () => control.classList.add("touched")));
  if (moduleName === "route") {
    form.addEventListener("change", (event) => {
      if (event.target.name === "customerId") populateMobileProjectOptions(event.target.value);
      if (["commissionType", "commissionValue", "estimatedRevenue"].includes(event.target.name)) updateRouteCommission();
    });
    form.addEventListener("input", (event) => {
      if (["commissionType", "commissionValue", "estimatedRevenue"].includes(event.target.name)) updateRouteCommission();
    });
  }
}

function updateAutoMode() {
  const form = $("#managerEntryForm");
  if (state.entryModule !== "auto" || !form.elements.triggerMode) return;
  const disabled = form.elements.triggerMode.value === "realtime";
  form.elements.intervalMinutes.disabled = disabled;
  form.elements.intervalMinutes.closest(".mobile-field").style.opacity = disabled ? ".5" : "1";
}

function generateMobileCustomerNo() {
  const maxNumber = moduleCatalog.customer.items.reduce((max, item) => {
    const match = /^KH-(\d+)$/i.exec(item.id);
    return match ? Math.max(max, Number(match[1])) : max;
  }, 1000);
  return `KH-${String(maxNumber + 1).padStart(4, "0")}`;
}

function openEntry(moduleName, recordId = "") {
  if (!["waybill", "route", "dispatch", "auto", "vehicle", "driver", "customer", "trailer", "plan"].includes(moduleName)) {
    showToast("该模块无需新增建档");
    return;
  }
  entryPreviousFocus = document.activeElement;
  state.entryModule = moduleName;
  state.entryEditId = recordId;
  const meta = moduleCatalog[moduleName];
  const existing = recordId ? meta.items.find((item) => item.id === recordId) : null;
  state.entryOriginalId = existing?.id || "";
  state.entryOriginalRaw = existing ? { ...(moduleName === "dispatch" ? dispatchRawForItem(existing) : existing.raw || {}) } : null;
  $("#entryEyebrow").textContent = meta.eyebrow;
  $("#entryTitle").textContent = moduleName === "auto" ? "自动派单设置" : meta.primary;
  $("#entrySaveButton").textContent = recordId ? "保存修改" : moduleName === "dispatch" ? "派单并推送" : moduleName === "auto" ? "保存设置" : meta.primary.replace("新增", "保存");
  $("#managerEntryContent").innerHTML = moduleName === "waybill" ? waybillEntryMarkup() : moduleName === "dispatch" ? dispatchEntryMarkup() : moduleName === "auto" ? autoEntryMarkup() : genericEntryMarkup(moduleName);
  $("#managerEntryForm").reset();
  if (moduleName === "route") {
    populateMobileRouteOptions();
    if (existing?.raw) {
      const form = $("#managerEntryForm");
      Object.entries(existing.raw).forEach(([name, value]) => { if (form.elements[name] && value != null) form.elements[name].value = value; });
      populateMobileProjectOptions(existing.raw.customerId, existing.raw.projectId);
    }
    $("#entryTitle").textContent = existing ? "编辑固定线路" : meta.primary;
    $("#entrySaveButton").textContent = existing ? "保存修改" : "保存线路";
  }
  if (existing?.raw && moduleName !== "route") {
    const form = $("#managerEntryForm");
    Object.entries(existing.raw).forEach(([name, value]) => {
      const control = form.elements[name];
      if (!control || value == null) return;
      if (control.type === "file") {
        const picker = control.closest(".file-picker");
        if (value && picker) {
          picker.classList.add("selected");
          picker.querySelector("strong").textContent = `已归档：${value}`;
          picker.querySelector("small").textContent = "重新选择文件将替换现有附件";
        }
        return;
      }
      control.value = control.type === "datetime-local" ? String(value).replace(" ", "T").slice(0, 16) : value;
    });
    $("#entryTitle").textContent = `编辑${meta.title.replace("管理", "")}`;
  }
  if (moduleName === "dispatch" && existing) {
    const form = $("#managerEntryForm");
    const raw = state.entryOriginalRaw || {};
    const waybillId = raw.waybillNo || raw.waybillId || existing.subtitle;
    form.elements.waybillId.value = waybillId;
    updateDispatchSummary();
    [["driverId", raw.driverId], ["vehicleId", raw.vehicleId], ["routeId", raw.routeId], ["projectId", raw.projectId], ["trailerId", raw.trailerId], ["vehicleType", raw.vehicleType]].forEach(([name, value]) => {
      const control = form.elements[name];
      if (!control || !value) return;
      if (control.options && ![...control.options].some((option) => option.value === value)) control.insertAdjacentHTML("beforeend", `<option value="${h(value)}">${h(name === "driverId" ? raw.driverName || value : value)}（当前）</option>`);
      control.value = value;
    });
    form.elements.note.value = raw.note || "";
    form.elements.waybillId.disabled = true;
    $("#entryTitle").textContent = raw.status === "待派单" ? "分配司机与车辆" : "编辑派单";
    $("#entrySaveButton").textContent = raw.status === "待派单" ? "确认派单并推送" : "保存派单修改";
  }
  if (moduleName === "plan" && $("#managerEntryForm").elements.routeId) {
    $("#managerEntryForm").elements.routeId.innerHTML = `<option value="">请选择固定线路</option>${moduleCatalog.route.items.filter((item) => item.status === "启用").map((item) => `<option value="${h(item.id)}">${h(item.title)}</option>`).join("")}`;
  }
  if (moduleName === "customer") {
    if (existing?.raw?.customerNo) $("#managerEntryForm").elements.customerNo.value = existing.raw.customerNo;
    else if (!existing) {
      $("#managerEntryForm").elements.customerNo.value = generateMobileCustomerNo();
      $("#managerEntryForm").elements.businessRole.value = "客户";
    }
  }
  if (moduleName === "waybill") {
    $("#managerEntryForm").elements.waybillNo.value = $("#mobileGeneratedWaybillNo").textContent;
    $("#managerEntryForm").elements.orderDate.value = localDate();
  }
  if (moduleName === "auto") {
    try {
      const settings = JSON.parse(localStorage.getItem(AUTO_SETTINGS_KEY) || "null");
      if (settings) {
        ["triggerMode", "intervalMinutes", "maxTrips", "warningDays"].forEach((name) => { if (settings[name] != null) $("#managerEntryForm").elements[name].value = settings[name]; });
        $("#managerEntryForm").elements.enabled.checked = settings.enabled !== false;
        $("#managerEntryForm").elements.retry.checked = settings.retry !== false;
      }
    } catch (error) { /* use form defaults */ }
  }
  $("#managerEntryView").classList.add("open");
  $(".manager-shell").classList.add("entry-open");
  $("#managerEntryView").setAttribute("aria-hidden", "false");
  $(".manager-shell").classList.add("subpage-open");
  setupEntryBehavior(moduleName);
  refreshIcons();
  requestAnimationFrame(() => $("#managerEntryContent input:not([type=hidden]):not([disabled]), #managerEntryContent select:not([disabled]), #managerEntryContent textarea:not([disabled])")?.focus());
}

function closeEntry() {
  $("#managerEntryView").classList.remove("open");
  $(".manager-shell").classList.remove("entry-open");
  $("#managerEntryView").setAttribute("aria-hidden", "true");
  state.entryModule = "";
  state.entryEditId = "";
  state.entryOriginalId = "";
  state.entryOriginalRaw = null;
  if (entryPreviousFocus?.isConnected) entryPreviousFocus.focus();
  entryPreviousFocus = null;
}

function populateMobileProjectOptions(customerId = "", selectedProjectId = "") {
  const select = $("#managerEntryForm")?.elements.projectId;
  if (!select) return;
  const accounts = window.AdminDataBridge?.read?.()?.routeAccounts || [];
  const projects = [...accounts.filter((item) => !customerId || item.customerId === customerId)];
  moduleCatalog.route.items.forEach((route) => {
    const raw = route.raw || {};
    if ((!customerId || raw.customerId === customerId) && raw.projectId && !projects.some((item) => item.projectId === raw.projectId)) {
      projects.push({ customerId: raw.customerId, customerName: raw.customerName, projectId: raw.projectId, projectName: raw.projectName || raw.projectId });
    }
  });
  select.innerHTML = '<option value="">请选择项目</option>' + projects.map((item) => `<option value="${h(item.projectId)}">${h(item.projectName || item.projectId)}</option>`).join("");
  if (selectedProjectId && [...select.options].some((option) => option.value === selectedProjectId)) select.value = selectedProjectId;
}

function populateMobileRouteOptions(customerId = "", projectId = "") {
  const form = $("#managerEntryForm");
  if (!form?.elements.customerId) return;
  const accounts = window.AdminDataBridge?.read?.()?.routeAccounts || [];
  const customerNames = new Map(accounts.map((item) => [item.customerId, item.customerName]));
  const customers = moduleCatalog.customer.items.filter((item) => customerHasRole(item, "客户")).map((item) => ({ id: item.id, name: item.title }));
  accounts.forEach((item) => { if (!customers.some((customer) => customer.id === item.customerId)) customers.push({ id: item.customerId, name: item.customerName || item.customerId }); });
  moduleCatalog.route.items.forEach((route) => {
    const raw = route.raw || {};
    if (raw.customerId && !customers.some((customer) => customer.id === raw.customerId)) customers.push({ id: raw.customerId, name: raw.customerName || raw.customerId });
  });
  form.elements.customerId.innerHTML = '<option value="">请选择客户</option>' + customers.map((item) => `<option value="${h(item.id)}">${h(item.name || customerNames.get(item.id) || item.id)}</option>`).join("");
  if (customerId) form.elements.customerId.value = customerId;
  populateMobileProjectOptions(customerId, projectId);
  const vehicles = moduleCatalog.vehicle.items;
  const drivers = moduleCatalog.driver.items;
  form.elements.defaultVehicle.innerHTML = '<option value="">不指定</option>' + vehicles.map((item) => `<option value="${h(item.id)}">${h(item.id)}</option>`).join("");
  form.elements.defaultDriver.innerHTML = '<option value="">不指定</option>' + drivers.map((item) => `<option value="${h(item.raw?.name || item.title)}">${h(item.raw?.name || item.title)}</option>`).join("");
}

function openDetail(item) {
  state.detailItem = item;
  $("#detailTitle").textContent = item.title;
  $("#detailActionButton").innerHTML = '<i data-lucide="ellipsis"></i>';
  $("#detailActionButton").hidden = false;
  $("#detailActionButton").removeAttribute("aria-label");
  delete $("#detailActionButton").dataset.editModule;
  delete $("#detailActionButton").dataset.editId;
  $("#moduleView").classList.remove("open");
  $("#moduleView").setAttribute("aria-hidden", "true");
  $("#managerDetailView").classList.add("open");
  $("#managerDetailView").setAttribute("aria-hidden", "false");
  $(".manager-shell").classList.add("subpage-open");
  if (state.currentModule === "plan") {
    renderPlanDetail(item);
    refreshIcons();
    return;
  }
  if (state.currentModule === "route") {
    renderRouteDetail(item);
    refreshIcons();
    return;
  }
  if (state.currentModule === "dispatch") {
    renderDispatchDetail(item);
    refreshIcons();
    return;
  }
  if (state.currentModule === "dispatch-management") {
    renderDispatchManagementDetail(item);
    refreshIcons();
    return;
  }
  if (["capacity", "vehicle", "trailer", "driver", "customer"].includes(state.currentModule)) {
    renderAssetDetail(state.currentModule, item);
    refreshIcons();
    return;
  }
  $("#managerDetailContent").innerHTML = `
    <section class="detail-hero"><span>${h(item.id)}</span><h2>${h(item.title)}</h2><p>${h(item.subtitle)}</p></section>
    <section class="detail-section"><h3>基础信息</h3>${item.fields.map(([label, value]) => `<div class="detail-row"><span>${h(label)}</span><strong>${h(value)}</strong></div>`).join("")}</section>
    <section class="detail-section"><h3>备注</h3><div class="detail-row"><span>业务说明</span><strong>${h(item.note || "暂无备注")}</strong></div><div class="detail-row"><span>当前状态</span><strong>${h(item.status)}</strong></div></section>`;
  refreshIcons();
}

const planWaybillFieldLabels = {
  waybillNo: "运单号", planTaskId: "计划任务ID", planTaskNo: "计划任务编号", planQuantity: "计划数量", childSequence: "子任务序号",
  orderDate: "接单日期", planExecutionDate: "计划执行日期", plannedBerthingTime: "计划靠台时间", executionTime: "计划靠台时间（兼容字段）", taskType: "任务类型", projectId: "项目ID", projectName: "项目名称",
  autoDispatch: "自动派发", dispatchAdvanceMinutes: "派发提前量（分钟）", routeId: "线路ID", customerId: "客户编号", customerName: "客户名称",
  billNo: "提单号", loadAddress: "还箱地", dispatchNo: "派车号", dispatchDate: "派车日期", boxType: "柜型", boxQuantity: "箱量",
  auditState: "审核状态", needReceipt: "需要回单", receivedReceipt: "已收回单", receiptDate: "回单日期", remark: "备注",
  freight: "运费", receivable: "应收金额", entryDate: "录入日期", profit: "预计利润", payable: "应付金额", carrier: "承运单位",
  returnPoint: "落箱 / 还箱点", pickupPoint1: "提箱点", pickupPoint2: "第二提箱点", plateNo: "车牌号", driverId: "司机编号", driverName: "司机姓名",
  arrived: "是否到达", arrivalDate: "到达日期", containers: "集装箱明细", receivableFees: "应收费用明细", payableFees: "应付费用明细",
  boxNo1: "箱号 1", sealNo1: "封号 1", boxNo2: "箱号 2", sealNo2: "封号 2",
};

function planValueText(value) {
  if (value == null || value === "") return "-";
  if (typeof value === "boolean") return value ? "是" : "否";
  if (Array.isArray(value)) return value.length ? value.map((entry) => typeof entry === "object" ? Object.entries(entry).map(([key, item]) => `${planWaybillFieldLabels[key] || key}：${planValueText(item)}`).join("，") : String(entry)).join("；") : "无";
  if (typeof value === "object") return Object.entries(value).map(([key, item]) => `${planWaybillFieldLabels[key] || key}：${planValueText(item)}`).join("，") || "-";
  return String(value);
}

function planDetailRows(fields) {
  return fields.map(([label, value]) => `<div class="detail-row"><span>${h(label)}</span><strong>${h(planValueText(value))}</strong></div>`).join("");
}

function renderPlanDetail(item) {
  const group = item.raw || {};
  const rows = group.rows || (group.waybills || []).map((waybillNo) => moduleCatalog.waybill.items.find((waybill) => waybill.id === waybillNo || waybill.raw?.waybillNo === waybillNo)).filter(Boolean).map((item) => item.raw || item);
  const first = group.first || rows[0] || {};
  const routes = [...new Map(rows.map((row) => [row.routeId, moduleCatalog.route.items.find((route) => route.id === row.routeId)]).filter(([, route]) => route)).values()];
  const dispatchByWaybill = new Map((group.linkedDispatches || []).map((dispatch) => [dispatch.waybillNo, dispatch]));
  const planFields = [
    ["计划任务编号", item.title], ["计划任务ID", group.id], ["客户名称", first.customerName], ["项目名称", first.projectName],
    ["计划执行日期", first.planExecutionDate || String(first.executionTime || first.orderDate || "-").slice(0, 10)], ["任务类型", first.taskType || "提空装货"],
    ["计划子任务数", rows.length], ["完成进度", item.fields.find(([label]) => label === "完成进度")?.[1]],
    ["计划状态", item.status], ["备注", first.remark],
  ];
  const routeSections = routes.map((route) => `<section class="detail-section"><h3>线路信息 · ${h(route.title)}</h3>${planDetailRows(Object.entries(route.raw || {}).map(([key, value]) => [({ routeName: "线路名称", routeCode: "线路编号", origin: "起运地", destination: "目的地", viaPoints: "途经点", routeState: "线路状态", customerName: "客户名称", projectName: "项目名称", estimatedRevenue: "预估收入", baseFreight: "基础运价", commissionType: "提成方式", commissionValue: "提成规则值", defaultVehicle: "常用车辆", defaultDriver: "常用司机", remark: "备注" })[key] || key, value]))}</section>`).join("");
  const childSections = rows.map((waybill) => {
    const dispatch = dispatchByWaybill.get(waybill.waybillNo);
    const waybillFields = Object.entries(waybill).map(([key, value]) => [planWaybillFieldLabels[key] || key, value]);
    const dispatchFields = dispatch ? Object.entries(dispatch).map(([key, value]) => [({ status: "派单状态", currentNode: "当前节点", dispatchMode: "派单方式", dispatchTime: "派单时间", driverName: "司机姓名", vehicleId: "车牌号", trailerId: "挂车号", origin: "提箱地", destination: "装卸地", loadAddress: "还箱地", consignee: "收货人", arrivalTime: "到达时间", arrivalLocation: "到达地点", note: "备注", timeline: "运输节点记录" })[key] || key, value]) : [["派单状态", "待派单"]];
    return `<section class="detail-section"><h3>子任务 ${h(waybill.childSequence || "")} · ${h(waybill.waybillNo || "-")}</h3>${planDetailRows(waybillFields)}<h3>派单与执行信息</h3>${planDetailRows(dispatchFields)}</section>`;
  }).join("");
  $("#managerDetailContent").innerHTML = `
    <section class="detail-hero"><span>计划任务详情 · ${h(item.status)}</span><h2>${h(item.title)}</h2><p>${h(item.subtitle)}</p></section>
    <section class="detail-section"><h3>计划信息</h3>${planDetailRows(planFields)}</section>
    ${routeSections || `<section class="detail-section"><h3>线路信息</h3>${planDetailRows([["线路", "未关联线路"]])}</section>`}
    ${childSections || `<section class="detail-section"><h3>子任务明细</h3>${planDetailRows([["数据", "暂无子任务"]])}</section>`}`;
}

function renderRouteDetail(item) {
  const route = item.raw || {};
  const commissionType = route.commissionType === "rate" ? "按收入比例提成" : "固定金额提成";
  const commissionValue = route.commissionType === "rate" ? `${route.commissionValue || 0}%` : `¥${route.commissionValue || 0}`;
  const commissionAmount = route.commissionType === "rate" ? Number(route.estimatedRevenue || 0) * Number(route.commissionValue || 0) / 100 : Number(route.commissionValue || 0);
  const fields = [
    ["线路ID", route.id || item.id], ["线路编号", route.routeCode || route.id || item.id], ["线路名称", route.routeName || item.title], ["客户编号", route.customerId], ["客户名称", route.customerName],
    ["项目编号", route.projectId], ["项目名称", route.projectName], ["提箱地", route.origin], ["装卸地", route.destination],
    ["提箱点", route.pickupPoint], ["装货地", route.loadingPoint], ["卸货地", route.unloadingPoint], ["落箱点", route.dropoffPoint],
    ["途经点", route.viaPoints], ["里程（KM）", route.mileage], ["线路状态", route.routeState], ["单次预估收入（元）", route.estimatedRevenue],
    ["线路基础运价（元）", route.baseFreight], ["提成方式", commissionType], ["提成规则值", commissionValue],
    ["预计司机提成（元）", commissionAmount.toFixed(2)], ["提成规则说明", route.commissionRemark], ["线路专属车辆", route.defaultVehicle],
    ["常用司机", route.defaultDriver], ["备注", route.remark],
  ];
  setDetailEditAction("route", item.id, "编辑固定线路");
  $("#managerDetailContent").innerHTML = `<section class="detail-hero"><span>固定线路详情 · ${h(route.routeState || item.status)}</span><h2>${h(route.routeName || item.title)}</h2><p>${h(route.routeCode || route.id || item.id)} · ${h(route.origin || "-")} → ${h(route.destination || "-")}</p></section><section class="detail-section"><h3>线路完整资料</h3>${planDetailRows(fields)}</section><div class="detail-action-bar"><div><strong>需要调整线路资料？</strong><small>修改后将同步更新后台固定线路配置</small></div><button class="detail-edit-button" data-edit-route="${h(item.id)}" type="button"><i data-lucide="pencil"></i><span>编辑线路资料</span></button></div>`;
}

const dispatchFieldLabels = {
  id: "派单编号", waybillNo: "运单号", dispatchMode: "派单方式", orderDate: "接单日期", planTaskId: "计划任务ID", planTaskNo: "计划任务编号",
  taskType: "任务类型", customerId: "客户编号", customerName: "客户名称", projectId: "项目编号", projectName: "项目名称", routeId: "线路编号",
  routeName: "线路名称", origin: "提箱地", destination: "装卸地", loadAddress: "还箱地", consignee: "收货人", arrivalTime: "到达时间", arrivalLocation: "到达地点", dispatchTime: "派单时间", driverId: "司机编号",
  driverName: "司机姓名", phone: "联系电话", vehicleId: "车牌号", vehicleType: "车辆类型", trailerId: "挂车编号", status: "派单状态",
  currentNode: "当前节点", boxes: "箱信息", estimatedRevenue: "预估收入", commission: "司机提成", routeMileageSnapshot: "线路里程快照", pushed: "已推送",
  planExecutionDate: "计划执行日期", plannedBerthingTime: "计划靠台时间", note: "备注", timeline: "运输节点", photoAttachments: "节点附件", photos: "现场图片",
};

function dispatchDetailRows(raw, excluded = []) {
  const excludedFields = new Set(excluded);
  return Object.entries(raw || {}).filter(([key]) => !excludedFields.has(key)).map(([key, value]) => [dispatchFieldLabels[key] || planWaybillFieldLabels[key] || key, key === "dispatchMode" ? dispatchModeLabel(value) : value]);
}

function renderDispatchTimeline(raw) {
  const timeline = Array.isArray(raw.timeline) ? raw.timeline : [];
  const rows = timeline.map((entry, index) => [`${String(index + 1).padStart(2, "0")} · ${entry.node || "运输节点"}`, [entry.time, entry.desc, ...(entry.photos || [])].filter(Boolean).join(" · ")]);
  return `<section class="detail-section"><h3>运输节点记录</h3>${planDetailRows(rows.length ? rows : [["执行记录", "暂无运输节点"]])}</section>`;
}

function dispatchJobLocationRows(dispatch = {}, task = {}) {
  const route = moduleCatalog.route.items.find((entry) => entry.id === (dispatch.routeId || task.routeId))?.raw || {};
  const taskType = dispatch.taskType || task.taskType || route.taskType || "";
  const configured = window.DispatchTaskNodes?.profile?.(taskType)?.jobLocations || [];
  const saved = dispatch.jobLocations?.length ? dispatch.jobLocations : task.jobLocations?.length ? task.jobLocations : route.jobLocations || [];
  const defaults = [dispatch.origin || route.pickupPoint || route.origin, dispatch.destination || route.loadingPoint || route.unloadingPoint || route.destination, dispatch.loadAddress || task.returnPoint || route.dropoffPoint || route.destination];
  const locations = configured.length ? configured.map((location, index) => {
    const current = saved.find((item) => item.id === location.id || item.name === location.name);
    return { name: location.name, address: current?.address || defaults[index] || "待维护" };
  }) : saved;
  return locations.map((location, index) => [`${String(index + 1).padStart(2, "0")} · ${location.name || `作业地点${index + 1}`}`, location.address || "待维护"]);
}

function renderDispatchDetail(item) {
  const dispatch = dispatchRawForItem(item);
  const waybill = moduleCatalog.waybill.items.find((entry) => entry.id === (dispatch.waybillNo || item.subtitle));
  const task = waybill?.raw || {};
  const editable = ["待派单", "已派单", "运输中"].includes(dispatch.status || item.status);
  const coreFields = [
    ["派单编号", dispatch.id || item.id], ["运单号", dispatch.waybillNo || item.subtitle], ["计划任务编号", dispatch.planTaskNo || task.planTaskNo || task.planTaskId],
    ["客户 / 项目", [dispatch.customerName || task.customerName, dispatch.projectName || task.projectName].filter(Boolean).join(" / ")], ["任务类型", dispatch.taskType || task.taskType],
    ["派单方式", dispatchModeLabel(dispatch.dispatchMode)], ["派单状态", dispatch.status || item.status], ["当前节点", dispatch.currentNode], ["派单时间", dispatch.dispatchTime], ["消息推送", dispatch.pushed ? "已推送司机端" : "待推送"],
  ];
  const capacityFields = [
    ["运力归属", dispatch.capacityOwnershipSnapshot || "待确定"], ["司机", dispatch.driverName || "待分配"], ["司机所属单位", dispatch.driverOrganizationSnapshot || "待确定"], ["司机编号", dispatch.driverId], ["联系电话", dispatch.phone], ["车辆", dispatch.vehicleId || "待分配"],
    ["车辆所属单位", dispatch.vehicleOrganizationSnapshot || "待确定"], ["车辆类型", dispatch.vehicleType], ["挂车", dispatch.trailerId || "未绑定"], ["挂车所属单位", dispatch.trailerOrganizationSnapshot || "未绑定"], ["预估收入", dispatch.estimatedRevenue == null ? "-" : `¥${dispatch.estimatedRevenue}`],
    ["司机提成", dispatch.commission == null ? "-" : `¥${dispatch.commission}`], ["线路里程快照", dispatch.routeMileageSnapshot == null ? "-" : `${dispatch.routeMileageSnapshot} KM`],
  ];
  const routeFields = [["线路编号", dispatch.routeId || task.routeId], ["线路名称", dispatch.routeName || waybill?.subtitle], ["收货人", dispatch.consignee], ["到达时间", dispatch.arrivalTime], ["到达地点", dispatch.arrivalLocation], ["箱信息", dispatch.boxes || task.boxType], ["备注", dispatch.note]];
  const jobLocationRows = dispatchJobLocationRows(dispatch, task);
  const coreKeys = ["id", "waybillNo", "planTaskNo", "planTaskId", "customerName", "projectName", "taskType", "dispatchMode", "status", "currentNode", "dispatchTime", "pushed", "driverName", "driverId", "phone", "vehicleId", "vehicleType", "trailerId", "estimatedRevenue", "commission", "routeMileageSnapshot", "routeId", "routeName", "origin", "destination", "loadAddress", "jobLocations", "boxes", "note", "timeline"];
  const extras = dispatchDetailRows(dispatch, coreKeys);
  if (editable) setDetailEditAction("dispatch", dispatch.id || item.id, dispatch.status === "待派单" ? "分配司机和车辆" : "编辑派单");
  else $("#detailActionButton").hidden = true;
  $("#managerDetailContent").innerHTML = `<section class="detail-hero"><span>派单详情 · ${h(dispatch.status || item.status || "-")}</span><h2>${h(dispatch.waybillNo || item.subtitle || item.id)}</h2><p>${h(dispatch.routeName || item.title || "未指定线路")}</p></section><section class="detail-section"><h3>任务与派单信息</h3>${planDetailRows(coreFields)}</section><section class="detail-section"><h3>司机与车辆</h3>${planDetailRows(capacityFields)}</section><section class="detail-section"><h3>作业地点 · ${h(jobLocationRows.length)} 个</h3>${planDetailRows(jobLocationRows.length ? jobLocationRows : [["作业地点", "待维护"]])}</section><section class="detail-section"><h3>线路与箱信息</h3>${planDetailRows(routeFields)}</section>${renderDispatchTimeline(dispatch)}${extras.length ? `<section class="detail-section"><h3>其他后台字段</h3>${planDetailRows(extras)}</section>` : ""}${editable ? `<div class="detail-action-bar"><div><strong>${dispatch.status === "待派单" ? "任务等待分配运力" : "需要调整本次派单？"}</strong><small>保存后同步更新后台派单台账和关联运单</small></div><button class="detail-edit-button" data-edit-module="dispatch" data-edit-id="${h(dispatch.id || item.id)}" type="button"><i data-lucide="${dispatch.status === "待派单" ? "user-check" : "pencil"}"></i><span>${dispatch.status === "待派单" ? "分配司机与车辆" : "编辑派单"}</span></button></div>` : ""}`;
}

function renderDispatchManagementDetail(item) {
  const dispatch = item.raw?.dispatch || dispatchRawForItem(moduleCatalog.dispatch.items.find((entry) => entry.id === item.id) || item);
  const task = item.raw?.waybill || moduleCatalog.waybill.items.find((entry) => entry.id === dispatch.waybillNo)?.raw || {};
  const availableVehicles = moduleCatalog.capacity.items.filter((entry) => entry.id.startsWith("vehicle-") && entry.status === "闲置").length;
  const availableDrivers = moduleCatalog.capacity.items.filter((entry) => entry.id.startsWith("driver-") && entry.status === "闲置").length;
  setDetailEditAction("dispatch", dispatch.id || item.id, "分配司机和车辆");
  $("#managerDetailContent").innerHTML = `<section class="detail-hero"><span>待匹配任务 · ${h(item.status)}</span><h2>${h(dispatch.waybillNo || item.subtitle)}</h2><p>${h(dispatch.routeName || item.title)}</p></section><section class="detail-section"><h3>任务信息</h3>${planDetailRows(dispatchDetailRows(task))}</section><section class="detail-section"><h3>当前匹配情况</h3>${planDetailRows([["匹配状态", item.status], ["已选司机", dispatch.driverName || "待分配"], ["已选车辆", dispatch.vehicleId || "待分配"], ["可用司机", `${availableDrivers} 名`], ["可用车辆", `${availableVehicles} 台`]])}</section><section class="detail-section"><h3>派单后台字段</h3>${planDetailRows(dispatchDetailRows(dispatch, ["timeline"]))}</section><div class="detail-action-bar"><div><strong>为任务匹配运力</strong><small>选择司机与车辆后将生成正式派单并推送司机端</small></div><button class="detail-edit-button" data-edit-module="dispatch" data-edit-id="${h(dispatch.id || item.id)}" type="button"><i data-lucide="user-check"></i><span>分配司机与车辆</span></button></div>`;
}

function assetRecordId(moduleName, values) {
  const previous = state.entryOriginalRaw || {};
  if (moduleName === "vehicle") return values.plateNo || previous.plateNo;
  if (moduleName === "trailer") return previous.id || `TR-${Date.now()}`;
  if (moduleName === "driver") return previous.id || `SJ-${String(moduleCatalog.driver.items.length + 1001)}`;
  if (moduleName === "customer") return values.customerNo || previous.customerNo;
  return "";
}

function buildAssetRecord(moduleName, values) {
  const oldRaw = state.entryOriginalRaw || {};
  const raw = { ...oldRaw, ...values, id: assetRecordId(moduleName, values) || oldRaw.id };
  if (moduleName === "vehicle") {
    window.CapacityOwnership.normalizeResource(raw, "vehicle");
    raw.plateNo = values.plateNo;
    const status = values.vehicleState || "停用";
    return { id: raw.plateNo, title: values.vehicleType || "集装箱牵引车", subtitle: values.fleetName || values.fleet || "未设置车队", status, statusClass: sharedStatusClass(status), fields: [["运力归属", raw.capacityOwnership], ["所属单位", window.CapacityOwnership.organizationName(raw)], ["车队", values.fleetName || values.fleet || "-"], ["驾驶员", values.driver || "未绑定"], ["挂车", values.trailerId || "未绑定"], ["车架号", values.vin || "-"]], note: values.remark || "", raw };
  }
  if (moduleName === "trailer") {
    window.CapacityOwnership.normalizeResource(raw, "trailer");
    const status = values.trailerState || "停用";
    return { id: raw.id, title: values.plateNo, subtitle: values.trailerType || "挂车", status, statusClass: sharedStatusClass(status), fields: [["运力归属", raw.capacityOwnership], ["所属单位", window.CapacityOwnership.organizationName(raw)], ["挂车类型", values.trailerType || "-"], ["车架号", values.vin || "-"], ["所属车队", values.fleet || "-"], ["营运证号", values.permitNo || "-"]], note: values.remark || "", raw };
  }
  if (moduleName === "driver") {
    window.CapacityOwnership.normalizeResource(raw, "driver");
    const status = values.driverState || "停用";
    return { id: raw.id, title: values.name, subtitle: `${values.fleet || "未设置车队"} · ${values.phone || "-"}`, status, statusClass: sharedStatusClass(status), fields: [["运力归属", raw.capacityOwnership], ["所属单位", window.CapacityOwnership.organizationName(raw)], ["司机编号", raw.id], ["准驾车型", values.licenseClass || "-"], ["车辆", values.vehiclePlate || values.vehicle || "未绑定"], ["认证状态", certificationStatusLabel(values.certificationStatus)]], note: values.remark || "", raw };
  }
  if (moduleName === "customer") {
    raw.customerNo = values.customerNo || oldRaw.customerNo;
    const status = values.customerStatus || "启用";
    return { id: raw.customerNo, title: values.customerName, subtitle: `简称：${values.shortName || "-"}`, status, statusClass: sharedStatusClass(status), fields: [["单位编号", raw.customerNo], ["单位角色", values.businessRole || "客户"], ["客户类型", values.customerType || "-"], ["统一社会信用代码", values.creditCode || "-"], ["联系人", values.contactName || "-"], ["手机", values.mobile || "-"], ["结算周期", values.settlementCycle || "-"], ["默认装货地址", values.loadAddress || "-"]], note: values.remark || "", raw };
  }
  return null;
}

const detailFieldLabels = {
  id: "档案编号", plateNo: "车牌号码", trailerId: "默认挂车", fleet: "所属车队", fleetName: "车队名称", vehicleType: "车辆类型", vin: "车架号", engineNo: "发动机号",
  curbWeight: "整备质量（吨）", ratedLoad: "核定载质量（吨）", fuelConsumption: "百公里油耗（升）", registrationCertNo: "车辆登记证号", technicalLevel: "车辆技术等级",
  technicalLevelExpiry: "技术等级有效期", drivingLicenseNo: "行驶证号", drivingLicenseExpiry: "行驶证有效期", permitNo: "营运证号", operatingPermitExpiry: "营运证有效期",
  commercialInsuranceNo: "商业险单号", commercialInsuranceExpiry: "商业险有效期", mandatoryInsuranceNo: "强制险单号", mandatoryInsuranceExpiry: "强制险有效期",
  cargoInsuranceNo: "货物险单号", cargoInsuranceExpiry: "货物险有效期", inspectionDue: "审验到期", insuranceDue: "保险到期", attachments: "附件资料",
  name: "姓名", gender: "性别", idCard: "身份证号码", phone: "联系电话", address: "住址", emergencyContact: "紧急联系人", emergencyPhone: "紧急联系电话",
  entryDate: "入职日期", driverType: "司机类型", capacityOwnership: "运力归属", supplierName: "三方供应商", organizationName: "所属单位", businessRole: "单位角色", driverState: "司机状态", certificationStatus: "认证状态", licenseNo: "驾驶证号", licenseClass: "准驾车型",
  licenseIssueDate: "驾驶证发证日期", licenseExpiry: "驾驶证有效期", licenseAttachment: "驾驶证附件", qualificationNo: "从业资格证号", qualificationExpiry: "从业资格证有效期",
  qualificationAttachment: "从业资格证附件", bankCard: "银行卡号", bankName: "开户银行", vehiclePlate: "关联车辆", vehiclePlateNo: "关联车辆",
  trailerType: "挂车类型", ownership: "车辆所属", trailerState: "挂车状态", insuranceNo: "保险单号", customerNo: "单位编号", customerName: "单位全称",
  shortName: "简称", customerType: "客户类型", creditCode: "统一社会信用代码", customerStatus: "单位状态", contactName: "主要联系人", mobile: "手机",
  email: "邮箱", registeredAddress: "注册地址", loadAddress: "默认装货地址", unloadAddress: "默认卸货地址", settlementCycle: "结算周期", invoiceTitle: "开票抬头",
  taxNo: "税号", bankAccount: "银行账号", remark: "备注", driver: "驾驶员", vehicleState: "车辆状态",
};

function setDetailEditAction(moduleName, recordId, label) {
  const button = $("#detailActionButton");
  button.innerHTML = '<i data-lucide="pencil"></i>';
  button.setAttribute("aria-label", label);
  button.dataset.editModule = moduleName;
  button.dataset.editId = recordId;
}

function renderAssetDetail(moduleName, item) {
  const capacity = moduleName === "capacity";
  const sourceModule = capacity ? (item.id.startsWith("vehicle-") ? "vehicle" : "driver") : moduleName;
  const raw = item.raw || {};
  const definition = mobileFormDefinitions[sourceModule];
  const id = sourceModule === "vehicle" ? raw.plateNo || item.id.replace(/^vehicle-/, "")
    : sourceModule === "customer" ? raw.customerNo || item.id
      : sourceModule === "trailer" ? raw.id || item.id
        : raw.id || item.id.replace(/^driver-/, "");
  const sections = definition.sections.map((section) => {
    const rows = section.fields.map((field) => [field.label, field.type === "file" ? (raw[field.name] || "-") : raw[field.name] == null || raw[field.name] === "" ? "-" : fieldValueLabel(sourceModule, field, raw[field.name])]);
    return `<section class="detail-section"><h3>${h(section.title)}</h3>${planDetailRows(rows)}</section>`;
  }).join("");
  const knownFields = new Set(["id", ...definition.sections.flatMap((section) => section.fields.map((field) => field.name))]);
  const extras = Object.entries(raw).filter(([key]) => !knownFields.has(key));
  const extraRows = extras.map(([key, value]) => [detailFieldLabels[key] || key, value]);
  const idLabel = sourceModule === "vehicle" ? "车牌号码" : sourceModule === "trailer" ? "挂车档案编号" : sourceModule === "customer" ? "客户编号" : "司机编号";
  setDetailEditAction(sourceModule, id, `编辑${moduleCatalog[sourceModule].title}`);
  const summaryRows = capacity ? item.fields : [];
  $("#managerDetailContent").innerHTML = `<section class="detail-hero"><span>${h(capacity ? "运力详情" : `${moduleCatalog[sourceModule].title}详情`)} · ${h(item.status || "-")}</span><h2>${h(item.title)}</h2><p>${h(item.subtitle || item.id)}</p></section>${capacity ? `<section class="detail-section"><h3>当前运力状态</h3>${planDetailRows([["档案类型", sourceModule === "vehicle" ? "车辆" : "司机"], ["调度状态", item.status], ...summaryRows])}</section>` : ""}<section class="detail-section"><h3>档案标识</h3>${planDetailRows([[idLabel, id], ["档案状态", item.status]])}</section>${sections}${extraRows.length ? `<section class="detail-section"><h3>其他后台字段</h3>${planDetailRows(extraRows)}</section>` : ""}<div class="detail-action-bar"><div><strong>需要调整档案资料？</strong><small>保存后将同步更新后台${h(moduleCatalog[sourceModule].title)}资料</small></div><button class="detail-edit-button" data-edit-module="${h(sourceModule)}" data-edit-id="${h(id)}" type="button"><i data-lucide="pencil"></i><span>编辑档案资料</span></button></div>`;
}

const MOBILE_RECORDS_KEY = "container-logistics-manager-mobile-records-v1";
const AUTO_SETTINGS_KEY = "container-logistics-manager-auto-settings-v1";

function fieldValueLabel(moduleName, field, value) {
  if (field.type !== "select") return value;
  const option = (field.options || []).find((item) => String(Array.isArray(item) ? item[0] : item) === String(value));
  return Array.isArray(option) ? option[1] : option || value;
}

function genericDetailFields(moduleName, values) {
  return mobileFormDefinitions[moduleName].sections.flatMap((section) => section.fields)
    .filter((field) => field.type !== "file" && values[field.name] !== "")
    .map((field) => [field.label.replace(/（.*?）/g, ""), fieldValueLabel(moduleName, field, values[field.name])]);
}

function collectContainers() {
  return $$("#mobileContainerList [data-repeat-card=container]").map((card) => ({
    containerNo: card.querySelector('[name="containerNo"]').value.trim(),
    sealNo: card.querySelector('[name="sealNo"]').value.trim(),
    containerType: card.querySelector('[name="containerType"]').value,
    pickupPoint: card.querySelector('[name="pickupPoint"]').value.trim(),
    returnPoint: card.querySelector('[name="returnPoint"]').value.trim(),
  }));
}

function collectFees(type) {
  return $$(`#mobile${type === "receivable" ? "Receivable" : "Payable"}List [data-repeat-card=fee]`).map((card) => {
    const quantity = Number(card.querySelector(`[name="${type}Quantity"]`).value) || 0;
    const price = Number(card.querySelector(`[name="${type}Price"]`).value) || 0;
    return {
      target: card.querySelector(`[name="${type}Target"]`).value,
      unit: card.querySelector(`[name="${type}Unit"]`).value.trim(),
      kind: card.querySelector(`[name="${type}Kind"]`).value.trim(), quantity, price,
      settled: Number(card.querySelector(`[name="${type}Settled"]`).value) || 0,
      invoice: card.querySelector(`[name="${type}Invoice"]`).value, amount: quantity * price,
    };
  });
}

function persistCreatedRecord(moduleName, item) {
  let records = {};
  try { records = JSON.parse(localStorage.getItem(MOBILE_RECORDS_KEY) || "{}") || {}; } catch (error) { records = {}; }
  records[moduleName] = Array.isArray(records[moduleName]) ? records[moduleName] : [];
  records[moduleName] = [item, ...records[moduleName].filter((record) => record.id !== item.id)];
  localStorage.setItem(MOBILE_RECORDS_KEY, JSON.stringify(records));
}

function loadCreatedRecords() {
  let records = {};
  try { records = JSON.parse(localStorage.getItem(MOBILE_RECORDS_KEY) || "{}") || {}; } catch (error) { records = {}; }
  Object.entries(records).forEach(([moduleName, items]) => {
    if (!moduleCatalog[moduleName] || !Array.isArray(items)) return;
    items.slice().reverse().forEach((item) => {
      if (!moduleCatalog[moduleName].items.some((existing) => existing.id === item.id)) moduleCatalog[moduleName].items.unshift(item);
    });
  });
}

function updateWorkbenchCounts() {
  const pendingDispatchCount = moduleCatalog.dispatch.items.filter((item) => item.status === "待派单").length;
  const transitCount = moduleCatalog.dispatch.items.filter((item) => item.status === "运输中").length;
  const idleVehicleCount = moduleCatalog.capacity.items.filter((item) => item.status === "闲置").length;
  const alertCount = moduleCatalog.reminder.items.filter((item) => item.status === "已过期").length + allMessages().filter((item) => item.unread && item.type === "warning").length;
  const labels = {
    waybill: `${moduleCatalog.waybill.items.length} 条记录`, plan: `${moduleCatalog.plan.items.length} 个任务`, route: `${moduleCatalog.route.items.length} 条线路`, "dispatch-management": `${moduleCatalog["dispatch-management"].items.filter((item) => item.status === "待匹配").length} 条待匹配`,
    dispatch: `${pendingDispatchCount} 条待派单`,
    capacity: `${moduleCatalog.capacity.items.length} 条运力`, vehicle: `${moduleCatalog.vehicle.items.length} 台车辆`, trailer: `${moduleCatalog.trailer.items.length} 台挂车`, driver: `${moduleCatalog.driver.items.length} 名司机`,
    customer: `${moduleCatalog.customer.items.length} 家往来单位`, reminder: `${moduleCatalog.reminder.items.length} 项待处理`,
  };
  Object.entries(labels).forEach(([moduleName, label]) => {
    const node = $(`#moduleGrid [data-open-module="${moduleName}"] small`);
    if (node) node.textContent = label;
  });
  $("#workbenchPendingCount").textContent = pendingDispatchCount;
  $("#workbenchTransitCount").textContent = transitCount;
  $("#workbenchIdleCount").textContent = idleVehicleCount;
  $("#workbenchAlertCount").textContent = alertCount;
}

function buildDispatchRecord(values) {
  const oldRaw = state.entryOriginalRaw || {};
  const waybill = moduleCatalog.waybill.items.find((item) => item.id === values.waybillId);
  const task = waybill?.raw || {};
  const route = moduleCatalog.route.items.find((item) => item.id === (values.routeId || task.routeId || oldRaw.routeId)) || moduleCatalog.route.items.find((item) => item.title === waybill?.subtitle);
  const routeRaw = route?.raw || {};
  const project = (window.AdminDataBridge?.read?.()?.routeAccounts || []).find((item) => item.projectId === values.projectId);
  const driver = moduleCatalog.driver.items.find((item) => item.id === values.driverId);
  const vehicle = moduleCatalog.vehicle.items.find((item) => item.id === values.vehicleId);
  const driverRaw = driver?.raw || {};
  const vehicleRaw = vehicle?.raw || {};
  const dispatchTime = new Date().toLocaleString("zh-CN", { hour12: false });
  const wasPending = !state.entryEditId || (oldRaw.status || "待派单") === "待派单";
  const commission = routeRaw.commissionType === "rate" ? Number(routeRaw.estimatedRevenue || 0) * Number(routeRaw.commissionValue || 0) / 100 : Number(routeRaw.commissionValue || oldRaw.commission || 0);
  const valueOrFallback = (name, fallback) => Object.prototype.hasOwnProperty.call(values, name) ? values[name] : fallback;
  const boxType = valueOrFallback("boxType", task.boxType || oldRaw.boxType || "40HQ");
  const boxNo1 = valueOrFallback("boxNo1", task.boxNo1 || oldRaw.boxNo1 || "-") || "-";
  const sealNo1 = valueOrFallback("sealNo1", task.sealNo1 || oldRaw.sealNo1 || "-") || "-";
  const boxNo2 = valueOrFallback("boxNo2", task.boxNo2 || oldRaw.boxNo2 || "-") || "-";
  const sealNo2 = valueOrFallback("sealNo2", task.sealNo2 || oldRaw.sealNo2 || "-") || "-";
  const boxes = [
    [boxNo1 === "-" ? "" : boxNo1, boxType].filter(Boolean).join(" / "),
    ...(boxNo2 !== "-" || sealNo2 !== "-" ? [[boxNo2 === "-" ? "" : boxNo2, boxType].filter(Boolean).join(" / ")] : []),
  ].filter(Boolean).join("、") || oldRaw.boxes || task.boxType || "待装箱";
  const id = oldRaw.id || `PD-M-${Date.now()}`;
  const timeline = Array.isArray(oldRaw.timeline) ? [...oldRaw.timeline] : [];
  timeline.push(wasPending
    ? { node: "已派单", time: dispatchTime, desc: "管理端手动分配司机和车辆，派单已同步至司机端", photos: [] }
    : { node: "派单调整", time: dispatchTime, desc: `管理端将运力调整为 ${driver?.title || values.driverId} / ${vehicle?.id || values.vehicleId}，变更已同步司机端`, photos: [] });
  const taskType = task.taskType || oldRaw.taskType || "提空装货";
  const raw = {
    ...oldRaw, id, dispatchMode: "manual", waybillNo: waybill?.id || values.waybillId, planTaskId: task.planTaskId || oldRaw.planTaskId,
    planTaskNo: task.planTaskNo || task.planTaskId || oldRaw.planTaskNo, taskType,
    customerId: task.customerId || oldRaw.customerId, customerName: task.customerName || waybill?.title || oldRaw.customerName,
    projectId: values.projectId || task.projectId || routeRaw.projectId || oldRaw.projectId, projectName: project?.projectName || task.projectName || routeRaw.projectName || oldRaw.projectName,
    orderDate: task.orderDate || oldRaw.orderDate || localDate(), routeId: route?.id || oldRaw.routeId, routeName: route?.title || oldRaw.routeName || waybill?.subtitle,
    origin: routeRaw.pickupPoint || routeRaw.origin || oldRaw.origin, destination: routeRaw.unloadingPoint || routeRaw.loadingPoint || routeRaw.destination || oldRaw.destination, loadAddress: routeRaw.dropoffPoint || task.returnPoint || oldRaw.loadAddress,
    dispatchTime: wasPending ? dispatchTime : oldRaw.dispatchTime || dispatchTime, driverId: driver?.id || values.driverId, driverName: driver?.title || driverRaw.name || oldRaw.driverName,
    phone: driverRaw.phone || oldRaw.phone, vehicleId: vehicle?.id || values.vehicleId, vehicleType: values.vehicleType || vehicleRaw.energyType || oldRaw.vehicleType || "燃油车",
    trailerId: values.trailerId || vehicleRaw.trailerId || oldRaw.trailerId || "", status: wasPending ? "已派单" : oldRaw.status || "已派单",
    currentNode: wasPending ? "待提货" : oldRaw.currentNode || "待提货", boxes, estimatedRevenue: Number(routeRaw.estimatedRevenue ?? oldRaw.estimatedRevenue ?? 0),
    commission, routeMileageSnapshot: routeRaw.mileage === "" || routeRaw.mileage == null ? oldRaw.routeMileageSnapshot ?? null : Number(routeRaw.mileage),
    boxType, boxNo1, sealNo1, boxNo2, sealNo2,
    jobLocations: (window.DispatchTaskNodes?.profile?.(taskType)?.jobLocations || []).map((location) => ({ id: location.id, name: location.name, address: String(document.querySelector(`#managerEntryForm [name="jobLocation_${CSS.escape(location.id)}"]`)?.value || "").trim() })),
    consignee: values.consignee || "", arrivalTime: values.arrivalTime || "", arrivalLocation: values.arrivalLocation || "", note: values.note || "", pushed: true, timeline,
  };
  const trailerRaw = moduleCatalog.trailer.items.find((item) => item.id === raw.trailerId)?.raw;
  const ownership = window.CapacityOwnership.groupSnapshot([
    { ...driverRaw, role: "司机", name: raw.driverName },
    { ...vehicleRaw, role: "车辆", name: raw.vehicleId },
    trailerRaw && { ...trailerRaw, role: "挂车", name: trailerRaw.plateNo },
  ]);
  Object.assign(raw, {
    capacityOwnershipSnapshot: ownership.type,
    capacityOwnershipDetailSnapshot: ownership.resources,
    capacityOwnershipTooltipSnapshot: ownership.tooltip,
    driverOrganizationSnapshot: window.CapacityOwnership.organizationName(driverRaw),
    vehicleOrganizationSnapshot: window.CapacityOwnership.organizationName(vehicleRaw),
    trailerOrganizationSnapshot: trailerRaw ? window.CapacityOwnership.organizationName(trailerRaw) : "未绑定",
    carrierTypeSnapshot: vehicleRaw.capacityOwnership,
    carrierUnitSnapshot: window.CapacityOwnership.organizationName(vehicleRaw),
  });
  if (waybill?.raw) Object.assign(waybill.raw, {
    boxType, boxNo1, sealNo1, boxNo2, sealNo2,
    containers: [
      { boxNo: boxNo1, containerNo: boxNo1, sealNo: sealNo1, boxType, containerType: boxType },
      ...(boxNo2 !== "-" || sealNo2 !== "-" ? [{ boxNo: boxNo2, containerNo: boxNo2, sealNo: sealNo2, boxType, containerType: boxType }] : []),
    ],
  });
  if (waybill?.raw) Object.assign(waybill.raw, { dispatchDate: raw.dispatchTime.slice(0, 10), plateNo: raw.vehicleId, driverId: raw.driverId, driverName: raw.driverName, trailerId: raw.trailerId, routeMileageSnapshot: raw.routeMileageSnapshot });
  return {
    id, title: raw.routeName || "未指定线路", subtitle: raw.waybillNo, status: raw.status, statusClass: sharedStatusClass(raw.status),
    fields: [["运力归属", raw.capacityOwnershipSnapshot], ["司机", raw.driverName || "待分配"], ["车辆", raw.vehicleId || "待分配"], ["挂车", raw.trailerId || "未绑定"], ["当前节点", raw.currentNode], ["派单方式", dispatchModeLabel(raw.dispatchMode)]],
    note: raw.note || "已推送至司机端", raw,
  };
}

function createMobileRecord(moduleName, values) {
  if (moduleName === "plan") {
    const route = moduleCatalog.route.items.find((item) => item.id === values.routeId);
    const quantity = Math.max(1, Math.min(100, Number(values.quantity) || 1));
    const planId = `PT-${Date.now()}`;
    const planNo = `JH-${String(values.planExecutionDate || localDate()).slice(0, 10).replaceAll("-", "")}-${String(moduleCatalog.plan.items.length + 1).padStart(3, "0")}`;
    const generated = Array.from({ length: quantity }, (_, index) => {
      const waybillNo = nextBusinessId("WB", moduleCatalog.waybill.items.length + index);
      const raw = { waybillNo, planTaskId: planId, planTaskNo: planNo, orderDate: String(values.planExecutionDate || localDate()).slice(0, 10), planExecutionDate: values.planExecutionDate, plannedBerthingTime: values.plannedBerthingTime, executionTime: values.plannedBerthingTime, routeId: values.routeId, customerName: values.customerName, projectName: values.projectName, boxType: values.boxType, taskType: values.taskType, autoDispatch: false, dispatchAdvanceMinutes: 0 };
      const item = { id: waybillNo, title: values.customerName, subtitle: route?.title || "未指定线路", status: "草拟", statusClass: "warning", fields: [["接单日期", raw.orderDate], ["计划任务", planNo], ["箱型", values.boxType], ["任务类型", values.taskType], ["装卸地址", route?.raw?.loadingPoint || route?.raw?.origin || "-"]], note: values.remark || "移动端创建计划任务", raw };
      moduleCatalog.waybill.items.unshift(item);
      const dispatchId = `PD-${Date.now()}-${index}`;
      const dispatchRaw = { id: dispatchId, waybillNo, planTaskId: planId, planTaskNo: planNo, planExecutionDate: values.planExecutionDate, plannedBerthingTime: values.plannedBerthingTime, executionTime: values.plannedBerthingTime, taskType: values.taskType, customerName: values.customerName, projectName: values.projectName, orderDate: raw.orderDate, routeId: values.routeId, routeName: route?.title || "未指定线路", origin: route?.raw?.origin || "", destination: route?.raw?.destination || "", dispatchMode: "pending", dispatchTime: "", driverId: "", driverName: "待分配", phone: "-", vehicleId: "", trailerId: "", status: "待派单", currentNode: "待派单", boxes: values.boxType, note: "计划任务已进入待派发池", pushed: false, timeline: [] };
      const dispatchItem = { id: dispatchId, title: dispatchRaw.routeName, subtitle: waybillNo, status: "待派单", statusClass: "warning", fields: [["司机", "待分配"], ["车辆", "待分配"], ["挂车", "未绑定"], ["当前节点", "待派单"], ["派单方式", "待分配"], ["派单时间", "-"]], note: dispatchRaw.note, raw: dispatchRaw };
      moduleCatalog.dispatch.items.unshift(dispatchItem);
      persistCreatedRecord("waybill", item);
      persistCreatedRecord("dispatch", dispatchItem);
      publishMobileRecord("waybill", item);
      publishMobileRecord("dispatch", dispatchItem);
      return item;
    });
    return { id: planId, title: planNo, subtitle: `${values.customerName} · ${values.projectName}`, status: "待派单", statusClass: "warning", fields: [["计划执行日期", values.planExecutionDate], ["任务数量", `${generated.length} 条`], ["线路", route?.title || "-"], ["任务类型", values.taskType]], note: values.remark || "计划已生成子运单", raw: { ...values, planId, planNo, waybills: generated.map((item) => item.id) } };
  }
  if (moduleName === "waybill") {
    const route = moduleCatalog.route.items.find((item) => item.id === values.routeId);
    const customer = moduleCatalog.customer.items.find((item) => item.id === values.customerId);
    const containers = collectContainers();
    const receivable = collectFees("receivable");
    const payable = collectFees("payable");
    const receivableTotal = receivable.reduce((sum, item) => sum + item.amount, 0);
    const payableTotal = payable.reduce((sum, item) => sum + item.amount, 0);
    return {
      id: values.waybillNo, title: customer?.title || "未选择客户", subtitle: route?.title || "未选择线路", status: "草拟", statusClass: "warning",
      fields: [["接单日期", values.orderDate], ["提单号", values.billNo || "-"], ["箱型", containers.map((item) => item.containerType).join("、")], ["装卸地址", values.loadAddress], ["需要回单", values.needReceipt ? "是" : "否"], ["应收金额", `¥${receivableTotal.toFixed(2)}`], ["应付金额", `¥${payableTotal.toFixed(2)}`], ["预计利润", `¥${(receivableTotal - payableTotal).toFixed(2)}`]],
      note: values.remark || "移动端新建运单", raw: { ...values, containers, receivable, payable },
    };
  }
  if (moduleName === "route") {
    const customer = moduleCatalog.customer.items.find((item) => item.id === values.customerId);
    const accounts = window.AdminDataBridge?.read?.()?.routeAccounts || [];
    const account = accounts.find((item) => item.customerId === values.customerId && item.projectId === values.projectId);
    const project = account?.projectName || values.projectName || values.projectId;
    const existing = state.entryEditId ? moduleCatalog.route.items.find((item) => item.id === state.entryEditId) : null;
    const oldRaw = existing?.raw || {};
    const sequence = moduleCatalog.route.items.length + 1;
    const routeCode = oldRaw.routeCode || `XL-M${String(sequence).padStart(4, "0")}`;
    const id = existing?.id || `XL-M-${Date.now()}`;
    const raw = { ...oldRaw, ...values, id, routeCode, mileage: Number(values.mileage) || 0, estimatedRevenue: Number(values.estimatedRevenue) || 0, baseFreight: Number(values.baseFreight) || 0, commissionValue: Number(values.commissionValue) || 0, customerName: customer?.title || account?.customerName || values.customerId, projectName: project };
    const typeText = raw.commissionType === "rate" ? "按收入比例提成" : "固定金额提成";
    return { id, title: values.routeName, subtitle: `${routeCode} · ${values.origin} → ${values.destination}`, status: values.routeState, statusClass: values.routeState === "启用" ? "success" : "muted", fields: [["线路编号", routeCode], ["客户 / 项目", `${raw.customerName} / ${raw.projectName}`], ["起运地 → 目的地", `${values.origin} → ${values.destination}`], ["里程", `${raw.mileage} KM`], ["预估收入", `¥${values.estimatedRevenue}`], ["提成方式", typeText]], note: values.remark || values.commissionRemark || "", raw };
  }
  if (moduleName === "dispatch") {
    return buildDispatchRecord(values);
  }
  if (["vehicle", "trailer", "driver", "customer"].includes(moduleName)) return buildAssetRecord(moduleName, values);
  return null;
}

function hasDuplicateRecord(moduleName, values) {
  const editingId = state.entryEditId;
  if (moduleName === "vehicle" && moduleCatalog.vehicle.items.some((item) => item.id !== editingId && item.id === values.plateNo)) return "车牌号码已存在";
  if (moduleName === "trailer" && moduleCatalog.trailer.items.some((item) => item.id !== editingId && item.raw?.plateNo === values.plateNo)) return "挂车车牌已存在";
  if (moduleName === "driver" && moduleCatalog.driver.items.some((item) => item.id !== editingId && item.raw?.idCard === values.idCard)) return "身份证号码已存在";
  if (moduleName === "customer" && moduleCatalog.customer.items.some((item) => item.id !== editingId && item.id.toLowerCase() === values.customerNo.toLowerCase())) return "客户编号已存在";
  return "";
}

function publishMobileRecord(moduleName, item) {
  if (!window.AdminDataBridge || !item) return;
  const snapshot = window.AdminDataBridge.read() || {};
  const raw = { ...(item.raw || {}) };
  if (moduleName === "waybill") { raw.waybillNo = raw.waybillNo || item.id; snapshot.waybills = [raw, ...(snapshot.waybills || []).filter((entry) => entry.waybillNo !== raw.waybillNo)]; }
  if (moduleName === "route") { raw.id = raw.id || item.id; raw.routeName = raw.routeName || item.title; snapshot.fixedRoutes = [raw, ...(snapshot.fixedRoutes || []).filter((entry) => entry.id !== raw.id)]; }
  if (moduleName === "dispatch") {
    raw.id = raw.id || item.id;
    raw.waybillNo = raw.waybillNo || item.subtitle;
    snapshot.dispatches = [raw, ...(snapshot.dispatches || []).filter((entry) => entry.id !== raw.id)];
    const sharedWaybills = Array.isArray(snapshot.waybills) ? snapshot.waybills : moduleCatalog.waybill.items.map((entry) => ({ ...(entry.raw || {}), waybillNo: entry.raw?.waybillNo || entry.id }));
    snapshot.waybills = sharedWaybills.map((waybill) => waybill.waybillNo === raw.waybillNo ? {
      ...waybill, dispatchDate: String(raw.dispatchTime || "").slice(0, 10), plateNo: raw.vehicleId || "", driverId: raw.driverId || "",
      driverName: raw.driverName || "", trailerId: raw.trailerId || "", routeMileageSnapshot: raw.routeMileageSnapshot,
      boxType: raw.boxType || waybill.boxType, boxNo1: raw.boxNo1 || waybill.boxNo1, sealNo1: raw.sealNo1 || waybill.sealNo1,
      boxNo2: raw.boxNo2 || waybill.boxNo2, sealNo2: raw.sealNo2 || waybill.sealNo2,
    } : waybill);
  }
  if (moduleName === "vehicle") { raw.plateNo = raw.plateNo || item.id; const oldPlate = state.entryOriginalRaw?.plateNo; snapshot.vehicles = [raw, ...(snapshot.vehicles || []).filter((entry) => entry.plateNo !== raw.plateNo && entry.plateNo !== oldPlate)]; }
  if (moduleName === "trailer") { raw.id = raw.id || item.id; const oldId = state.entryOriginalRaw?.id; snapshot.trailers = [raw, ...(snapshot.trailers || []).filter((entry) => entry.id !== raw.id && entry.id !== oldId)]; }
  if (moduleName === "driver") { raw.id = raw.id || item.id; const oldId = state.entryOriginalRaw?.id; snapshot.drivers = [raw, ...(snapshot.drivers || []).filter((entry) => entry.id !== raw.id && entry.id !== oldId)]; }
  if (moduleName === "customer") {
    raw.customerNo = raw.customerNo || item.id;
    const oldNo = state.entryOriginalRaw?.customerNo;
    snapshot.customers = [raw, ...(snapshot.customers || []).filter((entry) => entry.customerNo !== raw.customerNo && entry.customerNo !== oldNo)];
    localStorage.setItem(window.AdminDataBridge.CUSTOMER_STORAGE_KEY, JSON.stringify(snapshot.customers));
  }
  window.AdminDataBridge.write(snapshot);
}

function saveEntry(event) {
  event.preventDefault();
  const form = $("#managerEntryForm");
  if (!form.checkValidity()) { form.querySelectorAll("select:invalid").forEach((select) => select.classList.add("touched")); form.reportValidity(); return; }
  const formData = new FormData(form);
  const values = Object.fromEntries([...formData.entries()]
    .filter(([, value]) => !(value instanceof File) || Boolean(value.name))
    .map(([key, value]) => [key, value instanceof File ? value.name : String(value).trim()]));
  if (state.entryModule === "dispatch" && state.entryEditId) values.waybillId = state.entryOriginalRaw?.waybillNo || state.entryOriginalRaw?.waybillId || "";
  values.needReceipt = form.elements.needReceipt?.checked || false;
  values.receivedReceipt = form.elements.receivedReceipt?.checked || false;
  if (["vehicle", "trailer", "driver"].includes(state.entryModule)) {
    const type = window.CapacityOwnership.normalizeType(values.capacityOwnership);
    if (type === "三方") {
      const supplier = window.CapacityOwnership.findSupplier(values.supplierName);
      if (!supplier || supplier.status !== "启用") { showToast("请从客户管理选择已启用的三方供应商"); return; }
      values.supplierId = supplier.id;
      values.supplierName = supplier.name;
    } else {
      values.supplierId = "";
      values.supplierName = "";
    }
  }
  if (state.entryModule === "dispatch") {
    const driver = moduleCatalog.driver.items.find((item) => item.id === values.driverId)?.raw;
    const vehicle = moduleCatalog.vehicle.items.find((item) => item.id === values.vehicleId)?.raw;
    const trailerId = values.trailerId || vehicle?.trailerId;
    const trailer = moduleCatalog.trailer.items.find((item) => item.id === trailerId)?.raw;
    if (!driver || !vehicle || Boolean(trailerId && !trailer) || !window.CapacityOwnership.isCompatible([driver, vehicle, trailer].filter(Boolean), { missingRequired: Boolean(trailerId && !trailer) })) {
      showToast("司机、车辆和挂车必须属于同一运力归属");
      return;
    }
  }
  if (state.entryModule === "auto") {
    const settings = { ...values, enabled: form.elements.enabled.checked, retry: form.elements.retry.checked };
    localStorage.setItem(AUTO_SETTINGS_KEY, JSON.stringify(settings));
    closeEntry();
    showToast("自动派单设置已保存");
    return;
  }
  const duplicate = hasDuplicateRecord(state.entryModule, values);
  if (duplicate) { showToast(duplicate); return; }
  const dispatchWasPending = state.entryModule === "dispatch" && (!state.entryEditId || state.entryOriginalRaw?.status === "待派单");
  const item = createMobileRecord(state.entryModule, values);
  if (!item) return;
  const moduleName = state.entryModule;
  const editing = Boolean(state.entryEditId);
  const existingIndex = editing ? moduleCatalog[moduleName].items.findIndex((entry) => entry.id === state.entryEditId) : -1;
  if (existingIndex >= 0) moduleCatalog[moduleName].items.splice(existingIndex, 1, item);
  else moduleCatalog[moduleName].items.unshift(item);
  persistCreatedRecord(state.entryModule, item);
  publishMobileRecord(state.entryModule, item);
  closeEntry();
  state.search = "";
  state.moduleFilter = "全部";
  renderModule();
  if (moduleName === "dispatch") {
    rebuildDispatchManagementCatalog();
    rebuildCapacityCatalog(window.AdminDataBridge?.read?.()?.dispatches || moduleCatalog.dispatch.items.map((entry) => dispatchRawForItem(entry)));
    if (editing && state.currentModule === "dispatch-management") {
      openModule("dispatch");
      openDetail(item);
    } else if (editing) openDetail(item);
  }
  if (["vehicle", "driver"].includes(moduleName)) rebuildCapacityCatalog(window.AdminDataBridge?.read?.()?.dispatches || []);
  if (editing && ["route", "vehicle", "trailer", "driver", "customer"].includes(moduleName)) {
    if (state.currentModule === "capacity") {
      rebuildCapacityCatalog(window.AdminDataBridge?.read?.()?.dispatches || []);
      const capacityId = moduleName === "vehicle" ? `vehicle-${item.raw?.plateNo || item.id}` : `driver-${item.raw?.id || item.id}`;
      const capacityItem = moduleCatalog.capacity.items.find((entry) => entry.id === capacityId);
      openDetail(capacityItem || item);
    } else openDetail(item);
  }
  updateWorkbenchCounts();
  showToast(moduleName === "dispatch" ? (dispatchWasPending ? "派单成功，已推送至司机移动端" : "派单修改已保存并同步") : `${moduleCatalog[moduleName].title}已保存`);
}

function renderMessages() {
  const list = allMessages().filter((item) => state.messageFilter === "all" || item.type === state.messageFilter);
  $("#messageList").innerHTML = list.map((item) => `<button class="message-item ${item.unread ? "unread" : ""}" data-message-id="${item.id}" type="button"><span class="message-icon ${item.style}"><i data-lucide="${item.icon}"></i></span><span class="message-copy"><strong>${h(item.title)}</strong><p>${h(item.desc)}</p><time>${h(item.time)}</time></span></button>`).join("");
  refreshIcons();
}

function openAutoControl() {
  openModule("auto");
  let settingText = "新任务进入后立即执行";
  try {
    const settings = JSON.parse(localStorage.getItem(AUTO_SETTINGS_KEY) || "null");
    if (settings?.triggerMode === "interval") settingText = `每 ${settings.intervalMinutes || 10} 分钟识别待派单任务`;
  } catch (error) { /* use default text */ }
  $("#moduleList").insertAdjacentHTML("afterbegin", `<section class="auto-control"><span><i data-lucide="wand-sparkles"></i></span><div><strong>自动执行中</strong><small>${h(settingText)}</small></div><button data-auto-run type="button">立即执行</button></section>`);
  refreshIcons();
}

$("#managerBottomNav").addEventListener("click", (event) => {
  const button = event.target.closest("[data-view]");
  if (button) switchView(button.dataset.view);
});

$("#reportsView").addEventListener("change", (event) => {
  reportState.capacityFilter = null;
  if (event.target.id === "reportThreshold") localStorage.setItem("container-logistics-dashboard-near-complete", event.target.value);
  if (event.target.id === "reportCustomer") {
    $("#reportProject").value = "";
    $("#reportRoute").value = "";
  } else if (event.target.id === "reportProject") {
    $("#reportRoute").value = "";
  }
  renderReports();
});
$("#reportRefreshButton").addEventListener("click", () => { renderReports(); showToast("报表数据已刷新"); });
$("#reportsView").addEventListener("click", (event) => {
  const capacityButton = event.target.closest("[data-report-capacity-scope]");
  if (capacityButton) {
    const next = { scope: capacityButton.dataset.reportCapacityScope, status: capacityButton.dataset.reportCapacityStatus };
    reportState.capacityFilter = reportState.capacityFilter?.scope === next.scope && reportState.capacityFilter.status === next.status ? null : next;
    renderReports();
    return;
  }
  const button = event.target.closest("[data-report-amount]");
  if (!button) return;
  reportState.amountDimension = button.dataset.reportAmount;
  $$("#reportsView [data-report-amount]").forEach((item) => {
    const active = item === button;
    item.classList.toggle("active", active);
    item.setAttribute("aria-pressed", String(active));
  });
  renderReports();
});

document.addEventListener("click", (event) => {
  const moduleButton = event.target.closest("[data-open-module]");
  const tabTarget = event.target.closest("[data-tab-target]");
  const quickAction = event.target.closest("[data-quick-action]");
  const profileAction = event.target.closest("[data-profile-action]");
  const editRoute = event.target.closest("[data-edit-route]");
  if (editRoute) {
    openEntry("route", editRoute.dataset.editRoute);
    return;
  }
  const editAsset = event.target.closest("[data-edit-module]");
  if (editAsset && editAsset.id !== "detailActionButton") {
    openEntry(editAsset.dataset.editModule, editAsset.dataset.editId);
    return;
  }
  if (moduleButton) {
    const name = moduleButton.dataset.openModule;
    if (name === "auto") openAutoControl(); else openModule(name, moduleButton.dataset.filter || "全部");
  }
  if (tabTarget) switchView(tabTarget.dataset.tabTarget);
  if (quickAction) {
    const name = quickAction.dataset.quickAction;
    openModule(name);
    openEntry(name);
  }
  if (profileAction) openProfileSubpage(profileAction.dataset.profileAction);
});

document.addEventListener("keydown", (event) => {
  const entryOpen = $("#managerEntryView").classList.contains("open");
  const profileOpen = $("#managerProfileSubpage").classList.contains("open");
  if (event.key === "Escape") {
    if (profileOpen) closeProfileSubpage();
    else if (entryOpen) closeEntry();
    return;
  }
  if (event.key !== "Tab" || !entryOpen) return;
  const focusable = [...$("#managerEntryView").querySelectorAll('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')].filter((item) => item.getClientRects().length);
  if (!focusable.length) { event.preventDefault(); $("#managerEntryView").focus(); return; }
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && (document.activeElement === first || !$("#managerEntryView").contains(document.activeElement))) { event.preventDefault(); last.focus(); }
  else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
});
window.addEventListener("storage", (event) => {
  if (event.key === NODE_NOTIFICATION_STORAGE_KEY) {
    renderMessages();
    renderWorkbench();
    updateWorkbenchCounts();
    return;
  }
  if (event.key === window.FeedbackManager.STORAGE_KEY) {
    if (state.profilePage === "help" && $("#managerProfileSubpage").classList.contains("open")) {
      $("#profileSubpageContent").innerHTML = helpPageMarkup();
      refreshIcons();
    }
    return;
  }
  if (event.key === MANAGER_PROFILE_STORAGE_KEY) {
    managerProfile = readManagerProfile();
    renderManagerProfile();
    return;
  }
  if (event.key === MANAGER_NOTIFICATION_STORAGE_KEY) {
    managerNotifications = readManagerNotifications();
    renderManagerProfile();
    return;
  }
  if (event.key !== window.AdminDataBridge?.STORAGE_KEY) return;
  loadSharedCatalog();
  updateWorkbenchCounts();
  renderWorkbench();
  if (state.currentView === "reports") renderReports();
  if (state.currentModule) renderModule();
});
$("#manageModulesButton").addEventListener("click", () => $("#moduleGrid").scrollIntoView({ behavior: "smooth", block: "center" }));
$("#moduleBackButton").addEventListener("click", closeModule);
$("#detailBackButton").addEventListener("click", () => {
  $("#managerDetailView").classList.remove("open");
  $("#managerDetailView").setAttribute("aria-hidden", "true");
  if (state.currentModule) {
    $("#moduleView").classList.add("open");
    $("#moduleView").setAttribute("aria-hidden", "false");
  } else {
    $(".manager-shell").classList.remove("subpage-open");
  }
});
$("#modulePrimaryButton").addEventListener("click", () => openEntry(state.currentModule));
$("#detailActionButton").addEventListener("click", (event) => {
  const { editModule, editId } = event.currentTarget.dataset;
  if (editModule && editId) openEntry(editModule, editId);
  else showToast("更多业务操作");
});
$("#entryBackButton").addEventListener("click", closeEntry);
$("#managerEntryView").addEventListener("click", (event) => { if (event.target === event.currentTarget) closeEntry(); });
$("#entryCancelButton").addEventListener("click", closeEntry);
$("#managerEntryForm").addEventListener("submit", saveEntry);
$("#profileSubpageBack").addEventListener("click", () => closeProfileSubpage());

$("#profileSubpageContent").addEventListener("click", (event) => {
  const feedbackTab = event.target.closest("[data-manager-feedback-tab]");
  if (feedbackTab) {
    state.feedbackTab = feedbackTab.dataset.managerFeedbackTab;
    $("#profileSubpageContent").innerHTML = helpPageMarkup();
    $("#profileSubpageContent").scrollTop = 0;
    refreshIcons();
    return;
  }
  if (event.target.closest("[data-profile-cancel]")) { closeProfileSubpage(); return; }
  const nestedAction = event.target.closest("[data-profile-nested-action]");
  if (nestedAction) openProfileSubpage(nestedAction.dataset.profileNestedAction);
});

$("#profileSubpageContent").addEventListener("input", (event) => {
  const feedbackDescription = event.target.closest("#managerFeedbackForm textarea[name='description']");
  if (feedbackDescription) {
    const counter = feedbackDescription.closest(".feedback-field").querySelector("[data-manager-feedback-count]");
    if (counter) counter.textContent = `${feedbackDescription.value.length}/1000`;
    return;
  }
  if (!event.target.closest("#managerProfileForm")) return;
  if (event.target.name === "phone") event.target.value = event.target.value.replace(/\D/g, "").slice(0, 11);
  syncProfileEditorState();
});

$("#profileSubpageContent").addEventListener("change", (event) => {
  const feedbackFiles = event.target.closest("#managerFeedbackForm input[name='attachments']");
  if (feedbackFiles) {
    const validation = window.FeedbackManager.validateFiles(feedbackFiles.files);
    const summary = feedbackFiles.closest(".feedback-field").querySelector("[data-manager-feedback-files]");
    if (validation.error) {
      feedbackFiles.value = "";
      summary.textContent = validation.error;
      showToast(validation.error);
      return;
    }
    summary.textContent = validation.files.length ? `已选择 ${validation.files.length} 个附件：${validation.files.map((file) => file.name).join("、")}` : "尚未选择附件";
    return;
  }
  if (event.target.matches("[data-notification-setting]")) {
    managerNotifications[event.target.dataset.notificationSetting] = event.target.checked;
    localStorage.setItem(MANAGER_NOTIFICATION_STORAGE_KEY, JSON.stringify(managerNotifications));
    renderManagerProfile();
    showToast("通知设置已保存");
    return;
  }
  if (event.target.id !== "profileAvatarInput") return;
  const file = event.target.files?.[0];
  if (!file) return;
  if (!file.type.startsWith("image/") || file.size > 2 * 1024 * 1024) {
    event.target.value = "";
    showToast("请选择不超过 2 MB 的图片");
    return;
  }
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    profileDraftAvatar = typeof reader.result === "string" ? reader.result : "";
    syncProfileEditorState();
  });
  reader.readAsDataURL(file);
});

$("#profileSubpageContent").addEventListener("submit", async (event) => {
  if (event.target.id === "managerProfileForm") { saveManagerProfile(event); return; }
  if (event.target.id !== "managerFeedbackForm") return;
  event.preventDefault();
  const form = event.target;
  const values = new FormData(form);
  const description = String(values.get("description") || "").trim();
  const contactPhone = String(values.get("contactPhone") || "").trim();
  if (description.length < 10) { form.elements.description.focus(); showToast("问题描述至少填写 10 个字"); return; }
  if (!/^1[3-9]\d{9}$/.test(contactPhone)) { form.elements.contactPhone.focus(); showToast("请输入正确的 11 位联系电话"); return; }
  const validation = window.FeedbackManager.validateFiles(form.elements.attachments.files);
  if (validation.error) { showToast(validation.error); return; }
  const button = form.querySelector("[type='submit']");
  button.disabled = true;
  button.textContent = validation.files.length ? "正在上传附件…" : "正在提交…";
  const relatedOption = form.elements.relatedId.selectedOptions[0];
  const businessId = String(values.get("businessId") || "").trim();
  const feedbackId = window.FeedbackManager.makeId();
  try {
    const attachments = await window.FeedbackManager.saveAttachments(feedbackId, validation.files);
    window.FeedbackManager.create({
      id: feedbackId,
      source: "manager",
      submitterId: managerProfile.account,
      submitterName: managerProfile.name,
      submitterPhone: managerProfile.phone,
      submitterAccount: managerProfile.account,
      submitterRole: managerProfile.role,
      submitterDepartment: managerProfile.department,
      categoryCode: String(values.get("categoryCode") || ""),
      description,
      contactPhone,
      relatedType: values.get("relatedId") ? "module" : businessId ? "business" : "",
      relatedId: businessId || String(values.get("relatedId") || ""),
      relatedLabel: [relatedOption?.value ? relatedOption.textContent : "", businessId].filter(Boolean).join(" · "),
      attachments,
      clientVersion: "管理端 1.0",
      deviceInfo: String(navigator.userAgent || "移动设备").slice(0, 120),
    });
    state.feedbackTab = "history";
    $("#profileSubpageContent").innerHTML = helpPageMarkup();
    $("#profileSubpageContent").scrollTop = 0;
    refreshIcons();
    showToast(`反馈已提交：${feedbackId}`);
  } catch (error) {
    console.error("管理端意见反馈提交失败。", error);
    button.disabled = false;
    button.textContent = "提交意见反馈";
    showToast(error.message || "反馈提交失败，请重试");
  }
});

$("#managerEntryContent").addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-add-repeat]");
  if (addButton) {
    const type = addButton.dataset.addRepeat;
    const list = type === "container" ? $("#mobileContainerList") : type === "receivable" ? $("#mobileReceivableList") : $("#mobilePayableList");
    list.insertAdjacentHTML("beforeend", type === "container" ? containerCardMarkup() : feeCardMarkup(type));
    refreshIcons();
    return;
  }
  const removeButton = event.target.closest("[data-remove-repeat]");
  if (removeButton) removeButton.closest("[data-repeat-card]").remove();
});

$("#managerEntryContent").addEventListener("input", (event) => {
  if (state.entryModule === "route" && ["estimatedRevenue", "commissionValue"].includes(event.target.name)) updateRouteCommission();
  if (event.target.closest("[data-repeat-card=fee]")) updateFeeTotal(event.target.closest("[data-repeat-card=fee]"));
  if (["creditCode"].includes(event.target.name)) event.target.value = event.target.value.toUpperCase().replace(/[^0-9A-Z]/g, "");
  if (["mobile", "phone", "emergencyPhone", "bankAccount", "bankCard"].includes(event.target.name) && event.target.inputMode === "numeric") event.target.value = event.target.value.replace(/\D/g, "");
});

$("#managerEntryContent").addEventListener("change", (event) => {
  if (event.target.name === "commissionType") updateRouteCommission();
  if (event.target.name === "customerId") updateWaybillCustomer();
  if (event.target.name === "routeId") loadWaybillRouteDefaults();
  if (event.target.name === "waybillId") updateDispatchSummary();
  if (state.entryModule === "dispatch" && event.target.name === "routeId") updateDispatchSummary();
  if (state.entryModule === "dispatch" && event.target.name === "vehicleId") updateDispatchVehicle();
  if (event.target.name === "triggerMode") updateAutoMode();
  if (event.target.type === "file") {
    const picker = event.target.closest(".file-picker");
    const fileName = event.target.files?.[0]?.name;
    picker.classList.toggle("selected", Boolean(fileName));
    picker.querySelector("strong").textContent = fileName || "点击选择附件";
    picker.querySelector("small").textContent = fileName ? "附件已选择，可点击重新选择" : "支持 JPG、PNG、PDF，单个文件不超过 10 MB";
  }
});

$("#moduleSearch").addEventListener("input", (event) => {
  state.search = event.target.value;
  $("#clearModuleSearch").classList.toggle("visible", Boolean(state.search));
  renderModule();
});
$("#clearModuleSearch").addEventListener("click", () => { state.search = ""; $("#moduleSearch").value = ""; $("#clearModuleSearch").classList.remove("visible"); renderModule(); });
$("#moduleFilters").addEventListener("click", (event) => { const button = event.target.closest("[data-module-filter]"); if (!button) return; state.moduleFilter = button.dataset.moduleFilter; renderModule(); });
$("#moduleList").addEventListener("click", (event) => {
  const autoRun = event.target.closest("[data-auto-run]");
  if (autoRun) { showToast("自动派单任务已提交执行"); return; }
  const startDispatch = event.target.closest("[data-start-dispatch]");
  if (startDispatch) {
    const dispatchId = startDispatch.dataset.startDispatch;
    if (moduleCatalog.dispatch.items.some((item) => item.id === dispatchId)) openEntry("dispatch", dispatchId);
    return;
  }
  const button = event.target.closest("[data-module-detail]");
  if (!button) return;
  const item = moduleCatalog[state.currentModule].items.find((entry) => entry.id === button.dataset.moduleDetail);
  if (item) openDetail(item);
});

$("#messageTabs").addEventListener("click", (event) => {
  const button = event.target.closest("[data-message-filter]");
  if (!button) return;
  state.messageFilter = button.dataset.messageFilter;
  $$("#messageTabs button").forEach((item) => item.classList.toggle("active", item === button));
  renderMessages();
});
$("#messageList").addEventListener("click", (event) => {
  const button = event.target.closest("[data-message-id]");
  if (!button) return;
  const message = allMessages().find((item) => item.id === button.dataset.messageId);
  if (!message) return;
  message.unread = false;
  if (message.nodeNotificationId) {
    let readIds = [];
    try { readIds = JSON.parse(localStorage.getItem(NODE_NOTIFICATION_READ_STORAGE_KEY) || "[]"); } catch (_error) { readIds = []; }
    if (!readIds.includes(message.nodeNotificationId)) readIds.push(message.nodeNotificationId);
    localStorage.setItem(NODE_NOTIFICATION_READ_STORAGE_KEY, JSON.stringify(readIds));
  }
  if (message.module === "auto") openAutoControl(); else openModule(message.module);
  renderMessages();
});
$("#readAllButton").addEventListener("click", () => {
  messages.forEach((item) => { item.unread = false; });
  let readIds = [];
  try { readIds = JSON.parse(localStorage.getItem(NODE_NOTIFICATION_READ_STORAGE_KEY) || "[]"); } catch (_error) { readIds = []; }
  localStorage.setItem(NODE_NOTIFICATION_READ_STORAGE_KEY, JSON.stringify([...new Set([...readIds, ...readNodeNotifications().map((item) => item.nodeNotificationId)])]));
  renderMessages(); renderWorkbench(); updateWorkbenchCounts(); showToast("消息已全部标记为已读");
});

loadSharedCatalog();
loadCreatedRecords();
ensurePendingDispatchSamples();
rebuildDispatchManagementCatalog();
updateWorkbenchCounts();
renderWorkbench();
renderMessages();
renderManagerProfile();
refreshIcons();
window.setInterval(() => { if (state.currentView === "reports") renderReports(); }, 15000);
