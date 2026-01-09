import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import "./config/instrument.js"
import * as Sentry from "@sentry/node"

import connectDB from './config/db.js'
import './config/instrument.js'
import { clerkWebhooks } from './controllers/webHooks.js'


//Initialize Express
const app = express()

//connect to database
connectDB().then((res) => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

//middleware
app.use(cors())


//Routes
app.get('/', (req, res) => res.send("API working"))

app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});

app.post('/api/webhooks', clerkWebhooks)

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
//port
const PORT = process.env.PORT || 5000

//set up for sentry
Sentry.setupExpressErrorHandler(app);

app.listen(PORT, () => {

    console.log(`server is running on port ${PORT}`)
})