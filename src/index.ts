import express from "express";
import { Port } from "./config/index";
import apiRouter from "./routes/index";
import sampleQueueProducer from "./producer/Sample.producer";
import SampleWorker from "./worker/Sample.worker";
import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { ExpressAdapter } from "@bull-board/express";
import SampleQueue from "./queues/Sample.queue";
import runPython from "./containers/runPythonDocker";

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/admin/queues");
const { addQueue, removeQueue, setQueues, replaceQueues } = createBullBoard({
  queues: [new BullMQAdapter(SampleQueue)],
  serverAdapter: serverAdapter,
});
const app = express();

app.use(express.json());
app.use(express.urlencoded());
app.use(express.text());

app.use("/admin/queues", serverAdapter.getRouter());
app.use("/api", apiRouter);
app.get("/", (req, res) => {
  console.log(req.url);
  return res.json({
    msg: "pong",
  });
});

app.listen(Port, () => {
  console.log("server running on port:", Port);
  SampleWorker("SampleQueue");
  sampleQueueProducer("SampleJob", {
    name: "Sourabh",
    company: "Hack2skill",
    postion: "Intern",
    location: "Noida",
  });
  // eslint-disable-next-line quotes
  const code = `x= input();y= input();print("value of x is:", x);print("value of y is:", y);`;
  runPython(code, "100\n200");
});
