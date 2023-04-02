const db = require('../database/db')
const uuid = require('uuid')
const ApiError = require('../exceptions/apiError')

class friendService {
    async getFriends(user_id){
        const friend_ids = await db.query('(select friends from users where user_id = $1)', [user_id])
        const friends = await db.query('select * from users where user_id = any($1)', [friend_ids.rows[0].friends])
        return friends.rows
    }

    async addFriend(friend_id, user_id){
        await db.query('insert into friend_activate(user_id, friend_id, is_activate) values($1,$2, false)', [user_id, friend_id])
        const friend = await db.query('update users set friends = array_append(friends::uuid[], $1::uuid) where user_id = $2 returning *', [friend_id, user_id])
        return friend.rows[0]
    }

    async removeFriend(friend_id, user_id){
        await db.query('delete from friend_activate where user_id = $1 and friend_id = $2', [user_id, friend_id])
        const friend = await db.query('update users set friends = array_remove(friends::uuid[], $1::uuid) where user_id = $2 returning *', [friend_id, user_id])
        return friend.rows
    }

    async activateFriend(user_id, friend_id){
        await db.query('update friend_activate set is_activate = true where friend_id = $1 and user_id = $2', [friend_id, user_id])
    }

    async getNotifications(user_id){
        const notes = await db.query('select *, (select username from users where user_id = do_by_user) from notification where user_id = $1', [user_id])
        return notes.rows
    }

    async sendNotification(from_id, to_id, body, type){
        const notification_id = uuid.v4()
        const created_at = Date.now()
        const notes = await db.query('insert into notification (notification_id, user_id, do_by_user, body, created_at, is_watched, type) values ($1,$2,$3,$4,$5,false,$6) returning *', [notification_id, to_id, from_id, body, created_at, type])

        return notes.rows[0]
    }

    async watchNotification(notification_id){
        const note = await db.query('update notification set is_watched = true where notification_id = $1 returning *', [notification_id])
        return note.rows[0]
    }


    async deleteNotification(notification_id){
        const note = await db.query ('delete from notification where notification_id = $1 returning *' , [notification_id])
        return note.rows[0]
    }

    async getNumberOfUnwatched(user_id){
        const notes = await db.query('select * from notification where user_id = $1 and is_watched = false', [user_id])
        return notes.rowCount
    }

}

module.exports = new friendService()