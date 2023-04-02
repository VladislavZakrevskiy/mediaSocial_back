const express = require('express')
const authMiddleware = require('../middleware/authMiddleware')
const publicController = require('../controllers/publicController')

const router = express.Router()

router.post('/create', authMiddleware, publicController.createPublic)
router.get('/public/:id', authMiddleware, publicController.getPublic)
router.get('/publics', authMiddleware, publicController.getPublics)
router.get('/user/:user_id', authMiddleware, publicController.getUserPublics)
router.delete('/', authMiddleware, publicController.deletePublic)

module.exports = router 