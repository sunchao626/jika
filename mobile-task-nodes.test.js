const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

const source = fs.readFileSync("mobile.js", "utf8");
const styles = fs.readFileSync("mobile.css", "utf8");
const taskNodesSource = fs.readFileSync("dispatch-task-nodes.js", "utf8");
const constantsStart = source.indexOf("const DEFAULT_TASK_TYPE");
const constantsEnd = source.indexOf("const dispatchSeed", constantsStart);
const helpersStart = source.indexOf("function dispatchTaskType(");
const helpersEnd = source.indexOf("function taskCard(", helpersStart);
assert.ok(constantsStart >= 0 && constantsEnd > constantsStart, "task node sequences must exist");
assert.ok(helpersStart >= 0 && helpersEnd > helpersStart, "task node helpers must exist");

const context = vm.createContext({
  window: { PhotoRequirementConfig: { forTaskType: () => [{ quantity: 10 }] } },
  waybillMeta: {},
  h: (value) => String(value),
  dispatchCategory: (dispatch) => {
    if (dispatch.status === "已派单") return "pending";
    if (dispatch.status === "运输中") return "active";
    if (dispatch.status === "已完成") return "completed";
    return "cancelled";
  },
  statusLabel: (dispatch) => dispatch.currentNode || dispatch.status,
});
vm.runInContext(taskNodesSource, context);
vm.runInContext(`${source.slice(constantsStart, constantsEnd)}\n${source.slice(helpersStart, helpersEnd)}`, context);
const orderCardStart = source.indexOf("function orderCard(");
const orderCardEnd = source.indexOf("function renderOrders(", orderCardStart);
assert.ok(orderCardStart >= 0 && orderCardEnd > orderCardStart, "order card renderer must exist");
vm.runInContext(source.slice(orderCardStart, orderCardEnd), context);

const expectedSequences = {
  "提空装货": ["已提空", "空箱在途", "到达仓库", "完成装货", "重箱在途", "重箱进站", "完成落重"],
  "提重送货": ["已提重", "重箱在途", "到达仓库", "完成卸货", "空箱在途", "空箱进站", "完成落空"],
  "排空箱（A→B）": ["已提空", "空箱在途", "完成落空"],
  "排重箱（A→B）": ["已提重", "重箱在途", "箱进站", "完成落重"],
};

for (const [taskType, nodes] of Object.entries(expectedSequences)) {
  assert.deepEqual([...context.taskNodes({ taskType })], nodes, `${taskType} must use its own node sequence`);
}

const pending = { taskType: "提空装货", status: "已派单", currentNode: "待提货", timeline: [] };
const pendingOverview = context.renderTaskNodeOverview(pending);
assert.match(pendingOverview, /任务类型[\s\S]*提空装货[\s\S]*当前节点 <b>待执行<\/b>[\s\S]*0\/7/);
assert.match(pendingOverview, /role="progressbar"[\s\S]*aria-valuenow="0"/);
assert.doesNotMatch(pendingOverview, /已提空|空箱在途|到达仓库|完成装货|重箱在途|重箱进站|完成落重/);
assert.ok([...context.taskNodes(pending).keys()].every((index) => context.taskNodeActionState(pending, index) === "pending"));

const active = { taskType: "提重送货", status: "运输中", currentNode: "到达仓库", timeline: [] };
const activeProgress = context.getTaskProgress(active);
assert.equal(activeProgress.currentIndex, 2);
assert.equal(activeProgress.currentNode, "到达仓库");
assert.equal(activeProgress.completedCount, 3);
assert.equal(activeProgress.progress, 43);
assert.equal(context.nextNode(active), "完成卸货");
assert.deepEqual(
  [...activeProgress.nodes.map((_, index) => context.taskNodeActionState(active, index))],
  ["completed", "completed", "completed", "actionable", "upcoming", "upcoming", "upcoming"],
);
assert.match(context.renderDetailActionBar(active), /联系调度[\s\S]*data-detail-action="progress" data-node="完成卸货"[\s\S]*提交 完成卸货/);
const activeOrderCard = context.orderCard({ ...active, id: "PD-ACTIVE" });
assert.match(activeOrderCard, /class="order-contact-action" data-action="contact" data-id="PD-ACTIVE"[^>]*>联系调度<\/button>/);
assert.match(activeOrderCard, /class="order-progress-action" data-action="progress" data-id="PD-ACTIVE" data-node="完成卸货"/);
assert.match(activeOrderCard, />提交 完成卸货<\/button>/, "active order cards must expose the current node submit action");
const pendingOrderCard = context.orderCard({ ...pending, id: "PD-PENDING" });
assert.match(pendingOrderCard, /class="order-contact-action"[^>]*>联系调度<\/button>/, "pending order cards must expose the contact action");
assert.doesNotMatch(pendingOrderCard, /order-progress-action/, "pending order cards must not show an in-progress action");

