import mongoose from "mongoose";

export const connectToMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URI);
        console.log("connected to DB");
    } catch(error) {
        console.log("ERROR", error);
    }
}
export default connectToMongoDB;