const Router = require('express')
const router = new Router()
const userController = require("../controllers/user.controller")

router.post('/createStudent/:vk_id&:subgroup_id', userController.createStudent)
router.get('/getTimetable/:vk_id', userController.getTimetable)
router.get('/getDay/:vk_id&:week&:day', userController.getToday)
router.get('/studentExists/:vk_id', userController.studentExists)
router.get('/getFaculties', userController.getFaculties)
router.get('/getGroups/:faculty_id', userController.getGroups)
router.get('/getSubgroups/:group_id', userController.getSubgroups)


module.exports = router