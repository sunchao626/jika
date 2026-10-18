const DEFAULT_TASK_TYPE = window.DispatchTaskNodes.defaultType;
const TASK_NODE_SEQUENCES = window.DispatchTaskNodes.sequences;
const dispatchSeed = [
  { id: "PD-1001", waybillNo: "WB20260916001", orderDate: "2026-09-16", routeId: "XL-001", routeName: "北仑港至江北仓", origin: "宁波北仑港区二期", destination: "宁波江北物流园", dispatchTime: "2026-09-16 08:35", driverId: "SJ-1001", driverName: "王海", phone: "13800008881", vehicleId: "浙B·K7812", status: "运输中", currentNode: "在途", boxes: "TCLU8374621 / 40HQ", estimatedRevenue: 2860, commission: 420, note: "上午装柜", pushed: true, timeline: [{ node: "已派单", time: "2026-09-16 08:35", desc: "派单已推送至司机微信小程序", photos: [] }, { node: "已提货", time: "2026-09-16 10:12", desc: "司机已完成提货，上传装柜现场照片", photos: ["装柜现场-001.jpg"] }, { node: "在途", time: "2026-09-16 11:05", desc: "车辆驶离装货地，运输中", photos: ["运输途中-001.jpg"] }] },
  { id: "PD-1002", waybillNo: "WB20260916002", orderDate: "2026-09-16", routeId: "XL-002", routeName: "洋山港至昆山保税区", origin: "上海洋山港", destination: "昆山综合保税区", dispatchTime: "2026-09-16 09:10", driverId: "SJ-1002", driverName: "赵亮", phone: "13900006662", vehicleId: "沪D·A9021", status: "已派单", currentNode: "待提货", boxes: "MSKU4920183 / MSKU4920184", estimatedRevenue: 3520, commission: 563.2, note: "双拖作业，按现场指引进港", pushed: true, timeline: [{ node: "已派单", time: "2026-09-16 09:10", desc: "派单已推送至司机微信小程序", photos: [] }] },
  { id: "PD-1003", waybillNo: "WB20260916003", orderDate: "2026-09-15", routeId: "XL-003", routeName: "萧山仓至梅山码头", origin: "杭州萧山仓", destination: "宁波梅山码头", dispatchTime: "2026-09-15 16:40", driverId: "SJ-1004", driverName: "陈涛", phone: "13600002228", vehicleId: "浙A·F2190", status: "已完成", currentNode: "已送达", boxes: "CMAU6502739 / 40GP", estimatedRevenue: 2550, commission: 350, note: "夜间进港", pushed: true, timeline: [{ node: "已派单", time: "2026-09-15 16:40", desc: "派单已推送至司机微信小程序", photos: [] }, { node: "已提货", time: "2026-09-15 18:22", desc: "完成提货", photos: ["提货现场-003.jpg"] }, { node: "已送达", time: "2026-09-16 06:55", desc: "货柜已送达梅山码头", photos: ["送达凭证-003.jpg"] }] },
  { id: "PD-1004", waybillNo: "WB20260916004", orderDate: "2026-09-14", routeId: "XL-004", routeName: "苏州园区至外高桥", origin: "苏州工业园区", destination: "上海外高桥五期", dispatchTime: "2026-09-14 14:20", driverId: "SJ-1003", driverName: "刘军", phone: "13700003335", vehicleId: "苏E·T5568", status: "取消", currentNode: "待派单", boxes: "OOLU3087642 / 20GP", estimatedRevenue: 1980, commission: 297, note: "线路价格调整，原派单取消", pushed: true, timeline: [{ node: "已派单", time: "2026-09-14 14:20", desc: "派单已推送至司机微信小程序", photos: [] }, { node: "取消", time: "2026-09-14 15:05", desc: "未开始提货，后台撤销派单", photos: [] }] },
  { id: "PD-1005", waybillNo: "WB20260916005", orderDate: "2026-09-16", routeId: "XL-001", routeName: "北仑港至江北仓", origin: "宁波北仑港区二期", destination: "宁波江北物流园", dispatchTime: "", driverId: "", driverName: "待分配", phone: "-", vehicleId: "", status: "待派单", currentNode: "待派单", boxes: "待装箱", estimatedRevenue: 2860, commission: 420, note: "等待调度", pushed: false, timeline: [] },
  { id: "PD-1006", waybillNo: "WB20260921006", orderDate: "2026-09-21", routeId: "XL-005", routeName: "外高桥至太仓港", origin: "上海外高桥港区六期", destination: "太仓港综合保税区", dispatchTime: "2026-09-21 07:45", driverId: "SJ-1002", driverName: "赵亮", phone: "13900006662", vehicleId: "沪D·A9021", status: "已派单", currentNode: "待提货", boxes: "TEMU7631058 / 40HQ", estimatedRevenue: 3180, commission: 480, note: "10:30 前完成提箱，进港需提前预约", pushed: true, timeline: [{ node: "已派单", time: "2026-09-21 07:45", desc: "派单已推送至司机微信小程序", photos: [] }] },
  { id: "PD-1007", waybillNo: "WB20260921007", orderDate: "2026-09-21", routeId: "XL-006", routeName: "临港新片区至洋山港", origin: "上海临港新片区物流园", destination: "洋山深水港四期码头", dispatchTime: "2026-09-21 08:20", driverId: "SJ-1002", driverName: "赵亮", phone: "13900006662", vehicleId: "沪D·A9021", status: "已派单", currentNode: "待提货", boxes: "FSCU9214670 / 20GP", estimatedRevenue: 2260, commission: 360, note: "重箱进港，请核对封号后发车", pushed: true, timeline: [{ node: "已派单", time: "2026-09-21 08:20", desc: "派单已推送至司机微信小程序", photos: [] }] },
  { id: "PD-1008", waybillNo: "WB20260920008", orderDate: "2026-09-20", routeId: "XL-007", routeName: "芦潮港至嘉兴综保区", origin: "上海芦潮港集装箱中心", destination: "嘉兴综合保税区", dispatchTime: "2026-09-20 13:30", driverId: "SJ-1002", driverName: "赵亮", phone: "13900006662", vehicleId: "沪D·A9021", status: "运输中", currentNode: "在途", boxes: "CAIU8172054 / 40HQ", estimatedRevenue: 2980, commission: 450, note: "预计 17:30 前送达", pushed: true, acceptedAt: "2026-09-20 13:42", timeline: [{ node: "已派单", time: "2026-09-20 13:30", desc: "派单已推送至司机微信小程序", photos: [] }, { node: "已接单", time: "2026-09-20 13:42", desc: "司机已确认接单", photos: [] }, { node: "已提货", time: "2026-09-20 14:25", desc: "已完成提货并核对箱封", photos: ["提货现场-008.jpg"] }, { node: "在途", time: "2026-09-20 14:48", desc: "车辆已发车，运输途中", photos: [] }] },
  { id: "PD-1009", waybillNo: "WB20260919009", orderDate: "2026-09-19", routeId: "XL-008", routeName: "洋山港至松江仓", origin: "洋山深水港三期码头", destination: "上海松江出口加工区", dispatchTime: "2026-09-19 08:10", driverId: "SJ-1002", driverName: "赵亮", phone: "13900006662", vehicleId: "沪D·A9021", status: "已完成", currentNode: "已送达", boxes: "TRHU6721843 / 20GP", estimatedRevenue: 2450, commission: 380, note: "凭预约号入仓", pushed: true, acceptedAt: "2026-09-19 08:16", timeline: [{ node: "已派单", time: "2026-09-19 08:10", desc: "派单已推送至司机微信小程序", photos: [] }, { node: "已接单", time: "2026-09-19 08:16", desc: "司机已确认接单", photos: [] }, { node: "已提货", time: "2026-09-19 09:02", desc: "已完成提货", photos: ["提货现场-009.jpg"] }, { node: "已送达", time: "2026-09-19 11:46", desc: "货物已安全送达目的地", photos: ["送达凭证-009.jpg"] }] },
  { id: "PD-1010", waybillNo: "WB20260918010", orderDate: "2026-09-18", routeId: "XL-009", routeName: "外高桥至昆山陆家仓", origin: "上海外高桥港区五期", destination: "昆山陆家物流园", dispatchTime: "2026-09-18 15:20", driverId: "SJ-1002", driverName: "赵亮", phone: "13900006662", vehicleId: "沪D·A9021", status: "取消", currentNode: "取消", boxes: "GESU5091872 / 40GP", estimatedRevenue: 2760, commission: 410, note: "客户调整装货计划，调度取消", pushed: true, acceptedAt: "2026-09-18 15:28", timeline: [{ node: "已派单", time: "2026-09-18 15:20", desc: "派单已推送至司机微信小程序", photos: [] }, { node: "已接单", time: "2026-09-18 15:28", desc: "司机已确认接单", photos: [] }, { node: "取消", time: "2026-09-18 15:50", desc: "客户调整计划，调度取消运单", photos: [] }] },
  { id: "PD-1011", waybillNo: "WB20261012011", taskType: "提空装货", orderDate: "2026-10-12", routeId: "XL-010", routeName: "外高桥港至嘉定仓", origin: "上海外高桥港区", destination: "上海嘉定物流园", dispatchTime: "2026-10-12 08:10", driverId: "SJ-1002", driverName: "赵亮", phone: "13900006662", vehicleId: "沪D·A9021", status: "运输中", currentNode: "完成装货", boxes: "TGHU8317205 / 40HQ", estimatedRevenue: 3120, commission: 468, note: "装货照片已齐，准备重箱进站", pushed: true, acceptedAt: "2026-10-12 08:16", timeline: [{ node: "已派单", time: "2026-10-12 08:10", desc: "派单已推送至司机微信小程序", photos: [] }, { node: "已接单", time: "2026-10-12 08:16", desc: "司机已确认接单", photos: [] }, { node: "已提空", time: "2026-10-12 09:02", desc: "已提取空箱", photos: [] }, { node: "空箱在途", time: "2026-10-12 09:35", desc: "空箱运往客户仓库", photos: [] }, { node: "到达仓库", time: "2026-10-12 10:12", desc: "车辆到达客户仓库", photos: [] }, { node: "完成装货", time: "2026-10-12 11:20", desc: "仓库装货完成", photos: [] }] },
  { id: "PD-1012", waybillNo: "WB20261012012", taskType: "排空箱（A→B）", orderDate: "2026-10-12", routeId: "XL-011", routeName: "洋山港至临港堆场", origin: "上海洋山港", destination: "上海临港堆场", dispatchTime: "2026-10-12 09:05", driverId: "SJ-1002", driverName: "赵亮", phone: "13900006662", vehicleId: "沪D·A9021", status: "运输中", currentNode: "已提空", boxes: "UACU4126801 / 20GP", estimatedRevenue: 2180, commission: 327, note: "空箱已提取，直接送往 B 地", pushed: true, acceptedAt: "2026-10-12 09:11", timeline: [{ node: "已派单", time: "2026-10-12 09:05", desc: "派单已推送至司机微信小程序", photos: [] }, { node: "已接单", time: "2026-10-12 09:11", desc: "司机已确认接单", photos: [] }, { node: "已提空", time: "2026-10-12 10:02", desc: "空箱已提取，箱体照片已上传", photos: [] }] },
  { id: "PD-1013", waybillNo: "WB20261012013", taskType: "排重箱（A→B）", orderDate: "2026-10-12", routeId: "XL-012", routeName: "宁波北仑港至梅山码头", origin: "宁波北仑港区", destination: "宁波梅山码头", dispatchTime: "2026-10-12 07:40", driverId: "SJ-1002", driverName: "赵亮", phone: "13900006662", vehicleId: "沪D·A9021", status: "运输中", currentNode: "重箱在途", boxes: "FCIU7350192 / 40HQ", estimatedRevenue: 2680, commission: 402, note: "重箱在途，进站时需上传铁路临封照片", pushed: true, acceptedAt: "2026-10-12 07:48", timeline: [{ node: "已派单", time: "2026-10-12 07:40", desc: "派单已推送至司机微信小程序", photos: [] }, { node: "已接单", time: "2026-10-12 07:48", desc: "司机已确认接单", photos: [] }, { node: "已提重", time: "2026-10-12 08:26", desc: "重箱已提取，关门照与封号照已上传", photos: [] }, { node: "重箱在途", time: "2026-10-12 08:50", desc: "重箱驶往铁路中心", photos: [] }] },
  { id: "PD-1014", waybillNo: "WB20261012014", taskType: "提重送货", orderDate: "2026-10-12", routeId: "XL-013", routeName: "洋山港至松江仓", origin: "上海洋山深水港", destination: "上海松江出口加工区", dispatchTime: "2026-10-12 06:50", driverId: "SJ-1002", driverName: "赵亮", phone: "13900006662", vehicleId: "沪D·A9021", status: "运输中", currentNode: "空箱在途", boxes: "TCLU6019237 / 20GP", estimatedRevenue: 2540, commission: 381, note: "空箱已返程，进站需上传 5 张空箱照片", pushed: true, acceptedAt: "2026-10-12 06:56", timeline: [{ node: "已派单", time: "2026-10-12 06:50", desc: "派单已推送至司机微信小程序", photos: [] }, { node: "已接单", time: "2026-10-12 06:56", desc: "司机已确认接单", photos: [] }, { node: "已提重", time: "2026-10-12 07:32", desc: "已提取重箱，关门照和封号照已上传", photos: [] }, { node: "重箱在途", time: "2026-10-12 08:05", desc: "重箱运往客户仓库", photos: [] }, { node: "到达仓库", time: "2026-10-12 08:46", desc: "车辆到达仓库", photos: [] }, { node: "完成卸货", time: "2026-10-12 10:14", desc: "卸货完成，过程照片已上传", photos: [] }, { node: "空箱在途", time: "2026-10-12 10:35", desc: "空箱驶往铁路中心", photos: [] }] },
];

const drivers = {
  "SJ-1001": { id: "SJ-1001", name: "王海", phone: "13800008881", idCard: "330206198805182418", licenseNo: "330206198805182418", qualificationNo: "330206002891", type: "自有司机", fleet: "宁波一队", licenseClass: "A2", licenseExpiry: "2028-03-12", qualificationExpiry: "2027-08-20" },
  "SJ-1002": { id: "SJ-1002", name: "赵亮", phone: "13900006662", idCard: "310115198912093617", licenseNo: "310115198912093617", qualificationNo: "310115006720", type: "自有司机", fleet: "临港车队", licenseClass: "A2", licenseExpiry: "2027-11-06", qualificationExpiry: "2027-05-18" },
  "SJ-1003": { id: "SJ-1003", name: "刘军", phone: "13700003335", idCard: "320500198706263011", licenseNo: "320500198706263011", qualificationNo: "320500003109", type: "自有司机", fleet: "苏州二队", licenseClass: "A2", licenseExpiry: "2026-10-06", qualificationExpiry: "2026-09-28" },
  "SJ-1004": { id: "SJ-1004", name: "陈涛", phone: "13600002228", idCard: "330109199003154812", licenseNo: "330109199003154812", qualificationNo: "330109007721", type: "自有司机", fleet: "杭州车队", licenseClass: "A2", licenseExpiry: "2029-02-15", qualificationExpiry: "2028-01-22" },
};

const vehicles = {
  "浙B·K7812": { type: "集装箱牵引车", fleet: "宁波港区集卡车队", state: "在用", permitNo: "浙交运管字 330206-7812", inspectionDue: "2027-03-18" },
  "沪D·A9021": { type: "重型半挂牵引车", fleet: "临港外协集卡车队", state: "在用", permitNo: "沪交运管字 330206-889", inspectionDue: "2027-03-18" },
  "苏E·T5568": { type: "集装箱骨架车", fleet: "苏州园区集卡车队", state: "停用", permitNo: "苏交运管字 320500-5568", inspectionDue: "2026-12-06" },
  "浙A·F2190": { type: "危险品牵引车", fleet: "杭州危险品运输车队", state: "在用", permitNo: "浙交运管字 330109-2190", inspectionDue: "2027-06-22" },
};

Object.values(drivers).forEach((driver) => {
  driver.capacityOwnership = window.CapacityOwnership.normalizeType(driver.capacityOwnership || driver.type);
  driver.organizationName = driver.capacityOwnership === "自营" ? "本公司" : driver.supplierName || driver.fleet;
});

function syncDriverArchive() {
  const snapshot = window.AdminDataBridge?.read();
  if (!Array.isArray(snapshot?.drivers)) return;
  snapshot.drivers.forEach((record) => {
    if (!record?.id || !drivers[record.id]) return;
    const normalized = window.CapacityOwnership.normalizeResource({ ...record }, "driver");
    Object.assign(drivers[record.id], normalized, { type: normalized.driverType });
  });
}

function syncVehicleArchive() {
  const snapshot = window.AdminDataBridge?.read();
  if (!Array.isArray(snapshot?.vehicles)) return;
  const next = {};
  snapshot.vehicles.forEach((vehicle) => {
    if (!vehicle?.plateNo) return;
    const assignedName = String(vehicle.driver || "").split("/")[0].trim();
    const driver = Object.values(drivers).find((item) => item.name === assignedName);
    next[vehicle.plateNo] = {
      ...vehicles[vehicle.plateNo],
      type: vehicle.vehicleType || vehicles[vehicle.plateNo]?.type || "车辆",
      fleet: vehicle.fleetName || vehicle.fleet || "",
      state: vehicle.vehicleState || "在用",
      driverId: driver?.id || "",
      capacityOwnership: window.CapacityOwnership.normalizeType(vehicle.capacityOwnership || vehicle.ownership),
      supplierName: vehicle.supplierName || "",
      organizationName: window.CapacityOwnership.organizationName(vehicle),
      permitNo: vehicle.permitNo || vehicles[vehicle.plateNo]?.permitNo || "",
      inspectionDue: vehicle.inspectionDue || vehicle.annualInspectionDue || vehicles[vehicle.plateNo]?.inspectionDue || "",
    };
  });
  Object.keys(vehicles).forEach((plate) => delete vehicles[plate]);
  Object.assign(vehicles, next);
}

syncVehicleArchive();
syncDriverArchive();

