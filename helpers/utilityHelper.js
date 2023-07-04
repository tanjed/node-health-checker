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


module.exports = helper