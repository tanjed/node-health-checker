/**
 * Name: Utility Module
 * Description: This module will contain many utility functions
 *  
 */

const crypto = require('crypto')

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


module.exports = helper