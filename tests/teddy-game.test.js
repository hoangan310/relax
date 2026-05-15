const assert = require("assert");

const {
  LEVELS,
  getLevelConfig,
  createRoundState,
  swapBoxPositions,
  evaluateTeddyGuess,
} = require("../docs/games/teddy-core.js");

function test(name, fn) {
  try {
    fn();
    console.log("PASS", name);
  } catch (error) {
    console.error("FAIL", name);
    throw error;
  }
}

test("getLevelConfig returns easy settings with 3 boxes", () => {
  assert.deepStrictEqual(getLevelConfig("easy"), {
    id: "easy",
    label: "De",
    themeClass: "difficulty-easy",
    boxCount: 3,
    swapCount: 4,
    swapIntervalMs: 700,
  });
});

test("getLevelConfig returns medium settings with 4 boxes", () => {
  assert.strictEqual(getLevelConfig("medium").boxCount, 4);
  assert.ok(getLevelConfig("medium").swapIntervalMs < getLevelConfig("easy").swapIntervalMs);
});

test("getLevelConfig returns hard settings with 5 boxes", () => {
  assert.strictEqual(getLevelConfig("hard").boxCount, 5);
  assert.ok(getLevelConfig("hard").swapIntervalMs < getLevelConfig("medium").swapIntervalMs);
});

test("createRoundState places exactly one teddy in the boxes", () => {
  const round = createRoundState(5, () => 0.2);

  assert.strictEqual(round.boxes.length, 5);
  assert.strictEqual(round.boxes.filter((box) => box.hasTeddy).length, 1);
  assert.ok(round.teddyBoxId >= 0 && round.teddyBoxId < 5);
});

test("swapBoxPositions exchanges two entries in the layout", () => {
  const layout = [0, 1, 2, 3];
  const next = swapBoxPositions(layout, 1, 3);

  assert.deepStrictEqual(next, [0, 3, 2, 1]);
});

test("evaluateTeddyGuess reports a correct pick", () => {
  assert.deepStrictEqual(evaluateTeddyGuess(2, 2), { status: "correct" });
});

test("evaluateTeddyGuess reports a wrong pick", () => {
  assert.deepStrictEqual(evaluateTeddyGuess(2, 0), { status: "wrong" });
});
