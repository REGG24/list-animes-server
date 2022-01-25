const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/anime-server-api', {
    useNewUrlParser: true,
    autoIndex: true,
});
