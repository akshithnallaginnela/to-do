# 🏥 Doctor Appointment Booking System

A comprehensive full-stack web application for booking doctor appointments built with the MERN stack (MongoDB, Express.js, React, Node.js) and integrated with Razorpay for secure online payments.

![Project Status](https://img.shields.io/badge/status-complete-green)
![Node.js](https://img.shields.io/badge/node.js-v16+-green)
![React](https://img.shields.io/badge/react-v18+-blue)
![MongoDB](https://img.shields.io/badge/mongodb-atlas-green)
![License](https://img.shields.io/badge/license-MIT-blue)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running the Application](#-running-the-application)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### 🔐 Three-Level Authentication System
- **Patient Portal**: Book appointments, manage medical history, view appointment history
- **Doctor Portal**: Manage profile, set availability, handle appointments, add diagnoses
- **Admin Portal**: Manage users, verify doctors, view analytics, system administration

### 🎯 Core Functionality
- **Doctor Discovery**: Advanced search and filtering by specialization, location, rating
- **Appointment Booking**: Real-time slot availability, booking confirmation
- **Payment Integration**: Secure online payments via Razorpay
- **Profile Management**: Comprehensive user and doctor profiles
- **Medical Records**: Track medical history, allergies, medications
- **Notifications**: Email notifications for appointments and updates
- **Responsive Design**: Mobile-first design for all devices

## 🛠 Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling framework
- **shadcn/ui** - Component library
- **React Router** - Client-side routing
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **Sonner** - Toast notifications
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Razorpay** - Payment gateway
- **Nodemailer** - Email service
- **Multer** - File upload handling
- **Express Validator** - Input validation
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security headers
- **Rate Limiting** - API protection

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** (v8 or higher) - Comes with Node.js
- **Git** - [Download](https://git-scm.com/)
- **MongoDB Atlas Account** - [Sign up](https://www.mongodb.com/atlas)
- **Razorpay Account** - [Sign up](https://razorpay.com/)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd pulse-appoint
```

### 2. Install Dependencies

#### Backend Setup
```bash
cd backend
npm install
```

#### Frontend Setup
```bash
cd ../client
npm install
```

## ⚙️ Configuration

### Backend Configuration (`backend/.env`)

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

### Frontend Configuration (`client/.env`)

```env
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

## 🏃‍♂️ Running the Application

### Development Mode

1. **Start Backend Server**
   ```bash
   cd backend
   npm run dev
   ```

2. **Start Frontend Server** (in a new terminal)
   ```bash
   cd ../client
   npm run dev
   ```

3. Access the application at [http://localhost:5173](http://localhost:5173)

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | /api/auth/register | Register new user |
| POST   | /api/auth/login | User login |
| GET    | /api/auth/me | Get current user |

### Doctor Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | /api/doctors | Get all doctors |
| GET    | /api/doctors/:id | Get doctor by ID |
| POST   | /api/doctors/availability | Set doctor availability |

### Appointment Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | /api/appointments | Book appointment |
| GET    | /api/appointments | Get appointments |
| PUT    | /api/appointments/:id | Update appointment |

## 📂 Project Structure

```
pulse-appoint/
├── backend/                     # Backend API
│   ├── models/                 # MongoDB Models
│   ├── routes/                 # API Routes
│   ├── middleware/             # Middleware
│   └── server.js               # Server entry
├── client/                     # Frontend React App
│   ├── src/
│   │   ├── components/         # Reusable Components
│   │   ├── pages/              # Page Components
│   │   ├── contexts/           # React Context
│   │   └── App.jsx             # Main App
├── .gitignore
└── README.md
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd client
npm test
```

## 🚀 Deployment

### Backend (Heroku)
```bash
# Set up Heroku
heroku create
heroku addons:create mongolab:sandbox

# Deploy
git push heroku main
```

### Frontend (Vercel/Netlify)
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variables

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/)
- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Razorpay](https://razorpay.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
