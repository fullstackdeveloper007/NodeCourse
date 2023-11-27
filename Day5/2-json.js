// In this fil, we are demonstrating writing and reading of json to a file.
const fs=require('fs');

//Writing data to a file.
const book= {
    name:'Ego is enemy',
    author: 'Ryan holiday'
}

const bookJSON=JSON.stringify(book);
fs.writeFileSync("myjson.json",bookJSON);

//Reading data from File 
const dataBuffer=fs.readFileSync("myjson.json");
const dataJSON=dataBuffer.toString();
const data =JSON.parse(dataJSON);
console.log('Book Name: '+ data.name);