const express = require('express');
const auth = require('../middlewares/auth');
const router = express.Router();
const Post = require('../models/post');
const Comment = require('../models/comments');
router.get('/', (req, res) => {
    Post.find().sort({date: -1})
        .then((posts) => {
            posts.forEach((post) => {
                post.votes = post.votes?.length || 0;
            });
            res.json(posts)
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

router.get('/:id', (req, res) => {
    Post.findById(req.params.id)
        .then((post) => {
            res.json(post)
        })
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
            if (post.votes.includes(req.user.id)) {
                post.votes = post.votes.filter(id => id !== req.user.id);
                message = "Post downvoted";
            } else {
                post.votes.push(req.user.id);
                message = "Post upvoted";
            }
            post.save()
                .then(() => res.json({message: message}))
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

router.post('/delete/:id', auth, (req, res) => {
    Post.findById(req.params.id)
        .then(post => {
            if (post.owner === req.user.id) {
                post.delete()
                    .then(() => res.json({message: "Post deleted"}))
                    .catch(err => res.status(400).json('Error: ' + err));
            } else {
                res.status(400).json('Error: You are not the owner of this post');
            }
        })
        .catch(err => res.status(400).json('Error: ' + err));
});


router.post('/comment', auth, (req, res) => {
    Post.find({_id: req.body.postId})
        .then(post => {
            if (post) {
                const comment = new Comment({
                    owner: req.user.id,
                    content: req.body.content,
                    post: req.body.postId
                });
                comment.save()
                    .then((comment) => {
                        res.json({message: "Comment created", id: comment._id});
                    })
                    .catch(err => res.status(400).json('Error: ' + err));
            } else {
                res.status(400).json('Error: Post not found');
            }
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

router.get('/comments/:id', (req, res) => {
    Comment.find({post: req.params.id}).sort({date: -1})
        .then(comments => {
            res.json(comments);
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

        

module.exports = router;