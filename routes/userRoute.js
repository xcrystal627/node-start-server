
var express = require('express');
var router = express.Router();
var userContoller = require('./../controllers/userController');
const passport = require('passport');
const auth = passport.authenticate('jwt', { session: false });
const { checkUserRole } = require('../utils/authMiddleware');
 
router
    .post('/signup', userContoller.signUp)
    .post('/signin', userContoller.signIn)
    .get('/', checkUserRole(0), userContoller.getAll)
    .get('/:user_id', userContoller.getById)
    .put('/:user_id', userContoller.updateById)
    .delete('/:user_id', userContoller.deleteById)
    .post('/deletemany', userContoller.deleteMany)
    .post('/updatemany', userContoller.updateMany)
    .post('/search', userContoller.searchByKeyword)

module.exports = router;
