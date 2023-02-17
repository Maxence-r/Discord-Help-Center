const mongoose = require("mongoose");

const messageSchema = mongoose.Schema({
    owner: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    ticket : {
        type: String,
        required: true
    }
});



const Message = mongoose.model("Message", messageSchema);
module.exports = Message;