const Router = require('express')
const router = new Router()
const userController = require("../controllers/user.controller")

router.post('/user/:id', userController.createStudent)
router.post('/group', userController.createGroup)
router.post('/subgroup/', userController.createSubgroup)
router.post('/getTable/:id', userController.getGroupTimetable)

module.exports = router