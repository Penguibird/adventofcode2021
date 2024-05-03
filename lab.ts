const a = 119301;
const b = 43010;
const remainders = [];
let functionCalls = 0;
const compute = (a: number, b: number) => {
    functionCalls++;
    const n = a / b
    const q = Math.floor(n);
    const r = a - (q * b);
    remainders.push(r)
    if (r == 0) return b;
    a = b;
    b = r
    return compute(a, b);
}

console.log(compute(a, b), remainders, functionCalls)