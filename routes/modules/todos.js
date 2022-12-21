const express = require('express')
const router = express.Router()
const Todo = require('../../models/todo') // 最後助教居然大小寫都有用，只能依著改了

router.get('/new', (req, res) => {
  // 怪了，這 "todos" 是指哪裡？ -> 完全搞錯意思了，看下面
  return res.render('new')
})

// 我搞錯整個 router.get 或 router.post 等語法的意思了，它不是說 listen 到 /todos，就轉到某個網址，而是 listen 到 /todos，就做後面的匿名函式
router.post('/', (req, res) => {
  const name = req.body.name
  console.log(req.body) // 來試試

  // const todo = new Todo({ name })
  // return todo
  //   .save()
  //   .then(() => res.redirect('/')) // 有機會的話，查 redirect 定義
  //   .catch(error => console.log(error))

  // 上下寫法的結果完全相同，上面是先在 JS 新增一 object，再將它存到 mongoose，下面則是直接要 mongoose 新增一 object
  return Todo.create({ name })
    .then(() => res.redirect('/')) // 有機會的話，查 redirect 定義
    .catch(error => console.log(error))
})

router.get('/:id', (req, res) => {
  const id = req.params.id
  return Todo.findById(id)
    .lean()
    .then(todo => res.render('detail', { todo }))
    .catch(error => console.log(error))
})

router.get('/:id/edit', (req, res) => {
  const id = req.params.id
  return Todo.findById(id)
    .lean()
    .then(todo => res.render('edit', { todo }))
    .catch(error => console.log(error))
})

router.put('/:id', (req, res) => {
  const id = req.params.id

  // const name = req.body.name
  // const isDone = req.body.isDone
  // 上下意思相同
  const { name, isDone } = req.body // 解構賦值

  return Todo.findById(id)
    .then(todo => {
      todo.name = name

      // todo.isDone = (isDone === 'on')
      todo.isDone = isDone === 'on' // 與下面註解意思相同，老實說，加個括號，意思應該會比較完整唄 (像上面)
      // if (isDone === 'on') {
      //   todo.isDone = true
      // } else {
      //   todo.isDone = false
      // }

      return todo.save()
    })
    .then(() => res.redirect(`/todos/${id}`))
    .catch(error => console.log(error))
})

router.delete('/:id', (req, res) => {
  const id = req.params.id
  return Todo.findById(id)
    // .then(console.log(Boolean(Todo.findById(id))))  // 沒試成
    .then(todo => todo.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

module.exports = router