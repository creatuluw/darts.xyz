# PocketBase Reference Guide - Studie.monster

Consolidated reference for PocketBase operations, schema, and best practices.

---

## Quick Reference

### Connection String
```
http://127.0.0.1:8090
Admin UI: http://127.0.0.1:8090/_/
```

### Environment Variables
```bash
PB_URL=http://127.0.0.1:8090
PB_SUPERUSER_EMAIL=admin@studie.monster
PB_SUPERUSER_PASSWORD=your_password
PB_ENCRYPTION_KEY=your-32-char-key
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-smtp-password
```

---

## Collections Overview

### study_sessions
**Purpose:** Track study material conversion sessions

| Field | Type | Required | Options |
|-------|------|----------|---------|
| unique_code | text | Yes | 8 chars, `^[a-z0-9]{8}$` |
| status | select | Yes | pending, converting, generating, complete, failed |
| file_count | number | Yes | min: 0 |

**Indexes:**
```sql
CREATE UNIQUE INDEX idx_unique_code ON study_sessions (unique_code);
```

### study_files
**Purpose:** Store uploaded files and conversion status

| Field | Type | Required | Options |
|-------|------|----------|---------|
| session | relation | Yes | study_sessions, cascadeDelete |
| original_name | text | Yes | - |
| file | file | No | max: 50MB |
| converted_md | file | No | max: 10MB, text/markdown |
| file_type | select | Yes | pdf, doc, docx, xls, xlsx, ppt, pptx, md, txt, rtf, html, htm |
| file_size | number | Yes | min: 0 |
| status | select | Yes | pending, converted, failed |

**Indexes:**
```sql
CREATE INDEX idx_session ON study_files (session);
```

### study_pages
**Purpose:** Store generated study content

| Field | Type | Required | Options |
|-------|------|----------|---------|
| session | relation | Yes | study_sessions, cascadeDelete |
| unique_code | text | Yes | 8 chars, `^[a-z0-9]{8}$` |
| script_js | file | No | max: 1MB, application/javascript |
| content_json | json | Yes | - |
| chapter_count | number | Yes | min: 0 |
| flashcard_count | number | Yes | min: 0 |
| status | select | Yes | pending, generating, complete, failed |
| expires_at | date | No | - |

**Indexes:**
```sql
CREATE UNIQUE INDEX idx_page_unique_code ON study_pages (unique_code);
CREATE INDEX idx_page_session ON study_pages (session);
```

---

## SDK Quick Reference

### Initialization
```javascript
import PocketBase from 'pocketbase';
const pb = new PocketBase('http://127.0.0.1:8090');
```

### CRUD Operations
```javascript
// Create
const record = await pb.collection('name').create(data);

// Read
const record = await pb.collection('name').getOne('id');
const result = await pb.collection('name').getList(page, perPage, options);
const all = await pb.collection('name').getFullList(options);

// Update
const record = await pb.collection('name').update('id', data);

// Delete
await pb.collection('name').delete('id');
```

### Authentication
```javascript
// Login
const auth = await pb.collection('users').authWithPassword(email, password);

// Logout
pb.authStore.clear();

// Check auth
if (pb.authStore.isValid) {
  console.log('User:', pb.authStore.record);
}

// Listen for changes
pb.authStore.onChange((token, record) => {
  console.log('Auth changed:', record?.email);
});
```

### Query Filters
```javascript
// Basic filter
filter: 'status = "pending"'

// Multiple conditions
filter: 'status = "pending" && file_count > 0'

// Parameter binding (recommended)
filter: pb.filter('status = {:status} && count > {:min}', {
  status: 'pending',
  min: 0
})

// Text search
filter: 'title ~ "keyword"'  // contains
filter: 'title @ "Start"'    // starts with
filter: 'title !@ "End"'     // ends with

// Date filtering
filter: 'created >= "2024-01-01"'

// In list
filter: pb.filter('tags in {:tags}', { tags: ['study', 'work'] })

// Geo distance
filter: pb.filter('geoDistance(location, {:point}) <= {:radius}', {
  point: { lon: -73.9857, lat: 40.7484 },
  radius: 5
})
```

