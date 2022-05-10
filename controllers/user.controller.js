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

    async getDay(req, res){
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
    async getToday(req, res){
        await db.query(`SELECT * FROM public.get_student_day_timetable(
                ${req.params.vk_id}, 
                ${Math.floor(((3) / 7 + new Date().getTime() / 604800000) % 2)} + 1,
                ${new Date().getDay() - 1 == -1 ? 6 : new Date().getDay() - 1})`)
            .then((r) =>{
                res.json(r.rows);
            })
            .catch((e) =>{
                res.json(e);
            })
    }
    async getTomorrow(req, res){
        await db.query(`SELECT * FROM public.get_student_day_timetable(
                ${req.params.vk_id}, 
                ${Math.floor(((7 + 3) / 7 + new Date().getTime() / 604800000) % 2)  + 1},
                ${(new Date().getDay() - 1 == -1 ? 6 : new Date().getDay() - 1 + 1) % 7})`)
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
            const answer = await db.query(`SELECT * FROM student_exists(${vk_id})`);
            res.json(answer.rows[0]);
        }catch (e){
            res.json(e);
        }
    }
    async getFaculties(req, res){
        try{
            const answer = await db.query('SELECT * FROM get_faculties()');
            res.json(answer.rows); //массив данных id name
        }catch (e){
            res.json(e);
        }
    }
    async getGroups(req, res){
        try{
            const f_id = req.params.faculty_id;
            const answer = await db.query(`SELECT * FROM get_groups(${f_id})`);
            res.json(answer.rows); //массив данных id name
        }catch (e){
            res.json(e);
        }
    }
    async getSubgroups(req, res){
        try{
            const g_id = req.params.group_id;
            const answer = await db.query(`SELECT * FROM get_subgroups(${g_id})`);
            res.json(answer.rows); //массив данных id name
        }catch (e){
            res.json(e);
        }
    }
}
module.exports = new UserController()