const waybillMeta = {
  WB20260916001: { taskType: "提空装货", customer: "宁波海拓供应链有限公司", billNo: "BL-NB-26091601", containerType: "40HQ", sealNo: "SEAL831942", loadAddress: "宁波市北仑区港兴路 88 号" },
  WB20260916002: { taskType: "提重送货", customer: "上海临港国际物流有限公司", billNo: "BL-SH-26091622", containerType: "双拖", sealNo: "SEAL440182 / SEAL440183", loadAddress: "上海洋山深水港四期码头" },
  WB20260916003: { taskType: "排空箱（A→B）", customer: "杭州华远进出口有限公司", billNo: "BL-HZ-26091508", containerType: "40GP", sealNo: "SEAL650273", loadAddress: "杭州市萧山区临浦物流园 6 号库" },
  WB20260916004: { taskType: "排重箱（A→B）", customer: "苏州园区保税物流中心", billNo: "BL-SZ-26091411", containerType: "20GP", sealNo: "SEAL308764", loadAddress: "苏州工业园区现代大道 168 号" },
  WB20260921006: { taskType: "提空装货", customer: "上海盛达国际货运有限公司", billNo: "BL-SH-26092106", containerType: "40HQ", sealNo: "SEAL763105", loadAddress: "上海市浦东新区外高桥港区海通路 88 号" },
  WB20260921007: { taskType: "排重箱（A→B）", customer: "临港海运供应链有限公司", billNo: "BL-SH-26092107", containerType: "20GP", sealNo: "SEAL921467", loadAddress: "上海市浦东新区临港大道 1555 号" },
  WB20260920008: { taskType: "提重送货", customer: "嘉兴联运供应链有限公司", billNo: "BL-SH-26092008", containerType: "40HQ", sealNo: "SEAL817205", loadAddress: "上海市浦东新区芦潮港路 1588 号" },
  WB20260919009: { taskType: "提重送货", customer: "上海松江国际物流有限公司", billNo: "BL-SH-26091909", containerType: "20GP", sealNo: "SEAL672184", loadAddress: "上海市浦东新区洋山港同汇路 66 号" },
  WB20260918010: { taskType: "提重送货", customer: "昆山陆港供应链有限公司", billNo: "BL-SH-26091810", containerType: "40GP", sealNo: "SEAL509187", loadAddress: "上海市浦东新区外高桥港区洲海路 999 号" },
  WB20261012011: { taskType: "提空装货", customer: "上海嘉定供应链有限公司", billNo: "BL-SH-26101211", containerType: "40HQ", sealNo: "SEAL831720", loadAddress: "上海市嘉定区物流园 18 号库" },
  WB20261012012: { taskType: "排空箱（A→B）", customer: "上海临港堆场服务有限公司", billNo: "BL-SH-26101212", containerType: "20GP", sealNo: "SEAL412680", loadAddress: "上海市临港新区堆场 3 区" },
  WB20261012013: { taskType: "排重箱（A→B）", customer: "宁波梅山港务有限公司", billNo: "BL-NB-26101213", containerType: "40HQ", sealNo: "SEAL735019", loadAddress: "宁波市北仑区港兴路 188 号" },
  WB20261012014: { taskType: "提重送货", customer: "上海松江国际物流有限公司", billNo: "BL-SH-26101214", containerType: "20GP", sealNo: "SEAL601923", loadAddress: "上海市松江出口加工区申港路 51 号" },
};

const DEFAULT_DRIVER_ID = "SJ-1002";
const DEFAULT_PENDING_IDS = ["PD-1002", "PD-1006", "PD-1007"];
const DEFAULT_ORDER_IDS = ["PD-1008", "PD-1009", "PD-1010"];
const DEFAULT_DEMO_IDS = new Set([...DEFAULT_PENDING_IDS, ...DEFAULT_ORDER_IDS]);
const CERTIFICATION_STORAGE_KEY = "container-logistics-driver-certifications-v1";
const EXPENSE_STORAGE_KEY = "container-logistics-driver-expenses-v1";
const ANNOUNCEMENT_STORAGE_KEY = "container-logistics-announcements-v1";
const DRIVER_MESSAGE_READ_STORAGE_KEY = "container-logistics-driver-message-read-v1";
const FONT_SIZE_STORAGE_KEY = "container-logistics-driver-font-size-v1";
const DRIVER_PROFILE_STORAGE_KEY = "container-logistics-driver-profile-v1";
const DRIVER_VEHICLE_STORAGE_KEY = "container-logistics-driver-vehicle-profile-v1";
const CERTIFICATION_DOCUMENT_GROUPS = Object.freeze([
  { key: "idCardFront", label: "身份证人像面", icon: "contact", accept: "image/*,.pdf" },
  { key: "idCardBack", label: "身份证国徽面", icon: "contact", accept: "image/*,.pdf" },
  { key: "licenseAttachment", label: "机动车驾驶证", icon: "badge-check", accept: "image/*,.pdf" },
  { key: "qualificationAttachment", label: "道路运输从业资格证", icon: "file-check-2", accept: "image/*,.pdf" },
]);
const FONT_SIZE_OPTIONS = Object.freeze({
  small: { label: "小号", scale: "0.92" },
  medium: { label: "中号", scale: "1" },
  large: { label: "大号", scale: "1.08" },
});
const DEMO_DRIVER_ANNOUNCEMENT = {
  id: "driver-demo-announcement-20261014",
  title: "关于规范运输途中安全作业的公告",
  content: "请各位司机运输途中遵守交通法规，装卸作业前确认现场安全。遇到异常情况请及时联系调度。",
  type: "公告",
  publishedAt: "2026-10-14 09:15",
};
const EXPENSE_TYPES = Object.freeze([
  { key: "fuel", label: "加油", hint: "柴油、汽油等燃油支出" },
  { key: "electricity", label: "充电", hint: "充电及换电支出" },
  { key: "gas", label: "燃气费", hint: "天然气等燃气支出" },
  { key: "toll", label: "路桥费", hint: "高速、桥隧通行支出" },
  { key: "parking", label: "停车费", hint: "停车及场站服务支出" },
  { key: "repair", label: "维修", hint: "车辆维修及配件支出" },
  { key: "container", label: "提箱费", hint: "提箱及箱务相关支出" },
  { key: "other", label: "其他", hint: "手动录入其他费用名称" },
]);
const certificationDefaults = {
  "SJ-1001": { status: "verified", submittedAt: "2026-08-12 09:20", reviewedAt: "2026-08-12 11:05" },
  "SJ-1002": { status: "verified", submittedAt: "2026-08-12 09:20", reviewedAt: "2026-08-12 11:05" },
  "SJ-1003": { status: "pending", submittedAt: "2026-09-20 15:36", reviewedAt: "" },
  "SJ-1004": { status: "verified", submittedAt: "2026-08-12 09:20", reviewedAt: "2026-08-12 11:05" },
};
const certificationMigrations = {
  "SJ-1002": { from: "unverified", to: "verified" },
  "SJ-1004": { from: "rejected", to: "verified", legacyReason: "身份证背面照片模糊，请重新上传" },
};

function loadCertifications() {
  try {
    const stored = JSON.parse(localStorage.getItem(CERTIFICATION_STORAGE_KEY) || "{}");
    Object.entries(certificationMigrations).forEach(([driverId, migration]) => {
      const record = stored[driverId];
      if (!record || record.status !== migration.from || (migration.legacyReason && record.reason !== migration.legacyReason)) return;
      stored[driverId] = {
        ...record,
        status: migration.to,
        submittedAt: record.submittedAt || "2026-08-12 09:20",
        reviewedAt: "2026-08-12 11:05",
        reason: "",
      };
    });
    const merged = { ...certificationDefaults, ...stored };
    localStorage.setItem(CERTIFICATION_STORAGE_KEY, JSON.stringify(merged));
    return merged;
  } catch {
    return { ...certificationDefaults };
  }
}

function loadFontSize() {
  try {
    const saved = localStorage.getItem(FONT_SIZE_STORAGE_KEY);
    return FONT_SIZE_OPTIONS[saved] ? saved : "medium";
  } catch {
    return "medium";
  }
}

