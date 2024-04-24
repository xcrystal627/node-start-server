const mongoose = require('mongoose');
const dbURL = "mongodb://127.0.0.1:27017/mail-service"

const connectDB = async () => {
    try {
        console.log("preparing to connect database......")
        await mongoose.connect(dbURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('MongoDB connected successfully');
    } catch (err) {
        console.error(err.message); 
    }
};

module.exports = connectDB;
