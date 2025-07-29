
import { Job } from 'bullmq';
import { IJob } from '../types/BullmqJobType';
class SampleJob implements IJob{
    name: string;
    payload?: Record<string, unknown> | undefined; 
    constructor(payload:Record<string,unknown>){
        this.name = this.constructor.name
        this.payload = payload
    }
    handle= (job?: Job) => {

    };
    failed= (job?: Job) => {
        console.log("job failed");
        if(job){
            console.log(job.id);
            
        }
    };

}