import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import "./config/instrument.js"
import * as Sentry from "@sentry/node"

import connectDB from './config/db.js'
import './config/instrument.js'
import { clerkWebhooks } from './controllers/webHooks.js'
import companyRoutes from './routes/comanyRoutes.js'
import jobRoutes from './routes/jobRoutes.js'
import userRoutes from './routes/userRoutes.js'
import connectCloudinary from './config/cloudinary.js'
import {clerkMiddleware} from '@clerk/express'

//Initialize Express
const app = express()

//connect to database
connectDB().then((res) => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

await connectCloudinary()



app.post('/api/webhooks',express.raw({ type: 'application/json' }), clerkWebhooks)

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

//middleware
app.use(cors())
app.use(clerkMiddleware())

//Routes
app.get('/', (req, res) => res.send("API working"))


app.use('/api/company', companyRoutes)

app.use('/api/jobs', jobRoutes)

app.use('/api/users', userRoutes)


//port
const PORT = process.env.PORT || 5000

//set up for sentry
Sentry.setupExpressErrorHandler(app);





app.listen(PORT, () => {

    console.log(`server is running on port ${PORT}`)
})