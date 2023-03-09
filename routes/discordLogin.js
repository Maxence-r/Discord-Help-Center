const express = require('express');
const router = express.Router();
const { botToken } = require('../config.json');

router.get('/', async (req, res) => {
    const request = await fetch('http://localhost:3000/api/discord/exchange', {
        method: 'POST',
        body: JSON.stringify({ code: req.query.code }),
        headers: { 'Content-Type': 'application/json' }
    });
    const response = await request.json();
    console.log(response);
    res.cookie('token', response.access_token).redirect('/');
});

router.post('/exchange', async (req, res) => {
    console.log(req.body.code);
    const API_ENDPOINT = 'https://discord.com/api/v10';
    const CLIENT_ID = '839526461349822485';
    const CLIENT_SECRET = 'diY4cLk2E5IbzV1rHSccr3RsSlWWamc9';
    const REDIRECT_URI = 'http://localhost:3000/api/discord';

    const data = {
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
        'grant_type': 'authorization_code',
        'code': req.body.code,
        'redirect_uri': REDIRECT_URI
    };
    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    };
    const response = await fetch(`${API_ENDPOINT}/oauth2/token`, {
        method: 'POST',
        body: new URLSearchParams(data),
        headers: headers
    });
    if (!response.ok) {
        res.status(response.status);
    }
    res.json(await response.json());
});


router.post('/infos', async (req, res) => {
    console.log(req.body.access_token);
    const response = await fetch('https://discord.com/api/v10/users/@me', {
        headers: {
            authorization: `Bearer ${req.body.access_token}`
        }
    });
    if (!response.ok) {
        res.status(response.status);
    }
    res.json(await response.json());
});

router.get('/logout', async (req, res) => {
    res.clearCookie('token').redirect('back');
});

router.post('/get', async (req, res) => {
    console.log(botToken);
    const response = await fetch(`https://discord.com/api/v10/users/${req.body.id}`, {
        headers: {
            authorization: `Bot ${botToken}`
        }
    });
    if (!response.ok) {
        res.status(response.status);
    }
    res.json(await response.json());
});

module.exports = router;