# PocketBase E2E Guide - Studie.monster Project

A comprehensive guide for setting up, operating, and using PocketBase end-to-end based on the studie.monster implementation.

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Installation & Setup](#installation--setup)
4. [Project Structure](#project-structure)
5. [Database Schema](#database-schema)
6. [Migrations](#migrations)
7. [Authentication](#authentication)
8. [SDK Usage](#sdk-usage)
9. [File Handling](#file-handling)
10. [Realtime Subscriptions](#realtime-subscriptions)
11. [Query Optimization](#query-optimization)
12. [API Rules & Security](#api-rules--security)
13. [Production Deployment](#production-deployment)
14. [Troubleshooting](#troubleshooting)

---

## Overview

PocketBase is a lightweight, self-contained backend solution that combines SQLite database, authentication, file storage, and realtime subscriptions in a single Go binary. The studie.monster project uses PocketBase as its backend for managing study sessions, files, and generated content.

**Key Features:**
- Single binary deployment (no complex setup)
- Built-in authentication (email/password, OAuth2, MFA)
- File storage with S3 support
- Realtime subscriptions via Server-Sent Events (SSE)
- JavaScript migrations for schema management
- Admin dashboard for data management

---

## Prerequisites

### Required Software

| Software | Version | Purpose |
|----------|---------|---------|
| Node.js | 18+ | Frontend development |
| npm/pnpm | 9+ | Package management |
| PocketBase | 0.22+ | Backend server |

### Required Information

Before setting up PocketBase, gather:
- Admin email and password for superuser account
- Desired database encryption key (32 characters)
- SMTP credentials (for email verification)
- S3 credentials (optional, for file storage)

---

## Installation & Setup

### Step 1: Download PocketBase

```bash
# Download the latest release from GitHub
# Windows: https://github.com/pocketbase/pocketbase/releases/latest/download/pocketbase_0.22.0_windows_amd64.zip
# macOS: https://github.com/pocketbase/pocketbase/releases/latest/download/pocketbase_0.22.0_darwin_amd64.zip
# Linux: https://github.com/pocketbase/pocketbase/releases/latest/download/pocketbase_0.22.0_linux_amd64.zip

# Extract and place in project directory
mkdir -p E:\studie.monster\pocketbase
# Extract pocketbase.exe to this directory
```

### Step 2: Initial Server Start

```bash
# Navigate to PocketBase directory
cd E:\studie.monster\pocketbase

# Start the server (development mode)
./pocketbase.exe serve

# Server will start at http://127.0.0.1:8090
# Open admin dashboard at http://127.0.0.1:8090/_/
```

### Step 3: Create Superuser

On first start, create a superuser account via the admin dashboard:
1. Open http://127.0.0.1:8090/_/
2. Set admin email and password
3. Save credentials securely

### Step 4: Configure Environment Variables

Create a `.env` file in your SvelteKit project:

```bash
# E:\studie.monster\studie.monster\.env
PB_URL=http://127.0.0.1:8090
PB_SUPERUSER_EMAIL=admin@studie.monster
PB_SUPERUSER_PASSWORD=your_secure_password_here
```

---

## Project Structure

```
E:\studie.monster\
├── pocketbase/
│   ├── pocketbase.exe          # PocketBase binary
│   └── pb_data/                # Database and file storage (auto-created)
│       ├── data.db             # SQLite database
│       ├── storage/            # Uploaded files
│       └── migrations/         # Applied migrations
├── studie.monster/
│   ├── pb_migrations/          # JavaScript migration files
│   │   └── 1703123456780_create_study_collections.js
│   ├── src/
│   │   ├── lib/
│   │   │   └── pocketbase/     # PocketBase client setup
│   │   └── routes/             # SvelteKit routes
│   └── .env                    # Environment variables
└── docs/
    ├── POCKETBASE_MIGRATIONS.md
    ├── pb_schema.json
    └── pocketbase-e2e/         # This documentation
```

---

## Database Schema

The studie.monster project uses three main collections:

### study_sessions

Tracks individual study material conversion sessions.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `unique_code` | text | Yes | 8-character alphanumeric code (pattern: `^[a-z0-9]{8}$`) |
| `status` | select | Yes | `pending`, `converting`, `generating`, `complete`, `failed` |
| `file_count` | number | Yes | Number of files in session (min: 0) |

**Indexes:**
- `CREATE UNIQUE INDEX idx_unique_code ON study_sessions (unique_code)`

### study_files

Stores uploaded files and their conversion status.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `session` | relation | Yes | Links to study_sessions (cascade delete) |
| `original_name` | text | Yes | Original filename |
| `file` | file | No | Original uploaded file (max: 50MB) |
| `converted_md` | file | No | Converted Markdown file (max: 10MB) |
| `file_type` | select | Yes | `pdf`, `doc`, `docx`, `xls`, `xlsx`, `ppt`, `pptx`, `md`, `txt`, `rtf`, `html`, `htm` |
| `file_size` | number | Yes | File size in bytes (min: 0) |
| `status` | select | Yes | `pending`, `converted`, `failed` |

**Indexes:**
- `CREATE INDEX idx_session ON study_files (session)`

### study_pages

Stores generated study content (chapters, flashcards).

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `session` | relation | Yes | Links to study_sessions (cascade delete) |
| `unique_code` | text | Yes | 8-character alphanumeric code |
| `script_js` | file | No | Generated JavaScript (max: 1MB) |
| `content_json` | json | Yes | Structured content data |
| `chapter_count` | number | Yes | Number of chapters (min: 0) |
| `flashcard_count` | number | Yes | Number of flashcards (min: 0) |
| `status` | select | Yes | `pending`, `generating`, `complete`, `failed` |
| `expires_at` | date | No | Expiration timestamp |

**Indexes:**
- `CREATE UNIQUE INDEX idx_page_unique_code ON study_pages (unique_code)`
- `CREATE INDEX idx_page_session ON study_pages (session)`

---

## Migrations

### Migration File Location

Migrations are stored in `E:\studie.monster\studie.monster\pb_migrations\`

### Creating a Migration

Migration files follow this naming convention: `{timestamp}_{description}.js`

Example migration structure:

```javascript
// E:\studie.monster\studie.monster\pb_migrations\1703123456780_create_study_collections.js

migrate(
  (app) => {
    // Create study_sessions collection
    const studySessions = new Collection({
      name: "study_sessions",
      type: "base",
      fields: [
        {
          name: "unique_code",
          type: "text",
          required: true,
          min: 8,
          max: 8,
          pattern: "^[a-z0-9]{8}$",
        },
        {
          name: "status",
          type: "select",
          required: true,
          maxSelect: 1,
          values: ["pending", "converting", "generating", "complete", "failed"],
        },
        {
          name: "file_count",
          type: "number",
          required: true,
          min: 0,
        },
      ],
      indexes: [
        "CREATE UNIQUE INDEX idx_unique_code ON study_sessions (unique_code)",
      ],
    });

    app.save(studySessions);

    // Create study_files collection (similar structure)
    // Create study_pages collection (similar structure)
  },
  (app) => {
    // Rollback - delete collections in reverse order
    try {
      const studyPages = app.findCollectionByNameOrId("study_pages");
      app.delete(studyPages);
    } catch (e) {}

    try {
      const studyFiles = app.findCollectionByNameOrId("study_files");
      app.delete(studyFiles);
    } catch (e) {}

    try {
      const studySessions = app.findCollectionByNameOrId("study_sessions");
      app.delete(studySessions);
    } catch (e) {}
  },
);
```

### Running Migrations

```bash
# Apply all pending migrations
./pocketbase.exe migrate up

# Rollback last migration
./pocketbase.exe migrate down

# Check migration status
./pocketbase.exe migrate list
```

### Migration Methods

| Method | Best For | Description |
|--------|----------|-------------|
| **JS Migrations** | Self-hosted deployments | Run migrations directly via CLI |
| **REST API** | Cloud/Hosted deployments | Use Admin API to create collections programmatically |

---

## Authentication

### Password Authentication

```javascript
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

// Login
async function login(email, password) {
  try {
    const authData = await pb.collection('users').authWithPassword(email, password);
    console.log('Logged in as:', authData.record.email);
    console.log('Token valid:', pb.authStore.isValid);
    return authData;
  } catch (error) {
    // Generic error - don't reveal if email exists
    if (error.status === 400) {
      throw new Error('Invalid email or password');
    }
    throw error;
  }
}

// Check authentication status
function isAuthenticated() {
  return pb.authStore.isValid;
}

// Get current user
function getCurrentUser() {
  return pb.authStore.record;
}

// Logout
function logout() {
  pb.authStore.clear();
}

// Listen for auth changes
pb.authStore.onChange((token, record) => {
  console.log('Auth state changed:', record?.email || 'logged out');
}, true);
```

### Admin Authentication (for migrations)

```javascript
import PocketBase from 'pocketbase';

const adminPb = new PocketBase(process.env.PB_URL);

async function authenticateAdmin() {
  await adminPb.collection('_superusers').authWithPassword(
    process.env.PB_SUPERUSER_EMAIL,
    process.env.PB_SUPERUSER_PASSWORD
  );
  return adminPb;
}
```

### OAuth2 Configuration

Configure OAuth2 providers in Admin UI or via API:

```javascript
await adminPb.settings.update({
  oauth2: {
    google: {
      enabled: true,
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
    github: {
      enabled: true,
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }
  }
});
```

---

## SDK Usage

### Client Initialization

```javascript
import PocketBase from 'pocketbase';

// Basic initialization
const pb = new PocketBase('http://127.0.0.1:8090');

// With custom auth store (for SSR)
const pb = new PocketBase('http://127.0.0.1:8090', {
  authStore: new CookieAuthStore()
});

// TypeScript with typed collections
interface TypedPocketBase {
  collections: {
    study_sessions: StudySession;
    study_files: StudyFile;
    study_pages: StudyPage;
  };
}

const pb = new PocketBase('http://127.0.0.1:8090') as TypedPocketBase;
```

### CRUD Operations

```javascript
// CREATE
const session = await pb.collection('study_sessions').create({
  unique_code: 'abc12345',
  status: 'pending',
  file_count: 3
});

// READ - Get single record
const session = await pb.collection('study_sessions').getOne('RECORD_ID');

// READ - List with pagination
const result = await pb.collection('study_sessions').getList(1, 20, {
  filter: 'status = "pending"',
  sort: '-created'
});

// UPDATE
await pb.collection('study_sessions').update('RECORD_ID', {
  status: 'converting'
});

// DELETE
await pb.collection('study_sessions').delete('RECORD_ID');
```

### Query with Filters

```javascript
// Parameter binding (recommended for security)
const sessions = await pb.collection('study_sessions').getList(1, 20, {
  filter: pb.filter('status = {:status} && file_count > {:minCount}', {
    status: 'pending',
    minCount: 0
  })
});

// Complex filters
const files = await pb.collection('study_files').getList(1, 50, {
  filter: 'session = "SESSION_ID" && status = "converted"',
  sort: '-created',
  expand: 'session'
});
```

### Expand Relations

```javascript
// Fetch related records in single request
const sessions = await pb.collection('study_sessions').getList(1, 20, {
  expand: 'study_files,study_pages'
});

// Access expanded data
sessions.items.forEach(session => {
  console.log('Files:', session.expand?.study_files);
  console.log('Pages:', session.expand?.study_pages);
});

// Nested expansion (up to 6 levels)
const pages = await pb.collection('study_pages').getList(1, 20, {
  expand: 'session,session.study_files'
});
```

---

## File Handling

### File Upload

```javascript
// Basic file upload
async function uploadFile(file, metadata) {
  try {
    const record = await pb.collection('study_files').create({
      session: metadata.sessionId,
      original_name: file.name,
      file: file,  // File object from input
      file_type: getFileType(file.name),
      file_size: file.size,
      status: 'pending'
    });
    return record;
  } catch (error) {
    if (error.response?.data?.file) {
      throw new Error(`File error: ${error.response.data.file.message}`);
    }
    throw error;
  }
}

// Upload multiple files
async function uploadGallery(files, sessionId) {
  const records = await Promise.all(
    files.map(file => uploadFile(file, { sessionId }))
  );
  return records;
}

// Client-side validation
function validateFile(file, options = {}) {
  const {
    maxSize = 50 * 1024 * 1024,  // 50MB default
    allowedTypes = ['application/pdf', 'text/plain'],
    maxNameLength = 100
  } = options;

  const errors = [];

  if (file.size > maxSize) {
    errors.push(`File too large. Max: ${maxSize / 1024 / 1024}MB`);
  }

  if (!allowedTypes.includes(file.type)) {
    errors.push(`Invalid file type: ${file.type}`);
  }

  if (file.name.length > maxNameLength) {
    errors.push(`Filename too long`);
  }

  return { valid: errors.length === 0, errors };
}
```

### File Download

```javascript
// Get file URL
const fileUrl = pb.files.getUrl(record, record.file);

// Download file
async function downloadFile(record, filename) {
  const url = pb.files.getUrl(record, record.file);
  const response = await fetch(url);
  const blob = await response.blob();
  
  // Trigger download
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}
```

### File Deletion

```javascript
// Remove specific file
await pb.collection('study_files').update('RECORD_ID', {
  'file-': ['filename.pdf']  // Remove this file
});

// Clear all files
await pb.collection('study_files').update('RECORD_ID', {
  file: null
});
```

---

## Realtime Subscriptions

PocketBase uses Server-Sent Events (SSE) for realtime updates.

### Subscribe to Collection Changes

```javascript
// Subscribe to all changes in a collection
const unsubscribe = pb.collection('study_sessions').subscribe('*', (e) => {
  if (e.action === 'create') {
    console.log('New session created:', e.record);
    addSession(e.record);
  } else if (e.action === 'update') {
    console.log('Session updated:', e.record);
    updateSession(e.record);
  } else if (e.action === 'delete') {
    console.log('Session deleted:', e.record.id);
    removeSession(e.record.id);
  }
});

// Unsubscribe when done
unsubscribe();
```

### Subscribe to Specific Record

```javascript
// Watch a specific session
const unsubscribe = pb.collection('study_sessions').subscribe('RECORD_ID', (e) => {
  console.log('Session changed:', e.action, e.record);
});
```

### React/Svelte Integration

```javascript
// Svelte example with cleanup
import { onMount } from 'svelte';
import { pb } from '$lib/pocketbase';

let sessions = [];

onMount(async () => {
  // Initial load
  const result = await pb.collection('study_sessions').getList(1, 50);
  sessions = result.items;

  // Subscribe to changes
  const unsubscribe = pb.collection('study_sessions').subscribe('*', (e) => {
    if (e.action === 'create') {
      sessions = [e.record, ...sessions];
    } else if (e.action === 'update') {
      sessions = sessions.map(s => 
        s.id === e.record.id ? e.record : s
      );
    } else if (e.action === 'delete') {
      sessions = sessions.filter(s => s.id !== e.record.id);
    }
  });

  // Cleanup on destroy
  return () => {
    unsubscribe();
  };
});
```

### Connection Events

```javascript
// Handle reconnection
pb.realtime.subscribe('PB_CONNECT', (e) => {
  console.log('Realtime connected, client ID:', e.clientId);
  // Re-sync data after reconnection
  refreshData();
});
```

---

## Query Optimization

### Use Indexes

Create indexes for frequently filtered fields:

```sql
-- Single field index
CREATE INDEX idx_sessions_status ON study_sessions (status);

-- Composite index
CREATE INDEX idx_files_session_status ON study_files (session, status);

-- Unique index
CREATE UNIQUE INDEX idx_unique_code ON study_sessions (unique_code);
```

### Avoid N+1 Queries

```javascript
// ❌ Bad: N+1 queries
const sessions = await pb.collection('study_sessions').getList(1, 20);
for (const session of sessions.items) {
  session.files = await pb.collection('study_files').getList(1, 100, {
    filter: `session = "${session.id}"`
  });
}
// 21 API calls!

// ✅ Good: Single query with expand
const sessions = await pb.collection('study_sessions').getList(1, 20, {
  expand: 'study_files'
});
// 1 API call!
```

### Field Selection

```javascript
// Request only needed fields
const sessions = await pb.collection('study_sessions').getList(1, 20, {
  fields: 'id,unique_code,status'
});
```

### Batch Operations

```javascript
// Bulk create
const sessions = [
  { unique_code: 'abc12345', status: 'pending', file_count: 1 },
  { unique_code: 'def67890', status: 'pending', file_count: 2 }
];

const results = await Promise.all(
  sessions.map(s => pb.collection('study_sessions').create(s))
);
```

---

## API Rules & Security

### Rule Types

| Rule Value | Meaning | Use Case |
|------------|---------|----------|
| `null` | Locked (superusers only) | Admin-only data |
| `''` (empty string) | Open to everyone | Public content |
| `'expression'` | Conditional access | Most common |

### Recommended Rules for Studie.monster

```javascript
// study_sessions - Owner only access
listRule: 'owner = @request.auth.id'
viewRule: 'owner = @request.auth.id'
createRule: '@request.auth.id != ""'
updateRule: 'owner = @request.auth.id'
deleteRule: 'owner = @request.auth.id'

// study_files - Inherit from session
listRule: '@collection.study_sessions.owner = @request.auth.id'
viewRule: '@collection.study_sessions.owner = @request.auth.id'
createRule: '@request.auth.id != ""'
updateRule: 'false'  // Prevent manual updates
deleteRule: 'false'  // Only cascade delete from session

// study_pages - Public read after generation
listRule: 'status = "complete" || owner = @request.auth.id'
viewRule: 'status = "complete" || owner = @request.auth.id'
createRule: 'false'  // Only created by backend
updateRule: 'false'
deleteRule: 'false'
```

### Common Patterns

```javascript
// Public read, authenticated write
listRule: ''
viewRule: ''
createRule: '@request.auth.id != ""'
updateRule: 'author = @request.auth.id'
deleteRule: 'author = @request.auth.id'

// Private to owner
listRule: 'owner = @request.auth.id'
viewRule: 'owner = @request.auth.id'
createRule: '@request.auth.id != ""'
updateRule: 'owner = @request.auth.id'
deleteRule: 'owner = @request.auth.id'

// Admin only
listRule: null
viewRule: null
createRule: null
updateRule: null
deleteRule: null
```

---

## Production Deployment

### Environment Configuration

```bash
# Production startup command
./pocketbase serve \
  --http="0.0.0.0:8090" \
  --origins="https://studie.monster,https://www.studie.monster" \
  --encryptionEnv="PB_ENCRYPTION_KEY"

# Environment variables
export PB_ENCRYPTION_KEY="your-32-char-encryption-key-here"
export SMTP_HOST="smtp.sendgrid.net"
export SMTP_PORT="587"
export SMTP_USER="apikey"
export SMTP_PASS="your-sendgrid-api-key"
```

### Systemd Service (Linux)

```ini
# /etc/systemd/system/pocketbase.service
[Unit]
Description=PocketBase
After=network.target

[Service]
Type=simple
User=pocketbase
Group=pocketbase
LimitNOFILE=4096
Restart=always
RestartSec=5s
WorkingDirectory=/opt/pocketbase
ExecStart=/opt/pocketbase/pocketbase serve --http="127.0.0.1:8090"
EnvironmentFile=/opt/pocketbase/.env

# Security hardening
NoNewPrivileges=yes
PrivateTmp=yes
ProtectSystem=strict
ProtectHome=yes
ReadWritePaths=/opt/pocketbase/pb_data

[Install]
WantedBy=multi-user.target
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
    networks:
      - app-network

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
    networks:
      - app-network

networks:
  app-network:
    driver: bridge

volumes:
  caddy_data:
  caddy_config:
```

### Backup Strategy

```javascript
// Create backup via Admin API
const adminPb = new PocketBase(process.env.PB_URL);
await adminPb.collection('_superusers').authWithPassword(
  process.env.PB_SUPERUSER_EMAIL,
  process.env.PB_SUPERUSER_PASSWORD
);

// Download backup
const backup = await adminPb.files.downloadBackup('data.db');

// Schedule regular backups (cron example)
// 0 2 * * * curl -X POST http://localhost:8090/api/backups/create -H "Authorization: Bearer TOKEN"
```

### Production Checklist

- [ ] HTTPS enabled (via reverse proxy)
- [ ] Strong encryption key set (32+ characters)
- [ ] CORS origins configured
- [ ] SMTP configured and tested
- [ ] Superuser password changed from default
- [ ] S3 configured for file storage (optional)
- [ ] Backup schedule configured
- [ ] Rate limiting enabled (via reverse proxy)
- [ ] Logging configured
- [ ] Monitoring set up

---

## Troubleshooting

### Common Issues

#### 1. "Collection already exists" Error

**Cause:** Trying to create a collection that already exists.

**Solution:**
```bash
# Check existing collections
./pocketbase.exe migrate list

# Delete existing collection first (if needed)
# Or use update instead of create in migration
```

#### 2. "Invalid field options" Error

**Cause:** Field type mismatch or invalid options.

**Solution:**
```javascript
// Ensure field type matches options
{
  name: "unique_code",
  type: "text",  // Must match options
  required: true,
  min: 8,
  max: 8,
  pattern: "^[a-z0-9]{8}$",
}
```

#### 3. Relation Field Errors

**Cause:** Referenced collection doesn't exist or wrong collectionId.

**Solution:**
```javascript
// Create collections in correct order
// 1. Create parent collection first
const studySessions = new Collection({...});
app.save(studySessions);

// 2. Then create child with relation
const studyFiles = new Collection({
  fields: [{
    name: "session",
    type: "relation",
    collectionId: studySessions.id,  // Use saved collection ID
    cascadeDelete: true,
    maxSelect: 1,
  }]
});
app.save(studyFiles);
```

#### 4. Authentication Failures

**Cause:** Invalid credentials or expired token.

**Solution:**
```javascript
// Check token validity
if (!pb.authStore.isValid) {
  // Re-authenticate
  await login(email, password);
}

// Handle token expiration
pb.authStore.onChange((token, record) => {
  if (!token) {
    // Token expired, redirect to login
    window.location.href = '/login';
  }
});
```

#### 5. File Upload Size Limits

**Cause:** File exceeds configured limit.

**Solution:**
```javascript
// Increase limit in PocketBase Admin UI
// Settings > Files > Max file size

// Or configure in code
{
  name: "file",
  type: "file",
  maxSelect: 1,
  maxSize: 104857600,  // 100MB
  mimeTypes: ["application/pdf"]
}
```

### Useful Commands

```bash
# Check server status
curl http://127.0.0.1:8090/api/health

# List collections (requires auth)
curl -H "Authorization: Bearer TOKEN" \
  http://127.0.0.1:8090/api/collections

# Test API endpoint
curl http://127.0.0.1:8090/api/collections/study_sessions/records

# View logs
tail -f pb_data/logs.log
```

---

## Additional Resources

- [PocketBase Official Docs](https://pocketbase.io/docs/)
- [PocketBase GitHub](https://github.com/pocketbase/pocketbase)
- [JavaScript SDK](https://github.com/pocketbase/js-sdk)
- [API Rules & Filters](https://pocketbase.io/docs/api-rules-and-filters/)
- [File Handling](https://pocketbase.io/docs/files-handling/)
- [Realtime API](https://pocketbase.io/docs/api-realtime/)
- [Going to Production](https://pocketbase.io/docs/going-to-production/)

---

## Quick Reference

### Environment Variables

```bash
# Required
PB_URL=http://127.0.0.1:8090
PB_SUPERUSER_EMAIL=admin@studie.monster
PB_SUPERUSER_PASSWORD=your_password

# Optional (Production)
PB_ENCRYPTION_KEY=your-32-char-key
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your_smtp_password
AWS_ACCESS_KEY=your_aws_key
AWS_SECRET_KEY=your_aws_secret
```

### Common SDK Methods

```javascript
// Collections
pb.collection('name').create(data)
pb.collection('name').getOne(id)
pb.collection('name').getList(page, perPage, options)
pb.collection('name').update(id, data)
pb.collection('name').delete(id)

// Auth
pb.collection('users').authWithPassword(email, password)
pb.collection('users').authWithOAuth2({ provider })
pb.authStore.clear()

// Files
pb.files.getUrl(record, filename)
pb.files.download(record, filename)

// Realtime
pb.collection('name').subscribe('*', callback)
pb.collection('name').unsubscribe()
```

### Filter Syntax

```javascript
// Operators
=, !=, >, >=, <, <=
~, !~ (contains, not contains)
@, !@ (starts with, ends with)
?, !? (matches regex)
in, !in (in list, not in list)
between, !between (range)

// Functions
geoDistance(field, point)
isEmpty(field)
isExists(field)

// Logical
&&, ||, !

// Examples
filter: 'status = "pending" && file_count > 0'
filter: 'email ~ "@gmail.com"'
filter: 'created >= "2024-01-01"'
filter: 'geoDistance(location, {:point}) <= 5'
```

---

*Last updated: 2025*
*Based on PocketBase v0.22+ and studie.monster implementation*