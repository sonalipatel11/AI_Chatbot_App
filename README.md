# AI Chatbot Application

A complete end-to-end full-stack AI Chatbot application with React (Vite), Node.js, Express, MongoDB, and OpenAI.

## Features
- **User Authentication**: Secure Login & Registration with JWT.
- **Chat Interface**: Modern, responsive UI inspired by ChatGPT, built with Tailwind CSS.
- **Conversations**: Save and manage past chat histories (MongoDB).
- **AI Integration**: Connects seamlessly with OpenAI API for intelligent responses.
- **Error Handling**: Graceful error handling and loading states.

## Tech Stack
- **Frontend**: React.js, Vite, Tailwind CSS, Axios, Lucide React (Icons)
- **Backend**: Node.js, Express, Mongoose, JSON Web Token (JWT), bcryptjs, OpenAI Node SDK
- **Database**: MongoDB

## Prerequisites
- Node.js (v16+)
- MongoDB server running locally or MongoDB Atlas URI
- OpenAI API Key

## Setup & Run Instructions

### 1. Database Setup
Ensure MongoDB is running locally on port 27017, or update the `MONGO_URI` in the backend `.env` file to your MongoDB Atlas connection string.

### 2. Backend Setup
1. Open a terminal and navigate to the `backend` folder.
2. Install dependencies:
   ```bash
   cd backend
   npm install
   ```
3. Create a `.env` file in the `backend` folder with the following variables:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/ai-chatbot
   JWT_SECRET=your_super_secret_jwt_key
   OPENAI_API_KEY=your_openai_api_key_here
   ```
   *(Note: The app will mock AI responses if the API key is missing or invalid).*
4. Start the backend server:
   ```bash
   npm run dev
   ```
   The server will run on `http://localhost:5000`.

### 3. Frontend Setup
1. Open a new terminal and navigate to the `frontend` folder.
2. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser and go to `http://localhost:5173`.

## Sample AI Prompts to Test
- "Can you explain how async/await works in JavaScript with examples?"
- "Write a Python script to scrape a website."
- "What are the core differences between MongoDB and PostgreSQL?"

## Deployment Recommendations
- **Backend**: Deploy on Render, Heroku, or Railway. Set environment variables on the platform.
- **Frontend**: Deploy on Vercel or Netlify. Update the `baseURL` in `src/pages/Dashboard.jsx` to your live backend URL before building.
- **Database**: Use MongoDB Atlas for a free cloud database.
"# AI_Chatbot_App" 
