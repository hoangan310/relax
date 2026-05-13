(function () {
  var boardElement = document.querySelector("#pairs-board");
  var statusElement = document.querySelector("#pairs-status-box");
  var countElement = document.querySelector("#pairs-count");
  var startButton = document.querySelector("#pairs-start-button");
  var restartButton = document.querySelector("#pairs-restart-button");
  var cardValues = ["Hoa", "No", "Gau"];
  var hideTimerId = null;
  var state = {
    deck: [],
    flippedIds: [],
    matchedIds: [],
    phase: "idle",
    busy: false,
  };

  function setStatus(message) {
    statusElement.textContent = message;
  }

  function clearHideTimer() {
    if (hideTimerId) {
      window.clearTimeout(hideTimerId);
      hideTimerId = null;
    }
  }

  function renderBoard() {
    countElement.textContent =
      String(state.matchedIds.length / 2) + "/" + String(cardValues.length);

    boardElement.innerHTML = state.deck
      .map(function (card) {
        var isFlipped =
          state.flippedIds.includes(card.id) || state.matchedIds.includes(card.id);
        var isMatched = state.matchedIds.includes(card.id);
        var isDisabled = state.busy || isMatched;

        return (
          '<button class="pair-card' +
          (isFlipped ? "" : " hidden") +
          (isMatched ? " matched" : "") +
          '" type="button" data-card-id="' +
          card.id +
          '"' +
          (isDisabled ? " disabled" : "") +
          ">" +
          '<span class="pair-card-front">' +
          card.value +
          "</span>" +
          '<span class="pair-card-back">?</span>' +
          "</button>"
        );
      })
      .join("");
  }

  function setupGame() {
    clearHideTimer();
    state.deck = window.PairsCore.createPairDeck(cardValues);
    state.flippedIds = [];
    state.matchedIds = [];
    state.phase = "playing";
    state.busy = false;
    renderBoard();
    setStatus("Hay lat 2 the va nho vi tri cua chung nhe.");
  }

  function findCardById(cardId) {
    return state.deck.find(function (card) {
      return card.id === cardId;
    });
  }

  function handleCardClick(event) {
    var cardButton = event.target.closest(".pair-card");
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
      setStatus("Mo them 1 the nua de xem co thanh mot cap khong.");
      return;
    }

    firstCard = findCardById(state.flippedIds[0]);
    secondCard = findCardById(state.flippedIds[1]);

    if (window.PairsCore.isPairMatch(firstCard, secondCard)) {
      state.matchedIds = state.matchedIds.concat(state.flippedIds);
      state.flippedIds = [];
      renderBoard();

      if (state.matchedIds.length === state.deck.length) {
        state.phase = "complete";
        setStatus("Con da tim du tat ca cac cap roi. Gioi qua.");
        return;
      }

      setStatus("Dung roi. Con vua tim duoc mot cap giong nhau.");
      return;
    }

    state.busy = true;
    setStatus("Chua trung cap roi. Nhin ky de lan sau nho dung nhe.");
    hideTimerId = window.setTimeout(function () {
      state.flippedIds = [];
      state.busy = false;
      renderBoard();
      setStatus("Thu lai nhe. Hay lat 2 the tiep theo.");
    }, 800);
  }

  startButton.addEventListener("click", setupGame);
  restartButton.addEventListener("click", setupGame);
  boardElement.addEventListener("click", handleCardClick);
  renderBoard();
})();
