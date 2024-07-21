import { connect } from "mongoose";
import 'dotenv/config';
const connectToMongo = async () => {
  try {
    await connect('mongodb+srv://dhruvsharma7016:12345n%40M%40n@merndatabase.oxvznlv.mongodb.net/eNotebook');
    console.log("---***Database Connected Successfully***---")
  } catch (error) {
    console.log(error);
  }
}

export default connectToMongo;