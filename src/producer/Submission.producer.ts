import SubmissionQueue from "../queues/Submission.queue";
import { SubmissionPayloadType } from "../types/SubmissionPayload";

export default async function SubmissionQueueProducer(
  payload: Record<string, SubmissionPayloadType>,
) {
  await SubmissionQueue.add("SubmissionJob", payload);
  console.log("successfully added new submission job");
}
