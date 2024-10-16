# **Aptos Price Alert Bot**
A simple desktop application that tracks the price of Aptos (APT) and sends system tray notifications when certain thresholds are met. This bot runs in the background on Windows, and can be paused/resumed from the system tray.

------------

### Features
Fetches Aptos price from the CoinGecko API.
Sends desktop notifications with price alerts.
Can be paused and resumed via the system tray menu.
Packaged as a .exe for Windows.
### Prerequisites
Node.js (version 14 or higher) and npm installed.
Electron for building the desktop app.
Electron-packager and electron-builder for packaging the app into a .exe file.

#### 1. Clone the repository
```bash
git clone https://github.com/Cryptain-Harlock/APT_Price_Alert_Bot.git
cd aptos-price-alert-bot
```

#### 2. Install Dependencies
Install the required dependencies:
`npm install`

#### 3. Run the App in Development Mode
Start the Electron app in development mode to see it in action:
`npm run start`

#### 5. Build and Package for Production
To package the app as a .exe for Windows:
```bash
npx tsc
npm run package-win
```
This will generate a production-ready executable in the dist/ folder.

------------


#### How It Works
**System Tray Icon:** When the app is launched, an icon appears in the system tray.
**Notifications:** The app fetches the latest Aptos price every minute from CoinGecko and sends notifications when price thresholds are crossed.
**Pause/Resume:** You can pause and resume price monitoring through the system tray menu.
**Quit:** The app can be closed via the system tray.

#### Key Files
`src/main.js` Contains the core logic for the Electron app, including price fetching and system tray management.
`aptos.png`: The icon used in notifications and the system tray.
Configuration
The app fetches the Aptos price from the CoinGecko API by default. You can modify the API or add additional functionality (e.g., custom price thresholds) in the src/main.js file.
