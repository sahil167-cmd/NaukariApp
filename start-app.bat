@echo off
echo Killing existing Node/Expo processes...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 >nul

echo Starting Expo development server...
echo.
echo Once the QR code appears:
echo 1. Open Expo Go app on your mobile
echo 2. Scan the QR code
echo 3. The app will load on your device
echo.
call npx expo start --clear
