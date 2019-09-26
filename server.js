const express = require('express')
const app = express()
const mongoose = require('mongoose')

const port = process.env.port || 3000
// DB config
const dbURI = require('./config/keys').dbURI
const bodyParser = require('body-parser')
const passport = require('passport')



// DB connect
mongoose.connect(dbURI, { useNewUrlParser: true })
.then(() => {
  console.log('DB connected.')
})
.catch(() => {
  console.log('DB failed to connect.')
})

// user router
const user = require('./router/api/user')
const profile = require('./router/api/profile')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use('/api/users', user)
app.use('/api/profiles', profile)
app.use(passport.initialize())

require('./config/passport')(passport)

app.get('/', (req, res) => {
  res.send('Hello node.js!')
})

app.listen(port, () => {
  console.log(`Server is listening on port ${port}...`)
})