const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const bodyParser = require("body-parser");
const passport = require('passport');
const app = express();

const todoRoute =  require('./routes/todoRoute');
const userRoute = require('./routes/userRoute');

app.use(passport.initialize());
require('./config/passport')(passport);


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

connectDB();

app.use('/users', userRoute);
app.use('/todos', todoRoute);


const PORT = process.env.PORT || 5000;

app.listen(5000, () =>{ 
    console.log(`Server started on port: ${PORT}`);
});
