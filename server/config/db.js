import mongoose from "mongoose";

//Function to connect to the MongoDb Database

const connectDB = async () => {
    mongoose.connection.on('connected', 
        () => console.log('Database Connected')
    )

    await mongoose.connect(`${process.env.ATLAS_URL}/job-portal`)
}


export default connectDB