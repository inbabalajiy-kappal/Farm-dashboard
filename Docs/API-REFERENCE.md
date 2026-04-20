#Farm-map_dev — API Reference

> **Version:** 2.1  
> **Date:** 19 March 2026  
> **Related Document:** [BRD-Farm-map-Dev-v2.md](../../01_requirement-docs/BRD-Farm-map-Dev-v2.md)

---

## Overview

All API endpoints require authentication via Bearer token (external IdP) unless otherwise specified. Base URL: `/api/v1/`

**Common Headers**:
```
Authorization: Bearer <token>
Content-Type: application/json
X-Request-ID: <optional-correlation-id>
```

**Common Response Codes**:
| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request — Invalid input |
| 401 | Unauthorized — Missing/invalid token |
| 403 | Forbidden — Insufficient permissions |
| 404 | Not Found |
| 429 | Too Many Requests — Rate limit exceeded |
| 500 | Internal Server Error |

---

## 1. Chat Endpoints

### 1.1 Send Message

```
POST /api/v1/chat
```

Send a message and receive a response.

**Request Body**:
```json
{
  "conversation_id": "uuid (optional, creates new if omitted)",
  "message": "string (required)",
  "context": {
    "bypass_cache": false
  }
}
```

**Response**:
```json
{
  "conversation_id": "uuid",
  "message_id": "uuid",
  "response": "string",
  "confidence_score": 0.85,
  "sources": [
    {
      "document_id": "uuid",
      "chunk_id": "uuid",
      "filename": "string",
      "page": 1,
      "section": "string",
      "relevance_score": 0.92
    }
  ],
  "metadata": {
    "model_used": "gpt-4o",
    "latency_ms": 1234,
    "was_cached": false
  }
}
```

### 1.2 Stream Message (SSE)

```
POST /api/v1/chat/stream
Content-Type: text/event-stream
```

Send a message and receive streaming response via Server-Sent Events.

**Request Body**: Same as `/api/v1/chat`

**Response Stream**:
```
data: {"token": "The", "done": false}
data: {"token": " answer", "done": false}
data: {"token": " is", "done": false}
...
data: {"token": "", "done": true, "confidence_score": 0.85, "sources": [...]}
```

### 1.3 List Conversations

```
GET /api/v1/conversations
```

List user's conversations with pagination.

**Query Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | int | 1 | Page number |
| `limit` | int | 20 | Items per page (max 100) |
| `status` | string | active | Filter: `active`, `archived`, `all` |
| `search` | string | — | Full-text search in messages |

**Response**:
```json
{
  "conversations": [
    {
      "id": "uuid",
      "title": "string",
      "message_count": 10,
      "created_at": "ISO8601",
      "last_active_at": "ISO8601",
      "status": "active"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "has_more": true
  }
}
```

### 1.4 Get Conversation

```
GET /api/v1/conversations/{id}
```

Get conversation details with recent messages.

### 1.5 Get Conversation Messages

```
GET /api/v1/conversations/{id}/messages
```

Get paginated messages for a conversation.

**Query Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | int | 1 | Page number |
| `limit` | int | 50 | Messages per page |
| `before` | datetime | — | Messages before timestamp |
| `after` | datetime | — | Messages after timestamp |

### 1.6 Export Conversation

```
GET /api/v1/conversations/{id}/export
```

Export conversation as Markdown or JSON.

**Query Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `format` | string | markdown | `markdown` or `json` |

### 1.7 Delete Conversation

```
DELETE /api/v1/conversations/{id}
```

Soft-delete a conversation (recoverable for 30 days).

---

## 2. Feedback Endpoints

### 2.1 Submit Feedback

```
POST /api/v1/feedback
```

Submit feedback on an AI response.

**Request Body**:
```json
{
  "message_id": "uuid (required)",
  "rating": "thumbs_up | thumbs_down (required)",
  "category": "helpful | accurate | fast | other (optional)",
  "comment": "string (optional)"
}
```

### 2.2 Get Feedback Queue (Admin)

```
GET /api/v1/feedback/queue
```

Get pending feedback items for review.

**Query Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `status` | string | pending | `pending`, `reviewed`, `actioned` |
| `category` | string | — | Filter by category |
| `rating` | string | — | `thumbs_up` or `thumbs_down` |

### 2.3 Record Feedback Action (Admin)

```
POST /api/v1/feedback/{id}/action
```

Record action taken on feedback item.

**Request Body**:
```json
{
  "action_taken": "glossary_update | template_update | knowledge_gap | no_action",
  "action_detail": "string (optional)"
}
```

