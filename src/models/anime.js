const mongoose = require('mongoose');

const animeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    author: {
        type: String
    },
    finalized: {
        type: Boolean,
        default: false
    },
    actualChapter: {
        type: Number,
        default: 0
    },
    imagePath: {
        type: String,
        default: ''
    },
}, {
    timestamps: true
});

animeSchema.methods.toJSON = function() {
    const anime = this;
    const animeObject = anime.toObject();

    delete animeObject.image;

    return animeObject;
}

const Anime = mongoose.model('Anime', animeSchema);

module.exports = Anime;