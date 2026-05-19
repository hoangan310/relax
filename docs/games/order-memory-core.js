(function (globalScope) {
  "use strict";

  var BOARD_SIZE = 9;

  function generateShuffledNumbers(randomFn) {
    var numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    var random = typeof randomFn === "function" ? randomFn : Math.random;
    var index;
    var swapIndex;
    var temp;

    for (index = numbers.length - 1; index > 0; index -= 1) {
      swapIndex = Math.floor(random() * (index + 1));
      temp = numbers[index];
      numbers[index] = numbers[swapIndex];
      numbers[swapIndex] = temp;
    }

    return numbers;
  }

  function getExpectedNumber(correctCount) {
    return correctCount + 1;
  }

  function evaluateOrderClick(expectedNumber, clickedNumber) {
    if (clickedNumber === expectedNumber) {
      return { status: "correct" };
    }

    return { status: "wrong" };
  }

  function isVictory(correctCount) {
    return correctCount === BOARD_SIZE;
  }

  var api = {
    BOARD_SIZE: BOARD_SIZE,
    generateShuffledNumbers: generateShuffledNumbers,
    getExpectedNumber: getExpectedNumber,
    evaluateOrderClick: evaluateOrderClick,
    isVictory: isVictory,
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }

  globalScope.OrderMemoryCore = api;
})(typeof window !== "undefined" ? window : globalThis);
