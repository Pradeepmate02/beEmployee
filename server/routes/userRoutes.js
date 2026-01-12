import express from 'express'
import { applyForJob, getUserData, getUserJobApplications, updateUserResume } from '../controllers/userController.js'
import upload from '../config/multer.js'


const router = express.Router()

//get user data
router.get('/user', getUserData)


//apply for a job
router.post('/apply', applyForJob)

//Get applied for Jobs
router.get('/applications', getUserJobApplications)

//update user resume
router.post('/update-resume', upload.single('resume'), updateUserResume)

export default router;