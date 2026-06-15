@echo off
REM This script must be run as Administrator
echo.
echo Checking administrator privileges...
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo ERROR: This script must be run as Administrator
    echo Please right-click this file and select "Run as Administrator"
    pause
    exit /b 1
)

echo.
echo ============================================
echo  MongoDB DNS Fix - Google Public DNS
echo ============================================
echo.

REM Get network adapter index
for /f "tokens=*" %%a in ('powershell -NoProfile -Command "Get-NetAdapter | Where-Object {$_.Status -eq 'Up'} | Select-Object -First 1 -ExpandProperty InterfaceIndex"') do set ADAPTER=%%a

if not defined ADAPTER (
    echo ERROR: Could not find active network adapter
    pause
    exit /b 1
)

echo Found active adapter index: %ADAPTER%
echo.
echo Changing DNS to Google Public DNS (8.8.8.8, 8.8.4.4)...
echo.

REM Change DNS
powershell -NoProfile -Command "Set-DnsClientServerAddress -InterfaceIndex %ADAPTER% -ServerAddresses ('8.8.8.8', '8.8.4.4')"

if %errorLevel% equ 0 (
    echo.
    echo ============================================
    echo SUCCESS: DNS changed to Google Public DNS
    echo ============================================
    echo.
    echo Your server should now connect to MongoDB.
    echo Start your app with: npm start
    echo.
) else (
    echo.
    echo ERROR: Failed to change DNS settings
    echo.
)

pause
