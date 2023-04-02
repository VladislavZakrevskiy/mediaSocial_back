const postService = require('../service/postService')

class postsController {
    async getPost(req, res, next){
        try {
            const {post_id} = req.params
            const response = await postService.getPost(post_id)
            res.json(response)
        } catch (e) {
            console.log(e)
            next(e)
        }
    }

    async getPostsUser(req, res, next){
        try {
            const {limit, page, id} = req.query
            const response = await postService.getPostsUser(id, limit, page)
            res.json(response)
        } catch (e) {
            console.log(e)
            next(e)
        }
    }

    async getPostsPublic(req, res, next){
        try {
            const {limit, page, id} = req.query
            const response = await postService.getPostsPublic(id, limit, page)
            res.json(response)
        } catch (e) {
            console.log(e)
            next(e)
        }
    }

    async createPost(req, res, next){
        try {
            const {owner, body, id} = req.body
            const response = await postService.createPost(owner, body, id)
            res.json(response)
        } catch (e) {
            console.log(e)
            next(e)
        }
    }

    async createLike(req, res, next){
        try {
            const {user_id, post_id} = req.body
            const response = await postService.createLike(user_id, post_id)
            res.json(response)
        } catch (e) {
            console.log(e)
            next(e)
        }
    }

    async getLike(req, res, next){
        try {
            const {post_id, user_id} = req.query
            const response = await postService.getLike(post_id, user_id)
            res.json(response)
        } catch (e) {
            console.log(e)
            next(e)
        }
    }

    async createComment(req, res, next){
        try {
            const {body, user_id, post_id} = req.body
            const response = await postService.createComment(body, user_id, post_id)
            res.json(response)
        } catch (e) {
            console.log(e)
            next(e)
        }
    }

    async getComment(req, res, next){
        try {
            const {post_id} = req.params
            const response = await postService.getComments(post_id)
            res.json(response)
        } catch (e) {
            console.log(e)
            next(e)
        }
    }

    async getPosts (req,res,next) {
        try {
            const {limit, page} = req.query
            const response = await postService.getPosts(limit,page)
            res.json(response)
        } catch (e) {
            console.log(e)
            next(e)
        }
    }

    async getLastComment (req, res, next) {
        try {
            const {post_id} = req.params
            const response = await postService.getLastComment(post_id)
            res.json(response)
        } catch (e) {
            console.log(e)
            next(e)
        }
    }
}

module.exports = new postsController()