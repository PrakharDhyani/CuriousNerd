// Mongodb project username and passsword -: CuriousNerds

import express from "express"
import bodyParser from "body-parser"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cors from "cors"
import AuthRoute from "./Routes/AuthRoute.js"
import UserRoute from "./Routes/UserRoute.js"
import PostRoute from "./Routes/PostRoute.js"
import uploadRoute from "./Routes/uploadRoute.js"
import ChatRoute from "./Routes/ChatRoute.js"
import MessageRoute from "./Routes/MessageRoute.js"


//Routes
const app = express();

//to serve images for public
app.use(express.static('public'))
app.use("/public", express.static("public"))

// Middlewares
//limit : Controls the maximum request body size.
// extended : The extended option allows to choose between parsing the
//         URL - encoded data with the querystring library(when false)
//          or the qs  library(when true).

app.use(bodyParser.json({ limit: "30mb", extended: true }))
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }))
app.use(cors());
dotenv.config()


const PORT = process.env.PORT;
mongoose.connect(process.env.Mongo_DB, { useNewURLParser: true, useUnifiedTopology: true }).then(() => {
    app.listen(PORT, () => {
        console.log(`app is listening at ${PORT}`)
    })
})
    .catch((error) => { console.error(); })


//usage of routes
app.use("/auth", AuthRoute);
app.use("/user", UserRoute);
app.use("/post", PostRoute)
app.use("/upload", uploadRoute);
app.use("/chat", ChatRoute);
app.use("/message", MessageRoute);

