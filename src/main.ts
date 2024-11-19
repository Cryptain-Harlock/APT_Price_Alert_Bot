import { app, Tray, Menu } from "electron";
import axios from "axios";
import notifier from "node-notifier";
import path from "path";

let tray: Tray | null = null;
let intervalId: NodeJS.Timeout | null = null;
let isPaused = false; // Tracks whether the bot is paused or running

// Get the correct path to the icon, based on whether the app is in production or development
const iconPath = app.isPackaged
  ? path.join(process.resourcesPath, "aptos.png") // This will work after packaging
  : path.join(__dirname, "../aptos.png"); // This works during development
// const iconPath = path.join(
//   app.isPackaged ? process.resourcesPath : __dirname,
//   "aptos.png"
// );

// Function to fetch Aptos price and send Windows notification
async function fetchAptosPriceAndNotify(): Promise<void> {
  if (isPaused) return; // Skip if the bot is paused

  try {
    const response = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price?ids=aptos&vs_currencies=usd"
    );

    const aptosPrice = response.data.aptos.usd;
    const timestamp = new Date().toLocaleTimeString();

    console.log(`[${timestamp}] Aptos Price: $ ${aptosPrice}`);

    // Send Windows notification
    notifier.notify({
      title: `🚨 Alert`,
      message: `${aptosPrice}`,
      sound: true,
      icon: iconPath, // Use the correct icon path
      wait: true,
      urgency: "critical",
      timeout: false,
    });
  } catch (error) {
    console.error("Error fetching Aptos price:", error);
  }
}

// Function to start price alert bot
function startPriceAlertBot(): void {
  console.log("Aptos price alert bot started.");
  fetchAptosPriceAndNotify();
  intervalId = setInterval(fetchAptosPriceAndNotify, 60 * 1000);
}

// Function to pause price alert bot
function pausePriceAlertBot(): void {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
    console.log("Aptos price alert bot paused.");
  }
}

// Function to resume price alert bot
function resumePriceAlertBot(): void {
  if (!intervalId) {
    startPriceAlertBot();
    console.log("Aptos price alert bot resumed.");
  }
}

// Function to create the system tray icon with Pause/Resume functionality
function createTray() {
  tray = new Tray(iconPath); // Use the correct icon path
  updateTrayMenu(); // Update the tray menu when the app starts
}

function updateTrayMenu() {
  const contextMenu = Menu.buildFromTemplate([
    {
      label: isPaused ? "Resume" : "Pause", // Toggle label based on current state
      click: () => {
        if (isPaused) {
          resumePriceAlertBot();
        } else {
          pausePriceAlertBot();
        }
        isPaused = !isPaused;
        updateTrayMenu(); // Update the menu after the click
      },
    },
    {
      label: "Quit",
      click: () => {
        app.quit(); // Quit the app from the tray menu
      },
    },
  ]);

  tray?.setToolTip("Aptos Price Alert Bot");
  tray?.setContextMenu(contextMenu);
}

// Start the Electron app
app.whenReady().then(() => {
  if (process.platform === "win32") {
    app.setAppUserModelId(app.name); // Ensures the app shows in the notification area on Windows
  }
  startPriceAlertBot();
  createTray(); // Create the system tray icon when the app is ready

  // Handle app activation (for macOS, etc.)
  app.on("activate", () => {
    if (tray === null) {
      createTray();
    }
  });
});

// Quit app when all windows are closed (except on macOS)
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
