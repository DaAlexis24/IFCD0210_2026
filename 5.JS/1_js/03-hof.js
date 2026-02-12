// Hight Order Function

// Recibe como parámetro una función
// o retorna una función

const calculate = function (fn, a = 0, b = 0) {
    if (typeof fn !== "function") {
        throw new Error("Invalid argument: not function");
    }
    const r = fn(a, b);
    console.log(r);
};

// function suma(a,b) {
//     return a + b
// }

// const add = (x, y) => {
//     return x + y;
// };

const add = (x, y) => x + y;  // lambda

const prod = (x, y) => {
    return x * y;
};

console.log(add(2, 4));
console.log(add);

calculate(add, 3, 6);
calculate(prod, 30, 60);

calculate(add, 3, 6);
calculate(add, 34, 66);
calculate(add, 37, 65);
calculate(add, 32, 76);
calculate(add, 3, 16);
