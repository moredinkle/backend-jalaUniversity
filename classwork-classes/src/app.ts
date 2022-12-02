import King from './king';
import Queen from './queen';
import Position from './position';

let king = new King('Black', 'E', '1')
let position = new Position('F', '2')
let b = king.canMoveTo(position)
// let queen = new Queen('Black', 'D', '1')
// let position = new Position('C', '3')
// position = new Position('C', '5')
// let b = queen.canMoveTo(position)


//INTERFACES
// type Sushi = {
//     calories: number
//     salty: boolean
//     tasty: boolean
// }

// interface Sushi2 {
//     calories: number
//     salty: boolean
//     tasty: boolean
// }

// type Food = {
//     calories: number
//     salty: boolean
// }

// type Sushi = Food & {
//     tasty: boolean
// }


// type Cake = Food & {
//     sweet: boolean
// }

interface Food {
    calories: number
    salty: boolean
}

interface Sushi extends Food {
    tasty: boolean
}

interface Cake extends Food {
    sweet: boolean
}