# PocketBase Schema Reference - Studie.monster

This document provides a detailed reference of all PocketBase collections, fields, and relationships used in the studie.monster project.

## Overview

The studie.monster application uses three primary collections to manage study material conversion and generation:

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│ study_sessions  │────<│  study_files    │     │  study_pages    │
│                 │     │                 │     │                 │
│ - unique_code   │     │ - session       │     │ - session       │
│ - status        │     │ - original_name │     │ - unique_code   │
│ - file_count    │     │ - file          │     │ - script_js     │
│                 │     │ - converted_md  │     │ - content_json  │
│                 │     │ - file_type     │     │ - chapter_count │
│                 │     │ - file_size     │     │ - flashcard_cnt │
│                 │     │ - status        │     │ - status        │
│                 │     │                 │     │ - expires_at    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

---

## Collections

### study_sessions

**Type:** Base Collection  
**Purpose:** Tracks individual study material conversion sessions

| Field | Type | Required | Options | Description |
|-------|------|----------|---------|-------------|
| `id` | autoid | Auto | - | Unique record identifier |
| `unique_code` | text | Yes | min: 8, max: 8, pattern: `^[a-z0-9]{8}$` | 8-character alphanumeric session code |
| `status` | select | Yes | values: `pending`, `converting`, `generating`, `complete`, `failed` | Current processing status |
| `file_count` | number | Yes | min: 0 | Number of files in session |
| `created` | date | Auto | - | Record creation timestamp |
| `updated` | date | Auto | - | Record update timestamp |

**Indexes:**
```sql
CREATE UNIQUE INDEX idx_unique_code ON study_sessions (unique_code);
```

**API Rules (Recommended):**
```javascript
listRule: 'owner = @request.auth.id'
viewRule: 'owner = @request.auth.id'
createRule: '@request.auth.id != ""'
updateRule: 'owner = @request.auth.id'
deleteRule: 'owner = @request.auth.id'
```

**Example Record:**
```json
{
  "id": "abc123xyz",
  "unique_code": "sess1234",
  "status": "converting",
  "file_count": 3,
  "created": "2024-01-15 10:30:00.000Z",
  "updated": "2024-01-15 10:35:00.000Z"
}
```

---

### study_files

**Type:** Base Collection  
**Purpose:** Stores uploaded files and their conversion status

| Field | Type | Required | Options | Description |
|-------|------|----------|---------|-------------|
| `id` | autoid | Auto | - | Unique record identifier |
| `session` | relation | Yes | collection: `study_sessions`, cascadeDelete: true, maxSelect: 1 | Parent session reference |
| `original_name` | text | Yes | - | Original filename |
| `file` | file | No | maxSize: 52428800 (50MB), mimeTypes: see below | Original uploaded file |
| `converted_md` | file | No | maxSize: 10485760 (10MB), mimeTypes: `text/markdown` | Converted Markdown file |
| `file_type` | select | Yes | values: `pdf`, `doc`, `docx`, `xls`, `xlsx`, `ppt`, `pptx`, `md`, `txt`, `rtf`, `html`, `htm` | File type identifier |
| `file_size` | number | Yes | min: 0 | File size in bytes |
| `status` | select | Yes | values: `pending`, `converted`, `failed` | Conversion status |
| `created` | date | Auto | - | Record creation timestamp |
| `updated` | date | Auto | - | Record update timestamp |

**Supported MIME Types:**
```javascript
[
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "text/markdown",
  "text/plain",
  "text/rtf",
  "text/html"
]
```

**Indexes:**
```sql
CREATE INDEX idx_session ON study_files (session);
```

**API Rules (Recommended):**
```javascript
listRule: '@collection.study_sessions.owner = @request.auth.id'
viewRule: '@collection.study_sessions.owner = @request.auth.id'
createRule: '@request.auth.id != ""'
updateRule: 'false'
deleteRule: 'false'
```

