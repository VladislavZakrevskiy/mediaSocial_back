const publicService = require('../service/publicService')


class publicController {
    async createPublic(req,res,next) {
        try {
            const data = req.body
            const response = await publicService.createPublic(data)
            res.json(response) 
        } catch (e) {
            console.log(e)
            next(e)
        }
    }

    async getPublic(req, res, next) {
        try {
            const {id} = req.params
            const response = await publicService.getPublic(id)
            res.json(response)
        } catch (e) {
            console.log(e)
            next(e)
        }
    }

    async getPublics(req, res, next) {
        try {
            const {limit,page} = req.query
            const response = await publicService.getPublics(limit, page)
            res.json(response)
        } catch (e) {
            console.log(e)
            next(e)
        }
    }

    async deletePublic(req, res, next) {
        try {
            const {name, email} = req.body
            const response = await publicService.deletePublic({name, email})
            res.json(response)
        } catch (e) {
            console.log(e)
            next(e)
        }
    }

    async getUserPublics(req,res,next){
        try {
            const {user_id} = req.params
            const response = await publicService.getUserPublics(user_id)
            res.json(response)
        } catch (e) {
            console.log(e)
            next(e)
        }
    }
}

module.exports = new publicController()