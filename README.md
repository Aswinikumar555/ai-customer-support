# AI Customer Support Agent

This is a full-stack application that provides an AI-powered customer support chat system. Users can create accounts, chat with an AI assistant, and view their chat history.

## Features

- **User Authentication** with JWT
  - Signup/Login/Logout
  - Password hashing with bcrypt
  - Protected routes

- **Chat System**
  - AI-powered responses
  - Chat history saved in MongoDB
  - View past conversations

- **AI Integration**
  - Using OpenRouter.ai API for AI responses

## Tech Stack

- **Frontend**: React with Vite
- **Backend**: Node.js + Express
- **Database**: MongoDB
- **Authentication**: JWT + bcrypt
- **AI**: OpenRouter.ai
- **Containerization**: Docker

## Setup Instructions

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Docker and Docker Compose (optional)

### Environment Variables

#### Server (.env)
Create a `.env` file in the `server` directory:
```
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ai-customer-support
JWT_SECRET=your_jwt_secret_key_here
OPENROUTER_API_KEY=your_openrouter_api_key_here
APP_URL=http://localhost:3000
```

#### Client (.env)
Create a `.env` file in the `client` directory:
```
VITE_API_URL=http://localhost:5000/api
```

### Running with Docker

1. Set up environment variables:
```
cp server/.env.example server/.env
cp client/.env.example client/.env
```

2. Edit the `.env` files with your credentials

3. Start the application:
```
docker-compose up
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### Running without Docker

#### Server
```
cd server
npm install
npm run dev
```

#### Client
```
cd client
npm install
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/auth/user` - Get user data (protected)

### Chat
- `POST /api/chat/send` - Send a message and get AI response (protected)
- `GET /api/chat/history` - Get chat history (protected)
- `GET /api/chat/:id` - Get a specific chat (protected)