function applyFontSize(size = state.fontSize, persist = true) {
  const normalized = FONT_SIZE_OPTIONS[size] ? size : "medium";
  state.fontSize = normalized;
  document.documentElement.dataset.mobileFontSize = normalized;
  const shell = document.querySelector(".phone-shell");
  if (shell) shell.dataset.fontSize = normalized;
  document.querySelectorAll(".font-size-options button[data-font-size]").forEach((button) => {
    const active = button.dataset.fontSize === normalized;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  if (persist) {
    try { localStorage.setItem(FONT_SIZE_STORAGE_KEY, normalized); } catch { /* storage may be unavailable in private mode */ }
  }
}

function saveCertifications(certifications) {
  localStorage.setItem(CERTIFICATION_STORAGE_KEY, JSON.stringify(certifications));
}

function loadDriverProfiles() {
  try {
    const stored = JSON.parse(localStorage.getItem(DRIVER_PROFILE_STORAGE_KEY) || "{}");
    Object.entries(stored).forEach(([driverId, profile]) => {
      if (drivers[driverId] && profile && typeof profile === "object") Object.assign(drivers[driverId], profile);
    });
  } catch { /* retain demo profile defaults */ }
}

function saveDriverProfiles() {
  const editableFields = ["name", "phone", "fleet", "address", "emergencyContact", "licenseNo", "licenseClass", "licenseExpiry", "qualificationNo", "qualificationExpiry"];
  const profiles = Object.fromEntries(Object.entries(drivers).map(([driverId, driver]) => [
    driverId,
    Object.fromEntries(editableFields.map((field) => [field, driver[field] || ""])),
  ]));
  localStorage.setItem(DRIVER_PROFILE_STORAGE_KEY, JSON.stringify(profiles));
}

loadDriverProfiles();

function loadDriverVehicleProfiles() {
  try {
    const stored = JSON.parse(localStorage.getItem(DRIVER_VEHICLE_STORAGE_KEY) || "{}");
    Object.entries(stored).forEach(([plateNo, profile]) => {
      if (vehicles[plateNo] && profile && typeof profile === "object") Object.assign(vehicles[plateNo], profile);
    });
  } catch { /* retain synchronized vehicle data */ }
}

function saveDriverVehicleProfile(plateNo) {
  const vehicle = vehicles[plateNo];
  if (!vehicle) return;
  let stored = {};
  try { stored = JSON.parse(localStorage.getItem(DRIVER_VEHICLE_STORAGE_KEY) || "{}"); } catch { stored = {}; }
  stored[plateNo] = {
    type: vehicle.type || "",
    fleet: vehicle.fleet || "",
    permitNo: vehicle.permitNo || "",
    inspectionDue: vehicle.inspectionDue || "",
  };
  localStorage.setItem(DRIVER_VEHICLE_STORAGE_KEY, JSON.stringify(stored));

  const snapshot = window.AdminDataBridge.read() || {};
  const vehicleRows = Array.isArray(snapshot.vehicles) ? snapshot.vehicles.slice() : [];
  const index = vehicleRows.findIndex((item) => item.plateNo === plateNo);
  const current = index >= 0 ? vehicleRows[index] : { plateNo };
  const next = {
    ...current,
    plateNo,
    vehicleType: vehicle.type,
    fleetName: vehicle.fleet,
    vehicleState: vehicle.state,
    capacityOwnership: vehicle.capacityOwnership || current.capacityOwnership || "",
    supplierName: vehicle.supplierName || current.supplierName || "",
    permitNo: vehicle.permitNo,
    inspectionDue: vehicle.inspectionDue,
  };
  if (index >= 0) vehicleRows[index] = next;
  else vehicleRows.push(next);
  window.AdminDataBridge.write({ ...snapshot, vehicles: vehicleRows });
}

loadDriverVehicleProfiles();

function credentialAttachmentMap(certification = {}) {
  const stored = certification.attachments && typeof certification.attachments === "object" ? certification.attachments : {};
  return Object.fromEntries(CERTIFICATION_DOCUMENT_GROUPS.map((group) => {
    const current = Array.isArray(stored[group.key]) ? stored[group.key].filter(Boolean) : [];
    if (current.length) return [group.key, current];
    const legacyNames = typeof certification[group.key] === "string"
      ? certification[group.key].split("、").map((name) => name.trim()).filter(Boolean)
      : [];
    return [group.key, legacyNames.map((name, index) => ({ id: "", name, type: "", uploadedAt: certification.submittedAt || "", legacy: true, index }))];
  }));
}

function syncCredentialAttachmentNames(certification) {
  const attachments = credentialAttachmentMap(certification);
  certification.attachments = attachments;
  CERTIFICATION_DOCUMENT_GROUPS.forEach((group) => {
    certification[group.key] = attachments[group.key].map((item) => item.name).join("、");
  });
  return certification;
}

async function replaceCredentialAttachmentsFromForm(form, certification, requireAll = false) {
  const current = credentialAttachmentMap(certification);
  const next = { ...current };
  const pendingBlobs = [];
  const replacedIds = [];
  let changed = false;

  for (const group of CERTIFICATION_DOCUMENT_GROUPS) {
    const input = form.elements[group.key];
    const files = Array.from(input?.files || []);
    const card = input?.closest("[data-credential-upload-card]");
    const removeExisting = card?.dataset.removeExisting === "true";
    if (files.length > 6) return { error: `${group.label}最多上传 6 个文件` };
    const invalid = files.find((file) => !(file.type.startsWith("image/") || file.type === "application/pdf" || /\.(?:jpe?g|png|webp|heic|pdf)$/i.test(file.name)));
    if (invalid) return { error: `${group.label}仅支持图片或 PDF` };
    const oversized = files.find((file) => file.size > 10 * 1024 * 1024);
    if (oversized) return { error: `${group.label}单个文件不能超过 10 MB` };
    if (files.length) {
      changed = true;
      replacedIds.push(...current[group.key].map((item) => item.id).filter(Boolean));
      next[group.key] = files.map((file, index) => {
        const attachment = {
          id: `credential-${state.currentDriverId}-${group.key}-${Date.now()}-${index}-${Math.random().toString(36).slice(2)}`,
          name: file.name,
          type: file.type || "application/octet-stream",
          uploadedAt: window.DispatchStore.nowText(),
        };
        pendingBlobs.push({ id: attachment.id, blob: file });
        return attachment;
      });
    } else if (removeExisting) {
      changed = true;
      replacedIds.push(...current[group.key].map((item) => item.id).filter(Boolean));
      next[group.key] = [];
    }
    if (requireAll && !next[group.key].length) return { error: `请上传${group.label}` };
  }

  if (pendingBlobs.length) await window.DispatchStore.savePhotos(pendingBlobs);
  if (replacedIds.length) await window.DispatchStore.deletePhotos(replacedIds).catch(() => {});
  certification.attachments = next;
  syncCredentialAttachmentNames(certification);
  return { changed };
}

function loadExpenses() {
  try {
    const stored = JSON.parse(localStorage.getItem(EXPENSE_STORAGE_KEY) || "[]");
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
}

function saveExpenses(expenses) {
  localStorage.setItem(EXPENSE_STORAGE_KEY, JSON.stringify(expenses));
}

function loadAnnouncements() {
  try {
    const stored = JSON.parse(localStorage.getItem(ANNOUNCEMENT_STORAGE_KEY) || "[]");
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
}

function currentDriverAnnouncements() {
  const driverId = state.currentDriverId;
  return loadAnnouncements()
    .filter((item) => item?.status === "已发布" && (item.scope === "全部司机" || item.targetDriverIds?.includes(driverId)))
    .sort((left, right) => String(right.publishedAt || "").localeCompare(String(left.publishedAt || "")));
}

function loadReadDriverMessageIds() {
  try {
    const stored = JSON.parse(localStorage.getItem(DRIVER_MESSAGE_READ_STORAGE_KEY) || "{}");
    return stored && typeof stored === "object" && !Array.isArray(stored) ? stored : {};
  } catch {
    return {};
  }
}

function driverMessages() {
  const readByDriver = loadReadDriverMessageIds();
  const readIds = new Set(readByDriver[state.currentDriverId] || []);
  const messages = [];
  const dispatches = driverDispatches();
  const pendingDispatches = dispatches
    .filter((item) => item.status === "已派单")
    .sort((left, right) => String(right.dispatchTime || "").localeCompare(String(left.dispatchTime || "")));
  const activeDispatches = dispatches
    .filter((item) => item.status === "运输中" && item.currentNode)
    .sort((left, right) => String(right.dispatchTime || "").localeCompare(String(left.dispatchTime || "")));

  pendingDispatches.slice(0, 2).forEach((item) => messages.push({
    id: `task-${item.id}`,
    type: "task",
    title: "收到新的运输任务",
    desc: `${item.waybillNo} · ${item.routeName}，请及时查看任务并确认接单。`,
    time: String(item.dispatchTime || "今天").replace("T", " ").slice(0, 16),
    dispatchId: item.id,
    icon: "clipboard-list",
  }));

  activeDispatches.slice(0, 2).forEach((item) => messages.push({
    id: `node-${item.id}-${item.currentNode}`,
    type: "task",
    title: "运输节点已同步",
    desc: `${item.waybillNo} 当前节点：${item.currentNode}。`,
    time: String(item.updateTime || item.dispatchTime || "今天").replace("T", " ").slice(0, 16),
    dispatchId: item.id,
    icon: "map-pinned",
  }));

  const driver = currentDriver();
  [
    { label: "驾驶证", date: driver.licenseExpiry },
    { label: "道路运输从业资格证", date: driver.qualificationExpiry },
  ].forEach((document) => {
    const remaining = daysUntil(document.date);
    if (remaining > 30) return;
    messages.push({
      id: `warning-${state.currentDriverId}-${document.label}`,
      type: "warning",
      title: remaining < 0 ? `${document.label}已过期` : `${document.label}即将到期`,
      desc: remaining < 0 ? `证件有效期至 ${document.date}，请尽快办理更新。` : `证件将在 ${remaining} 天后到期，请及时办理更新。`,
      time: "证件提醒",
      icon: "triangle-alert",
    });
  });

  const announcements = [DEMO_DRIVER_ANNOUNCEMENT, ...currentDriverAnnouncements()];
  announcements.forEach((item, index) => messages.push({
    id: item.id || `announcement-${state.currentDriverId}-${index}`,
    type: "announcement",
    title: item.title || "司机公告",
    desc: item.content || "有一条新公告，请查看。",
    time: item.publishedAt || "刚刚",
    attachment: item.attachment,
    icon: "megaphone",
  }));

  return messages.map((item) => ({ ...item, unread: !readIds.has(item.id) }));
}

function saveDriverMessageReadIds(readIds) {
  const stored = loadReadDriverMessageIds();
  stored[state.currentDriverId] = [...new Set(readIds)];
  localStorage.setItem(DRIVER_MESSAGE_READ_STORAGE_KEY, JSON.stringify(stored));
}

function renderDriverMessages() {
  const messages = driverMessages();
  const unreadCount = messages.filter((item) => item.unread).length;
  const filter = state.driverMessageFilter;
  const filteredMessages = messages.filter((item) => filter === "all" || item.type === filter);
  const badge = document.querySelector("#navMessageBadge");
  const profileBadge = document.querySelector("#messageBadge");
  document.querySelector("#driverUnreadSummary").textContent = `${unreadCount} 条未读消息`;
  badge.textContent = String(unreadCount);
  badge.hidden = unreadCount === 0;
  if (profileBadge) {
    profileBadge.textContent = String(unreadCount);
    profileBadge.hidden = unreadCount === 0;
  }
  document.querySelector("#driverMessageList").innerHTML = filteredMessages.length
    ? filteredMessages.map((item) => `
      <button class="driver-message-item ${item.unread ? "unread" : ""} message-${item.type}" data-driver-message-id="${h(item.id)}" ${item.dispatchId ? `data-message-dispatch-id="${h(item.dispatchId)}"` : ""} type="button">
        <span class="driver-message-icon ${item.type}"><i data-lucide="${item.icon}"></i></span>
        <span class="driver-message-copy"><strong>${h(item.title)}</strong><p>${h(item.desc)}</p>${item.attachment ? `<small>附件：${h(item.attachment)}</small>` : ""}<time>${h(item.time)}</time></span>
        ${item.unread ? '<i class="driver-message-unread-dot" aria-label="未读"></i>' : ""}
      </button>`).join("")
    : `<div class="driver-message-empty">当前分类暂无消息</div>`;
  window.lucide?.createIcons();
}

function markDriverMessageRead(id) {
  const stored = loadReadDriverMessageIds();
  const readIds = new Set(stored[state.currentDriverId] || []);
  readIds.add(id);
  saveDriverMessageReadIds([...readIds]);
  renderDriverMessages();
}

function normalizeDemoDispatches(dispatches) {
  const result = dispatches.map((item) => ({ ...item, taskType: dispatchTaskType(item) }));
  const seedById = new Map(dispatchSeed.map((item) => [item.id, item]));
  const existingIds = new Set(result.map((item) => item.id));

  dispatchSeed.forEach((item) => {
    if (!existingIds.has(item.id)) result.push({ ...item });
  });

  const restoreSeed = (id) => {
    const seed = seedById.get(id);
    const index = result.findIndex((item) => item.id === id);
    if (!seed) return;
    if (index === -1) result.push({ ...seed });
    else result[index] = { ...seed };
  };

  let pendingCount = result.filter((item) => item.driverId === DEFAULT_DRIVER_ID && item.status === "已派单").length;
  for (const id of DEFAULT_PENDING_IDS) {
    if (pendingCount >= 3) break;
    const current = result.find((item) => item.id === id);
    if (current?.status === "已派单") continue;
    restoreSeed(id);
    pendingCount += 1;
  }

  let orderCount = result.filter((item) => item.driverId === DEFAULT_DRIVER_ID && item.status !== "已派单" && item.currentNode !== "已拒绝").length;
  for (const id of DEFAULT_ORDER_IDS) {
    if (orderCount >= 3) break;
    const current = result.find((item) => item.id === id);
    if (current?.status !== "已派单" && current?.currentNode !== "已拒绝") continue;
    restoreSeed(id);
    orderCount += 1;
  }

  return result;
}

function loadDispatches() {
  const stored = window.DispatchStore.load(dispatchSeed);
  const normalized = normalizeDemoDispatches(stored);
  if (JSON.stringify(stored) !== JSON.stringify(normalized)) window.DispatchStore.save(normalized);
  return normalized;
}

function mergeDefaultExamples(incoming, current) {
  const incomingIds = new Set(incoming.map((item) => item.id));
  const missingExamples = current.filter((item) => DEFAULT_DEMO_IDS.has(item.id) && !incomingIds.has(item.id));
  return [...incoming, ...missingExamples].map((item) => ({ ...item, taskType: dispatchTaskType(item) }));
}

const state = {
  dispatches: loadDispatches(),
  currentDriverId: DEFAULT_DRIVER_ID,
  driverMessageFilter: "all",
  orderFilter: "all",
  orderStage: "all",
  orderSearch: "",
  activeDispatchId: "",
  activeProfilePage: "",
  activeExpenseType: "",
  activeFeedbackTab: "submit",
  fontSize: loadFontSize(),
  expenses: loadExpenses(),
  repairs: window.VehicleRepair.load(),
  certifications: loadCertifications(),
};

const elements = {
  header: document.querySelector("#mobileHeader"),
  title: document.querySelector("#mobileTitle"),
  tasksView: document.querySelector("#tasksView"),
  ordersView: document.querySelector("#ordersView"),
  messagesView: document.querySelector("#messagesView"),
  profileView: document.querySelector("#profileView"),
  bottomNav: document.querySelector("#bottomNav"),
  taskList: document.querySelector("#taskList"),
  orderList: document.querySelector("#orderList"),
  detailView: document.querySelector("#detailView"),
  detailContent: document.querySelector("#detailContent"),
  detailActionBar: document.querySelector("#detailActionBar"),
  rejectDialog: document.querySelector("#rejectDialog"),
  progressDialog: document.querySelector("#progressDialog"),
  profileSubpage: document.querySelector("#profileSubpage"),
  subpageTitle: document.querySelector("#subpageTitle"),
  subpageContent: document.querySelector("#subpageContent"),
  toast: document.querySelector("#toast"),
};

function h(value) {
  return String(value ?? "").replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]);
}

function todayInputValue() {
  const date = new Date();
  const pad = (value) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function maskPhone(phone) {
  return String(phone).replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
}

function maskIdCard(idCard) {
  return String(idCard || "").replace(/^(\d{6})\d+(\w{4})$/, "$1********$2");
}

function maskCredential(value) {
  const text = String(value || "");
  return text.length > 7 ? `${text.slice(0, 3)}********${text.slice(-4)}` : text;
}

function dispatchTimeText(value) {
  return String(value || "-").replace("T", " ").slice(0, 16);
}

function currentDriver() {
  return drivers[state.currentDriverId] || drivers["SJ-1002"];
}

function currentCertification() {
  return state.certifications[state.currentDriverId] || { status: "unverified" };
}

function certificationMeta(status) {
  return {
    unverified: { label: "未认证", className: "unverified" },
    pending: { label: "审核中", className: "pending" },
    verified: { label: "已认证", className: "verified" },
    rejected: { label: "未通过", className: "rejected" },
  }[status] || { label: "未认证", className: "unverified" };
}

function expenseStatusMeta(status) {
  return {
    pending: { label: "待审核", className: "pending" },
    approved: { label: "已通过", className: "approved" },
    rejected: { label: "已驳回", className: "rejected" },
  }[status] || { label: "待审核", className: "pending" };
}

function driverDispatches() {
  return state.dispatches.filter((item) => item.driverId === state.currentDriverId);
}

function acceptedOrders() {
  return driverDispatches().filter((item) => item.status !== "已派单" && item.currentNode !== "已拒绝");
}

function dispatchCategory(dispatch) {
  if (dispatch.status === "已派单") return "pending";
  if (dispatch.status === "运输中") return "active";
  if (dispatch.status === "已完成") return "completed";
  return "cancelled";
}

function statusLabel(dispatch) {
  if (dispatch.status === "运输中") return dispatch.currentNode || "运输中";
  if (dispatch.status === "取消" && dispatch.currentNode === "已拒绝") return "已拒绝";
  return dispatch.status;
}

function statusDescription(dispatch) {
  const descriptions = {
    已派单: "调度已派单，请及时确认任务",
    已接单: "已确认接单，请前往提货地点",
    待提货: "请前往提货地点并按要求装柜",
    已提货: "货物已提取，请确认发车",
    在途: "运输进行中，请注意行车安全",
    已送达: "本次运输任务已顺利完成",
    已拒绝: "已将拒单原因同步给调度员",
    待派单: "派单已被取消",
  };
  return descriptions[dispatch.currentNode] || descriptions[dispatch.status] || "任务状态已同步";
}

function dispatchTaskType(dispatch) {
  const taskType = dispatch?.taskType || waybillMeta[dispatch?.waybillNo]?.taskType;
  return Object.prototype.hasOwnProperty.call(TASK_NODE_SEQUENCES, taskType) ? taskType : DEFAULT_TASK_TYPE;
}

function taskNodes(dispatch) {
  return TASK_NODE_SEQUENCES[dispatchTaskType(dispatch)];
}

function taskNodeIndex(dispatch, nodes = taskNodes(dispatch)) {
  const currentNode = String(dispatch.currentNode || "").trim();
  if (dispatch.status === "已完成" || ["已送达", "完成", "完成落重", "完成落空"].includes(currentNode)) return nodes.length - 1;
  const exactIndex = nodes.indexOf(currentNode);
  if (exactIndex >= 0) return exactIndex;

  const latestExactIndex = [...(dispatch.timeline || [])].reverse()
    .map((item) => nodes.indexOf(String(item.node || "").trim()))
    .find((index) => index >= 0);
  if (latestExactIndex !== undefined) return latestExactIndex;

  const taskType = dispatchTaskType(dispatch);
  const legacyNodeIndex = {
    已提货: 0,
    已提箱: 0,
    在途: Math.min(1, nodes.length - 1),
    装卸: taskType === "提空装货" || taskType === "提重送货" ? 3 : Math.min(1, nodes.length - 1),
    进站: taskType === "提空装货" || taskType === "提重送货" ? 5 : taskType === "排重箱（A→B）" ? 2 : Math.min(1, nodes.length - 1),
    落箱: nodes.length - 1,
  };
  return Object.prototype.hasOwnProperty.call(legacyNodeIndex, currentNode) ? legacyNodeIndex[currentNode] : -1;
}

function getTaskProgress(dispatch) {
  const nodes = taskNodes(dispatch);
  const currentIndex = taskNodeIndex(dispatch, nodes);
  const completedCount = dispatch.status === "已完成" ? nodes.length : Math.max(0, currentIndex + 1);
  const currentNode = dispatchCategory(dispatch) === "cancelled"
    ? "已取消"
    : currentIndex >= 0
      ? nodes[currentIndex]
      : dispatchCategory(dispatch) === "active" ? nodes[0] : "待执行";
  return {
    taskType: dispatchTaskType(dispatch),
    nodes,
    currentIndex,
    currentNode,
    completedCount,
    progress: Math.round(completedCount / nodes.length * 100),
  };
}

function renderTaskNodeOverview(dispatch) {
  const progress = getTaskProgress(dispatch);
  const position = `${progress.completedCount}/${progress.nodes.length}`;
  return `<section class="task-node-overview" aria-label="${h(`${progress.taskType}任务进度`)}"><div class="task-node-heading"><span>任务类型</span><strong>${h(progress.taskType)}</strong></div><div class="task-progress-meta"><span>当前节点 <b>${h(progress.currentNode)}</b></span><strong>${position}</strong></div><div class="task-progress-track" role="progressbar" aria-label="任务进度" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${progress.progress}"><i style="width:${progress.progress}%"></i></div></section>`;
}

function taskNodeActionState(dispatch, index) {
  const category = dispatchCategory(dispatch);
  if (category === "cancelled") return "cancelled";
  if (category === "pending") return "pending";
  if (category === "completed") return "completed";
  const currentIndex = getTaskProgress(dispatch).currentIndex;
  if (index <= currentIndex) return "completed";
  if (index === currentIndex + 1) return "actionable";
  return "upcoming";
}

function nodePhotoAttachments(dispatch, node) {
  return (dispatch.timeline || [])
    .filter((item) => item.node === node)
    .flatMap((item) => item.photoAttachments || []);
}

function renderTimelinePhotoTags(item) {
  const attachments = item.photoAttachments || [];
  if (attachments.length) {
    return attachments.map((photo) => `<button class="timeline-photo" data-view-photo data-photo-id="${h(photo.id)}" data-photo-node="${h(item.node)}" data-timeline-photo type="button"><span class="timeline-photo-frame"><span class="timeline-photo-placeholder" aria-hidden="true">照片</span></span><span class="timeline-photo-label">${h(photo.label || photo.name)}</span></button>`).join("");
  }
  return (item.photos || []).map((photo) => `<button class="timeline-photo" data-view-photo data-photo-node="${h(item.node)}" data-photo-name="${h(photo)}" type="button"><span class="timeline-photo-frame"><span class="timeline-photo-placeholder" aria-hidden="true">照片</span></span><span class="timeline-photo-label">${h(photo)}</span></button>`).join("");
}

function nextNode(dispatch) {
  const progress = getTaskProgress(dispatch);
  return progress.nodes[Math.min(progress.currentIndex + 1, progress.nodes.length - 1)];
}

function renderDetailActionBar(dispatch, category = dispatchCategory(dispatch)) {
  if (category === "pending") {
    return `<button class="danger" data-detail-action="reject" type="button">拒绝</button><button class="primary" data-detail-action="accept" type="button">确认接单</button>`;
  }
  if (category === "active") {
    const node = nextNode(dispatch);
    return `<button data-detail-action="contact" type="button">联系调度</button><button class="primary" data-detail-action="progress" data-node="${h(node)}" type="button">提交 ${h(node)}</button>`;
  }
  return `<button data-detail-action="copy" type="button">复制运单号</button><button class="primary" data-detail-action="back" type="button">返回运单列表</button>`;
}

function photoRequirementsForDispatch(dispatch) {
  return Array.isArray(dispatch.photoRequirements)
    ? dispatch.photoRequirements
    : window.PhotoRequirementConfig.forTaskType(dispatchTaskType(dispatch));
}

function uploadedPhotosForRequirement(dispatch, requirement) {
  return (dispatch.timeline || []).flatMap((item) => item.photoAttachments || []).filter((photo) =>
    photo.requirementId === requirement.id
      || (!photo.requirementId && (photo.requirementName || photo.label) === requirement.name));
}

function requirementPhotoProgress(dispatch) {
  return photoRequirementsForDispatch(dispatch).reduce((progress, requirement) => {
    const required = Number(requirement.quantity) || 0;
    const uploaded = Math.min(required, uploadedPhotosForRequirement(dispatch, requirement).length);
    progress.required += required;
    progress.uploaded += uploaded;
    return progress;
  }, { required: 0, uploaded: 0 });
}

function missingPhotoCount(photoInputs) {
  return photoInputs.filter((input) => !input.files?.length).length;
}

let photoViewerUrls = [];
let timelinePhotoUrls = [];
let timelinePhotoRenderId = 0;
let credentialInlineUrls = [];
let credentialInlineRenderId = 0;

function clearPhotoViewerUrls() {
  photoViewerUrls.forEach((url) => URL.revokeObjectURL(url));
  photoViewerUrls = [];
}

function clearCredentialInlineUrls() {
  credentialInlineUrls.forEach((url) => URL.revokeObjectURL(url));
  credentialInlineUrls = [];
  credentialInlineRenderId += 1;
}

function clearTimelinePhotoUrls() {
  timelinePhotoRenderId += 1;
  timelinePhotoUrls.forEach((url) => URL.revokeObjectURL(url));
  timelinePhotoUrls = [];
}

async function renderTimelinePhotoImages() {
  clearTimelinePhotoUrls();
  const renderId = timelinePhotoRenderId;
  const buttons = [...elements.detailContent.querySelectorAll("[data-timeline-photo]")];
  const loadedPhotos = await Promise.all(buttons.map(async (button) => ({
    button,
    blob: await window.DispatchStore.getPhoto(button.dataset.photoId).catch(() => null),
  })));
  if (renderId !== timelinePhotoRenderId) return;
  loadedPhotos.forEach(({ button, blob }) => {
    if (!blob || !button.isConnected) return;
    const imageUrl = URL.createObjectURL(blob);
    timelinePhotoUrls.push(imageUrl);
    const frame = button.querySelector(".timeline-photo-frame");
    const image = document.createElement("img");
    image.src = imageUrl;
    image.alt = button.querySelector(".timeline-photo-label").textContent;
    frame.replaceChildren(image);
  });
}

function positionPhotoViewer() {
  const shell = document.querySelector(".phone-shell");
  const dialog = document.querySelector("#photoViewerDialog");
  if (!shell || !dialog) return;
  const bounds = shell.getBoundingClientRect();
  dialog.style.setProperty("--viewer-left", `${bounds.left}px`);
  dialog.style.setProperty("--viewer-bottom", `${Math.max(0, window.innerHeight - bounds.bottom)}px`);
  dialog.style.setProperty("--viewer-width", `${bounds.width}px`);
  dialog.style.setProperty("--viewer-height", `${bounds.height}px`);
}

function renderPhotoPlaceholder(photo) {
  const label = photo.label || photo.name || "节点照片";
  return `<figure class="photo-viewer-item photo-viewer-placeholder"><div class="photo-placeholder-mark" aria-hidden="true">▧</div><strong>演示占位照片</strong><span>${h(label)}</span></figure>`;
}

async function openPhotoViewer(dispatchId, node, selectedPhotoId = "", selectedPhotoName = "") {
  const dispatch = state.dispatches.find((item) => item.id === dispatchId);
  if (!dispatch) return;
  let attachments = nodePhotoAttachments(dispatch, node)
    .filter((photo) => !selectedPhotoId || photo.id === selectedPhotoId);
  if (!attachments.length) {
    const legacyPhotos = (dispatch.timeline || [])
      .filter((item) => item.node === node)
      .flatMap((item) => item.photos || [])
      .filter((name) => !selectedPhotoName || name === selectedPhotoName);
    const configuredLabels = photoRequirementsForDispatch(dispatch).flatMap((requirement) =>
      Array.from({ length: Number(requirement.quantity) || 0 }, (_, index) => `${requirement.name} ${index + 1}/${requirement.quantity}`));
    const photoLabels = legacyPhotos.length ? legacyPhotos : configuredLabels.length ? configuredLabels : [`${node}照片 1`, `${node}照片 2`, `${node}照片 3`];
    attachments = photoLabels.map((label, index) => ({ id: `placeholder-${index}`, label, placeholder: true }));
  }

  const dialog = document.querySelector("#photoViewerDialog");
  const content = document.querySelector("#photoViewerGrid");
  document.querySelector("#photoViewerTitle").textContent = `${node} · ${attachments.length} 张照片`;
  content.innerHTML = `<p class="photo-viewer-loading">正在加载图片</p>`;
  clearPhotoViewerUrls();
  positionPhotoViewer();
  dialog.showModal();

  const loadedPhotos = await Promise.all(attachments.map(async (photo) => ({
    ...photo,
    blob: photo.placeholder ? null : await window.DispatchStore.getPhoto(photo.id).catch(() => null),
  })));
  if (!dialog.open) return;
  content.innerHTML = loadedPhotos.map((photo) => {
    if (!photo.blob) return renderPhotoPlaceholder(photo);
    const url = URL.createObjectURL(photo.blob);
    photoViewerUrls.push(url);
    return `<figure class="photo-viewer-item"><img src="${url}" alt="${h(photo.label || photo.name)}" /><figcaption><strong>${h(photo.label || photo.name)}</strong><span>${h(photo.name)}</span></figcaption></figure>`;
  }).join("");
}

async function openCredentialPreview(button) {
  const id = button.dataset.credentialId;
  const name = button.dataset.credentialName || "证件附件";
  if (!id) {
    showToast("该历史附件仅保留文件名，请重新上传后预览");
    return;
  }
  const dialog = document.querySelector("#photoViewerDialog");
  const content = document.querySelector("#photoViewerGrid");
  document.querySelector("#photoViewerTitle").textContent = name;
  content.innerHTML = `<p class="photo-viewer-loading">正在加载附件</p>`;
  clearPhotoViewerUrls();
  positionPhotoViewer();
  dialog.showModal();
  const blob = await window.DispatchStore.getPhoto(id).catch(() => null);
  if (!dialog.open) return;
  if (!blob) {
    content.innerHTML = `<div class="credential-preview-empty"><strong>附件无法读取</strong><span>请关闭后重新上传该证件</span></div>`;
    return;
  }
  const url = URL.createObjectURL(blob);
  photoViewerUrls.push(url);
  const type = button.dataset.credentialType || blob.type || "";
  content.innerHTML = type === "application/pdf" || name.toLowerCase().endsWith(".pdf")
    ? `<iframe class="credential-pdf-preview" src="${url}" title="${h(name)}"></iframe>`
    : `<figure class="photo-viewer-item credential-image-preview"><img src="${url}" alt="${h(name)}" /><figcaption><strong>${h(name)}</strong><span>证件附件预览</span></figcaption></figure>`;
}

function openSelectedCredentialPreview(input) {
  const files = Array.from(input?.files || []);
  if (!files.length) return;
  const file = files[0];
  const dialog = document.querySelector("#photoViewerDialog");
  const content = document.querySelector("#photoViewerGrid");
  document.querySelector("#photoViewerTitle").textContent = files.length > 1 ? `${file.name} 等 ${files.length} 份` : file.name;
  clearPhotoViewerUrls();
  positionPhotoViewer();
  dialog.showModal();
  const url = URL.createObjectURL(file);
  photoViewerUrls.push(url);
  content.innerHTML = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")
    ? `<iframe class="credential-pdf-preview" src="${url}" title="${h(file.name)}"></iframe>`
    : `<figure class="photo-viewer-item credential-image-preview"><img src="${url}" alt="${h(file.name)}" /><figcaption><strong>${h(file.name)}</strong><span>待提交证件预览</span></figcaption></figure>`;
}

function renderProgressPhotoRequirements(dispatch, node) {
  const requirements = photoRequirementsForDispatch(dispatch);
  const section = document.querySelector("#photoRequirements");
  const list = document.querySelector("#photoSlotList");
  const hint = document.querySelector("#photoRequirementsHint");
  const count = document.querySelector("#photoRequirementsCount");
  section.hidden = requirements.length === 0;
  if (!requirements.length) {
    list.innerHTML = "";
    return;
  }
  const progress = requirementPhotoProgress(dispatch);
  document.querySelector("#photoRequirementsTitle").textContent = `任务拍照要求 · ${progress.uploaded}/${progress.required} 张已上传`;
  count.textContent = `${progress.uploaded}/${progress.required}`;
  const isFinalNode = node === taskNodes(dispatch).at(-1);
  section.dataset.finalNode = String(isFinalNode);
  hint.textContent = isFinalNode
    ? "请补齐所有拍照要求后完成任务。"
    : "照片可随任务进度分批上传，任务完成前需满足全部数量。";
  list.innerHTML = requirements.map((requirement) => {
    const required = Number(requirement.quantity) || 0;
    const existingCount = uploadedPhotosForRequirement(dispatch, requirement).length;
    const uploadedCount = Math.min(required, existingCount);
    const remaining = Math.max(0, required - uploadedCount);
    const slots = Array.from({ length: remaining }, (_, index) => {
      const slotNumber = uploadedCount + index + 1;
      return `<label class="photo-slot"><input data-photo-slot data-photo-requirement-id="${h(requirement.id)}" data-photo-requirement-name="${h(requirement.name)}" data-photo-requirement-description="${h(requirement.description || "")}" data-photo-slot-number="${slotNumber}" data-photo-label="${h(requirement.name)}" type="file" accept="image/*" capture="environment" /><span class="photo-slot-index">${String(slotNumber).padStart(2, "0")}</span><span class="photo-slot-copy"><strong>拍摄第 ${slotNumber} 张</strong><small>点击拍照或从相册选择</small></span><span class="photo-slot-state">待拍</span></label>`;
    }).join("");
    return `<section class="photo-requirement-group"><div class="photo-requirement-group-heading"><div><strong>${h(requirement.name)}</strong><p>${h(requirement.description || "")}</p></div><span>${uploadedCount}/${required} 张</span></div>${slots ? `<div class="photo-slot-list">${slots}</div>` : `<p class="photo-requirement-complete">该项照片已齐</p>`}</section>`;
  }).join("");
}

function updateProgressPhotoCount() {
  const inputs = [...document.querySelectorAll("#photoSlotList [data-photo-slot]")];
  const dispatch = state.dispatches.find((item) => item.id === state.activeDispatchId);
  const existing = dispatch ? requirementPhotoProgress(dispatch) : { uploaded: 0, required: 0 };
  const selectedCount = inputs.length - missingPhotoCount(inputs);
  const count = document.querySelector("#photoRequirementsCount");
  if (count) count.textContent = `${existing.uploaded + selectedCount}/${existing.required}`;
  const title = document.querySelector("#photoRequirementsTitle");
  if (title) title.textContent = `任务拍照要求 · ${existing.uploaded + selectedCount}/${existing.required} 张已上传`;
  inputs.forEach((input) => {
    const slot = input.closest(".photo-slot");
    const state = slot.querySelector(".photo-slot-state");
    const copy = slot.querySelector(".photo-slot-copy small");
    const file = input.files?.[0];
    slot.classList.toggle("selected", Boolean(file));
    state.textContent = file ? "已选择" : "待拍";
    copy.textContent = file ? file.name : `第 ${input.dataset.photoSlotNumber} 张 · 点击拍照或从相册选择`;
  });
}

function isTaskAwaitingStart(dispatch) {
  return dispatch.status === "运输中" && getTaskProgress(dispatch).currentIndex < 0;
}

function isTaskInProgress(dispatch) {
  return dispatch.status === "运输中" && getTaskProgress(dispatch).currentIndex >= 0;
}

function taskCard(dispatch) {
  const category = dispatchCategory(dispatch);
  return `
    <article class="task-card" data-dispatch-card="${h(dispatch.id)}">
      <div class="task-card-header">
        <div class="task-title-group">
          <strong class="task-route-name">${h(dispatch.routeName)}</strong>
          <span class="task-number">运单号 ${h(dispatch.waybillNo)}</span>
        </div>
        <span class="status-badge ${category}">${h(statusLabel(dispatch))}</span>
      </div>
      <div class="dispatch-time"><span>派单时间</span><strong>${h(dispatch.dispatchTime || "-")}</strong></div>
      <div class="route-block">
        <div class="route-track"><i class="route-dot"></i><i class="route-dot end"></i></div>
        <div class="route-points">
          <div class="route-point"><span>提箱地</span><strong>${h(dispatch.origin)}</strong></div>
          <div class="route-point"><span>装卸地</span><strong>${h(dispatch.destination)}</strong></div>
        </div>
      </div>
      <div class="task-meta">
        <span class="meta-chip">车 ${h(dispatch.vehicleId || "待分配")}</span>
        <span class="meta-chip">箱 ${h(dispatch.boxes)}</span>
      </div>
      <div class="task-meta task-extra-meta"><span>收货人 ${h(dispatch.consignee || "-")}</span><span>到达时间 ${h(String(dispatch.arrivalTime || "-").replace("T", " ").slice(0, 16))}</span><span>到达地点 ${h(dispatch.arrivalLocation || "-")}</span><span>还箱地 ${h(dispatch.loadAddress || "-")}</span></div>
      ${renderTaskNodeOverview(dispatch)}
      ${dispatch.note ? `<p class="task-note">备注：${h(dispatch.note)}</p>` : ""}
      <div class="task-card-actions">
        <button class="card-button" data-action="detail" data-id="${h(dispatch.id)}" type="button">查看详情</button>
        ${category === "pending" ? `<button class="card-button primary" data-action="accept" data-id="${h(dispatch.id)}" type="button">立即接单</button>` : ""}
        ${category === "active" ? `<button class="card-button soft" data-action="progress" data-id="${h(dispatch.id)}" type="button">更新进度</button>` : ""}
      </div>
    </article>`;
}

function emptyState(title, description) {
  return `<div class="empty-state"><div class="empty-illustration">✓</div><strong>${h(title)}</strong><p>${h(description)}</p></div>`;
}

function renderTasks() {
  const rows = driverDispatches().filter((item) => dispatchCategory(item) === "pending");
  elements.taskList.innerHTML = rows.length ? rows.map(taskCard).join("") : emptyState("暂无待接订单", "新派单到达后会在这里显示");
}

function orderCard(dispatch) {
  const category = dispatchCategory(dispatch);
  const progressAction = category === "active"
    ? `<button class="order-progress-action" data-action="progress" data-id="${h(dispatch.id)}" data-node="${h(nextNode(dispatch))}" type="button">提交 ${h(nextNode(dispatch))}</button>`
    : "";
  return `
    <article class="order-card" data-action="detail" data-id="${h(dispatch.id)}">
      <div class="order-card-top"><strong>${h(dispatch.waybillNo)}</strong><span class="status-badge ${category}">${h(statusLabel(dispatch))}</span></div>
      <div class="order-route">${h(dispatch.origin)}<span>→</span>${h(dispatch.destination)}</div>
      <div class="order-info"><span>派单时间　<b>${h(String(dispatch.dispatchTime || "-").replace("T", " ").slice(0, 16))}</b></span><span>车辆　<b>${h(dispatch.vehicleId || "-")}</b></span><span>箱信息　<b>${h(dispatch.boxes)}</b></span><span>收货人　<b>${h(dispatch.consignee || "-")}</b></span><span>到达时间　<b>${h(String(dispatch.arrivalTime || "-").replace("T", " ").slice(0, 16))}</b></span><span>到达地点　<b>${h(dispatch.arrivalLocation || "-")}</b></span><span class="order-info-full">还箱地　<b>${h(dispatch.loadAddress || "-")}</b></span></div>
      ${renderTaskNodeOverview(dispatch)}
      <div class="order-card-actions"><button class="order-contact-action" data-action="contact" data-id="${h(dispatch.id)}" type="button">联系调度</button>${progressAction}</div>
    </article>`;
}

function renderOrders() {
  const keyword = state.orderSearch.toLowerCase();
  const rows = driverDispatches().filter((item) => {
    const isAcceptedOrder = item.status !== "已派单" && item.currentNode !== "已拒绝";
    const matchedStatus = state.orderFilter === "all" || dispatchCategory(item) === state.orderFilter;
    const matchedStage = state.orderStage === "all"
      || (state.orderStage === "pickup" && isTaskAwaitingStart(item))
      || (state.orderStage === "transit" && isTaskInProgress(item))
      || (state.orderStage === "completed" && item.status === "已完成");
    const searchText = `${item.waybillNo} ${item.routeName} ${item.boxes} ${item.origin} ${item.destination} ${dispatchTaskType(item)}`.toLowerCase();
    return isAcceptedOrder && matchedStatus && matchedStage && searchText.includes(keyword);
  });
  elements.orderList.innerHTML = rows.length ? rows.map(orderCard).join("") : emptyState("没有找到运单", "请调整状态筛选或搜索关键词");
}

function daysUntil(dateText) {
  const today = new Date();
  const date = new Date(`${dateText}T00:00:00`);
  return Math.ceil((date - today) / 86400000);
}

function renderProfile() {
  const driver = currentDriver();
  const certification = currentCertification();
  const certificationView = certificationMeta(certification.status);
  const orders = acceptedOrders();
  const pickup = orders.filter(isTaskAwaitingStart).length;
  const transit = orders.filter(isTaskInProgress).length;
  const completed = orders.filter((item) => item.status === "已完成").length;
  const currentVehicleDispatch = driverDispatches().find((item) => item.vehicleId && item.status === "运输中")
    || driverDispatches().find((item) => item.vehicleId);
  const plateNo = currentVehicleDispatch?.vehicleId || "";
  const vehicle = vehicles[plateNo];
  document.querySelector("#profileAvatar").textContent = driver.name.slice(0, 1);
  document.querySelector("#profileName").textContent = driver.name;
  document.querySelector("#profileMeta").textContent = `${driver.capacityOwnership || "自营"} · ${driver.organizationName || "本公司"} · ${driver.fleet}`;
  document.querySelector("#profilePhone").textContent = maskPhone(driver.phone);
  const profileBadge = document.querySelector("#profileCertificationBadge");
  profileBadge.textContent = certificationView.label;
  profileBadge.className = certificationView.className;
  document.querySelector("#profileVehiclePlate").textContent = plateNo || "暂未分配";
  document.querySelector("#profileVehicleDescription").textContent = vehicle
    ? `${vehicle.type || "车辆"} · ${vehicle.state || "状态待同步"}`
    : "暂无车辆信息";
  renderDriverMessages();
  document.querySelector("#profileOrderStats").innerHTML = `
    <button data-order-stage="all" type="button"><strong>${orders.length}</strong><span>全部运单</span></button>
    <button data-order-stage="pickup" type="button"><strong>${pickup}</strong><span>待执行</span></button>
    <button data-order-stage="transit" type="button"><strong>${transit}</strong><span>运输中</span></button>
    <button data-order-stage="completed" type="button"><strong>${completed}</strong><span>已完成</span></button>`;
}

function infoRows(rows) {
  return rows.map((row) => `
    <div class="info-row ${row.action ? "action-row" : ""}" ${row.action ? `data-subpage-action="${h(row.action)}"` : ""}>
      <span>${h(row.label)}</span><strong>${h(row.value)}</strong>${row.status ? `<em class="status-pill ${row.warning ? "warning" : ""}">${h(row.status)}</em>` : ""}${row.action ? "<b>›</b>" : ""}
    </div>`).join("");
}

function documentStatus(date) {
  const remaining = daysUntil(date);
  if (remaining < 0) return { text: "已过期", warning: true };
  if (remaining <= 30) return { text: `${remaining}天到期`, warning: true };
  return { text: "有效", warning: false };
}

function renderDriverRepairHistory() {
  const records = state.repairs.filter((item) => item.reporterId === state.currentDriverId)
    .sort((left, right) => String(right.reportedAt).localeCompare(String(left.reportedAt)));
  if (!records.length) return '<section class="info-section repair-history"><h2>我的报修</h2><div class="repair-history-empty">提交后的报修记录会显示在这里</div></section>';
  return `<section class="info-section repair-history"><h2>我的报修</h2>${records.slice(0, 8).map((item) => `<article class="repair-history-row"><div><strong>${h(item.plateNo)} · ${h(item.category)}</strong><span>${h(String(item.reportedAt || "").replace("T", " ").slice(0, 16))} · ${h(item.repairLocation || "地点待补充")}</span><small>${h(item.description)}</small>${item.evidence?.length ? `<small>凭证：${h(item.evidence.map((file) => typeof file === "string" ? file : file.name).join("、"))}</small>` : ""}</div><em class="repair-history-status ${item.status === "已完成" ? "done" : item.status === "已取消" ? "cancelled" : item.status === "维修中" ? "working" : "pending"}">${h(item.status)}</em></article>`).join("")}</section>`;
}

function credentialGroupDetails(group, driver) {
  if (group.key === "idCardFront" || group.key === "idCardBack") return `身份证号：${maskIdCard(driver.idCard)}`;
  if (group.key === "licenseAttachment") return `证号：${maskCredential(driver.licenseNo)} · ${driver.licenseClass || "-"} · 有效期至 ${driver.licenseExpiry || "-"}`;
  return `证号：${maskCredential(driver.qualificationNo)} · 有效期至 ${driver.qualificationExpiry || "-"}`;
}

function credentialDocumentsMarkup(certification, driver, { compact = false } = {}) {
  const attachments = credentialAttachmentMap(certification);
  return `<div class="credential-document-list ${compact ? "compact" : ""}">${CERTIFICATION_DOCUMENT_GROUPS.map((group) => {
    const files = attachments[group.key];
    return `<article class="credential-document-card">
      <header><div><strong>${h(group.label)}</strong><span>${h(credentialGroupDetails(group, driver))}</span></div><em>${files.length ? `${files.length} 份附件` : "待上传"}</em></header>
      <div class="credential-attachment-list">${files.length ? files.map((file) => `
        <button type="button" data-preview-credential data-credential-id="${h(file.id)}" data-credential-name="${h(file.name)}" data-credential-type="${h(file.type)}">
          <i data-lucide="${file.type === "application/pdf" ? "file-text" : "image"}"></i><span>${h(file.name)}</span><b>预览</b>
        </button>`).join("") : `<span class="credential-empty">暂未上传电子附件</span>`}</div>
    </article>`;
  }).join("")}</div>`;
}

function credentialEmptyStageMarkup(group, inputId) {
  return `<label class="credential-card-empty" for="${h(inputId)}">
    <i data-lucide="camera"></i><strong>点击上传${h(group.label)}</strong><span>请确保证件完整、清晰、无反光</span>
  </label>`;
}

function credentialCardActionsMarkup(inputId, hasFiles) {
  return hasFiles
    ? `<label for="${h(inputId)}"><i data-lucide="refresh-cw"></i>重新上传</label><button data-remove-credential-group type="button"><i data-lucide="trash-2"></i>删除</button>`
    : `<span>支持图片或 PDF，单个文件不超过 10 MB</span>`;
}

function credentialUploadCardsMarkup(certification) {
  const attachments = credentialAttachmentMap(certification);
  return `<div class="credential-upload-grid credential-upload-card-grid">${CERTIFICATION_DOCUMENT_GROUPS.map((group) => {
    const files = attachments[group.key];
    const first = files[0];
    const inputId = `credential-upload-${group.key}`;
    return `<article class="credential-upload-card ${files.length ? "has-files" : ""}" data-credential-upload-card data-credential-group="${h(group.key)}" data-remove-existing="false">
      <header><strong>${h(group.label)}</strong><em>${files.length ? `已上传 ${files.length} 份` : "必传"}</em></header>
      <input id="${h(inputId)}" name="${h(group.key)}" type="file" accept="${h(group.accept)}" multiple ${files.length ? "" : "required"} />
      <div class="credential-card-stage" data-credential-stage>${first ? `<button class="credential-card-preview" data-preview-credential data-credential-id="${h(first.id)}" data-credential-name="${h(first.name)}" data-credential-type="${h(first.type)}" type="button">
        <span class="credential-card-asset" data-credential-inline-asset data-credential-id="${h(first.id)}" data-credential-name="${h(first.name)}" data-credential-type="${h(first.type)}"><i data-lucide="${first.type === "application/pdf" ? "file-text" : "image"}"></i></span>
        <span class="credential-card-preview-copy"><strong>${h(first.name)}</strong><small>点击查看大图${files.length > 1 ? ` · 共 ${files.length} 份` : ""}</small></span>
      </button>` : credentialEmptyStageMarkup(group, inputId)}</div>
      <footer data-credential-actions>${credentialCardActionsMarkup(inputId, files.length > 0)}</footer>
    </article>`;
  }).join("")}</div>`;
}

function credentialPreviewCardsMarkup(certification) {
  const attachments = credentialAttachmentMap(certification);
  return `<div class="credential-upload-grid credential-upload-card-grid credential-readonly-grid">${CERTIFICATION_DOCUMENT_GROUPS.map((group) => {
    const files = attachments[group.key];
    const first = files[0];
    return `<article class="credential-upload-card ${files.length ? "has-files" : ""}">
      <header><strong>${h(group.label)}</strong><em>${files.length ? `${files.length} 份` : "待上传"}</em></header>
      <div class="credential-card-stage">${first ? `<button class="credential-card-preview" data-preview-credential data-credential-id="${h(first.id)}" data-credential-name="${h(first.name)}" data-credential-type="${h(first.type)}" type="button">
        <span class="credential-card-asset" data-credential-inline-asset data-credential-id="${h(first.id)}" data-credential-name="${h(first.name)}" data-credential-type="${h(first.type)}"><i data-lucide="${first.type === "application/pdf" ? "file-text" : "image"}"></i></span>
        <span class="credential-card-preview-copy"><strong>${h(first.name)}</strong><small>点击查看大图${files.length > 1 ? ` · 共 ${files.length} 份` : ""}</small></span>
      </button>` : `<div class="credential-card-empty readonly"><i data-lucide="image-off"></i><strong>暂未上传</strong><span>${h(group.label)}</span></div>`}</div>
    </article>`;
  }).join("")}</div>`;
}

async function hydrateCredentialInlinePreviews() {
  const renderId = ++credentialInlineRenderId;
  const assets = Array.from(elements.subpageContent.querySelectorAll("[data-credential-inline-asset][data-credential-id]"));
  await Promise.all(assets.map(async (asset) => {
    const id = asset.dataset.credentialId;
    const name = asset.dataset.credentialName || "证件附件";
    const type = asset.dataset.credentialType || "";
    if (!id || type === "application/pdf" || name.toLowerCase().endsWith(".pdf")) return;
    const blob = await window.DispatchStore.getPhoto(id).catch(() => null);
    if (!blob || renderId !== credentialInlineRenderId || !asset.isConnected) return;
    const url = URL.createObjectURL(blob);
    credentialInlineUrls.push(url);
    asset.innerHTML = `<img src="${url}" alt="${h(name)}" />`;
  }));
}

function renderSelectedCredentialCard(input) {
  const card = input.closest("[data-credential-upload-card]");
  const group = CERTIFICATION_DOCUMENT_GROUPS.find((item) => item.key === input.name);
  if (!card || !group) return;
  const files = Array.from(input.files || []);
  const stage = card.querySelector("[data-credential-stage]");
  const actions = card.querySelector("[data-credential-actions]");
  if (!files.length) {
    card.classList.remove("has-files");
    card.querySelector("header em").textContent = "必传";
    stage.innerHTML = credentialEmptyStageMarkup(group, input.id);
    actions.innerHTML = credentialCardActionsMarkup(input.id, false);
    window.lucide?.createIcons();
    return;
  }
  const first = files[0];
  const isPdf = first.type === "application/pdf" || first.name.toLowerCase().endsWith(".pdf");
  let assetMarkup = `<i data-lucide="file-text"></i>`;
  if (!isPdf) {
    const url = URL.createObjectURL(first);
    credentialInlineUrls.push(url);
    assetMarkup = `<img src="${url}" alt="${h(first.name)}" />`;
  }
  card.dataset.removeExisting = "false";
  card.classList.add("has-files");
  input.required = false;
  card.querySelector("header em").textContent = `待提交 ${files.length} 份`;
  stage.innerHTML = `<button class="credential-card-preview" data-preview-selected-credential type="button"><span class="credential-card-asset">${assetMarkup}</span><span class="credential-card-preview-copy"><strong>${h(first.name)}</strong><small>点击预览${files.length > 1 ? ` · 共 ${files.length} 份` : ""}</small></span></button>`;
  actions.innerHTML = credentialCardActionsMarkup(input.id, true);
  window.lucide?.createIcons();
}

function renderCertificationForm(certification) {
  clearCredentialInlineUrls();
  const driver = currentDriver();
  const statusNotice = certification.status === "rejected"
    ? `<div class="certification-notice rejected"><strong>审核未通过</strong><br>${h(certification.reason || "认证资料不完整，请重新提交")}</div>`
    : certification.status === "unverified" ? `<div class="certification-notice">完成实名认证后才能接单，请确保上传的证件清晰、完整且在有效期内。</div>` : "";
  elements.subpageContent.innerHTML = `
    <div class="subpage-summary"><span class="subpage-summary-icon">认</span><div><strong>编辑认证资料</strong><span>上传新文件会替换对应证件原有附件</span></div></div>
    ${statusNotice}
    <form class="certification-form" id="certificationForm">
      <section class="info-section credential-upload-section"><h2>上传证件照片</h2>
        <div class="credential-upload-heading"><strong>请上传清晰完整的证件</strong><span>上传后可在当前页面直接预览</span></div>
        ${credentialUploadCardsMarkup(certification)}
      </section>
      <section class="info-section"><h2>身份与证件信息</h2>
        <label class="certification-field">真实姓名<input name="name" value="${h(driver.name)}" readonly /></label>
        <label class="certification-field">身份证号码<input name="idCard" value="${h(driver.idCard)}" required /></label>
        <label class="certification-field">手机号码<input name="phone" value="${h(driver.phone)}" inputmode="tel" maxlength="11" required /></label>
        <label class="certification-field">驾驶证号<input name="licenseNo" value="${h(driver.licenseNo)}" required /></label>
        <label class="certification-field">准驾车型<input name="licenseClass" value="${h(driver.licenseClass)}" required /></label>
        <label class="certification-field">从业资格证号<input name="qualificationNo" value="${h(driver.qualificationNo)}" required /></label>
      </section>
      <div class="certification-change-notice">提交修改后认证状态将变为待审核，审核期间暂时无法接单。</div>
      <button class="subpage-primary" type="submit">提交认证审核</button>
      <button class="subpage-secondary" data-subpage-action="cancel-certification-edit" type="button">取消修改</button>
    </form>`;
  hydrateCredentialInlinePreviews();
}

function renderVehicleEditForm(plateNo, vehicle) {
  if (!vehicle) {
    showToast("当前没有可编辑的车辆");
    return;
  }
  elements.subpageContent.innerHTML = `
    <div class="subpage-summary"><span class="subpage-summary-icon">车</span><div><strong>编辑车辆信息</strong><span>车辆归属及使用状态由后台统一维护</span></div></div>
    <form class="expense-form profile-edit-form" id="vehicleEditForm">
      <section class="info-section"><h2>车辆档案</h2>
        <label class="expense-field">车牌号码<input name="plateNo" value="${h(plateNo)}" readonly /></label>
        <label class="expense-field">车辆类型<input name="vehicleType" value="${h(vehicle.type || "")}" maxlength="40" required /></label>
        <label class="expense-field">所属车队<input name="fleet" value="${h(vehicle.fleet || "")}" maxlength="60" required /></label>
        <label class="expense-field">营运证号<input name="permitNo" value="${h(vehicle.permitNo || "")}" maxlength="50" required /></label>
        <label class="expense-field">下次审验<input name="inspectionDue" type="date" value="${h(vehicle.inspectionDue || "")}" required /></label>
        <label class="expense-field">运力归属<input value="${h(vehicle.capacityOwnership || "待确定")}" readonly /></label>
        <label class="expense-field">所属单位<input value="${h(vehicle.organizationName || "待确定")}" readonly /></label>
        <label class="expense-field">车辆状态<input value="${h(vehicle.state || "待分配")}" readonly /></label>
      </section>
      <button class="subpage-primary" type="submit">保存车辆信息</button>
      <button class="subpage-secondary" data-subpage-action="cancel-vehicle-edit" type="button">取消编辑</button>
    </form>`;
}

function renderPersonalEditForm() {
  const driver = currentDriver();
  elements.subpageContent.innerHTML = `
    <div class="subpage-summary"><span class="subpage-summary-icon">编</span><div><strong>编辑个人信息</strong><span>更新后将同步个人中心与司机资料</span></div></div>
    <form class="expense-form profile-edit-form" id="personalEditForm">
      <section class="info-section"><h2>基础与联系信息</h2>
        <label class="expense-field">司机编号<input value="${h(driver.id)}" readonly /></label>
        <label class="expense-field">姓名<input name="name" value="${h(driver.name)}" maxlength="20" required /></label>
        <label class="expense-field">联系电话<input name="phone" value="${h(driver.phone)}" inputmode="tel" maxlength="11" pattern="1[3-9]\\d{9}" required /></label>
        <label class="expense-field">运力归属<input value="${h(driver.capacityOwnership || "自营")}" readonly /></label>
        <label class="expense-field">所属单位<input value="${h(driver.organizationName || "本公司")}" readonly /></label>
        <label class="expense-field">所属车队<input name="fleet" value="${h(driver.fleet)}" maxlength="40" required /></label>
        <label class="expense-field">联系地址<input name="address" value="${h(driver.address || "上海市浦东新区临港大道 688 号")}" maxlength="120" required /></label>
        <label class="expense-field">紧急联系人<input name="emergencyContact" value="${h(driver.emergencyContact || "赵敏 13800002166")}" maxlength="40" required /></label>
      </section>
      <button class="subpage-primary" type="submit">保存个人信息</button>
      <button class="subpage-secondary" data-subpage-action="cancel-personal-edit" type="button">取消编辑</button>
    </form>`;
}

function renderDriverFeedback() {
  const driver = currentDriver();
  const records = window.FeedbackManager.bySubmitter("driver", driver.id);
  const statusMeta = window.FeedbackManager.STATUS_META;
  const categories = window.FeedbackManager.categories("driver");
  const relatedDispatches = driverDispatches().slice().sort((left, right) => String(right.orderDate || "").localeCompare(String(left.orderDate || "")));
  const tabs = `<div class="feedback-mobile-tabs" role="tablist" aria-label="意见反馈视图"><button class="${state.activeFeedbackTab === "submit" ? "active" : ""}" data-feedback-tab="submit" type="button" role="tab" aria-selected="${state.activeFeedbackTab === "submit"}">提交反馈</button><button class="${state.activeFeedbackTab === "history" ? "active" : ""}" data-feedback-tab="history" type="button" role="tab" aria-selected="${state.activeFeedbackTab === "history"}">我的反馈${records.length ? `（${records.length}）` : ""}</button></div>`;
  if (state.activeFeedbackTab === "history") {
    elements.subpageContent.innerHTML = `<div class="feedback-mobile-page">${tabs}<div class="feedback-history-list">${records.length ? records.map((item) => {
      const status = statusMeta[item.status];
      return `<article class="feedback-history-card"><header><span><strong>${h(item.categoryLabel)}</strong><small>${h(item.id)} · ${h(item.createdAt)}</small></span><em class="feedback-status ${status.className}">${status.label}</em></header><p>${h(item.description)}</p><div class="feedback-history-meta"><span>${h(item.relatedLabel || "未关联业务")}</span><span>${item.attachments.length ? `${item.attachments.length} 个附件` : "无附件"}</span></div>${item.publicReply ? `<div class="feedback-history-reply"><strong>处理回复：</strong>${h(item.publicReply)}</div>` : ""}</article>`;
    }).join("") : '<div class="feedback-history-empty"><i data-lucide="message-square-dashed"></i><strong>暂无反馈记录</strong><span>提交后的处理状态会显示在这里</span></div>'}</div></div>`;
    return;
  }
  elements.subpageContent.innerHTML = `<div class="feedback-mobile-page">${tabs}<form class="feedback-form-card" id="driverFeedbackForm">
    <div class="feedback-form-intro"><span><i data-lucide="message-square-plus"></i></span><div><strong>告诉我们遇到的问题</strong><small>身份与客户端信息会自动随反馈提交</small></div></div>
    <label class="feedback-field"><span>问题类型</span><select name="categoryCode" required><option value="">请选择问题类型</option>${categories.map((item) => `<option value="${h(item.code)}">${h(item.label)}</option>`).join("")}</select></label>
    <label class="feedback-field"><span>关联运单 <em>选填</em></span><select name="relatedId"><option value="">不关联运单</option>${relatedDispatches.map((item) => `<option value="${h(item.id)}" data-related-label="${h(`${item.waybillNo} · ${item.routeName}`)}">${h(item.waybillNo)} · ${h(item.routeName)}</option>`).join("")}</select></label>
    <label class="feedback-field"><span>问题描述 <em data-feedback-count>0/1000</em></span><textarea name="description" rows="5" minlength="10" maxlength="1000" placeholder="请描述发生了什么、期望如何改进，至少填写 10 个字" required></textarea></label>
    <label class="feedback-field"><span>图片或视频 <em>选填</em></span><label class="feedback-upload"><input name="attachments" type="file" accept="image/*,video/mp4,video/quicktime" multiple /><span class="feedback-upload-icon"><i data-lucide="image-plus"></i></span><span><strong>上传现场截图或视频</strong><small>最多 9 个附件，视频最多 2 个；图片≤10MB，视频≤100MB</small></span></label><small class="feedback-file-summary" data-feedback-files>尚未选择附件</small></label>
    <label class="feedback-field"><span>联系电话</span><input name="contactPhone" inputmode="tel" maxlength="11" value="${h(driver.phone)}" required /></label>
    <button class="feedback-submit-button" type="submit">提交意见反馈</button>
  </form></div>`;
}

function renderSubpage(page) {
  clearCredentialInlineUrls();
  const driver = currentDriver();
  const certification = currentCertification();
  const certificationView = certificationMeta(certification.status);
  const current = driverDispatches().find((item) => item.status === "运输中" && item.vehicleId)
    || driverDispatches().find((item) => item.vehicleId);
  const plateNo = current?.vehicleId || "暂未分配";
  const vehicle = vehicles[plateNo];
  const titles = {
    certification: "司机认证",
    personal: "个人信息",
    security: "账户安全",
    vehicle: "车辆信息",
    insurance: "车辆保险",
    messages: "消息通知",
    expenses: "费用上报",
    feedback: "意见反馈",
    service: "客服电话",
    settings: "系统设置",
    vehicleRepair: "车辆报修",
  };
  elements.subpageTitle.textContent = titles[page] || "个人中心";
  setTimeout(() => window.lucide?.createIcons(), 0);

  if (page === "feedback") {
    renderDriverFeedback();
    return;
  }

  if (page === "certification") {
    const status = certificationMeta(certification.status);
    if (certification.status === "verified") {
      elements.subpageContent.innerHTML = `
        <div class="subpage-summary"><span class="subpage-summary-icon">✓</span><div><strong>司机认证已通过</strong><span>审核时间 ${h(certification.reviewedAt || "-")}</span></div></div>
        <section class="info-section"><h2>认证资料</h2>${infoRows([
          { label: "真实姓名", value: driver.name }, { label: "身份证号", value: maskIdCard(driver.idCard) },
          { label: "驾驶证", value: `${driver.licenseClass} · ${maskIdCard(driver.licenseNo)}` }, { label: "从业资格证", value: driver.qualificationNo },
          { label: "认证状态", value: "", status: status.label },
        ])}</section>
        <section class="info-section credential-preview-section"><h2>电子证件</h2>${credentialPreviewCardsMarkup(certification)}</section>
        <button class="subpage-primary" data-subpage-action="edit-certification" type="button">修改认证资料</button>`;
      hydrateCredentialInlinePreviews();
      return;
    }
    if (certification.status === "pending") {
      elements.subpageContent.innerHTML = `
        <div class="subpage-summary"><span class="subpage-summary-icon">审</span><div><strong>认证资料审核中</strong><span>提交时间 ${h(certification.submittedAt || "-")}</span></div></div>
        <div class="certification-notice">认证结果将通过消息通知同步。审核通过前暂时无法接单，请耐心等待。</div>
        <section class="info-section"><h2>已提交资料</h2>${infoRows([
          { label: "真实姓名", value: driver.name }, { label: "身份证号", value: maskIdCard(driver.idCard) },
          { label: "驾驶证", value: certification.licenseAttachment || "待补充" }, { label: "从业资格证", value: certification.qualificationAttachment || "待补充" },
        ])}</section>
        <section class="info-section credential-preview-section"><h2>电子证件</h2>${credentialPreviewCardsMarkup(certification)}</section>
        <button class="subpage-primary" data-subpage-action="edit-certification" type="button">修改并重新提交</button>`;
      hydrateCredentialInlinePreviews();
      return;
    }
    renderCertificationForm(certification);
    return;
  }

  if (page === "personal") {
    elements.subpageContent.innerHTML = `
      <div class="subpage-summary"><span class="subpage-summary-icon">${h(driver.name.slice(0, 1))}</span><div><strong>${h(driver.name)}</strong><span>${h(driver.capacityOwnership || "自营")} · ${h(driver.organizationName || "本公司")}</span></div></div>
      <section class="info-section"><h2>基础资料</h2>${infoRows([
        { label: "司机编号", value: driver.id }, { label: "姓名", value: driver.name }, { label: "联系电话", value: maskPhone(driver.phone) },
        { label: "运力归属", value: driver.capacityOwnership || "自营" }, { label: "所属单位", value: driver.organizationName || "本公司" }, { label: "所属车队", value: driver.fleet }, { label: "司机状态", value: "在职" },
      ])}</section>
      <section class="info-section"><h2>联系信息</h2>${infoRows([{ label: "住址", value: driver.address || "上海市浦东新区临港大道 688 号" }, { label: "紧急联系人", value: driver.emergencyContact || "赵敏  138****2166" }])}</section>
      <section class="info-section profile-credential-section"><h2>相关证件</h2>${credentialDocumentsMarkup(certification, driver, { compact: true })}</section>
      <button class="subpage-primary" data-subpage-action="edit-personal" type="button">编辑个人信息</button>`;
    return;
  }

  if (page === "security") {
    elements.subpageContent.innerHTML = `
      <div class="subpage-summary"><span class="subpage-summary-icon">安</span><div><strong>账户安全正常</strong><span>最近登录：今天 08:32 · 上海</span></div></div>
      <section class="info-section"><h2>安全设置</h2>${infoRows([
        { label: "绑定手机", value: maskPhone(driver.phone), action: "change-phone" },
        { label: "登录密码", value: "已设置", action: "change-password" },
        { label: "实名认证", value: certification.status === "verified" ? "身份资料已核验" : "认证流程未完成", status: certificationView.label, warning: certification.status !== "verified" },
        { label: "登录设备", value: "1 台设备", action: "devices" },
      ])}</section>`;
    return;
  }

  if (page === "vehicle") {
    const hasOpenRepair = vehicle && window.VehicleRepair.hasOpenRepair(state.repairs, plateNo);
    elements.subpageContent.innerHTML = `
      <div class="subpage-summary vehicle-summary"><span class="subpage-summary-icon">车</span><div><strong>${h(plateNo)}</strong><span>${h(vehicle?.type || "暂无车辆信息")}</span></div><div class="vehicle-summary-actions">
        <button data-subpage-action="report-vehicle-repair" type="button" ${hasOpenRepair || !vehicle ? "disabled" : ""}>${hasOpenRepair ? "维修中" : "报修"}</button>
        <button data-subpage-action="edit-vehicle" type="button" ${vehicle ? "" : "disabled"}>编辑</button>
      </div></div>
      <section class="info-section"><h2>车辆档案</h2>${infoRows([
        { label: "车牌号码", value: plateNo }, { label: "车辆类型", value: vehicle?.type || "-" },
        { label: "运力归属", value: vehicle?.capacityOwnership || "待确定" }, { label: "所属单位", value: vehicle?.organizationName || "待确定" }, { label: "所属车队", value: vehicle?.fleet || driver.fleet }, { label: "车辆状态", value: vehicle?.state || "待分配", status: vehicle?.state || "待分配", warning: vehicle?.state !== "在用" },
        { label: "营运证号", value: vehicle?.permitNo || "待补充" }, { label: "下次审验", value: vehicle?.inspectionDue || "待补充" },
      ])}</section>
      <button class="subpage-secondary subpage-link-button" data-subpage-action="open-insurance" type="button">查看车辆保险 <b>›</b></button>
      ${renderDriverRepairHistory()}`;
    return;
  }

  if (page === "vehicleRepair") {
    const preferredCandidate = current?.vehicleId || Object.keys(vehicles).find((plate) => vehicles[plate].driverId === driver.id) || "";
    const preferredPlate = window.VehicleRepair.hasOpenRepair(state.repairs, preferredCandidate) ? "" : preferredCandidate;
    const options = Object.entries(vehicles).map(([plate, item]) => {
      const active = window.VehicleRepair.hasOpenRepair(state.repairs, plate);
      return `<option value="${h(plate)}" ${plate === preferredPlate ? "selected" : ""} ${active ? "disabled" : ""}>${h(plate)} · ${h(item.type || "车辆")}${active ? " · 维修中" : ""}</option>`;
    }).join("");
    elements.subpageContent.innerHTML = `
      <div class="subpage-summary"><span class="subpage-summary-icon">修</span><div><strong>车辆报修</strong><span>提交后车辆将暂停派单，后台会跟进处理</span></div></div>
      <form class="repair-report-form" id="driverVehicleRepairForm">
        <section class="info-section"><h2>故障信息</h2>
          <label class="expense-field">维修车辆<select name="plateNo" required><option value="">请选择车辆</option>${options}</select></label>
          <label class="expense-field">故障类别<select name="category" required><option value="">请选择故障类别</option><option>发动机</option><option>轮胎</option><option>制动系统</option><option>电气系统</option><option>底盘与悬挂</option><option>其他</option></select></label>
          <label class="expense-field">故障描述<textarea name="description" rows="4" maxlength="500" placeholder="请描述故障现象和发生经过" required></textarea></label>
          <label class="expense-field">维修地点<input name="repairLocation" type="text" maxlength="120" placeholder="故障地点或当前停车地点" /></label>
          <label class="expense-field">现场凭证<span class="expense-upload"><input name="evidenceFiles" type="file" accept="image/*,.pdf" multiple /><strong>上传现场照片或凭证</strong><small>支持图片、PDF，单个文件不超过 10 MB</small></span></label>
          <label class="expense-field">补充说明<textarea name="remark" rows="2" maxlength="300" placeholder="选填"></textarea></label>
        </section>
        <button class="subpage-primary" type="submit">提交报修</button>
        <button class="subpage-secondary" data-subpage-action="back-to-vehicle" type="button">返回车辆信息</button>
      </form>
      ${renderDriverRepairHistory()}`;
    return;
  }

  if (page === "insurance") {
    elements.subpageContent.innerHTML = `
      <div class="subpage-summary"><span class="subpage-summary-icon">保</span><div><strong>${h(plateNo)} 保险档案</strong><span>当前保单状态正常</span></div></div>
      <section class="info-section"><h2>有效保单</h2>
        <div class="document-record"><header><strong>机动车交通事故责任强制保险</strong><em class="status-pill">有效</em></header><p>承保公司：中国人民财产保险<br>保单号：PDAA20263101002819<br>有效期至：2027-08-31</p></div>
        <div class="document-record"><header><strong>商业车辆保险</strong><em class="status-pill">有效</em></header><p>承保公司：中国太平洋财产保险<br>保单号：ASH2026091800366<br>有效期至：2027-09-18</p></div>
      </section>`;
    return;
  }

  if (page === "messages") {
    const announcements = currentDriverAnnouncements();
    elements.subpageContent.innerHTML = `
      <section class="info-section"><h2>最新消息</h2>
        ${announcements.map((item) => `<div class="message-record announcement-message-record"><header><strong>${h(item.title)}</strong><em>${h(item.type || "公告")}</em></header><p>${h(item.content)}</p>${item.attachment ? `<small>附件：${h(item.attachment)}</small>` : ""}<time>${h(item.publishedAt || "刚刚")}</time></div>`).join("")}
        <div class="message-record"><strong>新派单提醒</strong><p>您有新的运输任务，请进入接单页面及时处理。</p><time>今天 08:20</time></div>
        <div class="message-record"><strong>证件到期提醒</strong><p>系统将持续监控驾驶证和从业资格证有效期。</p><time>昨天 16:40</time></div>
        <div class="message-record"><strong>运输节点同步成功</strong><p>运单 WB20260920008 的在途节点已同步至调度后台。</p><time>09月20日 14:48</time></div>
      </section>`;
    return;
  }

  if (page === "expenses") {
    const selectedType = EXPENSE_TYPES.find((item) => item.key === state.activeExpenseType);
    const selectableDispatches = window.ExpenseReport.getSelectableDispatches(state.dispatches, state.currentDriverId);
    const defaultDispatch = window.ExpenseReport.getDefaultDispatch(state.dispatches, state.currentDriverId);
    const defaultVehicleId = defaultDispatch?.vehicleId || "";
    const driverExpenses = state.expenses
      .filter((item) => item.driverId === state.currentDriverId)
      .slice()
      .sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")));
    if (!selectedType) {
      elements.subpageContent.innerHTML = `
        <div class="subpage-summary expense-summary"><span class="subpage-summary-icon">费</span><div><strong>费用上报</strong><span>选择费用类型，提交运输相关支出</span></div></div>
        <section class="info-section expense-type-section"><h2>选择费用类型</h2><div class="expense-type-grid">
          ${EXPENSE_TYPES.map((item) => `<button class="expense-type-option" data-expense-type="${h(item.key)}" type="button"><span class="expense-type-icon">${h(item.label.slice(0, 1))}</span><span class="expense-type-copy"><strong>${h(item.label)}</strong><small>${h(item.hint)}</small></span><b>›</b></button>`).join("")}
        </div></section>
        ${driverExpenses.length ? `<section class="info-section expense-history"><h2>最近上报</h2>${driverExpenses.slice(0, 3).map((item) => { const status = expenseStatusMeta(item.status); return `<div class="expense-record"><div><strong>${h(item.typeLabel)}</strong><span>${h(item.date)} · ¥${h(item.amount)}</span>${item.waybillNo || item.vehicleId ? `<small>${h([item.waybillNo, item.vehicleId].filter(Boolean).join(" · "))}</small>` : ""}${item.status === "rejected" && item.rejectionReason ? `<small class="expense-rejection-reason">${h(item.rejectionReason)}</small>` : ""}</div><em class="${status.className}">${status.label}</em></div>`; }).join("")}</section>` : `<div class="expense-empty">提交后的费用上报会显示在这里</div>`}`;
      return;
    }
    elements.subpageContent.innerHTML = `
      <div class="subpage-summary expense-summary"><span class="subpage-summary-icon">${h(selectedType.label.slice(0, 1))}</span><div><strong>${h(selectedType.label)}</strong><span>填写本次费用明细并提交审核</span></div></div>
      <form class="expense-form" id="expenseForm">
        <section class="info-section"><h2>费用明细</h2>
          ${selectedType.key === "other" ? `<label class="expense-field">费用名称<input name="customType" type="text" maxlength="20" placeholder="请输入费用名称" required /></label>` : ""}
          <label class="expense-field">关联运单<select name="dispatchId" data-expense-waybill required ${selectableDispatches.length ? "" : "disabled"}>
            ${selectableDispatches.length ? selectableDispatches.map((item) => `<option value="${h(item.id)}" data-vehicle-id="${h(item.vehicleId || "")}" ${item.id === defaultDispatch?.id ? "selected" : ""}>${h(item.waybillNo)} · ${h(item.routeName)} · ${h(item.status)}</option>`).join("") : `<option value="">暂无进行中或已完成运单</option>`}
          </select><small class="expense-field-hint">${defaultDispatch?.status === "运输中" ? "已默认选择最近的进行中运单" : defaultDispatch ? "暂无进行中运单，已选择最近完成的运单" : "暂无可关联运单，暂时无法提交"}</small></label>
          <label class="expense-field">车辆<select name="vehicleId" required>
            <option value="">请选择车辆</option>
            ${Object.entries(vehicles).map(([plateNo, vehicle]) => `<option value="${h(plateNo)}" ${plateNo === defaultVehicleId ? "selected" : ""}>${h(plateNo)} · ${h(vehicle.type)}</option>`).join("")}
          </select></label>
          <label class="expense-field">费用金额（元）<input name="amount" type="number" min="0.01" step="0.01" inputmode="decimal" placeholder="请输入费用金额" required /></label>
          <label class="expense-field">发生日期<input name="date" type="date" value="${todayInputValue()}" required /></label>
          <label class="expense-field">费用凭证<span class="expense-upload"><input name="receipt" type="file" accept="image/*,.pdf" /><strong>上传发票或支付凭证</strong><small>支持图片、PDF，单个文件不超过 10MB</small></span></label>
          <label class="expense-field">备注说明<textarea name="remark" rows="3" maxlength="120" placeholder="请输入费用用途或补充说明（选填）"></textarea></label>
        </section>
        <button class="subpage-primary" type="submit" ${selectableDispatches.length ? "" : "disabled"}>提交费用上报</button>
        <button class="subpage-secondary" data-subpage-action="back-expense-types" type="button">返回费用类型</button>
      </form>`;
    return;
  }

  if (page === "service") {
    elements.subpageContent.innerHTML = `
      <div class="subpage-summary"><span class="subpage-summary-icon">客</span><div><strong>客服中心</strong><span>工作时间 07:00 - 22:00</span></div></div>
      <section class="info-section"><h2>联系信息</h2>${infoRows([{ label: "客服热线", value: "400-800-6688" }, { label: "值班客服", value: "周客服" }, { label: "服务车队", value: driver.fleet }])}</section>
      <a class="subpage-primary" href="tel:4008006688">拨打客服热线</a>`;
    return;
  }

  elements.subpageContent.innerHTML = `
    <section class="info-section settings-section"><h2>系统设置</h2>
      <div class="settings-row"><div><strong>界面字体</strong><span>调整司机端所有页面的显示字号</span></div><div class="font-size-options" role="radiogroup" aria-label="界面字体大小">
        ${Object.entries(FONT_SIZE_OPTIONS).map(([key, option]) => `<button data-font-size="${key}" type="button" aria-pressed="${state.fontSize === key}">${option.label}</button>`).join("")}
      </div></div>
      ${infoRows([
        { label: "消息提醒", value: "已开启", action: "notifications" }, { label: "清理缓存", value: "12.6 MB", action: "clear-cache" },
        { label: "隐私政策", value: "", action: "privacy" }, { label: "当前版本", value: "1.0.0" },
      ])}
    </section>
    <button class="subpage-primary" data-subpage-action="logout" type="button">退出当前账号</button>`;
}

function openProfileSubpage(page) {
  state.activeProfilePage = page;
  if (page !== "expenses") state.activeExpenseType = "";
  renderSubpage(page);
  elements.profileSubpage.classList.add("open");
  elements.profileSubpage.setAttribute("aria-hidden", "false");
  elements.bottomNav.hidden = true;
  elements.bottomNav.setAttribute("aria-hidden", "true");
  document.querySelector(".phone-shell").classList.add("subpage-open");
  elements.subpageContent.scrollTop = 0;
}

function closeProfileSubpage() {
  elements.profileSubpage.classList.remove("open");
  elements.profileSubpage.setAttribute("aria-hidden", "true");
  elements.bottomNav.hidden = false;
  elements.bottomNav.setAttribute("aria-hidden", "false");
  document.querySelector(".phone-shell").classList.remove("subpage-open");
  state.activeProfilePage = "";
  state.activeExpenseType = "";
}

function renderDetail() {
  const dispatch = state.dispatches.find((item) => item.id === state.activeDispatchId);
  if (!dispatch) return closeDetail();
  const meta = waybillMeta[dispatch.waybillNo] || {};
  const category = dispatchCategory(dispatch);
  const taskProgress = getTaskProgress(dispatch);
  const taskPosition = `${taskProgress.completedCount}/${taskProgress.nodes.length}`;
  const timeline = [...(dispatch.timeline || [])].reverse().map((item) => `
    <div class="timeline-row"><time>${h(item.time.split(" ")[1] || item.time)}<br>${h(item.time.split(" ")[0] || "")}</time><span class="timeline-axis"><i></i></span><div class="timeline-copy"><strong>${h(item.node)}</strong><p>${h(item.desc)}</p>${item.photos?.length || item.photoAttachments?.length ? `<div class="photo-tags">${renderTimelinePhotoTags(item)}</div>` : ""}</div></div>`).join("");
  elements.detailContent.innerHTML = `
    <section class="detail-status-card"><div class="detail-status-top"><span>${h(dispatch.waybillNo)}</span><strong>${h(statusLabel(dispatch))}</strong></div><h2>${h(statusDescription(dispatch))}</h2><p>派单时间 ${h(String(dispatch.dispatchTime || "-").replace("T", " ").slice(0, 16))}</p></section>
    <section class="detail-route-card"><div class="detail-route-title"><strong>${h(dispatch.routeName)}</strong><span>${h(dispatch.vehicleId || "待分配")}</span></div><div class="route-block"><div class="route-track"><i class="route-dot"></i><i class="route-dot end"></i></div><div class="route-points"><div class="route-point"><span>提箱地</span><strong>${h(dispatch.origin)}</strong></div><div class="route-point"><span>装卸地</span><strong>${h(dispatch.destination)}</strong></div></div></div><div class="address-action"><button data-detail-action="navigate" type="button">导航至装卸地</button><a href="tel:4008006688">联系调度</a></div></section>
    <section class="detail-card"><div class="detail-card-heading"><strong class="detail-card-title">任务进度</strong><span>${h(taskProgress.taskType)}</span></div><div class="detail-progress-meta"><span>当前节点 <strong>${h(taskProgress.currentNode)}</strong></span><b>${taskPosition}</b></div><div class="detail-progress-track" role="progressbar" aria-label="任务进度" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${taskProgress.progress}"><i style="width:${taskProgress.progress}%"></i></div></section>
    <section class="detail-card"><strong class="detail-card-title">节点记录</strong><div class="timeline-list">${timeline || `<div class="empty-state"><p>暂无节点记录</p></div>`}</div></section>
    <section class="detail-card"><strong class="detail-card-title">运单信息</strong><div class="detail-grid"><div class="detail-field"><span>客户名称</span><strong>${h(meta.customer || "待补充")}</strong></div><div class="detail-field"><span>提单号</span><strong>${h(meta.billNo || "-")}</strong></div><div class="detail-field"><span>箱信息</span><strong>${h(dispatch.boxes)}</strong></div><div class="detail-field"><span>封号</span><strong>${h(meta.sealNo || "-")}</strong></div><div class="detail-field"><span>车辆</span><strong>${h(dispatch.vehicleId || "待分配")}</strong></div><div class="detail-field"><span>收货人</span><strong>${h(dispatch.consignee || "-")}</strong></div><div class="detail-field"><span>到达时间</span><strong>${h(String(dispatch.arrivalTime || "-").replace("T", " ").slice(0, 16))}</strong></div><div class="detail-field"><span>到达地点</span><strong>${h(dispatch.arrivalLocation || "-")}</strong></div><div class="detail-field full"><span>还箱地</span><strong>${h(dispatch.loadAddress || "-")}</strong></div><div class="detail-field full"><span>备注</span><strong>${h(dispatch.note || "无")}</strong></div>${dispatch.rejectionReason ? `<div class="detail-field full"><span>拒单原因</span><strong>${h(dispatch.rejectionReason)}</strong></div>` : ""}</div></section>
    `;

  renderTimelinePhotoImages();
  elements.detailActionBar.innerHTML = renderDetailActionBar(dispatch, category);
}

function renderAll() {
  renderTasks();
  renderOrders();
  renderProfile();
  if (elements.detailView.classList.contains("open")) renderDetail();
  if (elements.profileSubpage.classList.contains("open") && state.activeProfilePage) renderSubpage(state.activeProfilePage);
}

function switchView(viewName) {
  const target = document.querySelector(`#${viewName}View`);
  if (!target) return;
  document.querySelectorAll(".mobile-view").forEach((view) => view.classList.toggle("active", view === target));
  elements.bottomNav.querySelectorAll("button").forEach((button) => button.classList.toggle("active", button.dataset.view === viewName));
  elements.title.textContent = target.dataset.title;
  document.querySelector("#headerEyebrow").textContent = viewName === "messages" ? "任务与预警通知" : "集卡司机端";
  target.scrollTo({ top: 0, behavior: "smooth" });
  if (viewName === "profile") renderProfile();
  if (viewName === "messages") renderDriverMessages();
}

function openDetail(dispatchId) {
  state.activeDispatchId = dispatchId;
  renderDetail();
  elements.detailView.classList.add("open");
  elements.bottomNav.hidden = true;
  elements.bottomNav.setAttribute("aria-hidden", "true");
  document.querySelector(".phone-shell").classList.add("detail-open");
  elements.detailView.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeDetail() {
  clearTimelinePhotoUrls();
  elements.detailView.classList.remove("open");
  elements.bottomNav.hidden = false;
  elements.bottomNav.setAttribute("aria-hidden", "false");
  document.querySelector(".phone-shell").classList.remove("detail-open");
  elements.detailView.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  state.activeDispatchId = "";
}

let toastTimer;
function showToast(message) {
  clearTimeout(toastTimer);
  elements.toast.textContent = message;
  elements.toast.classList.add("show");
  toastTimer = setTimeout(() => elements.toast.classList.remove("show"), 2500);
}

function persist(message) {
  window.DispatchStore.save(state.dispatches);
  if (window.opener && !window.opener.closed) {
    window.opener.postMessage({ type: "dispatch-update", dispatches: state.dispatches }, "*");
  }
  renderAll();
  if (message) showToast(message);
}

function acceptDispatch(dispatchId) {
  const dispatch = state.dispatches.find((item) => item.id === dispatchId);
  if (!dispatch || dispatch.status !== "已派单") return false;
  dispatch.taskType = dispatchTaskType(dispatch);
  dispatch.status = "运输中";
  dispatch.currentNode = "已接单";
  dispatch.acceptedAt = window.DispatchStore.nowText();
  dispatch.timeline = dispatch.timeline || [];
  dispatch.timeline.push({ node: "已接单", time: dispatch.acceptedAt, desc: "司机已确认接单，任务开始执行", photos: [] });
  persist("接单成功，已同步至调度后台");
  return true;
}

function acceptAndOpenOrders(dispatchId) {
  const certification = currentCertification();
  if (certification.status !== "verified") {
    if (elements.detailView.classList.contains("open")) closeDetail();
    openProfileSubpage("certification");
    const message = certification.status === "pending" ? "认证资料正在审核，通过后即可接单" : "请先完成司机认证后再接单";
    showToast(message);
    return;
  }
  if (!acceptDispatch(dispatchId)) return;
  state.orderFilter = "active";
  state.orderStage = "all";
  state.orderSearch = "";
  document.querySelector("#orderSearch").value = "";
  document.querySelectorAll("#orderStatusTabs button").forEach((button) => button.classList.toggle("active", button.dataset.status === "active"));
  renderOrders();
  closeDetail();
  switchView("orders");
}

function openReject(dispatchId) {
  state.activeDispatchId = dispatchId;
  document.querySelector("#rejectForm").reset();
  elements.rejectDialog.showModal();
}

function openProgress(dispatchId, requestedNode) {
  const dispatch = state.dispatches.find((item) => item.id === dispatchId);
  if (!dispatch || dispatch.status !== "运输中") return;
  const node = nextNode(dispatch);
  if (requestedNode && requestedNode !== node) return;
  state.activeDispatchId = dispatchId;
  document.querySelector("#progressForm").reset();
  document.querySelector("#nextNodeText").textContent = node;
  renderProgressPhotoRequirements(dispatch, node);
  elements.progressDialog.showModal();
}

function syncFromStore() {
  state.dispatches = mergeDefaultExamples(window.DispatchStore.load(dispatchSeed), state.dispatches);
  renderAll();
}

elements.bottomNav.addEventListener("click", (event) => {
  const button = event.target.closest("[data-view]");
  if (button) switchView(button.dataset.view);
});

document.querySelector("#driverMessageTabs").addEventListener("click", (event) => {
  const button = event.target.closest("[data-message-filter]");
  if (!button) return;
  state.driverMessageFilter = button.dataset.messageFilter;
  document.querySelectorAll("#driverMessageTabs button").forEach((item) => {
    const active = item === button;
    item.classList.toggle("active", active);
    item.setAttribute("aria-pressed", String(active));
  });
  renderDriverMessages();
});

document.querySelector("#driverReadAllButton").addEventListener("click", () => {
  saveDriverMessageReadIds(driverMessages().map((item) => item.id));
  renderDriverMessages();
  showToast("消息已全部标记为已读");
});

document.querySelector("#driverMessageList").addEventListener("click", (event) => {
  const button = event.target.closest("[data-driver-message-id]");
  if (!button) return;
  markDriverMessageRead(button.dataset.driverMessageId);
  const dispatchId = button.dataset.messageDispatchId;
  if (dispatchId) openDetail(dispatchId);
});

function handleDispatchAction(event) {
  const button = event.target.closest("[data-action]");
  if (!button) return;
  const { action, id } = button.dataset;
  if (action === "detail") openDetail(id);
  if (action === "accept") acceptAndOpenOrders(id);
  if (action === "progress") openProgress(id, button.dataset.node);
  if (action === "contact") showToast("调度中心电话：400-800-6688");
}

elements.taskList.addEventListener("click", handleDispatchAction);
elements.orderList.addEventListener("click", handleDispatchAction);

function openOrdersForStage(stage) {
  const filterByStage = { all: "all", pickup: "active", transit: "active", completed: "completed" };
  const titleByStage = { all: "我的运单", pickup: "待执行运单", transit: "运输中运单", completed: "已完成运单" };
  state.orderStage = stage;
  state.orderFilter = filterByStage[stage] || "all";
  state.orderSearch = "";
  document.querySelector("#orderSearch").value = "";
  document.querySelectorAll("#orderStatusTabs button").forEach((button) => button.classList.toggle("active", button.dataset.status === state.orderFilter));
  renderOrders();
  switchView("orders");
  elements.title.textContent = titleByStage[stage] || "我的运单";
}

elements.profileView.addEventListener("click", (event) => {
  const callButton = event.target.closest("[data-call-service]");
  if (callButton) {
    window.location.href = "tel:4008006688";
    return;
  }
  const stageButton = event.target.closest("[data-order-stage]");
  if (stageButton) {
    openOrdersForStage(stageButton.dataset.orderStage);
    return;
  }
  const pageButton = event.target.closest("[data-profile-page]");
  if (pageButton) openProfileSubpage(pageButton.dataset.profilePage);
});

document.querySelector("#orderStatusTabs").addEventListener("click", (event) => {
  const button = event.target.closest("[data-status]");
  if (!button) return;
  state.orderFilter = button.dataset.status;
  state.orderStage = "all";
  elements.title.textContent = "我的运单";
  document.querySelectorAll("#orderStatusTabs button").forEach((item) => {
    const active = item === button;
    item.classList.toggle("active", active);
    item.setAttribute("aria-pressed", String(active));
  });
  renderOrders();
});

document.querySelector("#orderSearch").addEventListener("input", (event) => {
  state.orderSearch = event.target.value.trim();
  renderOrders();
});

document.querySelector("#backFromDetail").addEventListener("click", closeDetail);
document.querySelector("#detailMoreButton").addEventListener("click", () => showToast("运单信息已是最新状态"));
document.querySelector("#backFromSubpage").addEventListener("click", closeProfileSubpage);

elements.subpageContent.addEventListener("submit", async (event) => {
  if (event.target.id === "driverFeedbackForm") {
    event.preventDefault();
    const form = event.target;
    const values = new FormData(form);
    const description = String(values.get("description") || "").trim();
    const contactPhone = String(values.get("contactPhone") || "").trim();
    if (description.length < 10) { showToast("问题描述至少填写 10 个字"); form.elements.description.focus(); return; }
    if (!/^1[3-9]\d{9}$/.test(contactPhone)) { showToast("请输入正确的 11 位联系电话"); form.elements.contactPhone.focus(); return; }
    const validation = window.FeedbackManager.validateFiles(form.elements.attachments.files);
    if (validation.error) { showToast(validation.error); return; }
    const submitButton = form.querySelector("[type='submit']");
    submitButton.disabled = true;
    submitButton.textContent = validation.files.length ? "正在上传附件…" : "正在提交…";
    const driver = currentDriver();
    const current = driverDispatches().find((item) => item.status === "运输中" && item.vehicleId) || driverDispatches().find((item) => item.vehicleId);
    const relatedOption = form.elements.relatedId.selectedOptions[0];
    const feedbackId = window.FeedbackManager.makeId();
    try {
      const attachments = await window.FeedbackManager.saveAttachments(feedbackId, validation.files);
      window.FeedbackManager.create({
        id: feedbackId,
        source: "driver",
        submitterId: driver.id,
        submitterName: driver.name,
        submitterPhone: driver.phone,
        organizationName: driver.organizationName || "本公司",
        fleetName: driver.fleet,
        capacityOwnership: driver.capacityOwnership || "自营",
        vehicleId: current?.vehicleId || "",
        categoryCode: String(values.get("categoryCode") || ""),
        description,
        contactPhone,
        relatedType: values.get("relatedId") ? "dispatch" : "",
        relatedId: String(values.get("relatedId") || ""),
        relatedLabel: relatedOption?.dataset.relatedLabel || "",
        attachments,
        clientVersion: "司机端 1.0",
        deviceInfo: String(navigator.userAgent || "移动设备").slice(0, 120),
      });
      state.activeFeedbackTab = "history";
      renderDriverFeedback();
      elements.subpageContent.scrollTop = 0;
      showToast(`反馈已提交：${feedbackId}`);
    } catch (error) {
      console.error("意见反馈提交失败。", error);
      showToast(error.message || "反馈提交失败，请重试");
      submitButton.disabled = false;
      submitButton.textContent = "提交意见反馈";
    }
    return;
  }
  if (event.target.id === "personalEditForm") {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.target).entries());
    const phone = String(data.phone || "").trim();
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      showToast("请输入正确的 11 位手机号码");
      return;
    }
    const driver = currentDriver();
    Object.assign(driver, {
      name: String(data.name || "").trim(),
      phone,
      fleet: String(data.fleet || "").trim(),
      address: String(data.address || "").trim(),
      emergencyContact: String(data.emergencyContact || "").trim(),
    });
    state.dispatches.forEach((dispatch) => {
      if (dispatch.driverId !== driver.id) return;
      dispatch.driverName = driver.name;
      dispatch.phone = driver.phone;
    });
    saveDriverProfiles();
    window.DispatchStore.save(state.dispatches);
    renderProfile();
    renderSubpage("personal");
    elements.subpageContent.scrollTop = 0;
    showToast("个人信息已保存");
    return;
  }
  if (event.target.id === "vehicleEditForm") {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.target).entries());
    const plateNo = String(data.plateNo || "").trim();
    const vehicle = vehicles[plateNo];
    if (!vehicle) { showToast("未找到车辆档案"); return; }
    Object.assign(vehicle, {
      type: String(data.vehicleType || "").trim(),
      fleet: String(data.fleet || "").trim(),
      permitNo: String(data.permitNo || "").trim(),
      inspectionDue: String(data.inspectionDue || "").trim(),
    });
    saveDriverVehicleProfile(plateNo);
    renderProfile();
    renderSubpage("vehicle");
    elements.subpageContent.scrollTop = 0;
    showToast("车辆信息已保存并同步后台");
    return;
  }
  if (event.target.id === "driverVehicleRepairForm") {
    event.preventDefault();
    const form = event.target;
    const data = Object.fromEntries(new FormData(form).entries());
    const plateNo = String(data.plateNo || "").trim();
    const vehicle = vehicles[plateNo];
    if (!vehicle) { showToast("请选择有效车辆"); return; }
    const evidenceFiles = Array.from(form.elements.evidenceFiles.files || []);
    if (evidenceFiles.some((file) => file.size > 10 * 1024 * 1024)) { showToast("单个凭证不能超过 10 MB"); return; }
    const driver = currentDriver();
    const result = window.VehicleRepair.createRecord(state.repairs, {
      ...data,
      plateNo,
      vehicleType: vehicle.type,
      fleet: vehicle.fleet,
      source: "司机报修",
      reporterId: driver.id,
      reporterName: driver.name,
      createdBy: driver.name,
      reportedAt: new Date().toISOString(),
      evidence: [],
      status: "待维修",
      capacityOwnershipSnapshot: vehicle.capacityOwnership || "待确定",
      vehicleOrganizationSnapshot: vehicle.organizationName || "待确定",
    }, { vehicleState: vehicle.state });
    if (result.error) { showToast(result.error); return; }
    const uploadedAt = window.DispatchStore.nowText();
    const attachments = evidenceFiles.map((file, index) => ({
      id: `repair-${result.record.id}-${Date.now()}-${index}`,
      name: file.name,
      type: file.type || "application/octet-stream",
      uploadedAt,
    }));
    try {
      if (attachments.length) await window.DispatchStore.savePhotos(attachments.map((item, index) => ({ id: item.id, blob: evidenceFiles[index] })));
    } catch (error) {
      showToast("凭证保存失败，请重试");
      return;
    }
    result.record.evidence = attachments;
    state.repairs.unshift(result.record);
    vehicle.state = "维修中";
    state.repairs = window.VehicleRepair.save(state.repairs);
    const snapshot = window.AdminDataBridge.read() || {};
    const nextSnapshot = { ...snapshot, vehicleRepairs: state.repairs };
    if (Array.isArray(snapshot.vehicles)) {
      nextSnapshot.vehicles = snapshot.vehicles.map((item) => item.plateNo === plateNo ? { ...item, vehicleState: "维修中" } : item);
    }
    window.AdminDataBridge.write(nextSnapshot);
    renderProfile();
    renderSubpage("vehicleRepair");
    showToast("报修已提交，车辆已暂停派单");
    return;
  }
  if (event.target.id === "expenseForm") {
    event.preventDefault();
    const formData = new FormData(event.target);
    const amount = Number(formData.get("amount"));
    const selectedType = EXPENSE_TYPES.find((item) => item.key === state.activeExpenseType);
    const dispatch = window.ExpenseReport.getSelectableDispatches(state.dispatches, state.currentDriverId)
      .find((item) => item.id === formData.get("dispatchId"));
    const vehicleId = String(formData.get("vehicleId") || "").trim();
    const customType = String(formData.get("customType") || "").trim();
    if (!selectedType || !Number.isFinite(amount) || amount <= 0) {
      showToast("请输入有效的费用金额");
      return;
    }
    if (!dispatch) {
      showToast("请选择有效的关联运单");
      return;
    }
    if (!vehicleId || !vehicles[vehicleId]) {
      showToast("请选择车辆");
      return;
    }
    if (selectedType.key === "other" && !customType) {
      showToast("请输入费用名称");
      return;
    }
    state.expenses.unshift({
      id: `EXP-${Date.now()}`,
      driverId: state.currentDriverId,
      type: selectedType.key,
      typeLabel: selectedType.key === "other" ? customType : selectedType.label,
      customType,
      dispatchId: dispatch.id,
      waybillNo: dispatch.waybillNo,
      vehicleId,
      amount: amount.toFixed(2),
      date: String(formData.get("date") || ""),
      receiptName: formData.get("receipt")?.name || "",
      remark: String(formData.get("remark") || "").trim(),
      status: "pending",
      createdAt: new Date().toISOString(),
      capacityOwnershipSnapshot: dispatch.capacityOwnershipSnapshot || window.CapacityOwnership.groupSnapshot([{ ...currentDriver(), role: "司机", name: currentDriver().name }, { ...vehicles[vehicleId], role: "车辆", name: vehicleId }]).type,
      capacityOwnershipTooltipSnapshot: dispatch.capacityOwnershipTooltipSnapshot || "",
      driverOrganizationSnapshot: dispatch.driverOrganizationSnapshot || currentDriver().organizationName || "本公司",
      vehicleOrganizationSnapshot: dispatch.vehicleOrganizationSnapshot || vehicles[vehicleId].organizationName || "待确定",
    });
    saveExpenses(state.expenses);
    if (window.opener && !window.opener.closed) {
      window.opener.postMessage({ type: "driver-expense-update", expenses: state.expenses }, "*");
    }
    state.activeExpenseType = "";
    renderSubpage("expenses");
    showToast("费用上报已提交，等待审核");
    return;
  }
  if (event.target.id !== "certificationForm") return;
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);
  const driver = currentDriver();
  const phone = String(formData.get("phone") || "").trim();
  if (!/^1[3-9]\d{9}$/.test(phone)) { showToast("请输入正确的 11 位手机号码"); return; }
  driver.idCard = String(formData.get("idCard") || "").trim();
  driver.phone = phone;
  driver.licenseNo = String(formData.get("licenseNo") || "").trim();
  driver.licenseClass = String(formData.get("licenseClass") || "").trim();
  driver.qualificationNo = String(formData.get("qualificationNo") || "").trim();
  const nextCertification = {
    ...(state.certifications[state.currentDriverId] || {}),
    status: "pending",
    submittedAt: window.DispatchStore.nowText(),
    reviewedAt: "",
    reason: "",
  };
  try {
    const attachmentResult = await replaceCredentialAttachmentsFromForm(form, nextCertification, true);
    if (attachmentResult.error) { showToast(attachmentResult.error); return; }
  } catch (error) {
    console.error("认证附件保存失败。", error);
    showToast("认证附件保存失败，请重试");
    return;
  }
  state.certifications[state.currentDriverId] = nextCertification;
  saveDriverProfiles();
  saveCertifications(state.certifications);
  renderProfile();
  renderSubpage("certification");
  showToast("认证资料已提交，请等待后台审核");
});

