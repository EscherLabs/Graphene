
onmessage = (message)=>{console.log(message)}

let ticks = 0;
setInterval(() => {
  postMessage({ticks:ticks++})
}, 1000)
