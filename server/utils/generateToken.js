import jwt from 'jsonwebtoken'

const generateToken = (id) =>{
    //company id added as payload data for jwt
    return jwt.sign({id}, process.env.JWT_SECRET,{
        expiresIn: '30d',
    } )
}

export default generateToken