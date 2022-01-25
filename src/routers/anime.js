const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');
const Anime = require('../models/anime');
const router = new express.Router();

//create anime
router.post('/animes', async (req, res) => {
    const anime = new Anime(req.body);
    try {
        await anime.save();
        res.status(201).send({ anime });
    } catch (e) {
        res.status(400).send(e);
    }
});

//get animes
router.get('/animes', async (req, res) => {
    try {
        const animes = await Anime.find({});
        res.send(animes);
    } catch (e) {
        res.status(500).send(e);
    }
});

//get anime
router.get('/animes/:id', async (req, res) => {
    const _id = req.params.id;
    try {
        const anime = await Anime.findById(_id);
        if(!anime) {
            return res.status(404).send('Anime not found!');
        }

        res.status(200).send(anime);
    } catch (e) {
        res.status(500).send(error);
    }
});

//update anime
router.patch('/animes/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["name", "description", "author"];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if(!isValidOperation) {
        return res.status(400).send({error: 'Invalid request!'});
    }

    try {
        const anime = await Anime.findById(req.params.id);
        if(!anime) {
            return res.status(404).send('Anime not found!'); 
        }

        updates.forEach((update) => anime[update] = req.body[update]);
        await anime.save();
        res.status(200).send(anime);
    } catch (e) {
        res.status(500).send(e);
    }
});

//delete anime
router.delete('/animes/:id', async (req, res) => {
    try {
        const anime = await Anime.findById(req.params.id);
        if(!anime) {
            return res.status(404).send('Anime not found!'); 
        } 

        anime.remove();
        res.send(anime);
    } catch (e) {
        res.status(500).send(e);
    }
});

//upload image
const upload = multer({
    dest: 'images',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image'))
        }
        cb(undefined, true);
    }
});

router.post('/animes/image/:id', upload.single('image'), async (req, res) => {
        const anime = await Anime.findById(req.params.id);
        if(!anime) {
            return res.status(404).send('Anime not found!'); 
        }

        const { filename } = req.file;
        const filePath = `images/${filename}.png`;
        await sharp(req.file.path)
            .resize({width: 250, height: 250 })
            .png()
            .toFile(filePath);
        fs.unlinkSync(req.file.path);

        anime.imagePath = filePath;
        await anime.save();

        res.send('Image saved successfully!'); 
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message });
});

//delete image
router.delete('/animes/image/:id', async (req, res) => {
    try {
        const anime = await Anime.findById(req.params.id);
        if(!anime) {
            return res.status(404).send('Anime not found!'); 
        }
        
        const filePath = anime.imagePath;
        fs.unlinkSync(filePath);
        anime.imagePath = '';
        await anime.save();
        res.send('Image deleted successfully!');
    } catch (e) {
        res.status(500).send(e);
    }  
});

module.exports = router;