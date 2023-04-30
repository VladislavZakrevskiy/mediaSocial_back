const Pool = require('pg').Pool
const pool = new Pool({
    user: "mediasocial_db_user",
    password: "EVd35D9G1drRMGoMRACdIE85ofrlzap7",
    host: "dpg-ch76g2jhp8u9bo5d11k0-a.frankfurt-postgres.render.com",
    port: 5432,
    database:"mediasocial_db"
})
 
module.exports = pool