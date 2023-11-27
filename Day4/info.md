## we will see how to take input from cmd line argument. 
<li>we can use process.argv</li>
<li>In file app.js,we have below code 
console.log('My name is :' +process.argv);
Try to run "node app.js Mike" from cmd terminal. you see output lilke below.
"
    My name is :C:\Program Files\nodejs\node.exe,C:\DevApplications\Temp\Learning\Node-Course\Day1\Notes-App\Day4\app.js,Mike
"
    process.argv is returning the parameter with file names and path

    If you want to get the input only,just write it like below. passing the index to it.
     console.log('My name is :' + process.argv[2]); 
</li>

## Argument parsing with yargs pkg 
<li>
    Run this cmd to intall yargs pkg "npm install yargs@12.0.2 " 
</li>
<li> -->code from app.js
    const yargs= require ('yargs');
    yargs.command(
        {
            command: "add",
            describe:"Adding notes description",
            handler:function(){
                console.log("Calling add handler");
            }
        }
    )
    console.log(yargs.argv) 
    if you will run "node app.js add" from cmd terminal. you will get an output as below
    output: "Calling add halndler  { _: [ 'add' ], '$0': 'app.js' }"
    it will excute the matching command argument passed from terminal,Here the command we have mentioned in the above code is "add".
</li>

## Argument parsing with yargs pkg part 2.

<li>Please check the app2.js. in this file it has been described that how to parse the paramter using yargs
</li>
<li>
    app1.js code is below.
    const yargs= require ('yargs');
    yargs.command(
        {
            command: "add",
            describe:"Adding notes description",
            builder: {
                title: {
                    describe: 'Note title',
                    demandOption: true,
                    type: 'string'
                },
                body: {
                    describe: 'Note body',
                    demandOption: true,
                    type: 'string'
                }
            },
            handler: function (argv) {
            console.log('Title: ' + argv.title)
            console.log('Body: ' + argv.body)
            }})
    yargs.parse();

    In the above code it is accepting two parameter namely "add" "title"
    It can run like typing below line of code on cmd terminal
    node app1.js add --title="My Test Notes" --body "My notes body"
    out put :-
    Title: My Test Notes
    Body: My notes body
 </li>