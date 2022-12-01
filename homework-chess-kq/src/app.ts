import King from './king';
import Queen from './queen';
import Position from './position';

// let king = new King('Black', 'D', '1')
// let position = new Position('C', '3')
// let b = king.canMoveTo(position)
let queen = new Queen('Black', 'D', '1')
let position = new Position('C', '3')
// position = new Position('C', '5')
let b = queen.canMoveTo(position)
console.log(b)