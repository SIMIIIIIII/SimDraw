import mongoose, { Connection } from "mongoose";
import { MONGODB_URI } from './env'

mongoose.connect(MONGODB_URI);
export const db : Connection = mongoose.connection;