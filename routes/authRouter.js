const express = require('express')
const authController = require('../controllers/authController')
const {body} = require('express-validator')
const authMiddleware = require('../middleware/authMiddleware')

const router = express.Router()


router.post('/registration',
    body('email').isEmail(),
    body('password').isLength({min: 3, max: 32}),
    authController.registration)
router.post('/login', authController.login)
router.post('/logout', authController.logout)
router.get('/activate/:link', authController.activate)
router.get('/refresh', authController.refresh)
router.get('/users',authMiddleware, authController.getUsers)
router.patch('/saveInfo', authController.saveInfo)


module.exports = router
