const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

const source = fs.readFileSync("mobile.js", "utf8");
const html = fs.readFileSync("mobile.html", "utf8");
const styles = fs.readFileSync("mobile.css", "utf8");
const storeSource = fs.readFileSync("dispatch-store.js", "utf8");
const taskNodesSource = fs.readFileSync("dispatch-task-nodes.js", "utf8");
const photoRequirementsSource = fs.readFileSync("photo-requirements.js", "utf8");
const constantsStart = source.indexOf("const DEFAULT_TASK_TYPE");
const constantsEnd = source.indexOf("const dispatchSeed", constantsStart);
const typeHelpersStart = source.indexOf("function dispatchTaskType(");
const typeHelpersEnd = source.indexOf("function photoRequirementsForDispatch(", typeHelpersStart);
const photoHelpersStart = source.indexOf("function photoRequirementsForDispatch(");
const photoHelpersEnd = source.indexOf("let photoViewerUrls", photoHelpersStart);
const renderRequirementsStart = source.indexOf("function renderProgressPhotoRequirements(");
const renderRequirementsEnd = source.indexOf("function isTaskAwaitingStart(", renderRequirementsStart);
assert.ok(constantsStart >= 0 && constantsEnd > constantsStart, "task type constants must exist");
assert.ok(typeHelpersStart >= 0 && typeHelpersEnd > typeHelpersStart, "task type helpers must exist");
assert.ok(photoHelpersStart >= 0 && photoHelpersEnd > photoHelpersStart, "photo upload helpers must exist");

const nodes = {
  photoRequirements: { hidden: false, dataset: {} },
  photoSlotList: { innerHTML: "" },
  photoRequirementsHint: { textContent: "" },
  photoRequirementsCount: { textContent: "" },
  photoRequirementsTitle: { textContent: "" },
};
const photoConfigStorage = new Map();
const context = vm.createContext({
  window: {},
  localStorage: { getItem: (key) => photoConfigStorage.get(key) || null, setItem: (key, value) => photoConfigStorage.set(key, value) },
  CustomEvent: function CustomEvent(type, init) { this.type = type; this.detail = init.detail; },
  console,
  state: { dispatches: [], activeDispatchId: "" },
  waybillMeta: {},
  h: (value) => String(value),
  document: { querySelector: (selector) => nodes[selector.slice(1)] },
});
vm.runInContext(taskNodesSource, context);
vm.runInContext(photoRequirementsSource, context);
vm.runInContext(`${source.slice(constantsStart, constantsEnd)}\n${source.slice(typeHelpersStart, typeHelpersEnd)}\n${source.slice(photoHelpersStart, photoHelpersEnd)}\n${source.slice(renderRequirementsStart, renderRequirementsEnd)}`, context);

const configuration = context.window.PhotoRequirementConfig.load();
for (const taskType of Object.keys(context.window.DispatchTaskNodes.sequences)) {
  const requirements = configuration[taskType];
  const total = requirements.reduce((sum, item) => sum + item.quantity, 0);
  const dispatch = { taskType, timeline: [] };
  assert.deepEqual([...context.photoRequirementsForDispatch(dispatch)].map((item) => item.name), [...requirements].map((item) => item.name));
  context.renderProgressPhotoRequirements(dispatch, context.taskNodes(dispatch)[0]);
  assert.equal(nodes.photoRequirements.hidden, false);
  assert.equal((nodes.photoSlotList.innerHTML.match(/data-photo-slot /g) || []).length, total);
  for (const requirement of requirements) {
    assert.ok(nodes.photoSlotList.innerHTML.includes(requirement.name));
    assert.ok(nodes.photoSlotList.innerHTML.includes(requirement.description));
  }
  assert.equal(nodes.photoRequirementsCount.textContent, `0/${total}`);
}

const snapshot = [{ id: "rule-a", name: "签封照片", description: "封号需清晰", quantity: 2 }];
const snapshotDispatch = { taskType: "提空装货", photoRequirements: snapshot, timeline: [{ photoAttachments: [{ requirementId: "rule-a", requirementName: "签封照片" }] }] };
assert.deepEqual([...context.photoRequirementsForDispatch(snapshotDispatch)].map((item) => item.id), ["rule-a"]);
context.renderProgressPhotoRequirements(snapshotDispatch, "已提空");
assert.equal((nodes.photoSlotList.innerHTML.match(/data-photo-slot /g) || []).length, 1, "previously uploaded requirement slots stay completed");
assert.match(nodes.photoRequirementsTitle.textContent, /1\/2 张已上传/);
context.renderProgressPhotoRequirements(snapshotDispatch, "完成落重");
assert.equal(nodes.photoRequirements.dataset.finalNode, "true");

assert.equal(context.missingPhotoCount([{ files: [] }, { files: [{}] }, { files: [] }]), 2);
assert.equal(context.missingPhotoCount([]), 0, "empty requirement collections remain valid");

