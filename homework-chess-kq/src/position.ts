import { Color, File, Rank } from './types'

export default class Position {
    constructor(public file: File, public rank: Rank){
        this.file = file,
        this.rank = rank
    }
}