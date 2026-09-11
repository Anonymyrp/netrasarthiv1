// Legacy import path — re-exports the single guarded Firebase instance
// from ./config/firebase so both paths stay wired to one app.
// (Keeps the unconditional initializeApp + placeholder config that used
// to live here from ever causing a duplicate-app crash.)
export { db } from "./config/firebase";
