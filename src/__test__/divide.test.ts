import { divide } from "..";

describe("Test case for the division", () => {
    it("Should not divide by zero", () => {
        expect(divide(1, 0)).toBe(NaN);
    })

    it("Should perform a divion", () => {
        expect(divide(10, 2)).toBe(5);
    })
})