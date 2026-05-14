(function (globalScope) {
  "use strict";

  var DIFFICULTIES = {
    easy: {
      id: "easy",
      label: "Easy",
      themeClass: "difficulty-easy",
      pairCount: 5,
    },
    medium: {
      id: "medium",
      label: "Medium",
      themeClass: "difficulty-medium",
      pairCount: 10,
    },
    hard: {
      id: "hard",
      label: "Hard",
      themeClass: "difficulty-hard",
      pairCount: 15,
    },
  };

  var FRUIT_LIBRARY = [
    { id: "fruit-0", label: "Lemon", imagePath: "../assets/images/fruits/lemon.png" },
    { id: "fruit-1", label: "Grapefruit", imagePath: "../assets/images/fruits/grapefruit.png" },
    { id: "fruit-2", label: "Durian", imagePath: "../assets/images/fruits/durian.png" },
    { id: "fruit-3", label: "Fig", imagePath: "../assets/images/fruits/fig.png" },
    { id: "fruit-4", label: "Tangerine", imagePath: "../assets/images/fruits/tangerine.png" },
    { id: "fruit-5", label: "Kiwi", imagePath: "../assets/images/fruits/kiwi.png" },
    { id: "fruit-6", label: "Orange", imagePath: "../assets/images/fruits/orange.png" },
    { id: "fruit-7", label: "Mango", imagePath: "../assets/images/fruits/mango.png" },
    { id: "fruit-8", label: "Lychee", imagePath: "../assets/images/fruits/lychee.png" },
    { id: "fruit-9", label: "Guava", imagePath: "../assets/images/fruits/guava.png" },
    { id: "fruit-10", label: "Lime", imagePath: "../assets/images/fruits/lime.png" },
    { id: "fruit-11", label: "Blood Orange", imagePath: "../assets/images/fruits/blood-orange.png" },
    { id: "fruit-12", label: "Banana", imagePath: "../assets/images/fruits/banana.png" },
    { id: "fruit-13", label: "Pear", imagePath: "../assets/images/fruits/pear.png" },
    { id: "fruit-14", label: "Peach", imagePath: "../assets/images/fruits/peach.png" },
    { id: "fruit-15", label: "Green Apple", imagePath: "../assets/images/fruits/green-apple.png" },
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
        imagePath: fruit.imagePath,
      });
      result.push({
        id: fruit.id + "-b",
        fruitId: fruit.id,
        label: fruit.label,
        imagePath: fruit.imagePath,
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
