const db = require('../database/db')
const path = require('path');
const uuid = require('uuid')
class imageController {
    async uploadImg(req,res) {
        const {user_id, post_id} = req.body
        const { filename, mimetype, size } = req.file;
        const filepath = req.file.path
        const image_id = uuid.v4()
        db
        .query('insert into image_files (image_id ,filename, filepath, mimetype,size, user_id, post_id) values ($1,$2,$3,$4, $5, $6, $7)', [image_id, filename, filepath, mimetype, size, user_id, post_id]) 
        .then(() => 
            res.json({ success: true, filename }))
        .catch(err =>{
                console.log(err)
                res.status(400).json({ success: false, message: 'upload failed', stack: err.stack })
            }
        );
    }

    async loadImg(req, res){
        try {
            const {id} = req.params;  
            const images = await db.query('select * from image_files where user_id = $1 or post_id = $1', [id])
            const dirname = path.resolve();
            const fullfilepath = path.join(dirname, images.rows[0].filepath);
            return res.type(images.rows[0].mimetype).sendFile(fullfilepath);        
        } catch (error) {
            console.log(error)
            res.status(404).json({ success: false, message: 'not found', stack: error.stack })
        }
    }
}

module.exports = new imageController()