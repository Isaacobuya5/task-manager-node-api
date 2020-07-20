const { calculateTip } = require("../src/math");

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