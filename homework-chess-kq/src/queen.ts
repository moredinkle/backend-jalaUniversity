import Piece from "./piece";
import Position from './position';


export default class Queen extends Piece {
    canMoveTo(position: Position): boolean {
        let files = ['A','B','C','D','E','F','G','H']
        let ranks = ['1','2','3','4','5','6','7','8']

        let currentFileIndex = files.indexOf(this.position.file)
        let currentRankIndex = ranks.indexOf(this.position.rank)
        let newFileIndex = files.indexOf(position.file)
        let newRankIndex = ranks.indexOf(position.rank)

        let x = Math.abs(newFileIndex - currentFileIndex)
        let y = Math.abs(newRankIndex - currentRankIndex)

        if(newRankIndex === currentRankIndex || newFileIndex === currentFileIndex) return true
        if(x === y) return true
        return false
    }
}