const user = require("../models/user")
const User = require("../models/user")
const jwt = require("jsonwebtoken")

const userAuth = async (req, res, next) => {
    try{
        const { loginToken } = req.cookies

        if(!loginToken){
            throw new Error("Token does not exist")
        }

        const decodedObj = await jwt.verify(loginToken, 'DevilSim22_#')

        const { _id } = decodedObj
        const user = await User.findOne({ _id: _id }) 

        if(!user){
            throw new Error("UserId does not exist in DB")
        } 
        req.user = user

        next()
    }
    catch(err){
        res.status(400).send("Error: " + err.message)
    }
}

module.exports = { userAuth }