/**
 * Name: Route Handler
 * Description:
 * 
 * 
 */

//Dependenies
const libStorage = require("../../lib/data")
const { hashPassword } = require('../../helpers/utilityHelper')

//Module scaffolding
const handler = {}

handler.allowedMethods = ['get', 'post', 'put', 'delete']
const _user = {}

handler.userHandler = (requestPayload, callback) => {
    if (!handler.allowedMethods.includes(requestPayload.method)) {
        return callback(405, {
            message : 'Method not allowed'
        })
    }

    return _user[requestPayload.method](requestPayload, callback)
}

_user.post = (requestPayload, callback) => {
    const name = validatePayload(requestPayload.data.name, 'string')
    const phone = validatePayload(requestPayload.data.phone, 'string')
    const password = validatePayload(requestPayload.data.password, 'string', 6) 

    if (!name || !phone || !password) {
        return callback(400, { 
            message : 'Bad request'
        })
    }
    
    libStorage.get(`user-${phone}`, (err) => {
        if(!err){
            return callback(422, { 
                message : 'User already exists'
            })
        }

        libStorage.create(`user-${phone}`,{name, phone, password : hashPassword(password)}, (err) => {
            if(err) {
                return callback(500, { 
                    message : 'Unable to create user'
                })
            }
            return callback(200, { 
                message : 'User created successfully'
            })
        })
    })
}
_user.get = (requestPayload, callback) => {}
_user.put = (requestPayload, callback) => {}
_user.delete = (requestPayload, callback) => {}

const validatePayload = (data, type, minLenth = 1) => {
    return typeof data === type && data.length >= minLenth ? data : null
}


module.exports = handler