---

## 3. Knowledge Base Endpoints

### 3.1 List Documents

```
GET /api/v1/documents
```

List documents in the knowledge base.

**Query Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | int | 1 | Page number |
| `limit` | int | 20 | Items per page |
| `status` | string | completed | `pending`, `processing`, `completed`, `failed` |
| `file_type` | string | — | Filter by type: `pdf`, `docx`, etc. |

### 3.2 Upload Document

```
POST /api/v1/documents
Content-Type: multipart/form-data
```

Upload a document for RAG ingestion.

**Form Fields**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `file` | file | Yes | Document file (max 50MB) |
| `scope` | string | No | `personal`, `team`, `org` (default: personal) |
| `team_id` | uuid | No | Required if scope is `team` |
| `metadata` | json | No | Additional metadata |

**Response**:
```json
{
  "id": "uuid",
  "filename": "string",
  "status": "pending",
  "message": "Document queued for processing"
}
```

### 3.3 Get Document Details

```
GET /api/v1/documents/{id}
```

**Response**:
```json
{
  "id": "uuid",
  "filename": "string",
  "original_filename": "string",
  "file_type": "pdf",
  "mime_type": "application/pdf",
  "file_size_bytes": 1234567,
  "status": "completed",
  "chunk_count": 45,
  "uploaded_by": "uuid",
  "uploaded_at": "ISO8601",
  "processed_at": "ISO8601"
}
```

### 3.4 Delete Document

```
DELETE /api/v1/documents/{id}
```

Soft-delete document (excludes from retrieval, hard-deleted after 30 days).

### 3.5 Reindex Document

```
POST /api/v1/documents/{id}/reindex
```

Trigger re-chunking and re-embedding of a document.

---

## 4. Job Endpoints

### 4.1 Submit Job

```
POST /api/v1/jobs
```

Submit an async job (e.g., data transformation).

**Request Body**:
```json
{
  "tool_name": "string (required)",
  "input_params": {
    "key": "value"
  },
  "input_file_ids": ["uuid"]
}
```

**Response**:
```json
{
  "id": "uuid",
  "status": "queued",
  "message": "Job queued successfully"
}
```

### 4.2 Get Job Status

```
GET /api/v1/jobs/{id}
```

**Response**:
```json
{
  "id": "uuid",
  "tool_name": "string",
  "status": "running",
  "progress_pct": 45,
  "created_at": "ISO8601",
  "started_at": "ISO8601",
  "completed_at": null,
  "error_detail": null,
  "output_file_ids": []
}
```

### 4.3 Cancel Job

```
DELETE /api/v1/jobs/{id}
```

Cancel a queued or running job.

### 4.4 Get Job Outputs

```
GET /api/v1/jobs/{id}/outputs
```

Get download links for job output files.

**Response**:
```json
{
  "files": [
    {
      "id": "uuid",
      "filename": "string",
      "size_bytes": 12345,
      "download_url": "signed-url (1 hour expiry)"
    }
  ]
}
```

---

## 5. Admin Endpoints

### 5.1 List Tools

```
GET /api/v1/admin/tools
```

List registered tools/plugins.

### 5.2 Register Tool

```
POST /api/v1/admin/tools
```

Register a new tool manifest (YAML or MCP format).

**Request Body**:
```json
{
  "manifest": "yaml string or MCP JSON",
  "format": "yaml | mcp"
}
```

### 5.3 List Prompt Templates

```
GET /api/v1/admin/templates
```

**Query Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `status` | string | — | `draft`, `testing`, `production`, `deprecated` |
| `name` | string | — | Filter by template name |

### 5.4 Create/Update Prompt Template

```
POST /api/v1/admin/templates
```

**Request Body**:
```json
{
  "name": "string (required)",
  "description": "string",
  "template_body": "string (required)",
  "parameters": {
    "param_name": {
      "type": "string",
      "required": true,
      "description": "string"
    }
  },
  "status": "draft"
}
```

### 5.5 Get/Update Configuration

```
GET /api/v1/admin/config
PUT /api/v1/admin/config
```

Get or update runtime configuration overrides.

---

## 6. Domain Context Management Endpoints (Admin)

### 6.1 List Domain Context

```
GET /api/v1/admin/domain-context
```

**Query Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `type` | string | — | `glossary`, `faq`, `sop`, `business_rule`, `template` |
| `scope_type` | string | — | `org`, `function`, `team` |
| `scope_id` | uuid | — | Team/function ID |
| `status` | string | published | `draft`, `review`, `published`, `deprecated` |

