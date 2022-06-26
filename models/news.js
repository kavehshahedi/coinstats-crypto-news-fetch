const mongoose = require('mongoose');

module.exports = mongoose.model('news', new mongoose.Schema({
    news_id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    source: { type: String, required: false },
    image_url: { type: String, required: false }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }));