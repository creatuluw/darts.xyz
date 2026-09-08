/**
 * Smoke check for email-store "remember me" semantics.
 * Run: npx tsx scripts/smoke-email-store.ts
 * (Master has no test runner yet; this is the one runnable check for the
 *  session-only login logic. Fold into vitest when the suite lands.)
 */

// Stub browser storage BEFORE importing the store module.
function makeStorage() {
    const m = new Map<string, string>();
    return {
        getItem: (k: string) => m.get(k) ?? null,
        setItem: (k: string, v: string) => void m.set(k, String(v)),
        removeItem: (k: string) => void m.delete(k),
        clear: () => m.clear(),
        key: (i: number) => [...m.keys()][i] ?? null,
        get length() {
            return m.size;
        },
    };
}
const local = makeStorage();
const session = makeStorage();
(globalThis as Record<string, unknown>).localStorage = local;
(globalThis as Record<string, unknown>).sessionStorage = session;
(globalThis as Record<string, unknown>).window = globalThis;

function assert(cond: boolean, msg: string) {
    if (!cond) {
        console.error("FAIL:", msg);
        process.exit(1);
    }
}

const mod = await import("../src/lib/stores/email.ts");
const emailStore = mod.emailStore;
const accounts = mod.accountsStore;

// 1. Fresh browser → not logged in
assert(emailStore.getEmail() === "", "fresh: no active email");

// 2. Unchecked "remember me" → session-only
emailStore.setEmail("guest@x.com", false);
assert(session.getItem("darts_email") === "guest@x.com", "session-only: raw value in sessionStorage");
assert(local.getItem("darts_email") === null, "session-only: nothing in localStorage");
assert(local.getItem("darts_accounts") === null, "session-only: not added to accounts list");
assert(emailStore.getEmail() === "guest@x.com", "session-only: active in memory");

// 3. Checked "remember me" → persisted, stale session login cleared
emailStore.setEmail("real@x.com", true);
assert(local.getItem("darts_email") === "real@x.com", "remembered: raw value in localStorage");
assert(session.getItem("darts_email") === null, "remembered: stale session key cleared");
assert(accounts.get().includes("real@x.com"), "remembered: added to accounts list");
assert(!accounts.get().includes("guest@x.com"), "guest never in accounts list");

// 4. Sign out → back to gate, nothing left behind
emailStore.clearEmail();
assert(emailStore.getEmail() === "", "cleared: no active email");
assert(local.getItem("darts_email") === null && session.getItem("darts_email") === null, "cleared: both storages empty");

// 5. Init precedence: a live session login shadows the remembered one,
//    and a session-only email is NOT promoted into the accounts list.
local.setItem("darts_email", "a@x.com");
local.setItem("darts_accounts", JSON.stringify(["a@x.com"]));
session.setItem("darts_email", "b@x.com");
const fresh = await import("../src/lib/stores/email.ts?v=2");
assert(fresh.emailStore.getEmail() === "b@x.com", "init: session wins over remembered");
assert(
    JSON.stringify(fresh.accountsStore.get()) === JSON.stringify(["a@x.com"]),
    "init: session-only email not promoted to accounts list",
);

console.log("email-store smoke check: all assertions passed");
