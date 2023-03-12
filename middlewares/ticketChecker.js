const { category } = require('../config.json');

const ticketChecker = (req, res, next) => {
    if (req.body.title.includes('<') || req.body.description.includes('<') || category.includes(req.body.category) === false) {
        return res.status(400).json({error: 'Make sure to specify each field and a valid category !, you can\'t use "<" in your title or description'});
    }
    next();
}

module.exports = ticketChecker;