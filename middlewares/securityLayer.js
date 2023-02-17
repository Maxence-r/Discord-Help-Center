const Ticket = require("../models/ticket");
const ObjectId = require('mongoose').Types.ObjectId;

const securityLayer = (req, res, next) => {
  Ticket.find({ $and: [ { _id: ObjectId(req.body.ticketId) }, { owner: req.user.id } ] }, (err, tickets) => {
    if (err) {
      return res.status(500).json({ error: 'Something went wrong' });
    }
    if (tickets.length <= 0) {
      return res.status(401).json({ error: 'You are not allowed to access this ticket' });
    }
    next();
  });
}


module.exports = securityLayer;
