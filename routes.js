/**
 * Name : Routes
 * Description : This file will contain all the routes
 * 
 */

//Dependencies
const { pingHandler } = require('./handlers/routeHandlers/pingHandler')

const routes = {
    ping : pingHandler
}

module.exports = routes