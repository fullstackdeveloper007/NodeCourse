## Debugging Node Application.

 Mostly we can check the code by console.log(). This is very basic way of debugging code.

 Additionaly  we can use "inspect" keyword to debug an application. but we need to write "debugger;" in the  js code to be inspected. for example the below code we have 

<pre>
<code>
const event = {
    name: 'Birthday Party',
    guestList: ['Andrew', 'Jen', 'Mike'],
    printGuestList() {   
            
    debugger;
        this.guestList.forEach((guest)=> {
            console.log(guest + ' is attending ' + this.name)
        }) //this will not work as "this" is pointing to local binding and looking inside foreach and name is not defined inside foreach loop   }
    }

event.printGuestList();
</code>
</pre>

 After adding the debugger in the code as above. Just type "node inspect filename.js" . you will get a msg in the command prompt for debugging. now go open the chrome and type chrome://inspect. It will show you the attach debuggers.
"If inspect keyword is  giving error try "--inspect-brk"
 
