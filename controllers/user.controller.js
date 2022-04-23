const db = require('../database')

class UserController{
    async createStudent(req, res){

    }
    async getGroupTimetable(req, res){
        const id = req.params.id;
        const answer = await db.query(`SELECT getTimetable(${id})`);
        res.json(answer.rows[0]);
    }
    async requestGroup(req, res){

    }
}
module.exports = new UserController()