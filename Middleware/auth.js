const secretKey = require('../Constants/index')
const jwt = require('jsonwebtoken')
module.exports = (req, res, next) => {
    try {
        const token = req.headers?.authorization?.split(' ')[1]
        const decode = jwt.verify(token, secretKey.jwtSectet)
        if (decode) next()
    } catch (error) {
        console.log(error)
        return res.status(401).json({
            statusCode: 401,
            message: 'Your Token is expired please login again'
        })

    }

}