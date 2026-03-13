require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const ExcelJS = require('exceljs');

const Player = require('./Player');
const User = require('./User');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 24 hours
}));

// Authentication middleware
const isAuthenticated = (req, res, next) => {
  if (req.session.userId) {
    return next();
  }
  res.redirect('/login');
};

// Routes

// Home page - Registration form
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Login page
app.get('/login', (req, res) => {
  res.render('login', { error: null });
});

// Login POST
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const user = await User.findOne({ username });
    if (!user) {
      return res.render('login', { error: 'Invalid username or password' });
    }
    
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.render('login', { error: 'Invalid username or password' });
    }
    
    req.session.userId = user._id;
    req.session.username = user.username;
    res.redirect('/dashboard');
  } catch (error) {
    console.error('Login error:', error);
    res.render('login', { error: 'An error occurred. Please try again.' });
  }
});

// Logout
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

// Dashboard - View all players
app.get('/dashboard', isAuthenticated, async (req, res) => {
  try {
    const players = await Player.find().sort({ registeredAt: -1 });
    res.render('dashboard', { 
      players, 
      username: req.session.username 
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).send('Error loading dashboard');
  }
});

// Export to Excel
app.get('/export-excel', isAuthenticated, async (req, res) => {
  try {
    const players = await Player.find().sort({ registeredAt: -1 });
    
    // Create a new workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Panthers Players');
    
    // Define columns
    worksheet.columns = [
      { header: 'Full Name', key: 'fullName', width: 25 },
      { header: 'Date of Birth', key: 'dateOfBirth', width: 15 },
      { header: 'Date Joined', key: 'dateJoined', width: 15 },
      { header: 'Phone Number', key: 'phoneNumber', width: 15 },
      { header: 'Identification Number', key: 'identificationNumber', width: 20 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Height (cm)', key: 'height', width: 12 },
      { header: 'Weight (kg)', key: 'weight', width: 12 },
      { header: 'Location Address', key: 'locationAddress', width: 30 },
      { header: 'Injury History', key: 'injuryHistory', width: 30 },
      { header: 'Next of Kin Name', key: 'nokName', width: 25 },
      { header: 'Next of Kin Phone', key: 'nokPhone', width: 15 },
      { header: 'Next of Kin Relationship', key: 'nokRelationship', width: 20 },
      { header: 'Residence', key: 'residence', width: 20 },
      { header: 'Occupation', key: 'occupation', width: 20 },
      { header: 'Registered At', key: 'registeredAt', width: 20 }
    ];
    
    // Style the header row
    worksheet.getRow(1).font = { bold: true, size: 12 };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4472C4' }
    };
    worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };
    
    // Add data rows
    players.forEach(player => {
      worksheet.addRow({
        fullName: player.fullName,
        dateOfBirth: player.dateOfBirth ? new Date(player.dateOfBirth).toLocaleDateString() : '',
        dateJoined: player.dateJoined ? new Date(player.dateJoined).toLocaleDateString() : '',
        phoneNumber: player.phoneNumber,
        identificationNumber: player.identificationNumber || 'N/A',
        email: player.email,
        height: player.height,
        weight: player.weight,
        locationAddress: player.locationAddress,
        injuryHistory: player.injuryHistory || 'None',
        nokName: player.nextOfKinContact?.name || '',
        nokPhone: player.nextOfKinContact?.phone || '',
        nokRelationship: player.nextOfKinContact?.relationship || '',
        residence: player.residence,
        occupation: player.occupation,
        registeredAt: player.registeredAt ? new Date(player.registeredAt).toLocaleString() : ''
      });
    });
    
    // Add borders to all cells
    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      row.eachCell({ includeEmpty: false }, (cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
    });
    
    // Generate filename with current date
    const filename = `Panthers_Players_${new Date().toISOString().split('T')[0]}.xlsx`;
    
    // Set response headers
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    // Write to response
    await workbook.xlsx.write(res);
    res.end();
    
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).send('Error exporting data');
  }
});

