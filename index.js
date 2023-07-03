/**
 * Title: Main Module
 * Description: This script will act as a main module.
 * Author: Tanjed
 * Date: 2023-07-03
 * 
 */


//Dependencies
const http = require('http')
const handleReqRes = require('./helpers/reqResHelper')



//Module scaffolding
const app = {}

//Confgurations
app.config = {
    port : 3000
}

//Create Server
app.createServer = () => {
    const server = http.createServer(handleReqRes)
    server.listen(app.config.port, () => {
        console.log(`Listening to port ${app.config.port}`);
    })
}


app.createServer() 