### Expand Relations
```javascript
// Single relation
const sessions = await pb.collection('study_sessions').getList(1, 20, {
  expand: 'study_files'
});

// Multiple relations
const sessions = await pb.collection('study_sessions').getList(1, 20, {
  expand: 'study_files,study_pages'
});

// Nested expansion (up to 6 levels)
const pages = await pb.collection('study_pages').getList(1, 20, {
  expand: 'session,session.study_files'
});

// Access expanded data
sessions.items.forEach(session => {
  console.log('Files:', session.expand?.study_files);
  console.log('Pages:', session.expand?.study_pages);
});
```

### File Operations
```javascript
// Upload file
const record = await pb.collection('study_files').create({
  session: sessionId,
  original_name: file.name,
  file: file,  // File object
  file_type: 'pdf',
  file_size: file.size,
  status: 'pending'
});

// Get file URL
const fileUrl = pb.files.getUrl(record, record.file);

// Download file
async function downloadFile(record, filename) {
  const url = pb.files.getUrl(record, record.file);
  const response = await fetch(url);
  const blob = await response.blob();
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

// Remove file
await pb.collection('study_files').update('id', {
  'file-': ['filename.pdf']  // Remove specific file
});

await pb.collection('study_files').update('id', {
  file: null  // Clear all files
});
```

### Realtime Subscriptions
```javascript
// Subscribe to collection
const unsubscribe = pb.collection('study_sessions').subscribe('*', (e) => {
  if (e.action === 'create') addSession(e.record);
  else if (e.action === 'update') updateSession(e.record);
  else if (e.action === 'delete') removeSession(e.record.id);
});

// Subscribe to specific record
const unsubscribe = pb.collection('study_sessions').subscribe('RECORD_ID', (e) => {
  console.log('Changed:', e.action, e.record);
});

// Unsubscribe
unsubscribe();

// Connection events
pb.realtime.subscribe('PB_CONNECT', (e) => {
  console.log('Connected, client ID:', e.clientId);
  refreshData();
});
```

### Field Modifiers
```javascript
// Add to multi-select
await pb.collection('notes').update('id', {
  'tags+': ['new-tag']  // Add tag
});

// Remove from multi-select
await pb.collection('notes').update('id', {
  'tags-': ['old-tag']  // Remove tag
});

// Increment number
await pb.collection('posts').update('id', {
  'views+': 1
});

// Decrement number
await pb.collection('products').update('id', {
  'stock-': 1
});
```

---

## API Rules Reference

### Rule Types
| Value | Meaning | Use Case |
|-------|---------|----------|
| `null` | Locked (superusers only) | Admin-only data |
| `''` | Open to everyone | Public content |
| `'expression'` | Conditional access | Most common |

### Common Patterns
```javascript
// Owner-only access
listRule: 'owner = @request.auth.id'
viewRule: 'owner = @request.auth.id'
createRule: '@request.auth.id != ""'
updateRule: 'owner = @request.auth.id'
deleteRule: 'owner = @request.auth.id'

// Public read, authenticated write
listRule: ''
viewRule: ''
createRule: '@request.auth.id != ""'
updateRule: 'author = @request.auth.id'
deleteRule: 'author = @request.auth.id'

// Admin only
listRule: null
viewRule: null
createRule: null
updateRule: null
deleteRule: null

// Cross-collection lookup
listRule: '@collection.study_sessions.owner = @request.auth.id'
```

### @request Context Variables
```
@request.auth.id          - Authenticated user ID
@request.auth.email       - Authenticated user email
@request.body.field       - Field value in request body
@request.query.param      - Query parameter
@request.headers.header   - Request header
```

---

## Migration Reference

### Migration Template
```javascript
migrate(
  (app) => {
    const collection = new Collection({
      name: "collection_name",
      type: "base",
      fields: [
        {
          name: "field_name",
          type: "text",
          required: true,
          min: 0,
          max: 100,
          pattern: "^[a-z]+$"
        }
      ],
      indexes: [
        "CREATE INDEX idx_field ON collection_name (field_name)"
      ]
    });
    app.save(collection);
  },
  (app) => {
    try {
      const collection = app.findCollectionByNameOrId("collection_name");
      app.delete(collection);
    } catch (e) {}
  }
);
```

