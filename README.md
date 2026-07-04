# 🚀 CodePulse

CodePulse is a full-stack online coding platform that provides a secure and interactive environment for writing, executing, and managing code. It features JWT-based authentication, real-time multi-language code execution powered by the Judge0 API, and a modern code editing experience using the Monaco Editor.

---

## 🌐 Live Demo

**🔗 Live:**  https://codepulse1-lqsh.onrender.com/


## ✨ Features

- 🔐 Secure user authentication using JWT.
- 🔒 Password hashing with BCrypt.
- 🍪 Secure HTTP-only cookies for authentication over HTTPS.
- 🚫 Redis-based JWT token blacklisting with automatic expiration (TTL).
- 💻 Real-time multi-language code execution using the Judge0 API.
- 📝 Interactive Monaco Editor with syntax highlighting.
- ⚡ Fast RESTful APIs built using Express.js.
- 📱 Responsive and modern UI built with React and Tailwind CSS.
- 🗄️ MongoDB for efficient data storage.

---

## 🛠️ Tech Stack

### Frontend

- React.js
- Redux Toolkit
- Tailwind CSS
- DaisyUI
- Axios
- Monaco Editor

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- Redis
- JWT Authentication
- BCrypt
- Judge0 API

---


## 📂 Project Structure

```
CodePulse
│
├── backend
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── utils
│   └── server.js
│
├── frontend
│   ├── public
│   ├── src
│   └── package.json
│
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites

- Node.js
- MongoDB
- Redis
- Judge0 API Key

---

## Installation

### Clone the Repository

```bash
git clone https://github.com/Anirudh10102003/CodePulse.git
cd CodePulse
```

---

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the backend folder.

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
REDIS_URL=your_redis_connection_string
JUDGE0_API_KEY=your_judge0_api_key
GEMINI_API_KEY=your_gemini_api_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

```

Run the backend.

```bash
node src/index.js
```

---

### Frontend Setup

```bash
cd frontend
npm install
```


Run the frontend.

```bash
npm run dev
```

---

## 🔐 Authentication

CodePulse uses a secure authentication mechanism based on JWT.

### Authentication Flow

1. Users register with an encrypted password using BCrypt.
2. Users log in using their credentials.
3. The server generates a JWT.
4. The JWT is stored as a Secure HTTP-only cookie.
5. Protected routes validate the JWT before granting access.
6. On logout, the JWT is added to a Redis blacklist.
7. Redis automatically removes expired tokens using TTL.

---

## 💻 Code Execution Workflow

1. Write code in the Monaco Editor.
2. Choose the programming language.
3. Click **Run Code**.
4. The backend sends the request to the Judge0 API.
5. Judge0 compiles and executes the code.
6. The output is displayed in real time.

---

## 🔒 Security Features

- JWT-based authentication
- BCrypt password hashing
- Secure HTTP-only cookies
- HTTPS-enabled authentication
- Redis token blacklisting
- Automatic token expiration using Redis TTL
- Protected API routes

---

## 🚀 Future Enhancements

- 🤖 AI-powered coding assistant
- 📜 Submission history
- 🏆 Coding contests
- 👥 Collaborative coding rooms
- 🧪 Custom test cases
- 📊 User leaderboard
- 🌙 Dark/Light theme toggle

---

## 👨‍💻 Author

**Anirudh Kuila**

- GitHub: https://github.com/Anirudh10102003
- LinkedIn: https://www.linkedin.com/in/anirudh-kuila

---

## ⭐ Support

If you found this project helpful, please consider giving it a ⭐ on GitHub!

It motivates me to build more open-source projects.
