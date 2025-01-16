const express = require('express')
const app = express()
const authRouter = express.Router()
const User = require('../models/user')
const { validateSignUpData } = require('../utils/validation')
const bcrypt = require('bcrypt')



authRouter.post("/logout", async (req, res) => {
    res.clearCookie('loginToken')
    res.send("Successfully Logged Out !!")
})

authRouter.post("/login", async (req, res) => {
    try{
        const {emailId, password} = req.body

        //Check Email
        const user = await User.findOne({ emailId: emailId })
        if(!user){
            throw new Error("Incorrect Credentials: EmailId")
        }

        //Check Password
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if(isPasswordValid){
            //Token Creation
            const token = await user.getJWT()

            //Wrap in Cookie
            res.cookie("loginToken", token)

            //Response
            res.send("Login Successfull !!")
        }
        else{
            throw new Error("Incorrect Credentials: Password")
        }
    }
    catch(err){
        res.status(400).send("LOGIN ERROR: " + err.message)
    }
})

authRouter.post("/signup", async (req, res) => {
    try{
        //Validation of Data
        validateSignUpData(req) 
        const { firstName, lastName, emailId, password, age, gender, skills } = req.body
        
        //Encryption of Password
        const passwordHash = await bcrypt.hash(password, 10)

        //Creating a new instance of the User model
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash,
            age,
            gender,
            skills
        })

        await user.save()
        res.send("User Added Successfully !!")
    }
    catch(err){
        res.status(400).send("SIGN-IN ERROR: " + err.message)
    }
})

module.exports = authRouter