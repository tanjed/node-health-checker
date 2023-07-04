/**
 * Name: Route Handler
 * Description:
 * 
 * 
 */

//Dependenies
const libStorage = require("../../lib/data")
const { hashPassword, parseJson } = require('../../helpers/utilityHelper')

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
_user.get = (requestPayload, callback) => {
    const phone = validatePayload(requestPayload.url.searchParams.get('phone'), 'string')

    if (!phone) {
        return callback(400, { 
            message : 'Bad request'
        })
    }

    libStorage.get(`user-${phone}`, (err, data) => {
        if(err) {
            return callback(404, { 
                message : 'User not found'
            })
        }
        data = JSON.parse(data)
        delete data.password
        return callback(200, {
            user : data
        })
    })
}
_user.put = (requestPayload, callback) => {

    const phone = validatePayload(requestPayload.url.searchParams.get('phone'), 'string')

    if (!phone) {
        return callback(400, { 
            message : 'Bad request'
        })
    }

    libStorage.get(`user-${phone}`, (err, data) => {
        if(err) {
            return callback(404, { 
                message : 'User not found'
            })
        }

        data = JSON.parse(data)
        const name = validatePayload(requestPayload.data.name, 'string')
        const password = validatePayload(requestPayload.data.password, 'string', 6) 

        if(name) data.name = name
        if(password) data.password = hashPassword(password)

        libStorage.update(`user-${phone}`, data, (err) => {
            if(err) {
                return callback(500, { 
                    message : 'Unable to update'
                })
            }

            return callback(200, {
                message : 'User updated'
            })
        })
    })

}
_user.delete = (requestPayload, callback) => {
    const phone = validatePayload(requestPayload.url.searchParams.get('phone'), 'string')

    if (!phone) {
        return callback(400, { 
            message : 'Bad request'
        })
    }

    libStorage.get(`user-${phone}`, (err, data) => {
        if(err) {
            return callback(404, { 
                message : 'User not found'
            })
        }

        libStorage.delete(`user-${phone}`, (err) => {
            if(err) {
                return callback(500, { 
                    message : 'Unable to delete'
                })
            }

            return callback(200, {
                message : 'User deleted'
            })
        })
    })
}

const validatePayload = (data, type, minLenth = 1) => {
    return typeof data === type && data.length >= minLenth ? data : null
}


module.exports = handler