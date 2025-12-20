# API Documentation for Product Board

## Base URL
All endpoints are prefixed with `/api/v1`.

## Authentication Flow
- **Login**: Use `POST /api/v1/auth/user/login` or `POST /api/v1/auth/user/token` with `username` and `password` (form data) to obtain a JWT token.
- **Token Usage**: Include the token in the `Authorization` header as `Bearer <token>`.
- **Permissions**: Most endpoints require organization-specific permissions, checked via `require_org_permission`. Permissions are strings like `"org.manage_settings"`, `"product.view"`, etc.
- **Optional Auth**: Some endpoints use `get_current_user_optional` for optional authentication.

## Common Response Structure
All responses use `ApiResponse<T>`:
- `success`: boolean
- `data`: T | null (the actual response data)
- `error`: ErrorInfo | null (only present on errors, with `code`, `message`, `details`)

Error responses include HTTP status codes (e.g., 401 for unauthorized, 403 for forbidden, 404 for not found).

## Frontend Integration Tips
- **Libraries**: Use Axios or Fetch for HTTP requests. Store JWT token in localStorage/sessionStorage.
- **Handling Auth**: On login, save token and set it in headers for all requests. Redirect to login on 401.
- **Pagination**: For list endpoints (e.g., products), use `page` and `limit` params; handle in UI with load-more or infinite scroll.
- **Search**: Append `?q=search_term` to list endpoints for filtering.
- **Errors**: Check `response.success`; display `response.error.message` in UI.
- **Quick Example (JavaScript)**:
  ```js
  // Login
  const login = async (username, password) => {
    const response = await fetch('/api/v1/auth/user/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ username, password })
    });
    const data = await response.json();
    if (data.success) {
      localStorage.setItem('token', data.data.access_token);
    }
  };

  // Authenticated request
  const getProducts = async (orgId) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`/api/v1/orgs/${orgId}/products`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return await response.json();
  };
  ```
- **Minimal Frontend Flow**: Register → Login → Create Org → List Orgs → Create Product → List Products → Add Feedback → Comment on Feedback.

---

## Users Router (`/auth/user`)

### GET /api/v1/auth/user/
- **Method**: GET
- **Path Params**: None
- **Query Params**: None
- **Request Body**: None
- **Response Model**: `{"status": "ok"}`
- **Auth Requirements**: None
- **Example**:
  - Request: `GET /api/v1/auth/user/`
  - Response: `{"status": "ok"}`

### POST /api/v1/auth/user/register
- **Method**: POST
- **Path Params**: None
- **Query Params**: None
- **Request Body**: `UserCreate` (fields: email, password, etc.)
- **Response Model**: `ApiResponse[UserOut]`
- **Auth Requirements**: Optional (prevents logged-in users from registering)
- **Example**:
  - Request: `POST /api/v1/auth/user/register` with body `{"email": "user@example.com", "password": "pass123"}`
  - Response: `{"success": true, "data": {"id": 1, "email": "user@example.com", ...}}`

### POST /api/v1/auth/user/login
- **Method**: POST
- **Path Params**: None
- **Query Params**: None
- **Request Body**: OAuth2PasswordRequestForm (username, password)
- **Response Model**: `ApiResponse[Token]`
- **Auth Requirements**: None
- **Example**:
  - Request: `POST /api/v1/auth/user/login` with form `username=user@example.com&password=pass123`
  - Response: `{"success": true, "data": {"access_token": "jwt_token", "token_type": "bearer"}}`

### POST /api/v1/auth/user/token
- **Method**: POST
- **Path Params**: None
- **Query Params**: None
- **Request Body**: OAuth2PasswordRequestForm (username, password)
- **Response Model**: `Token`
- **Auth Requirements**: None
- **Example**:
  - Request: `POST /api/v1/auth/user/token` with form `username=user@example.com&password=pass123`
  - Response: `{"access_token": "jwt_token", "token_type": "bearer"}`

### PATCH /api/v1/auth/user/users/{id}
- **Method**: PATCH
- **Path Params**: `id` (int, user ID)
- **Query Params**: None
- **Request Body**: `UserUpdate` (fields: email, etc.)
- **Response Model**: `ApiResponse[UserOut]`
- **Auth Requirements**: JWT token (current user must match or have permissions)
- **Example**:
  - Request: `PATCH /api/v1/auth/user/users/1` with body `{"email": "new@example.com"}` and header `Authorization: Bearer jwt_token`
  - Response: `{"success": true, "data": {"id": 1, "email": "new@example.com", ...}}`

