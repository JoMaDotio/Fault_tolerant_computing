import { add } from '../index';

describe("testing add functionallity", () => {
    it("Should add 2 number and not display diferent value", () => {
        expect(add(2, 4)).not.toEqual(5);
    })

    it("Should add 2 number and be correct", () => {
        expect(add(2, 4)).toEqual(6);
    })
})