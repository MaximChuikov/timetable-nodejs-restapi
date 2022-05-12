const Router = require('express')
const router = new Router()
const userController = require("../controllers/user.controller")

router.get('/createStudent/:vk_id&:subgroup_id', userController.createStudent)
router.get('/getTimetable/:vk_id', userController.getTimetable)
router.get('/getDay/:vk_id&:week&:day', userController.getDay)
router.get('/getToday/:vk_id', userController.getToday)
router.get('/getTomorrow/:vk_id', userController.getTomorrow)
router.get('/studentExists/:vk_id', userController.studentExists)
router.get('/getFaculties', userController.getFaculties)
router.get('/getGroups/:faculty_id&:course', userController.getGroups)
router.get('/getSubgroups/:group_id', userController.getSubgroups)
router.get('/getWeekDays', userController.getWeekDays)

module.exports = router