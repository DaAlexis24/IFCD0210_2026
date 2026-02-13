// Length

function length(arr) {
    let length = 0;
    for (const item of arr) {
        length++;
    }
    return length;
}

let array = [];
console.log(array.length === length(array));
array = [1, 2, 3];
console.log(array.length === length(array));
array[12] = 2;
console.log(array.length === length(array));

// Push

// Destructuring: rest / spreed

[].push();

function push(arr, ...items) {
    for (const item of items) {
        arr[length(arr)] = item;
    }
    return length(arr);
}

array = [];
console.log(push(array, "Pepe") === 1);
array = [];
console.log(push(array, "Pepe", "Juan") === 2);
array = [];
console.log(push(array, ["Pepe", '', '']) === 1);
array = []
console.log(push(array, ...["Pepe", 'A', 'B']) === 3);

const newArr = [...array] // Clon
