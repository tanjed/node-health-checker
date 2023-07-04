/**
 * Name : Routes
 * Description : This file will contain all the routes
 * 
 */

//Dependencies
const { pingHandler } = require('./handlers/routeHandlers/pingHandler')
const { userHandler } = require('./handlers/routeHandlers/userHandler')

const routes = {
    ping : pingHandler,
    user : userHandler
}

module.exports = routes