elements.subpageContent.addEventListener("change", (event) => {
  const feedbackFiles = event.target.closest("#driverFeedbackForm input[name='attachments']");
  if (feedbackFiles) {
    const validation = window.FeedbackManager.validateFiles(feedbackFiles.files);
    const summary = feedbackFiles.closest(".feedback-field").querySelector("[data-feedback-files]");
    if (validation.error) {
      feedbackFiles.value = "";
      summary.textContent = validation.error;
      showToast(validation.error);
      return;
    }
    summary.textContent = validation.files.length ? `已选择 ${validation.files.length} 个附件：${validation.files.map((file) => file.name).join("、")}` : "尚未选择附件";
    return;
  }
  const waybillSelect = event.target.closest("#expenseForm [data-expense-waybill]");
  if (waybillSelect) {
    const selectedOption = waybillSelect.selectedOptions[0];
    const vehicleSelect = waybillSelect.form.elements.vehicleId;
    if (selectedOption?.dataset.vehicleId && vehicles[selectedOption.dataset.vehicleId]) {
      vehicleSelect.value = selectedOption.dataset.vehicleId;
    }
    return;
  }
  const receiptInput = event.target.closest("#expenseForm input[name='receipt']");
  if (receiptInput) {
    const file = receiptInput.files?.[0];
    const upload = receiptInput.closest(".expense-upload");
    const label = upload.querySelector("strong");
    const hint = upload.querySelector("small");
    if (file && file.size > 10 * 1024 * 1024) {
      receiptInput.value = "";
      label.textContent = "上传发票或支付凭证";
      hint.textContent = "文件超过 10MB，请重新选择";
      upload.classList.add("error");
      showToast("凭证文件不能超过 10MB");
      return;
    }
    label.textContent = file?.name || "上传发票或支付凭证";
    hint.textContent = file ? "已选择凭证" : "支持图片、PDF，单个文件不超过 10MB";
    upload.classList.toggle("selected", Boolean(file));
    upload.classList.remove("error");
    return;
  }
  const repairEvidenceInput = event.target.closest("#driverVehicleRepairForm input[name='evidenceFiles']");
  if (repairEvidenceInput) {
    const files = Array.from(repairEvidenceInput.files || []);
    const oversized = files.find((file) => file.size > 10 * 1024 * 1024);
    const upload = repairEvidenceInput.closest(".expense-upload");
    if (oversized) {
      repairEvidenceInput.value = "";
      upload.querySelector("strong").textContent = "文件超过 10 MB";
      upload.querySelector("small").textContent = "请重新选择较小的凭证文件";
      upload.classList.add("error");
      showToast("单个凭证不能超过 10 MB");
      return;
    }
    upload.querySelector("strong").textContent = files.length ? files.map((file) => file.name).join("、") : "上传现场照片或凭证";
    upload.querySelector("small").textContent = files.length ? `已选择 ${files.length} 个文件` : "支持图片、PDF，单个文件不超过 10 MB";
    upload.classList.toggle("selected", files.length > 0);
    upload.classList.remove("error");
    return;
  }
  const input = event.target.closest("[data-credential-upload-card] input[type='file']");
  if (!input) return;
  const files = Array.from(input.files || []);
  const group = CERTIFICATION_DOCUMENT_GROUPS.find((item) => item.key === input.name);
  if (files.length > 6) {
    input.value = "";
    showToast(`${group?.label || "证件"}最多上传 6 个文件`);
    return;
  }
  if (files.some((file) => !(file.type.startsWith("image/") || file.type === "application/pdf" || /\.(?:jpe?g|png|webp|heic|pdf)$/i.test(file.name)))) {
    input.value = "";
    showToast(`${group?.label || "证件"}仅支持图片或 PDF`);
    return;
  }
  if (files.some((file) => file.size > 10 * 1024 * 1024)) {
    input.value = "";
    showToast(`${group?.label || "证件"}单个文件不能超过 10 MB`);
    return;
  }
  renderSelectedCredentialCard(input);
});

