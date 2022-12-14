
const mongoose = require('mongoose')
const Todo = require('../todo')
require('dotenv').config()  // 媽的！助教沒寫這必要的一行
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }) // 設定連線到 mongoDB
const db = mongoose.connection


db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', () => {
  console.log('mongodb connected!')

  for (let i = 0; i < 10; i++) {
    Todo.create({ name: `name-${i}` })
  }
  console.log('done.')
})


// const mongoose = require('mongoose')
// const Todo = require('../todo')
// mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

// const db = mongoose.connection
