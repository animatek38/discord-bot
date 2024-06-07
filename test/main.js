const fs = require(`fs`)

var queue = []

const file = './queue.txt'
async function updateQueue(){
   
    fs.readFile(file, 'utf8', (err, data) => {
        if (err) {
          console.error(err);
          return;
        }
        list = data.split('\r\n')
        list.forEach(element => {
            queue.push(element)
        });
        console.log(queue);
        return list
    })    
}


async function readQueue(){
   
    fs.readFile(file, 'utf8', (err, data) => {
        if (err) {
          console.error(err);
          return;
        }
        return data
    })    
}

async function addToQueue(id){
    let content = await readQueue()
    fs.writeFile(file, content, err => {
        if (err) {
          console.error(err);
        } else {
          // file written successfully
        }
      });
}
addToQueue('sad')
updateQueue()