

module.exports = class userDto {
    email
    user_id
    is_activated
    first_name
    last_name
    username

    constructor(model) {
        this.email = model.email
        this.user_id = model.user_id
        this.isActivated = model.is_activated
        this.first_name = model.first_name
        this.last_name = model.last_name
        this.username = model.username
    }
}