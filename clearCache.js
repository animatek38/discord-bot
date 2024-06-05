const fs = require('fs')
var path = require('path');
fs.readdir("audio", (err, files) => {
    files.forEach(file => {
        let x = path.join(".","audio",file)
        fs.rm(x)
    });
  });