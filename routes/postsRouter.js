const express = require('express')
const authMiddleware = require('../middleware/authMiddleware')
const postsController = require('../controllers/postsController')

const router = express.Router()

router.get('/post/:post_id', authMiddleware, postsController.getPost) //y
router.get('/user', authMiddleware, postsController.getPostsUser)//y
router.get('/public', authMiddleware, postsController.getPostsPublic)//y
router.get('/posts', authMiddleware, postsController.getPosts)//y
router.post('/post', authMiddleware, postsController.createPost) //y
router.post('/likes', authMiddleware, postsController.createLike)//y
router.get('/likes', authMiddleware, postsController.getLike)//y
router.post('/comment', authMiddleware, postsController.createComment)//y
router.get('/comment/:post_id', authMiddleware, postsController.getComment)//y
router.get('/lastcomment/:post_id', authMiddleware, postsController.getLastComment)




module.exports = router 