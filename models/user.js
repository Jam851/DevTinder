const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')

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
                throw new Error("Invalid Gender Value: " + value)
            }
        }
    },
    skills: {
        type: [String],
        default: undefined,                 //Removes Empty Array from DB
        validate(value){
            if(value.length > 3){
                throw new Error("Skills limit reached of 3: " + value.length)
            }
        }
    },
},
// {timestamps: true}
)

//Token Creation
userSchema.methods.getJWT = async function (){
    const user = this

    const token = await jwt.sign({ _id: user._id }, 'DevilSim22_#', { expiresIn: "7d" })

    return token
}

module.exports = mongoose.model("User", userSchema)