const assert = require("node:assert/strict");
const fs = require("node:fs");

const html = fs.readFileSync("index.html", "utf8");
const styles = fs.readFileSync("styles.css", "utf8");
const script = fs.readFileSync("app.js", "utf8");

const topbarStart = html.indexOf('class="topbar"');
const topbarEnd = html.indexOf("</header>", topbarStart);
const topbar = html.slice(topbarStart, topbarEnd);

assert.match(topbar, /class="user-account"[^>]*id="userAccountButton"[^>]*aria-label="当前用户：正在加载，已登录"[^>]*aria-haspopup="menu"[^>]*aria-expanded="false"/);
assert.match(topbar, /class="user-avatar"[\s\S]*data-lucide="user-round"/);
assert.match(topbar, /class="user-account-copy"[\s\S]*<strong id="currentUserDisplayName">正在加载<\/strong>[\s\S]*class="user-login-dot"[\s\S]*已登录/);
assert.match(topbar, /<strong id="currentMenuUserDisplayName">正在加载<\/strong>[\s\S]*<span id="currentUserRoleDisplay">当前身份：正在加载<\/span>/);
assert.match(topbar, /id="userAccountMenu"[^>]*role="menu"[^>]*hidden/);
assert.doesNotMatch(topbar, /data-user-action="switch"|切换身份|体验其他岗位视角/);
assert.match(topbar, /role="menuitem"[^>]*data-user-action="logout"[\s\S]*退出登录/);
assert.match(topbar, /id="userActionFeedback"[^>]*role="status"[^>]*aria-live="polite"[^>]*hidden/);
assert.match(styles, /\.user-avatar\s*\{[\s\S]*border-radius:\s*50%/);
assert.match(styles, /\.user-login-dot\s*\{[\s\S]*background:\s*var\(--success\)/);
assert.match(styles, /\.user-account-menu\s*\{[\s\S]*position:\s*absolute/);
assert.match(script, /function setUserAccountMenu\(open\)[\s\S]*aria-expanded[\s\S]*userAccountMenu\.hidden = !open/);
assert.match(script, /function renderCurrentUserIdentity\(\)[\s\S]*UserAccess\?\.currentUser[\s\S]*UserAccess\?\.currentRole[\s\S]*currentUserRoleDisplay[\s\S]*userAccountButton\?\.setAttribute\("aria-label"/);
assert.match(script, /user-access-changed[\s\S]*renderCurrentUserIdentity\(\)/);
assert.doesNotMatch(script, /身份切换功能演示/);
assert.match(script, /logout: "退出登录功能演示，当前登录状态未改变"/);
assert.match(script, /!userAccountWrap\.contains\(event\.target\)[\s\S]*setUserAccountMenu\(false\)/);
assert.match(script, /event\.key !== "Escape"[\s\S]*setUserAccountMenu\(false\)[\s\S]*userAccountButton\.focus\(\)/);
assert.doesNotMatch(topbar, /class="user-chip"/);

console.log("Topbar user identity test passed");
