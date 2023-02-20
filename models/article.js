const mongoose = require("mongoose");

const articleSchema = mongoose.Schema({
    title : {
        type: String,
        required: true,
        minLenght: 1
    },
    description : {
        type: String,
        required: true,
        minLenght: 1
    },
    content: {
        type: Object,
        required: true,
        minLenght: 1
    }
});



const Article = mongoose.model("Article", articleSchema);
module.exports = Article;