active.currentNode = "完成卸货";
assert.match(context.renderDetailActionBar(active), /data-node="空箱在途"[\s\S]*提交 空箱在途/, "bottom action must advance with task progress");

const accepted = { taskType: "排重箱（A→B）", status: "运输中", currentNode: "已接单", timeline: [] };
assert.equal(context.nextNode(accepted), "已提重");
assert.equal(context.taskNodeActionState(accepted, 0), "actionable");

const completed = { taskType: "排空箱（A→B）", status: "已完成", currentNode: "完成落空", timeline: [] };
const completedOverview = context.renderTaskNodeOverview(completed);
const completedOrderCard = context.orderCard({ ...completed, id: "PD-COMPLETE" });
assert.match(completedOrderCard, /class="order-contact-action"[^>]*>联系调度<\/button>/, "completed order cards must expose the contact action");
assert.doesNotMatch(completedOrderCard, /order-progress-action/, "completed order cards must not show an in-progress action");
assert.match(completedOverview, /当前节点 <b>完成落空<\/b>[\s\S]*3\/3/);
assert.match(completedOverview, /aria-valuenow="100"/);
assert.doesNotMatch(completedOverview, /已提空|空箱在途/);
assert.ok([...context.taskNodes(completed).keys()].every((index) => context.taskNodeActionState(completed, index) === "completed"));
assert.match(context.renderDetailActionBar(pending), /拒绝[\s\S]*确认接单/, "pending dispatch actions must remain unchanged");

assert.equal((source.match(/\$\{renderTaskNodeOverview\(dispatch\)\}/g) || []).length, 2, "task and order cards must both render node overviews");
assert.match(source, /<strong class="detail-card-title">任务进度<\/strong><span>\$\{h\(taskProgress\.taskType\)\}<\/span>/);
assert.doesNotMatch(source, /renderDetailTaskNodes/, "detail screen must not render the standalone task node list");
assert.match(source, /const isComplete = node === nodes\[nodes\.length - 1\]/);
assert.match(source, /当前节点 <strong>\$\{h\(taskProgress\.currentNode\)\}<\/strong>/);
assert.match(source, /role="progressbar"[\s\S]*aria-valuenow="\$\{taskProgress\.progress\}"/);
assert.doesNotMatch(source.slice(source.indexOf("function renderTaskNodeOverview("), source.indexOf("function taskNodeActionState(", source.indexOf("function renderTaskNodeOverview("))), /progress\.nodes\.map/);
assert.match(styles, /\.task-progress-track i,[\s\S]*\.detail-progress-track i/);
assert.match(styles, /\.detail-node-list/);
assert.match(source, /PD-1011[\s\S]*提空装货[\s\S]*PD-1012[\s\S]*排空箱（A→B）[\s\S]*PD-1013[\s\S]*排重箱（A→B）[\s\S]*PD-1014[\s\S]*提重送货/);
assert.equal(context.photoRequirementsForDispatch({ taskType: "提重送货" }).reduce((sum, item) => sum + item.quantity, 0), 10);
assert.match(source, /if \(requestedNode && requestedNode !== node\) return/);
assert.match(source, /async function openPhotoViewer\(/);
assert.match(source, /data-view-photo data-photo-id/);
assert.match(source, /photoAttachments: capturedPhotos/);
assert.match(source, /window\.DispatchStore\.savePhotos/);
assert.match(source, /if \(action === "progress"\) openProgress\(id, button\.dataset\.node\)/);
assert.match(source, /if \(action === "contact"\) showToast\("调度中心电话：400-800-6688"\)/);
assert.match(source, /renderDetailActionBar\(dispatch, category\)/);
const taskProgressSectionIndex = source.indexOf('<strong class="detail-card-title">任务进度</strong>');
const nodeRecordsSectionIndex = source.indexOf('<strong class="detail-card-title">节点记录</strong>');
const waybillInfoSectionIndex = source.indexOf('<strong class="detail-card-title">运单信息</strong>');
assert.ok(taskProgressSectionIndex < nodeRecordsSectionIndex && nodeRecordsSectionIndex < waybillInfoSectionIndex, "node records must appear immediately after task progress and before waybill information");

console.log("Mobile task type and node flow test passed");
