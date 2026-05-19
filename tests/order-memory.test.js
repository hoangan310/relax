const assert = require("assert");

const {
  generateShuffledNumbers,
  getExpectedNumber,
  evaluateOrderClick,
  isVictory,
} = require("../docs/games/order-memory-core.js");

function test(name, fn) {
  try {
    fn();
    console.log("PASS", name);
  } catch (error) {
    console.error("FAIL", name);
    throw error;
  }
}

test("generateShuffledNumbers returns digits 1 through 9 without duplicates", () => {
  const numbers = generateShuffledNumbers();
  const sorted = numbers.slice().sort((left, right) => left - right);

  assert.strictEqual(numbers.length, 9);
  assert.deepStrictEqual(sorted, [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});

test("getExpectedNumber starts at 1 and advances after each correct pick", () => {
  assert.strictEqual(getExpectedNumber(0), 1);
  assert.strictEqual(getExpectedNumber(3), 4);
  assert.strictEqual(getExpectedNumber(8), 9);
});

test("evaluateOrderClick reports correct when numbers match", () => {
  assert.deepStrictEqual(evaluateOrderClick(1, 1), { status: "correct" });
  assert.deepStrictEqual(evaluateOrderClick(5, 5), { status: "correct" });
});

test("evaluateOrderClick reports wrong when numbers do not match", () => {
  assert.deepStrictEqual(evaluateOrderClick(1, 3), { status: "wrong" });
});

test("isVictory is true only after nine correct picks", () => {
  assert.strictEqual(isVictory(8), false);
  assert.strictEqual(isVictory(9), true);
});