### DELETE /api/v1/auth/user/delete-user/{id}
- **Method**: DELETE
- **Path Params**: `id` (int, user ID)
- **Query Params**: None
- **Request Body**: None
- **Response Model**: `ApiResponse[str]`
- **Auth Requirements**: JWT token (current user must match or have permissions)
- **Example**:
  - Request: `DELETE /api/v1/auth/user/delete-user/1` with header `Authorization: Bearer jwt_token`
  - Response: `{"success": true, "data": "Deleted successfully"}`

### GET /api/v1/auth/user/api/v1
- **Method**: GET
- **Path Params**: None
- **Query Params**: None
- **Request Body**: None
- **Response Model**: `{"task_id": str}`
- **Auth Requirements**: None
- **Example**:
  - Request: `GET /api/v1/auth/user/api/v1`
  - Response: `{"task_id": "some-uuid"}`

### GET /api/v1/auth/user/tasks/{task_id}
- **Method**: GET
- **Path Params**: `task_id` (str)
- **Query Params**: None
- **Request Body**: None
- **Response Model**: `{"task_id": str, "state": str, "result": any}`
- **Auth Requirements**: None
- **Example**:
  - Request: `GET /api/v1/auth/user/tasks/some-uuid`
  - Response: `{"task_id": "some-uuid", "state": "SUCCESS", "result": "pong"}`

---

## Organizations Router (`/org`)

### GET /api/v1/org/
- **Method**: GET
- **Path Params**: None
- **Query Params**: None
- **Request Body**: None
- **Response Model**: `ApiResponse[list[OrganizationOut]]`
- **Auth Requirements**: JWT token
- **Example**:
  - Request: `GET /api/v1/org/` with header `Authorization: Bearer jwt_token`
  - Response: `{"success": true, "data": [{"id": 1, "name": "Org1", ...}]}`
