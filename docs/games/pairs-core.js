(function (globalScope) {
  "use strict";

  function createPairDeck(values, randomFn) {
    var random = typeof randomFn === "function" ? randomFn : Math.random;
    var deck = values.reduce(function (result, value) {
      result.push({ id: value + "-1", value: value });
      result.push({ id: value + "-2", value: value });
      return result;
    }, []);
    var index;
    var swapIndex;
    var temp;

    for (index = deck.length - 1; index > 0; index -= 1) {
      swapIndex = Math.floor(random() * (index + 1));
      temp = deck[index];
      deck[index] = deck[swapIndex];
      deck[swapIndex] = temp;
    }

    return deck;
  }

  function isPairMatch(firstCard, secondCard) {
    return Boolean(
      firstCard &&
        secondCard &&
        firstCard.id !== secondCard.id &&
        firstCard.value === secondCard.value
    );
  }

  var api = {
    createPairDeck: createPairDeck,
    isPairMatch: isPairMatch,
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }

  globalScope.PairsCore = api;
})(typeof window !== "undefined" ? window : globalThis);