elements.subpageContent.addEventListener("input", (event) => {
  const description = event.target.closest("#driverFeedbackForm textarea[name='description']");
  if (!description) return;
  const counter = description.closest(".feedback-field").querySelector("[data-feedback-count]");
  if (counter) counter.textContent = `${description.value.length}/1000`;
});

elements.subpageContent.addEventListener("click", async (event) => {
  const selectedCredentialPreview = event.target.closest("[data-preview-selected-credential]");
  if (selectedCredentialPreview) {
    openSelectedCredentialPreview(selectedCredentialPreview.closest("[data-credential-upload-card]")?.querySelector("input[type='file']"));
    return;
  }
  const removeCredentialButton = event.target.closest("[data-remove-credential-group]");
  if (removeCredentialButton) {
    const card = removeCredentialButton.closest("[data-credential-upload-card]");
    const input = card?.querySelector("input[type='file']");
    if (!card || !input) return;
    input.value = "";
    input.required = true;
    card.dataset.removeExisting = "true";
    renderSelectedCredentialCard(input);
    showToast("已移除，请重新上传该证件");
    return;
  }
  const feedbackTab = event.target.closest("[data-feedback-tab]");
  if (feedbackTab) {
    state.activeFeedbackTab = feedbackTab.dataset.feedbackTab;
    renderDriverFeedback();
    elements.subpageContent.scrollTop = 0;
    window.lucide?.createIcons();
    return;
  }
  const credentialPreviewButton = event.target.closest("[data-preview-credential]");
  if (credentialPreviewButton) {
    await openCredentialPreview(credentialPreviewButton);
    return;
  }
  const fontButton = event.target.closest(".font-size-options button[data-font-size]");
  if (fontButton) {
    applyFontSize(fontButton.dataset.fontSize);
    return;
  }
  const expenseTypeTarget = event.target.closest("[data-expense-type]");
  if (expenseTypeTarget) {
    state.activeExpenseType = expenseTypeTarget.dataset.expenseType;
    renderSubpage("expenses");
    elements.subpageContent.scrollTop = 0;
    return;
  }
  const actionTarget = event.target.closest("[data-subpage-action]");
  if (!actionTarget) return;
  if (actionTarget.dataset.subpageAction === "edit-personal") {
    renderPersonalEditForm();
    elements.subpageContent.scrollTop = 0;
    return;
  }
  if (actionTarget.dataset.subpageAction === "cancel-personal-edit") {
    renderSubpage("personal");
    elements.subpageContent.scrollTop = 0;
    return;
  }
  if (actionTarget.dataset.subpageAction === "edit-certification") {
    renderCertificationForm(currentCertification());
    elements.subpageContent.scrollTop = 0;
    setTimeout(() => window.lucide?.createIcons(), 0);
    return;
  }
  if (actionTarget.dataset.subpageAction === "cancel-certification-edit") {
    renderSubpage("certification");
    elements.subpageContent.scrollTop = 0;
    return;
  }
  if (actionTarget.dataset.subpageAction === "open-insurance") {
    openProfileSubpage("insurance");
    return;
  }
  if (actionTarget.dataset.subpageAction === "edit-vehicle") {
    const driver = currentDriver();
    const current = driverDispatches().find((item) => item.status === "运输中" && item.vehicleId)
      || driverDispatches().find((item) => item.vehicleId);
    const plateNo = current?.vehicleId || Object.keys(vehicles).find((plate) => vehicles[plate].driverId === driver.id) || "";
    renderVehicleEditForm(plateNo, vehicles[plateNo]);
    elements.subpageContent.scrollTop = 0;
    return;
  }
  if (actionTarget.dataset.subpageAction === "cancel-vehicle-edit") {
    renderSubpage("vehicle");
    elements.subpageContent.scrollTop = 0;
    return;
  }
  if (actionTarget.dataset.subpageAction === "report-vehicle-repair") {
    openProfileSubpage("vehicleRepair");
    return;
  }
  if (actionTarget.dataset.subpageAction === "back-to-vehicle") {
    renderSubpage("vehicle");
    elements.subpageContent.scrollTop = 0;
    return;
  }
  if (actionTarget.dataset.subpageAction === "back-expense-types") {
    state.activeExpenseType = "";
    renderSubpage("expenses");
    elements.subpageContent.scrollTop = 0;
    return;
  }
  const messages = {
    "change-phone": "更换手机号功能将在正式版开放",
    "change-password": "密码修改验证已启动",
    devices: "当前仅有本机登录",
    notifications: "消息提醒设置已更新",
    "clear-cache": "缓存已清理",
    privacy: "隐私政策已是最新版本",
    logout: "当前为演示账号，暂不支持退出",
  };
  showToast(messages[actionTarget.dataset.subpageAction] || "操作已记录");
});

