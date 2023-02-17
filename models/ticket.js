const mongoose = require("mongoose");

const ticketSchema = mongoose.Schema({
    owner: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true,
        maxLength: 100,
        minLength: 1
    },
    description: {
        type: String,
        required: true,
        maxLength: 400,
        minLength: 1
    }, 
    open: {
        type: Boolean,
        required: true,
        default: true
    }
});



const Ticket = mongoose.model("Ticket", ticketSchema);
module.exports = Ticket;