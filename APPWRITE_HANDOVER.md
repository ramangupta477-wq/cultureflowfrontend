# Cultureflow — Appwrite Waitlist Backend: Handover

**Date:** Oct 15, 2026 · **Status:** ✅ Live and fully tested · **Owner of backend setup:** Raman's session

## 1. Project details

| Setting | Value |
|---|---|
| Appwrite Cloud region | `syd` (Sydney) |
| Endpoint | `https://syd.cloud.appwrite.io/v1` |
| Project ID | `6acfd0f50000c85e0e60` |
| Database ID | `cultureflow` |
| Collection ID | `waitlist` |

The web SDK client is already initialized in [lib/appwrite.ts](web/lib/appwrite.ts) (Next.js app in `web/`), with `appwrite` npm package installed.

## 2. Collection permissions

- Collection-level permission: `create("any")` — anyone (including anonymous sessions) can create documents. No login required.
- `documentSecurity` is **false**, so documents can only be read/updated/deleted via the console or an API key — waitlist entries are write-only from the public web. This is intentional: leads are private.
- If you ever want a public "check my status" page, you'd need to flip `documentSecurity` on and add per-document permissions at creation. Don't do this by default.

## 3. Schema (12 attributes, all verified)

| Key | Type | Required | Allowed values |
|---|---|---|---|
| `fullName` | string (256) | ✅ | — |
| `email` | string, format `email`, 320 max | ✅ | — (unique index on it) |
| `phone` | string (20) | — | — |
| `role` | enum | ✅ | `student` / `parent` / `institution` |
| `city` | string (64) | ✅ | — |
| `college` | string (128) | — | — |
| `yearOfStudy` | enum | — | `first` / `second` / `third` / `fourth` / `postgrad` |
| `tracks` | string array, max 3 items | — | any strings (form sends `music` / `dance` / `art`) |
| `source` | enum | — | `instagram` / `friend` / `college` / `other` |
| `referralCode` | string (16) | — | — |
| `consent` | boolean | ✅ | must be `true` |
| `status` | enum | — | `new` / `contacted` / `enrolled` / `archived` — for internal team use, leave unset on submit (Appwrite allows null) |

**Index:** `email_unique` (unique on `email`) — duplicate submissions are rejected by the database itself.

## 4. Integration snippet (what the form submit should do)

```ts
import { Databases } from "appwrite";
import { client } from "@/lib/appwrite";

const db = new Databases(client);

await db.createDocument(
  "cultureflow",       // databaseId
  "waitlist",          // collectionId
  "unique()",          // documentId
  {
    fullName,          // required
    email,             // required, must be valid email format
    role,              // required: "student" | "parent" | "institution"
    city,              // required
    consent,           // required: must be true — gate the submit on the checkbox
    phone,             // optional
    college,           // optional
    yearOfStudy,       // optional: "first"|"second"|"third"|"fourth"|"postgrad"
    tracks,            // optional: string[] e.g. ["music","dance","art"], max 3
    source,            // optional: "instagram"|"friend"|"college"|"other"
    referralCode,      // optional
    // status: leave out — team sets it via console
  }
);
```

**Error handling in the form:**
- Duplicate email → Appwrite throws with message `Document violates a unique attribute constraint`. Catch this and show "You're already on the list" instead of a generic error.
- Invalid enum value → `Invalid document structure: Attribute "X" has invalid format...`. Only happens if the form sends something off-script; keep dropdown values exactly as listed above.
- Missing required → same `Invalid document structure` prefix with `Missing required attribute "X"`.

No API key is needed in the frontend — `create("any")` covers anonymous creates. **Never put an API key in frontend code.**

## 5. Test results (all passed Oct 15, 2026)

| Test | Result |
|---|---|
| Create full document (all 12 fields) | ✅ 201 |
| Create with only required fields | ✅ |
| Duplicate email rejected by unique index | ✅ |
| Invalid enum (`role: "teacher"`) rejected | ✅ |
| Missing required (`city`) rejected | ✅ |
| Update `status` → `contacted` | ✅ |
| Read document back, fields intact | ✅ |
| Delete document | ✅ |
| Anonymous session (no login) create from web-style request | ✅ 201 |
| Collection empty after cleanup | ✅ 0 docs |

## 6. Gotchas / things that cost time — read before changing schema

1. **CLI enum creation:** `--elements student,parent,institution` (comma-separated) silently creates an attribute with an **empty** elements list. Must pass repeated flags: `--elements student --elements parent --elements institution`. We hit this; the four enums were deleted and recreated correctly.
2. **CLI default values:** the flag is `--xdefault` (not `--default`), and it currently errors with "Default value not found in elements" even when valid — so `status` has **no default**. Handle null status in any team-side listing.
3. **API key scopes:** the project's standard API key initially lacked `collections.write`; it was granted more scopes during setup via the console. If a teammate's CLI/REST call 401s with `missing scopes ([...])`, add that scope to the API key in console → API Keys.
4. `list-attributes` (CLI + REST) doesn't return `elements` in list responses — only `get-attribute` per key does. Don't panic if enums look empty in a list.

## 7. Team workflow for managing leads

- View/manage submissions: Appwrite console → project `6acfd0f50000c85e0e60` → Databases → `cultureflow` → `waitlist`. Full CRUD + filters there.
- Or CLI: `appwrite login` once, then `appwrite databases list-documents --database-id cultureflow --collection-id waitlist`.
- `status` column is your lead pipeline: `new` → `contacted` → `enrolled` / `archived`.
