const validator = require('validator');

const userSignUpValidation = ( firstname, lastname, email, password) => {
    let error = {}
    if(validator.isEmpty(firstname)) {
        error.firstname = "Name is required";
    } 
    if(validator.isEmpty(lastname)) {
        error.lastname = "Name is required";
    } 

    if( validator.isEmpty(email)) {
        error.email = "Email is required";
    } else if( ! validator.isEmail(email)) {
        error.email = "Email type is invalid";
    } 

    if(validator.isEmpty(password)) {
        error.password = "Password is required";
    } else if(! validator.isLength(password, 8)) {
        error.password = "Password must be over 8";
    }

    return error;
}


const userSignInValidation = (  email, password) => {
    let error = {} 

    if( validator.isEmpty(email)) {
        error.email = "Email is required";
    } else if( ! validator.isEmail(email)) {
        error.email = "Email type is invalid";
    } 

    if(validator.isEmpty(password)) {
        error.password = "Password is required";
    }
    
    return error;
}



const userUpdateValidation = ( firstname, lastname, password) => {
    let error = {}
    if(validator.isEmpty(firstname)) {
        error.firstname = "Name is required";
    } 
    if(validator.isEmpty(lastname)) {
        error.lastname = "Name is required";
    } 

    if(validator.isEmpty(password)) {
        error.password = "Password is required";
    } else if(! validator.isLength(password, 8)) {
        error.password = "Password must be over 8";
    }

    return error;
}



module.exports = { userSignUpValidation, userSignInValidation, userUpdateValidation }