require('dotenv').config();
require('./app/db');

const Bot = require('./app/bot');
const News = require('./app/news');

const getNews = () => {
    News.getNews().then(news => {
        for (let i = 0; i < news.length; i++)
            setTimeout(() => Bot.sendNews(news[i].title, news[i].description, news[i].source, news[i].imgURL, news[i].link),
                i * parseInt(process.env.SEND_DELAY) * 60 * 1000);
    }).catch(error => { console.log(error, Date.now()) });
}

getNews();
setInterval(() => getNews(), parseInt(process.env.FETCH_INTERVAL) * 60 * 1000);