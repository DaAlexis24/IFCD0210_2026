const user = ["Pepe", 22, "Developer"];
console.log(user);
console.log(user[0]);

// Excentricidad
user.id = 1;
console.log(user);

const userContacts = ["Luis", "Ramón", "Rosa", "Elena", "Pepe"];

// console.log(userContacts[0])
// console.log(userContacts[1])
// console.log(userContacts[2])

console.log("for----------------");
for (let i = 0; i < userContacts.length; i++) {
    const item = userContacts[i];
    console.log(item);
}

console.log("for-in---------------");
for (const i in userContacts) {
    const item = userContacts[i];
    console.log(item);
}

console.log("for-of---------------");
for (const item of userContacts) {
    console.log(item);
}

// Propiedades de Arrays

// Mutables -> modifican el array original
userContacts.push("Ernestina");
userContacts.pop();
userContacts.unshift("Micaela");
userContacts.shift();
userContacts.sort();
userContacts.reverse();

// InMutables -> NO modifican el array original

let newArray = userContacts.concat("Felipe");
newArray = userContacts.toSorted();
newArray = userContacts.toReversed();
console.log(userContacts);
console.log(newArray);

// Fragmentos de array

// Mutable
userContacts.splice();

// Inmutable
let partial = userContacts.slice();
partial = userContacts.toSpliced();

// HOF (ES 1.5)

const fn = userContacts.forEach((item, i) => console.log(i+1, item))

let total = 0;
[[1,3,6],[1,6,7], [1,7,5]].forEach(item => item.forEach(item => total += item));
console.log(total)

const numbers = [1,6,5,7,8]

const doubles = numbers.map(item => item * 2)
console.log(doubles)
const f = doubles.filter(item => item > 10)
console.log(f)
const r = f.find(item => item > 20)
console.log(r)
const i = f.findIndex(item => item > 20)
console.log(i)
const n = f.reduce((prev, current) => prev + current)
console.log(n)

const s = userContacts.reduce((prev, current) => prev + ', ' +  current)
console.log(s);

const t = [[1,3,6],[1,6,7], [1,7,5]].flat().reduce((a, b) => a+b)
console.log(t)
