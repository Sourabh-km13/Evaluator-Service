import logger from "../config/logger.config"
import SampleQueue from "../queues/Sample.queue"

async function sampleQueueProducer(name:string , payload:Record<string,unknown>) {
    logger.info('adding a job in the queue')
    await SampleQueue.add(name , payload)
    console.log("successfully added new job")
}



export default sampleQueueProducer
