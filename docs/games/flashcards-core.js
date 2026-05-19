(function (globalScope) {
  "use strict";

  var ASSET_PREFIX = "../";

  function normalizeMapping(entries) {
    if (!Array.isArray(entries)) {
      return [];
    }

    return entries.filter(function (entry) {
      return (
        entry &&
        typeof entry.slug === "string" &&
        typeof entry.word === "string" &&
        typeof entry.image === "string" &&
        typeof entry.audio === "string"
      );
    });
  }

  function filterCardsBySlugs(entries, slugs) {
    var slugSet = {};

    slugs.forEach(function (slug) {
      slugSet[slug] = true;
    });

    return entries.filter(function (entry) {
      return slugSet[entry.slug];
    });
  }

  function resolveAssetPath(relativePath) {
    if (!relativePath) {
      return "";
    }

    if (
      relativePath.indexOf("http://") === 0 ||
      relativePath.indexOf("https://") === 0 ||
      relativePath.indexOf("/") === 0
    ) {
      return relativePath;
    }

    return ASSET_PREFIX + relativePath;
  }

  function getCardAt(cards, index) {
    if (!cards.length || index < 0 || index >= cards.length) {
      return null;
    }

    return cards[index];
  }

  function getNextIndex(index, length) {
    if (length <= 0) {
      return 0;
    }

    if (index >= length - 1) {
      return length - 1;
    }

    return index + 1;
  }

  function getPrevIndex(index) {
    if (index <= 0) {
      return 0;
    }

    return index - 1;
  }

  function canGoNext(index, length) {
    return length > 0 && index < length - 1;
  }

  function canGoPrev(index) {
    return index > 0;
  }

  function countCardsForSlugs(entries, slugs) {
    return filterCardsBySlugs(entries, slugs).length;
  }

  function shuffleEntries(entries, randomFn) {
    var list = entries.slice();
    var random = typeof randomFn === "function" ? randomFn : Math.random;
    var index;
    var swapIndex;
    var temp;

    for (index = list.length - 1; index > 0; index -= 1) {
      swapIndex = Math.floor(random() * (index + 1));
      temp = list[index];
      list[index] = list[swapIndex];
      list[swapIndex] = temp;
    }

    return list;
  }

  function pickRandomIndex(length, avoidIndex, randomFn) {
    var random = typeof randomFn === "function" ? randomFn : Math.random;
    var index;

    if (length <= 0) {
      return 0;
    }

    if (length === 1) {
      return 0;
    }

    index = Math.floor(random() * length);

    if (avoidIndex < 0 || avoidIndex >= length) {
      return index;
    }

    while (index === avoidIndex) {
      index = Math.floor(random() * length);
    }

    return index;
  }

  function enrichTopicsWithCounts(topics, entries) {
    return topics.map(function (topic) {
      return {
        id: topic.id,
        label: topic.label,
        labelVi: topic.labelVi,
        emoji: topic.emoji,
        decks: topic.decks.map(function (deck) {
          return {
            id: deck.id,
            label: deck.label,
            slugs: deck.slugs.slice(),
            cardCount: countCardsForSlugs(entries, deck.slugs),
          };
        }),
      };
    });
  }

  var api = {
    ASSET_PREFIX: ASSET_PREFIX,
    normalizeMapping: normalizeMapping,
    filterCardsBySlugs: filterCardsBySlugs,
    resolveAssetPath: resolveAssetPath,
    getCardAt: getCardAt,
    getNextIndex: getNextIndex,
    getPrevIndex: getPrevIndex,
    canGoNext: canGoNext,
    canGoPrev: canGoPrev,
    countCardsForSlugs: countCardsForSlugs,
    enrichTopicsWithCounts: enrichTopicsWithCounts,
    shuffleEntries: shuffleEntries,
    pickRandomIndex: pickRandomIndex,
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }

  globalScope.FlashcardsCore = api;
})(typeof window !== "undefined" ? window : globalThis);
