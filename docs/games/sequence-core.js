(function (globalScope) {
  "use strict";

  function createSequence(length, options, randomFn) {
    var availableOptions = Array.isArray(options) ? options.slice() : [];
    var random = typeof randomFn === "function" ? randomFn : Math.random;
    var sequence = [];
    var index;

    for (index = 0; index < length; index += 1) {
      sequence.push(
        availableOptions[Math.floor(random() * availableOptions.length)]
      );
    }

    return sequence;
  }

  function evaluateSequenceGuess(expectedSequence, guessedSequence) {
    var index;

    for (index = 0; index < guessedSequence.length; index += 1) {
      if (guessedSequence[index] !== expectedSequence[index]) {
        return {
          status: "wrong",
          matchedCount: index,
        };
      }
    }

    if (guessedSequence.length === expectedSequence.length) {
      return {
        status: "complete",
        matchedCount: guessedSequence.length,
      };
    }

    return {
      status: "continue",
      matchedCount: guessedSequence.length,
    };
  }

  var api = {
    createSequence: createSequence,
    evaluateSequenceGuess: evaluateSequenceGuess,
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }

  globalScope.SequenceCore = api;
})(typeof window !== "undefined" ? window : globalThis);
