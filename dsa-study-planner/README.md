# 📚 DSA Study Planner

A modern, interactive web application to help you plan and track your Data Structures and Algorithms (DSA) study journey. Stay organized, track progress, and optimize your learning with this beautiful and intuitive planner.

## ✨ Features

- 📝 Create and manage DSA study tasks
- 🎨 Beautiful dark/light mode
- 📊 Track your study progress
- 🏷️ Categorize tasks by type (Concept, Practice, Review, Challenge)
- 🔍 Search and filter tasks
- 📱 Fully responsive design
- ⚡ Fast and performant

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm (v8 or higher) or Yarn
- Git (optional)

### Installation

1. **Clone the repository** (or download the source code)
   ```bash
   git clone https://github.com/yourusername/dsa-study-planner.git
   cd dsa-study-planner
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the `server` directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

## 🖥️ Running the Application

### Development Mode

1. **Start the server**
   ```bash
   cd server
   npm run dev
   ```

2. **Start the client**
   ```bash
   cd ../client
   npm run dev
   ```

3. Open [http://localhost:5173](http://localhost:5173) in your browser

### Production Build

1. **Build the client**
   ```bash
   cd client
   npm run build
   ```

2. **Start the production server**
   ```bash
   cd ../server
   npm start
   ```

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT
- **UI Components**: React Icons
- **State Management**: React Context API

## 📂 Project Structure

```
dsa-study-planner/
├── client/                 # Frontend React application
│   ├── public/            # Static files
│   └── src/               # React source code
│       ├── components/    # Reusable components
│       ├── context/       # React context
│       ├── pages/         # Page components
│       ├── App.jsx        # Main App component
│       └── main.jsx       # Application entry point
│
├── server/                # Backend server
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   └── server.js         # Server entry point
│
├── .gitignore
├── package.json
└── README.md
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Vite](https://vitejs.dev/) for the amazing build tool
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Framer Motion](https://www.framer.com/motion/) for animations
- [React Icons](https://react-icons.github.io/react-icons/) for beautiful icons
