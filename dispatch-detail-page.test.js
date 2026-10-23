const assert = require("node:assert/strict");
const fs = require("node:fs");

const html = fs.readFileSync("index.html", "utf8");
const app = fs.readFileSync("app.js", "utf8");
const styles = fs.readFileSync("styles.css", "utf8");
const mobileHtml = fs.readFileSync("mobile.html", "utf8");
const mobile = fs.readFileSync("mobile.js", "utf8");
const nodeSource = fs.readFileSync("dispatch-task-nodes.js", "utf8");

assert.match(html, /id="dispatchDetailPage"/);
assert.match(html, /id="dispatchDetailBackBtn"[\s\S]*返回派单列表/);
assert.match(html, /id="dispatchDetailPageContent"/);
assert.match(html, /id="dispatchPhotoPreviewDialog"/);
assert.match(app, /dispatchDetail: document\.querySelector\("#dispatchDetailPage"\)/);
assert.match(app, /"dispatch-detail": \{[^}]*view: "dispatchDetail"[^}]*navPage: "dispatch-list"/);
assert.match(app, /function openDispatchDetail\(dispatchId\)[\s\S]*switchPage\("dispatch-detail"\)/);
assert.match(app, /function formatPlannedBerthingTime\(dispatch\)[\s\S]*waybill\?\.plannedBerthingTime \|\| waybill\?\.executionTime/);
assert.match(app, /plannedBerthingTime: "2026-09-16T08:00"/);
assert.match(app, /plannedBerthingTime: "2026-09-17T07:30"/);
assert.match(app, /<span>收货人<\/span>/);
assert.match(app, /<span>到达时间<\/span>/);
assert.match(app, /<span>到达地点<\/span>/);
assert.match(app, /<h3>作业地点<\/h3>/);
assert.match(app, /dispatch-job-location-detail/);
assert.match(app, /<span>备注<\/span>/);
assert.match(app, /function renderDispatchPhotoRequirementList\(dispatch, taskType\)[\s\S]*dispatch-requirement-photos/);
assert.match(app, /拍摄说明/);
assert.match(app, /photo\.requirementId === requirement\.id/);
assert.match(app, /renderDispatchPhotoRequirementList\(dispatch, taskType\)/);
assert.match(app, /item\.photoAttachments[\s\S]*item\.photos/);
assert.match(app, /window\.DispatchStore\?\.getPhoto/);
assert.match(app, /data-dispatch-photo-index/);
assert.match(app, /dispatchDetailBackBtn\?\.addEventListener\("click", \(\) => switchPage\("dispatch-list"\)\)/);
assert.match(styles, /\.dispatch-detail-page-grid/);
assert.match(styles, /\.dispatch-photo-preview-dialog/);
assert.match(html, /dispatch-store\.js[\s\S]*dispatch-task-nodes\.js[\s\S]*app\.js/);
assert.match(mobileHtml, /dispatch-store\.js[\s\S]*dispatch-task-nodes\.js[\s\S]*mobile\.js/);
assert.match(app, /function getDispatchDetailSampleNodes\(dispatch, taskType\)/);
assert.match(app, /window\.DispatchTaskNodes\.get\(taskType\)/);
assert.match(app, /function formatDispatchPhotoTime\(value\)/);
assert.match(app, /function formatDispatchPhotoTime\(value\)[\s\S]*return match \? match\[1\] : "-"/);
assert.match(app, /拍照时间 \$\{dashboardEscape\(formatDispatchPhotoTime\(meta\.capturedAt\)\)\}/);
assert.match(app, /dispatch-photo-watermark/);
assert.match(styles, /\.dispatch-photo-watermark/);
assert.match(app, /后台测试数据/);
assert.doesNotMatch(app.slice(app.indexOf("function getDispatchDetailSampleNodes"), app.indexOf("function openDispatchDetail")), /dispatch\.timeline/);
assert.match(mobile, /window\.DispatchTaskNodes\.sequences/);
for (const node of ["已提空", "空箱在途", "到达仓库", "完成装货", "重箱在途", "重箱进站", "完成落重", "已提重", "完成卸货", "空箱进站", "完成落空", "箱进站"]) {
  assert.ok(nodeSource.includes(node), `shared node list should contain ${node}`);
}

console.log("Dispatch detail second-level page test passed");