**Example Record:**
```json
{
  "id": "def456uvw",
  "session": "abc123xyz",
  "original_name": "lecture-notes.pdf",
  "file": "lecture-notes.pdf",
  "converted_md": "lecture-notes.md",
  "file_type": "pdf",
  "file_size": 2048576,
  "status": "converted",
  "created": "2024-01-15 10:30:00.000Z",
  "updated": "2024-01-15 10:45:00.000Z"
}
```

---

### study_pages

**Type:** Base Collection  
**Purpose:** Stores generated study content (chapters, flashcards)

| Field | Type | Required | Options | Description |
|-------|------|----------|---------|-------------|
| `id` | autoid | Auto | - | Unique record identifier |
| `session` | relation | Yes | collection: `study_sessions`, cascadeDelete: true, maxSelect: 1 | Parent session reference |
| `unique_code` | text | Yes | min: 8, max: 8, pattern: `^[a-z0-9]{8}$` | 8-character page code |
| `script_js` | file | No | maxSize: 1048576 (1MB), mimeTypes: `application/javascript`, `text/javascript` | Generated JavaScript |
| `content_json` | json | Yes | - | Structured content data |
| `chapter_count` | number | Yes | min: 0 | Number of chapters generated |
| `flashcard_count` | number | Yes | min: 0 | Number of flashcards generated |
| `status` | select | Yes | values: `pending`, `generating`, `complete`, `failed` | Generation status |
| `expires_at` | date | No | - | Content expiration timestamp |
| `created` | date | Auto | - | Record creation timestamp |
| `updated` | date | Auto | - | Record update timestamp |

**Indexes:**
```sql
CREATE UNIQUE INDEX idx_page_unique_code ON study_pages (unique_code);
CREATE INDEX idx_page_session ON study_pages (session);
```

**API Rules (Recommended):**
```javascript
listRule: 'status = "complete" || owner = @request.auth.id'
viewRule: 'status = "complete" || owner = @request.auth.id'
createRule: 'false'
updateRule: 'false'
deleteRule: 'false'
```

**Example Record:**
```json
{
  "id": "ghi789rst",
  "session": "abc123xyz",
  "unique_code": "page5678",
  "script_js": "study-script.js",
  "content_json": {
    "chapters": [
      {
        "title": "Introduction",
        "content": "...",
        "flashcards": [...]
      }
    ]
  },
  "chapter_count": 5,
  "flashcard_count": 25,
  "status": "complete",
  "expires_at": "2024-02-15 00:00:00.000Z",
  "created": "2024-01-15 10:50:00.000Z",
  "updated": "2024-01-15 11:30:00.000Z"
}
```

---

## Relationships

### One-to-Many: study_sessions → study_files

A session can have multiple files, but each file belongs to one session.

```javascript
// Query files for a session
const files = await pb.collection('study_files').getList(1, 50, {
  filter: `session = "${sessionId}"`
});

// With expand (from session side)
const session = await pb.collection('study_sessions').getOne(sessionId, {
  expand: 'study_files'
});
```

### One-to-Many: study_sessions → study_pages

A session can have multiple generated page sets, but each page set belongs to one session.

```javascript
// Query pages for a session
const pages = await pb.collection('study_pages').getList(1, 50, {
  filter: `session = "${sessionId}"`
});

// With expand (from session side)
const session = await pb.collection('study_sessions').getOne(sessionId, {
  expand: 'study_pages'
});
```

### Cascade Delete Behavior

When a `study_sessions` record is deleted:
- All related `study_files` records are automatically deleted
- All related `study_pages` records are automatically deleted
- Associated files in storage are also removed

---

## Status Flow

### Session Status Flow

```
pending → converting → generating → complete
                              ↓
                           failed
```

| Status | Description |
|--------|-------------|
| `pending` | Session created, waiting for files |
| `converting` | Files being converted to Markdown |
| `generating` | Study content being generated |
| `complete` | All processing finished successfully |
| `failed` | Processing failed (check logs) |

