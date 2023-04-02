const db = require('../database/db')
const bcrypt = require('bcrypt')
const uuid = require('uuid')
const ApiError = require('../exceptions/apiError')
const pagination =require('../utils/pagination')


class publicService {
    async createPublic({admins, name, password, about}){

        const candidate = await db.query('select * from publics where title = $1', [name])
        if(candidate.rows[0]){
            throw ApiError.badRequest('Существует')
        }
        const hashPassword = await bcrypt.hash(password, 7)
        const pub_id = uuid.v4()
        const pub = await db.query('insert into publics (public_id, title, password, about, admins) values ($1, $2, $3, $4, $5) returning *', [pub_id, name, hashPassword, about, admins])
        return pub.rows
    }

    async getPublic(id) {
        const pub = await db.query("select public_id, title,(select string_agg(username, '\,'\) as admins from users where user_id = any(admins) ), about from publics where public_id = $1", [id])
        return pub.rows[0]
    }

    async getPublics(limit, page){
        const pubs = await db.query(`select public_id, title,(select string_agg(username, '\,'\) as admins from users where user_id = any(admins) ), about from publics`, undefined)
        const pagPubs = pagination(pubs.rows, limit, page)
        return pagPubs
    }

    async deletePublic({name, email}){
        const pub = await db.query('delete from publics where title = $1 and(select user_id from users where email = $2) = any(admins) returning *', [name, email])

        if(pub.rows[0]){
            return pub.rows[0]
        }
        return ApiError.badRequest('Вы не админ или такого нет')
    }

    async getUserPublics(user_id){
        const publics = await db.query(`select public_id, title,(select string_agg(username, '\,'\) as admins from users where user_id = any(admins) ), about from publics where $1::uuid = any(admins::uuid[])`, [user_id])
        if(publics.rows[0]){
            return publics.rows
        }
        return []
    }

}

module.exports = new publicService()


