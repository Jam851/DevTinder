const express = require('express')
const userRouter = express.Router()
const User = require('../models/user')
const { userAuth } = require("../middlewares/auth")
const ConnectionRequest = require('../models/connections')

//1st & 2nd API have Error for Set Headers mentioned in Notes
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user

        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", "firstName lastName age")

        res.send(res.json({
            message: "Data fetched Successfully !!",
            data: connectionRequests
        }))
    }
    catch(err){
        res.status(400).send("CONNECTION API ERROR: " + err.message)
    }
})

userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user
        const USER_SAFE_DATA = ["firstName", "lastName", "age", "gender", "skills"]

        const connectionRequests = await ConnectionRequest.find({
           $or: [
                { fromUserId: loggedInUser._id, status: "accepted" },
                { toUserId: loggedInUser._id, status: "accepted" }
                ]
        }).populate("fromUserId", USER_SAFE_DATA)
        
        const data = connectionRequests.map((row) => { 
            if(row.fromUserId === loggedInUser._id){
                return row.toUserId
            }
            else{
                return row.fromUserId
            }
        })

        res.send(res.json({
            message: "Data fetched Successfully !!",
            data: data
        }))
    }
    catch(err){
        res.status(400).send("CONNECTION API ERROR: " + err.message)
    }
})

userRouter.get("/user/feed", userAuth, async (req, res) => {
    //We do not want the loggedInUser to see these Accounts on their feed ->
    //1) loggedInUser
    //2) Accounts they have made connection with of any status

    const connectionRequests = await ConnectionRequest.find({
        $or: [{ fromUserId: req.user._id }, { toUserId: req.user._id }]
    }).select("fromUserId toUserId")

    const hideUsersFromFeed = new Set()   //Could also use Array practically but he used Set so I am using it too
    connectionRequests.forEach((k) => {
        if(k.toUserId === req.user._id){
            hideUsersFromFeed.add(k.fromUserId)
        }
        else{
            hideUsersFromFeed.add(k.toUserId)
        }
    })

    const feedData = await User.find({
        $and: [
            { _id: { $nin: Array.from(hideUsersFromFeed) }},
            { _id: { $nin: [ req.user._id ]} }
        ]
    }).select("firstName")

    res.send(feedData)
})

module.exports = userRouter