const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const limit = require('../middlewares/limit');
const Ticket = require('../models/ticket');
const Message = require('../models/message');
const securityLayer = require('../middlewares/securityLayer');
router.post('/', auth, limit, async (req, res) => {
    const ticket = new Ticket({
        owner: req.user.id,
        title: req.body.title,
        description: req.body.description
    });
    try {
        await ticket.save();
        res.status(201).json({message: 'Ticket created'});
    } catch (err) {
        console.log(err);
        res.status(500).json({error: 'Please fill all the fields'});
    }
});

router.get('/get/open', auth, async (req, res) => {
    try {
        const tickets = await Ticket.find({owner: req.user.id, open: true});
        res.status(200).json(tickets);
    } catch (err) {
        res.status(500).json({error: 'Something went wrong'});
    }
});


router.get('/get/closed', auth, async (req, res) => {
    try {
        const tickets = await Ticket.find({owner: req.user.id, open: false});
        res.status(200).json(tickets);
    } catch (err) {
        res.status(500).json({error: 'Something went wrong'});
    }
});


router.get('/get/infos/:id', auth, async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) {
            return res.status(404).json({error: 'Ticket not found'});
        }
        if (ticket.owner != req.user.id) {
            return res.status(403).json({error: 'You are not allowed to see this ticket'});
        }
        res.status(200).json(ticket);
    } catch (err) {
        res.status(500).json({error: 'Something went wrong'});
    }
});

router.post('/message', auth, securityLayer, async (req, res) => {
    try {
        const message = new Message({
            owner: req.user.id,
            ticket: req.body.ticketId,
            content: req.body.content
        });
        await message.save();
        res.status(201).json({message: 'Message sent'});
    } catch (err) {
        res.status(500).json({error: 'Something went wrong'});
    }
});
    
module.exports = router;