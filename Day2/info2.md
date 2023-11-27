
Example of File system module

##Exporting and importing module.

<li>
    If any function or method is defined in one file and we want to use in another file then you need to use "require('relative path of file name);" and then in the file which is being imported must have explicitly exported those moethods/attributes by "module.exports=" example as below...
    ** File utils.js code as below.
    const name="Andrew";
    module.exports=name;

    **File-app.js code below
    const name=require('./utils.js');
    console.log('My name is : '+ name)
    -->run by typing node app.js on command window terminal.
  </li>

##Exporting function from one file and importing in another js file.
 <li> **code of utils.js
    const add= function(a,b){
        return a+b;
    }
    module.exports=add;

    **Code for app.js
    const add=require('./utils.js');
    const sum=add(4,-2);
    console.log(sum)  
    
 </li>