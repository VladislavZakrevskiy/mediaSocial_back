const db = require('../database/db')
const bcrypt = require('bcrypt')
const uuid = require('uuid')
const emailService = require('./emailService')
const tokenService = require('./tokenService')
const UserDto = require('../dtos/userDto')
const ApiError = require('../exceptions/apiError')


function getArrayFromObj (obj) {
    const array = []
    for(let key in obj) {
        array.push(obj[key])
    }
    return array
}


class userService {
    async registration (res ,email, password) {
        const candidate = await db.query('select * from users where email = $1', [email])
        if(!candidate.rows[0]){
            const hashPassword = await bcrypt.hash(password, 7)
            const activationLink = uuid.v4()
            const user_id = uuid.v4()
            const user = await db.query('insert into users (user_id,email, password, activation_link) values ($1, $2, $3, $4) returning *', [user_id, email, hashPassword, activationLink])
            await db.query(`insert into concats (user_id) values ($1)`, [user_id])
            await db.query(`insert into description (user_id) values ($1)`, [user_id])
            await db.query(`insert into life_position (user_id) values ($1)`, [user_id])
            await db.query(`insert into intr (user_id) values ($1)`, [user_id])
            await emailService.sendActivationMail(email, `${process.env.API_URL}/auth/activate/${activationLink}`)
            const userDto = new UserDto(user.rows[0])
            const tokens = tokenService.generateTokens({...userDto})
            await tokenService.saveToken(userDto.user_id, tokens.refreshToken)

            return {...tokens, user: userDto}
        }
        else {
            throw ApiError.badRequest(`Пользователь с почтовым адресом ${email} уже существует`)
        }

    }

    async activate(activation_link) {
        const user = await db.query('select * from users where activation_link = $1', [activation_link])

        if(!user.rows[0]){
            throw new Error('Некорректная ссылка активации')
        }
        else {
            await db.query('update users set is_activated = true where user_id = $1', [user.rows[0].user_id])
        }
    }

    async login (email, password) {
        const user = await db.query('select * from users where email = $1', [email])
        if(!user.rows[0]){
            throw ApiError.badRequest('Пользователь не был найден')
        }
        console.log(user.rows[0])
        const isPassEquals = await bcrypt.compare(password, user.rows[0].password)
        if(!isPassEquals){
            throw ApiError.badRequest('Неверный пароль')
        }
        const userDto = new UserDto(user.rows[0])
        const tokens = tokenService.generateTokens({...userDto})
        await tokenService.saveToken(userDto.user_id, tokens.refreshToken)

        return {...tokens, user: userDto}
    }

    async logout(refreshToken){
        const token = await tokenService.remove(refreshToken)
        return token
    }

    async refresh(refreshToken) {
        if(!refreshToken){
            throw ApiError.UnauthorizedError()
        }
        const userData = tokenService.validateRefreshToken(refreshToken)
        const tokenDB = await tokenService.find(refreshToken)
        if(!userData || !tokenDB) {
            console.log('err')
            throw ApiError.UnauthorizedError()
        }
        const user = await db.query('select * from users where user_id = $1', [userData.user_id])
        const userDto = new UserDto(user.rows[0])
        const tokens = tokenService.generateTokens({...userDto})
        await tokenService.saveToken(userDto.user_id, tokens.refreshToken)
        return {...tokens, user: userDto}
    }

    async getAllUsers() {
        const users = await db.query('select * from users')
        return users.rows
    }

    async getMe(email) {
        const user = await db.query('select * from users where email = $1', [email])
        return user.rows[0]
    }

    async saveInfo (cont, desc, intr, life, name, user_id) {       
        cont = getArrayFromObj(cont)
        desc = getArrayFromObj(desc)
        intr = getArrayFromObj(intr)
        life = getArrayFromObj(life)
        name = getArrayFromObj(name)
 
        const contacts = await db.query(
            `
            update concats
            set city = $1, house = $2, 
            phone = $3, another_phone = $4, 
            site = $5, skype = $6
            where user_id = $7
            `, [...cont, user_id]
            )
        const description = await db.query(
            `
            update description
            set description = $1, relationships = $3, date_birth = $2
            where user_id = $4
            `, [...desc, user_id]
            )
        const life_position = await db.query(
            `
            update life_position 
            set polit = $1, worldview = $2,
            main_life = $5, rel_alc = $3, rel_smoke = $4
            where user_id = $6
            `, [...life, user_id]
            )
        const intereses = await db.query(
            `
            update intr
            set activity = $2, intereses = $9, 
            f_music = $6, f_films = $4, f_show = $8,
            f_books = $3, f_games = $5, f_quote = $7, 
            about_person = $1
            where user_id = $10
            `, [...intr, user_id]
            )
        const nameTable = await db.query(
            `
            update users
            set first_name = $2, last_name = $3,
            username = $4
            where user_id = $1    
            `, [...name]
            )
        return contacts.rows, description.rows, life_position.rows, intereses.rows, nameTable.rows
    }

    async findByName (name) {
        const likenessUsers = await db.query(`select * from users where first_name like '${name}%' or last_name like '${name}%' or username like '${name}%' or concat(first_name, ' ', last_name) like '${name}%'`, undefined)
        const likenessPublics = await db.query(`select * from publics where title like '${name}%'`, undefined)
        return {
            users: likenessUsers.rows,
            publics: likenessPublics.rows 
        }
    }

    async getUser(user_id){
        const user = await db.query('select * from users where user_id = $1', [user_id])
        return user.rows[0]
    }
}

module.exports = new userService()



