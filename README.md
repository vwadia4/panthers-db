# 🏉 Panthers Rugby Player Registration System

A complete web application for registering and managing rugby players with secure admin login and database storage.

## Features

✅ **Player Registration Form** with all required fields:
- Personal Information (name, DOB, contact details)
- Physical Information (height, weight, injury history)
- Location Information (address, residence)
- Next of Kin Contact
- Occupation

✅ **Admin Dashboard** with:
- View all registered players
- Search functionality
- Detailed player information
- Delete players
- Player statistics

✅ **Secure Authentication**:
- Admin login system
- Password hashing with bcrypt
- Session management

✅ **Database Storage**:
- MongoDB for persistent data storage
- All player information safely stored

## Prerequisites

Before you begin, make sure you have installed:
- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (running locally or use MongoDB Atlas)

## Installation

### 1. Navigate to Project Directory
```bash
cd "C:\Users\ansiz\OneDrive\Dokumente\Workspace\intro-html\Panthers Rugby"
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup MongoDB

**Option A: Local MongoDB**
- Install MongoDB on your computer
- Make sure MongoDB is running (usually on `mongodb://localhost:27017`)

**Option B: MongoDB Atlas (Cloud)**
- Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Create a cluster and get your connection string
- Update the `.env` file with your connection string

### 4. Configure Environment Variables

The `.env` file is already created. If you need to change MongoDB connection:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/panthers_rugby
SESSION_SECRET=panthers_rugby_secret_key_change_in_production
```

### 5. Create Admin User

Start the server first:
```bash
npm start
```

Then visit: `http://localhost:3000/setup-admin`

This creates the default admin account:
- **Username:** `admin`
- **Password:** `admin123`

⚠️ **IMPORTANT:** Change this password after first login!

## Running the Application

### Development Mode (with auto-restart):
```bash
npm run dev
```

### Production Mode:
```bash
npm start
```

The application will be available at: `http://localhost:3000`

## Using the Application

### For Players (Registration):
1. Go to `http://localhost:3000`
2. Fill out the registration form
3. Click "Register Player"
4. You'll see a success message

### For Admins (Management):
1. Go to `http://localhost:3000/login`
2. Login with username and password
3. View dashboard with all registered players
4. Search, view details, or delete players

## Project Structure

```
PanthersRugby/
├── node_modules/          # Dependencies (auto-generated)
├── public/
│   └── index.html        # Player registration form
├── views/
│   ├── login.ejs         # Admin login page
│   └── dashboard.ejs     # Admin dashboard
├── app.js                # Main server file
├── Player.js             # Player database model
├── User.js               # User/admin database model
├── package.json          # Project dependencies
├── .env                  # Environment variables
├── .gitignore           # Git ignore file
└── README.md            # This file
```

## API Endpoints

### Public Routes:
- `GET /` - Registration form
- `POST /register-player` - Submit player registration
- `GET /login` - Admin login page
- `POST /login` - Process admin login

### Protected Routes (require login):
- `GET /dashboard` - View all players
- `DELETE /delete-player/:id` - Delete a player
- `GET /logout` - Logout

### Setup Route:
- `GET /setup-admin` - Create initial admin user (one-time use)

## Security Features

- Passwords are hashed using bcrypt
- Session-based authentication
- Protected admin routes
- Input validation on forms
- Secure database queries

## Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Make sure MongoDB is running on your computer

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::3000
```
**Solution:** Change the PORT in `.env` file or stop the process using port 3000

### Module Not Found Error
```
Error: Cannot find module 'express'
```
**Solution:** Run `npm install` again

## Future Enhancements

- [ ] Edit player information
- [ ] Export player data to Excel/CSV
- [ ] Email notifications
- [ ] Player photos upload
- [ ] Team assignment
- [ ] Match scheduling
- [ ] Performance tracking

## Support

For issues or questions, please contact the development team.

## License

This project is private and proprietary to Panthers Rugby Club.

---

**Built with ❤️ for Panthers Rugby Club**
