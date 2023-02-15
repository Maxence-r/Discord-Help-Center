

const ticketSchema = mongoose.Schema({
    owner: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    }, 
    open: {
        type: Boolean,
        required: true,
        default: true
    }
});



const Ticket = mongoose.model("Ticket", ticketSchema);
module.exports = Ticket;