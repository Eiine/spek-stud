const {ipcRenderer} = require("electron")
const {speak}= require("./speak")
const say = require('say');

window.addEventListener('DOMContentLoaded', () => {
let pause=false
let contador=0
let lecturaEnProgreso=false
let speed;
//lectura
ipcRenderer.on("leer",async(e,data)=>{
    
    if (lecturaEnProgreso) {
        console.log("Ya hay una lectura en curso. No se puede iniciar otra.");
        return; 
    }
    lecturaEnProgreso = true;   
    let texto= data.normalize('NFD').replace(/[\u0300-\u036f]/g, '')  
    const fracmen= texto.split(",")
     
     for (let i = contador; i < fracmen.length; i++) {
        
        if (pause== false ) {
            await speak(fracmen[i],speed)
            contador++   
        }
        else{
            pause=false
            break
            
        }    
}
if (contador==fracmen.length) {
    contador=0
    lecturaEnProgreso = false;
}
})

ipcRenderer.on("pause",(e,data)=>{
    pause=data
    lecturaEnProgreso = false;
})
ipcRenderer.on("stop",(e,data)=>{
    lecturaEnProgreso = false;
    say.stop()
    pause=true
    contador=-1
})

})

