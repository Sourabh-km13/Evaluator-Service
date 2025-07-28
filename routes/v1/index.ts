import express from "express";

const v1router = express.Router();

v1router.get("/ping", (req, res) => {
  return res.json({
    "message": "pong",
  });
});
export default v1router;