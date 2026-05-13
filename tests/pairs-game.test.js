const assert = require("assert");

const {
  createPairDeck,
  isPairMatch,
} = require("../docs/games/pairs-core.js");

function test(name, fn) {
  try {
    fn();
    console.log("PASS", name);
  } catch (error) {
    console.error("FAIL", name);
    throw error;
  }
}

test("createPairDeck duplicates each value exactly twice", () => {
  const deck = createPairDeck(["meo", "tho", "hoa"], () => 0);
  const counts = deck.reduce((map, item) => {
    map[item.value] = (map[item.value] || 0) + 1;
    return map;
  }, {});

  assert.strictEqual(deck.length, 6);
  assert.deepStrictEqual(counts, {
    meo: 2,
    tho: 2,
    hoa: 2,
  });
});

test("each pair deck card has a stable id", () => {
  const deck = createPairDeck(["meo"], () => 0);

  assert.deepStrictEqual(
    deck
      .map((card) => card.id)
      .slice()
      .sort(),
    ["meo-1", "meo-2"]
  );
});

test("isPairMatch returns true for two cards with the same value", () => {
  assert.strictEqual(
    isPairMatch(
      { id: "meo-1", value: "meo" },
      { id: "meo-2", value: "meo" }
    ),
    true
  );
});

test("isPairMatch returns false for cards with different values", () => {
  assert.strictEqual(
    isPairMatch(
      { id: "meo-1", value: "meo" },
      { id: "tho-1", value: "tho" }
    ),
    false
  );
});
