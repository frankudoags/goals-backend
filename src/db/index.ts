import { set, connect, ConnectOptions } from "mongoose";
import * as dotenv from "dotenv";
dotenv.config();

const dbURI = process.env.DB_URI as string;

//clear deprecation warning
set("strictQuery", true);

//connect to mongodb database
connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
} as ConnectOptions)
  .then((_result) => {
    console.log("connected to db");
  })
  .catch((err) => console.log(err));
