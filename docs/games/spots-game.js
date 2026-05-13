(function () {
  var boardElement = document.querySelector("#spots-board");
  var statusElement = document.querySelector("#spots-status-box");
  var countElement = document.querySelector("#spots-count");
  var startButton = document.querySelector("#spots-start-button");
  var restartButton = document.querySelector("#spots-restart-button");
  var revealTimerId = null;
  var nextRoundTimerId = null;
  var state = {
    targets: [],
    guesses: [],
    roundSize: 3,
    phase: "idle",
  };

  function setStatus(message) {
    statusElement.textContent = message;
  }

  function clearTimers() {
    if (revealTimerId) {
      window.clearTimeout(revealTimerId);
      revealTimerId = null;
    }

    if (nextRoundTimerId) {
      window.clearTimeout(nextRoundTimerId);
      nextRoundTimerId = null;
    }
  }

  function renderBoard() {
    countElement.textContent = String(state.roundSize);
    boardElement.innerHTML = Array(9)
      .fill(0)
      .map(function (_, index) {
        var isTarget = state.targets.includes(index);
        var isPicked = state.guesses.includes(index);
        var isPreview = state.phase === "preview" && isTarget;
        var isReveal = state.phase === "wrong" && isTarget;
        var isDisabled = state.phase === "preview" || state.phase === "idle";

        return (
          '<button class="spot-cell' +
          (isPreview ? " preview" : "") +
          (isReveal ? " reveal" : "") +
          (isPicked ? " selected" : "") +
          '" type="button" data-spot-index="' +
          index +
          '"' +
          (isDisabled ? " disabled" : "") +
          ">" +
          '<span class="spot-dot"></span>' +
          "</button>"
        );
      })
      .join("");
  }

  function startRound(resetLength) {
    clearTimers();

    if (resetLength) {
      state.roundSize = 3;
    }

    state.targets = window.SpotsCore.pickUniquePositions(9, state.roundSize);
    state.guesses = [];
    state.phase = "preview";
    renderBoard();
    setStatus("Nhin ky nhe. Cac o can nho dang sang len.");

    revealTimerId = window.setTimeout(function () {
      state.phase = "guess";
      renderBoard();
      setStatus("Gio hay cham lai dung cac vi tri con vua thay.");
    }, 1600);
  }

  function moveToNextRound() {
    if (state.roundSize >= 5) {
      state.phase = "won";
      setStatus(
        "Qua gioi. Con da nho dung den 5 o roi. Bam Bat dau lai de choi tiep."
      );
      renderBoard();
      return;
    }

    state.roundSize += 1;
    setStatus("Dung roi. Sap den luot moi kho hon mot chut.");
    nextRoundTimerId = window.setTimeout(function () {
      startRound(false);
    }, 900);
  }

  function handleSpotClick(event) {
    var button = event.target.closest(".spot-cell");
    var spotIndex;
    var result;

    if (!button || state.phase !== "guess") {
      return;
    }

    spotIndex = parseInt(button.dataset.spotIndex, 10);

    if (state.guesses.includes(spotIndex)) {
      return;
    }

    state.guesses.push(spotIndex);
    result = window.SpotsCore.evaluateSpotGuess(state.targets, state.guesses);

    if (result.status === "wrong") {
      state.phase = "wrong";
      renderBoard();
      setStatus("Chua dung vi tri roi. Nhin lai dap an va thu lai nhe.");
      nextRoundTimerId = window.setTimeout(function () {
        state.phase = "idle";
        state.guesses = [];
        renderBoard();
        setStatus("Bam Bat dau de choi mot luot moi.");
      }, 1100);
      return;
    }

    renderBoard();

    if (result.status === "complete") {
      state.phase = "success";
      setStatus("Dung het roi. Con nho vi tri rat gioi.");
      moveToNextRound();
      return;
    }

    setStatus(
      "Tot lam. Con da cham dung " +
        result.matchedCount +
        " o roi, tiep tuc nhe."
    );
  }

  startButton.addEventListener("click", function () {
    startRound(false);
  });

  restartButton.addEventListener("click", function () {
    startRound(true);
  });

  boardElement.addEventListener("click", handleSpotClick);
  renderBoard();
})();
