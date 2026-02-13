// Objects

const o = {
    name:  'Pepe',
    age: 22
}

// Práctica cuestionable
o.job = 'Developer'

// Mala practica
// delete o.age

const prop = null //'name'

console.log(prop)
console.log(o[prop ? prop: 'job'])

///

const user = {
    name:  'Pepe',
    age: 22,
    job: 'Developer'
}

for (const key in user) { 
    const value = user[key];
    console.log(`Clave ${key} el valor es ${value}`)
}

// Object.keys(user)
// Object.values(user)
// console.log(Object.entries(user))

const userContacts = {
    c1: 'Luis',
    c2: 'Ramón',
    c3: 'Rosa'
}

