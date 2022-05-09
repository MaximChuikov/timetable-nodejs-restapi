const db = require('../database-config')

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

    async getTimetable(req, res){
        await db.query(`SELECT * FROM get_student_timetable(${req.params.vk_id})`)
            .then((r) =>{
                res.json(r.rows);
            })
            .catch((e) =>{
                res.json(e);
            })
    }

    async getToday(req, res){
        await db.query(`SELECT * FROM public.get_student_day_timetable(
                ${req.params.vk_id}, 
                ${req.params.week},
                ${req.params.day})`)
            .then((r) =>{
                res.json(r.rows);
            })
            .catch((e) =>{
                res.json(e);
            })
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