elements.detailActionBar.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-detail-action]");
  if (!button) return;
  const action = button.dataset.detailAction;
  const id = state.activeDispatchId;
  const dispatch = state.dispatches.find((item) => item.id === id);
  if (action === "accept") acceptAndOpenOrders(id);
  if (action === "reject") openReject(id);
  if (action === "progress") openProgress(id);
  if (action === "contact") showToast("调度中心电话：400-800-6688");
  if (action === "back") { closeDetail(); switchView("orders"); }
  if (action === "copy" && dispatch) {
    try { await navigator.clipboard.writeText(dispatch.waybillNo); showToast("运单号已复制"); }
    catch { showToast(`运单号：${dispatch.waybillNo}`); }
  }
});

elements.detailContent.addEventListener("click", async (event) => {
  const photoButton = event.target.closest("[data-view-photo]");
  if (photoButton) {
    openPhotoViewer(state.activeDispatchId, photoButton.dataset.photoNode, photoButton.dataset.photoId, photoButton.dataset.photoName);
    return;
  }
  const button = event.target.closest("[data-detail-action='navigate']");
  if (!button) return;
  const dispatch = state.dispatches.find((item) => item.id === state.activeDispatchId);
  if (!dispatch) return;
  try { await navigator.clipboard.writeText(dispatch.destination); showToast("装卸地已复制，可粘贴到导航软件"); }
  catch { showToast(`装卸地：${dispatch.destination}`); }
});

