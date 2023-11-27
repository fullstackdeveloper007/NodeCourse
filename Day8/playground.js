console.log("Start");

setTimeout(()=> {
    console.log("2 Second wait");
},2000)

setTimeout(()=>{
console.log(`0 Seconds wait`);
},0)

console.log('End')

//out put is 
// Start
// End
// 0 Seconds wait
// 2 Second wait
//End is printing before O seconds isn't this strange behavior.. The reason is SetTimeout function will
//wait in callback queue and until all other code is fully executed.