const db = require('../database-config')
const parser = require('./jsonTimetableParser');

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
    static async getSubgroupTimetable(req) {
        const id = req.params.vk_id;
        try{
            const answer = await db.query(`SELECT getTimetable(${id})`);
            return answer.rows[0];
        }catch (e){
            console.log(e);
        }
    }
    async getTodayTimetable(req, res){
        try{
            const timetable = await UserController.getSubgroupTimetable(req);
            res.json(parser.getDay(parser.days.today, timetable.gettimetable));
        }
        catch (e){
            console.log(e);
        }
    }
    async getTomorrowTimetable(req, res){
        try{
            const timetable = await UserController.getSubgroupTimetable(req);
            res.json(parser.getDay(parser.days.tomorrow, timetable.gettimetable));
        }
        catch (e){
            console.log(e);
        }
    }
    async getCurrentWeekTimetable(req, res){
        try{
            const timetable = await UserController.getSubgroupTimetable(req);
            res.json(parser.getWeek(parser.weeks.currentWeek, timetable.gettimetable));
        }
        catch (e){
            console.log(e);
        }
    }
    async getOtherWeekTimetable(req, res){
        try{
            const timetable = await UserController.getSubgroupTimetable(req);
            res.json(parser.getWeek(parser.weeks.otherWeek, timetable.gettimetable));
        }
        catch (e){
            console.log(e);
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

    async getFaculties(req, res){
        try{
            const answer = await db.query('SELECT * FROM getFaculties()');
            res.json(answer.rows); //массив данных id name
        }catch (e){
            res.json(e);
        }
    }
    async getGroups(req, res){
        try{
            const f_id = req.params.faculty_id;
            const answer = await db.query(`SELECT * FROM getGroups(${f_id})`);
            res.json(answer.rows); //массив данных id name
        }catch (e){
            res.json(e);
        }
    }
    async getSubgroups(req, res){
        try{
            const g_id = req.params.group_id;
            const answer = await db.query(`SELECT * FROM getSubgroups(${g_id})`);
            res.json(answer.rows); //массив данных id name
        }catch (e){
            res.json(e);
        }
    }
}
module.exports = new UserController()