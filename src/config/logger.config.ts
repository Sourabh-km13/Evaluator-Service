import winston, { format } from "winston";



const allowedTransports = []

allowedTransports.push(new winston.transports.Console())

winston.addColors({
            info:'cyan',
            error:'red'
        })
const logger = winston.createLogger({
    
    format:winston.format.combine(
        winston.format.timestamp({
            format:'YYYY-MM-DD HH:MM:SS'
        }),
        winston.format.colorize({all:true}),
        winston.format.printf((log)=>{
            return `${log.timestamp} [${log.level}:${log.message}]`
        }),
        
        
    ),
    transports:allowedTransports,
})

export default logger