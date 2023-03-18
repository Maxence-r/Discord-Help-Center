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
        minLength: 10
    },
    description: {
        type: String,
        required: true,
        maxLength: 5000,
        minLength: 10
    },
    type: {
        type: String,
        required: true,
        default: "default"
    },
});



const Post = mongoose.model("Post", postSchema);
module.exports = Post;