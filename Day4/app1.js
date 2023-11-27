//Yargs pkg part 2.
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
        }
    }
)

yargs.command(
    {
        command: "remove",
        describe:"remove notes description",
        handler:function(){
            console.log("Calling remove handler");
        }
    }
)

yargs.command(
    {
        command: "list",
        describe:"list notes description",
        handler:function(){
            console.log("Calling list handler");
        }
    }
)

yargs.command(
    {
        command: "read",
        describe:"remove read description",
        handler:function(){
            console.log("Calling read handler");
        }
    }
)

 yargs.parse()
// on terminal run it by node app1.js add --title="My Test Notes" --body "My notes body"
//you get the out put as -->Title: My Test Notes Body: My notes body