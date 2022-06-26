const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
module.exports = mongoose.connect(process.env.DB_ADDRESS, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err) => {
    if (err)
        console.log(err);
});