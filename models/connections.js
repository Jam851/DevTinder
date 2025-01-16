const mongoose = require('mongoose')

const connectionRequest = mongoose.Schema({
    fromUserId: {
        type: String,
        required: true,
        ref: "User"         //Reference to User Collection
    },
    toUserId: {
        type: String,
        required: true,
        ref: "User" 
    },
    status: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("ConnectionRequest", connectionRequest)