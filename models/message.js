const mongoose = require("mongoose");

const messageSchema = mongoose.Schema({
    owner: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true,
        maxLength: 5000,
        minLength: 1
    },
    ticket : {
        type: String,
        required: true
    }, 
    type: {
        type: String,
        required: true,
        default: "default"
    },
});



const Message = mongoose.model("Message", messageSchema);
module.exports = Message;