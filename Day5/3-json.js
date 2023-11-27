//We will demonstarte how to modify a json attribute which is in a file.

const fs=require('fs');
const mydata=fs.readFileSync("my2Json.json");
const user=JSON.parse(mydata);//converting to javasscript object.

//modifying the object attributes
user.name="Charl";
user.age=54;

//converting back to json
const userJSON=JSON.stringify(user);
fs.writeFileSync("my2Json.json",userJSON)//writing to file