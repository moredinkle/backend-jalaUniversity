import King from '../src/king'
import Position from '../src/position'
import { Color, File, Rank } from '../src/types'

let king: King
describe('test king movement', () => {
    beforeEach(() => {
        king = new King('Black', 'E', '1')
    })

    it('should move one place forward', () => {
        let position = new Position('E', '2')
        expect(king.canMoveTo(position)).toBe(true)
    })

    it('shouldnt move to the same place', () => {
        let position = new Position('E', '1')
        expect(king.canMoveTo(position)).toBe(false)
    })

    it('should move one place to the left', () => {
        let position = new Position('D', '1')
        expect(king.canMoveTo(position)).toBe(true)
    })

    it('shouldnt move forward more than one space', () => {
        let position = new Position('E', '3')
        expect(king.canMoveTo(position)).toBe(false)
    })

});