/**
 * Title: Server Module
 * Description: This script will act as a server module.
 * Author: Tanjed
 * Date: 2023-07-03
 * 
 */


//Dependencies
const http = require('http')
const handleReqRes = require('./helpers/reqResHelper')



//Module scaffolding
const app = {}

//Configurations
// app.config = {
//     port : 3000
// }

//Create Server
app.init = () => {
    const server = http.createServer(handleReqRes)
    server.listen(process.env.APP_PORT, () => {
        console.log(`Listening to port ${process.env.APP_PORT}`);
    })
}

module.exports = app
