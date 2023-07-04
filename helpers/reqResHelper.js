/**
 * Name: Request Response Handler
 * Description: This script will handle the requests and responses
 * 
 */

//Dependencies
const { StringDecoder } = require('string_decoder')
const routes = require('../routes')
const notFoundHandler = require('../handlers/routeHandlers/notFoundHandler')
const libStorage = require('../lib/data')
const { parseJson } = require('./utilityHelper')

const handleReqRes = (req, res) => {
    let requestData = ''
    const decoder = new StringDecoder('utf-8')

    req.on('data', (data) => {
        requestData += decoder.write(data)
    })
    
    req.on('end', () => {
        requestData += decoder.end()
        const requestPayloads = {
            url :  parseUrl(req),
            method : req.method.toLowerCase(),
            data : parseJson(requestData) 
        }
        
        const pathName = requestPayloads.url.pathname.replace(/^\/+|\/+$/g, '')
        const chosenRoute = routes[pathName] ? routes[pathName] : notFoundHandler 
    
        chosenRoute(requestPayloads, (statusCode, payload) => {
            statusCode = typeof statusCode === 'number' ? statusCode : 500
            payload = typeof payload === 'object' ? payload : {}
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = statusCode
            res.end(JSON.stringify(payload))
        })
        // res.end(requestMethod)
    })
   
    
}

const parseUrl = (req) => {
    const protocol = req.protocol || 'http'
    const hostname =  req.hostname || req.headers.host
    const url = req.originalUrl || req.url
    return new URL(`${protocol}://${hostname}${url}`);
}

module.exports = handleReqRes