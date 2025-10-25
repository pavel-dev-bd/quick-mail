# Secure Resume Mailer Application

A secure, full-stack MERN application for bulk resume emailing with enhanced security features.

## Features

- 🔐 Secure JWT Authentication
- 📧 Bulk Email Sending with Rate Limiting
- 🏢 Company Management
- 📄 Resume Upload & Management
- 📝 Email Templates
- 📊 Email History Tracking
- 🔒 Enhanced Security Features

## Tech Stack

### Backend
- Node.js & Express.js
- MongoDB with Mongoose
- JWT Authentication
- Security Middlewares (Helmet, Rate Limiting, etc.)

### Frontend
- React.js
- React Router
- Context API for State Management
- Axios for API calls

## Security Features

- Helmet.js for security headers
- Rate limiting for API protection
- Data sanitization against NoSQL injection
- XSS protection
- Password hashing with bcrypt
- JWT token security
- File upload validation

## Installation

### Backend Setup
1. Navigate to backend directory
2. Copy `.env.example` to `.env` and configure
3. Run `npm install`
4. Run `npm