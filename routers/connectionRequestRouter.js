const express = require('express')
const connectionRouter = express.Router()
const User = require('../models/user')
const { userAuth } = require("../middlewares/auth")
const ConnectionRequest = require('../models/connections')


connectionRouter.post("/profile/send/userId/:status/:userId", userAuth, async (req, res) => {
    try {
        const { status, userId } = req.params
            
        const ALLOWED_STATUS = ["interested", "ignored"]
        if(!ALLOWED_STATUS.includes(status)){
            throw new Error("Status not allowed")
        }

        const toUserId = await User.findById(userId)
        if(!toUserId){
            throw new Error("User Doesn't Exist")
        }

        if(toUserId.equals(req.user._id)){
            throw new Error("Connection cannot be made with yourself")
        }

        const isAlreadyConnection = await ConnectionRequest.findOne({
            fromUserId: req.user._id,
            toUserId: userId
        })
        if(isAlreadyConnection){
            throw new Error("Connection already Exists with this Person")
        }

        const connectionRequest = await new ConnectionRequest({
            fromUserId: req.user._id,
            toUserId: userId,
            status: status
        })

        connectionRequest.save()
        res.send("Connection Request sent Successfully !!")
    }
    catch(err){
        res.status(400).send("CONNECTION API ERROR: " + err.message)
    }
    
})

connectionRouter.post("/profile/send/requestId/:status/:requestId", userAuth, async (req, res) => {
    try{
        const { status, requestId } = req.params

        const ALLOWED_STATUS = [ "rejected", "accepted" ]
        if(!ALLOWED_STATUS.includes(status)){
            throw new Error("Status not allowed in Connection: Requests")
        }

        const connectionRequest = await ConnectionRequest.findOne({
            fromUserId: requestId,
            toUserId: req.user._id,
            status: "interested"
        })
        if(!connectionRequest){
            throw new Error("Connection Request does not exist")
        }

        connectionRequest.status = status
        connectionRequest.save()
        res.send("Connection Request " + status + " Successfully !!")
    }
    catch(err){
        res.status(400).send("CONNECTION ERROR REQUESTS: " + err.message)
    }
})

module.exports = connectionRouter