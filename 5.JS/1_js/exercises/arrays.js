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

const cloneArr = [...array] // Clon

array = [1,6,2]
const sort = (arr) => {

    // Implementación básica incomplete

    for (let i = 1; i < arr.length; i++) {
        const previous = arr[i-1]
        const element = arr[i];
        if (element < previous) {
            // reordenar
            arr[i-1] = element
            arr[i] = previous
        }  
    }
    return arr
}


const newArray = sort(array)
console.log(array) // [1,2,6]
console.log(newArray) // [1,2,6]

const toSorted = (arr) => {

    // Array dentro de la función

    // arr = [...arr]
    const arr2 = [...arr]
    // const arr2 = structuredClone(arr)
    // const arr2 = JSON.parse(JSON.stringify(arr))

    // Implementación básica incomplete

    for (let i = 1; i < arr2.length; i++) {
        const previous = arr2[i-1]
        const element = arr2[i];
        if (element < previous) {
            // reordenar
            arr2[i-1] = element
            arr2[i] = previous
        }  
    }
    return arr2
}

array = [1,6,2]
const sortedArray = toSorted(array)
console.log(array) //  [1,6,2]
console.log(sortedArray) // [1,2,6]
