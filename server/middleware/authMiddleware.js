import jwt from 'jsonwentoken'
import Company from '../models/company.js'

export const protectCompany = async(req, res) => {
    
    const token = req.headers.token

    if(!token) {
        return res.json({
            success : false,
            message : 'not authorized, login again'
        })
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        
        req.company = await Company.findbyId(decoded.id).select('-password')

        //next middleware needs to called 
        next()
    }catch(err){

        res.json({
            success : false,
            message : err.message
        })
    }
}