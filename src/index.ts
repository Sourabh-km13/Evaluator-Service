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
import runJava from "./containers/runJavaDocker";
import { Cpp_Image } from "./utils/constants";
import runcpp from "./containers/runCpp";
import SubmissionWorker from "./worker/Submission.worker";
import SubmissionQueueProducer from "./producer/Submission.producer";
import SubmissionQueue from "./queues/Submission.queue";

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/admin/queues");
const { addQueue, removeQueue, setQueues, replaceQueues } = createBullBoard({
  queues: [new BullMQAdapter(SampleQueue), new BullMQAdapter(SubmissionQueue)],
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

  SubmissionWorker("SubmissionQueue");

  // const code = `x= input();y= input();print("value of x is:", x);print("value of y is:", y);`;
  // runPython(code, "100\n200");

  // const code = `
  // import java.util.*;
  // public class Main{
  //   public static void main(String[] args){
  //     Scanner sc = new Scanner(System.in);
  //     int input = sc.nextInt();
  //     for(int i =0;i<input;i++){
  //       System.out.println(i);
  //     }
  //   }
  // }
  // `;
  // runJava(code, "100");
  const inputCase = "10";
  const code = `
  #include <iostream>
  using namespace std;
  int main(){
    int x;
    cin>>x;
    cout<<"value of x is:"<<x<<endl;
    for(int i = 0; i < x; i++){
      cout<<i <<" ";
    }
    return 0;
  }
  `;
  SubmissionQueueProducer({
    "1234": {
      language: "cpp",
      inputCase,
      code,
    },
  });
  // runcpp(code, "10");
});
