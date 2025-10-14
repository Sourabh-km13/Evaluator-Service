import { Job } from "bullmq";
import { IJob } from "../types/BullmqJobType";
import { SubmissionPayloadType } from "../types/SubmissionPayload";
import createExecutor from "../utils/ExecutorFactory";
import { ExecutionResponseType } from "../containers/codeEvaluatorStrategy";
class SubmissionJob implements IJob {
  name: string;
  payload?: Record<string, SubmissionPayloadType> | undefined;
  constructor(payload: Record<string, SubmissionPayloadType>) {
    this.name = this.constructor.name;
    this.payload = payload;
  }
  handle = async (job?: Job) => {
    if (job && this.payload) {
      const keys = Object.keys(this.payload)[0];
      console.log(keys);
      const language = this.payload[keys].language;
      const code = this.payload[keys].code;
      const testCases = this.payload[keys].inputCase;
      const strategy = createExecutor(language);
      if (strategy !== null) {
        const response: ExecutionResponseType = await strategy.execute(
          code,
          testCases,
        );
        if (response.status === "COMPLETED") {
          console.log("Code executed succesfully");
        } else {
          console.log("Something went wrong");
          console.log(response);
        }
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
