import { Webhook } from "svix";
import User from "../models/user.js"

//Api controller function to manage clerk user with databse


export const clerkWebhooks = async (req, res) => {
    

    try{
        // create a Svix instance with clerk webhook secret.
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)

        //Verifying Headers
        const event =  whook.verify(JSON.stringify(req.body), {
            "svix-id" : req.headers["svix-id"],
            "svix-timestamp" : req.headers["svix-timestamp"],
            "svix-signature" : req.headers["svix-signature"]
        })


        //Getting data from request body

        const {data, type} = event

        //switch cases fro different event
        switch(type) {
            case 'user.created' : {

                const userData = {
                    _id : data.id,
                    email : data.email_addresses[0].email_address,
                    name : data.first_name+ " " + data.last_name,
                    image : data.image_url,
                    resume : ''
                }
                await User.create(userData)
                res.json({})
                break;
            }

            case 'user.updated' : {
                const userData = {
                    email : data.email_addresses[0].email_address,
                    name : data.first_name+ " " + data.last_name,
                    image : data.image_url,
                }

                await User.findByIdAndUpdate(data.id, userData)
                res.json({})
                break;
            }

            case 'user.deleted' : {
                await User.findByIdAndDelete(data.id)
                res.json({})
                break;
            }

            default : 
            console.log(event)
            
        }
    } catch (error) {
        res.json({success: false, message : error.message, req.body})
    }
}
