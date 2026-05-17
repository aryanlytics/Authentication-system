# Authentication System Backend

A complete Node.js/Express authentication system with MongoDB, JWT, and CORS support.

## Project Structure

```
authentication-system/
├── src/
│   ├── config/           # Configuration files
│   │   ├── database.js   # MongoDB connection
│   │   └── jwt.js        # JWT configuration
│   ├── controllers/      # Request handlers
│   │   └── authController.js
│   ├── middleware/       # Express middleware
│   │   ├── auth.js       # JWT authentication
│   │   └── errorHandler.js
│   ├── models/           # MongoDB schemas
│   │   └── User.js
│   ├── routes/           # API routes
│   │   └── auth.js
│   ├── utils/            # Utility functions
│   │   └── validators.js
│   └── server.js         # Express app setup
├── public/               # Static files
├── .env                  # Environment variables
├── .gitignore           # Git ignore file
├── package.json         # Dependencies
├── index.js            # Entry point
└── README.md           # This file
```

## Features

- User Registration
- User Login with JWT
- Protected Routes
- Password Hashing with bcrypt
- CORS Support
- Error Handling
- Environment Variables

## Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file and configure:

   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/auth-system
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=7d
   NODE_ENV=development
   ```

4. Make sure MongoDB is running

## Running the Server

```bash
node index.js
```

Server will start on `http://localhost:5000`

## API Endpoints

### Register User

- **POST** `/api/auth/register`
- Body: `{ name, email, password }`

### Login User

- **POST** `/api/auth/login`
- Body: `{ email, password }`

### Get Current User (Protected)

- **GET** `/api/auth/me`
- Headers: `Authorization: Bearer <token>`

## Dependencies

- **express** - Web framework
- **mongoose** - MongoDB ODM
- **jsonwebtoken** - JWT authentication
- **cors** - CORS middleware
- **bcryptjs** - Password hashing
- **dotenv** - Environment variables

## Development

To add new features:

1. Create models in `src/models/`
2. Create controllers in `src/controllers/`
3. Create routes in `src/routes/`
4. Import routes in `src/server.js`

## Error Handling

Errors are caught and handled by the `errorHandler` middleware with appropriate status codes and messages.

## Security Note

Always change the JWT_SECRET in production and use a secure MongoDB connection string.
