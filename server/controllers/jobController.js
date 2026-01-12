
import Job from "../models/job"

//get all jobs
export const getJobs = async(req,res) => {

    try{

        const jobs = await Job.find({visible: true})
        .populate({
            path : 'companyId',
            select : '-password'
        })

        res.json({
            success : true,
            jobs
        })
    }catch(err){

        res.json({
            success: false,
            message : err.message
        })
    }
}

//get a single job by Id

export const getJobById = async (req, res) => {

        try{
            const {id} = req.params

            const jobs = await Job.findById(id)
            .populate({
                path: 'companyId',
                select: '-password'
            })

            if(!job){
                return res.json({
                    success: false,
                    message: 'Job Not Found'
                })
            }

            res.json({
                success: true,
                jobs
            })
        }catch(err){
            res.json({
                success: false,
                message: err.message
            })
        }
}