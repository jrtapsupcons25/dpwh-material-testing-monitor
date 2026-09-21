# 🚀 DPWH Admin Panel - QUICK START (5 Minutes)

## Option 1: Run Locally (FASTEST)

### Step 1: Copy Files to Your React Project
```bash
cd C:\Users\Asus\Documents\dpwh-material-testing\src

# Copy the latest admin panel
cp DPWH_Admin_Panel_V2.jsx ./DPWH_Admin_Panel.jsx
```

### Step 2: Update App.js
Replace the contents of `src/App.js` with:

```javascript
import React from 'react';
import DPWHAdminPanel from './DPWH_Admin_Panel';

function App() {
  return <DPWHAdminPanel />;
}

export default App;
```

### Step 3: Start the Server
```bash
npm start
```

### Step 4: Login
Open browser: **http://localhost:3000**

```
Username: admin
Password: admin123
```

✅ **DONE! Admin panel is running!**

---

## Option 2: Deploy to Vercel (LIVE URL)

### Prerequisites
- GitHub account (free)
- Your React repo pushed to GitHub

### Step 1: Push to GitHub
```bash
cd C:\Users\Asus\Documents\dpwh-material-testing

git add .
git commit -m "Add Admin Panel V2"
git push
```

### Step 2: Deploy on Vercel
1. Go to: https://vercel.com/new
2. Click "Import Git Repository"
3. Select your `dpwh-material-testing` repo
4. Click "Deploy"
5. Wait 1-2 minutes...

### Step 3: Get Your Live URL
Vercel shows you a URL like:
```
https://dpwh-material-testing-xyz.vercel.app
```

**Share this link with your team!**

✅ **Your admin panel is now LIVE!**

---

## 🎯 What You Get

| Feature | Status |
|---------|--------|
| 👥 User Management | ✅ Create/Delete/Edit Roles |
| 📁 Project Management | ✅ Create/Delete Projects |
| 🧪 Material Testing Tracker | ✅ View All Tests |
| 💳 Payment Tracking | ✅ Monitor Payments |
| 🔐 Admin Login | ✅ Secure Access |
| 📊 Real-time Dashboard | ✅ Live Stats |
| 🎨 Professional UI | ✅ DPWH Branding |

---

## 🎓 Admin Functions

### Create a User
1. Click **"👥 Users"** → **"+ Add New User"**
2. Fill in:
   - Email: `juan@dpwh.gov.ph`
   - Username: `juan`
   - Password: `secure123`
   - Full Name: `Juan Dela Cruz`
   - Role: `PIC` (or ADMIN, ME, VIEWER)
3. Click **"✓ Create User"**

### Create a Project
1. Click **"📁 Projects"** → **"+ Add New Project"**
2. Fill in required fields (marked with *)
3. Click **"✓ Create Project"**
4. Project appears instantly!

### Change User Role
1. Go to **"👥 Users"**
2. Click the role dropdown next to any user
3. Select new role: ADMIN, PIC, ME, or VIEWER
4. **Saved automatically!**

### Delete User/Project
1. Click the **"Delete"** button
2. Confirm deletion
3. **Done!**

---

## ⚙️ Important Settings

### Admin Password
- **Username:** `admin`
- **Password:** `admin123`
- ⚠️ Change this in production!

### Roles
- **ADMIN**: Full control (you currently have this)
- **PIC**: Project In Charge (oversees specific projects)
- **ME**: Material Engineer (enters test results)
- **VIEWER**: Read-only access

### Database Location
- Project: `dpwh-material-testing`
- Region: Singapore (`ap-southeast-1`)
- Tables: users, projects, material_tests, test_results, test_payments

---

## 🐛 Troubleshooting

**"Cannot login"**
- Username must be: `admin` (lowercase)
- Password must be: `admin123` (no spaces)

**"Blank page"**
- Check browser console (F12)
- Check Supabase connection in component

**"Cannot create user"**
- Fill all required fields (*)
- Close browser console errors (F12)

**"Local server won't start"**
```bash
# Kill any process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Try again
npm start
```

---

## 📱 Access from Anywhere

### Local Network (Same WiFi)
Get your computer's IP:
```bash
ipconfig
```

Then access from phone:
```
http://192.168.1.XXX:3000
```

### Mobile App
Once deployed to Vercel, access from mobile browser:
```
https://dpwh-material-testing-xyz.vercel.app
```

---

## 🚀 Next Steps

1. ✅ **Get it running** (local or Vercel)
2. ✅ **Test all features** (create users, projects)
3. ✅ **Share the URL** with your DPWH team
4. ⏭️ **Add material test entry form**
5. ⏭️ **Add payment entry forms**
6. ⏭️ **Set up notifications**
7. ⏭️ **Create reports**

---

## 📞 Support

**Having issues?**

1. Check browser console: **F12**
2. Check Supabase status
3. Verify admin credentials
4. Restart your dev server

---

## 🎉 You're Ready!

The Admin Panel is production-ready. Choose your deployment method above and get started!

**Questions?** Check `ADMIN_PANEL_SETUP.md` for more details.
