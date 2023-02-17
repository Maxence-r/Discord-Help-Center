const messageChecker = (req, res, next) => {
    if (req.body.content.length < 1 ) {
        return res.status(400).json({error: 'Message content is invalid, cannot be empty or contain <.'});
    }
    next();
}

module.exports = messageChecker;