const express = require('express');
const auth = require('../middlewares/auth');
const router = express.Router();
const Post = require('../models/post');

router.get('/', (req, res) => {
    Post.find().sort({date: -1})
        .then(posts => res.json(posts))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.get('/:id', (req, res) => {
    Post.findById(req.params.id)
        .then(post => res.json(post))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.post('/add', auth, (req, res) => {
    const owner = req.user.id;
    const title = req.body.title;
    const description = req.body.description;
    const newPost = new Post({owner, title, description});
    const promise = newPost.save();
    promise.then((data) => {
        res.json({message: "Post created", id: data._id});
    }).catch((err) => {
        res.json(err);
    });
});

router.post('/upvote/:id', auth, (req, res) => {
    Post.findById(req.params.id)
        .then(post => {
            if (post.upvotes.includes(req.user.id)) {
                post.upvotes = post.upvotes.filter(id => id !== req.user.id);
            } else {
                post.upvotes.push(req.user.id);
            }
            post.save()
                .then(() => res.json({message: "Post upvoted"}))
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
});



module.exports = router;