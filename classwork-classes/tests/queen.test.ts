import Queen from '../src/queen'
import Position from '../src/position'
import { Color, File, Rank } from '../src/types'

let queen: Queen
describe('test queen movement', () => {
    beforeEach(() => {
        queen = new Queen('White', 'D', '1')
    })

    it('should move vertically', () => {
        let position = new Position('D', '8')
        expect(queen.canMoveTo(position)).toBe(true)
    })

    it('should move horizontally', () => {
        let position = new Position('A', '1')
        expect(queen.canMoveTo(position)).toBe(true)
    })

    it('should move diagonally', () => {
        let position = new Position('H', '5')
        expect(queen.canMoveTo(position)).toBe(true)

        position = new Position('A', '4')
        expect(queen.canMoveTo(position)).toBe(true)
    })

    it('should not move in L', () => {
        let position = new Position('C', '3')
        expect(queen.canMoveTo(position)).toBe(false)

        position = new Position('E', '3')
        expect(queen.canMoveTo(position)).toBe(false)
    })

    it('should not move to other places', () => {
        let position = new Position('C', '5')
        expect(queen.canMoveTo(position)).toBe(false)

        position = new Position('F', '8')
        expect(queen.canMoveTo(position)).toBe(false)
    })

});