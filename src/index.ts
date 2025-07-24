import express from "express";
import {Port} from "./config/index"
const app = express()
console.log(Port)
app.listen(3000,()=>{
    console.log(
        'server running on port:',Port)
})