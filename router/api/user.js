const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
// require user schema
const gravatar = require('gravatar')
const jwt = require('jsonwebtoken')
const User = require('../../schema/user')
const secretOrKey = require('../../config/keys').secretOrKey
const passport = require('passport')

router.post('/', (req, res) => {
  User.findOne({ username: req.body.username })
    .then((data) => {
      if (data) {
        res.json({ code: 400, msg: 'User already exists.' })
      } else {
        const avatar = gravatar.url(req.body.email, { s: '200', r: 'pg', d: 'mm' })
        bcrypt.genSalt(1, function (err, salt) {
          const user = new User({
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            identity: req.body.identity,
            avatar
          })
          bcrypt.hash(req.body.password, salt, function (err, hash) {
            if (err) throw err
            user.password = hash
            user.save()
              .then((data) => {
                res.json(data)
              })
          })
        })
      }
    })
})


// 用户登录
router.post('/login', (req, res) => {
  User.findOne({ username: req.body.username })
    .then(data => {
      if (!data) {
        res.status(400).json({ code: 400, msg: "User not registered." })
      } else {
        bcrypt.compare(req.body.password, data.password)
          .then((flag) => {
            if (flag) {
              const payload = { id: data.id, username: data.username }
              const  token = jwt.sign(payload, secretOrKey, { expiresIn: 3600 })
              res.json({ code: 0, token: 'Bearer ' + token })
            } else {
              res.json({ code: 400, msg: "Invalid username password pair." })
            }
          })
      }
    })
})

router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({
    id: req.user.id,
    username: req.user.username,
    email: req.user.email,
    identity: req.user.identity
  })
})

module.exports = router