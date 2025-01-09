const mongoose = require('mongoose')
const validator = require('validator')

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        default: "John"
    },
    lastName: {
        type: String,
        required: true,
        default: "Doe"
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Email incorrect")
            }
        }
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        min: 18
    },
    gender: {
        type: String,
        validate(value){
            if(!["Male", "Female", "Gay", "Bisexual"].includes(value)){
                throw new Error("Gender data [ "+ value + " ] is not valid")
            }
        }
    },
    skills: [String]
},
{timestamps: true})

module.exports = mongoose.model("User", userSchema)