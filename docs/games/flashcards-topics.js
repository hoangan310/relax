(function (globalScope) {
  "use strict";

  var FLASHCARD_TOPICS = [
    {
      id: "animals",
      label: "Animals",
      labelVi: "Con vat",
      emoji: "🐾",
      decks: [
        { id: "pets", label: "Pets", slugs: ["pets-flashcards"] },
        {
          id: "wild-kids-1",
          label: "Wild animals 1",
          slugs: ["kids-flashcard-wild-animals-1"],
        },
        {
          id: "wild-kids-2",
          label: "Wild animals 2",
          slugs: ["kids-flashcard-wild-animals-2"],
        },
        {
          id: "wild-kids-3",
          label: "Wild animals 3",
          slugs: ["kids-flashcard-wild-animals-3"],
        },
        {
          id: "wild-1",
          label: "Wild animals set 1",
          slugs: ["wild-animals-flashcards-1"],
        },
        {
          id: "wild-3",
          label: "Wild animals set 3",
          slugs: ["wild-animals-flashcards-3"],
        },
        {
          id: "farm",
          label: "Farm animals",
          slugs: ["farm-animals-flashcards", "kids-flashcard-farm-animals-1"],
        },
        { id: "birds", label: "Birds", slugs: ["birds-flashcards", "kids-flashcard-birds-1"] },
        { id: "bugs", label: "Bugs", slugs: ["bugs-flashcards"] },
        {
          id: "sea",
          label: "Sea animals",
          slugs: [
            "sea-animals-flashcards",
            "sea-animals-flashcards-2",
            "kids-flashcard-marine-animals-1",
          ],
        },
      ],
    },
    {
      id: "house",
      label: "House",
      labelVi: "Nha cua",
      emoji: "🏠",
      decks: [
        {
          id: "rooms",
          label: "Rooms at home",
          slugs: ["kids-flashcard-house-1", "vocabulary-rooms-in-my-house"],
        },
        {
          id: "things",
          label: "Things at home",
          slugs: ["vocabulary-things-in-my-house", "kitchen-objects-flashcards"],
        },
      ],
    },
    {
      id: "body",
      label: "Body",
      labelVi: "Co the",
      emoji: "🧒",
      decks: [
        { id: "body-basic", label: "Body basics", slugs: ["body-flashcards"] },
        {
          id: "body-kids-1",
          label: "Body parts 1",
          slugs: ["kids-flashcard-body-parts-1", "kids-flashcard-body-parts-2"],
        },
        {
          id: "body-kids-2",
          label: "Body parts 2",
          slugs: ["kids-flashcard-body-parts-3", "kids-flashcard-body-parts-4"],
        },
        {
          id: "animal-body",
          label: "Animal body parts",
          slugs: ["animal-body-parts-flashcards"],
        },
      ],
    },
    {
      id: "food",
      label: "Food",
      labelVi: "Do an",
      emoji: "🍎",
      decks: [
        {
          id: "fruits",
          label: "Fruits",
          slugs: ["fruit-flashcards", "fruit-flashcards-2", "vocabulary-fruits"],
        },
        {
          id: "vegetables",
          label: "Vegetables",
          slugs: ["vegetables-flashcards", "vocabulary-vegetables"],
        },
        {
          id: "food-set",
          label: "Food sets",
          slugs: ["food-flashcards-1", "food-flashcards-2", "food-flashcards-3"],
        },
        {
          id: "drinks",
          label: "Drinks",
          slugs: ["drinks-flashcards", "drinks-flashcards-1"],
        },
      ],
    },
    {
      id: "nature",
      label: "Nature",
      labelVi: "Thien nhien",
      emoji: "🌿",
      decks: [
        {
          id: "weather",
          label: "Weather",
          slugs: [
            "weather-flashcards",
            "weather-flashcards-1",
            "weather-flashcards-2",
            "vocabulary-weather",
          ],
        },
        {
          id: "seasons",
          label: "Seasons",
          slugs: [
            "seasons-flashcards",
            "seasons-flashcards-1",
            "seasons-flashcards-2",
            "spring-flashcards",
            "autumn-flashcards",
          ],
        },
        {
          id: "plants",
          label: "Plants and flowers",
          slugs: ["plants-flashcards", "flowers-1", "flowers-2"],
        },
        {
          id: "earth",
          label: "Earth and oceans",
          slugs: ["5-oceans", "7-continents", "7-continents-1"],
        },
      ],
    },
  ];

  if (typeof module !== "undefined" && module.exports) {
    module.exports = { FLASHCARD_TOPICS: FLASHCARD_TOPICS };
  }

  globalScope.FlashcardTopics = {
    FLASHCARD_TOPICS: FLASHCARD_TOPICS,
  };
})(typeof window !== "undefined" ? window : globalThis);
