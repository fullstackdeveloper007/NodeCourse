const event = {
    name: 'Birthday Party',
    guestList: ['Andrew', 'Jen', 'Mike'],
    printGuestList() {
        console.log('Guest list for ' + this.name)
        
        // this.guestList.forEach(function(guest) {
        //     console.log(guest + ' is attending ' + this.name)
        // }) this will not work as "this" is pointing to local binding and looking inside foreach and name is not defined inside foreach loop   }

        this.guestList.forEach((guest)=> {
            console.log(guest + ' is attending ' + this.name)
        }) //this will not work as "this" is pointing to local binding and looking inside foreach and name is not defined inside foreach loop   }
    }
    }

event.printGuestList();