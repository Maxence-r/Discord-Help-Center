const express = require('express');
const router = express.Router();
const Article = require('../models/article');

router.get('/get', (req, res) => {
    Article.find({ trending: true }).sort({ _id: -1 }).limit(5).then((articles) => {
        res.status(200).json(articles);
    }).catch((err) => {
        res.status(500).json({ error: 'Something went wrong' });
    });
});

module.exports = router;