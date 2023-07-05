/**
 * Name : Routes
 * Description : This file will contain all the routes
 * 
 */

//Dependencies
const { pingHandler } = require('./handlers/routeHandlers/pingHandler')
const { userHandler } = require('./handlers/routeHandlers/userHandler')
const { tokenHandler } = require('./handlers/routeHandlers/tokenHandler')
const { checkHandler } = require('./handlers/routeHandlers/checkHandler')

const routes = {
    ping : pingHandler,
    user : userHandler,
    token : tokenHandler,
    check : checkHandler
}

module.exports = routes