## DevTinder API List

# authRouter
-POST /signup
-POST /login
-POST /logout

# profileRouter
-GET /profile/view
-POST /profile/edit
-POST /profile/password

# connnectionRequestRouter
-POST /profile/send/:status/:userId
-POST /profile/review/:status/:requestId

# userRouter
-GET /user/requests/received
-GET /user/connections
-GET /user/feed

Status: interested, ignored, accepted, rejected