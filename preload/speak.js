const say = require('say');


const speak=(text,speed=1.4)=>{
    
    return new Promise(resolve => {
        say.speak(text, undefined, speed, () => {
            
                resolve();
            
        });
    });
}



module.exports={speak}