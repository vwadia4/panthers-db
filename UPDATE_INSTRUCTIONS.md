# Panthers Rugby App - Update Instructions

## What's New in This Update? ✨

### 1. **Excel Export Functionality** 📊
- Export all player data to Excel with one click
- Professional formatting with styled headers
- All player information included in the spreadsheet
- File automatically downloads with date in filename

### 2. **Identification Number Field** 🆔
- New required field for National ID or Passport Number
- Added to registration form
- Stored in database
- Visible in player details and Excel export

### 3. **Panthers Logo Support** 🏉
- Logo display on registration form
- Logo display on admin login page
- Automatically hides if logo file is not found

---

## Installation Steps

### Step 1: Install New Dependency

Open your command prompt in the project folder and run:

```bash
npm install exceljs
```

This installs the Excel library needed for the export feature.

### Step 2: Replace Files

Replace the following files in your project with the new versions:

1. **app.js** - Updated with Excel export endpoint
2. **package.json** - Added exceljs dependency
3. **public/index.html** - Updated registration form with ID field and logo
4. **views/login.ejs** - Updated login page with logo
5. **views/dashboard.ejs** - Added Export to Excel button

### Step 3: Add Your Logo (Optional)

1. Get your Panthers Rugby logo image (PNG or JPG format)
2. Rename it to `logo.png`
3. Place it in the `public` folder
4. If you don't have a logo, the app will work fine without it

### Step 4: Update Database Model (If Starting Fresh)

The Player.js model already has the identificationNumber field, so you don't need to change anything. New registrations will automatically include this field.

For existing players in your database, the identification number will show as "N/A" in the dashboard and Excel export until they're updated.

---

## How to Use the New Features

### Excel Export:

1. Login to admin dashboard
2. Click the green "📊 Export to Excel" button at the top
3. The file will automatically download with the current date
4. Open in Microsoft Excel, Google Sheets, or LibreOffice

The Excel file includes:
- All player information
- Professional formatting
- Color-coded headers
- Borders on all cells
- Auto-sized columns

### Identification Number:

Players will now be required to enter their:
- National ID Number
- Passport Number
- Or other identification

This field is **required** for new registrations.

---

## File Structure After Update

```
PanthersRugby/
├── node_modules/
├── public/
│   ├── index.html          ← UPDATED (ID field + logo)
│   └── logo.png            ← NEW (add your logo here)
├── views/
│   ├── login.ejs           ← UPDATED (logo added)
│   └── dashboard.ejs       ← UPDATED (export button)
├── app.js                  ← UPDATED (export endpoint)
├── Player.js               (no changes needed)
├── User.js                 (no changes needed)
├── package.json            ← UPDATED (exceljs added)
├── .env                    (no changes needed)
└── README.md

```

---

## Testing the Updates

### Test Excel Export:
1. Login to admin dashboard
2. Make sure you have at least one player registered
3. Click "Export to Excel"
4. Verify the file downloads and opens correctly

### Test Identification Field:
1. Go to registration form
2. Try to submit without ID number - should show error
3. Fill in ID number and submit - should work

### Test Logo:
1. Add logo.png to public folder
2. Refresh registration page
3. Logo should appear at top
4. Refresh login page
5. Logo should appear there too

---

## Troubleshooting

### Issue: "Cannot find module 'exceljs'"
**Solution:** Run `npm install exceljs` in your project folder

### Issue: Excel export button doesn't work
**Solution:** Make sure you restarted the server after updating app.js

### Issue: Logo doesn't show
**Solution:** 
- Check that logo.png is in the public folder
- Check the filename is exactly "logo.png"
- Check the file format (PNG, JPG, or JPEG)
- The app works fine without a logo, it will just not display

### Issue: Identification number field missing
**Solution:** Make sure you replaced the index.html file in the public folder

---

## Need Help?

If you encounter any issues:

1. Make sure all files are replaced correctly
2. Run `npm install` to ensure all dependencies are installed
3. Restart the server (Ctrl+C then `npm start`)
4. Check the console for any error messages

---

## Future Enhancements Roadmap

- [ ] Edit player information
- [ ] Player photos upload
- [ ] Team assignment feature
- [ ] Match scheduling
- [ ] Performance tracking
- [ ] Email notifications
- [ ] Multi-language support

---

**Built with ❤️ for Panthers Rugby Club**

Last Updated: February 2026
