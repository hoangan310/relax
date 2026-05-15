(function () {
  var boardElement = document.querySelector("#teddy-board");
  var statusElement = document.querySelector("#teddy-status-box");
  var modeLabelElement = document.querySelector("#teddy-mode-label");
  var difficultyGroup = document.querySelector("#teddy-difficulty-group");
  var startButton = document.querySelector("#teddy-start-button");
  var restartButton = document.querySelector("#teddy-restart-button");
  var previewTimerId = null;
  var shuffleTimerId = null;
  var feedbackTimerId = null;
  var state = {
    selectedDifficulty: "easy",
    activeDifficulty: "easy",
    teddyBoxId: 0,
    layout: [],
    phase: "idle",
    busy: false,
    highlightSlots: [],
  };

  function getSelectedLevel() {
    return window.TeddyCore.getLevelConfig(state.selectedDifficulty);
  }

  function getActiveLevel() {
    return window.TeddyCore.getLevelConfig(state.activeDifficulty);
  }

  function setStatus(message) {
    statusElement.textContent = message;
  }

  function clearTimers() {
    if (previewTimerId) {
      window.clearTimeout(previewTimerId);
      previewTimerId = null;
    }

    if (shuffleTimerId) {
      window.clearTimeout(shuffleTimerId);
      shuffleTimerId = null;
    }

    if (feedbackTimerId) {
      window.clearTimeout(feedbackTimerId);
      feedbackTimerId = null;
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

  function getBoxIdAtSlot(slotIndex) {
    return state.layout[slotIndex];
  }

  function renderBoard() {
    var level = getActiveLevel();
    var slotIndex;
    var boxId;
    var isPreview = state.phase === "preview";
    var isReveal = state.phase === "reveal" || state.phase === "wrong";
    var showTeddy = isPreview || isReveal;
    var isClosed = state.phase === "hiding" || state.phase === "shuffling" || state.phase === "guess";
    var isGuessable = state.phase === "guess" && !state.busy;

    modeLabelElement.textContent = level.label;
    boardElement.dataset.level = level.id;
    boardElement.style.setProperty("--teddy-columns", String(level.boxCount));

    boardElement.innerHTML = "";

    for (slotIndex = 0; slotIndex < level.boxCount; slotIndex += 1) {
      boxId = getBoxIdAtSlot(slotIndex);
      var hasTeddy = boxId === state.teddyBoxId;
      var isHighlighted = state.highlightSlots.includes(slotIndex);
      var classes = ["teddy-box"];

      if (showTeddy && hasTeddy) {
        classes.push("show-teddy");
      }

      if (isClosed) {
        classes.push("closed");
      }

      if (isHighlighted) {
        classes.push("shuffle-highlight");
      }

      if (state.phase === "won" && hasTeddy) {
        classes.push("correct");
      }

      if (state.phase === "wrong" && hasTeddy) {
        classes.push("reveal-teddy");
      }

      boardElement.insertAdjacentHTML(
        "beforeend",
        '<button class="' +
          classes.join(" ") +
          '" type="button" data-slot-index="' +
          slotIndex +
          '"' +
          (isGuessable ? "" : " disabled") +
          ">" +
          '<span class="teddy-box-lid" aria-hidden="true"></span>' +
          '<span class="teddy-box-content">' +
          '<span class="teddy-icon" aria-hidden="true">🧸</span>' +
          "</span>" +
          '<span class="teddy-box-label">Hop ' +
          (slotIndex + 1) +
          "</span>" +
          "</button>"
      );
    }
  }

  function resetRound() {
    clearTimers();
    state.phase = "idle";
    state.busy = false;
    state.highlightSlots = [];
    state.layout = [];
    updateDifficultyButtons();
    renderBoard();
    setStatus('Chon do kho, roi bam "Bat dau" de xem gau bong o hop nao.');
  }

  function startRound() {
    var level = getSelectedLevel();
    var round;

    clearTimers();
    state.activeDifficulty = state.selectedDifficulty;
    round = window.TeddyCore.createRoundState(level.boxCount);
    state.teddyBoxId = round.teddyBoxId;
    state.layout = round.layout.slice();
    state.phase = "preview";
    state.busy = true;
    state.highlightSlots = [];
    updateDifficultyButtons();
    renderBoard();
    setStatus("Nhin ky nhe. Gau bong dang o trong mot hop qua.");

    previewTimerId = window.setTimeout(function () {
      state.phase = "hiding";
      renderBoard();
      setStatus("Cac hop sap doi cho...");

      previewTimerId = window.setTimeout(function () {
        runShuffle(0);
      }, 500);
    }, 1800);
  }

  function runShuffle(stepIndex) {
    var level = getActiveLevel();
    var swapPair;

    if (stepIndex >= level.swapCount) {
      state.phase = "guess";
      state.busy = false;
      state.highlightSlots = [];
      renderBoard();
      setStatus("Gio hay cham hop co gau bong nhe.");
      return;
    }

    state.phase = "shuffling";
    swapPair = window.TeddyCore.pickSwapIndices(level.boxCount);
    state.layout = window.TeddyCore.swapBoxPositions(
      state.layout,
      swapPair[0],
      swapPair[1]
    );
    state.highlightSlots = swapPair.slice();
    renderBoard();

    shuffleTimerId = window.setTimeout(function () {
      state.highlightSlots = [];
      renderBoard();
      shuffleTimerId = window.setTimeout(function () {
        runShuffle(stepIndex + 1);
      }, Math.max(120, Math.floor(level.swapIntervalMs * 0.35)));
    }, level.swapIntervalMs);
  }

  function handleBoxClick(event) {
    var button = event.target.closest(".teddy-box");
    var slotIndex;
    var guessedBoxId;
    var result;

    if (!button || state.phase !== "guess" || state.busy) {
      return;
    }

    slotIndex = parseInt(button.dataset.slotIndex, 10);
    guessedBoxId = getBoxIdAtSlot(slotIndex);
    result = window.TeddyCore.evaluateTeddyGuess(state.teddyBoxId, guessedBoxId);
    state.busy = true;

    if (result.status === "correct") {
      state.phase = "won";
      renderBoard();
      setStatus("Dung roi! Con tim thay gau bong roi. Bam Bat dau lai de choi tiep.");
      return;
    }

    state.phase = "wrong";
    renderBoard();
    setStatus("Chua dung hop roi. Nhin lai gau bong va thu lai nhe.");

    feedbackTimerId = window.setTimeout(function () {
      state.busy = false;
      resetRound();
    }, 1600);
  }

  difficultyGroup.addEventListener("click", function (event) {
    var button = event.target.closest(".difficulty-button");

    if (!button || state.busy || state.phase !== "idle") {
      return;
    }

    state.selectedDifficulty = button.dataset.level;
    updateDifficultyButtons();
    modeLabelElement.textContent = getSelectedLevel().label;
  });

  startButton.addEventListener("click", function () {
    if (state.busy && state.phase !== "idle") {
      return;
    }

    startRound();
  });

  restartButton.addEventListener("click", resetRound);
  boardElement.addEventListener("click", handleBoxClick);

  resetRound();
})();
