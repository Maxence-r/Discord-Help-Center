const Ticket = require("../models/ticket");
const ObjectId = require('mongoose').Types.ObjectId;
const { adminIds } = require('../config.json');

const securityLayer = (req, res, next) => {
  if (adminIds.includes(req.user.id)) {
    return next();
  }
  Ticket.find({ $and: [ { _id: ObjectId(req.body.ticketId) }, { owner: req.user.id } ] }, (err, tickets) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'Something went wrong' });
    }
    if (tickets.length <= 0) {
      return res.status(401).json({ error: 'You are not allowed to interact with this !' });
    }
    next();
  });
}


module.exports = securityLayer;
