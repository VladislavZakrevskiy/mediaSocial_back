const jwt = require('jsonwebtoken')
const db = require('../database/db')

class tokenService {
    generateTokens (payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
            expiresIn: '30m'
        })
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
            expiresIn: '30d'
        })

        return {
            accessToken, 
            refreshToken
        }
    }

    async saveToken (user_id, refresh) {
        const tokenDate = await db.query('select * from token where user_id = $1', [user_id])
        if(tokenDate.rows[0]){
            await db.query('update token set refresh_token = $1 where user_id = $2', [refresh, user_id])
            return
        }
        const token = await db.query('insert into token (user_id, refresh_token) values ($1, $2)', [user_id, refresh])
        return token.rows
    }

    async remove(refreshToken) {
        const tokenData = await db.query('delete from token where refresh_token = $1 returning *', [refreshToken])
        return tokenData.rows[0]
    }

    async find(refreshToken) {
        const tokenData = await db.query('select * from token where refresh_token = $1', [refreshToken])
        return tokenData.rows[0]
    }

    validateAccessToken (token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
            return userData
        } catch (error) {
            return null
        }
    }

    validateRefreshToken (token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET)
            return userData
        } catch (error) {
            return null
        }
    }
}

module.exports = new tokenService()