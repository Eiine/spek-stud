const say = require('say');


const speak=(text)=>{
    
    return new Promise(resolve => {
        say.speak(text, undefined, undefined, () => {
            
                resolve();
            
        });
    });
}



module.exports={speak}