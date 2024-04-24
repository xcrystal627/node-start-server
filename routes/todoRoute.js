


// router.get('/', async (req, res) => {
//     try {
//         const todos = await Todo.find()

//         if (!todos) {
//             return res.status(400).json({ msg: 'There is no profile for this user' });
//         }

//         return res.json({todos:todos});
//     } catch (err) {
//         console.error(err.message);
//         return res.status(500).send('Server Error');
//     }
// });


// router.post('/', async (req, res) => {
//     try {
//         const newTodo = new Todo({
//             title   : req.body.title,
//             status  : req.body.status
//         })
//         await newTodo.save();
//         return res.json({newItem:newTodo});
//     } catch (err) {
//         console.error(err.message);
//         return res.status(500).send('Server Error');
//     }
// });


// router.delete('/:todo_id', async (req, res) => {
//     try {
//         await Todo.findOneAndRemove({ _id: req.params.todo_id });

//         return res.json({
//             msg         : 'Deleted Todo',
//             todo_id     : req.params.todo_id
//         });
//         // Todo.findOneAndRemove({ _id: req.params.todo_id })
//         //     .then(item =>{
//         //     })
//     } catch (err) {
//         res.status(500).send('Server Error');
//     }
// });

// router.put("/:todo_id",  async (req, res) => {
//     try {
//         const todo = await Todo.findOne({ _id: req.params.todo_id });
//         todo.title = req.body.title;
//         todo.status = req.body.status;

//         await todo.save();
//         return res.json({updatedItem:todo});
//     } catch (err) {
//         console.error(err.message);
//         return res.status(500).send('Server Error');
//     }
// });




var express = require('express');
var router = express.Router();
var todoController = require('./../controllers/todoController');
 
router
    .get('/', todoController.getAll)
    .get('/:todo_id', todoController.getById)
    .post('/', todoController.createNew)
    .put('/:todo_id', todoController.updateById)
    .delete('/:todo_id', todoController.deleteById)
    .post('/deletemany', todoController.deleteMany)
    .post('/updatemany', todoController.updateMany)
    .post('/search', todoController.searchByKeyword)

module.exports = router;
