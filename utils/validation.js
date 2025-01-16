const validator = require('validator')

const validateSignUpData = (req) => {
    const { firstName, lastName, password } = req.body

    if(!firstName || !lastName){
        throw new Error("Invalid Name")
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("Password is weak")
    }
}

module.exports = { validateSignUpData }