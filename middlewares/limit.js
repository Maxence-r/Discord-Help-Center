const Ticket = require("../models/ticket");

const limit = (req, res, next) => {
    Ticket.find({owner: req.user.id, open: true}, (err, tickets) => {
        if (err) {
            console.error(err);
            return res.status(500).json({error: 'Something went wrong'});
        }
        if (tickets.length >= 3) {
            return res.status(429).json({error: 'You have reached the maximum number of tickets'});
        }
        next();
    });
};


module.exports = limit;