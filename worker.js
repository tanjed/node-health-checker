/**
 * Title: Worker Module
 * Description: This script will act as a worker module.
 * Author: Tanjed
 * Date: 2023-07-06
 * 
 */



//Module scaffolding
const worker = {}

worker.init = () => {
    setInterval(() => {
        console.log('STARTED WORKER SERVICE');
    }, 5 * 1000)
}


module.exports = worker