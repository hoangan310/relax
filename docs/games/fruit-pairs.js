(function () {
  var boardElement = document.querySelector("#fruit-board");
  var statusElement = document.querySelector("#fruit-status-box");
  var pairsCountElement = document.querySelector("#fruit-pairs-count");
  var modeLabelElement = document.querySelector("#fruit-mode-label");
  var difficultyGroup = document.querySelector("#fruit-difficulty-group");
  var startButton = document.querySelector("#fruit-start-button");
  var restartButton = document.querySelector("#fruit-restart-button");
  var hideTimerId = null;
  var state = {
    selectedDifficulty: "easy",
    activeDifficulty: "easy",
    deck: [],
    flippedIds: [],
    matchedIds: [],
    phase: "idle",
    busy: false,
  };

  function getSelectedDifficulty() {
    return window.FruitPairsCore.getDifficultyConfig(state.selectedDifficulty);
  }

  function getActiveDifficulty() {
    return window.FruitPairsCore.getDifficultyConfig(state.activeDifficulty);
  }

  function setStatus(message) {
    statusElement.textContent = message;
  }

  function clearHideTimer() {
    if (hideTimerId) {
      window.clearTimeout(hideTimerId);
      hideTimerId = null;
    }
  }

  function updateDifficultyButtons() {
    difficultyGroup.querySelectorAll(".difficulty-button").forEach(function (button) {
      button.classList.toggle(
        "active",
        button.dataset.level === state.selectedDifficulty
      );
    });
  }

  function renderBoard() {
    var difficulty = getActiveDifficulty();

    pairsCountElement.textContent =
      String(state.matchedIds.length / 2) + "/" + String(difficulty.pairCount);
    modeLabelElement.textContent = difficulty.label;
    boardElement.dataset.level = difficulty.id;
    boardElement.style.setProperty("--fruit-columns", "5");

    boardElement.innerHTML = state.deck
      .map(function (card) {
        var isFlipped =
          state.flippedIds.includes(card.id) || state.matchedIds.includes(card.id);
        var isMatched = state.matchedIds.includes(card.id);
        var isDisabled = state.busy || isMatched;

        return (
          '<button class="fruit-card' +
          (isFlipped ? "" : " hidden") +
          (isMatched ? " matched" : "") +
          '" type="button" data-card-id="' +
          card.id +
          '"' +
          (isDisabled ? " disabled" : "") +
          ">" +
          '<span class="fruit-card-front">' +
          '<span class="fruit-sprite" style="--fruit-x:' +
          card.spriteX +
          "px; --fruit-y:" +
          card.spriteY +
          'px;" aria-hidden="true"></span>' +
          '<span class="fruit-card-label">' +
          card.label +
          "</span>" +
          "</span>" +
          '<span class="fruit-card-back">?</span>' +
          "</button>"
        );
      })
      .join("");
  }

  function findCardById(cardId) {
    return state.deck.find(function (card) {
      return card.id === cardId;
    });
  }

  function setupGame() {
    var difficulty = getSelectedDifficulty();

    clearHideTimer();
    state.activeDifficulty = state.selectedDifficulty;
    state.deck = window.FruitPairsCore.createFruitDeck(
      window.FruitPairsCore.FRUIT_LIBRARY,
      difficulty.pairCount
    );
    state.flippedIds = [];
    state.matchedIds = [];
    state.phase = "playing";
    state.busy = false;
    updateDifficultyButtons();
    renderBoard();
    setStatus(
      "Muc " +
        difficulty.label.toLowerCase() +
        ": hay lat 2 the de tim du " +
        difficulty.pairCount +
        " cap hinh giong nhau."
    );
  }

  function handleDifficultyClick(event) {
    var button = event.target.closest(".difficulty-button");

    if (!button) {
      return;
    }

    state.selectedDifficulty = button.dataset.level;
    updateDifficultyButtons();

    if (state.phase === "idle") {
      renderBoard();
      setStatus(
        "Da chon muc " +
          getSelectedDifficulty().label.toLowerCase() +
          '. Bam "Bat dau" de choi.'
      );
      return;
    }

    setStatus(
      "Da doi sang muc " +
        getSelectedDifficulty().label.toLowerCase() +
        '. Bam "Bat dau lai" de xao bo the moi.'
    );
  }

  function handleCardClick(event) {
    var cardButton = event.target.closest(".fruit-card");
    var cardId;
    var firstCard;
    var secondCard;

    if (!cardButton || state.phase !== "playing" || state.busy) {
      return;
    }

    cardId = cardButton.dataset.cardId;

    if (
      state.flippedIds.includes(cardId) ||
      state.matchedIds.includes(cardId)
    ) {
      return;
    }

    state.flippedIds.push(cardId);
    renderBoard();

    if (state.flippedIds.length < 2) {
      setStatus("Mo them 1 the nua de tim cap hinh giong nhau.");
      return;
    }

    firstCard = findCardById(state.flippedIds[0]);
    secondCard = findCardById(state.flippedIds[1]);

    if (firstCard.fruitId === secondCard.fruitId) {
      state.matchedIds = state.matchedIds.concat(state.flippedIds);
      state.flippedIds = [];
      renderBoard();

      if (state.matchedIds.length === state.deck.length) {
        state.phase = "complete";
        setStatus("Chien thang roi. Con da tim het tat ca cac cap trai cay.");
        return;
      }

      setStatus("Dung roi. Con vua tim duoc mot cap hinh giong nhau.");
      return;
    }

    state.busy = true;
    setStatus("Chua trung cap roi. Nhin ky de nho vi tri cho lan sau nhe.");
    hideTimerId = window.setTimeout(function () {
      state.flippedIds = [];
      state.busy = false;
      renderBoard();
      setStatus("Thu lai nhe. Hay lat 2 the tiep theo.");
    }, 900);
  }

  difficultyGroup.addEventListener("click", handleDifficultyClick);
  startButton.addEventListener("click", setupGame);
  restartButton.addEventListener("click", setupGame);
  boardElement.addEventListener("click", handleCardClick);

  updateDifficultyButtons();
  renderBoard();
})();
