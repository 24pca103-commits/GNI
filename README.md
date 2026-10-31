# Global Nagas Institute (GNI) - MERN Stack Web Platform

A modern, professional, secure, and fully responsive website for **Global Nagas Institute**, built using the **MERN Stack** (MongoDB, Express.js, React.js, Node.js) with Tailwind CSS and Lucide React.

---

## 🌟 Overview & Key Features

- **Responsive Architecture**: Pixel-perfect on mobile, tablet, laptop, and ultra-wide screens.
- **Modern Clean Design**: Professional aesthetic with balanced indigo/amber gradients, micro-interactions, and clear typography.
- **RESTful API Backend**: Scalable Express server with secure routes, MongoDB integration, and comprehensive input validation.
- **Enterprise-Grade Security**:
  - Secure password hashing using **bcrypt** (cost factor / salt rounds 12).
  - Rate limiting on registration to protect against brute force and automated spam.
  - HTTP security headers with **Helmet**.
  - CORS policies strictly controlled.
  - Strict input sanitization preventing NoSQL injection and XSS.
  - Masked errors preventing stack trace leaks.

---

## 🏛️ Home Page Sections

1. **Header / Navbar**:
   - Sticky navigation with glassmorphism backdrop blur.
   - Institute branding with emblem.
   - Responsive hamburger navigation menu for mobile devices.
   - Quick action CTA "Register Now".

2. **Banner / Hero Section**:
   - Inspiring educational banner layout with campus imagery.
   - Main message: *"Empowering Naga Youth with World-Class Knowledge & Global Opportunities"*.
   - Short description, key highlights, dynamic enrollment counters, and clear "Register Now" CTA.

3. **About Us Section**:
   - Short introduction to Global Nagas Institute.
   - Detailed breakdown of the institute's **Background**, **Purpose**, and **Vision**.
   - Professional layout combining high-resolution campus media with structured cards.

4. **Why Join Us Section**:
   - 6 Core benefits presented in modern icon cards:
     1. Industry-Aligned Curriculum
     2. Global Mentorship Network
     3. Guaranteed Placement Support
     4. Merit Scholarships & Grants
     5. State-of-the-Art Digital Labs
     6. Heritage & Ethical Leadership

5. **Process of Maintenance & Quality Section**:
   - Step-by-step 5-stage educational and academic quality timeline:
     - Stage 01: Assessment & Personalized Onboarding
     - Stage 02: Dynamic Curriculum Delivery & Labs
     - Stage 03: Continuous Review & Academic Maintenance
     - Stage 04: Standards & Infrastructure Maintenance
     - Stage 05: Career Placement & Lifelong Alumni Support

6. **Team Behind Section**:
   - Profiles of key institute leadership and faculty:
     - Profile image
     - Full Name & Academic Credentials
     - Official Designation
     - Detailed background and specialty description
     - Direct mentorship & social connect channels

7. **Testimonials Section**:
   - Real student and alumni reviews with star ratings (5/5).
   - Profile photos, verified badge, career position, and alumni batch details.

8. **Register Section**:
   - Professional admission registration form:
     - Full Name
     - Email Address
     - Mobile Number
     - Password (with strength meter & show/hide toggle)
     - Confirm Password
   - Comprehensive client-side and server-side validation.
   - Instant feedback with animated success card and clear error alerts.
   - Submits data to `POST /api/auth/register` and persists to MongoDB with bcrypt hashing.

9. **Footer Section**:
   - Campus contact info (Kohima/Dimapur, Nagaland), official emails, hotline phone numbers.
   - Quick links, academic program list, accreditation notice, and smooth scroll-to-top button.

---

## 📁 Clean & Professional Folder Structure

```
d:/GNI
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection logic
│   ├── controllers/
│   │   └── authController.js     # User registration & status controllers
│   ├── middleware/
│   │   ├── errorHandler.js       # Centralized error handler
│   │   └── validateRegistration.js # Field validation & regex checks
│   ├── models/
│   │   └── User.js               # Mongoose User schema & bcrypt pre-save hook
│   ├── routes/
│   │   └── authRoutes.js         # API routes with express-rate-limit
│   ├── .env                      # Environment configuration
│   ├── .env.example              # Template environment variables
│   ├── package.json              # Backend dependencies
│   └── server.js                 # Express server entry point
│
├── frontend/
│   ├── public/                   # Static assets & icons
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Navigation bar & mobile menu
│   │   │   ├── Hero.jsx          # Hero banner with message & stats
│   │   │   ├── About.jsx         # Background, purpose & vision
│   │   │   ├── WhyJoinUs.jsx     # Benefit cards with icons
│   │   │   ├── Process.jsx       # Maintenance timeline & quality steps
│   │   │   ├── Team.jsx          # Team leadership profiles
│   │   │   ├── Testimonials.jsx  # Student reviews & ratings
│   │   │   ├── Register.jsx      # Admission form with validation & bcrypt API
│   │   │   └── Footer.jsx        # Footer & contact info
│   │   ├── services/
│   │   │   └── api.js            # Fetch REST client for backend communication
│   │   ├── App.jsx               # Main application component
│   │   ├── index.css             # Tailwind CSS & base styles
│   │   └── main.jsx              # React DOM entry point
│   ├── index.html                # HTML template with Google Fonts & metadata
│   ├── package.json              # Frontend dependencies
│   └── vite.config.js            # Vite build config with Tailwind & proxy
│
├── package.json                  # Root runner scripts
└── README.md                     # Documentation
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18+ (tested on v24)
- **MongoDB**: Running locally on `mongodb://127.0.0.1:27017` or a MongoDB Atlas URI.

### 2. Environment Setup
The backend `.env` file is located at `backend/.env`:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/gni_institute
CLIENT_URL=http://localhost:5173
```

### 3. Run Backend Server
In the root directory or inside `backend`:
```powershell
cd d:\GNI\backend
npm start
# Server starts at http://127.0.0.1:5000
```

### 4. Run Frontend Development Server
In another terminal:
```powershell
cd d:\GNI\frontend
npm run dev
# Frontend runs at http://localhost:5173
```

---

## 📡 REST API Documentation

### `POST /api/auth/register`
Creates a new student account in MongoDB.

**Request Body:**
```json
{
  "fullName": "Sentila Jamir",
  "email": "sentila.jamir@example.com",
  "mobileNumber": "+919876543210",
  "password": "SecurePassword@2025",
  "confirmPassword": "SecurePassword@2025"
}
```

**Success Response (`201 Created`):**
```json
{
  "success": true,
  "message": "Congratulations! Your registration with Global Nagas Institute was successful.",
  "user": {
    "id": "670f...",
    "fullName": "Sentila Jamir",
    "email": "sentila.jamir@example.com",
    "mobileNumber": "+919876543210",
    "createdAt": "2026-09-24T..."
  }
}
```

**Error Responses:**
- `400 Bad Request`: Field validation failures (e.g. invalid email format, weak password, mismatched passwords).
- `409 Conflict`: Email address is already registered.
- `429 Too Many Requests`: Rate limit exceeded (more than 15 requests in 15 minutes).

### `GET /api/auth/status`
Returns real-time enrollment statistics and API health status.

### `GET /api/health`
Basic service liveness check.
