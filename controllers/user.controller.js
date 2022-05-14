const db = require('../database-config')

function todayWeek() {
    return Math.floor(((7 - 4) / 7 + new Date().getTime() / 604800000) % 2) + 1;
}

function tomorrowWeek() {
    return Math.floor(((8 - 4) / 7 + new Date().getTime() / 604800000) % 2) + 1;
}

function today() {
    return new Date().getDay() === 0 ? 7 : new Date().getDay();
}

function tomorrow() {
    return new Date().getDay() === 0 ? 1 : new Date().getDay() + 1;
}


class UserController {
    async createStudent(req, res) {
        const vk_id = req.params.vk_id;
        const subgroup_id = req.params.subgroup_id;
        try {
            const answer = await db.query(`CALL create_student(${vk_id}, ${subgroup_id})`);
            res.json(answer.rows[0]);
        } catch (e) {
            res.json(e);
        }
    }

    async getTimetable(req, res) {
        await db.query(`SELECT * FROM get_student_timetable(${req.params.vk_id})`)
            .then((r) => {
                res.json(r.rows);
            })
            .catch((e) => {
                res.json(e);
            })
    }

    async getDay(req, res) {
        await db.query(`SELECT * FROM public.get_student_day_timetable(
                ${req.params.vk_id}, 
                ${req.params.week},
                ${req.params.day})`)
            .then((r) => {
                res.json(r.rows);
            })
            .catch((e) => {
                res.json(e);
            })
    }

    async getToday(req, res) {
        await db.query(`SELECT * FROM public.get_student_day_timetable(
                ${req.params.vk_id},
                ${todayWeek()},
                ${today()}
            )`)
            .then((r) => {
                if (r.rows.length === 0) {
                    async function fetchDayName() {
                        await db.query(`SELECT * FROM public.get_week_days()`)
                            .then((re) => {
                                const day = today();
                                res.json(re.rows.find(x => x.day_number === day));
                            });
                    }
                    fetchDayName();
                }
                else {
                    res.json(r.rows);
                }
            }).catch((e) => res.json(e));
    }

    async getTomorrow(req, res) {
        await db.query(`
                SELECT * FROM public.get_student_day_timetable(
                ${req.params.vk_id}, 
                ${tomorrowWeek()},
                ${tomorrow()}
                )`)
            .then((r) => {
                res.json(r.rows);
            })
            .catch((e) => {
                res.json(e);
            })
    }

    async studentExists(req, res) {
        const vk_id = req.params.vk_id;
        try {
            const answer = await db.query(`SELECT * FROM student_exists(${vk_id})`);
            res.json(answer.rows[0]);
        } catch (e) {
            res.json(e);
        }
    }

    async getFaculties(req, res) {
        try {
            const answer = await db.query('SELECT * FROM get_faculties()');
            res.json(answer.rows); //массив данных id name
        } catch (e) {
            res.json(e);
        }
    }

    async getGroups(req, res) {
        try {
            const f_id = req.params.faculty_id;
            const course = req.params.course
            const answer = await db.query(`SELECT * FROM get_groups(${f_id}, ${course})`);
            res.json(answer.rows); //массив данных id name
        } catch (e) {
            res.json(e);
        }
    }

    async getSubgroups(req, res) {
        try {
            const g_id = req.params.group_id;
            const answer = await db.query(`SELECT * FROM get_subgroups(${g_id})`);
            res.json(answer.rows); //массив данных id name
        } catch (e) {
            res.json(e);
        }
    }

    async getWeekDays(req, res) {
        try {
            const answer = await db.query(`SELECT * FROM get_week_days()`);
            res.json(answer.rows)
        } catch (e) {
            res.json(e);
        }
    }
}

module.exports = new UserController()