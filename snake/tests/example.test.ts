import {sum} from '../src/calc';

describe('test sum function', () => {
    it('should return 15', () => {
        expect(sum(10,5)).toBe(15)
    })

    it('should return 15', () => {
        expect(sum(3,2)).toBe(5)
    })
});