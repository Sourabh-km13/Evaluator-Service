import { Job, Worker } from "bullmq";
import SubmissionJob from "../jobs/Submission.job";
import redisConnection from "../config/redis.config";

export default function SubmissionWorker(queueName: string) {
  new Worker(
    queueName,
    async (job: Job) => {
      if (job.name === "SubmissionJob") {
        const submissionJobInstance = new SubmissionJob(job.data);
        console.log("calling handler of job");
        submissionJobInstance.handle(job);
        return true;
      }
    },
    {
      connection: redisConnection,
    },
  );
}
