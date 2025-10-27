# 📚 DSA Study Planner

A comprehensive full-stack web application designed to help you master Data Structures and Algorithms (DSA) through structured planning, progress tracking, and interactive learning.

![Project Status](https://img.shields.io/badge/status-active-brightgreen)
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
- [Project Structure](#-project-structure)
- [Usage Guide](#-usage-guide)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### 🎯 Study Management
- **Task Categorization**: Organize study tasks by type (Concept, Practice, Review, Challenge)
- **Progress Tracking**: Visual progress indicators and statistics
- **Topic Organization**: Hierarchical structure for DSA topics
- **Reminder System**: Set study reminders and deadlines
- **Dark/Light Mode**: Eye-friendly interface for all lighting conditions

### 📊 Analytics & Insights
- **Performance Metrics**: Track your progress over time
- **Time Management**: Monitor time spent on different topics
- **Achievement System**: Earn badges for completing milestones
- **Progress Reports**: Generate detailed study reports

## 🛠 Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling framework
- **Framer Motion** - Animations
- **React Icons** - Icon library
- **React Router** - Client-side routing
- **Context API** - State management
- **Local Storage** - Client-side data persistence

### Backend (Future Implementation)
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** (v8 or higher) - Comes with Node.js
- **Git** - [Download](https://git-scm.com/)
- **Web Browser** - Chrome, Firefox, or Edge (latest version)

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/dsa-study-planner.git
   cd dsa-study-planner
   ```

2. **Install client dependencies**
   ```bash
   cd client
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to [http://localhost:5173](http://localhost:5173)

## 📂 Project Structure

```
dsa-study-planner/
├── client/                     # Frontend React Application
│   ├── public/                # Static files
│   ├── src/
│   │   ├── components/        # Reusable UI Components
│   │   ├── context/           # React Context for state management
│   │   ├── assets/            # Images, icons, and other assets
│   │   ├── App.jsx            # Main Application Component
│   │   └── main.jsx           # Application Entry Point
│   ├── .gitignore
│   ├── package.json
│   └── README.md
│
├── server/                     # Backend Server (Future Implementation)
│   ├── config/                # Configuration files
│   ├── controllers/           # Route controllers
│   ├── models/               # Database models
│   ├── routes/               # API routes
│   └── server.js             # Server entry point
│
├── .gitignore
└── README.md                  # This file
```

## 📖 Usage Guide

### Getting Started
1. **Create a New Study Plan**
   - Click on "+ New Task" to add a new study item
   - Select the type (Concept, Practice, Review, Challenge)
   - Set a due date and priority level

2. **Track Your Progress**
   - Mark tasks as complete when finished
   - View your progress in the dashboard
   - Track time spent on each topic

3. **Organize Your Study**
   - Use tags to categorize topics
   - Create custom study sessions
   - Set reminders for important deadlines

## 🚀 Deployment

### Deploying to Vercel
1. Push your code to a GitHub repository
2. Go to [Vercel](https://vercel.com/) and import your project
3. Configure the build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Click Deploy

## 🤝 Contributing

1. **Fork** the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. Open a **Pull Request**

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)

## 🙋‍♂️ Need Help?

If you have any questions or need assistance, feel free to open an issue in the repository. We're here to help!

---

<div align="center">
  Made with ❤️ by [Your Name]
</div>
