const Todo = require('../models/Todo');


module.exports = {
    createNew :  async (req, res) => {
        try {
            const newTodo = new Todo({
                title   : req.body.title,
                status  : req.body.status
            })
            await newTodo.save();
            return res.json({newItem:newTodo});
        } catch (err) {
            return res.status(500).json({msg: 'Server Error'});
        }
    },

    getAll: async (req, res) => {
        try {
            const todos = await Todo.find()
    
            if (!todos) {
                return res.status(400).json({ msg: 'There is no profile for this user' });
            }
    
            return res.json({todos:todos});
        } catch (err) {
            console.error(err.message);
            return res.status(500).json({msg: 'Server Error'});
        }
    },

    getById: async (req, res) => {
        // console.log(req.params.todo_id)
        try {
            const item =  await Todo.findOne({ _id: req.params.todo_id });

            return res.json({
                todoItem     : item
            });
        } catch (err) {
            return res.status(500).json({msg: 'Server Error'});
        }
    },

    deleteById: async (req, res ) => {
        try{
            await Todo.findOneAndRemove({ _id: req.params.todo_id });
            return res.json({
                msg         : 'Deleted Todo',
                todo_id     : req.params.todo_id
            });

        } catch (err){
            return res.status(500).json({msg: 'Server Error'});
        }
    },
    updateById: async (req, res) => {
        try {
            const { title, status } = req.body;

            const todo = await Todo.findOne({ _id: req.params.todo_id });
            todo.title = title;
            todo.status = status;
    
            await todo.save();

            return res.json({ updatedItem : todo });
        } catch (err) {
            return res.status(500).json({msg: 'Server Error'});
        }
    },
    
    // other functions //////////////////////////////////////////////////////////////////////////////////
    searchByKeyword: async (req, res) => {

        try{
            let { keyword } = req.body;
            // can't use search function for number.
            const todos = await Todo.find({
                $or: [
                    { title: { $regex: `.*${keyword}.*`, $options: 'i' } },
                    { id: { $regex: `.*${keyword}.*`, $options: 'i' } } 
                ]
            });

            return res.json({ todos : todos });
        } catch (err) {
            return res.status(500).json({msg: 'Server Error'});
        }
    },

    deleteMany: async (req, res) => {
        try{
            const {ids} = req.body;
            
            await Todo.deleteMany({  _id: {$in: ids} });

            // const {status} = req.body;
            // await Todo.deleteMany({ status: status });

            return res.json({ msg : "Deleted successfully" });
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
                return res.json({ msg : `Updated to ${newStatus} successfully` });  
            } else {    
                return res.json({ msg : `Nothing anything to be updated` });  
            }
          
        } catch (err) {
            return res.status(500).json({msg: 'Server Error'});
        }
    }
};