document.querySelector("#rejectForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const dispatch = state.dispatches.find((item) => item.id === state.activeDispatchId);
  if (!dispatch) return;
  const formData = new FormData(event.currentTarget);
  const reason = formData.get("reason");
  if (!reason) return;
  const remark = String(formData.get("remark") || "").trim();
  dispatch.status = "取消";
  dispatch.currentNode = "已拒绝";
  dispatch.rejectionReason = remark ? `${reason}：${remark}` : reason;
  dispatch.timeline = dispatch.timeline || [];
  dispatch.timeline.push({ node: "已拒绝", time: window.DispatchStore.nowText(), desc: `司机拒绝派单，原因：${dispatch.rejectionReason}`, photos: [] });
  elements.rejectDialog.close();
  persist("已将拒单原因同步给调度员");
  renderDetail();
});

document.querySelector("#progressForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const dispatch = state.dispatches.find((item) => item.id === state.activeDispatchId);
  if (!dispatch) return;
  const formData = new FormData(event.currentTarget);
  const node = nextNode(dispatch);
  const remark = String(formData.get("remark") || "").trim();
  const photoInputs = [...event.currentTarget.querySelectorAll("[data-photo-slot]")];
  const requirements = photoRequirementsForDispatch(dispatch);
  const selectedByRequirement = new Map();
  photoInputs.filter((input) => input.files?.length).forEach((input) => {
    selectedByRequirement.set(input.dataset.photoRequirementId, (selectedByRequirement.get(input.dataset.photoRequirementId) || 0) + 1);
  });
  const missingCount = requirements.reduce((missing, requirement) => {
    const uploaded = uploadedPhotosForRequirement(dispatch, requirement).length;
    return missing + Math.max(0, Number(requirement.quantity || 0) - uploaded - (selectedByRequirement.get(requirement.id) || 0));
  }, 0);
  const nodes = taskNodes(dispatch);
  const isComplete = node === nodes[nodes.length - 1];
  if (isComplete && missingCount) {
    showToast(`完成任务前还需上传 ${missingCount} 张拍照要求照片`);
    return;
  }
  const capturedPhotos = photoInputs.filter((input) => input.files?.length).map((input, index) => ({
    id: `${dispatch.id}-${Date.now()}-${index}-${Math.random().toString(36).slice(2)}`,
    label: input.dataset.photoLabel,
    requirementId: input.dataset.photoRequirementId,
    requirementName: input.dataset.photoRequirementName,
    requirementDescription: input.dataset.photoRequirementDescription,
    requirementSlot: Number(input.dataset.photoSlotNumber),
    uploadedAt: window.DispatchStore.nowText(),
    name: input.files[0].name,
    type: input.files[0].type,
  }));
  try {
    await window.DispatchStore.savePhotos(capturedPhotos.map((photo) => {
      const input = photoInputs.find((item) => item.dataset.photoRequirementId === photo.requirementId && Number(item.dataset.photoSlotNumber) === photo.requirementSlot);
      return { id: photo.id, blob: input.files[0] };
    }));
  } catch (error) {
    console.error("节点照片保存失败。", error);
    showToast("照片未能保存，节点暂未提交");
    return;
  }
  const files = capturedPhotos.map((photo) => `${photo.requirementName}：${photo.name}`);
  dispatch.currentNode = node;
  if (isComplete) dispatch.status = "已完成";
  dispatch.timeline = dispatch.timeline || [];
  dispatch.timeline.push({ node, time: window.DispatchStore.nowText(), desc: remark || `司机已完成“${node}”节点`, photos: files, photoAttachments: capturedPhotos });
  elements.progressDialog.close();
  persist(isComplete ? "任务已完成，状态已同步" : `已提交“${node}”节点`);
  renderDetail();
});

