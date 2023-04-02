const ApiError = require('../exceptions/apiError')
const tokenService = require('../service/tokenService')
module.exports = function (req,res,next) {
    try {
        const authHeader = req.headers.authorization
        if(!authHeader) {
            throw ApiError.UnauthorizedError()
        }
        const accessToken = authHeader.split(' ')[1]
        if(!accessToken){
            throw ApiError.UnauthorizedError()
        }
        const userData = tokenService.validateAccessToken(accessToken)
        if(!userData) {
            throw ApiError.UnauthorizedError()
        }
        req.user = userData
        next()
    } catch (e) {
        return next(ApiError.UnauthorizedError())
    }
}