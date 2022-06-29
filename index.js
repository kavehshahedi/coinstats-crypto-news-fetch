require('dotenv').config();
require('./app/db');

const Bot = require('./app/bot');
const News = require('./app/news');

const config = require('./config.json');

const getNews = () => {
    News.getNews().then(news => {
        for (let i = 0; i < news.length; i++)
            setTimeout(() => Bot.sendNews(news[i].title, news[i].description, news[i].source, news[i].imgURL, news[i].link),
                i * config.app.publishDelay * 60 * 1000);
    }).catch(error => { });
}

getNews();
setInterval(() => getNews(), config.app.fetchInterval * 60 * 1000);