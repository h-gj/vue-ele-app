const express = require('express')
const router = express.Router()

const Profile = require('../../schema/profile')
const secretOrKey = require('../../config/keys').secretOrKey
const passport = require('passport')


/* 
@route  /api/profiles
@method post
@desc   create a new profile
@acess  private
 */
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  new Profile(req.body)
  .save()
  .then( profile => res.json(profile) )
})


/* 
@route  /api/profiles
@method get
@desc   get all profiles
@acess  private
 */
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile
  .find()
  .then( profiles => res.json(profiles))
})


/* 
@route  /api/profiles/pid
@method get
@desc   get profile
@acess  private
 */
router.get('/:pid', passport.authenticate('jwt', { session: false}), (req, res) => {
  Profile
  .findById(req.params.pid)
  .then( profile => res.json(profile) )
  .catch( err => res.json({ code: 1004, msg: 'Profile not found.'}))
})

/* 
@route  /api/profiles
@method patch
@desc   patch a profile
@acess  private
 */
router.patch('/:pid', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findByIdAndUpdate(req.params.pid, req.body)
    .then( profile => {
      res.json(profile)
    })
    .catch( err => res.json({ code: 1004, msg: 'Profile not found.'}))
})

/* 
@route  /api/profiles
@method delete
@desc   delete profile
@acess  private
 */
router.delete('/:pid', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile
  .findByIdAndDelete(req.params.pid)
  .then( profile => res.json(profile))
  .catch( err => res.json({ code: 1004, msg: 'Profile not found.'}))
})


module.exports = router