#  ProjectForge - Project & Issue Management API

A scalable REST API with authentication, role-based access control, and a modern React frontend for project and issue management.

![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-blue)
![React](https://img.shields.io/badge/React-18+-61dafb)
![License](https://img.shields.io/badge/license-MIT-blue)

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Security Features](#security-features)

## Features

### Backend
- User registration & login with JWT authentication
- Role-based access control (User vs Admin)
- CRUD operations for Projects
- CRUD operations for Issues
- Password hashing with bcrypt (12 rounds)
- Input validation and sanitization
- RESTful API design with proper HTTP status codes
- API versioning (/api/v1)
- Swagger/OpenAPI documentation
- Error handling middleware
- Modular and scalable architecture

### Frontend
-Modern React UI with Vite
-User authentication (Register/Login)
-Protected routes with JWT
-Complete CRUD for Projects
-Complete CRUD for Issues
-Responsive design
-Error/Success message handling
-Clean and intuitive interface

## 🛠 Tech Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **Documentation**: Swagger (swagger-jsdoc, swagger-ui-express)
- **Environment**: dotenv

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **HTTP Client**: Axios
- **Styling**: CSS3 with modern features

## Project Structure

```
projectforge/
├── backend/
│   ├── controllers/
│   │   ├── auth.js              # Authentication logic
│   │   ├── projects.js          # Project CRUD
│   │   └── issues.js            # Issue CRUD
│   ├── middleware/
│   │   ├── auth.js              # JWT verification
│   │   ├── admin.js             # Admin authorization
│   │   └── errorHandler.js      # Error handling
│   ├── routes/
│   │   ├── auth.js              # Auth routes
│   │   ├── projects.js          # Project routes
│   │   └── issues.js            # Issue routes
│   ├── db/
│   │   └── db.js                # Database connection
│   ├── utils/
│   │   └── generateToken.js     # JWT generation
│   ├── server.js                # Entry point
│   ├── swagger.js               # API documentation config
│   ├── schema.sql               # Database schema
│   ├── package.json
│   ├── .env.example
│   └── ProjectForge_API.postman_collection.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── styles/
│   │   │   ├── Auth.css
│   │   │   └── Dashboard.css
│   │   ├── Api.js               # Axios configuration
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
│
├── SCALABILITY.md               # Scalability documentation
└── README.md
```

##  Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (or Supabase account)
- Git

### Backend Setup

1. **Clone the repository**
```bash
git clone https://github.com/AbhinavBangar1/ProjectForgeAPI.git
cd projectforge/backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` and add your credentials:
```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
JWT_SECRET=your_super_secret_key_min_32_chars
PORT=5000
```

4. **Set up database**
- Create a Supabase project or local PostgreSQL database
- Run the SQL schema from `schema.sql` in your database
- Tables will be created: Users, Projects, Issues

5. **Start the server**
```bash
npm run dev
```

Server runs at: `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd ../frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Update API URL (if needed)**
Edit `src/Api.js` and update the baseURL:
```javascript
const API = axios.create({
  baseURL: "http://localhost:5000/api/v1"
});
```

4. **Start development server**
```bash
npm run dev
```

Frontend runs at: `http://localhost:5173`

## API Documentation

### Interactive Documentation
Once the backend is running, access Swagger documentation at:
```
http://localhost:5000/api/v1/docs
```

### Postman Collection
Import `ProjectForge_API.postman_collection.json` into Postman for easy API testing.

### Quick API Reference

#### Authentication Endpoints

**Register User**
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "username": "test",
  "email": "test@example.com",
  "password": "Pass123!"
}
```

**Login User**
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "Pass123!"
}
```

#### Project Endpoints

**Create Project** (requires auth)
```http
POST /api/v1/projects
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "New Website",
  "description": "Build a responsive website"
}
```

**Get All Projects**
```http
GET /api/v1/projects
Authorization: Bearer {token}
```

**Update Project**
```http
PUT /api/v1/projects/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Updated Title",
  "description": "Updated description"
}
```

**Delete Project**
```http
DELETE /api/v1/projects/{id}
Authorization: Bearer {token}
```

#### Issue Endpoints

**Create Issue**
```http
POST /api/v1/issues
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Fix login bug",
  "description": "Users can't login with special chars",
  "status": "open",
  "project_id": "{project_id}"
}
```

**Get Issues by Project**
```http
GET /api/v1/issues?project_id={project_id}
Authorization: Bearer {token}
```

**Delete Issue**
```http
DELETE /api/v1/issues/{id}
Authorization: Bearer {token}
```

## Database Schema

### Users Table
```sql
- id (UUID, Primary Key)
- username (VARCHAR)
- email (VARCHAR, Unique)
- password (VARCHAR, Hashed)
- role (VARCHAR: 'user' or 'admin')
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### Projects Table
```sql
- id (UUID, Primary Key)
- title (VARCHAR)
- description (TEXT)
- owner_id (UUID, Foreign Key → Users)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### Issues Table
```sql
- id (UUID, Primary Key)
- title (VARCHAR)
- description (TEXT)
- status (VARCHAR: 'open', 'in_progress', 'closed')
- project_id (UUID, Foreign Key → Projects)
- assigned_to (UUID, Foreign Key → Users)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

## Security Features

1. **Password Security**
   - Bcrypt hashing with 12 salt rounds
   - Passwords never stored in plain text

2. **JWT Authentication**
   - Tokens expire after 24 hours
   - Bearer token authentication
   - Secure token generation

3. **Input Validation**
   - Required field validation
   - Email format validation
   - Sanitization of user inputs

4. **Authorization**
   - Role-based access control
   - Protected routes
   - Owner verification for updates/deletes

5. **Database Security**
   - Foreign key constraints
   - Cascade deletes
   - Indexed queries for performance

