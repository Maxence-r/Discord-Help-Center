const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
    owner : {
        type: String,
        required: true,
        minLenght: 1
    },
    content : {
        type: String,
        required: true,
        minLenght: 1
    },
    post : {
        type: String,
        required: true,
        minLenght: 1
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    }
});



const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;