// CREATED BY EZARHARDIN

const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

// Create a new client instance
const client = new Client({
  restartOnAuthFail: true,
  puppeteer: {
    headless: true,
    ignoreHTTPSErrors: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--no-first-run",
      "--no-zygote",
      "--single-process",
      "--disable-gpu",
    ],
  },
  authStrategy: new LocalAuth(),
});

// When the client is ready, run this code (only once)
client.once("ready", () => {
  console.log("Client is ready!");
});

// When the client received QR-Code
client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
  console.log("QR RECEIVED", qr);
});

// Listen for new messages
client.on("message", async (message) => {
  if (message.body === ".stiker") {
    if (message.hasMedia) {
      await client.sendMessage(message.from, "Tunggu bang, stikernya lagi dibuat...");
      const media = await message.downloadMedia();
      // Send media as sticker
      client.sendMessage(message.from, media, {
        sendMediaAsSticker: true,
        stickerAuthor: 'Hardin', 
        stickerName: 'stiker orang hitam'
      });
    } else {
      await client.sendMessage(message.from, "Kirim gambarnya dulu bang, biar bisa jadi stiker.");
    }
  } else {
    await client.sendMessage(message.from, "Salah prompt bang, yang bener pakai .stiker.");
  }
});

// Start your client
client.initialize();
