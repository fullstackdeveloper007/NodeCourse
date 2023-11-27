const request=require('request');

const url='http://api.weatherstack.com/current?access_key=05ea1496f3a386f9bc3d3d5222d8fbca&query=new%20delhi';

// request(url,(error,response)=>{
//     const data=JSON.parse(response.body)
//     console.log(data.current);
// })

//above code can be written like this directly passing json:true in second 
//parameter of request object. then no need to reparse again as above.
request({url:url,json:true},(error,response)=>{
     console.log(response.body.current);
})

///Error handling 
request({ url: url, json: true }, (error, response) => {
    if (error) {
        console.log(error);
    }
    else {
        console.log(response.body.current);
    }
    console.log(response.body.current);
})