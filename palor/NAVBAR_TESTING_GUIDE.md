# 🧪 Navbar Testing Guide

## Current Setup
I've created a simplified navbar for debugging and testing. Here's what's been set up:

### ✅ **Test User Created:**
- **Email**: `test@example.com`
- **Password**: `Password123!`
- **Name**: Test User

### ✅ **Test Page Available:**
- **URL**: `http://localhost:5174/test-login`
- **Purpose**: Quick testing of login/logout functionality

## 🔧 **How to Test the Navbar:**

### **Step 1: Visit Test Page**
1. Go to: `http://localhost:5174/test-login`
2. You'll see a simple form with pre-filled credentials

### **Step 2: Test Login**
1. Click "🔑 Test Login" button
2. **Expected Result**: 
   - Console should show login response
   - Success message should appear
   - **Navbar should immediately change** to show "Welcome, Test!" and "Logout" button

### **Step 3: Test Logout**
1. Click "🚪 Test Logout" button
2. **Expected Result**:
   - Success message should appear
   - **Navbar should immediately change** back to show "Login" and "Register" links

### **Step 4: Check Storage**
1. Click "🔍 Check Storage" to see what's stored
2. This helps debug if tokens are being saved correctly

## 🔍 **What to Look For:**

### **When NOT Logged In:**
```
Navbar: Home | Services | Login | Register
```

### **When Logged In:**
```
Navbar: Home | Services | My Appointments | Welcome, Test! | Logout
```

## 🐛 **Common Issues & Solutions:**

### **Issue 1: Navbar Not Updating**
- **Check Console**: Look for "Navbar: Checking auth status..." logs
- **Check Storage**: Use the "Check Storage" button
- **Try Refresh**: Hard refresh the page

### **Issue 2: Login Fails**
- **Check Backend**: Make sure backend is running on port 8000
- **Check Credentials**: Email: `test@example.com`, Password: `Password123!`
- **Check Network Tab**: Look for 200 response from login API

### **Issue 3: Token Not Saved**
- **Check Browser**: Some browsers block localStorage in certain modes
- **Check Console**: Look for JavaScript errors
- **Try Incognito**: Test in private/incognito mode

## 📱 **Mobile Testing:**
1. Resize browser to mobile size
2. Click hamburger menu (☰)
3. Check if user profile appears in mobile menu

## 🔧 **Debugging Commands:**

### **In Browser Console:**
```javascript
// Check if user is stored
console.log('Token:', localStorage.getItem('token'));
console.log('User:', JSON.parse(localStorage.getItem('user') || '{}'));

// Manually trigger navbar update
window.dispatchEvent(new Event('storage'));
```

### **Backend API Test:**
```bash
# Test login API directly
curl -X POST http://localhost:8000/api/v1/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Password123!"}'
```

## 🎯 **Expected Behavior:**

1. **Initial Load**: Navbar shows "Login/Register"
2. **After Login**: Navbar immediately shows "Welcome, Test!" and "Logout"
3. **After Logout**: Navbar immediately returns to "Login/Register"
4. **Page Refresh**: Maintains login state if user was logged in

## 🚨 **If Still Not Working:**

### **Check These:**
1. **Both servers running**: Backend (8000) and Frontend (5174)
2. **No console errors**: Check browser developer tools
3. **API responses**: Check network tab for successful login
4. **localStorage**: Check if tokens are being saved

### **Try This:**
1. Clear all browser data (localStorage, cookies)
2. Hard refresh (Cmd/Ctrl + Shift + R)
3. Test with different browser
4. Check if running in incognito mode affects it

## 📍 **Current Status:**
- ✅ Backend API working (login/logout tested)
- ✅ Test user created successfully
- ✅ Simplified navbar with debugging
- ✅ Test page available at `/test-login`

**Go to `http://localhost:5174/test-login` and test the functionality!**

If it's still not working, let me know what specific error messages or behavior you're seeing.