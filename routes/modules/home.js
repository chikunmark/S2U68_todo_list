const express = require('express')
const router = express.Router()
const Todo = require('../../models/todo') // 最後助教居然大小寫都有用，只能依著改了

router.get('/', (req, res) => {
  // res.send('hello world!') // 引入 handlebars 後就不用了

  // 拿到所有 Todo 資料
  Todo.find() // find 的 () 內也能傳參數做處理
    .lean() // mongoose 做的都不要，我們只要單純地 JS 物件
    .sort({ _id: 'asc' }) // 讓 DB 做排序的指令，'asc' 正序，'desc' 倒序
    // .then(todos => res.render('index', {todos: todos})) // 然後，整理後會有個 todos 資料陣列，把它 render 進 index.hbs 裡
    .then(todos => res.render('index', { todos })) // {todos} 是上面的簡寫，僅在 key/value 一樣時能用 (至少我現在不想用，因為會看不懂資料從哪對應到哪)
    // 搞不懂藍色參數 todos 的引數在哪
    .catch(error => console.error(error)) // 若有錯，把它印出
})

module.exports = router