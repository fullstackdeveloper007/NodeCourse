const fs=require('fs');
fs.writeFileSync("nodetes.txt","Hi there! I am just trying to write file from node.")
fs.appendFileSync("nodetes.txt","I am just appending text in this file.")