import express from "express";
import "./db/index";
import dummyRouter from "./routes/dummyRoute";

const app = express();
const port = 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//dummy Route
app.use("/dummy", dummyRouter);
