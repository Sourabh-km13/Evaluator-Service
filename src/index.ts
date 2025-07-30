import express from "express";
import { Port } from "./config/index";
import apiRouter from "./routes/index";
import sampleQueueProducer from "./producer/Sample.producer";
import SampleWorker from "./worker/Sample.worker";


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
  SampleWorker('SampleQueue')
  sampleQueueProducer("SampleJob",{
    name:"Sourabh",
    company:"Hack2skill",
    postion:"Intern",
    location:"Noida"
  })
});
