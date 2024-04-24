const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    status: {
        type: Number,
        required: true,
    },
});

module.exports = Todo = mongoose.model('todos', TodoSchema);