- **Permissions**: None (user's orgs)

### POST /api/v1/org/
- **Method**: POST
- **Path Params**: None
- **Query Params**: None
- **Request Body**: `OrganizationCreate` (fields: name, etc.)
- **Response Model**: `ApiResponse[OrganizationOut]`
- **Auth Requirements**: JWT token
- **Example**:
  - Request: `POST /api/v1/org/` with body `{"name": "New Org"}` and header `Authorization: Bearer jwt_token`
  - Response: `{"success": true, "data": {"id": 2, "name": "New Org", ...}}`
- **Permissions**: None

### PATCH /api/v1/org/{org_id}
- **Method**: PATCH
- **Path Params**: `org_id` (int)
- **Query Params**: None
- **Request Body**: `OrganizationUpdate` (fields: name, etc.)
- **Response Model**: `ApiResponse[OrganizationOut]`
- **Auth Requirements**: JWT token + org permission `"org.manage_settings"`
- **Example**:
  - Request: `PATCH /api/v1/org/1` with body `{"name": "Updated Org"}` and header `Authorization: Bearer jwt_token`
  - Response: `{"success": true, "data": {"id": 1, "name": "Updated Org", ...}}`
- **Permissions**: `"org.manage_settings"`

### DELETE /api/v1/org/{org_id}
- **Method**: DELETE
- **Path Params**: `org_id` (int)
- **Query Params**: None
- **Request Body**: None
- **Response Model**: `ApiResponse[str]`
- **Auth Requirements**: JWT token + org permission `"org.manage_settings"`
- **Example**:
  - Request: `DELETE /api/v1/org/1` with header `Authorization: Bearer jwt_token`
  - Response: `{"success": true, "data": "Deleted successfully"}`
- **Permissions**: `"org.manage_settings"`

---

## Invitations Router (`/orgs`)

### POST /api/v1/orgs/{org_id}/invites
- **Method**: POST
- **Path Params**: `org_id` (int)
- **Query Params**: None
- **Request Body**: `InvitationCreate` (fields: email, etc.)
- **Response Model**: `ApiResponse[InvitationRead]`
- **Auth Requirements**: JWT token + org permission `"org.manage_members"`
- **Example**:
  - Request: `POST /api/v1/orgs/1/invites` with body `{"email": "invite@example.com"}` and header `Authorization: Bearer jwt_token`
  - Response: `{"success": true, "data": {"id": 1, "token": "invite-token", ...}}`
- **Permissions**: `"org.manage_members"`

### GET /api/v1/orgs/invites/{token}
- **Method**: GET
- **Path Params**: `token` (str)
- **Query Params**: None
- **Request Body**: None
- **Response Model**: `ApiResponse[InvitationRead]`
- **Auth Requirements**: None
- **Example**:
  - Request: `GET /api/v1/orgs/invites/invite-token`
  - Response: `{"success": true, "data": {"id": 1, "org_name": "Org1", ...}}`

### POST /api/v1/orgs/{org_id}/invites/{token}/accept
- **Method**: POST
- **Path Params**: `org_id` (int), `token` (str)
- **Query Params**: None
- **Request Body**: None
- **Response Model**: `ApiResponse[InvitationRead]`
- **Auth Requirements**: JWT token
- **Example**:
  - Request: `POST /api/v1/orgs/1/invites/invite-token/accept` with header `Authorization: Bearer jwt_token`
  - Response: `{"success": true, "data": {"id": 1, "status": "accepted", ...}}`
- **Permissions**: None

---

## Products Router (`/orgs/{org_id}`)

### GET /api/v1/orgs/{org_id}/products/{product_id}
- **Method**: GET
- **Path Params**: `org_id` (int), `product_id` (int)
- **Query Params**: None
- **Request Body**: None
- **Response Model**: `ApiResponse[ProductReadDetailed]`
- **Auth Requirements**: JWT token + org permission `"product.view"`
- **Example**:
  - Request: `GET /api/v1/orgs/1/products/1` with header `Authorization: Bearer jwt_token`
  - Response: `{"success": true, "data": {"id": 1, "title": "Product1", ...}}`
- **Permissions**: `"product.view"`

### GET /api/v1/orgs/{org_id}/products
- **Method**: GET
- **Path Params**: `org_id` (int)
- **Query Params**: `page` (int, default 0), `limit` (int, default 20), `q` (str, optional search)
- **Request Body**: None
- **Response Model**: `ApiResponse[list[ProductRead]]`
- **Auth Requirements**: JWT token + org permission `"product.view"`
- **Example**:
  - Request: `GET /api/v1/orgs/1/products?page=0&limit=10&q=search` with header `Authorization: Bearer jwt_token`
  - Response: `{"success": true, "data": [{"id": 1, "title": "Product1", ...}]}`
- **Permissions**: `"product.view"`

### POST /api/v1/orgs/{org_id}/products
- **Method**: POST
- **Path Params**: `org_id` (int)
- **Query Params**: None
- **Request Body**: `ProductCreate` (fields: title, description, etc.)
- **Response Model**: `ApiResponse[ProductRead]`
- **Auth Requirements**: JWT token + org permission `"product.create"`
- **Example**:
  - Request: `POST /api/v1/orgs/1/products` with body `{"title": "New Product"}` and header `Authorization: Bearer jwt_token`
  - Response: `{"success": true, "data": {"id": 2, "title": "New Product", ...}}`
- **Permissions**: `"product.create"`

### PUT /api/v1/orgs/{org_id}/products/{product_id}
- **Method**: PUT
- **Path Params**: `org_id` (int), `product_id` (int)
- **Query Params**: None
- **Request Body**: `ProductUpdate` (fields: title, description, etc.)
- **Response Model**: `ApiResponse[ProductRead]`
- **Auth Requirements**: JWT token + org permission `"product.edit"`
- **Example**:
  - Request: `PUT /api/v1/orgs/1/products/1` with body `{"title": "Updated Product"}` and header `Authorization: Bearer jwt_token`
  - Response: `{"success": true, "data": {"id": 1, "title": "Updated Product", ...}}`
- **Permissions**: `"product.edit"`

### DELETE /api/v1/orgs/{org_id}/products/{product_id}
- **Method**: DELETE
- **Path Params**: `org_id` (int), `product_id` (int)
- **Query Params**: None
- **Request Body**: None
- **Response Model**: `ApiResponse[str]`
- **Auth Requirements**: JWT token + org permission `"product.delete"`
- **Example**:
  - Request: `DELETE /api/v1/orgs/1/products/1` with header `Authorization: Bearer jwt_token`
  - Response: `{"success": true, "data": "Deleted product successfully"}`
- **Permissions**: `"product.delete"`

---

## Feedback Router (`/orgs/{org_id}/products/{product_id}/feedback`)

### GET /api/v1/orgs/{org_id}/products/{product_id}/feedback/{feedback_id}
- **Method**: GET
- **Path Params**: `org_id` (int), `product_id` (int), `feedback_id` (int)
- **Query Params**: None
- **Request Body**: None
- **Response Model**: `ApiResponse[FeedbackRead]`
- **Auth Requirements**: JWT token + org permission `"feedback.view"`
- **Example**:
  - Request: `GET /api/v1/orgs/1/products/1/feedback/1` with header `Authorization: Bearer jwt_token`
  - Response: `{"success": true, "data": {"id": 1, "title": "Feedback1", ...}}`
- **Permissions**: `"feedback.view"`

### GET /api/v1/orgs/{org_id}/products/{product_id}/feedback
- **Method**: GET
- **Path Params**: `org_id` (int), `product_id` (int)
- **Query Params**: None
- **Request Body**: None
- **Response Model**: `ApiResponse[list[FeedbackRead]]`
- **Auth Requirements**: JWT token + org permission `"feedback.view"`
- **Example**:
  - Request: `GET /api/v1/orgs/1/products/1/feedback` with header `Authorization: Bearer jwt_token`
  - Response: `{"success": true, "data": [{"id": 1, "title": "Feedback1", ...}]}`
- **Permissions**: `"feedback.view"`

### POST /api/v1/orgs/{org_id}/products/{product_id}/feedback
- **Method**: POST
- **Path Params**: `org_id` (int), `product_id` (int)
- **Query Params**: None
- **Request Body**: `FeedbackCreate` (fields: title, description, etc.)
- **Response Model**: `ApiResponse[FeedbackRead]`
- **Auth Requirements**: JWT token + org permission `"feedback.create"`
- **Example**:
  - Request: `POST /api/v1/orgs/1/products/1/feedback` with body `{"title": "New Feedback"}` and header `Authorization: Bearer jwt_token`
  - Response: `{"success": true, "data": {"id": 2, "title": "New Feedback", ...}}`
- **Permissions**: `"feedback.create"`

### PUT /api/v1/orgs/{org_id}/products/{product_id}/feedback/{feedback_id}
- **Method**: PUT
- **Path Params**: `org_id` (int), `product_id` (int), `feedback_id` (int)
- **Query Params**: None
- **Request Body**: `FeedbackUpdate` (fields: title, description, etc.)
- **Response Model**: `ApiResponse[FeedbackRead]`
- **Auth Requirements**: JWT token + org permission `"feedback.edit_own"` or `"feedback.edit_all"`
- **Example**:
  - Request: `PUT /api/v1/orgs/1/products/1/feedback/1` with body `{"title": "Updated Feedback"}` and header `Authorization: Bearer jwt_token`
  - Response: `{"success": true, "data": {"id": 1, "title": "Updated Feedback", ...}}`
- **Permissions**: `"feedback.edit_own"` or `"feedback.edit_all"`

### DELETE /api/v1/orgs/{org_id}/products/{product_id}/feedback/{feedback_id}
- **Method**: DELETE
- **Path Params**: `org_id` (int), `product_id` (int), `feedback_id` (int)
- **Query Params**: None
- **Request Body**: None
- **Response Model**: `ApiResponse[str]`
- **Auth Requirements**: JWT token + org permission `"feedback.delete_own"` or `"feedback.delete_all"`
- **Example**:
  - Request: `DELETE /api/v1/orgs/1/products/1/feedback/1` with header `Authorization: Bearer jwt_token`
  - Response: `{"success": true, "data": "Deleted feedback successfully"}`
- **Permissions**: `"feedback.delete_own"` or `"feedback.delete_all"`

### PATCH /api/v1/orgs/{org_id}/products/{product_id}/feedback/{feedback_id}/status
- **Method**: PATCH
- **Path Params**: `org_id` (int), `product_id` (int), `feedback_id` (int)
- **Query Params**: None
- **Request Body**: `FeedbackStatusUpdate` (fields: status, etc.)
- **Response Model**: `ApiResponse[FeedbackRead]`
- **Auth Requirements**: JWT token + org permission `"feedback.change_status"`
- **Example**:
  - Request: `PATCH /api/v1/orgs/1/products/1/feedback/1/status` with body `{"status": "resolved"}` and header `Authorization: Bearer jwt_token`
  - Response: `{"success": true, "data": {"id": 1, "status": "resolved", ...}}`
- **Permissions**: `"feedback.change_status"`

### POST /api/v1/orgs/{org_id}/products/{product_id}/feedback/{feedback_id}/votes
- **Method**: POST
- **Path Params**: `org_id` (int), `product_id` (int), `feedback_id` (int)
- **Query Params**: None
- **Request Body**: `FeedbackVoteCreate` (fields: vote_type, etc.)
- **Response Model**: `ApiResponse[str]`
- **Auth Requirements**: JWT token + org permission `"vote.create"` or `"vote.revoke"`
- **Example**:
  - Request: `POST /api/v1/orgs/1/products/1/feedback/1/votes` with body `{"vote_type": "up"}` and header `Authorization: Bearer jwt_token`
  - Response: `{"success": true, "data": "Vote added"}`
- **Permissions**: `"vote.create"` or `"vote.revoke"`

### GET /api/v1/orgs/{org_id}/products/{product_id}/feedback/{feedback_id}/votes
- **Method**: GET
- **Path Params**: `org_id` (int), `product_id` (int), `feedback_id` (int)
- **Query Params**: None
- **Request Body**: None
- **Response Model**: `ApiResponse[int]`
- **Auth Requirements**: JWT token + org permission `"vote.view_counts"`
- **Example**:
  - Request: `GET /api/v1/orgs/1/products/1/feedback/1/votes` with header `Authorization: Bearer jwt_token`
  - Response: `{"success": true, "data": 5}`
- **Permissions**: `"vote.view_counts"`

---

## Comments Router (`/orgs/{org_id}/products/{product_id}/feedback/{feedback_id}/comment`)

### GET /api/v1/orgs/{org_id}/products/{product_id}/feedback/{feedback_id}/comment/{comment_id}
- **Method**: GET
- **Path Params**: `org_id` (int), `product_id` (int), `feedback_id` (int), `comment_id` (int)
- **Query Params**: None
- **Request Body**: None
- **Response Model**: `ApiResponse[CommentRead]`
- **Auth Requirements**: JWT token + org permission `"comment.view"`
- **Example**:
  - Request: `GET /api/v1/orgs/1/products/1/feedback/1/comment/1` with header `Authorization: Bearer jwt_token`
  - Response: `{"success": true, "data": {"id": 1, "content": "Comment text", ...}}`
- **Permissions**: `"comment.view"`

### GET /api/v1/orgs/{org_id}/products/{product_id}/feedback/{feedback_id}/comment
- **Method**: GET
- **Path Params**: `org_id` (int), `product_id` (int), `feedback_id` (int)
- **Query Params**: None
- **Request Body**: None
- **Response Model**: `ApiResponse[list[CommentRead]]`
- **Auth Requirements**: JWT token + org permission `"comment.view"`
- **Example**:
  - Request: `GET /api/v1/orgs/1/products/1/feedback/1/comment` with header `Authorization: Bearer jwt_token`
  - Response: `{"success": true, "data": [{"id": 1, "content": "Comment text", ...}]}`
- **Permissions**: `"comment.view"`

### POST /api/v1/orgs/{org_id}/products/{product_id}/feedback/{feedback_id}/comment
- **Method**: POST
- **Path Params**: `org_id` (int), `product_id` (int), `feedback_id` (int)
- **Query Params**: None
- **Request Body**: `CommentCreate` (fields: content, etc.)
- **Response Model**: `ApiResponse[CommentRead]`
- **Auth Requirements**: JWT token + org permission `"comment.create"`
- **Example**:
  - Request: `POST /api/v1/orgs/1/products/1/feedback/1/comment` with body `{"content": "New comment"}` and header `Authorization: Bearer jwt_token`
  - Response: `{"success": true, "data": {"id": 2, "content": "New comment", ...}}`
- **Permissions**: `"comment.create"`

### PUT /api/v1/orgs/{org_id}/products/{product_id}/feedback/{feedback_id}/comment/{comment_id}
- **Method**: PUT
- **Path Params**: `org_id` (int), `product_id` (int), `feedback_id` (int), `comment_id` (int)
- **Query Params**: None
- **Request Body**: `CommentUpdate` (fields: content, etc.)
- **Response Model**: `ApiResponse[CommentRead]`
- **Auth Requirements**: JWT token + org permission `"comment.edit_own"` or `"comment.moderate"`
- **Example**:
  - Request: `PUT /api/v1/orgs/1/products/1/feedback/1/comment/1` with body `{"content": "Updated comment"}` and header `Authorization: Bearer jwt_token`
  - Response: `{"success": true, "data": {"id": 1, "content": "Updated comment", ...}}`
- **Permissions**: `"comment.edit_own"` or `"comment.moderate"`

### DELETE /api/v1/orgs/{org_id}/products/{product_id}/feedback/{feedback_id}/comment/{comment_id}
- **Method**: DELETE
- **Path Params**: `org_id` (int), `product_id` (int), `feedback_id` (int), `comment_id` (int)
- **Query Params**: None
- **Request Body**: None
- **Response Model**: `ApiResponse[str]`
- **Auth Requirements**: JWT token + org permission `"comment.delete_own"` or `"comment.moderate"`
- **Example**:
  - Request: `DELETE /api/v1/orgs/1/products/1/feedback/1/comment/1` with header `Authorization: Bearer jwt_token`
  - Response: `{"success": true, "data": "Deleted comment successfully"}`
- **Permissions**: `"comment.delete_own"` or `"comment.moderate"`