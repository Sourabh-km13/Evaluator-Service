import express from "express";
import submissionRouter from "./submission.routes";

const v1router = express.Router();

v1router.get("/ping", (req, res) => {
  return res.json({
    message: "pong",
  });
});
v1router.use("/submissions", submissionRouter);
export default v1router;
