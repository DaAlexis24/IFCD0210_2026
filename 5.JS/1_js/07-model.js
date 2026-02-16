const sherlock = {
    name: 'Holmes',
    address : {
        street: 'Baker',
        city: 'London'
    }
}

const john = {
    name: 'Watson',
    address : sherlock.address
}

// john.address.city = 'Burgos'

john.address = {...john.address, city: 'Burgos'}

console.log(sherlock, john)
