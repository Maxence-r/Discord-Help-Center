const ticketChecker = (req, res, next) => {
    if (req.body.title.includes('<') || req.body.description.includes('<')) {
        return res.status(400).json({error: 'Ticket content cannot contain <, title may be too long (max 100 characters) or description too long (max 400 characters).'});
    }
    next();
}

module.exports = ticketChecker;