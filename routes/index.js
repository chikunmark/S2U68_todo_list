const express = require('express')
const router = express.Router()

const home = require('./modules/home')
const todos = require('./modules/todos')

router.use('/', home)
// 將網址結構符合 /todos 字串開頭的 request 導向 todos 模組，
// 而在該模組，得把路由 listening 裡的/todos 拿掉，要不會衝突 
// (listening 內容變成 /todos/todos/...)
router.use('/todos', todos)

module.exports = router
