const Router = require('express')
const router = new Router()
const userController = require("../controllers/user.controller")

router.post('/createStudent/:vk_id&:subgroup_id', userController.createStudent)
router.get('/getTable/:vk_id', userController.getGroupTimetable)
router.get('/studentExists/:vk_id', userController.studentExists)
router.post('/requestGroupCreation', userController.requestGroupCreation)

module.exports = router