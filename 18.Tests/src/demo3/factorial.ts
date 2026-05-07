export const factorial = (n: number): number => {
    if (n > 170 || n < 0 || !Number.isInteger(n)) {
        throw(new Error('Invalid input'))
    }
    let result = 1
    for (let i = 1; i <= n; i++) {
        result *= i
    }
    return result
}
