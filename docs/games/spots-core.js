(function (globalScope) {
  "use strict";

  function pickUniquePositions(totalSlots, count, randomFn) {
    var random = typeof randomFn === "function" ? randomFn : Math.random;
    var pool = [];
    var picks = [];
    var index;
    var chosenIndex;

    for (index = 0; index < totalSlots; index += 1) {
      pool.push(index);
    }

    for (index = 0; index < count && pool.length > 0; index += 1) {
      chosenIndex = Math.floor(random() * pool.length);
      picks.push(pool[chosenIndex]);
      pool.splice(chosenIndex, 1);
    }

    return picks;
  }

  function evaluateSpotGuess(targetSpots, guessedSpots) {
    var sortedTargets = targetSpots.slice().sort();
    var sortedGuesses = guessedSpots.slice().sort();
    var index;

    for (index = 0; index < sortedGuesses.length; index += 1) {
      if (!sortedTargets.includes(sortedGuesses[index])) {
        return {
          status: "wrong",
          matchedCount: index,
        };
      }
    }

    if (sortedGuesses.length === sortedTargets.length) {
      return {
        status: "complete",
        matchedCount: sortedGuesses.length,
      };
    }

    return {
      status: "continue",
      matchedCount: sortedGuesses.length,
    };
  }

  var api = {
    pickUniquePositions: pickUniquePositions,
    evaluateSpotGuess: evaluateSpotGuess,
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }

  globalScope.SpotsCore = api;
})(typeof window !== "undefined" ? window : globalThis);
