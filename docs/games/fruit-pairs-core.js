(function (globalScope) {
  "use strict";

  var DIFFICULTIES = {
    easy: {
      id: "easy",
      label: "De",
      themeClass: "difficulty-easy",
      pairCount: 5,
    },
    medium: {
      id: "medium",
      label: "Trung binh",
      themeClass: "difficulty-medium",
      pairCount: 10,
    },
    hard: {
      id: "hard",
      label: "Kho",
      themeClass: "difficulty-hard",
      pairCount: 15,
    },
  };

  var FRUIT_LIBRARY = [
    { id: "fruit-0", label: "Chanh", spriteX: 0, spriteY: 120 },
    { id: "fruit-1", label: "Buoi hong", spriteX: 256, spriteY: 120 },
    { id: "fruit-2", label: "Sau rieng", spriteX: 512, spriteY: 120 },
    { id: "fruit-3", label: "Sung", spriteX: 768, spriteY: 120 },
    { id: "fruit-4", label: "Quyt", spriteX: 0, spriteY: 305 },
    { id: "fruit-5", label: "Kiwi", spriteX: 256, spriteY: 305 },
    { id: "fruit-6", label: "Cam", spriteX: 512, spriteY: 305 },
    { id: "fruit-7", label: "Xoai", spriteX: 768, spriteY: 305 },
    { id: "fruit-8", label: "Vai", spriteX: 0, spriteY: 488 },
    { id: "fruit-9", label: "Oi xanh", spriteX: 256, spriteY: 488 },
    { id: "fruit-10", label: "Chanh xanh", spriteX: 512, spriteY: 488 },
    { id: "fruit-11", label: "Cam do", spriteX: 768, spriteY: 488 },
    { id: "fruit-12", label: "Chuoi", spriteX: 0, spriteY: 670 },
    { id: "fruit-13", label: "Le", spriteX: 256, spriteY: 670 },
    { id: "fruit-14", label: "Dao", spriteX: 512, spriteY: 670 },
    { id: "fruit-15", label: "Tao xanh", spriteX: 768, spriteY: 670 },
  ];

  function getDifficultyConfig(level) {
    return DIFFICULTIES[level] || DIFFICULTIES.easy;
  }

  function createFruitDeck(fruitLibrary, pairCount, randomFn) {
    var random = typeof randomFn === "function" ? randomFn : Math.random;
    var selectedFruits = fruitLibrary.slice(0, pairCount);
    var deck = selectedFruits.reduce(function (result, fruit) {
      result.push({
        id: fruit.id + "-a",
        fruitId: fruit.id,
        label: fruit.label,
        spriteX: fruit.spriteX,
        spriteY: fruit.spriteY,
      });
      result.push({
        id: fruit.id + "-b",
        fruitId: fruit.id,
        label: fruit.label,
        spriteX: fruit.spriteX,
        spriteY: fruit.spriteY,
      });
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

  var api = {
    FRUIT_LIBRARY: FRUIT_LIBRARY,
    getDifficultyConfig: getDifficultyConfig,
    createFruitDeck: createFruitDeck,
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }

  globalScope.FruitPairsCore = api;
})(typeof window !== "undefined" ? window : globalThis);
