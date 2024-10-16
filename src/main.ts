import { app } from "electron";
import axios from "axios";
import notifier from "node-notifier";
import path from "path";

// Function to fetch Aptos price and send Windows notification
async function fetchAptosPriceAndNotify(): Promise<void> {
  try {
    const response = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price?ids=aptos&vs_currencies=usd"
    );

    const aptosPrice = response.data.aptos.usd;
    const timestamp = new Date().toLocaleTimeString();

    console.log(`[${timestamp}] Aptos Price: $${aptosPrice}`);

    // Send Windows notification
    notifier.notify({
      title: "🚨 APTOS PRICE ALERT",
      message: `$ ${aptosPrice()}`,
      sound: true,
      icon: path.join(__dirname, "aptos.png"),
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

  // Fetch price immediately and per minute
  fetchAptosPriceAndNotify();
  setInterval(fetchAptosPriceAndNotify, 60 * 1000);
}

// Start the Electron app
app.whenReady().then(() => {
  startPriceAlertBot();

  // Handle app activation (for macOS, etc.)
  app.on("activate", () => {
    if (app.isReady()) {
      startPriceAlertBot();
    }
  });
});

// Quit app when all windows are closed
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
