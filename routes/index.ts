import express from 'express'
import v1router from './v1/index';

const apiRouter = express.Router()

apiRouter.get("/",(req,res)=>{
    return res.json({"message":"wellcome to api router"})
})
apiRouter.use('/v1',v1router)

export default apiRouter