import { config as envconfig } from "dotenv";
envconfig();

export default {
    MONGO_URI: process.env.MONGO_URI,
    MONGO_DB: process.env.MONGO_DB,
    RABBIT_URI: process.env.RABBIT_URI,
};