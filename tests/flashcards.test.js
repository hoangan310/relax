const assert = require("assert");

const { FLASHCARD_TOPICS } = require("../docs/games/flashcards-topics.js");
const {
  normalizeMapping,
  filterCardsBySlugs,
  resolveAssetPath,
  getCardAt,
  getNextIndex,
  getPrevIndex,
  canGoNext,
  canGoPrev,
  countCardsForSlugs,
  enrichTopicsWithCounts,
  shuffleEntries,
  pickRandomIndex,
} = require("../docs/games/flashcards-core.js");
const mapping = require("../docs/flashcards/mapping.json");

function test(name, fn) {
  try {
    fn();
    console.log("PASS", name);
  } catch (error) {
    console.error("FAIL", name);
    throw error;
  }
}

const entries = normalizeMapping(mapping);

test("normalizeMapping keeps valid flashcard entries", () => {
  assert.strictEqual(entries.length, 2343);
});

test("filterCardsBySlugs returns pets deck with 12 cards", () => {
  const cards = filterCardsBySlugs(entries, ["pets-flashcards"]);
  assert.strictEqual(cards.length, 12);
  assert.strictEqual(cards[0].word, "cat");
});

test("resolveAssetPath prefixes relative flashcard paths", () => {
  assert.strictEqual(
    resolveAssetPath("flashcards/images/pets-flashcards/cat.PNG"),
    "../flashcards/images/pets-flashcards/cat.PNG"
  );
  assert.strictEqual(
    resolveAssetPath("flashcards/audio/pets-flashcards/cat.mp3"),
    "../flashcards/audio/pets-flashcards/cat.mp3"
  );
});

test("getNextIndex and getPrevIndex clamp at deck ends", () => {
  assert.strictEqual(getNextIndex(0, 5), 1);
  assert.strictEqual(getNextIndex(4, 5), 4);
  assert.strictEqual(getPrevIndex(0), 0);
  assert.strictEqual(getPrevIndex(2), 1);
  assert.strictEqual(canGoNext(4, 5), false);
  assert.strictEqual(canGoPrev(0), false);
});

test("getCardAt returns null for out of range index", () => {
  const cards = filterCardsBySlugs(entries, ["pets-flashcards"]);
  assert.strictEqual(getCardAt(cards, 0).word, "cat");
  assert.strictEqual(getCardAt(cards, 99), null);
});

test("shuffleEntries keeps all cards as a permutation", () => {
  const sample = entries.slice(0, 20);
  const shuffled = shuffleEntries(sample, () => 0.5);
  const sortWords = (list) => list.map((entry) => entry.word).sort().join(",");

  assert.strictEqual(shuffled.length, sample.length);
  assert.strictEqual(sortWords(shuffled), sortWords(sample));
});

test("pickRandomIndex avoids the current index when possible", () => {
  var calls = 0;
  var randomFn = function () {
    calls += 1;
    return calls === 1 ? 0.3 : 0.9;
  };

  assert.strictEqual(pickRandomIndex(10, 3, randomFn), 9);
  assert.strictEqual(pickRandomIndex(1, 0, () => 0.9), 0);
});

test("enrichTopicsWithCounts adds card counts to decks", () => {
  const enriched = enrichTopicsWithCounts(FLASHCARD_TOPICS, entries);
  const petsDeck = enriched
    .find((topic) => topic.id === "animals")
    .decks.find((deck) => deck.id === "pets");

  assert.strictEqual(petsDeck.cardCount, 12);
});
