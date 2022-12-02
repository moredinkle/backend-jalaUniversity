import Piece from "./piece";
import Position from './position';


export default class King extends Piece {
    canMoveTo(position: Position): boolean {
        let files = ['A','B','C','D','E','F','G','H']
        let ranks = ['1','2','3','4','5','6','7','8']

        let currentFileIndex = files.indexOf(this.position.getFile())
        let currentRankIndex = ranks.indexOf(this.position.getRank())
        let newFileIndex = files.indexOf(position.getFile())
        let newRankIndex = ranks.indexOf(position.getRank())
        if(newRankIndex === currentRankIndex && newFileIndex === currentFileIndex) return false
        if(Math.abs(newFileIndex - currentFileIndex) <= 1 && Math.abs(newRankIndex - currentRankIndex) <= 1) return true
        // if(newRankIndex === currentRankIndex && Math.abs(newFileIndex - currentFileIndex) !== 1) return false
        // if(newFileIndex === currentFileIndex && Math.abs(newRankIndex - currentRankIndex) !== 1) return false
        return false
    }
}