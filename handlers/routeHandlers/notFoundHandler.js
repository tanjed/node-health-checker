/**
 * Name : Not Found Handler
 * Description : This script will handle the invalid route requests
 * 
 */


const notFoundHandler = (requestPayload, callback) => {
    return callback(404, {
        message : 'Route not found'
    })
}

module.exports = notFoundHandler;