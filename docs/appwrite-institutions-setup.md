# Appwrite Handbook — `institution_inquiries` Collection Setup

> Hand this to any agent/person. Everything needed to complete the setup is in this file.
> Project: **Culture Flow** · Appwrite region **Sydney** · Appwrite **v2.5.0** REST API.

## 1. Connection details

| Value | Value |
|---|---|
| Endpoint | `https://syd.cloud.appwrite.io/v1` |
| Project ID | `6acfd0f50000c85e0e60` |
| Database ID | `cultureflow` |
| Collection ID to create | `institution_inquiries` |

Auth header pair for every REST call:

```
X-Appwrite-Project: 6acfd0f50000c85e0e60
X-Appwrite-Key: <API key>
```

**API key scopes required** (this is where previous keys failed — all three were missing these):

- `databases.write`
- `collections.write`
- `attributes.write`
- `documents.write`

In the Appwrite Console: **Overview → Integrations → API Keys → Create API key**, expand the *Databases* scope section and tick the four scopes above. Read scopes (`databases.read`, `collections.read`, `attributes.read`, `documents.read`) are optional but useful for verification.

## 2. Create the collection

Console path: **Databases → cultureflow → Add collection**

REST equivalent:

```bash
curl -X POST "https://syd.cloud.appwrite.io/v1/databases/cultureflow/collections" \
  -H "X-Appwrite-Project: 6acfd0f50000c85e0e60" \
  -H "X-Appwrite-Key: <API key>" \
  -H "Content-Type: application/json" \
  -d '{
    "collectionId": "institution_inquiries",
    "name": "Institution Inquiries",
    "permissions": ["create(\"any\")"],
    "documentSecurity": false
  }'
```

- Permissions: role **Any** with only **Create** enabled (anonymous visitors submit inquiries).
- Document security **off** (permissions live at collection level).

## 3. Attributes — 11 string attributes, all `required: false`

Create each via **Attributes → Create attribute → String** (size in brackets):

| # | Key | Size | Required |
|---|---|---|---|
| 1 | `institutionType` | 128 | no |
| 2 | `institutionName` | 256 | no |
| 3 | `city` | 128 | no |
| 4 | `state` | 128 | no |
| 5 | `country` | 128 | no |
| 6 | `contactName` | 256 | no |
| 7 | `designation` | 256 | no |
| 8 | `email` | 256 | no |
| 9 | `mobile` | 64 | no |
| 10 | `lookingFor` | 128 | no |
| 11 | `message` | 4096 | no |

REST equivalent (repeat per attribute, substitute `KEY` and `SIZE`):

```bash
curl -X POST "https://syd.cloud.appwrite.io/v1/databases/cultureflow/collections/institution_inquiries/attributes/string" \
  -H "X-Appwrite-Project: 6acfd0f50000c85e0e60" \
  -H "X-Appwrite-Key: <API key>" \
  -H "Content-Type: application/json" \
  -d '{ "key": "KEY", "size": SIZE, "required": false }'
```

Note: attribute creation is **asynchronous** — each returns `202 Accepted` with `status: "processing"`. Wait for all to report `status: "available"` (poll `GET /databases/cultureflow/collections/institution_inquiries` and read `attributes[].status`) before the verification write.

## 4. Verify

1. **Test write** (mirrors what the live form does — anonymous create, no permissions array on the doc):

```bash
curl -X POST "https://syd.cloud.appwrite.io/v1/databases/cultureflow/collections/institution_inquiries/documents" \
  -H "X-Appwrite-Project: 6acfd0f50000c85e0e60" \
  -H "X-Appwrite-Key: <API key>" \
  -H "Content-Type: application/json" \
  -d '{
    "documentId": "unique()",
    "data": {
      "institutionType": "University",
      "institutionName": "TEST — delete me",
      "city": "New Delhi",
      "state": "Delhi",
      "country": "India",
      "contactName": "Test Contact",
      "designation": "QA",
      "email": "test@example.com",
      "mobile": "+91 00000 00000",
      "lookingFor": "Study abroad pathway",
      "message": "verification document — safe to delete"
    },
    "permissions": []
  }'
```

Expected: `201 Created`. Copy the returned `$id`.

2. **Test delete**:

```bash
curl -X DELETE "https://syd.cloud.appwrite.io/v1/databases/cultureflow/collections/institution_inquiries/documents/<DOCUMENT_ID>" \
  -H "X-Appwrite-Project: 6acfd0f50000c85e0e60" \
  -H "X-Appwrite-Key: <API key>"
```

Expected: `204 No Content`.

3. **End-to-end (optional)**: submit the form at `/institutions` on the dev site (localhost:3000) and confirm a document appears in the console.

## 5. App-side contract (already implemented, do not change)

- `src/lib/appwrite.ts` defines `INSTITUTION_COLLECTION_ID = "institution_inquiries"` and `saveInstitutionInquiry()` which performs an **anonymous** `createDocument` with a subset of the 11 fields (all optional), so the collection above is strictly a superset.
- The `/institutions` page (`src/app/institutions/page.tsx`) validates client-side and calls `saveInstitutionInquiry()`. On 401 it shows a submit error — that failure mode disappears once this collection exists.

## 6. Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `401 general_unauthorized_scope` mentioning `collections.write` | API key created without Databases write scopes | Create a new key ticking scopes from §1 |
| `409 collection_already_exists` | Prior partial run created it | Inspect existing collection; add missing attributes instead of recreating |
| Document create returns 400 listing unknown attributes | Attributes still `processing` | Wait until all report `available` (§3 note) |
| Document create returns 401 from the **website** (not the key) | Collection missing `create("any")` permission | Re-check §2 permissions |
