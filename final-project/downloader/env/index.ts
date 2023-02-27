import { config as envconfig } from "dotenv";
envconfig();

export default {
    RABBIT_URI: process.env.RABBIT_URI,
};