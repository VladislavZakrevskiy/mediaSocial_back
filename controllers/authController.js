const userService = require("../service/userService")
const { validationResult} = require('express-validator')
const ApiError = require('../exceptions/apiError')


class AuthController {
    async registration(req, res, next) {
        try {
            const errors = validationResult(req)
            if(!errors.isEmpty()){
                return next(ApiError.badRequest('Ошибка при валидации', errors.array()))
            }
           const {email, password} = req.body
           const userData = await userService.registration(res,email, password)
           res.cookie('refreshToken', userData.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly: true})
           return res.json(userData)
        } catch (e) {
            next(e)
        }
    }
    
    async login(req, res, next) {
        try {
            const {email, password} = req.body
            const userData = await userService.login(email,password)
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly: true})
           return res.json(userData)
        } catch (e) {
            next(e) 
        }
    }    
    
    async logout(req, res, next) {
        try {
            const {refreshToken} = req.cookies
            const token = await userService.logout(refreshToken)
            res.clearCookie('refreshToken')
            return res.json(token)
        } catch (e) {
            console.log(e)
            next(e)
        }
    }

    async activate(req, res, next) {
        try {
            const activation_link = req.params.link
            await userService.activate(activation_link)
            return res.redirect(process.env.CLIENT_URL)
        } catch (e) {
            next(e)
            console.log(e)
        }
    }
    
    async refresh(req, res, next) {
        try {
            const {refreshToken} = req.cookies
            console.log(refreshToken)
            const userData = await userService.refresh(refreshToken)
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly: true})
           return res.json(userData)
        } catch (e) {
            next(e)
            console.log(e)
        }
    }

    async getUsers(req, res, next) {
        try {
            const users = await userService.getAllUsers()
            return res.json(users)
        } catch (e) {
            next(e)
        }
    }

    async saveInfo(req, res, next) {
        try {
            const {desc, cont, intr, life, name} = req.body
            userService.saveInfo(cont, desc, intr, life, name, name.user_id)
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new AuthController()