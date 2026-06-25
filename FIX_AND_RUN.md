# Quick Fix & Run Guide

## The Error You Saw

**Error:** `Uncaught Error: java.io.IOException: Failed to download remote update`

**Cause:** Expo was trying to fetch updates from a server, but we're in development mode.

**Status:** ✅ **FIXED!**

## What Was Fixed

1. ✅ Removed duplicate `updates` configuration in `app.json`
2. ✅ Disabled Expo Updates completely:
   ```json
   "updates": {
     "enabled": false,
     "fallbackToCacheTimeout": 0,
     "checkAutomatically": "never"
   }
   ```
3. ✅ Fixed AppNavigator to properly handle authentication flow
4. ✅ Cleared Expo cache

## How to Run NOW

### Method 1: Using Batch File (Easiest)

**Double-click:** `start-app.bat`

This will:
- Kill any existing processes
- Clear cache automatically
- Start Expo server
- Show QR code

### Method 2: Manual Commands

**Step 1: Open Terminal/CMD in project folder**

**Step 2: Start Expo:**
```bash
npx expo start --clear
```

**Step 3: Wait for QR Code**

You'll see something like:
```
▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
█ ▄▄▄▄▄ █ QR CODE █
█ █   █ █  HERE   █
▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄

› Metro waiting on exp://192.168.x.x:8081
```

### Method 3: Tunnel Mode (If Same WiFi Doesn't Work)

```bash
npx expo start --tunnel
```

This uses Expo's servers and works even if you're on different networks.

## Scan QR Code with Expo Go

1. **Open Expo Go** app on your Android phone
2. **Tap "Scan QR code"**
3. **Point camera** at the QR code in terminal
4. **Wait** for bundle to load (1-2 minutes first time)

## What You Should See

### ✅ Success Flow:

1. **Splash Screen** (2.5 seconds)
   - RecruitIndia logo
   - "FINDING THE BEST ROLES" text
   - Progress bar animation

2. **Language Selection Screen**
   - 11 language options
   - English, Hindi, Marathi, etc.

3. **Welcome Screen**
   - "Finding the right work for you" message
   - REGISTER and LOGIN buttons

4. **Login Flow**
   - Phone number input
   - OTP verification
   - Registration wizard (6 steps)

5. **Main App**
   - Dashboard with profile completion
   - Bottom navigation (Home, Support, Profile, Settings)

## Troubleshooting

### Still Getting Update Error?

**Solution 1: Clear Everything**
```bash
# Kill all Node processes
taskkill /F /IM node.exe

# Clear all caches
npx expo start --clear

# If that doesn't work, also clear npm cache
npm cache clean --force
```

**Solution 2: Check app.json**

Make sure `app.json` has:
```json
"updates": {
  "enabled": false,
  "fallbackToCacheTimeout": 0,
  "checkAutomatically": "never"
}
```

**Solution 3: Delete and Reinstall Expo Go**
1. Uninstall Expo Go from your phone
2. Reinstall from Play Store
3. Clear cache in Expo Go settings
4. Re-scan QR code

### "Unable to connect to development server"

**Check:**
- ✅ Phone and computer on **same WiFi**
- ✅ Windows Firewall allows Node.js
- ✅ Expo server is running (don't close terminal)

**Quick Fix:**
```bash
npx expo start --tunnel
```

### "Port already in use"

**Solution:**
```bash
# Windows
taskkill /F /IM node.exe

# Then restart
npx expo start --clear
```

### QR Code Not Scanning

**Alternative:**
1. In Expo Go, tap "Enter URL manually"
2. Copy URL from terminal (e.g., `exp://192.168.1.5:8081`)
3. Paste and connect

## Verifying the Fix

Once the app loads, you should **NOT** see:
- ❌ "Failed to download remote update"
- ❌ Java IOException errors
- ❌ Update-related errors

You **SHOULD** see:
- ✅ Smooth splash screen animation
- ✅ Language selection screen
- ✅ Functional navigation
- ✅ No error messages

## Development Tips

### Hot Reload

After the app loads once:
- Edit any file and save
- App automatically reloads
- No need to re-scan QR code

### Viewing Logs

Watch the terminal for:
- Console.log output
- Errors and warnings
- Network requests

### Reloading App

**On Phone:**
- Shake device
- Tap "Reload"

**In Terminal:**
- Press `r`

## Next Steps

1. ✅ Test language switching
2. ✅ Test login flow with any 10-digit phone number
3. ✅ Enter any 6-digit OTP (mock API accepts anything)
4. ✅ Complete registration wizard
5. ✅ Explore main app features
6. ✅ Test theme switching (Light/Dark)

## Common Questions

**Q: Do I need to rebuild after code changes?**
A: No! Hot reload handles most changes automatically.

**Q: Why is first load slow?**
A: Expo bundles JavaScript on first load. Subsequent loads are instant.

**Q: Can I test on multiple phones?**
A: Yes! Scan the same QR code on multiple devices.

**Q: How do I stop the server?**
A: Press `Ctrl+C` in the terminal.

## Still Having Issues?

If the error persists:

1. **Check:** Make sure you saved all files after the fixes
2. **Restart:** Close terminal completely and reopen
3. **Clear:** Delete `.expo` folder and restart
4. **Nuclear option:** 
   ```bash
   rm -rf node_modules
   npm install
   npx expo start --clear
   ```

---

## 🎉 You're Ready!

The error is fixed. Just run the app and scan the QR code!

**Command:**
```bash
npx expo start --clear
```

Or double-click: **`start-app.bat`**

---

**Need help?** Check `EXPO_GO_GUIDE.md` for detailed troubleshooting.
