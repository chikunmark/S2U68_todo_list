const db = require('../../config/mongoose')
const Todo = require('../todo')

db.once('open', () => {
  // console.log('mongodb connected!') // 也已寫過，可局部拿掉
  for (let i = 0; i < 10; i++) {
    Todo.create({ name: `name-${i}` })
  }
  console.log('done.')
})

