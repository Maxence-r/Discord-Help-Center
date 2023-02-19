const auth = (req, res, next) => {
    if (!req.cookies.token) {
        return res.status(401).json({error: 'Please login to use this feature !'});
    }
    fetch('https://discord.com/api/v10/users/@me', {
        headers: {
            authorization: `Bearer ${req.cookies.token}`
        },
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            return res.status(401).json({error: 'Please login to use this feature !'});
        }
        req.user = data;
        next();
    });
}

module.exports = auth;