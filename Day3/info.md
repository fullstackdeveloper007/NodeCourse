## here we are exploring the npm modules. there are plenty of npm modules already developed by many developers like validating email and others. when we install node the npm modules by default install with it. 

<li>The version of node and npm can be check by "npm -v" and "node-v"</li>
<li>
    For using npm packages in any project, firstly we need to initialize the npm in the project. by running 
    "npm init" in the project. This will add a configuration file (i.e. package.json) in project which will consist of dependency and other details.
</li>
<li>
    Next we have installed the validator module to validate emails command: "npm i validator@10.8.0". 
    you can check the details of validator by visiting the npm website at "https://www.npmjs.com/" and search validator on search bar. 
</li>
<li>
    -->code form app.js
    const validator= require('validator');
    console.log(validator.isEmail('test@gmail.com'));
</li>

<li>Next we have install the chalk module. This module is used for coloring the text. chek the below code.
    https://www.npmjs.com/package/chalk
    -->code form app.js
    console.log(chalk.blue(`John`));
    console.log(chalk.blue.bold(`John`));
    console.log(chalk.blue.inverse(`John`));
</li>

##Installing the module globally.
<li>
    We have installed the pkg "nodemon" globally. The purpose of this module is when ever we modify and save the file it will autometically run/execute it. It will track the changes of files and once save the file. it wil execute the file. no need to come on terminal and run cmd "node filename.js"
</li>
<li>To install the pkg "nodemon" globally we need to run "npm install nodemon@1.18.5 -g"  </li>
<li>when we install the pkg globally, no dependency will be in package.json. although globally installed pkg are install at system level.</li>
<li>To check whether the nodemon pkg installed correctly or not. try to run "nodemon -v" on terminal</i>
<li>To run any file by nodemon it can  used as "nodemon app.js"</li>
<li> To stop running the nodemon just press ctrl+C</li>