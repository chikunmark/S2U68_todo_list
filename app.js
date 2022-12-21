const express = require('express')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const exphbs = require('express-handlebars')

const routes = require('./routes/index') // 可不寫 /index，因為預設會去找它
// 有關連線到 DB (mongoose) 的設定，也全都移到 mongoose.js，只剩載入指令 (如下)
require('./config/mongoose')

const port = 3000
const app = express()

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

// 用 app.use 規定每一筆請求都需要透過 body-parser 進行前置處理
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method')) // 只要代入 _method，它後面的內容就會直接轉換成對應的 HTTP method
app.use(routes) // 要使用這個做為路由器檔案

// 首頁的路由不用了，因為被搬到 home.js
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

// 其他原本在這的路由，也都被搬到 todo.js 去了

app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`)
})