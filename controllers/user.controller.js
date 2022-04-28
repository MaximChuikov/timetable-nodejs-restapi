const db = require('../database')

class UserController{
    async createStudent(req, res){
        const vk_id = req.params.vk_id;
        const subgroup_id = req.params.subgroup_id;
        try{
            const answer = await db.query(`CALL createStudent(${vk_id}, ${subgroup_id})`);
            res.json(answer.rows[0]);
        }catch (e){
            res.json(e);
        }
    }
    async getGroupTimetable(req, res){
        const id = req.params.vk_id;
        try{
            const answer = await db.query(`SELECT getTimetable(${id})`);
            res.json(answer.rows[0]);
        }catch (e){
            res.json(e);
        }
    }
    async studentExists(req, res){
        const vk_id = req.params.vk_id;
        try{
            const answer = await db.query(`SELECT studentExists(${vk_id})`);
            res.json(answer.rows[0]);
        }catch (e){
            res.json(e);
        }
    }
    async requestGroupCreation(req, res){

    }
}
module.exports = new UserController()