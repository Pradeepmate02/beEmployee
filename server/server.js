import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import "./config/instrument.js"
import * as Sentry from "@sentry/node"

import connectDB from './config/db.js'
import './config/instrument.js'
import { clerkwebhooks } from './controllers/webHooks.js'


//Initialize Express
const app = express()

//connect to database
await connectDB()

//middleware
app.use(cors())
app.use(express.json())

//Routes
app.get('/', (req, res) => res.send("API working"))

app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});

app.post('/webhooks', clerkwebhooks)
//port
const PORT = process.env.PORT || 5000

Sentry.setupExpressErrorHandler(app);

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})