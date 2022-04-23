const Router = require('express')
const router = new Router()
const userController = require("../controllers/user.controller")

router.post('/createStudent', userController.createStudent)
router.get('/getTable/:id', userController.getGroupTimetable)
router.post('/requestGroupCreation', userController.requestGroup)

module.exports = router