const axios = require('axios').default;

const News = require('../models/news');

const config = require('../config.json');

module.exports.getNews = () => {
    return new Promise((resolve, reject) => {
        axios.get('https://api.coinstats.app/public/v1/news').then(async response => {
            if (response.data.news !== undefined) {
                const output = [];
                for (const news of response.data.news) {
                    if (!isValidNews(news))
                        continue;
                    else if (await isOldNews(news.id))
                        break;
                    else {
                        news.title = fixText(news.title);
                        news.description = fixText(news.description);

                        await News.create({
                            news_id: news.id,
                            title: news.title,
                            description: news.description,
                            source: news.source,
                            image_url: news.imgURL
                        });

                        output.push(news)
                    }
                }

                resolve(output);
            }
        }).catch(error => reject(error));
    });
}

const isValidNews = news => {
    return news.id !== undefined &&
        news.title !== undefined &&
        news.description !== undefined &&
        news.source !== undefined &&
        news.imgURL !== undefined &&
        news.description.length > 0 &&
        !config.bannedItems.bannedCharacters.some(char => news.description.includes(char)) &&
        !config.bannedItems.bannedSources.some(source => String(news.source).toLowerCase().includes(source)) &&
        !config.bannedItems.bannedImageSources.some(source => String(news.imgURL).toLowerCase().includes(source)) &&
        ['.png', '.jpg', '.jpeg', '.gif'].some(ext => news.imgURL.includes(ext));
}

const fixText = text => {
    text = String(text)
        .replace(/(&#8216;)/g, '\'')
        .replace(/(&#8217;)/g, '\'')
        .replace(/(&#8220;)/g, '\"')
        .replace(/(&#8221;)/g, '\"')
        .replace(/(&#8230;)/g, '...')
        .replace(/(&#8211;)/g, '-')
        .replace(/(&#8212;)/g, '-')
        .replace(/(&#x201C;)/g, '\"')
        .replace(/(&#x201D;)/g, '\"')
        .replace(/(&#124;)/g, '|')
        .replace(/(&rsquo;)/g, '\'')
        .replace(/(&#039;)/g, '\'')
        .replace(/(&#160;)/g, ' ')
        .replace(/(&#x2019;)/g, '\'')
        .replace(/(&#x2018;)/g, '\'')
        .replace(/(&#x2013;)/g, '-')
        .replace(/(&#x2014;)/g, '-')
        .replace(/(&#38;)/g, '&')
        .replace(/(&#x00A0;)/g, ' ')
        .trim();

    return text;
}

const isOldNews = async newsId => {
    try {
        const news = await News.findOne({ news_id: newsId }).exec();
        return news !== null;
    } catch (err) {
        return true;
    }
}