### Field Types
| Type | Options |
|------|---------|
| text | min, max, pattern |
| number | min, max |
| bool | - |
| date | - |
| select | values, maxSelect |
| file | maxSelect, maxSize, mimeTypes, thumbs |
| relation | collectionId, maxSelect, cascadeDelete |
| json | - |
| email | exceptDomains, onlyDomains |
| url | exceptDomains, onlyDomains |
| autodate | onCreate, onUpdate |
| geopoint | - |
| editor | - |

### Migration Commands
```bash
# Apply migrations
./pocketbase.exe migrate up

# Rollback
./pocketbase.exe migrate down

# List status
./pocketbase.exe migrate list
```

---

## Production Deployment

### Startup Command
```bash
./pocketbase serve \
  --http="0.0.0.0:8090" \
  --origins="https://studie.monster" \
  --encryptionEnv="PB_ENCRYPTION_KEY"
```

### Docker Compose
```yaml
version: '3'
services:
  pocketbase:
    image: ghcr.io/muchobien/pocketbase:latest
    restart: unless-stopped
    volumes:
      - ./pb_data:/pb_data
    environment:
      - PB_ENCRYPTION_KEY=${PB_ENCRYPTION_KEY}
  caddy:
    image: caddy:2-alpine
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile
      - caddy_data:/data
      - caddy_config:/config
    depends_on:
      - pocketbase
volumes:
  caddy_data:
  caddy_config:
```

### Production Checklist
- [ ] HTTPS enabled
- [ ] Encryption key set (32+ chars)
- [ ] CORS origins configured
- [ ] SMTP configured
- [ ] Superuser password changed
- [ ] S3 configured (optional)
- [ ] Backup schedule set
- [ ] Rate limiting enabled
- [ ] Monitoring configured

### Backup Commands
```bash
# Create backup via API
curl -X POST http://localhost:8090/api/backups/create \
  -H "Authorization: Bearer TOKEN"

# Download backup
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:8090/api/backups/download/data.db > backup.db
```

---

## Troubleshooting

### Common Issues

**Collection already exists**
```bash
# Check existing collections
./pocketbase.exe migrate list
# Delete or update existing collection
```

**Invalid field options**
```javascript
// Ensure field type matches options
{
  name: "code",
  type: "text",  // Must match
  min: 8,
  max: 8,
  pattern: "^[a-z0-9]{8}$"
}
```

**Relation errors**
```javascript
// Create parent first
const parent = new Collection({...});
app.save(parent);

// Then child with relation
const child = new Collection({
  fields: [{
    type: "relation",
    collectionId: parent.id
  }]
});
app.save(child);
```

**Auth failures**
```javascript
// Check token validity
if (!pb.authStore.isValid) {
  await login(email, password);
}

// Handle expiration
pb.authStore.onChange((token, record) => {
  if (!token) {
    // Redirect to login
  }
});
```

**File size limits**
```javascript
// Increase in migration
{
  name: "file",
  type: "file",
  maxSize: 104857600  // 100MB
}
```

### Useful Commands
```bash
# Health check
curl http://127.0.0.1:8090/api/health

# List collections
curl -H "Authorization: Bearer TOKEN" \
  http://127.0.0.1:8090/api/collections

# View logs
tail -f pb_data/logs.log
```

---

## Filter Syntax Reference

### Operators
```
=, !=, >, >=, <, <=     - Comparison
~, !~                   - Contains, not contains
@, !@                   - Starts with, ends with
?, !?                   - Matches regex
in, !in                 - In list, not in list
between, !between       - Range
```

### Functions
```
geoDistance(field, point)  - Distance in km
isEmpty(field)             - Check if empty
isExists(field)            - Check if exists
```

### Logical
```
&&  - AND
||  - OR
!   - NOT
```

### Examples
```javascript
'status = "pending" && file_count > 0'
'email ~ "@gmail.com"'
'created >= "2024-01-01"'
'tags in ["study", "work"]'
'geoDistance(location, {:point}) <= 5'
```

---

*Based on PocketBase v0.22+*
*Last updated: 2025*