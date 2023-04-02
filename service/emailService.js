const nodemailer = require('nodemailer')

class emailService {

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMPT_HOST,
            port: process.env.SMPT_PORT,
            secure: false,
            auth: {
                user: process.env.SMPT_USER,
                pass: process.env.SMPT_PASSWORD
            }

        })
    }

    async sendActivationMail(to, link) {
        await this.transporter.sendMail({
            from: process.env.SMPT_USER,
            to: to,
            subject: 'Актифация аккаунта на ' + process.env.API_URL,
            text: '',
            html: 
            `
                <div>
                    <h1>Для активации перейдите по ссылке</h1>
                    <a href="${link}">${link}</a>
                </div>
            `
        })
    }
}

module.exports = new emailService()