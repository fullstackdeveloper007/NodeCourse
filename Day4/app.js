//Basic of yargs pkg.
const yargs= require ('yargs');

//console.log(yargs.argv)
yargs.command(
    {
        command: "add",
        describe:"Adding notes description",
        handler:function(){
            console.log("Calling add handler");
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

console.log(yargs.argv)

// onterminal run it by node app.js add or node app.js remove