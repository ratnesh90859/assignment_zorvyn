# 💰 Finance Data Processing & Access Control — Backend API

A production-ready **Node.js + Express.js** REST API backend for managing personal and organizational financial records with **role-based access control (RBAC)**, **JWT authentication**, **MongoDB Atlas** database, and **Swagger UI** documentation.

---

## 📋 Table of Contents

- [Business Use Case](#-business-use-case)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
- [Environment Variables](#-environment-variables)
- [Running the Server](#-running-the-server)
- [Default Test Accounts](#-default-test-accounts)
- [Swagger UI Testing Guide](#-swagger-ui-testing-guide)
- [All API Endpoints](#-all-api-endpoints)
- [Sample JSON Formats](#-sample-json-formats)
- [Role-Based Access Control](#-role-based-access-control)
- [Error Handling](#-error-handling)

---

## 🏢 Business Use Case

### Scenario
A **financial management platform** where multiple users (employees, managers, accountants) track income and expenses. Different team members get different levels of access based on their role.

### Real-World Usage
| Who | Role | What They Can Do |
|-----|------|-----------------|
| Accountant / Manager | **Admin** | Full access — add, edit, delete records, manage all users |
| Finance Analyst | **Analyst** | View all records, filter and analyze data, view dashboards |
| Employee / Staff | **Viewer** | View dashboards and reports only |

### What This API Solves
- **Track money in & out** — Record every income and expense transaction
- **Categorize spending** — Organize by salary, food, transport, utilities etc.
- **Analytics** — See monthly trends, category-wise spending, net balance
- **Security** — Only authorized roles can create or modify data
- **Multi-user** — Each user's data is isolated, admins oversee all

---

## ✨ Features

### 🔐 Authentication & Users
- User registration with email + password
- JWT-based login (token valid for 7 days)
- Role assignment: `viewer`, `analyst`, `admin`
- User status management (active / inactive)
- Passwords hashed with bcrypt

### 💳 Financial Records
- Full CRUD — Create, Read, Update, Delete
- Two transaction types: `income` and `expense`
- 11 categories: salary, investment, business, food, transport, utilities, entertainment, healthcare, education, shopping, other
- Filter by type, category, date range
- Pagination support
- Soft delete (records are marked deleted, not removed)

### 📊 Dashboard & Analytics
- Total income, total expense, net balance
- Category-wise breakdown with totals and count
- Recent activity feed (last 10 transactions)
- Monthly trends
- Weekly trends (optional)

### 🛡️ Security
- JWT authentication on all protected routes
- Role-based middleware on every endpoint
- Rate limiting (100 requests per 15 min)
- Input validation with Joi schemas
- Helmet security headers
- CORS support

### 📖 API Documentation
- Interactive Swagger UI at `/api-docs`
- Full OpenAPI 3.0 specification
- Try all endpoints directly in browser

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js v24 |
| Framework | Express.js 4.18 |
| Database | MongoDB Atlas (Mongoose 8) |
| Authentication | JWT (jsonwebtoken) + bcryptjs |
| Validation | Joi 17 |
| API Docs | Swagger UI Express + swagger-jsdoc |
| Security | Helmet, CORS, express-rate-limit |
| Logging | Winston |
| Dev Tools | Nodemon, dotenv |

---

## 📁 Project Structure

```
assignment/
├── src/
│   ├── config/
│   │   ├── index.js            # App configuration (env vars)
│   │   ├── database.js         # MongoDB connection
│   │   ├── swagger.js          # OpenAPI/Swagger spec
│   │   ├── seed.js             # Default users seeder
│   │   └── seedRecords.js      # Sample financial records seeder
│   ├── constants/
│   │   └── index.js            # Enums: UserRole, TransactionType, Categories
│   ├── controllers/
│   │   ├── auth.controller.js       # Register, Login handlers
│   │   ├── user.controller.js       # User CRUD handlers
│   │   ├── record.controller.js     # Financial record CRUD handlers
│   │   └── dashboard.controller.js  # Analytics handlers
│   ├── middleware/
│   │   ├── auth.middleware.js        # JWT verification
│   │   ├── authorization.middleware.js # Role-based access check
│   │   ├── validation.middleware.js   # Joi request validation
│   │   └── error.middleware.js        # Global error handler
│   ├── models/
│   │   ├── user.model.js       # Mongoose User schema
│   │   └── record.model.js     # Mongoose Record schema
│   ├── routes/
│   │   ├── auth.routes.js      # POST /register, POST /login
│   │   ├── user.routes.js      # User management routes
│   │   ├── record.routes.js    # Financial record routes
│   │   ├── dashboard.routes.js # Analytics routes
│   │   └── index.js            # Route aggregator
│   ├── services/
│   │   ├── auth.service.js     # Auth business logic
│   │   ├── user.service.js     # User business logic
│   │   ├── record.service.js   # Record business logic
│   │   └── dashboard.service.js # Analytics calculations
│   ├── utils/
│   │   └── logger.js           # Winston logger setup
│   ├── validators/
│   │   └── index.js            # Joi schemas for all requests
│   ├── app.js                  # Express app setup
│   └── server.js               # Server entry point
├── scripts/
│   ├── seedDummyData.js        # Standalone seeder script
│   └── clearRecords.js         # Clear all records script
├── logs/                       # Log files directory
├── .env                        # Environment variables
├── .env.example                # Environment variables template
├── package.json
└── README.md
```

---

## ✅ Prerequisites

- **Node.js** v14 or higher — [Download](https://nodejs.org)
- **npm** (comes with Node.js)
- Internet connection (for MongoDB Atlas)

---

## ⚙️ Installation & Setup

### 1. Navigate to the project

```bash
cd /Users/ratneshsingh/Developer/assignment
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment is already configured

The `.env` file is pre-configured with MongoDB Atlas credentials. No changes needed.

---

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment | `development` |
| `MONGODB_URI` | MongoDB Atlas connection string | Set in `.env` |
| `JWT_SECRET` | Secret key for JWT signing | Set in `.env` |
| `JWT_EXPIRES_IN` | Token expiry duration | `7d` |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window (ms) | `900000` (15 min) |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | `100` |
| `CORS_ORIGIN` | Allowed origins | `*` |

---

## 🚀 Running the Server

### Production mode
```bash
npm start
```

### Development mode (auto-restarts on file change)
```bash
npm run dev
```

### Seed dummy data (29 financial records)
```bash
npm run seed
```

### Clear all financial records
```bash
npm run clear-records
```

### Successful startup output
```
╔════════════════════════════════════════════════════════════╗
║  Finance Data Processing Backend Server                   ║
╠════════════════════════════════════════════════════════════╣
║  🚀 Server running on: http://localhost:3000              ║
║  📖 API Documentation: http://localhost:3000/api-docs     ║
║  📝 Environment: development                              ║
║  🔧 Node Version: v24.9.0                                ║
║  💾 Database: MongoDB Connected                           ║
╠════════════════════════════════════════════════════════════╣
║  Default Test Accounts:                                   ║
║  Admin:   admin@example.com    / admin123                 ║
║  Analyst: analyst@example.com  / analyst123               ║
║  Viewer:  viewer@example.com   / viewer123                ║
╚════════════════════════════════════════════════════════════╝
```

---

## 👤 Default Test Accounts

Pre-seeded on first startup:

| Role | Email | Password | Access Level |
|------|-------|----------|--------------|
| **Admin** | admin@example.com | admin123 | Full CRUD + User management |
| **Analyst** | analyst@example.com | analyst123 | Read-only access |
| **Viewer** | viewer@example.com | viewer123 | Read-only access |

---

## 📖 Swagger UI Testing Guide

### Step 1 — Open Swagger UI
Go to: **http://localhost:3000/api-docs**

---

### Step 2 — Login and Get Token

1. In Swagger, expand **Authentication → POST /api/auth/login**
2. Click **"Try it out"**
3. Paste this in the request body:
```json
{
  "email": "admin@example.com",
  "password": "admin123"
}
```
4. Click **Execute**
5. From the response, **copy the token value** (long string starting with `eyJ...`)

---

### Step 3 — Authorize in Swagger

1. Click the **"Authorize 🔓"** button at the top right of Swagger UI
2. In the `bearerAuth` field, paste your token
3. Click **Authorize** → **Close**

✅ All APIs now use your token automatically!

---

### Step 4 — Test All APIs

#### 🔐 Authentication

| # | Method | Endpoint | Description | Auth Required |
|---|--------|----------|-------------|---------------|
| 1 | POST | `/api/auth/register` | Register new user | No |
| 2 | POST | `/api/auth/login` | Login and get JWT token | No |

#### 💳 Financial Records

| # | Method | Endpoint | Description | Role Required |
|---|--------|----------|-------------|---------------|
| 3 | GET | `/api/records` | Get all records (with filters) | Any |
| 4 | GET | `/api/records/:id` | Get single record by ID | Any |
| 5 | POST | `/api/records` | Create new record | Admin only |
| 6 | PUT | `/api/records/:id` | Update a record | Admin only |
| 7 | DELETE | `/api/records/:id` | Soft-delete a record | Admin only |

#### 📊 Dashboard Analytics

| # | Method | Endpoint | Description | Role Required |
|---|--------|----------|-------------|---------------|
| 8 | GET | `/api/dashboard/summary` | Total income, expense, balance + trends | Any |
| 9 | GET | `/api/dashboard/income` | Income breakdown by category | Any |
| 10 | GET | `/api/dashboard/expense` | Expense breakdown by category | Any |

#### 👥 User Management

| # | Method | Endpoint | Description | Role Required |
|---|--------|----------|-------------|---------------|
| 11 | GET | `/api/users` | Get all users | Admin only |
| 12 | GET | `/api/users/:id` | Get user by ID | Admin only |
| 13 | PUT | `/api/users/:id` | Update user | Admin only |
| 14 | DELETE | `/api/users/:id` | Delete user | Admin only |

#### 🏥 Health

| # | Method | Endpoint | Description |
|---|--------|----------|-------------|
| 15 | GET | `/health` | Server health check |

---

## �� Sample JSON Formats

### Register New User
```json
POST /api/auth/register

{
  "email": "jane.doe@example.com",
  "password": "securepass123",
  "name": "Jane Doe",
  "role": "analyst"
}
```
> **Valid roles:** `viewer` | `analyst` | `admin`

---

### Login
```json
POST /api/auth/login

{
  "email": "admin@example.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "69ceb6eb1741320320bf5825",
      "email": "admin@example.com",
      "name": "Admin User",
      "role": "admin",
      "status": "active"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### Create Financial Record (Admin only)
```json
POST /api/records
Authorization: Bearer <token>

{
  "amount": 5000.00,
  "type": "income",
  "category": "salary",
  "date": "2024-04-01",
  "description": "Monthly salary - April",
  "notes": "Regular monthly payment"
}
```

**Valid `type` values:** `income` | `expense`

**Valid `category` values:**
```
income categories  → salary | investment | business | other
expense categories → food | transport | utilities | entertainment |
                     healthcare | education | shopping | other
```

**Response:**
```json
{
  "success": true,
  "message": "Record created successfully",
  "data": {
    "id": "69ceb794a9a9a3fb53545539",
    "userId": "69ceb6eb1741320320bf5825",
    "amount": 5000,
    "type": "income",
    "category": "salary",
    "date": "2024-04-01T00:00:00.000Z",
    "description": "Monthly salary - April",
    "notes": "Regular monthly payment",
    "createdAt": "2026-04-02T18:38:12.249Z",
    "updatedAt": "2026-04-02T18:38:12.249Z"
  }
}
```

---

### Get All Records (with filters)
```
GET /api/records?type=expense&category=food&startDate=2024-01-01&endDate=2024-12-31&page=1&limit=10
Authorization: Bearer <token>
```

**Available query parameters:**

| Parameter | Type | Example | Description |
|-----------|------|---------|-------------|
| `type` | string | `income` | Filter by income or expense |
| `category` | string | `salary` | Filter by category |
| `startDate` | date | `2024-01-01` | Records from this date |
| `endDate` | date | `2024-12-31` | Records until this date |
| `page` | number | `1` | Page number |
| `limit` | number | `10` | Items per page |

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "69ceb794a9a9a3fb53545539",
      "amount": 5000,
      "type": "income",
      "category": "salary",
      "date": "2024-04-01T00:00:00.000Z",
      "description": "Monthly salary - April"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 29,
    "totalPages": 3
  }
}
```

---

### Update Record (Admin only)
```json
PUT /api/records/:id
Authorization: Bearer <token>

{
  "amount": 5500.00,
  "description": "Updated salary amount",
  "notes": "Includes performance bonus"
}
```
> Only include fields you want to update. All fields are optional.

---

### Get Dashboard Summary
```
GET /api/dashboard/summary?includeMonthly=true&includeWeekly=true
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalIncome": 19950.00,
    "totalExpense": 7105.00,
    "netBalance": 12845.00,
    "categoryWiseTotals": [
      {
        "category": "salary",
        "type": "income",
        "total": 15000.00,
        "count": 3
      },
      {
        "category": "food",
        "type": "expense",
        "total": 1100.00,
        "count": 4
      }
    ],
    "recentActivity": [ ... ],
    "monthlyTrends": [
      {
        "month": "2024-01",
        "income": 6500,
        "expense": 1200,
        "net": 5300
      }
    ]
  }
}
```

---

### Update User (Admin only)
```json
PUT /api/users/:id
Authorization: Bearer <token>

{
  "name": "Updated Name",
  "role": "analyst",
  "status": "inactive"
}
```

---

## �� Role-Based Access Control

```
┌─────────────────────────────────────────────────────────┐
│                    RBAC Matrix                          │
├──────────────────────┬────────┬─────────┬──────────────-┤
│ Action               │ Viewer │ Analyst │ Admin         │
├──────────────────────┼────────┼─────────┼───────────────┤
│ Register / Login     │  ✅    │   ✅    │   ✅          │
│ View Records         │  ✅    │   ✅    │   ✅          │
│ View Dashboard       │  ✅    │   ✅    │   ✅          │
│ Create Records       │  ❌    │   ❌    │   ✅          │
│ Update Records       │  ❌    │   ❌    │   ✅          │
│ Delete Records       │  ❌    │   ❌    │   ✅          │
│ View Users           │  ❌    │   ❌    │   ✅          │
│ Manage Users         │  ❌    │   ❌    │   ✅          │
└──────────────────────┴────────┴─────────┴───────────────┘
```

---

## ❌ Error Handling

All errors follow this consistent format:

```json
{
  "success": false,
  "message": "Human-readable message",
  "error": "Specific error detail"
}
```

### Common HTTP Status Codes

| Code | Meaning | Common Cause |
|------|---------|--------------|
| `200` | OK | Request succeeded |
| `201` | Created | Resource created |
| `400` | Bad Request | Invalid data / email already exists |
| `401` | Unauthorized | Missing or invalid token |
| `403` | Forbidden | Token valid but role not allowed |
| `404` | Not Found | Record or user doesn't exist |
| `429` | Too Many Requests | Rate limit exceeded |
| `500` | Server Error | Unexpected server failure |

### Example Error Responses

**401 — No token provided:**
```json
{
  "success": false,
  "message": "Authentication required",
  "error": "No token provided"
}
```

**403 — Wrong role:**
```json
{
  "success": false,
  "message": "Access denied",
  "error": "This action requires one of the following roles: admin"
}
```

**400 — Validation error:**
```json
{
  "success": false,
  "message": "Validation failed",
  "error": "\"amount\" must be a positive number"
}
```

---

## 🧪 Quick Test with cURL

### 1. Login and capture token
```bash
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}' \
  | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

echo "Token: $TOKEN"
```

### 2. View all records
```bash
curl -s http://localhost:3000/api/records \
  -H "Authorization: Bearer $TOKEN" | jq .
```

### 3. View dashboard
```bash
curl -s "http://localhost:3000/api/dashboard/summary?includeMonthly=true" \
  -H "Authorization: Bearer $TOKEN" | jq .
```

### 4. Create a record
```bash
curl -s -X POST http://localhost:3000/api/records \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"amount":3000,"type":"income","category":"salary","date":"2024-04-02","description":"Test salary"}' | jq .
```

> Install `jq` for pretty output: `brew install jq`

---

## 📊 Pre-loaded Test Data

On first startup, **29 financial records** are seeded automatically:

| Type | Count | Total |
|------|-------|-------|
| **Income** | 8 records | $19,950.00 |
| **Expense** | 21 records | $7,105.00 |
| **Net Balance** | — | **$12,845.00** |

**Income categories:** Salary (3), Business (2), Investment (1), Other (2)

**Expense categories:** Food (4), Utilities (4), Other (6), Transport (2), Shopping (2), Education (1), Entertainment (1), Healthcare (1)

---

## 📝 Available npm Scripts

| Script | Command | Description |
|--------|---------|-------------|
| Start server | `npm start` | Runs with Node.js |
| Dev mode | `npm run dev` | Runs with Nodemon (auto-restart) |
| Seed data | `npm run seed` | Seeds 29 dummy financial records |
| Clear records | `npm run clear-records` | Deletes all financial records |

---

## 🔗 Key URLs

| URL | Description |
|-----|-------------|
| `http://localhost:3000` | Base server |
| `http://localhost:3000/health` | Health check |
| `http://localhost:3000/api-docs` | **Swagger UI (interactive docs)** |
| `http://localhost:3000/api/auth/login` | Login endpoint |
| `http://localhost:3000/api/records` | Records endpoint |
| `http://localhost:3000/api/dashboard/summary` | Dashboard endpoint |