### File Status Flow

```
pending → converted
     ↓
   failed
```

| Status | Description |
|--------|-------------|
| `pending` | File uploaded, waiting for conversion |
| `converted` | Successfully converted to Markdown |
| `failed` | Conversion failed |

### Page Status Flow

```
pending → generating → complete
                 ↓
               failed
```

| Status | Description |
|--------|-------------|
| `pending` | Waiting for file conversion |
| `generating` | Content generation in progress |
| `complete` | Study content ready |
| `failed` | Generation failed |

---

## Query Examples

### Get Session with All Related Data

```javascript
const session = await pb.collection('study_sessions').getOne(sessionId, {
  expand: 'study_files,study_pages'
});

// Access expanded data
console.log('Files:', session.expand?.study_files);
console.log('Pages:', session.expand?.study_pages);
```

### Get All Pending Sessions

```javascript
const pending = await pb.collection('study_sessions').getList(1, 50, {
  filter: 'status = "pending"',
  sort: 'created'
});
```

### Get Files by Session with Status Filter

```javascript
const files = await pb.collection('study_files').getList(1, 100, {
  filter: pb.filter('session = {:session} && status = {:status}', {
    session: sessionId,
    status: 'converted'
  })
});
```

### Get Completed Pages with Content

```javascript
const pages = await pb.collection('study_pages').getList(1, 50, {
  filter: 'status = "complete"',
  fields: 'id,unique_code,content_json,chapter_count,flashcard_count',
  expand: 'session'
});
```

### Count Records by Status

```javascript
// Get all and count client-side
const sessions = await pb.collection('study_sessions').getFullList();
const counts = sessions.reduce((acc, s) => {
  acc[s.status] = (acc[s.status] || 0) + 1;
  return acc;
}, {});
```

---

## Migration Reference

### Create Collection Migration Template

```javascript
migrate(
  (app) => {
    const collection = new Collection({
      name: "collection_name",
      type: "base",  // or "auth" or "view"
      fields: [
        {
          name: "field_name",
          type: "text",  // or "number", "bool", "date", "select", "file", "relation", "json"
          required: true,
          // Type-specific options
          min: 0,
          max: 100,
          pattern: "^[a-z]+$",
          values: ["option1", "option2"],
          maxSelect: 1,
          maxSize: 1048576,
          mimeTypes: ["application/pdf"],
          collectionId: "other_collection_id",
          cascadeDelete: true,
        },
      ],
      indexes: [
        "CREATE INDEX idx_field ON collection_name (field_name)",
      ],
    });

    app.save(collection);
  },
  (app) => {
    // Rollback
    try {
      const collection = app.findCollectionByNameOrId("collection_name");
      app.delete(collection);
    } catch (e) {}
  },
);
```

### Field Type Options Reference

| Type | Options |
|------|---------|
| `text` | `min`, `max`, `pattern` |
| `number` | `min`, `max` |
| `bool` | - |
| `date` | - |
| `select` | `values`, `maxSelect` |
| `file` | `maxSelect`, `maxSize`, `mimeTypes`, `thumbs` |
| `relation` | `collectionId`, `maxSelect`, `cascadeDelete` |
| `json` | - |
| `email` | `exceptDomains`, `onlyDomains` |
| `url` | `exceptDomains`, `onlyDomains` |
| `autodate` | `onCreate`, `onUpdate` |

---

## Backup & Restore

### Export Schema

```bash
# Export schema to JSON
curl -H "Authorization: Bearer TOKEN" \
  http://127.0.0.1:8090/api/collections > pb_schema.json
```

### Import Schema

```javascript
// Via Admin UI or API
const schema = require('./pb_schema.json');

for (const collection of schema) {
  await adminPb.collections.create(collection);
}
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2024-01 | Initial schema with study_sessions, study_files, study_pages |

---

*Last updated: 2025*
*PocketBase v0.22+*