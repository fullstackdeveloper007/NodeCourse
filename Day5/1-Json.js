// ## In this file the Javascript to json conversion is demonstarted. for details check below URL.
//https://github.com/fullstackdeveloper007/JavascriptBasics/blob/main/JavaScriptToJson.md

const book= {
    name:'Ego is enemy',
    author: 'Ryan holiday'
}

//Json.stringfy can be used to convert the javascript object to json object/.
const bookJson=JSON.stringify(book);
console.log("First Result: "+ bookJson);

//When we try to get the attribute of json object like below it will give undefined.
console.log("Second Result: "+ bookJson.name);
// but the javascript object attributes can be accessed like below.
console.log("Third Result: "+ book.name);


//## by using JSON.parse we can convert the JSON back to javascript object
const parseData=JSON.parse(bookJson)
console.log(parseData)