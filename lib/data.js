
const fs = require('fs')

//Module scaffolding 
const lib = {}

lib.baseDir = __dirname + `/../${process.env.PARENT_DATA_DIR}/`

lib.create = (path, data, callback) => {
    fs.open(`${lib.baseDir}/${path.replace(/^\/+|\/+$/g, '')}.json`, 'wx', (openErr, fileDescriptor) => {
        if(openErr || !fileDescriptor) {
            callback(openErr)
            return
        }
        
        fs.write(fileDescriptor, JSON.stringify(data, null, 4), (writeErr) => {
            if(writeErr) {
                callback(writeErr)
                return
            }
          
            fs.close(fileDescriptor, (closeErr) => {
                if(closeErr) {
                    callback(closeErr)
                    return
                }
                callback(null)
            })     
        })
    })
}

lib.get = (path, callback) => {
    fs.readFile(`${lib.baseDir}/${path.replace(/^\/+|\/+$/g, '')}.json`, 'utf-8', (err, data) => {
        callback(err, data)
        return
    })
}

lib.update = (path, data, callback) => {
    fs.open(`${lib.baseDir}/${path.replace(/^\/+|\/+$/g, '')}.json`, 'r+', (openErr, fileDescriptor) => {
        if(openErr || !fileDescriptor) {
            callback(openErr)
            return
        }
      
        fs.truncate(`${lib.baseDir}/${path.replace(/^\/+|\/+$/g, '')}.json`, 0, (truncateErr) => {
            if(truncateErr) {
                callback(truncateErr)
                return
            }

            fs.write(fileDescriptor, JSON.stringify(data), (writeErr) => {
                if(writeErr) {
                    callback(writeErr)
                    return
                }
                
                fs.close(fileDescriptor, (closeErr) => {
                    if(closeErr) {
                        callback(closeErr)
                        return
                    }
                    callback(null)
                })
            })

        })
        
    })
}

lib.delete = (path, callback) => {
    fs.unlink(`${lib.baseDir}/${path.replace(/^\/+|\/+$/g, '')}.json`, (err) => {
        callback(err)
        return
    })
}

lib.list = (path, callback) => {
   fs.readdir(`${lib.baseDir}/${path}`, (err, files) => {
        if (err) {
            return callback(err)
        }
        return callback(files)
   })
}

module.exports = lib