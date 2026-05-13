const assert = require("assert");

const {
  createSequence,
  evaluateSequenceGuess,
} = require("../docs/games/sequence-core.js");

function test(name, fn) {
  try {
    fn();
    console.log("PASS", name);
  } catch (error) {
    console.error("FAIL", name);
    throw error;
  }
}

test("createSequence builds a sequence of the requested length", () => {
  const sequence = createSequence(4, ["hong", "tim", "vang"], () => 0.2);

  assert.strictEqual(sequence.length, 4);
  sequence.forEach((item) => {
    assert.ok(["hong", "tim", "vang"].includes(item));
  });
});

test("evaluateSequenceGuess reports continue while the partial guess is correct", () => {
  const result = evaluateSequenceGuess(
    ["hong", "tim", "vang"],
    ["hong", "tim"]
  );

  assert.deepStrictEqual(result, {
    status: "continue",
    matchedCount: 2,
  });
});

test("evaluateSequenceGuess reports complete when the full sequence matches", () => {
  const result = evaluateSequenceGuess(
    ["hong", "tim", "vang"],
    ["hong", "tim", "vang"]
  );

  assert.deepStrictEqual(result, {
    status: "complete",
    matchedCount: 3,
  });
});

test("evaluateSequenceGuess reports wrong when a click breaks the sequence", () => {
  const result = evaluateSequenceGuess(
    ["hong", "tim", "vang"],
    ["hong", "vang"]
  );

  assert.deepStrictEqual(result, {
    status: "wrong",
    matchedCount: 1,
  });
});
