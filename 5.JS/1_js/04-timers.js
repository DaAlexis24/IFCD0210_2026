const t = setTimeout(() => {
    console.log('Por fin')
}, 3_000)

const i = setInterval(() => {
     console.log('Otra vez')
     clearTimeout(t)
}, 1_000);


setTimeout(() => {
    clearInterval(i)
}, 10_000)