// Register player
app.post('/register-player', async (req, res) => {
  try {
    const playerData = {
      fullName: req.body.fullName,
      dateOfBirth: req.body.dateOfBirth,
      dateJoined: req.body.dateJoined,
      phoneNumber: req.body.phoneNumber,
      identificationNumber: req.body.identificationNumber,
      email: req.body.email,
      height: req.body.height,
      weight: req.body.weight,
      locationAddress: req.body.locationAddress,
      injuryHistory: req.body.injuryHistory,
      nextOfKinContact: {
        name: req.body.nextOfKinName,
        phone: req.body.nextOfKinPhone,
        relationship: req.body.nextOfKinRelationship
      },
      residence: req.body.residence,
      occupation: req.body.occupation
    };

    const player = new Player(playerData);
    await player.save();
    
    res.json({ 
      success: true, 
      message: 'Player registered successfully!',
      playerId: player._id 
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({ 
      success: false, 
      message: error.message || 'Error registering player' 
    });
  }
});

// Get single player (for editing)
app.get('/get-player/:id', isAuthenticated, async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) {
      return res.status(404).json({ success: false, message: 'Player not found' });
    }
    res.json({ success: true, player });
  } catch (error) {
    console.error('Get player error:', error);
    res.status(500).json({ success: false, message: 'Error fetching player' });
  }
});

// Update player - FIXED VERSION
app.put('/update-player/:id', isAuthenticated, async (req, res) => {
  try {
    const playerId = req.params.id;
    
    // Check if email is being changed and if it conflicts with another player
    const currentPlayer = await Player.findById(playerId);
    if (!currentPlayer) {
      return res.status(404).json({ success: false, message: 'Player not found' });
    }
    
    // If email is being changed, check if it's already used by another player
    if (req.body.email !== currentPlayer.email) {
      const emailExists = await Player.findOne({ 
        email: req.body.email, 
        _id: { $ne: playerId } 
      });
      
      if (emailExists) {
        return res.status(400).json({ 
          success: false, 
          message: 'This email is already used by another player' 
        });
      }
    }
    
    const updateData = {
      fullName: req.body.fullName,
      dateOfBirth: req.body.dateOfBirth,
      dateJoined: req.body.dateJoined,
      phoneNumber: req.body.phoneNumber,
      identificationNumber: req.body.identificationNumber,
      email: req.body.email,
      height: req.body.height,
      weight: req.body.weight,
      locationAddress: req.body.locationAddress,
      injuryHistory: req.body.injuryHistory || '',
      nextOfKinContact: {
        name: req.body.nextOfKinName,
        phone: req.body.nextOfKinPhone,
        relationship: req.body.nextOfKinRelationship
      },
      residence: req.body.residence,
      occupation: req.body.occupation
    };

    // Update the player
    const updatedPlayer = await Player.findByIdAndUpdate(
      playerId,
      updateData,
      { 
        new: true, 
        runValidators: true 
      }
    );

    if (!updatedPlayer) {
      return res.status(404).json({ success: false, message: 'Player not found' });
    }

    console.log('Player updated successfully:', updatedPlayer._id);
    res.json({ success: true, message: 'Player updated successfully', player: updatedPlayer });
    
  } catch (error) {
    console.error('Update error:', error);
    
    // Provide more specific error messages
    let errorMessage = 'Error updating player';
    
    if (error.name === 'ValidationError') {
      errorMessage = Object.values(error.errors).map(e => e.message).join(', ');
    } else if (error.code === 11000) {
      errorMessage = 'Email already exists in the system';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    res.status(400).json({ 
      success: false, 
      message: errorMessage
    });
  }
});

// Delete player
app.delete('/delete-player/:id', isAuthenticated, async (req, res) => {
  try {
    await Player.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Player deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ success: false, message: 'Error deleting player' });
  }
});

// Create initial admin user (run once)
app.get('/setup-admin', async (req, res) => {
  try {
    const existingUser = await User.findOne({ username: 'admin' });
    if (existingUser) {
      return res.send('Admin user already exists. Username: admin');
    }
    
    const adminUser = new User({
      username: 'admin',
      password: 'admin123', // Change this password!
      role: 'admin'
    });
    
    await adminUser.save();
    res.send('Admin user created! Username: admin, Password: admin123 (Please change this!)');
  } catch (error) {
    res.status(500).send('Error creating admin user: ' + error.message);
  }
});
// TEMPORARY - remove after use
app.get('/reset-admin', async (req, res) => {
  try {
    await User.deleteMany({});
    const adminUser = new User({
      username: 'PanthersRugby_Db',
      password: 'Panthers2024',
      role: 'admin'
    });
    await adminUser.save();
    res.send('✅ Admin reset! Username: PanthersRugby_Db | Password: Panthers2024');
  } catch (error) {
    res.status(500).send('Error: ' + error.message);
  }
});
// Start server
app.listen(PORT, () => {
  console.log(`🏉 Panthers Rugby app running on http://localhost:${PORT}`);
  console.log(`📝 Registration form: http://localhost:${PORT}`);
  console.log(`🔐 Admin login: http://localhost:${PORT}/login`);
  console.log(`⚙️  Setup admin: http://localhost:${PORT}/setup-admin (first time only)`);
});
