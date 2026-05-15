(function () {
  var boardElement = document.querySelector("#teddy-board");
  var boardWrapElement = document.querySelector(".teddy-board-wrap");
  var shuffleHintElement = document.querySelector("#teddy-shuffle-hint");
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
    isAnimatingSwap: false,
  };

  function getSelectedLevel() {
    return window.TeddyCore.getLevelConfig(state.selectedDifficulty);
  }

  function getActiveLevel() {
    return window.TeddyCore.getLevelConfig(state.activeDifficulty);
  }

  function getSwapDurationMs() {
    var level = getActiveLevel();
    return Math.max(680, level.swapIntervalMs + 180);
  }

  function getPauseAfterSwapMs() {
    var level = getActiveLevel();
    return Math.max(220, Math.floor(level.swapIntervalMs * 0.42));
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

  function hideSwapHint() {
    if (!shuffleHintElement) {
      return;
    }

    shuffleHintElement.classList.remove("visible");
    shuffleHintElement.hidden = true;
  }

  function showSwapHint(firstBox, secondBox) {
    var wrapRect;
    var firstRect;
    var secondRect;
    var centerX;
    var centerY;

    if (!shuffleHintElement || !boardWrapElement) {
      return;
    }

    wrapRect = boardWrapElement.getBoundingClientRect();
    firstRect = firstBox.getBoundingClientRect();
    secondRect = secondBox.getBoundingClientRect();
    centerX = (firstRect.left + firstRect.right + secondRect.left + secondRect.right) / 4;
    centerY = (firstRect.top + secondRect.top) / 2;

    shuffleHintElement.style.left = centerX - wrapRect.left + "px";
    shuffleHintElement.style.top = centerY - wrapRect.top + "px";
    shuffleHintElement.hidden = false;
    shuffleHintElement.classList.add("visible");
  }

  function renderBoard() {
    var level = getActiveLevel();
    var slotIndex;
    var boxId;
    var isPreview = state.phase === "preview";
    var isReveal = state.phase === "reveal" || state.phase === "wrong";
    var showTeddy = isPreview || isReveal;
    var isClosed =
      state.phase === "hiding" ||
      state.phase === "shuffling" ||
      state.phase === "guess";
    var isGuessable = state.phase === "guess" && !state.busy && !state.isAnimatingSwap;

    if (state.isAnimatingSwap) {
      return;
    }

    modeLabelElement.textContent = level.label;
    boardElement.dataset.level = level.id;
    boardElement.style.setProperty("--teddy-columns", String(level.boxCount));
    boardElement.classList.toggle("is-shuffling", state.phase === "shuffling");

    boardElement.innerHTML = "";

    for (slotIndex = 0; slotIndex < level.boxCount; slotIndex += 1) {
      boxId = getBoxIdAtSlot(slotIndex);
      var hasTeddy = boxId === state.teddyBoxId;
      var classes = ["teddy-box", "teddy-tone-" + String(boxId % 5)];

      if (showTeddy && hasTeddy) {
        classes.push("show-teddy");
      }

      if (isClosed) {
        classes.push("closed");
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
          '" data-box-id="' +
          boxId +
          '"' +
          (isGuessable ? "" : " disabled") +
          ">" +
          '<span class="teddy-box-ribbon" aria-hidden="true"></span>' +
          '<span class="teddy-box-lid" aria-hidden="true"></span>' +
          '<span class="teddy-box-content">' +
          '<span class="teddy-icon" aria-hidden="true">🧸</span>' +
          "</span>" +
          '<span class="teddy-box-label">Hop ' +
          (boxId + 1) +
          "</span>" +
          "</button>"
      );
    }
  }

  function resetRound() {
    clearTimers();
    hideSwapHint();
    state.phase = "idle";
    state.busy = false;
    state.isAnimatingSwap = false;
    state.layout = [];
    boardElement.classList.remove("is-shuffling");
    updateDifficultyButtons();
    renderBoard();
    setStatus('Chon do kho, roi bam "Bat dau" de xem gau bong o hop nao.');
  }

  function startRound() {
    var level = getSelectedLevel();
    var round;

    clearTimers();
    hideSwapHint();
    state.activeDifficulty = state.selectedDifficulty;
    round = window.TeddyCore.createRoundState(level.boxCount);
    state.teddyBoxId = round.teddyBoxId;
    state.layout = round.layout.slice();
    state.phase = "preview";
    state.busy = true;
    state.isAnimatingSwap = false;
    updateDifficultyButtons();
    renderBoard();
    setStatus("Nhin ky nhe. Gau bong dang o trong mot hop qua.");

    previewTimerId = window.setTimeout(function () {
      state.phase = "hiding";
      renderBoard();
      setStatus("Cac hop sap doi cho... Hay nhin mau tung hop nhe.");

      previewTimerId = window.setTimeout(function () {
        state.phase = "shuffling";
        boardElement.classList.add("is-shuffling");
        setStatus("Hai hop dang doi cho voi nhau. Hay theo doi!");
        runShuffle(0);
      }, 700);
    }, 2000);
  }

  function animateSwap(firstSlot, secondSlot, done) {
    var firstBox = boardElement.children[firstSlot];
    var secondBox = boardElement.children[secondSlot];
    var firstRect;
    var secondRect;
    var deltaX;
    var deltaY;
    var durationMs = getSwapDurationMs();
    var swapCurve = "cubic-bezier(0.34, 1.25, 0.64, 1)";

    if (!firstBox || !secondBox) {
      state.layout = window.TeddyCore.swapBoxPositions(
        state.layout,
        firstSlot,
        secondSlot
      );
      renderBoard();
      done();
      return;
    }

    state.isAnimatingSwap = true;
    firstRect = firstBox.getBoundingClientRect();
    secondRect = secondBox.getBoundingClientRect();
    deltaX = secondRect.left - firstRect.left;
    deltaY = secondRect.top - firstRect.top;

    firstBox.classList.add("swap-active", "swap-moving");
    secondBox.classList.add("swap-active", "swap-moving");
    showSwapHint(firstBox, secondBox);

    firstBox.style.transition = "none";
    secondBox.style.transition = "none";
    firstBox.style.transform = "translate(0px, 0px) scale(1)";
    secondBox.style.transform = "translate(0px, 0px) scale(1)";
    void firstBox.offsetWidth;

    window.requestAnimationFrame(function () {
      firstBox.style.transition =
        "transform " + durationMs + "ms " + swapCurve + ", box-shadow 0.2s ease";
      secondBox.style.transition =
        "transform " + durationMs + "ms " + swapCurve + ", box-shadow 0.2s ease";
      firstBox.style.transform =
        "translate(" + deltaX + "px, " + deltaY + "px) scale(1.08)";
      secondBox.style.transform =
        "translate(" + (-deltaX) + "px, " + (-deltaY) + "px) scale(1.08)";
    });

    shuffleTimerId = window.setTimeout(function () {
      state.layout = window.TeddyCore.swapBoxPositions(
        state.layout,
        firstSlot,
        secondSlot
      );

      firstBox.style.transition = "";
      secondBox.style.transition = "";
      firstBox.style.transform = "";
      secondBox.style.transform = "";
      firstBox.classList.remove("swap-active", "swap-moving");
      secondBox.classList.remove("swap-active", "swap-moving");
      hideSwapHint();
      state.isAnimatingSwap = false;
      renderBoard();
      done();
    }, durationMs + 40);
  }

  function runShuffle(stepIndex) {
    var level = getActiveLevel();
    var swapPair;

    if (stepIndex >= level.swapCount) {
      state.phase = "guess";
      state.busy = false;
      boardElement.classList.remove("is-shuffling");
      renderBoard();
      setStatus("Gio hay cham hop co gau bong nhe.");
      return;
    }

    swapPair = window.TeddyCore.pickSwapIndices(level.boxCount);

    animateSwap(swapPair[0], swapPair[1], function () {
      shuffleTimerId = window.setTimeout(function () {
        runShuffle(stepIndex + 1);
      }, getPauseAfterSwapMs());
    });
  }

  function handleBoxClick(event) {
    var button = event.target.closest(".teddy-box");
    var slotIndex;
    var guessedBoxId;
    var result;

    if (!button || state.phase !== "guess" || state.busy || state.isAnimatingSwap) {
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
