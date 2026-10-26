# Task API — Frontend Integration Guide

**Base URL:** `https://nestjs-learn-wbkf.onrender.com`

---

## Response Format

Every response follows this shape:

```ts
{
  status: "success" | "error",
  statusCode: number,
  message: string,
  data?: any,          // present on success
  errors?: string[],   // present on validation errors
  timestamp: string,
  path: string
}
```

---

## Endpoints

### Create Task — `POST /tasks`

```json
// Request Body
{ "title": "Learn NestJS" }

// Response — 201
{
  "status": "success",
  "statusCode": 201,
  "message": "Resource created successfully",
  "data": {
    "id": "ed98610b-220e-4c15-8b78-7d2c939ee3d3",
    "title": "Learn NestJS",
    "isCompleted": false,
    "createdAt": "2026-10-15T10:09:28.205Z",
    "updatedAt": "2026-10-15T10:09:28.205Z"
  }
}
```

---

### Get All Tasks — `GET /tasks`

```json
// Response — 200
{
  "status": "success",
  "statusCode": 200,
  "message": "Request successful",
  "data": [
    {
      "id": "ed98610b-220e-4c15-8b78-7d2c939ee3d3",
      "title": "Learn Prisma",
      "isCompleted": false,
      "createdAt": "2026-10-15T10:20:23.773Z",
      "updatedAt": "2026-10-15T10:23:38.106Z"
    }
  ]
}
```

> Returns newest first. Empty array `[]` in `data` when no tasks exist.

---

### Get One Task — `GET /tasks/:id`

```json
// Response — 200
{
  "status": "success",
  "statusCode": 200,
  "data": {
    "id": "ed98610b-...",
    "title": "Learn Prisma",
    "isCompleted": false,
    "createdAt": "2026-10-15T10:20:23.773Z",
    "updatedAt": "2026-10-15T10:23:38.106Z"
  }
}
```

---

### Update Task — `PATCH /tasks/:id`

```json
// Request Body (all fields optional)
{ "title": "New title", "isCompleted": true }

// Response — 200
{
  "status": "success",
  "statusCode": 200,
  "message": "Resource updated successfully",
  "data": {
    "id": "ed98610b-...",
    "title": "New title",
    "isCompleted": true,
    "createdAt": "2026-10-15T10:20:23.773Z",
    "updatedAt": "2026-10-15T10:45:00.000Z"
  }
}
```

---

### Delete Task — `DELETE /tasks/:id`

```json
// Response — 200
{
  "status": "success",
  "statusCode": 200,
  "message": "Resource deleted successfully",
  "data": { /* the deleted task object */ }
}
```

---

## Quick Reference

| Method   | Endpoint      | Body                                         | Success |
|----------|---------------|----------------------------------------------|:-------:|
| `POST`   | `/tasks`      | `{ "title": "string" }` *(required)*         | `201`   |
| `GET`    | `/tasks`      | —                                            | `200`   |
| `GET`    | `/tasks/:id`  | —                                            | `200`   |
| `PATCH`  | `/tasks/:id`  | `{ "title?": "string", "isCompleted?": bool }` | `200`   |
| `DELETE` | `/tasks/:id`  | —                                            | `200`   |

---

## Things to Know

- **Always read `data`** from the response — the actual payload lives there.
- **`:id` must be a valid UUID** — anything else returns `400`.
- **Only send `title` and `isCompleted`** — extra fields return `400`.
- **Errors have the same shape** — check `status === "error"` and show `message` to the user. For validation errors, `errors` has the list of issues.
