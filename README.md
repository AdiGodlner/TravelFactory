# TravelFactory

A take-home assignment for TravelFactory. a small back-office application for managing vacation requests.

## Tech Stack

### Frontend

- Vue 3
- Vite
- Pinia
- Vue Router
- Axios

### Backend

- Node.js (Express)
- TypeScript
- TypeORM
- PostgreSQL
- JWT Authentication

### Testing

- Vitest
- Supertest

---

## Setup Instructions

### 1. Clone repository

```Bash
git clone git@github.com:AdiGodlner/TravelFactory.git
cd TravelFactory
```

### 2. Backend setup

```Bash
cd server
npm install
```

Create environment file:
A `.env.example` file is provided for convenience.

Copy the file to `.env` and provide the required database credentials and ports.

```Bash
cp .env.example .env
```

Run backend:

```Bash
npm run dev
```

The server will start on the configured localhost port and print the active address to the console.

### 2. Frontend setup

```Bash
cd client
npm install
```

Create environment file:

```Bash
cp .env.example .env
```

The client `.env` file should point to the backend server URL and port.
For example:

```env
VITE_API_URL=http://localhost:3000
```

Run frontend:

```Bash
npm run dev
```

---

## Environment Variables

Server **.env**

```env
PORT=3000
NODE_ENV=dev or prod

JWT_SECRET=your_secret_key_here

DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=vacations
DB_PORT=5432

CLIENT_URL=http://localhost:5173
```

Client **.env**

```env
VITE_API_URL=http://localhost:3000
```

---

## Authentication Flow

1. User logs in
2. Server returns JWT token
3. Token is stored in localStorage
4. Axios interceptor attaches token to requests
5. Backend middleware validates token and role

### Authentication Behavior (Login or Create)

For simplicity, the authentication system does not use a traditional signup flow.

When a user attempts to log in:

- If a user with the given name and role exists, they are returned.
- If no matching user exists, a new user is automatically created with the provided name and role.

This behavior was implemented to simplify the scope of the assignment and remove the need for a separate registration system while still allowing role-based access testing.

## Roles

### Requester

- Create vacation request
- View own requests
- Delete their own request only if they are pending

### Validator

- View all vacation requests
- Approve or reject requests
- Must provide comment when rejecting

---

## API Endpoints

### Auth

```
POST /auth/login
```

### Requester Routes

```
POST /user/vacations
GET  /user/vacations
DELETE /user/vacations/:id
```

### Validator Routes

```
GET  /validator/vacations
PATCH /validator/vacations/:id
```

---

## Business Rules

- End date must be after start date
- Start date must not be in the past
- Only pending requests can be modified or deleted
- Rejecting a request requires a comment
- Validators can only modify pending requests

---

## Testing

Run tests:

```Bash
cd server
npm run test
```

### Covers:

- Authentication flow
- Role-based access control
- Vacation creation rules
- Approval/rejection rules
- Database isolation between tests

---

## Server structure

The backend follows a layered architecture with separation of concerns.

### Routes

Responsible for:

- defining API endpoints
- attaching middleware
- forwarding requests to controllers

### Controllers

Responsible for:

- handling HTTP concerns
- extracting request data
- basic request validation
- forwarding requests to services

### Services

Responsible for:

- business logic
- validation rules
- database interactions through TypeORM

### Middleware

The middleware layer handles:

- JWT authentication
- role-based authorization
- async error handling
- centralized error responses

## Client Structure

The client is a Vue 3 application built with Vite.

### Technologies Used

- Vue Router for client-side routing
- Pinia for state management
- Axios for API communication
- localStorage for persisting authentication state across refreshes

### Structure Overview

- `views/` contains the main application pages
- `components/` contains reusable UI components
- `stores/` contains Pinia state management logic
- `api/` contains Axios API wrappers and configuration
- `router/` contains route definitions and role-based navigation guards

The client communicates with the backend through a centralized Axios instance that automatically attaches the JWT token to authenticated requests.

## Known Limitations

- No pagination is implemented; the server currently fetches all vacation requests from the database at once, which would not scale well for large datasets.
- No dedicated DTO validation layer was implemented; validation is handled manually inside controllers and services.
- No real user signup, password authentication, or refresh token flow exists. Users are created automatically on first login for simplicity.
- Frontend styling is intentionally minimal due to time constraints.
- No advanced production security hardening was implemented (rate limiting, CSRF protection, advanced XSS sanitization, etc.).

---

## Design Decisions

### Client

- A minimal responsive UI approach was chosen to prioritize functionality and architecture within the assignment time constraints.
- Pinia was used for centralized and predictable state management.
- Authentication state is persisted using `localStorage` to allow session persistence across page refreshes.
- Axios is configured through a centralized client with automatic JWT attachment via interceptors.
- Vue Router navigation guards are used for role-based route protection.

### Server

- Validation logic was implemented manually instead of using a formal DTO validation library to keep the project scope manageable.
- Authentication is JWT-based and authorization is role-based. UUID user identifiers were chosen to simplify future extension into a more complete authentication system.
- Environment variables are loaded once into a typed configuration module so the application fails fast on invalid startup configuration.
- Error handling is centralized through a custom error middleware to provide consistent API responses and simplify controller logic.
- Business logic is separated into service layers to keep controllers focused on HTTP concerns.
- Middleware is used to separate authentication, authorization, async error handling, and request processing concerns.
