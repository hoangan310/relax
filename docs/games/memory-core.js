(function (globalScope) {
  "use strict";

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

  function createInitialVisibility(size) {
    return Array(size).fill(true);
  }

  function hideAllTiles(visibility) {
    return visibility.map(function () {
      return false;
    });
  }

  function revealTile(visibility, index) {
    return visibility.map(function (isVisible, currentIndex) {
      if (currentIndex === index) {
        return true;
      }

      return isVisible;
    });
  }

  var api = {
    generateShuffledNumbers: generateShuffledNumbers,
    createInitialVisibility: createInitialVisibility,
    hideAllTiles: hideAllTiles,
    revealTile: revealTile,
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }

  globalScope.MemoryCore = api;
})(typeof window !== "undefined" ? window : globalThis);
