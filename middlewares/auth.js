const { adminIds } = require('../config.json');

const auth = (req, res, next) => {
    if (!req.cookies.token) {
        return res.status(401).json({error: 'Unauthorized'});
    }
    fetch('https://discord.com/api/v10/users/@me', {
        headers: {
            authorization: `Bearer ${req.cookies.token}`
        },
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            return res.status(401).json({error: 'Unauthorized'});
        }
        req.user = data;
        next();
    });
}

module.exports = auth;