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

function groupingWeekTimetable(json) {
    const groupByWeek =
        json.reduce((group, product) => {
            const {week} = product;
            if (group[week] == null)
                group[week] = [];
            group[week].push(product);
            return group;
        }, {});
    const groupByDay = (arr) => arr.reduce((group, product) => {
        const {day_number} = product;
        if (group[day_number] == null)
            group[day_number] = [];
        group[day_number].push(product);
        return group;
    }, {});
    const collectToArr = (instance) => {
        const list = [7];
        for (let i = 1; i <= 7; i++)
            list[i - 1] = instance[i.toString()];
        return list;
    }

    function processWeek(week_name) {
        const groupByWeekDay = groupByDay(groupByWeek[week_name]);
        return groupByWeekDay === undefined ? collectToArr([]) : collectToArr(groupByWeekDay);
    }

    try {
        return {
            '1': processWeek("1"),
            '2': processWeek("2")
        }
    } catch (e) {
        return e;
    }
}


class UserController {

    /*
        Student & timetable methods
     */
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
            .then(async (r) => {
                try {
                    const timetable = groupingWeekTimetable(r.rows);
                    const days = await db.query(`SELECT * FROM public.get_week_days()`).then(r => r.rows);
                    for (let i = 1; i <= 7; i++) {
                        if(timetable["1"][i - 1] == null)
                            timetable["1"][i - 1] = days.find(x => x.day_number === i)
                        if(timetable["2"][i - 1] == null)
                            timetable["2"][i - 1] = days.find(x => x.day_number === i)
                    }
                    res.json(timetable);
                } catch (e) {
                    res.json(e);
                }
            })
            .catch((e) => res.json(e));
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
                            }).catch((e) => res.json(e));
                    }
                    fetchDayName();
                } else {
                    res.json(r.rows);
                }
            }).catch((e) => res.json(e));
    }

    async getTomorrow(req, res) {
        await db.query(`SELECT * FROM public.get_student_day_timetable(
                ${req.params.vk_id},
                ${tomorrowWeek()},
                ${tomorrow()}
            )`)
            .then((r) => {
                if (r.rows.length === 0) {
                    async function fetchDayName() {
                        await db.query(`SELECT * FROM public.get_week_days()`)
                            .then((re) => {
                                const day = tomorrow();
                                res.json(re.rows.find(x => x.day_number === day));
                            }).catch((e) => res.json(e));
                    }

                    fetchDayName();
                } else {
                    res.json(r.rows);
                }
            }).catch((e) => res.json(e));
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

    /*
        Group response methods
     */
    async getFaculties(req, res) {
        try {
            const answer = await db.query('SELECT * FROM get_faculties()');
            res.json(answer.rows);
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
}

module.exports = new UserController()