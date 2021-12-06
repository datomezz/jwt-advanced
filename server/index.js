const express = require("express");
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
const router = require("./router");
const errorMiddleware = require("./middleware/error-middleware");

const { PORT, CLIENT_URL } = process.env;

app.use(cookieParser());
app.use(express.json());
app.use(cors({
  credentials : true,
  origin : CLIENT_URL
}));
app.use("/", router);
app.get("/", (req, res) => {
  console.log("coock", req.cookies);
  res.status(200).json({ message: "zdarova" });
})
app.use(errorMiddleware);


const start = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`Server is listening on port : ${PORT}`);
    })
  } catch (err) {
    console.log(err);
  }

}

start();