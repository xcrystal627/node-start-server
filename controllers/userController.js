const User = require('../models/User');
const {userSignUpValidation, userSignInValidation, userUpdateValidation} = require('../utils/userValidation')
const _ = require('lodash');
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken");
const key = require('../config/key');

module.exports = {
    signUp :  async (req, res) => {
        try {
            const { firstname, lastname, email, password } = req.body;
            const error = userSignUpValidation(firstname, lastname, email, password);

            if(!_.isEmpty(error)) {
                return res.status(400).json({error: error});
            }
            const newUser = new User({
                firstname   : firstname,
                lastname    : lastname,
                email       : email,
                password    : password
            })

            const user = await User.findOne({email: email});

            if(user) {
                return res.status(400).json({msg: "The Email address is already using.."})
            }

                      
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser.save()
                        .then(_newUser => {
                            return res.json({ newUser: newUser });
                        })
                        .catch(err => {
                            return res.status(500).json({msg: 'Server Error'});
                        })
                })
            });
            
        } catch (err) {
            return res.status(500).json({msg: 'Server Error'});
        }
    },

    signIn :  async (req, res) => {
        try {
            const { email, password } = req.body;
            let error = userSignInValidation( email, password);

            if(!_.isEmpty(error)) {
                return res.status(400).json({error: error});
            }

            const user = await User.findOne({email: email});

            if( !user) {
                return res.status(400).json({msg: "The Email address is not existed"})
            } else {      
                bcrypt.compare(password, user.password)
                    .then(isMatch => {
                        if (isMatch) {
                            const payload = { 
                                id          : user._id, 
                                firstname   : user.firstname, 
                                lastname    : user.lastname, 
                                email       : user.email,
                                role        : user.role 
                            }; 

                            jwt.sign( payload,  key.security, { expiresIn: 3600 },  (err, token) => {
                                return res.json({
                                    msg: "Sign in successfully",
                                    token: 'Bearer ' + token
                                });
                            });
                        } else {
                            error.password = 'Password incorrect';
                            return res.status(400).json({error: error});
                        }
                  });
            }
        } catch (err) {
            return res.status(500).json({msg: 'Server Error'});
        }
    },

    getAll: async (req, res) => {
        try {
            const users = await User.find()
    
            if (!users) {
                return res.status(400).json({ msg: 'There is no profile for this user' });
            }
    
            return res.json({users:users});
        } catch (err) {
            console.error(err.message);
            return res.status(500).json({msg: 'Server Error'});
        }
    },

    getById: async (req, res) => {
        try {
            const user =  await User.findOne({ _id: req.params.user_id });

            if(user) {
                return res.json({ user : user });
            } else {
                return res.status(400).json({msg: "The user is not existed"})
            }

        } catch (err) {
            return res.status(500).json({msg: 'Server Error'});
        }
    },

    deleteById: async (req, res ) => {
        try{
            const user = await User.findOneAndRemove({ _id: req.params.user_id });
            if(user) {
                return res.json({
                    msg         : 'Deleted the user successfully',
                    user_id     : req.params.user_id
                });
            } else {
                return res.status(400).json({msg: "The user is not existed"})
            }

        } catch (err){
            return res.status(500).json({msg: 'Server Error'});
        }
    },

    updateById: async (req, res) => {
        try {
            const { firstname, lastname, password } = req.body;
            const error = userUpdateValidation(firstname, lastname, password);
            
            if(!_.isEmpty(error)) {
                return res.status(400).json({error: error});
            }

            const user = await User.findOne({ _id: req.params.user_id });
            if(user) {
                user.firstname = firstname;
                user.lastname = lastname;
                user.password = password;
                
                await user.save();

                return res.json({ updatedUser : user });
            } else {
                return res.status(400).json({msg: "The user is not existed"})
            }

        } catch (err) {
            return res.status(500).json({msg: 'Server Error'});
        }
    },
    
    // other functions //////////////////////////////////////////////////////////////////////////////////
    searchByKeyword: async (req, res) => {

        try{
            let { keyword } = req.body;
            // can't use search function for number.
            const users = await User.find({
                $or: [
                    { firstname: { $regex: `.*${keyword}.*`, $options: 'i' } },
                    { lastname: { $regex: `.*${keyword}.*`, $options: 'i' } }, 
                    { email: { $regex: `.*${keyword}.*`, $options: 'i' } }
                ]
            });

            return res.json({ users : users });
        } catch (err) {
            return res.status(500).json({msg: 'Server Error'});
        }
    },

    deleteMany: async (req, res) => {
        try{
            const {ids} = req.body;
            if(ids.length > 0) {
                const users = await User.deleteMany({  _id: {$in: ids} });

                // const {status} = req.body;
                // await Todo.deleteMany({ status: status });
    
                return res.json({ msg : `Deleted ${users.length} /  ${ids.length}  successfully` });
            } else {
                return res.status(400).json({ msg : `Nothing users` });
            }

        } catch (err) {
            return res.status(500).json({msg: 'Server Error'});
        }
    },

    updateMany: async (req, res) => {
        try{
            const { ids, newStatus } = req.body;

            const result = await Todo.updateMany({ _id: {$in : ids} }, { status: newStatus });

            // const { oldStatus, newStatus } = req.body;

            // // condition, updated content
            // const result = await Todo.updateMany({ status: oldStatus }, { status: newStatus });
            
            if(result.nModified > 0) {
                return res.json({ msg : `Updated to ${newStatus} (${result.length} /  ${ids.length}) successfully` });  
            } else {    
                return res.json({ msg : `Nothing anything to be updated` });  
            }
          
        } catch (err) {
            return res.status(500).json({msg: 'Server Error'});
        }
    }
};
