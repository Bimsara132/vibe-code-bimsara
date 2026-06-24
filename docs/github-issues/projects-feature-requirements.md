# Projects filters — requirements (SDK / platform)

**Scope:** Starred · Created by me · Shared with me  
**App:** vibe.ibl.ai · Routes: `/app/projects?filter=starred|created|shared`

---

## 1. Starred

**Requirement:** Server-backed **starred projects per user** (per org/tenant).

| Item | Spec |
|------|------|
| **Behavior** | User can star/unstar a project; starred projects appear under **Starred** (`?filter=starred`). |
| **Persistence** | Stored on server per `user_id` + `org`; synced across browsers and devices. |
| **Star toggle** | `POST` star · `DELETE` unstar (or equivalent mutation). |
| **List** | `GET …/projects/?filter=starred` returns only that user’s starred projects. |
| **List fields** | Each project includes `is_starred: boolean`. |
| **Empty state** | Valid response: empty list when user has no starred projects. |

**Draft API**

```http
GET    /api/ai-mentor/orgs/{org}/users/{user_id}/projects/?filter=starred
POST   /api/ai-mentor/orgs/{org}/users/{user_id}/projects/{id}/star/
DELETE /api/ai-mentor/orgs/{org}/users/{user_id}/projects/{id}/star/
```

---

## 2. Created by me

**Requirement:** List projects **owned or created by the current user**.

| Item | Spec |
|------|------|
| **Behavior** | **Created by me** shows projects the authenticated user created/owns. |
| **List** | `GET …/projects/?filter=owned` (or `?created_by={username}`). |
| **Rule** | Project is included if `owner_username` (or `created_by`) matches the current user. |
| **Overlap** | Document whether owned projects that are also shared appear here only, or in both Created and Shared. |

**Draft API**

```http
GET /api/ai-mentor/orgs/{org}/users/{user_id}/projects/?filter=owned
```

---

## 3. Shared with me

**Requirement:** List projects **shared with the current user** that they did not create (or all shared access — per product rule).

| Item | Spec |
|------|------|
| **Behavior** | **Shared with me** shows projects the user can access via share/invite, not only tenant-wide `shared` flag. |
| **List** | `GET …/projects/?filter=shared_with_me`. |
| **Rule** | User has access via membership/invite/ACL; exclude projects they own if product defines Shared as “invited only”. |
| **Empty state** | Valid response: empty list when no shared projects. |

**Draft API**

```http
GET /api/ai-mentor/orgs/{org}/users/{user_id}/projects/?filter=shared_with_me
```

---

## 4. Unified list contract

Single list endpoint with filter param:

```http
GET /api/ai-mentor/orgs/{org}/users/{user_id}/projects/
    ?filter=all|starred|owned|shared_with_me
    &sort=-updated_at
    &limit=50
    &offset=0
```

**Response item (minimum)**

```json
{
  "id": 42,
  "name": "Landing page",
  "description": "",
  "owner_username": "alice",
  "shared": false,
  "is_starred": true,
  "updated_at": "2026-06-22T12:00:00Z"
}
```

---

## 5. Acceptance criteria

### Starred
- [ ] Star/unstar per user, persisted server-side
- [ ] `filter=starred` returns correct subset
- [ ] `is_starred` on list/detail responses
- [ ] Works across devices for same account

### Created by me
- [ ] `filter=owned` (or equivalent) returns only user-created/owned projects
- [ ] Ownership rule documented and enforced by API

### Shared with me
- [ ] `filter=shared_with_me` returns projects shared with user per invite/membership rules
- [ ] Semantics of `shared` vs `shared_with_me` documented

---

## 6. SDK / data-layer

Expose for host apps (e.g. vibe.ibl.ai):

- `useGetUserProjectsQuery({ filter: 'starred' | 'owned' | 'shared_with_me' | 'all' })`
- `useStarProjectMutation` / `useUnstarProjectMutation` (or toggle)
- Types: `is_starred`, `owner_username`, `shared` on project model

---

*Starred, Created by me, Shared with me — platform requirements for vibe.ibl.ai.*
