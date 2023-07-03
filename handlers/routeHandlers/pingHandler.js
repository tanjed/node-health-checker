/**
 * Name : Ping Handler
 * Description : This script will handle the ping requests
 * 
 */


//Module scaffolding
const handler = {}

const pingHandler = (requestPayload, callback) => {
    return callback(200, {
        message : 'pong'
    })
}

module.exports = handler;