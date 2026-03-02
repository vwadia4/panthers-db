# QUICK SETUP GUIDE - Panthers Rugby App

## Step-by-Step Setup Instructions

### STEP 1: Install MongoDB (if not already installed)

Download and install MongoDB Community Server:
https://www.mongodb.com/try/download/community

After installation, MongoDB should start automatically.

### STEP 2: Open Command Prompt

1. Press Windows Key + R
2. Type: cmd
3. Press Enter

### STEP 3: Navigate to Project Folder

Copy and paste this command (update the path if different):
```
cd "C:\Users\ansiz\OneDrive\Dokumente\Workspace\intro-html\Panthers Rugby"
```

### STEP 4: Install Dependencies

Type this command:
```
npm install
```

Wait for it to finish (may take 2-3 minutes)

### STEP 5: Start the Application

Type this command:
```
npm start
```

You should see:
"🏉 Panthers Rugby app running on http://localhost:3000"

### STEP 6: Create Admin Account

1. Open your browser
2. Go to: http://localhost:3000/setup-admin
3. You'll see: "Admin user created!"

Default login:
- Username: admin
- Password: admin123

### STEP 7: Test the Application

Registration Form: http://localhost:3000
Admin Login: http://localhost:3000/login

---

## Common Issues & Solutions

### Issue 1: "MongoDB connection error"
**Solution:** Make sure MongoDB is installed and running

To start MongoDB manually:
- Open Services (press Windows + R, type: services.msc)
- Find "MongoDB Server"
- Right-click and select "Start"

### Issue 2: "Cannot find module"
**Solution:** Run this command again:
```
npm install
```

### Issue 3: "Port 3000 already in use"
**Solution:** 
1. Press Ctrl + C in the command prompt to stop
2. Edit .env file and change PORT=3000 to PORT=3001
3. Run npm start again

---

## Stopping the Application

Press: Ctrl + C in the command prompt

---

## Need Help?

Check the README.md file for more detailed information.
