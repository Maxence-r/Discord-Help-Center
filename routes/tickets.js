const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const limit = require('../middlewares/limit');
const Ticket = require('../models/ticket');
const Message = require('../models/message');
const securityLayer = require('../middlewares/securityLayer');
const { adminIds } = require('../config.json');
const messageChecker = require('../middlewares/messageContent');
const ticketChecker = require('../middlewares/ticketChecker');
const { botToken } = require('../config.json');

router.post('/', auth, limit, ticketChecker, async (req, res) => {
    const ticket = new Ticket({
        owner: req.user.id,
        title: req.body.title,
        description: req.body.description,
        category: req.body.category
    });
    try {
        await ticket.save();
        res.status(201).json({message: 'Ticket created'});
    } catch (err) {
        res.status(500).json({error: 'Please fill all fields'});
    }
});

router.get('/get/open', auth, async (req, res) => {
    try {
        let tickets;

        if (adminIds.includes(req.user.id)) {
            tickets = await Ticket.find({ open: true }).sort({"_id": -1});
        } else {
            tickets = await Ticket.find({ owner: req.user.id, open: true }).sort({"_id": -1});
        }

        res.status(200).json(tickets);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong' });
    }
});


router.get('/get/closed', auth, async (req, res) => {
    try {
        let tickets;

        if (adminIds.includes(req.user.id)) {
            tickets = await Ticket.find({ open: false }).sort({"_id": -1});
        } else {
            tickets = await Ticket.find({ owner: req.user.id, open: false }).sort({"_id": -1});
        }

        res.status(200).json(tickets);
    } catch (err) {
        console.log('got here');
        console.log(err);
        res.status(500).json({ error: 'Something went wrong' });
    }
});



router.get('/get/infos/:id', auth, async (req, res) => {
    
    try {
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) {
            return res.status(404).json({ error: 'Ticket not found' });
        }
        if (adminIds.includes(req.user.id) || ticket.owner === req.user.id) {
            res.status(200).json(ticket);
        } else {
            res.status(403).json({ error: 'You are not allowed to see this ticket' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong' });
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
        console.log(err);
      res.status(500).json({error: 'Something went wrong'});
    }
  });
  

router.post('/message', auth, securityLayer, messageChecker, async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.body.ticketId);
        if (!ticket) {
            return res.status(404).json({ error: 'Ticket not found' });
        }
        if (!ticket.open) {
            return res.status(403).json({ error: 'Ticket is closed' });
        }
        const message = new Message({
            owner: req.user.id,
            ticket: req.body.ticketId,
            content: req.body.content
        });
        if (adminIds.includes(req.user.id) && req.body.type) {
            console.log(req.body.type)
            message.type = `${req.body.type}`;
        }
        console.log(message)
        await message.save();
        global.io.emit(`${req.body.ticketId}-newMessage`, { message, user: req.user });
        res.status(201).json({ message: 'Message sent' });
        } catch (err) {
            console.log(err);
            res.status(500).json({ error: 'Something went wrong' });
        }
});
  

router.patch('/close', auth, securityLayer, async (req, res) => {
    try {
        const ticket = await Ticket.updateOne({_id: req.body.ticketId}, {open: false});
        if (ticket.nModified === 0) {
            return res.status(404).json({error: 'Something went wrong'});
        }
        res.status(200).json({message: 'Ticket closed'});
    } catch (err) {
        console.log(err);
        res.status(500).json({error: 'Something went wrong'});
    }
});


router.post('/messages' , auth, securityLayer, async (req, res) => {
    const messages = await Message.find({ticket: req.body.ticketId});
    res.status(200).json(messages);
});

router.post('/typing', auth, securityLayer, async (req, res) => {
    global.io.emit(`${req.body.ticketId}-typing`, req.user.id);
    res.status(200).json({message: 'Typing'});
});

router.post('/notification', auth, securityLayer, async (req, res) => {
    if (adminIds.includes(req.user.id)) {
        fetch('https://discord.com/api/v10/users/@me/channels', {
                method: 'POST',
                headers: {
                    'Authorization': `Bot ${botToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'recipient_id': req.body.receiverId
                })
            })
            .then(res => res.json())
            .then(json => {
                console.log(json);
                fetch(`https://discord.com/api/v10/channels/${json.id}/messages`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bot ${botToken}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            "embeds": [
                                {
                                  "title": "**New notification**",
                                  "description": `This is an official notification from the **Teranga Help Center** \n \`\`\`${req.body.message}\`\`\``,
                                  "url": "https://discordapp.com",
                                  "color": 10038562
                                }
                              ]
                        })
                    })
                    .then(res => res.json())
                    .then(json => {
                        console.log(json);
                        res.status(200).json({
                            message: 'Notification sent'
                        });
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({
                            error: 'Something went wrong'
                        });
                    });
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: 'Something went wrong'
                });
            });
    } else {
        res.status(403).json({
            error: 'You are not allowed to do this'
        });
    }
});



module.exports = router;