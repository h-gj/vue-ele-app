const mongoose = require('mongoose')

const profileSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true
  },
  desc: {
    type: String,
    required: true
  },
  income: {
    type: String,
    required: true
  },
  outcome: {
    type: String
  },
  cash: {
    type: String
  },
  remark: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
})

module.exports = profile = mongoose.model('profiles', profileSchema)