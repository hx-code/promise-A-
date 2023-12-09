const PENDING = 'PENDING',
      FUIFILLED = 'FULLFILLED',
      REJECTED = 'REJECTED';
      
      Object.defineProperty(x , then,{
        get(){
            throw new Error
        }
      })
      function resolvePromise(promise2, x, resolve, reject){
       if(promise2 === x){
        return reject(new TypeError('chaining cycle'))
       }
       if((typeof x  === 'object' && x !== null) || typeof x === 'function'){
       try {
        let then = x.then;
        if(typeof then === 'function'){ //Promise
            then.call(x, (y) =>{
                resolve(y)

            },(r)=>{
                reject(r)

            })

        }else{
            resolve(x)
        }
        
       } catch (err) {
         
        
       }

       }else{
        resolve(x)
       }
    
      }


class MyPromise{
    constructor(excutor){
        this.status = PENDING;
        this.value = undefined;
        this.reason = undefined;
        this.onFuifilledCallbacks = [],
        this.onRejectedCallbacks = []
        const resolve = (value) =>{
            if(this.status === PENDING){
                this.status = FUIFILLED
                this.value = value
                this.onFuifilledCallbacks.forEach(fn => fn())

            }

        }
        const reject = (reason) =>{
            if(this.status === PENDING){
                this.status = REJECTED
                this.reason = reason
                //发布
                this.onRejectedCallbacks.forEach(fn => fn())
            }

        }
        try{
        excutor(resolve, reject)
        }catch(e){
            reject(e)
        }
    }
    then(onFulfilled, onRejected){ 
        let promise2 = new Promise((resolve, reject)=>{
            if(this.status === FUIFILLED){
              setTimeout(() => {
                try {
                    let x =  onFulfilled(this.value)
                    resolvePromise(promise2,  x, resolve, reject)
                    
                  } catch (err) {
                    reject(err)
                    
                  }
                
              },0);
            }
            if(this.status === REJECTED){
             setTimeout(() => {
                try {
                    let x = onRejected(this.reason)
                    resolvePromise(promise2,x, resolve, reject)
                } catch (err) {
                    reject(err)
                    
                }
                
             },0);
            }
            if(this.status === PENDING){
                // 发布
                this.onFuifilledCallbacks.push(() =>{
                  
                        try {
                            let x  = onFulfilled(this.value)
                            resolvePromise(promise2,x, resolve, reject)
                        } catch (err) {
                            reject(err)
                            
                        }
                        
                  
            
                });
                this.onRejectedCallbacks.push(()=>{
                   
                    try {
                        let x =  onRejected(this.reason)
                        resolvePromise(promise2,x, resolve, reject)
                        
                    } catch (err) {
                        reject(err)
                        
                    }
                    
           
         
                })
    
            }


        });
     
        return promise2;
    }

}

module.exports = MyPromise