/**
 * Name: Utility Module
 * Description: This module will contain many utility functions
 *  
 */

const crypto = require('crypto')
const libStorage = require('../lib/data.js')
const helper = {}

helper.hashPassword = (password) => {
    return crypto.Hmac('sha256', 'secretkey')
    .update(password)
    .digest('hex')
}

helper.parseJson = (string) => {
    try {
        return JSON.parse(string)
    }
    catch{
        return null
    }
}

helper.createRandomString = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    return result;
}

helper.verifyToken = (token, phone, callback) => {
    libStorage.get(`tokens/token-${token}`, (err, token) => {
        if (err) return callback(false)
        token = JSON.parse(token)
        return callback(token.phone == phone && token.expiredAt > Date.now())
    })
}

helper.validatePayload = (data, type, minLength = 1) => {
    if(type == 'url') {
        try{
            return new URL(data)
        }
        catch{
            return null
        }
    }
    else if(type == 'object') {
        return typeof data === type ? data : {}
    }
    else if(type == 'boolean'){
        data = JSON.parse(data.toLowerCase())
        return typeof data === type
    }
    else{
        return typeof data === type && data.length >= minLength ? data : null
    } 
}



module.exports = helper