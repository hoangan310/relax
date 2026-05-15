(function (globalScope) {
  "use strict";

  var LEVELS = {
    easy: {
      id: "easy",
      label: "De",
      themeClass: "difficulty-easy",
      boxCount: 3,
      swapCount: 4,
      swapIntervalMs: 700,
    },
    medium: {
      id: "medium",
      label: "Trung binh",
      themeClass: "difficulty-medium",
      boxCount: 4,
      swapCount: 6,
      swapIntervalMs: 520,
    },
    hard: {
      id: "hard",
      label: "Kho",
      themeClass: "difficulty-hard",
      boxCount: 5,
      swapCount: 8,
      swapIntervalMs: 380,
    },
  };

  function getLevelConfig(level) {
    return LEVELS[level] || LEVELS.easy;
  }

  function createRoundState(boxCount, randomFn) {
    var random = typeof randomFn === "function" ? randomFn : Math.random;
    var teddyBoxId = Math.floor(random() * boxCount);
    var index;
    var boxes = [];

    for (index = 0; index < boxCount; index += 1) {
      boxes.push({
        id: index,
        hasTeddy: index === teddyBoxId,
      });
    }

    return {
      teddyBoxId: teddyBoxId,
      boxes: boxes,
      layout: boxes.map(function (_, slotIndex) {
        return slotIndex;
      }),
    };
  }

  function swapBoxPositions(layout, firstIndex, secondIndex) {
    var nextLayout = layout.slice();
    var temp = nextLayout[firstIndex];

    nextLayout[firstIndex] = nextLayout[secondIndex];
    nextLayout[secondIndex] = temp;

    return nextLayout;
  }

  function pickSwapIndices(boxCount, randomFn) {
    var random = typeof randomFn === "function" ? randomFn : Math.random;
    var firstIndex = Math.floor(random() * boxCount);
    var secondIndex = Math.floor(random() * boxCount);

    while (secondIndex === firstIndex) {
      secondIndex = Math.floor(random() * boxCount);
    }

    return [firstIndex, secondIndex];
  }

  function getTeddySlotIndex(layout, teddyBoxId) {
    return layout.indexOf(teddyBoxId);
  }

  function evaluateTeddyGuess(teddyBoxId, guessedBoxId) {
    if (guessedBoxId === teddyBoxId) {
      return { status: "correct" };
    }

    return { status: "wrong" };
  }

  var api = {
    LEVELS: LEVELS,
    getLevelConfig: getLevelConfig,
    createRoundState: createRoundState,
    swapBoxPositions: swapBoxPositions,
    pickSwapIndices: pickSwapIndices,
    getTeddySlotIndex: getTeddySlotIndex,
    evaluateTeddyGuess: evaluateTeddyGuess,
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }

  globalScope.TeddyCore = api;
})(typeof window !== "undefined" ? window : globalThis);
