/**
 * Title: Worker Module
 * Description: This script will act as a worker module.
 * Author: Tanjed
 * Date: 2023-07-06
 * 
 */

const libStorage = require('./lib/data');
const http = require('http')
const https = require('https')

//Module scaffolding
const worker = {}

worker.init = () => {
    console.log('Listening to notification loop');
    setInterval(() => {
        worker.gatherChecks()
    }, process.env.WORKER_INTERVAL_IN_SEC * 1000)
    worker.gatherChecks()
}

worker.gatherChecks = () => {
    libStorage.list(`${process.env.CHECK_DATA_DIR}`, (files) => {
        files.forEach(element => {
            element = element.replace('.json', '')
            worker.validateCheck(element)
        });
    })
}

worker.validateCheck = (element) => {
    libStorage.get(`${process.env.CHECK_DATA_DIR}/${element}`, (err, data) => {
        if (!err) {
            data = JSON.parse(data)
            worker.performCheck(data)
        }
    })
}

worker.performCheck = (data) => {
    const parsedUrl = new URL(data.url)
    const requestEngine = parsedUrl.protocol == 'http' ? http : https
    const requestPayload = {
        protocol : parsedUrl.protocol,
        hostname : parsedUrl.host,
        path : parsedUrl.pathname,
        method : data.method,
        timeout : data.timeout * 1000
    }
    let outcomeSent = false
    let req = requestEngine.request(requestPayload, (res) => {
        if(!outcomeSent) {
            const outcomePayload = {
                error : false,
                value : null,
                responseCode : res.statusCode
            }
            outcomeSent = true
            worker.updateCheck(data, outcomePayload)
        }
    })
   
    req.on('error', (err) => {
        if(!outcomeSent) {
            const outcomePayload = {
                error : true,
                value : err,
                responseCode : 0
            }
            outcomeSent = true
            worker.updateCheck(data, outcomePayload)
        }
    })
    req.on('timeout', () => {
        if(!outcomeSent) {
            const outcomePayload = {
                error : true,
                value : 'timeout',
                responseCode : 0
            }
            outcomeSent = true
            worker.updateCheck(data, outcomePayload)
        }
    })
    req.end()
}

worker.updateCheck = (previousData, newStatus) => {
    previousData.error_codes.push(0)
    const isDown = previousData.error_codes.includes(newStatus.responseCode)
    previousData.error_codes.pop()
    if(previousData.is_down != isDown) {
        previousData.is_down = isDown
        previousData.last_notified_at = new Date()
        const shouldAlert = isDown && previousData.last_notified_at <= new Date()
        libStorage.update(`${process.env.CHECK_DATA_DIR}/${previousData.id}`, previousData, (err) => {
            if (!err && shouldAlert) {
                 //send twilio sms   
                 console.log('SENT Twilio SMS');   
            }
        })

    }
}

module.exports = worker