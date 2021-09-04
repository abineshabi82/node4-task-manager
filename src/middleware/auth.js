const User = require('../model/user.js')
const jwt = require('jsonwebtoken')

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const userId = await jwt.verify(token, process.env.JWT_SCREATE)
        const user = await User.findById({ _id: userId._id })//, "tokens.token": token
        req.token=token
        req.user = user
    } catch (err) {
        res.status(401).json({ error: err })
    }
    finally {
        next()
    }
}

module.exports = auth