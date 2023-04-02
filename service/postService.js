const db = require('../database/db')
const uuid = require('uuid')
const pagination = require('../utils/pagination')
const ApiError = require('../exceptions/apiError')

class postsService {
    async getPost(id){
        const post = await db.query('select * from posts where post_id = $1', [id])
        if(post.rows[0]){
            return post.rows[0]
        }
        throw ApiError.badRequest('Не существует')
    }

    async getPostsPublic(id, limit, page){
        const posts = await db.query('select * from posts where public_id = $1', [id])
        const response = pagination(posts.rows, limit, page)
        return response
    }

    async getPostsUser(id, limit, page){
        const posts = await db.query('select * from posts where user_id = $1', [id])
        const response = pagination(posts.rows, limit, page)
        return response
    }

    async getPosts(limit, page){
        const posts = await db.query('select * from posts order by random()', undefined)
        const response = pagination(posts.rows, limit, page)
        return {array: response, totalCount: posts.rowCount.toString()}
    }

    async createPost(owner, body, id){
        const post_id = uuid.v4()
        switch (owner) {
            case 'user':
                const userPost = await db.query('insert into posts (post_id, body, user_id) values ($1,$2,$3) returning *', [post_id, body, id])
                return userPost.rows[0]
                break;
            
            case 'public':
                const publicPost = await db.query('insert into posts (post_id, body, public_id) values ($1,$2,$3) returning *', [post_id, body, id])
                return publicPost.rows[0]
                break;
        }
    }

    async createLike(user_id, post_id){
        await db.query('update posts set likes = array_append(likes::uuid[], $1::uuid) where post_id = $2', [user_id, post_id])
    }
    //and not $1::uuid = any(likes::uuid[])

    async getLike(post_id, user_id){
        const likes = await db.query('select array_length(likes::uuid[],1) as length, $2::uuid = any(likes::uuid[]) as isliked from posts where post_id = $1', [post_id, user_id])
        return likes.rows[0]
    }

    async createComment(body, user_id, post_id){
        const comment_id = uuid.v4()
        const comment = await db.query('insert into comments (comment_id, body, user_id, post_id) values ($1,$2,$3,$4) returning *', [comment_id, body, user_id, post_id])
        return comment.rows[0]
    }

    async getComments(post_id){
        const comments = await db.query('select comment_id, user_id, (select username from users where users.user_id = comments.user_id), body, post_id from comments where post_id = $1', [post_id])
        return comments.rows
    }

    async getLastComment(post_id){
        const comments = await db.query('select comment_id, user_id, (select username from users where users.user_id = comments.user_id), body, post_id from comments where post_id = $1 limit 1', [post_id])
        return comments.rows[0]
    }
}

module.exports = new postsService()