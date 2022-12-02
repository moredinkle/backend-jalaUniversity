import Bishop from '../src/bishop'
import Position from '../src/position'
import { Color, File, Rank } from '../src/types'

let bishop: Bishop
describe('test queen movement', () => {
    beforeEach(() => {
        bishop = new Bishop('White', 'C', '1')
    })

    it('shouldnt move vertically', () => {
        let position = new Position('C', '8')
        expect(bishop.canMoveTo(position)).toBe(false)
    })

    it('shouldnt move horizontally', () => {
        let position = new Position('A', '1')
        expect(bishop.canMoveTo(position)).toBe(false)
    })

    it('should move diagonally', () => {
        let position = new Position('H', '6')
        expect(bishop.canMoveTo(position)).toBe(true)

        position = new Position('A', '3')
        expect(bishop.canMoveTo(position)).toBe(true)
    })

    it('should not move in L', () => {
        let position = new Position('D', '3')
        expect(bishop.canMoveTo(position)).toBe(false)

        position = new Position('B', '3')
        expect(bishop.canMoveTo(position)).toBe(false)
    })

    it('should not move to other places', () => {
        let position = new Position('C', '5')
        expect(bishop.canMoveTo(position)).toBe(false)

        position = new Position('F', '8')
        expect(bishop.canMoveTo(position)).toBe(false)
    })

    it('should not move to the same place', () => {
        let position = new Position('C', '1')
        expect(bishop.canMoveTo(position)).toBe(false)
    })

});