import express from 'express'
import { changeJobApplicationStatus, changeVisiblity, getCompanyData, getCompanyJobApplicants, getCompanyPostedJobs, loginCompany, postJob, registerCompany } from '../controllers/companyController.js'
import upload from '../config/multer.js'
import { protectCompany } from '../middleware/authMiddleware.js'

const router = express.Router()

 //register a compnay
router.post('/register',upload.single('image'), registerCompany)

// login to company
router.post('/login', loginCompany)

// Get company data
router.get('/get-company',protectCompany,  getCompanyData)

// post a job
router.post('/post-job',protectCompany, postJob)

//get applicants Data of company
router.get('/applicants',protectCompany, getCompanyJobApplicants)

//get a company job list
router.get('/list-jobs',protectCompany, getCompanyPostedJobs)

//change applications status
router.post('/change-status',protectCompany, changeJobApplicationStatus)

// Chnage Applications visibility
router.post('/change-visibility',protectCompany, changeVisiblity)

export default router

