import Company from "../models/company.js";
import bcrypt from 'bcrypt'
import {v2 as cloudinary} from 'cloudinary'
import generateToken from "../utils/generateToken.js";
import Job from "../models/job.js";

//Register a new company
export const registerCompany = async (req, res) => {

   console.log(req.body)
    const {name, email, password} = req.body
    //used multer to get image from the form
    const imageFile = req.file;

    if(!name || !email || !password || !imageFile){
        return res.json({success:false , message : "missing details"})
    }

    try {
        const companyExists = await Company.findOne({email})
        if(companyExists){
            return res.json({success: false, message : "Comapny already registered"})
        }

        //we are hashhing the password so it will store safe
        //salt is extra variable added to password to generate hashed password
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)

        const imageUpload = await cloudinary.uploader.upload(imageFile.path)

        const company = await Company.create({
            name, email, 
            password : hashPassword,
            image : imageUpload.secure_url
        })

        res.json({
            success : true,
            company : {
                _id : company._id,
                name : company.name,
                email : company.email,
                image : company.image
            },
            token : generateToken(company._id)
        })
    }catch(err){
        res.json({
            sucess: false,
            message: err.message
        })
    }

}

//Company login

export const loginCompany = async (req, res) => {

    const {email, password} = req.body

    try{
        //find company in database
        const company = await Company.findOne({email})
        
        //check if password match
        if(await bcrypt.company(password, company.password)){
            res.json({
                sucess : true,
                company : {
                    _id : company._id,
                    name : company.name,
                    email : company.email,
                    image : company.image
                },
                token : generateToken(company._id)
                
            })
        }else{
            //if password don't match then give message
            res.json({
                sucess : true,
                message: 'Invalid email or password'
            })
        }


    }catch(err){

    }

}

//get company data
export const getCompanyData = async (req, res) =>{

    
    try{
        const company = req.company

        res.json({
            success: true,
            company
        })
    }catch(err){
        res.json({
            success: true,
            message: err.message
        })
    }
}

//post a new job
export const postJob = async (req, res) => {
      const {title, category, description, location, salary, level} = req.body
      
      const companyId = req.company._id

      try{
        const newJob = new Job({
            title,
            category,
            description,
            location,
            salary,
            level,
            companyId,
            date : Date.now()
        })

        await newJob.save()

        res.json({
            success: true,
            newJob
        })

      }catch(err){

        res.json({
            success : false,
            message : err.message
        })
      }

      
}

//get company job applicanats
export const getCompanyJobApplicants = async(req, res) =>{


}

//get company posted jobs
export const getCompanyPostedJobs = async (req, res) =>{

    try{
        const companyId = req.compnay._id

        const jobs = await Job.find({companyId})

        res.json({
            success: true,
            jobsData : jobs
        })
    }catch(err){

        res.json({
            success: false,
            message: err.message
        })

    }
}


//change job application status
export const changeJobApplicationStatus = async (req, res) =>{

         
}

//change job visible
export const changeVisiblity = async(req, res) =>{

        try{
            const {id} = req.body

            const companyId = req.company._id
            const job = await Job.findById(id)

            //check if job and company id are same
            if(companyId.toString() === job.companyId.toString()){
                job.visible = !job.visible
            }

            await job.save()

            res.json({
                success: true,
                job
            })
        }catch(err){
            res.json({
                success: true,
                message: err.message
            })
        }
}