### 6.2 Create Domain Context

```
POST /api/v1/admin/domain-context
```

**Request Body**:
```json
{
  "context_type": "glossary | faq | sop | business_rule | template",
  "scope_type": "org | function | team",
  "scope_id": "uuid (optional)",
  "name": "string (required)",
  "content": "string (required)",
  "term": "string (for glossary)",
  "synonyms": ["string"] ,
  "question": "string (for FAQ)",
  "answer": "string (for FAQ)",
  "tags": ["string"],
  "priority": 0
}
```

### 6.3 Get Domain Context Item

```
GET /api/v1/admin/domain-context/{id}
```

### 6.4 Update Domain Context Item

```
PUT /api/v1/admin/domain-context/{id}
```

### 6.5 Delete/Deprecate Domain Context

```
DELETE /api/v1/admin/domain-context/{id}
```

**Query Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `replacement_id` | uuid | — | ID of replacing context item |

### 6.6 Publish Domain Context

```
POST /api/v1/admin/domain-context/{id}/publish
```

Publish a draft context item (changes status to `published`).

### 6.7 Bulk Import

```
POST /api/v1/admin/domain-context/bulk-import
Content-Type: multipart/form-data
```

**Form Fields**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `file` | file | Yes | CSV or JSON file |
| `context_type` | string | Yes | `glossary` or `faq` |
| `scope_type` | string | No | Default: `org` |
| `scope_id` | uuid | No | Team/function ID |

### 6.8 List Teams

```
GET /api/v1/admin/teams
```

### 6.9 Create Team

```
POST /api/v1/admin/teams
```

**Request Body**:
```json
{
  "name": "string (required)",
  "function": "finance | hr | operations | it | ... (optional)",
  "parent_team_id": "uuid (optional)"
}
```

### 6.10 Manage Team Members

```
GET /api/v1/admin/teams/{id}/members
POST /api/v1/admin/teams/{id}/members
DELETE /api/v1/admin/teams/{id}/members/{user_id}
```

**POST Request Body**:
```json
{
  "user_id": "uuid (required)",
  "role": "member | admin"
}
```

### 6.11 Get Team Context

```
GET /api/v1/admin/teams/{id}/context
```

List all domain context items scoped to a specific team.

---

## 7. System Endpoints

### 7.1 Health Check

```
GET /api/v1/health
```

Returns component health status. No authentication required.

**Response**:
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "checks": {
    "postgresql": { "status": "healthy", "latency_ms": 5 },
    "vector_store": { "status": "healthy", "index_count": 45000 },
    "llm_provider": { "status": "healthy", "latency_ms": 220 },
    "file_storage": { "status": "healthy", "disk_free_gb": 42.5 },
    "plugins": {
      "data_transform": { "status": "healthy" },
      "rag_agent": { "status": "healthy" }
    }
  }
}
```

### 7.2 Metrics

```
GET /metrics
```

OpenTelemetry metrics endpoint (SigNoz-compatible). No authentication required.

---

## 8. User Preferences Endpoints

### 8.1 Get Preferences

```
GET /api/v1/user/preferences
```

### 8.2 Update Preferences

```
PUT /api/v1/user/preferences
```

**Request Body**:
```json
{
  "conversation_retention_days": 90,
  "improvement_consent": false
}
```

### 8.3 Request Data Export (GDPR)

```
POST /api/v1/user/data-export
```

Request full data export. Returns download link via email when ready.

---

## Error Response Format

All error responses follow this format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message",
    "trace_id": "abc-123-def",
    "retryable": true,
    "suggestion": "Optional suggestion for resolution",
    "details": {
      "field": "Additional context"
    }
  }
}
```

**Common Error Codes**:
| Code | HTTP Status | Description |
|------|-------------|-------------|
| `INVALID_INPUT` | 400 | Request validation failed |
| `UNAUTHORIZED` | 401 | Authentication required |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `RATE_LIMITED` | 429 | Too many requests |
| `TOKEN_BUDGET_EXCEEDED` | 429 | Daily token limit reached |
| `TOOL_TIMEOUT` | 504 | Plugin/tool timed out |
| `LLM_UNAVAILABLE` | 503 | LLM provider unavailable |
| `INTERNAL_ERROR` | 500 | Unexpected server error |

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 2.1 | 19 Mar 2026 | — | Initial extraction from BRD v2.1 |

---

*End of Document*
