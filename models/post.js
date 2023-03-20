const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
    owner: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true,
        maxLength: 2000,
        minLength: 5
    },
    description: {
        type: String,
        required: true,
        maxLength: 5000,
        minLength: 5
    },
    votes: {
        type: Array,
        required: true,
        default: []
    },
    type: {
        type: String,
        required: true,
        default: "default"
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    }
});



const Post = mongoose.model("Post", postSchema);
module.exports = Post;