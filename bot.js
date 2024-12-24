// Import required modules
const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Your bot token
const BOT_TOKEN = '7224868751:AAG9BFlSkXo8wfM5tTCkX5NksGWTvJWBTX4';

// Create a bot instance
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// Helper function to download video using yt-dlp
function downloadVideo(url, chatId) {
    try {
        const outputFile = path.join(__dirname, 'video.mp4');
        // Ensure the URL is wrapped in double quotes
        const command = `C:\\Users\\blizzard\\Desktop\\media-downloader\\yt-dlp.exe -o "${outputFile}" "${url}"`;

        bot.sendMessage(chatId, 'Downloading your video. Please wait...');

        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error('Error:', error);
                bot.sendMessage(chatId, `Error downloading the video: ${error.message}`);
                return;
            }

            bot.sendMessage(chatId, 'Download complete. Sending the video file...');
            bot.sendDocument(chatId, outputFile).then(() => {
                fs.unlinkSync(outputFile); // Delete file after sending
            }).catch(err => {
                console.error('Error sending file:', err);
                bot.sendMessage(chatId, 'Failed to send the video file.');
            });
        });
    } catch (error) {
        console.error('Error occurred:', error);
        bot.sendMessage(chatId, `An error occurred: ${error.message}`);
    }
}

// Listen for text messages
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (text === '/start') {
        bot.sendMessage(chatId, 'Welcome! Send me a video URL, and I will download it for you.');
    } else if (text.startsWith('http')) {
        downloadVideo(text, chatId);
    } else {
        bot.sendMessage(chatId, 'Please send a valid video URL.');
    }
});

console.log('Telegram bot is running...');
