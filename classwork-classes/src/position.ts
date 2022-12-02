import { Color, File, Rank } from './types'

export default class Position {
    constructor(protected file: File, protected rank: Rank){
        this.file = file,
        this.rank = rank
    }

    getFile(): File{
        return this.file
    }

    getRank(): Rank{
        return this.rank
    }
}