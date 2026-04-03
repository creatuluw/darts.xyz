# PocketBase Quick Start Guide

A practical, hands-on guide for common PocketBase operations in the studie.monster project.

## Table of Contents

1. [5-Minute Setup](#5-minute-setup)
2. [Create Your First Collection](#create-your-first-collection)
3. [Basic CRUD Operations](#basic-crud-operations)
4. [File Upload Example](#file-upload-example)
5. [Realtime Updates Example](#realtime-updates-example)
6. [Common Tasks Cheat Sheet](#common-tasks-cheat-sheet)

---

## 5-Minute Setup

### Step 1: Download PocketBase

```bash
# Windows - Download and extract
curl -L https://github.com/pocketbase/pocketbase/releases/latest/download/pocketbase_0.22.0_windows_amd64.zip -o pocketbase.zip
powershell -Command "Expand-Archive pocketbase.zip -DestinationPath pocketbase"
cd pocketbase
```

### Step 2: Start the Server

```bash
# Start PocketBase
./pocketbase.exe serve

# You should see:
# Server started at http://127.0.0.1:8090
# Admin UI: http://127.0.0.1:8090/_/
```

### Step 3: Create Superuser

1. Open http://127.0.0.1:8090/_/ in your browser
2. Enter admin email and password
3. Click "Create admin"
4. **Save these credentials!** You'll need them for API access

### Step 4: Install JavaScript SDK

```bash
# In your SvelteKit project
cd E:\studie.monster\studie.monster
npm install pocketbase
```

### Step 5: Create Client Instance

```javascript
// E:\studie.monster\studie.monster\src\lib\pocketbase\client.js
import PocketBase from 'pocketbase';

export const pb = new PocketBase('http://127.0.0.1:8090');

// Optional: Enable auto-cancel for duplicate requests
pb.autoCancellation(true);
```

---

## Create Your First Collection

### Via Admin UI (Recommended for beginners)

1. Open http://127.0.0.1:8090/_/
2. Click "Collections" in sidebar
3. Click "Create collection"
4. Configure:
   - **Name:** `notes`
   - **Type:** Base
   - **Fields:**
     - `title` (Text, required)
     - `content` (Editor)
     - `tags` (Select, multiple values)
     - `completed` (Bool)
5. Click "Save"

### Via Migration (Recommended for version control)

```javascript
// E:\studie.monster\studie.monster\pb_migrations\1703123456789_create_notes.js
migrate(
  (app) => {
    const notes = new Collection({
      name: "notes",
      type: "base",
      fields: [
        {
          name: "title",
          type: "text",
          required: true,
          max: 200,
        },
        {
          name: "content",
          type: "editor",
          required: false,
        },
        {
          name: "tags",
          type: "select",
          required: false,
          maxSelect: 5,
          values: ["study", "work", "personal", "urgent"],
        },
        {
          name: "completed",
          type: "bool",
          required: false,
        },
      ],
      indexes: [
        "CREATE INDEX idx_notes_completed ON notes (completed)",
      ],
    });

    app.save(notes);
  },
  (app) => {
    try {
      const notes = app.findCollectionByNameOrId("notes");
      app.delete(notes);
    } catch (e) {}
  },
);
```

Run the migration:

```bash
cd E:\studie.monster\pocketbase
./pocketbase.exe migrate up
```

---

## Basic CRUD Operations

### Setup

```javascript
import { pb } from '$lib/pocketbase/client';
```

### Create

```javascript
// Create a single note
const note = await pb.collection('notes').create({
  title: 'My First Note',
  content: 'This is the content...',
  tags: ['study', 'urgent'],
  completed: false
});

console.log('Created:', note.id);
```

### Read

```javascript
// Get single record
const note = await pb.collection('notes').getOne('RECORD_ID');

// List with pagination
const result = await pb.collection('notes').getList(1, 20, {
  filter: 'completed = false',
  sort: '-created'
});

console.log('Notes:', result.items);
console.log('Total:', result.totalItems);
console.log('Pages:', result.totalPages);

// Get all (use with caution on large collections)
const allNotes = await pb.collection('notes').getFullList({
  filter: 'tags ~ "study"'
});
```

### Update

```javascript
// Update specific fields
const updated = await pb.collection('notes').update('RECORD_ID', {
  completed: true,
  // Only send fields you want to update
});

// Add to multi-select field
const note = await pb.collection('notes').update('RECORD_ID', {
  'tags+': ['personal']  // Add 'personal' to existing tags
});

// Remove from multi-select field
const note = await pb.collection('notes').update('RECORD_ID', {
  'tags-': ['urgent']  // Remove 'urgent' from existing tags
});
```

### Delete

```javascript
// Delete single record
await pb.collection('notes').delete('RECORD_ID');

// Delete multiple records
const ids = ['id1', 'id2', 'id3'];
await Promise.all(ids.map(id => pb.collection('notes').delete(id)));
```

### Query with Filters

```javascript
// Basic filter
const notes = await pb.collection('notes').getList(1, 20, {
  filter: 'completed = false'
});

// Multiple conditions
const notes = await pb.collection('notes').getList(1, 20, {
  filter: 'completed = false && tags ~ "study"'
});

// Parameter binding (prevents injection)
const notes = await pb.collection('notes').getList(1, 20, {
  filter: pb.filter('tags ~ {:tag} && completed = {:completed}', {
    tag: 'study',
    completed: false
  })
});

// Date filtering
const recentNotes = await pb.collection('notes').getList(1, 20, {
  filter: 'created >= "2024-01-01"'
});

// Sort options
const notes = await pb.collection('notes').getList(1, 20, {
  sort: '-created'  // Newest first
});

const notes = await pb.collection('notes').getList(1, 20, {
  sort: 'title'  // Alphabetical
});
```

---

## File Upload Example

### Basic File Upload

```javascript
// HTML: <input type="file" id="fileInput" accept=".pdf,.doc,.docx">

const fileInput = document.getElementById('fileInput');
const file = fileInput.files[0];

if (!file) {
  alert('Please select a file');
  return;
}

// Validate file size (max 50MB)
if (file.size > 50 * 1024 * 1024) {
  alert('File too large. Max 50MB.');
  return;
}

try {
  const record = await pb.collection('study_files').create({
    session: 'SESSION_ID',
    original_name: file.name,
    file: file,
    file_type: file.name.split('.').pop().toLowerCase(),
    file_size: file.size,
    status: 'pending'
  });

  console.log('Uploaded:', record.id);
} catch (error) {
  console.error('Upload failed:', error.message);
}
```

### Upload with Progress

```javascript
function uploadWithProgress(file, onProgress) {
  const formData = new FormData();
  formData.append('session', 'SESSION_ID');
  formData.append('original_name', file.name);
  formData.append('file', file);
  formData.append('file_type', file.name.split('.').pop());
  formData.append('file_size', file.size);
  formData.append('status', 'pending');

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        const percent = Math.round((e.loaded / e.total) * 100);
        onProgress(percent);
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        reject(new Error(`Upload failed: ${xhr.status}`));
      }
    });

    xhr.addEventListener('error', () => reject(new Error('Network error')));

    xhr.open('POST', `${pb.baseURL}/api/collections/study_files/records`);
    xhr.setRequestHeader('Authorization', pb.authStore.token);
    xhr.send(formData);
  });
}

// Usage
uploadWithProgress(file, (percent) => {
  console.log(`Upload: ${percent}%`);
})
.then(record => console.log('Success:', record.id))
.catch(err => console.error('Failed:', err));
```

### Download File

```javascript
// Get file URL
const fileUrl = pb.files.getUrl(record, record.file);

// Download and save
async function downloadFile(record, filename) {
  const url = pb.files.getUrl(record, record.file);
  const response = await fetch(url);
  const blob = await response.blob();
  
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  
  URL.revokeObjectURL(link.href);
}
```

---

## Realtime Updates Example

### Subscribe to Collection Changes

```javascript
// Start listening to changes
const unsubscribe = pb.collection('notes').subscribe('*', (e) => {
  console.log('Event:', e.action, e.record);
  
  switch (e.action) {
    case 'create':
      addNoteToList(e.record);
      break;
    case 'update':
      updateNoteInList(e.record);
      break;
    case 'delete':
      removeNoteFromList(e.record.id);
      break;
  }
});

// Stop listening when done
// unsubscribe();
```

### Svelte Component Example

```svelte
<!-- src/lib/components/NoteList.svelte -->
<script>
  import { onMount } from 'svelte';
  import { pb } from '$lib/pocketbase/client';

  let notes = [];
  let loading = true;

  onMount(async () => {
    // Initial load
    const result = await pb.collection('notes').getList(1, 100, {
      sort: '-created'
    });
    notes = result.items;
    loading = false;

    // Subscribe to realtime updates
    const unsubscribe = pb.collection('notes').subscribe('*', (e) => {
      if (e.action === 'create') {
        notes = [e.record, ...notes];
      } else if (e.action === 'update') {
        notes = notes.map(n => n.id === e.record.id ? e.record : n);
      } else if (e.action === 'delete') {
        notes = notes.filter(n => n.id !== e.record.id);
      }
    });

    // Cleanup on component destroy
    return () => {
      unsubscribe();
    };
  });

  function addNote(title) {
    pb.collection('notes').create({ title, completed: false });
  }
</script>

{#if loading}
  <p>Loading...</p>
{:else}
  <ul>
    {#each notes as note}
      <li class:completed={note.completed}>
        {note.title}
      </li>
    {/each}
  </ul>
{/if}
```

### Subscribe to Specific Record

```javascript
// Watch a single note for changes
const unsubscribe = pb.collection('notes').subscribe('NOTE_ID', (e) => {
  console.log('Note changed:', e.record);
});
```

---

## Common Tasks Cheat Sheet

### Authentication

```javascript
// Login
const auth = await pb.collection('users').authWithPassword(email, password);

// Logout
pb.authStore.clear();

// Check if logged in
if (pb.authStore.isValid) {
  console.log('User:', pb.authStore.record);
}

// Listen for auth changes
pb.authStore.onChange((token, record) => {
  console.log('Auth changed:', record?.email || 'logged out');
});
```

### Expand Relations

```javascript
// Fetch related data in single request
const sessions = await pb.collection('study_sessions').getList(1, 20, {
  expand: 'study_files,study_pages'
});

// Access expanded data
sessions.items.forEach(session => {
  console.log('Files:', session.expand?.study_files);
  console.log('Pages:', session.expand?.study_pages);
});
```

### Handle Errors

```javascript
try {
  const note = await pb.collection('notes').create({ title: 'Test' });
} catch (error) {
  if (error.status === 400) {
    // Validation error
    console.log('Validation:', error.response.data);
  } else if (error.status === 401) {
    // Not authenticated
    console.log('Please login');
  } else if (error.status === 403) {
    // Permission denied
    console.log('Access denied');
  } else if (error.status === 404) {
    // Not found
    console.log('Record not found');
  } else {
    // Other error
    console.log('Error:', error.message);
  }
}
```

### Batch Operations

```javascript
// Create multiple records
const notes = [
  { title: 'Note 1', completed: false },
  { title: 'Note 2', completed: false },
  { title: 'Note 3', completed: false }
];

const results = await Promise.all(
  notes.map(note => pb.collection('notes').create(note))
);

// Update multiple records
const ids = ['id1', 'id2', 'id3'];
await Promise.all(
  ids.map(id => pb.collection('notes').update(id, { completed: true }))
);
```

### Advanced Filters

```javascript
// Text search (contains)
filter: 'title ~ "keyword"'

// Text search (starts with)
filter: 'title @ "My"'

// Text search (ends with)
filter: 'title !@ "Note"'

// In list
filter: pb.filter('tags in {:tags}', { tags: ['study', 'work'] })

// Between dates
filter: 'created between "2024-01-01" and "2024-12-31"'

// Is empty
filter: 'isEmpty(content)'

// Geo distance (for geopoint fields)
filter: pb.filter('geoDistance(location, {:point}) <= {:radius}', {
  point: { lon: -73.9857, lat: 40.7484 },
  radius: 5  // kilometers
})
```

### Utility Functions

```javascript
// Generate unique code (8 chars)
function generateUniqueCode() {
  return Math.random().toString(36).substring(2, 10);
}

// Format file size
function formatFileSize(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// Get file type from extension
function getFileType(filename) {
  const ext = filename.split('.').pop().toLowerCase();
  const types = {
    'pdf': 'pdf',
    'doc': 'doc',
    'docx': 'docx',
    'xls': 'xls',
    'xlsx': 'xlsx',
    'ppt': 'ppt',
    'pptx': 'pptx',
    'md': 'md',
    'txt': 'txt',
    'rtf': 'rtf',
    'html': 'html',
    'htm': 'htm'
  };
  return types[ext] || 'txt';
}
```

---

## Next Steps

After mastering these basics, check out:

- [README.md](./README.md) - Complete E2E guide
- [SCHEMA_REFERENCE.md](./SCHEMA_REFERENCE.md) - Detailed schema documentation
- [PocketBase Official Docs](https://pocketbase.io/docs/)

---

*Last updated: 2025*
*Based on PocketBase v0.22+*