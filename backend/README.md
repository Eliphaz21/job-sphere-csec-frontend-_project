# JobSphere Backend API

A secure, high-performance backend server built with Node.js and Express.js to power the JobSphere platform. The backend manages all data storage, handles user authentication, and serves RESTful API endpoints for jobs and applications.

## Features

**Secure Authentication** 
Complete user registration and login system protected with JSON Web Tokens and bcrypt hashed passwords.

**Database Architecture** 
Fully modeled MongoDB database using Mongoose for managing users, job postings, and job applications.

**RESTful API** 
Clean and organized routing system to handle processing requests between the database and the frontend user interface.

**Validation and Error Handling** 
Protected routes and middleware ensuring that only authorized users can access sensitive profile information and apply to jobs.

## Technologies Used

**Core Server:** Node.js, Express.js
**Database Management:** MongoDB, Mongoose
**Security:** JWT, bcryptjs
**Configuration:** dotenv, cors

## Folder Structure

**server.js** 
The main entry point that starts the server and connects all core configurations.

**seed.js** 
A utility script to populate the database with initial dummy data for testing.

**.env** 
Stores hidden environment variables like database passwords and port numbers.

**config/** 
Handles the direct connection script (db.js) to connect to the MongoDB database.

**controllers/** 
Holds the main business logic and functions for handling authentication, jobs, and applications.

**models/** 
Defines the exact database schemas for User, Job, and Application items.

**routes/** 
Connects specific URL path requests from the frontend to the correct controller functions.

**middleware/** 
Contains security checks to verify user tokens before allowing access to private sections.

**utils/** 
Holds reusable helper functions like generating authentication keys.

## Getting Started

Follow these simple steps to run the backend server locally on your machine.

### 1. Clone the project
```bash
# Clone the repository (Replace YOUR-USERNAME with your actual GitHub username)
git clone https://github.com/YOUR-USERNAME/job-sphere.git

# Navigate into the backend project directory
cd job-sphere/backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup environment variables
Create a `.env` file in the backend folder and add your specific configurations:
```env
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

### 4. Start the development server
```bash
npm start
```

