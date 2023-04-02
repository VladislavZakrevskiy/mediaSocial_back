const express = require('express')
const authMiddleware = require('../middleware/authMiddleware')
const multer = require('multer');
const imageController = require('../controllers/imageController')

const router = express.Router()

const imageUpload = multer({
    dest: 'images',
  }); 



router.post('/upload', imageUpload.single('image'), imageController.uploadImg)
router.get('/get/:id', imageController.loadImg)



module.exports = router