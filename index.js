/**
 * Title: Main Module
 * Description: This script will act as a Main module.
 * Author: Tanjed
 * Date: 2023-07-06
 * 
 */
//Dependencies
require('dotenv').config();
const server = require('./server')
const worker = require('./worker')
//Module scaffolding

const app = {}

app.init = () => {
    server.init()
    worker.init()
}


app.init()