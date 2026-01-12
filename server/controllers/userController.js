import Job from "../models/job.js"
import JobApplication from "../models/JobApplication.js"
import User from "../models/user.js"
import {v2 as cloudinary} from 'cloudinary'

//get user Data
export const getUserData = async(req, res) =>{
    //when we pass token from fontend clerk middlwware will convert it into .auth object
    const userId = req.auth.userId

    try{

        const user = await User.findById(userId)

        if(!user){
            return res.json({
                success: true,
                message: "user not found"
            })
        }

        res.json({
            success: true,
            user
        })
    }catch(err){
        res.json({
            success: true,
            message: err.message
        })
    }
}


//appply for a job

export const applyForJob = async(req, res) =>{

        const { jobId } = req.body

        const userId = req.auth.userId

        try{
            const isAlreadyApplied = await JobApplication.find({jobId, userId})

            if(isAlreadyApplied.length > 0){
                return res.json({
                    success: false,
                    message: "already applied"
                })
            }

            const jobData = await Job.findById(jobId)

            if(!jobData){
                return res.json({
                    success: false,
                    message: 'Job not found'
                })
            }

            await JobApplication.create({
                companyId: jobData.companyId,
                userId,
                jobId,
                date : Date.now()
            })

            res.json({
                success: true,
                message: 'Applied successfully'
            })

        }catch(err){
            res.json({
                success:false,
                message: err.message
            })

        }
}

//get user applied apllications
export const getUserJobApplications = async(req, res) => {

    try{
        const userId = req.auth.userId

        const applications = await JobApplication.find({userId})
        .populate('companyId' , 'name email image')
        .populate('jobId', 'title description location category level salary')
        .exec()

        if(!applications){
            return res.json({
                success: false,
                message: 'No job applications found for this user'
            })
        }

        return res.json({
            success: true,
            applications
        })
    }catch(err){
        res.json({
            success: false,
            message: err.message
        })
    }
}

//update user profile(resume)
export const updateUserResume = async(req, res) => {
    try{

        const userId = req.auth.userId
        const resumeFile = req.resumeFile
        
        const userData = await User.findById(userId)
        
        if(resumeFile){
            const resumeUpload = await cloudinary.uploader.upload(resumeFile.path)
            userData.resume = resumeUpload.secure_url
        }
        
        await userData.save()
        
        return res.json({
            success: true,
            message: 'Resume updated'
        })
    }catch(err){
        res.json({
            success: false,
            message: err.message
        })
    }
}