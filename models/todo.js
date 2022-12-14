const mongoose = require('mongoose')
const Schema = mongoose.Schema

const todoSchema = new Schema({
  name: {
    type: String,
    required: true  // 是必填欄位，不能為空白
  },  // 先故意不加 ","  看看會怎樣
  done: {
    type: Boolean
  }
})

module.exports = mongoose.model('Todo', todoSchema)