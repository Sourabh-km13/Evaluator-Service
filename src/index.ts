import express from "express";
import { Port } from "./config/index";
import apiRouter from "../routes/index";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", apiRouter);
app.get("/", (req, res) => {
  console.log(req.url);
  return res.json({
    msg: "pong",
  });
});
app.listen(Port, () => {
  console.log("server running on port:", Port);
});
