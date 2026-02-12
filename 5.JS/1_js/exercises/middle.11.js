// 11. Escribe una función que simula el juego piedra, papel y tijera (rock, paper, scissors). Recibirá como parámetro una opción (piedra, papel o tijera) en forma de string. La máquina, elegirá automáticamente una opción aleatoria. Imprime por consola ambas elecciones y en caso de ganar el jugador un mensaje de victoria, y en caso de perder uno de derrota.

function gameRPS(userOption = "") {
    const validOptions = ["piedra", "papel", "tijeras"];

    const result = {
        machineOption: "",
        userOption,
        winner: "",
    };

    if (!validOptions.includes(userOption.toLowerCase())) {
        result.winner = "Invalid option";
        return result
    }

    const i = Math.floor(Math.random() * 3);
    result.machineOption = validOptions[i];

    // machine ----- user ------ resultado

    // piedra [0] - piedra [0] - empate
    // piedra [0] - papel [1] - papel (user)
    // piedra [0] - tijeras [2] - piedra (machine)

    // papel [1] - piedra [0] - papel (machine)
    // papel [1] - papel [1] - empate
    // papel [1] - tijeras [2]- tijeras (user)

    // tijeras [2] - piedra [0] - piedra (user)
    // tijeras [2]- papel [1] - tijeras (machine)
    // tijeras [2]- tijeras [2] - empate

    // Comparaciones
    const allResults = [
        ["empate", "user", "machine"],
        ["machine", "empate", "user"],
        ["user", "machine", "empate"],
    ];
    
    const user = validOptions.findIndex((option) => option === userOption);
    result.winner = allResults[i][user];
    return result;
}
 
// Tests

console.log(gameRPS("patata"));
console.log(gameRPS("piedra"));
console.log(gameRPS("papel"));
console.log(gameRPS("tijeras"));
