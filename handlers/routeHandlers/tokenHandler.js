/**
 * Name: Route Handler
 * Description:
 * 
 * 
 */

//Dependencies
const libStorage = require("../../lib/data")
const { hashPassword, parseJson, createRandomString , verifyToken, validatePayload} = require('../../helpers/utilityHelper')
const userDefaultDataDirectory = require('../../handlers/routeHandlers/userHandler').defaultDataDirectory


//Module scaffolding
const handler = {}

handler.allowedMethods = ['get', 'post', 'put', 'delete']
handler.defaultDataDirectory = '/tokens'
const _token = {}

handler.tokenHandler = (requestPayload, callback) => {
    if (!handler.allowedMethods.includes(requestPayload.method)) {
        return callback(405, {
            message : 'Method not allowed'
        })
    }

    return _token[requestPayload.method](requestPayload, callback)
}

//Login
_token.post = (requestPayload, callback) => {
    const phone = validatePayload(requestPayload.data.phone, 'string')
    const password = validatePayload(requestPayload.data.password, 'string', 6) 

    if (!phone || !password) {
        return callback(400, { 
            message : 'Bad request'
        })
    }
    
    libStorage.get(`${userDefaultDataDirectory}/user-${phone}`, (err, user) => {
        if(err){
            return callback(422, { 
                message : 'User not found'
            })
        }

        user = parseJson(user)
        if (user.password != hashPassword(password)) {
            return callback(422, { 
                message : 'Invalid password'
            })
        }

        const tokenId = createRandomString(20)
        const expiredAt = Date.now() + 10 * 60 * 1000
        const tokenPayload = {phone, id: tokenId, expiredAt}
        libStorage.create(`${handler.defaultDataDirectory}/token-${tokenId}`, tokenPayload, (err) => {
            if(err) {
                console.log(err);
                return callback(500, { 
                    message : 'Unable to create token'
                })
            }
            return callback(200, { 
                message : 'Token created successfully',
                data : tokenPayload
            })
        })
    
    })
}
// _token.get = (requestPayload, callback) => {
//     const id = validatePayload(requestPayload.url.searchParams.get('id'), 'string')

//     if (!id) {
//         return callback(400, { 
//             message : 'Bad request'
//         })
//     }

//     libStorage.get(`${handler.defaultDataDirectory}/token-${id}`, (err, data) => {
//         if(err) {
//             return callback(404, { 
//                 message : 'Token not found'
//             })
//         }
//         data = JSON.parse(data)
//         return callback(200, {
//             payload : data
//         })
//     })
// }

//Refresh Token
_token.put = (requestPayload, callback) => {

    const id = validatePayload(requestPayload.url.searchParams.get('id'), 'string')
    const extend = validatePayload(requestPayload.url.searchParams.get('extend'), 'boolean')

    if (!id) {
        return callback(400, { 
            message : 'Bad request'
        })
    }

    libStorage.get(`${handler.defaultDataDirectory}/token-${id}`, (err, data) => {
        if(err) {
            return callback(404, { 
                message : 'Token not found'
            })
        }
    
        if(extend !== true) {
            return callback(400, { 
                message : 'Invalid request'
            })
        }
        
        data = JSON.parse(data)
        data.expiredAt = Date.now() + 60 * 60 * 1000
        libStorage.update(`${handler.defaultDataDirectory}/token-${id}`, data, (err) => {
            if(err) {
                return callback(500, { 
                    message : 'Unable to update'
                })
            }

            return callback(200, {
                message : 'Token updated',
            })
        })
    })

}

//Logout
_token.delete = (requestPayload, callback) => {
    const id = validatePayload(requestPayload.headers._token, 'string')

    if (!id) {
        return callback(400, { 
            message : 'Bad request'
        })
    }

    libStorage.get(`${handler.defaultDataDirectory}/token-${id}`, (err, data) => {
        if(err) {
            return callback(404, { 
                message : 'Invalid Token'
            })
        }
        data = JSON.parse(data)
        verifyToken(id, data.phone, (isTokenVerified) => {
            if (!isTokenVerified) {
                return callback(403, { 
                    message : 'Token expired'
                })
            }

            libStorage.delete(`${handler.defaultDataDirectory}/token-${id}`, (err) => {
                if(err) {
                    return callback(500, { 
                        message : 'Unable to delete'
                    })
                }
    
                return callback(200, {
                    message : 'Token deleted'
                })
            })
        })

    })
}


module.exports = handler