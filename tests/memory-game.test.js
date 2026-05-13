const assert = require("assert");

const {
  generateShuffledNumbers,
  createInitialVisibility,
  hideAllTiles,
  revealTile,
} = require("../docs/games/memory-core.js");

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

test("createInitialVisibility starts with every tile visible", () => {
  assert.deepStrictEqual(createInitialVisibility(9), [
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
  ]);
});

test("hideAllTiles hides every tile", () => {
  const visibility = createInitialVisibility(9);

  assert.deepStrictEqual(hideAllTiles(visibility), [
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ]);
});

test("revealTile only reveals the requested tile", () => {
  const hidden = hideAllTiles(createInitialVisibility(9));

  assert.deepStrictEqual(revealTile(hidden, 4), [
    false,
    false,
    false,
    false,
    true,
    false,
    false,
    false,
    false,
  ]);
});
