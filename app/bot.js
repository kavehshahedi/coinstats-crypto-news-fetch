const { Telegraf } = require('telegraf');

const Bot = new Telegraf(process.env.BOT_TOKEN);

Bot.catch((err, ctx) => {
    return;
})

module.exports.sendNews = (title, description, source, imageUrl, link) => {
    const message = `🔸*${title}*\n\n${description}\n\n[Read The Full Article](${link})\nSource: ${source}`
    try {
        Bot.telegram.sendPhoto(process.env.CHAT_ID, { url: imageUrl }, { caption: message, parse_mode: 'Markdown' });
    } catch (err) { }
}

Bot.launch();

process.once('SIGINT', () => Bot.stop('SIGINT'));
process.once('SIGTERM', () => Bot.stop('SIGTERM'));