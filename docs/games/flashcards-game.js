(function () {
  var statusElement = document.querySelector("#flashcards-status");
  var screenElement = document.querySelector("#flashcards-screen");
  var currentAudio = null;
  var state = {
    phase: "loading",
    entries: [],
    topics: [],
    selectedTopic: null,
    selectedDeck: null,
    cards: [],
    cardIndex: 0,
    isPlayingAudio: false,
  };

  function setStatus(message) {
    statusElement.textContent = message;
  }

  function stopAudio() {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      currentAudio = null;
    }

    state.isPlayingAudio = false;
  }

  function playCardAudio(card) {
    var audioUrl = window.FlashcardsCore.resolveAssetPath(card.audio);

    stopAudio();
    currentAudio = new Audio(audioUrl);
    state.isPlayingAudio = true;

    currentAudio.addEventListener(
      "ended",
      function () {
        state.isPlayingAudio = false;
        if (state.phase === "play") {
          renderPlayScreen();
        }
      },
      { once: true }
    );

    currentAudio.addEventListener(
      "error",
      function () {
        state.isPlayingAudio = false;
        setStatus("Khong tai duoc am thanh cho tu \"" + card.word + "\".");
        if (state.phase === "play") {
          renderPlayScreen();
        }
      },
      { once: true }
    );

    currentAudio.play().catch(function () {
      state.isPlayingAudio = false;
      setStatus("Hay bam vao hinh hoac nut loa de nghe lai.");
    });
  }

  function showScreen() {
    screenElement.hidden = false;
  }

  function renderTopicsScreen() {
    state.phase = "topics";
    stopAudio();
    showScreen();

    screenElement.innerHTML =
      '<section class="panel">' +
      '<h2>Chon chu de</h2>' +
      '<div class="flashcard-topic-grid">' +
      state.topics
        .map(function (topic) {
          var deckCount = topic.decks.filter(function (deck) {
            return deck.cardCount > 0;
          }).length;

          return (
            '<button class="flashcard-topic-button" type="button" data-topic-id="' +
            topic.id +
            '">' +
            '<span class="flashcard-topic-emoji" aria-hidden="true">' +
            topic.emoji +
            "</span>" +
            "<strong>" +
            topic.label +
            "</strong>" +
            "<span>" +
            topic.labelVi +
            " · " +
            deckCount +
            " bo the</span>" +
            "</button>"
          );
        })
        .join("") +
      "</div>" +
      "</section>";

    setStatus("Chon mot chu de de bat dau.");
  }

  function renderDecksScreen() {
    var topic = state.selectedTopic;
    var decks = topic.decks.filter(function (deck) {
      return deck.cardCount > 0;
    });

    state.phase = "decks";
    stopAudio();
    showScreen();

    screenElement.innerHTML =
      '<section class="panel">' +
      '<div class="flashcard-screen-header">' +
      "<h2>" +
      topic.emoji +
      " " +
      topic.label +
      "</h2>" +
      '<button class="action-button secondary flashcard-back-button" type="button" data-action="back-topics">' +
      "Quay lai chu de" +
      "</button>" +
      "</div>" +
      '<div class="flashcard-deck-list">' +
      decks
        .map(function (deck) {
          return (
            '<button class="flashcard-deck-button" type="button" data-deck-id="' +
            deck.id +
            '">' +
            "<strong>" +
            deck.label +
            "</strong>" +
            '<span class="flashcard-deck-count">' +
            deck.cardCount +
            " the</span>" +
            "</button>"
          );
        })
        .join("") +
      "</div>" +
      "</section>";

    setStatus("Chon mot bo the trong chu de " + topic.labelVi + ".");
  }

  function renderPlayScreen() {
    var topic = state.selectedTopic;
    var deck = state.selectedDeck;
    var card = window.FlashcardsCore.getCardAt(state.cards, state.cardIndex);
    var imageUrl = window.FlashcardsCore.resolveAssetPath(card.image);
    var canNext = window.FlashcardsCore.canGoNext(
      state.cardIndex,
      state.cards.length
    );
    var canPrev = window.FlashcardsCore.canGoPrev(state.cardIndex);

    state.phase = "play";
    showScreen();

    screenElement.innerHTML =
      '<section class="panel board-panel flashcard-player-panel">' +
      '<div class="flashcard-screen-header">' +
      "<h2>" +
      topic.emoji +
      " " +
      deck.label +
      "</h2>" +
      '<button class="action-button secondary flashcard-back-button" type="button" data-action="back-decks">' +
      "Quay lai bo the" +
      "</button>" +
      "</div>" +
      '<div class="mini-stat-row">' +
      "<span>Tien do:</span>" +
      '<strong id="flashcard-progress">' +
      (state.cardIndex + 1) +
      " / " +
      state.cards.length +
      "</strong>" +
      "</div>" +
      '<div class="flashcard-stage' +
      (state.isPlayingAudio ? " flashcard-playing" : "") +
      '">' +
      '<button class="flashcard-image-button" type="button" data-action="play-audio" aria-label="Nghe tu ' +
      card.word +
      '">' +
      '<img class="flashcard-image" src="' +
      imageUrl +
      '" alt="' +
      card.word +
      '" />' +
      "</button>" +
      '<p class="flashcard-word">' +
      card.word +
      "</p>" +
      '<button class="action-button secondary flashcard-speak-button" type="button" data-action="play-audio">' +
      "Nghe lai" +
      "</button>" +
      "</div>" +
      '<div class="button-row flashcard-nav-row">' +
      '<button class="action-button secondary" type="button" data-action="prev"' +
      (canPrev ? "" : " disabled") +
      ">Truoc</button>" +
      '<button class="action-button primary" type="button" data-action="next"' +
      (canNext ? "" : " disabled") +
      ">Tiep theo</button>" +
      "</div>" +
      "</section>";

    if (canNext) {
      setStatus("Cham vao hinh de nghe \"" + card.word + "\". Bam Tiep theo khi san sang.");
    } else {
      setStatus(
        "Cham vao hinh de nghe lai. Ban da xem het " + state.cards.length + " tu."
      );
    }
  }

  function startDeck(topicId, deckId) {
    var topic = state.topics.find(function (item) {
      return item.id === topicId;
    });
    var deck = topic.decks.find(function (item) {
      return item.id === deckId;
    });
    var cards = window.FlashcardsCore.filterCardsBySlugs(state.entries, deck.slugs);

    if (!cards.length) {
      setStatus("Bo the nay chua co du lieu.");
      return;
    }

    state.selectedTopic = topic;
    state.selectedDeck = deck;
    state.cards = cards;
    state.cardIndex = 0;
    stopAudio();
    renderPlayScreen();
    setStatus("Cham vao hinh de nghe tu tieng Anh.");
  }

  function handleScreenClick(event) {
    var topicButton = event.target.closest(".flashcard-topic-button");
    var deckButton = event.target.closest(".flashcard-deck-button");
    var actionButton = event.target.closest("[data-action]");

    if (topicButton && state.phase === "topics") {
      state.selectedTopic = state.topics.find(function (topic) {
        return topic.id === topicButton.dataset.topicId;
      });
      renderDecksScreen();
      return;
    }

    if (deckButton && state.phase === "decks") {
      startDeck(state.selectedTopic.id, deckButton.dataset.deckId);
      return;
    }

    if (!actionButton) {
      return;
    }

    var action = actionButton.dataset.action;

    if (action === "back-topics") {
      state.selectedTopic = null;
      state.selectedDeck = null;
      renderTopicsScreen();
      return;
    }

    if (action === "back-decks") {
      stopAudio();
      state.selectedDeck = null;
      state.cards = [];
      state.cardIndex = 0;
      renderDecksScreen();
      return;
    }

    if (state.phase !== "play") {
      return;
    }

    if (action === "play-audio") {
      playCardAudio(state.cards[state.cardIndex]);
      renderPlayScreen();
      return;
    }

    if (action === "prev") {
      stopAudio();
      state.cardIndex = window.FlashcardsCore.getPrevIndex(state.cardIndex);
      renderPlayScreen();
      return;
    }

    if (action === "next") {
      if (!window.FlashcardsCore.canGoNext(state.cardIndex, state.cards.length)) {
        return;
      }

      stopAudio();
      state.cardIndex = window.FlashcardsCore.getNextIndex(
        state.cardIndex,
        state.cards.length
      );
      renderPlayScreen();
      setStatus("Cham vao hinh de nghe tu tieng Anh.");
    }
  }

  function loadMapping() {
    setStatus("Dang tai the...");

    fetch("../flashcards/mapping.json")
      .then(function (response) {
        if (!response.ok) {
          throw new Error("mapping fetch failed");
        }

        return response.json();
      })
      .then(function (data) {
        state.entries = window.FlashcardsCore.normalizeMapping(data);
        state.topics = window.FlashcardsCore.enrichTopicsWithCounts(
          window.FlashcardTopics.FLASHCARD_TOPICS,
          state.entries
        );
        renderTopicsScreen();
      })
      .catch(function () {
        setStatus("Khong tai duoc du lieu the. Hay thu tai lai trang.");
      });
  }

  screenElement.addEventListener("click", handleScreenClick);
  loadMapping();
})();
