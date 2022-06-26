const axios = require('axios').default;

const News = require('../models/news');

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
        !['&lt;', '&gt;', '&amp;', '&quot;', '&apos;', '&nbsp;'].some(char => news.description.includes(char)) &&
        ['.png', '.jpg', '.jpeg', '.gif'].some(ext => news.imgURL.includes(ext)) &&
        !['cryptobenelux', 'cryptopost', 'reddit', 'coingape'].some(source => String(news.source).toLowerCase().includes(source));
}

const fixText = text => {
    text = String(text)
        .replace('&#8216;', '\'')
        .replace('&#8217;', '\'')
        .replace('&#8220;', '\"')
        .replace('&#8221;', '\"')
        .replace('&#8230;', '...')
        .replace('&#8211;', '-')
        .replace('&#8212;', '-')
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