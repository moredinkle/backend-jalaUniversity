function* createFibo(): IterableIterator<Number>{
    let a: number = 0;
    let b: number = 1;
    let c: number = 0;
    while(true){
        yield c
        c = a + b
        b = a
        a = c
    }
}
let fibo = createFibo();
console.log(fibo.next());
console.log(fibo.next());
console.log(fibo.next());
console.log(fibo.next());
console.log(fibo.next());
console.log(fibo.next());
console.log(fibo.next());
console.log(fibo.next());
console.log(fibo.next());