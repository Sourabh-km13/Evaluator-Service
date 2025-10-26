import logger from "../config/logger.config";
import ResponseQueue from "../queues/Response.queue";
import { ResponsePayloadType } from "../types/ResponsePayload";

async function ResponseQueueProducer(payload: ResponsePayloadType) {
  logger.info("adding a job in the Response queue");
  await ResponseQueue.add("ResponseJob", payload);
}

export default ResponseQueueProducer;
