const { calculateTip, fahrenheitToCelcius, celciusToFahrenheit } = require("../src/math");

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