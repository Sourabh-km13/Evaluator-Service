import { Job } from "bullmq";
import { IJob } from "../types/BullmqJobType";
import { SubmissionPayloadType } from "../types/SubmissionPayload";
import runcpp from "../containers/runCpp";
class SubmissionJob implements IJob {
  name: string;
  payload?: Record<string, SubmissionPayloadType> | undefined;
  constructor(payload: Record<string, SubmissionPayloadType>) {
    this.name = this.constructor.name;
    this.payload = payload;
  }
  handle = (job?: Job) => {
    console.log("handler of job");
    console.log(this.payload);
    if (job) {
      const keys = Object.keys(this.payload)[0];
      console.log(keys);
      const language = this.payload[keys].language;
      if (language === "cpp") {
        runcpp(this.payload[keys].code, this.payload[keys].inputCase);
      }
    }
  };

  failed = (job?: Job) => {
    console.log("job failed");
    if (job) {
      console.log(job.id);
    }
  };
}
export default SubmissionJob;
