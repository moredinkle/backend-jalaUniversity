import Position from './position';
import { Color, File, Rank } from './types'

export default abstract class Piece {
    protected position: Position

    constructor(private readonly color: Color, file: File, rank: Rank){
        this.color = color
        this.position = new Position(file, rank)
    }

    moveTo(position: Position){
        this.position = position
    }

    abstract canMoveTo(position: Position): boolean
}
//private fuera de clase imposible acceder a propiedad