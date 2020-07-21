const { calculateTip, fahrenheitToCelcius, celciusToFahrenheit, add } = require("../src/math");

test('should calculate total with tip', () => {
    const total = calculateTip(10, .3);
    // if (total != 13) {
    //     throw new Error(`Total tip should be 13. Instead got ${total}`);
    // }
    expect(total).toBe(13)
});

test('should calculate total with default tip', () => {
    const total = calculateTip(10);
    expect(total).toBe(12.5);
});

test("Should convert 32 F to 0 C", () => {
    const result = fahrenheitToCelcius(32);
    expect(result).toBe(0);
});

test("Should convert 0 C to 32 F", () => {
    const result = celciusToFahrenheit(0);
    expect(result).toBe(32);
})

test("Async test demo", (done) => {
    setTimeout(() => {
        expect(1).toBe(1)
        done()
    },2000)
})

test("Should add two numbers", (done) => {
    add(2,3).then((sum) => {
        expect(sum).toBe(5);
        done();
    })
});

test("Should add two numbers async await", async () => {
    const sum = await add(10, 22);
    expect(sum).toBe(32);
})





/**
 * ADVANTAGES OF TESTING
 * a. Saves time
 * b. Creates reliable software
 * c. Gives flexibility to developers
 * d. Refactoring
 * e. Collaboration
 * f. Profiling
 * g. Peace of mind
 */