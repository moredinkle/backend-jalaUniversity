export function* generateRandomNumber(limit: number): IterableIterator<Number> {
  let x: number = Date.now() % 10;
  let a: number = Date.now() % 10;
  let c: number = Date.now() % 10;
  let m: number = limit;
  while (true) {
    x = (a * x + c) % m;
    yield x;
  }
}
