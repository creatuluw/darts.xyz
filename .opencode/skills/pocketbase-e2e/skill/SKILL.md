---
name: pocketbase-e2e
description: End-to-end PocketBase backend setup, operation, and usage for studie.monster project. Use when: (1) Setting up PocketBase server locally or in production, (2) Creating or modifying database collections and migrations, (3) Implementing authentication (password, OAuth2, MFA), (4) Managing file uploads and storage, (5) Setting up realtime subscriptions, (6) Configuring API rules and security, (7) Querying data with filters and relations, (8) Deploying to production with backups and monitoring, (9) Troubleshooting PocketBase issues. Includes comprehensive guides, schema references, and quick start instructions.
---

# PocketBase E2E Skill

Comprehensive skill for operating PocketBase backend in the studie.monster project. This skill provides end-to-end guidance for setup, schema design, authentication, file handling, realtime features, query optimization, security, and production deployment.

## When to Use This Skill

Use this skill when working with PocketBase in the studie.monster project for:

- **Initial Setup**: Installing PocketBase, creating superuser, configuring environment
- **Schema Management**: Designing collections, creating migrations, managing relations
- **Authentication**: Implementing password auth, OAuth2, MFA, token management
- **File Operations**: Uploading, downloading, validating files with progress tracking
- **Realtime Features**: Setting up SSE subscriptions for live data updates
- **Query Optimization**: Using indexes, expand relations, avoiding N+1 queries
- **Security**: Configuring API rules, access control, rate limiting
- **Production**: Deployment, backups, monitoring, Docker configuration
- **Troubleshooting**: Debugging common issues, migration errors, auth problems

## Core Workflows

### 1. Setup PocketBase Server

```bash
# Download and extract
cd E:\studie.monster\pocketbase
./pocketbase.exe serve

# Create superuser at http://127.0.0.1:8090/_/
# Configure .env in SvelteKit project
```

### 2. Create Collections via Migrations

```javascript
// E:\studie.monster\studie.monster\pb_migrations\{timestamp}_{name}.js
migrate(
  (app) => {
    const collection = new Collection({
      name: "collection_name",
      type: "base",
      fields: [...],
      indexes: [...]
    });
    app.save(collection);
  },
  (app) => {
    // Rollback
  }
);
```

### 3. SDK Operations

```javascript
import PocketBase from 'pocketbase';
const pb = new PocketBase('http://127.0.0.1:8090');

// CRUD
await pb.collection('name').create(data);
await pb.collection('name').getOne(id);
await pb.collection('name').getList(page, perPage, options);
await pb.collection('name').update(id, data);
await pb.collection('name').delete(id);

// Auth
await pb.collection('users').authWithPassword(email, password);
pb.authStore.clear();

// Files
pb.files.getUrl(record, filename);

// Realtime
const unsub = pb.collection('name').subscribe('*', callback);
```

### 4. Query with Expand

```javascript
// Single request with relations
const sessions = await pb.collection('study_sessions').getList(1, 20, {
  expand: 'study_files,study_pages'
});
```

### 5. File Upload

```javascript
const record = await pb.collection('study_files').create({
  session: sessionId,
  original_name: file.name,
  file: file,
  file_type: getFileType(file.name),
  file_size: file.size,
  status: 'pending'
});
```

### 6. Realtime Subscriptions

```javascript
const unsubscribe = pb.collection('study_sessions').subscribe('*', (e) => {
  if (e.action === 'create') addSession(e.record);
  else if (e.action === 'update') updateSession(e.record);
  else if (e.action === 'delete') removeSession(e.record.id);
});
```

## Project Collections

The studie.monster project uses three main collections:

### study_sessions
- Tracks study material conversion sessions
- Fields: `unique_code`, `status`, `file_count`
- Status flow: `pending` → `converting` → `generating` → `complete` | `failed`

### study_files
- Stores uploaded files and conversion status
- Fields: `session`, `original_name`, `file`, `converted_md`, `file_type`, `file_size`, `status`
- Supports: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, MD, TXT, RTF, HTML
- Cascade delete from session

### study_pages
- Stores generated study content
- Fields: `session`, `unique_code`, `script_js`, `content_json`, `chapter_count`, `flashcard_count`, `status`, `expires_at`
- Cascade delete from session

## Security Best Practices

### API Rules

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

// Admin only (locked)
listRule: null
viewRule: null
```

### Authentication

- Use generic error messages (don't reveal if email exists)
- Store tokens securely (httpOnly cookies for web)
- Implement rate limiting via reverse proxy
- Consider MFA for sensitive applications

## Production Deployment

### Environment Configuration

```bash
./pocketbase serve \
  --http="0.0.0.0:8090" \
  --origins="https://studie.monster" \
  --encryptionEnv="PB_ENCRYPTION_KEY"

export PB_ENCRYPTION_KEY="your-32-char-key"
export SMTP_HOST="smtp.sendgrid.net"
export SMTP_PORT="587"
export SMTP_USER="apikey"
export SMTP_PASS="your-smtp-password"
```

### Production Checklist

- [ ] HTTPS enabled (reverse proxy)
- [ ] Strong encryption key (32+ chars)
- [ ] CORS origins configured
- [ ] SMTP configured and tested
- [ ] Superuser password changed
- [ ] S3 configured (optional)
- [ ] Backup schedule configured
- [ ] Rate limiting enabled
- [ ] Monitoring set up

## Bundled Resources

This skill includes comprehensive reference documentation:

- **README.md** - Complete E2E guide with all topics covered in depth
- **QUICKSTART.md** - Hands-on guide for common operations
- **SCHEMA.md** - Detailed schema reference with field specifications

Access these files in `E:\studie.monster\docs\pocketbase-e2e\` for detailed information on specific topics.

## Troubleshooting Quick Reference

| Issue | Solution |
|-------|----------|
| Collection exists error | Check migrations, use update not create |
| Invalid field options | Ensure field type matches options |
| Relation errors | Create parent collection first |
| Auth failures | Check token validity, re-authenticate |
| File size limits | Increase in Admin UI or migration |

## Key Commands

```bash
# Server
./pocketbase.exe serve
./pocketbase.exe migrate up
./pocketbase.exe migrate list

# Health check
curl http://127.0.0.1:8090/api/health

# View logs
tail -f pb_data/logs.log
```

## Additional Resources

- Official Docs: https://pocketbase.io/docs/
- GitHub: https://github.com/pocketbase/pocketbase
- JS SDK: https://github.com/pocketbase/js-sdk
- API Rules: https://pocketbase.io/docs/api-rules-and-filters/
- File Handling: https://pocketbase.io/docs/files-handling/
- Realtime: https://pocketbase.io/docs/api-realtime/
- Production: https://pocketbase.io/docs/going-to-production/