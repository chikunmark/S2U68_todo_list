const express = require('express')
const port = 3000
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const Todo = require('./models/todo') // 最後助教居然大小寫都有用，只能依著改了
const methodOverride = require('method-override')

const routes = require('./routes/index') // 可不寫 /index，因為預設會去找它

// 加入這段 code, 僅在非正式環境時, 使用 dotenv
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const app = express()
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }) // 設定連線到 mongoDB
const db = mongoose.connection

const exphbs = require('express-handlebars')
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

// 用 app.use 規定每一筆請求都需要透過 body-parser 進行前置處理
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method')) // 只要代入 _method，它後面的內容就會直接轉換成對應的 HTTP method
app.use(routes)

db.on('error', () => {
  console.log('mongodb error!!')
})

db.once('open', () => {
  // 因只會發生一次，所以用 once
  console.log('mongoDB connected!!')
})

// 不用了，因為被搬到 home.js
// app.get('/', (req, res) => {
//   // res.send('hello world!') // 引入 handlebars 後就不用了

//   // 拿到所有 Todo 資料
//   Todo.find() // find 的 () 內也能傳參數做處理
//     .lean() // mongoose 做的都不要，我們只要單純地 JS 物件
//     .sort({ _id: 'asc' }) // 讓 DB 做排序的指令，'asc' 正序，'desc' 倒序
//     // .then(todos => res.render('index', {todos: todos})) // 然後，整理後會有個 todos 資料陣列，把它 render 進 index.hbs 裡
//     .then(todos => res.render('index', { todos })) // {todos} 是上面的簡寫，僅在 key/value 一樣時能用 (至少我現在不想用，因為會看不懂資料從哪對應到哪)
//     // 搞不懂藍色參數 todos 的引數在哪
//     .catch(error => console.error(error)) // 若有錯，把它印出
// })

app.get('/todos/new', (req, res) => {
  // 怪了，這 "todos" 是指哪裡？ -> 完全搞錯意思了，看下面
  return res.render('new')
})

// 我搞錯整個 app.get 或 app.post 等語法的意思了，它不是說 listen 到 /todos，就轉到某個網址，而是 listen 到 /todos，就做後面的匿名函式
app.post('/todos', (req, res) => {
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

app.get('/todos/:id', (req, res) => {
  const id = req.params.id
  return Todo.findById(id)
    .lean()
    .then(todo => res.render('detail', { todo }))
    .catch(error => console.log(error))
})

app.get('/todos/:id/edit', (req, res) => {
  const id = req.params.id
  return Todo.findById(id)
    .lean()
    .then(todo => res.render('edit', { todo }))
    .catch(error => console.log(error))
})

app.put('/todos/:id', (req, res) => {
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

app.delete('/todos/:id', (req, res) => {
  const id = req.params.id
  return Todo.findById(id)
    // .then(console.log(Boolean(Todo.findById(id))))  // 沒試成
    .then(todo => todo.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`)
})
