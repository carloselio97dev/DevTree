import mongoose from "mongoose";
import  colors from "colors";


export const connectDB= async () => {

    console.log();
    try {
        const {connection}= await mongoose.connect(process.env.MONGO_URI);
        const url=`${connection.host} : ${connection.port}`
        console.log(colors.cyan.bold(`Mongodb conectado en ${url}`));

    } catch (error) {
        console.log(colors.bgRed.white.bold(error.message));
        process.exit(1);
    }
}