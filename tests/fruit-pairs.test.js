const assert = require("assert");

const {
  FRUIT_LIBRARY,
  getDifficultyConfig,
  createFruitDeck,
} = require("../docs/games/fruit-pairs-core.js");

function test(name, fn) {
  try {
    fn();
    console.log("PASS", name);
  } catch (error) {
    console.error("FAIL", name);
    throw error;
  }
}

test("getDifficultyConfig returns the easy mode settings", () => {
  assert.deepStrictEqual(getDifficultyConfig("easy"), {
    id: "easy",
    label: "Easy",
    themeClass: "difficulty-easy",
    pairCount: 5,
  });
});

test("getDifficultyConfig returns the medium mode settings", () => {
  assert.deepStrictEqual(getDifficultyConfig("medium"), {
    id: "medium",
    label: "Medium",
    themeClass: "difficulty-medium",
    pairCount: 10,
  });
});

test("getDifficultyConfig returns the hard mode settings", () => {
  assert.deepStrictEqual(getDifficultyConfig("hard"), {
    id: "hard",
    label: "Hard",
    themeClass: "difficulty-hard",
    pairCount: 15,
  });
});

test("fruit library contains enough unique fruits for hard mode", () => {
  assert.ok(FRUIT_LIBRARY.length >= 15);
  assert.strictEqual(new Set(FRUIT_LIBRARY.map((fruit) => fruit.id)).size, FRUIT_LIBRARY.length);
});

test("createFruitDeck duplicates each selected fruit exactly twice", () => {
  const deck = createFruitDeck(FRUIT_LIBRARY, 5, () => 0);
  const counts = deck.reduce((map, card) => {
    map[card.fruitId] = (map[card.fruitId] || 0) + 1;
    return map;
  }, {});

  assert.strictEqual(deck.length, 10);
  Object.values(counts).forEach((count) => {
    assert.strictEqual(count, 2);
  });
  assert.strictEqual(Object.keys(counts).length, 5);
});

test("createFruitDeck preserves stable card ids even after shuffling", () => {
  const deck = createFruitDeck(FRUIT_LIBRARY.slice(0, 1), 1, () => 0);

  assert.deepStrictEqual(
    deck
      .map((card) => card.id)
      .slice()
      .sort(),
    ["fruit-0-a", "fruit-0-b"]
  );
});
