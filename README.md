# TravelFactory

A take-home assignment for TravelFactory. a toy back-office application for managing vacation requests.

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

```bash
git clone <repository-url>
cd <project-root>
```

### 2. Backend setup

```bash
cd server
npm install
```

Create environment file:
a .env.example file is provided for convinence
you are excepceted to fill in the required port DB name and so on that are in that are provided in the example file

```bash
cp .env.example .env
```

Run backend:

```bash
npm run dev
```

server then will start on localhost at the port you gave it
the server will also print out the port it is running on for convinience

### 2. Frontend setup

```bash
cd client
npm install
```

Create environment file:

```bash
cp .env.example .env
```

note the client env file excpects you to provide the port that the serveer runs on i.e http://localhost:<THE_PORT_YOU_CHOUSE>

Run frontend:

```bash
npm run dev
```

---

## Environment Variables

Server **.env**

```
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

```
VITE_API_URL=http://localhost:3000
```
