const Pool = require('pg').Pool
const pool = new Pool({
    user: "maxim",
    password: "powerpivo",
    host: "maximchuikov.demlovesky.ru",
    port: "49159",
    database: "vk_timetable"
})
module.exports = pool;