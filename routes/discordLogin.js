const express = require('express');
const router = express.Router();
const { botToken, adminIds, origin } = require('../config.json');

router.get('/', async (req, res) => {
    console.log(req.query);
    if (!req.query.code) {
        res.status(400)
    }
    const API_ENDPOINT = 'https://discord.com/api/v10';
    const CLIENT_ID = '839526461349822485';
    const CLIENT_SECRET = 'diY4cLk2E5IbzV1rHSccr3RsSlWWamc9';
    const REDIRECT_URI = `${origin}/api/discord`;

    const data = {
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
        'grant_type': 'authorization_code',
        'code': req.query.code,
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
    const token = await response.json();
    console.log(token);
    res.cookie('token', token.access_token).redirect('/');
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
    const freponse = await response.json();
    if (adminIds.includes(freponse.id)) {
        freponse.admin = true;
    } else {
        freponse.admin = false;
    }
    res.json(freponse);
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
