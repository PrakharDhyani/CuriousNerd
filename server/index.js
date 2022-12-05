// Mongodb project username and passsword -: CuriousNerds

import express from "express"
import bodyParser from "body-parser"
import mongoose from "mongoose"
import dotenv from "dotenv"
import AuthRoute from "./Routes/AuthRoute.js"

//Routes
const app = express();

// Middlewares 
//limit : Controls the maximum request body size.
// extended : The extended option allows to choose between parsing the
//         URL - encoded data with the querystring library(when false) 
//          or the qs  library(when true).
app.use(bodyParser.json({ limit: "30mb", extended: true }))
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }))

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


