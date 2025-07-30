import SampleQueue from "../queues/Sample.queue"

async function sampleQueueProducer(name:string , payload:Record<string,unknown>) {
    console.log('adding to queue')
    await SampleQueue.add(name , payload)
    console.log("successfully added new job")
}



export default sampleQueueProducer
