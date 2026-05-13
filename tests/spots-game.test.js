const assert = require("assert");

const {
  pickUniquePositions,
  evaluateSpotGuess,
} = require("../docs/games/spots-core.js");

function test(name, fn) {
  try {
    fn();
    console.log("PASS", name);
  } catch (error) {
    console.error("FAIL", name);
    throw error;
  }
}

test("pickUniquePositions returns the requested number of unique spots", () => {
  const picks = pickUniquePositions(9, 3, () => 0.1);

  assert.strictEqual(picks.length, 3);
  assert.strictEqual(new Set(picks).size, 3);
  picks.forEach((value) => {
    assert.ok(value >= 0 && value < 9);
  });
});

test("evaluateSpotGuess reports continue while all chosen spots are correct", () => {
  const result = evaluateSpotGuess([1, 4, 7], [1, 4]);

  assert.deepStrictEqual(result, {
    status: "continue",
    matchedCount: 2,
  });
});

test("evaluateSpotGuess reports complete when all target spots are found", () => {
  const result = evaluateSpotGuess([1, 4, 7], [1, 4, 7]);

  assert.deepStrictEqual(result, {
    status: "complete",
    matchedCount: 3,
  });
});

test("evaluateSpotGuess reports wrong when a guessed spot is outside the target set", () => {
  const result = evaluateSpotGuess([1, 4, 7], [1, 3]);

  assert.deepStrictEqual(result, {
    status: "wrong",
    matchedCount: 1,
  });
});
