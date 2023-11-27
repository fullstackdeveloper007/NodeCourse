##How to use File system module.

<li>In this project we have firstly added the example1.js file.</li>
<li>We are exploring the  file system module.</li>
<li>To use any module we need to use "require" function. Like this.. "const fs=require('fs');"</li>
<li>Next we have created two files app.js and utils.js. here we trying to demonstrate that it any thing which is described in one file, how is it possible to use in other file. we have to use "require()" function with relatiive path of file.
## Demonstrating the require function by importing file system module

-->code of example.js
const fs=require('fs');
fs.writeFileSync("nodetes.txt","Hi there! I am just trying to write file from node.")
fs.appendFileSync("nodetes.txt","I am just appending text in this file.")
-->the above can run by typing node example.js on cmd window terminal


 