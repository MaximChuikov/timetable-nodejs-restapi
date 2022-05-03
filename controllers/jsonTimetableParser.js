const bells = require('../bells.json');

const days = {
    today: "Today",
    tomorrow: "Tomorrow",
}
const weeks = {
    currentWeek: "CurrentWeek",
    otherWeek: "OtherWeek"
}
const daysOfWeek = [
    'Понедельник',
    'Вторник',
    'Среда',
    'Четверг',
    'Пятница',
    'Суббота',
    'Воскресенье'
]

const getWeekTable = (week, timetable) => week == 1 ? timetable.firstWeek : timetable.secondWeek;
const weekAfter = (day) => Math.floor(((day + 3) / 7 + new Date().getTime() / 604800000) % 2);
const getWeekNumber = (week) => week == weeks.currentWeek ? weekAfter(0) + 1 : weekAfter(7) + 1;

function todayDay (){
    const dayFromSunday = new Date().getDay();
    return dayFromSunday - 1 == -1 ? 6 : dayFromSunday - 1;
}

function replaceTime(pair){
    try{
        pair.start = bells.bells[pair.pair - 1].start;
        pair.end = bells.bells[pair.pair - 1].end;
    } catch (e){
        console.log(e);
    }
    return pair;
}
function replacePairBell(dayJson){
    return dayJson.map(t => replaceTime(t));
}

function getDay(day, timetable){
    switch (day){
        case days.today:
            return {
                table: replacePairBell(getWeekTable(weekAfter(0), timetable)[todayDay()]),
                day: daysOfWeek[todayDay()]
            };
        case days.tomorrow:
            return {
                table: replacePairBell(getWeekTable(weekAfter(1), timetable)[(todayDay() + 1) % 7]),
                day: daysOfWeek[(todayDay() + 1) % 7]
            };

        default:
            console.log("Error in switch getDAY with \"" + day + "\" value");
            return replacePairBell(getWeekTable(weekAfter(0))[todayDay()]);
    }
}

function mergeWeekDays(weekTable){
    const arr = [daysOfWeek.length];
    for (let i = 0; i < daysOfWeek.length; i++){
        arr[i] = {
            table: replacePairBell(weekTable[i]),
            day: daysOfWeek[i]
        }
    }
    return arr;
}

function getWeek(week, timetable){
    switch (week){
        case weeks.currentWeek:
            return mergeWeekDays(getWeekTable(weekAfter(0), timetable));
        case weeks.otherWeek:
            return mergeWeekDays(getWeekTable(weekAfter(7), timetable));

        default:
            console.log("Error in switch getWeek with \"" + week + "\" value");
            return mergeWeekDays(getWeekTable(weekAfter(0), timetable));
    }
}
module.exports = {
    days,
    weeks,
    getWeekNumber,
    getDay,
    getWeek
}
