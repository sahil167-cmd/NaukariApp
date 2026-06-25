# Running WorkerConnect on Your Mobile with Expo Go

## Prerequisites

1. **Install Expo Go on Your Mobile Device**
   - Android: [Download from Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - Make sure your phone and computer are on the **same WiFi network**

## Steps to Run on Mobile

### Step 1: Start the Development Server

**Windows (Double-click):**
```
start-app.bat
```

**Or manually in terminal:**
```bash
npx expo start --clear
```

### Step 2: Wait for QR Code

The terminal will display:
- A QR code
- A URL like: `exp://192.168.x.x:8081`
- Connection options

### Step 3: Scan QR Code

1. Open **Expo Go** app on your phone
2. Tap **Scan QR Code**
3. Point camera at the QR code in terminal
4. Wait for the app to load (first time may take 1-2 minutes)

### Step 4: App Should Load

You should see:
1. Splash screen with RecruitIndia logo
2. Language selection screen
3. Full app functionality

## Troubleshooting

### Error: "Failed to download remote update"

**Solution:**
1. Stop the Expo server (Ctrl+C)
2. Run: `npx expo start --clear`
3. Re-scan QR code in Expo Go

### Error: "Unable to connect to development server"

**Causes:**
- Phone and computer not on same WiFi
- Firewall blocking connection
- Wrong network selected

**Solutions:**

**Option 1: Use Tunnel Mode**
```bash
npx expo start --tunnel
```
This uses Expo's servers to route traffic (slower but works anywhere).

**Option 2: Check Firewall**
1. Go to Windows Firewall settings
2. Allow Node.js through firewall
3. Restart Expo server

**Option 3: Use LAN Mode Explicitly**
```bash
npx expo start --lan
```

### App Crashes on Load

**Check these:**
1. Make sure you ran `npm install` first
2. Clear Expo Go cache: Settings > Clear cache in Expo Go app
3. Restart development server with `--clear` flag

### QR Code Not Scanning

**Alternative Method:**
1. In Expo Go, tap "Enter URL manually"
2. Type the URL shown in terminal (e.g., `exp://192.168.1.5:8081`)
3. Tap "Connect"

## Development Workflow

### Making Changes

1. Edit code in your IDE
2. Save the file
3. App will **automatically reload** on your phone (Hot Reload)
4. No need to re-scan QR code

### Reloading Manually

**On Phone:**
- Shake your device
- Tap "Reload" in the menu

**Or in Terminal:**
- Press `r` to reload

### Opening Developer Menu

**On Phone:**
- Shake your device
- Menu will appear with options:
  - Reload
  - Debug Remote JS
  - Show Performance Monitor
  - Show Element Inspector

## Connection Modes Explained

### 1. LAN (Default - Recommended)
- **Fastest**
- Requires same WiFi network
- Best for development

### 2. Tunnel
- **Works anywhere** (different networks)
- Uses Expo servers
- Slower but more reliable

### 3. Localhost
- Only works on emulator
- Not for physical devices

## Tips for Best Experience

1. **Keep Terminal Open**
   - Don't close the terminal while developing
   - You'll see logs and errors here

2. **Check Logs**
   - Terminal shows real-time logs
   - Errors appear here first

3. **Use WiFi, Not Mobile Data**
   - Development server requires WiFi
   - Both devices on same network

4. **Battery Optimization**
   - Development can drain battery quickly
   - Keep phone charged while testing

## Network Configuration

If you're having connection issues, here's how to find your IP:

**On Windows:**
```bash
ipconfig
```
Look for "IPv4 Address" under your active network adapter.

**On Mac/Linux:**
```bash
ifconfig
```
Look for "inet" address.

The Expo server will automatically detect and use this IP.

## Common Terminal Messages

### ✅ Good Messages

```
Starting Metro Bundler
Metro waiting on exp://192.168.1.5:8081
Logs for your project will appear below

› Press a │ open Android
› Press w │ open web

› Press r │ reload app
› Press m │ toggle menu
› Press ? │ show all commands
```

### ⚠️ Warning Messages (Usually OK)

```
3 packages may need updating
```
This is informational, app will still work.

### ❌ Error Messages

```
EADDRINUSE: address already in use
```
**Fix:** Kill existing process and restart

```
Unable to resolve module
```
**Fix:** Run `npm install` and restart

## Running on Multiple Devices

You can connect multiple phones to the same development server:
1. Scan QR code on first device
2. Scan same QR code on second device
3. Changes will update on all devices

## Stopping the Server

**In Terminal:**
- Press `Ctrl + C`
- Confirm with `Y` if prompted

**Note:** App will stop working on phone when server stops.

## Next Steps After Setup

Once your app is running:

1. **Test all screens:**
   - Language selection
   - Welcome screen
   - Login flow
   - Registration wizard
   - Dashboard
   - Profile, Settings, Support

2. **Test features:**
   - Theme toggle (Light/Dark)
   - Language switching
   - Form validation
   - Navigation

3. **Check on different screens sizes:**
   - Small phones
   - Large phones
   - Tablets (if needed)

## Getting Help

If you encounter issues:

1. Check terminal logs for errors
2. Check Expo Go app logs
3. Try clearing cache and restarting
4. Ensure dependencies are installed (`npm install`)

---

**You're all set! Scan that QR code and see your app come to life! 📱✨**
