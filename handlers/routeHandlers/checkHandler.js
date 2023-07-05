/**
 * Name : Check Module
 * Description : Important functions for check functionalities
 * 
 */

//Dependencies
const { validatePayload, verifyToken, createRandomString } = require('../../helpers/utilityHelper')
const libStorage = require('../../lib/data')



//Module scaffolding
const _check = {}
const handler = {}

handler.config = {
    maxCheck : 2
}

handler.allowedMethods = ['post', 'put', 'delete']

handler.checkHandler = (requestPayload, callback) => {
    if (!handler.allowedMethods.includes(requestPayload.method)) {
        return callback(405, {
            message : 'Method not allowed'
        })
    }

    const id = validatePayload(requestPayload.headers._token, 'string')

    libStorage.get(`tokens/token-${id}`, (err, data) => {
        if(err) {
            return callback(404, { 
                message : 'Token not found'
            })
        }
        data = JSON.parse(data)
        verifyToken(id, data.phone, (isTokenVerified) => {
            if (!isTokenVerified) {
                return callback(403, { 
                    message : 'Token expired'
                })
            }
            requestPayload.authenticated_user = data.phone
            return _check[requestPayload.method](requestPayload, callback)
        })
    })
}
    

_check.post = (requestPayload, callback) => {
    const url = validatePayload(requestPayload.data.url, 'url')
    const method = validatePayload(requestPayload.data.method.toLowerCase(), 'string')
    const errorCodes = validatePayload(requestPayload.data.error_codes, 'object')
    const timeout = validatePayload(requestPayload.data.timeout, 'string')
    
    if (!url || !method || !errorCodes || !errorCodes.length || !timeout) {
        return callback(400, {
            message : 'Unprocessable entity'
        })
    }

    libStorage.get(`users/user-${requestPayload.authenticated_user}`, (err, user) => {
        if(err){
            return callback(422, { 
                message : 'User not found'
            })
        }
        user = JSON.parse(user)
        const checkId = createRandomString(10)
        libStorage.create(`checks/${checkId}`, {id : checkId, url : url.href , method, error_codes : errorCodes, timeout}, (err) => {
            if(err){
                return callback(500, { 
                    message : 'Unable to create check'
                })
            }

            const userChecks = typeof user.checks == 'undefined' ? [] : user.checks
            if (userChecks.length >= handler.config.maxCheck) {
                return callback(422, { 
                    message : 'Max check reached'
                })
            }
            userChecks.push(checkId)
            user.checks = userChecks

            libStorage.update(`users/user-${user.phone}`, user, (err) => {
                if(err) {
                    return callback(500, { 
                        message : 'Unable to attach user check'
                    })
                }

                return callback(200, {
                    message : 'Check attach successfully'
                })
            })
        })
    })
    
}
_check.put = (requestPayload, callback) => {
    const checkId = requestPayload.url.searchParams.get('check_id')
    const url = typeof requestPayload.data.url == 'undefined' ? null : validatePayload(requestPayload.data.url, 'url')
    const method = typeof requestPayload.data.method == 'undefined' ? null : validatePayload(requestPayload.data.method.toLowerCase(), 'string')
    const errorCodes = typeof requestPayload.data.error_codes == 'undefined' ? {} : validatePayload(requestPayload.data.error_codes, 'object')
    const timeout = typeof requestPayload.data.timeout == 'undefined' ? null : validatePayload(requestPayload.data.timeout, 'string')

    libStorage.get(`checks/${checkId}`, (err, check) => {
        if (err) {
            return callback(404, {
                message : 'Check not found'
            })
        }
        check = JSON.parse(check)
        if(url) check.url = url.href
        if (method) check.method = method
        if (errorCodes && errorCodes.length) check.error_codes = errorCodes
        if (timeout) check.timeout = timeout

        libStorage.update(`checks/${checkId}`, check, (err) => {
            if(err) {
                return callback(500, { 
                    message : 'Unable to update'
                })
            }
    
            return callback(200, {
                message : 'Check updated',
            })
        })
    })
}
_check.delete = (requestPayload, callback) => {
    const checkId = requestPayload.url.searchParams.get('check_id')

    libStorage.get(`checks/${checkId}`, (err, data) => {
        if(err) {
            return callback(404, { 
                message : 'Invalid check id'
            })
        }
        libStorage.get(`users/user-${requestPayload.authenticated_user}`, (err, user) => {
            if(err) {
                return callback(403, { 
                    message : 'Invalid user'
                })
            }

            user = JSON.parse(user)
            let userChecks = typeof user.checks == 'undefined' ? [] : user.checks
            userChecks = userChecks.filter(function(item) {
                return item !== checkId
            })
            user.checks = userChecks
            libStorage.update(`users/user-${requestPayload.authenticated_user}`, user, (err) => {
                if(err) {
                    return callback(500, { 
                        message : 'Unable to detach user check'
                    })
                }
              
    
                libStorage.delete(`checks/${checkId}`, (err) => {
                    if(err) {
                        return callback(500, { 
                            message : 'Unable to delete'
                        })
                    }
                    return callback(200, {
                        message : 'Check deleted'
                    })
                })
            })
        })
    })
}
_check.list = () => {}


module.exports = handler