const submitStart = source.indexOf('document.querySelector("#progressForm").addEventListener("submit"');
const submitEnd = source.indexOf('document.querySelector("#progressForm").addEventListener("change"', submitStart);
const submitHandler = source.slice(submitStart, submitEnd);
assert.ok(submitStart >= 0 && submitEnd > submitStart, "progress submission handler must exist");
assert.match(submitHandler, /if \(isComplete && missingCount\) \{[\s\S]*return;/);
assert.match(submitHandler, /requirementId: input\.dataset\.photoRequirementId[\s\S]*name: input\.files\[0\]\.name/);
assert.match(submitHandler, /await window\.DispatchStore\.savePhotos/);
assert.ok(submitHandler.indexOf("if (isComplete && missingCount)") < submitHandler.indexOf("dispatch.currentNode = node"), "missing photos must block final task completion");
assert.ok(submitHandler.indexOf("await window.DispatchStore.savePhotos") < submitHandler.indexOf("dispatch.currentNode = node"), "photos must be persisted before node completion");
assert.match(html, /id="photoRequirements"[\s\S]*id="photoSlotList"/);
assert.match(html, /id="photoViewerDialog"[\s\S]*id="photoViewerGrid"/);
assert.match(source, /accept="image\/\*" capture="environment"/);
assert.match(source, /data-photo-requirement-id="\$\{h\(requirement\.id\)\}"/);
assert.match(source, /data-view-photo data-photo-id=/);
assert.match(source, /nodePhotoAttachments\(dispatch, node\)/);
assert.match(source, /data-photo-name="\$\{h\(photo\)\}"/);
assert.match(source, /photoLabels\.map\(\(label, index\) => \(\{ id: `placeholder-\$\{index\}`, label, placeholder: true \}\)\)/);
assert.match(source, /photo\.placeholder \? null : await window\.DispatchStore\.getPhoto/);
assert.match(storeSource, /function savePhotos\(photos\)/);
assert.match(storeSource, /function getPhoto\(id\)/);
assert.match(storeSource, /window\.DispatchStore = \{[^}]*savePhotos, getPhoto/);
assert.match(styles, /\.photo-slot-list \{ display: grid; grid-template-columns: minmax\(0, 1fr\)/);
assert.match(styles, /\.photo-requirements \{ margin-top: 13px;[^}]*background: #fafaff/);
assert.doesNotMatch(styles, /\.photo-requirements \{[^}]*max-height:/);
assert.match(styles, /\.progress-dialog-scroll \{ min-height: 0; flex: 1; overflow-y: auto/);
assert.match(styles, /#progressForm > \.primary-action \{ flex: 0 0 auto/);
assert.match(html, /id="progressForm"[\s\S]*class="progress-dialog-scroll"[\s\S]*id="photoRequirements"[\s\S]*确认提交/);
assert.match(styles, /\.photo-viewer-item img/);
assert.match(styles, /\.photo-viewer-grid \{ display: grid; grid-template-columns: repeat\(2, minmax\(0, 1fr\)\)/);
assert.match(styles, /\.photo-viewer-placeholder \{[^}]*flex-direction: column/);
assert.match(styles, /@media \(max-width: 360px\)[\s\S]*\.photo-viewer-placeholder \{ min-height: 116px/);

const renderTagsStart = source.indexOf("function renderTimelinePhotoTags(");
const renderTagsEnd = source.indexOf("function nextNode(", renderTagsStart);
const placeholderStart = source.indexOf("function renderPhotoPlaceholder(");
const placeholderEnd = source.indexOf("async function openPhotoViewer(", placeholderStart);
const viewContext = vm.createContext({ h: (value) => String(value) });
vm.runInContext(`${source.slice(renderTagsStart, renderTagsEnd)}\n${source.slice(placeholderStart, placeholderEnd)}`, viewContext);
assert.match(viewContext.renderTimelinePhotoTags({ node: "已提空", photos: ["左侧箱体"] }), /<button[^>]*data-view-photo[^>]*data-photo-name="左侧箱体"/);
const timelineAttachment = viewContext.renderTimelinePhotoTags({ node: "已提空", photoAttachments: [{ id: "photo-1", label: "左侧箱体" }] });
assert.match(timelineAttachment, /class="timeline-photo"[^>]*data-photo-id="photo-1"[^>]*data-timeline-photo/);
assert.match(timelineAttachment, /class="timeline-photo-frame"[\s\S]*class="timeline-photo-label">左侧箱体/);
assert.match(source, /async function renderTimelinePhotoImages\(\)/);
assert.match(source, /window\.DispatchStore\.getPhoto\(button\.dataset\.photoId\)/);
assert.match(source, /renderTimelinePhotoImages\(\);/);
assert.doesNotMatch(source, /renderDetailTaskNodes/);
assert.match(styles, /\.photo-tags \{ display: grid; grid-template-columns: repeat\(auto-fill, minmax\(64px, 1fr\)\)/);
assert.match(styles, /\.timeline-photo-frame img \{ display: block; width: 100%; height: 100%; object-fit: cover/);
assert.match(viewContext.renderPhotoPlaceholder({ label: "左侧箱体" }), /演示占位照片[\s\S]*左侧箱体/);

const positionStart = source.indexOf("function positionPhotoViewer(");
const positionEnd = source.indexOf("function renderPhotoPlaceholder(", positionStart);
const viewerStyle = new Map();
const viewerDialog = { style: { setProperty: (name, value) => viewerStyle.set(name, value) } };
const phoneShell = { getBoundingClientRect: () => ({ left: 818, bottom: 1004, width: 410, height: 820 }) };
const positionContext = vm.createContext({
  document: { querySelector: (selector) => selector === ".phone-shell" ? phoneShell : viewerDialog },
  window: { innerHeight: 1024 },
});
vm.runInContext(source.slice(positionStart, positionEnd), positionContext);
positionContext.positionPhotoViewer();
assert.equal(viewerStyle.get("--viewer-left"), "818px");
assert.equal(viewerStyle.get("--viewer-bottom"), "20px");
assert.equal(viewerStyle.get("--viewer-width"), "410px");
assert.equal(viewerStyle.get("--viewer-height"), "820px");
assert.match(styles, /\.photo-viewer-dialog \{ position: fixed; inset: auto auto var\(--viewer-bottom, 0px\) var\(--viewer-left, 0px\)/);
assert.match(source, /window\.addEventListener\("resize", \(\) => \{[\s\S]*positionPhotoViewer\(\)/);

console.log("Mobile node photo requirement test passed");
