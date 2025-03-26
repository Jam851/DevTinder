const express = require('express')
const connectDB = require('../config/connectDB')
const app = express();
const cookieParser = require('cookie-parser');

const authRouter = require('../routers/authRouter')
const profileRouter = require('../routers/profileRouter')
const connectionRouter = require('../routers/connectionRequestRouter')
const userRouter = require('../routers/userRouter')

app.use(express.json())
app.use(cookieParser())

app.use("/", authRouter)
app.use("/", profileRouter)
app.use("/", connectionRouter)
app.use("/", userRouter)


app.delete("/deleteDocumentById", async (req, res) => {
    const userId = req.body.id

    try{
        const users = await User.findByIdAndDelete(userId)
        if(users.length === 0){
            res.status(404).send("Users with this ID not found")
        }
        else{
            res.send(users)
        }
    }
    catch(err){
        res.status(404).send("Something went wrong while finding User with specified ID")
    }
})


connectDB()
.then(() => {
    console.log("Successfully connected to Database")
    app.listen(7777, () => console.log("Succesfully listening at port 7777...."));
})
.catch((err) => {
    console.log("Database could not be connected !!")
})