document.querySelector("#progressForm").addEventListener("change", (event) => {
  if (event.target.matches("[data-photo-slot]")) updateProgressPhotoCount();
});

document.querySelector("#photoViewerClose").addEventListener("click", () => document.querySelector("#photoViewerDialog").close());
document.querySelector("#photoViewerDialog").addEventListener("close", clearPhotoViewerUrls);
window.addEventListener("resize", () => {
  if (document.querySelector("#photoViewerDialog").open) positionPhotoViewer();
});

document.querySelectorAll(".bottom-sheet .sheet-close").forEach((button) => {
  button.addEventListener("click", () => button.closest("dialog").close());
});

window.addEventListener("storage", (event) => {
  if (event.key === window.FeedbackManager.STORAGE_KEY) {
    if (state.activeProfilePage === "feedback") renderDriverFeedback();
    return;
  }
  if (event.key === ANNOUNCEMENT_STORAGE_KEY) {
    renderProfile();
    if (document.querySelector("#messagesView").classList.contains("active")) renderDriverMessages();
    return;
  }
  if (event.key === DRIVER_MESSAGE_READ_STORAGE_KEY) {
    renderProfile();
    return;
  }
  if (event.key === window.VehicleRepair.STORAGE_KEY) {
    state.repairs = window.VehicleRepair.load();
    if (state.activeProfilePage === "vehicle" || state.activeProfilePage === "vehicleRepair") renderSubpage(state.activeProfilePage);
    return;
  }
  if (event.key === window.AdminDataBridge.STORAGE_KEY) {
    syncVehicleArchive();
    if (Array.isArray(window.AdminDataBridge.read()?.vehicleRepairs)) state.repairs = window.VehicleRepair.load();
    renderProfile();
    if (state.activeProfilePage === "vehicle" || state.activeProfilePage === "vehicleRepair") renderSubpage(state.activeProfilePage);
    return;
  }
  if (event.key === EXPENSE_STORAGE_KEY) {
    state.expenses = loadExpenses();
    if (state.activeProfilePage === "expenses") renderSubpage("expenses");
    return;
  }
  if (event.key === CERTIFICATION_STORAGE_KEY) {
    state.certifications = loadCertifications();
    renderProfile();
    if (state.activeProfilePage === "certification") renderSubpage("certification");
    return;
  }
  if (event.key === window.DispatchStore.STORAGE_KEY) syncFromStore();
});

window.addEventListener("message", (event) => {
  const message = event.data;
  if (!message || !["dispatch-sync-data", "driver-expense-sync-data"].includes(message.type)) return;
  let changed = false;
  if (Array.isArray(message.dispatches)) {
    state.dispatches = mergeDefaultExamples(message.dispatches, state.dispatches);
    window.DispatchStore.save(state.dispatches);
    changed = true;
  }
  if (Array.isArray(message.expenses)) {
    state.expenses = message.expenses;
    saveExpenses(state.expenses);
    changed = true;
  }
  if (changed) renderAll();
});

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") syncFromStore();
});

applyFontSize(state.fontSize, false);
renderAll();
switchView("tasks");
if (window.opener && !window.opener.closed) {
  window.opener.postMessage({ type: "dispatch-sync-request", expenses: state.expenses }, "*");
}
