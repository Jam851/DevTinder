const express = require('express')
const profileRouter = express.Router()
const User = require('../models/user')
const { userAuth } = require("../middlewares/auth")
const bcrypt = require('bcrypt')
const validator = require('validator')


profileRouter.get("/profile/view", userAuth, async (req, res) => {
    const { firstName, lastName, emailId, age, gender, skills } = req.user
    try{
        res.json({
                message: "Successfully sent " + req.user.firstName + "'s Profile !!",
                profile: { firstName, lastName, emailId, age, gender, skills }
            })
    }
    catch(err){
        res.status(400).send("ERROR SENDING PROFILE: " + err.message)
    }
})

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try{
        const ALLOWED_UPDATES = [ "firstName", "lastName", "emailId", "age", "gender" ]

        const isAllowed = Object.keys(req.body).every((k) => ALLOWED_UPDATES.includes(k))
        if(!isAllowed){
            throw new Error("Updation is not allowed for requested field")
        }

        await User.findOneAndUpdate(req.user._id, req.body)
        res.send("User Updated Successfully !!")
    }
    catch(err){
        res.status(400).send("ERROR UPDATING USER: " + err.message)
    }
})

profileRouter.patch("/profile/forgotPassword", userAuth, async (req, res) => {
    try{
        const { password } = req.body

        const isAlreadyUsed = await bcrypt.compare(password, req.user.password)
        if(isAlreadyUsed){
            throw new Error("This password is already in use")
        } 
        else if(!validator.isStrongPassword(password)){
                throw new Error("Password is weak")
        }

        const passwordHash = await bcrypt.hash(password, 10)

        req.user.password = passwordHash
        req.user.save()

        res.send("User Updated Successfully !!")
    }
    catch(err){
        res.status(400).send("ERROR UPDATING PASSWORD: " + err.message)
    }
})

module.exports = profileRouter