const Router = require('express')
const router = new Router()
const userController = require("../controllers/user.controller")

router.post('/createStudent/:vk_id&:subgroup_id', userController.createStudent)
router.post('/requestGroupCreation', userController.requestGroupCreation)
router.get('/getTodayTimetable/:vk_id', userController.getTodayTimetable)
router.get('/getTomorrowTimetable/:vk_id', userController.getTomorrowTimetable)
router.get('/getCurrentWeekTimetable/:vk_id', userController.getCurrentWeekTimetable)
router.get('/getOtherWeekTimetable/:vk_id', userController.getOtherWeekTimetable)
router.get('/studentExists/:vk_id', userController.studentExists)
router.get('/getFaculties', userController.getFaculties)
router.get('/getGroups/:faculty_id', userController.getGroups)
router.get('/getSubgroups/:group_id', userController.getSubgroups)

module.exports = router