import Piece from "./piece";
import Position from './position';


export default class Bishop extends Piece {
    canMoveTo(position: Position): boolean {
        let files = ['A','B','C','D','E','F','G','H']
        let ranks = ['1','2','3','4','5','6','7','8']

        let currentFileIndex = files.indexOf(this.position.getFile())
        let currentRankIndex = ranks.indexOf(this.position.getRank())
        let newFileIndex = files.indexOf(position.getFile())
        let newRankIndex = ranks.indexOf(position.getRank())

        let x = Math.abs(newFileIndex - currentFileIndex)
        let y = Math.abs(newRankIndex - currentRankIndex)

        if(x === y && x!== 0 && y !== 0) return true
        return false
    }
}