/**
 * Name: Request Response Handler
 * Description: This script will handle the requests and responses
 * 
 */

//Dependencies
const { StringDecoder } = require('string_decoder')
const url = require('url')
const routes = require('../routes')
const notFoundHandler = require('../handlers/routeHandlers/notFoundHandler')

const handleReqRes = (req, res) => {
    const requestPayloads = {
        url :  parseUrl(req),
        method : req.method.toUpperCase(),
        data : {}
    }

    const chosenRoute = routes[requestPayloads.url.pathname] ? routes[requestPayloads.url.pathname] : notFoundHandler 

    chosenRoute(requestPayloads, (statusCode, payload) => {
        statusCode = typeof statusCode === 'number' ? statusCode : 500
        payload = typeof payload === 'object' ? payload : {}

        res.statusCode = statusCode
        res.end(JSON.stringify(payload))
    })


    // let requestData = ''
    // const decoder = new StringDecoder('utf-8')


    // req.on('data', (data) => {
    //     requestData += decoder.write(data)
    // })
    
    // req.on('end', () => {
    //     requestData += decoder.end()
    //     console.log(requestData);
    //     res.end(requestMethod)
    // })
   
    
}

const parseUrl = (req) => {
    const protocol = req.protocol || 'http'
    const hostname =  req.hostname || req.headers.host
    const url = req.originalUrl || req.url
    const parsedUrl = new URL(`${protocol}://${hostname}${url}`);
    parsedUrl.pathname = parsedUrl.pathname.replace(/^\/|\/$/g, '')
    return parsedUrl
}

module.exports = handleReqRes