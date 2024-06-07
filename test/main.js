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
        // console.log(queue);
        return list
    })    
}


async function readQueue(){
   
    fs.readFile(file, 'utf8', (err, data) => {
        if (err) {
          console.error(err);
          return;
        }else{
          
        return data
        }
    })    
}

async function addToQueue(id){
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      }else{
        console.log(data);
        console.log(typeof(data));
        if(data == ''){
          fs.writeFile(file, id, err => {
              if (err) {
                console.error(err);
              }
            });
        }else{
          // console.log(`${content}\r\n${id}`);
          fs.writeFile(file, `${data}\r\n${id}`, err => {
              if (err) {
                console.error(err);
              }
            });
        }
      }
  })
    
}
addToQueue('meurt')
updateQueue()