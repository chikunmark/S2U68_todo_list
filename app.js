const express = require('express')
const port = 3000

const mongoose = require('mongoose')

// 加入這段 code, 僅在非正式環境時, 使用 dotenv
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const todo = require('./models/todo')

const app = express()
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }) // 設定連線到 mongoDB
const db = mongoose.connection

const exphbs = require('express-handlebars')
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

db.on('error', () => {
  console.log('mongodb error!!')
})

db.once('open', () => {  // 因只會發生一次，所以用 once
  console.log('mongoDB connected!!')
})

app.get('/', (req, res) => {
  // res.send('hello world!') // 引入 handlebars 後就不用了

  // 拿到所有 Todo 資料
  todo.find()  // find 的 () 內也能傳參數做處理
    .lean() // mongoose 做的都不要，我們只要單純地 JS 物件
    // .then(todos => res.render('index', {todos: todos})) // 然後，整理後會有個 todos 資料陣列，把它 render 進 index.hbs 裡
    .then(todos => res.render('index', { todos })) // {todos} 是上面的簡寫，僅在 key/value 一樣時能用 (至少我現在不想用，因為會看不懂資料從哪對應到哪)
    .catch(error => console.error(error)) // 若有錯，把它印出
})

app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`)
})

