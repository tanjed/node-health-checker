/**
 * Name: Utility Module
 * Description: This module will contain many utility functions
 *  
 */

const https = require('https')
const queryString = require('querystring')
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
    libStorage.get(`${process.env.TOKEN_DATA_DIR}/${token}`, (err, token) => {
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

helper.sendSMS = (mobile, sms, callback) => {

    const messagePayload = {
        Body: sms,
        From: process.env.TWILIO_NUMBER,
        To: mobile
    }
    const messagePayloadStringify = queryString.stringify(messagePayload)
    const requestPayload = {
        hostname: 'api.twilio.com', // Replace with the actual hostname
        path: `/2010-04-01/Accounts/${process.env.TWILIO_SID}/Messages.json`, // Replace with the actual path
        method: 'POST', // Replace with the desired HTTP method
        auth: `${process.env.TWILIO_SID}:${process.env.TWILIO_AUTH_TOKEN}`,
        headers:{
            'Content-Type' : 'application/x-www-form-urlencoded',
        }
    }

    const req = https.request(requestPayload, (res) => {
        const responseCode = res.statusCode
        let data = ''
        res.on('data', (chunk) => {
            data += chunk;
          });
        
          res.on('end', () => {
            console.log(data); // Response data
          });    
        if ([200, 201].includes(responseCode)) {
            return callback(false)
        }
        
        return callback(true) 
    })

    req.write(messagePayloadStringify)
    req.on('error', (error) => {
       callback(true)
    });
    req.end()
}



module.exports = helper