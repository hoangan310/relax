(function () {
  var boardElement = document.querySelector("#order-memory-board");
  var statusElement = document.querySelector("#order-memory-status");
  var expectedElement = document.querySelector("#order-memory-expected");
  var durationInput = document.querySelector("#order-memory-duration");
  var startButton = document.querySelector("#order-memory-start");
  var restartButton = document.querySelector("#order-memory-restart");
  var previewTimerId = null;
  var state = {
    numbers: [],
    tileStates: [],
    correctCount: 0,
    phase: "idle",
  };

  function setStatus(message) {
    statusElement.textContent = message;
  }

  function updateExpectedLabel() {
    if (state.phase === "playing") {
      expectedElement.textContent = String(
        window.OrderMemoryCore.getExpectedNumber(state.correctCount)
      );
      return;
    }

    if (state.phase === "won") {
      expectedElement.textContent = "9";
      return;
    }

    expectedElement.textContent = "1";
  }

  function getPreviewSeconds() {
    var seconds = parseInt(durationInput.value, 10);

    if (!Number.isFinite(seconds) || seconds < 1) {
      durationInput.value = "3";
      return 3;
    }

    return seconds;
  }

  function clearPreviewTimer() {
    if (previewTimerId) {
      window.clearTimeout(previewTimerId);
      previewTimerId = null;
    }
  }

  function createEmptyTileStates() {
    return Array(window.OrderMemoryCore.BOARD_SIZE).fill("idle");
  }

  function renderBoard() {
    var isPreview = state.phase === "preview";
    var isPlaying = state.phase === "playing";
    var isFinished = state.phase === "won" || state.phase === "lost";

    boardElement.innerHTML = state.numbers
      .map(function (number, index) {
        var tileState = state.tileStates[index];
        var classes = ["tile"];
        var isDisabled = !isPlaying || tileState === "correct" || isFinished;

        if (isPreview) {
          classes.push("preview");
        } else if (tileState === "correct") {
          classes.push("correct");
        } else if (tileState === "wrong") {
          classes.push("wrong");
        } else if (isPlaying || state.phase === "idle") {
          classes.push("hidden");
        }

        return (
          '<button class="' +
          classes.join(" ") +
          '" type="button" data-index="' +
          index +
          '"' +
          (isDisabled ? " disabled" : "") +
          ' aria-label="O so ' +
          (index + 1) +
          '">' +
          (isPreview || tileState === "correct" || tileState === "wrong"
            ? number
            : "") +
          "</button>"
        );
      })
      .join("");
  }

  function resetRound() {
    clearPreviewTimer();
    state.numbers = [];
    state.tileStates = createEmptyTileStates();
    state.correctCount = 0;
    state.phase = "idle";
    updateExpectedLabel();
    renderBoard();
    setStatus('Nhap thoi gian, roi bam "Bat dau" de xem 9 so va lat tu 1 den 9.');
  }

  function startRound(sourceLabel) {
    var previewSeconds = getPreviewSeconds();

    clearPreviewTimer();
    state.numbers = window.OrderMemoryCore.generateShuffledNumbers();
    state.tileStates = createEmptyTileStates();
    state.correctCount = 0;
    state.phase = "preview";
    updateExpectedLabel();
    renderBoard();
    setStatus(
      sourceLabel +
        ": Nhin ky vi tri cac so tu 1 den 9. Sau " +
        previewSeconds +
        " giay, bang se bi up xuong."
    );

    previewTimerId = window.setTimeout(function () {
      state.phase = "playing";
      updateExpectedLabel();
      renderBoard();
      setStatus("Gio hay lat so 1 truoc, roi 2, 3... den 9 nhe.");
    }, previewSeconds * 1000);
  }

  function handleTileClick(event) {
    var tile = event.target.closest(".tile");
    var index;
    var clickedNumber;
    var expectedNumber;
    var result;

    if (!tile || state.phase !== "playing") {
      return;
    }

    index = parseInt(tile.dataset.index, 10);

    if (state.tileStates[index] === "correct") {
      return;
    }

    clickedNumber = state.numbers[index];
    expectedNumber = window.OrderMemoryCore.getExpectedNumber(state.correctCount);
    result = window.OrderMemoryCore.evaluateOrderClick(
      expectedNumber,
      clickedNumber
    );

    if (result.status === "wrong") {
      state.tileStates[index] = "wrong";
      state.phase = "lost";
      renderBoard();
      setStatus(
        "Thuong tiec! Con lat nham so " +
          clickedNumber +
          " trong khi can so " +
          expectedNumber +
          ". Bam Bat dau lai de choi tiep."
      );
      return;
    }

    state.tileStates[index] = "correct";
    state.correctCount += 1;

    if (window.OrderMemoryCore.isVictory(state.correctCount)) {
      state.phase = "won";
      updateExpectedLabel();
      renderBoard();
      setStatus("Chuc mung! Ban da chien thang. Con da lat dung ca 9 so theo thu tu.");
      return;
    }

    updateExpectedLabel();
    renderBoard();
    setStatus(
      "Dung roi! Tiep theo hay lat so " +
        window.OrderMemoryCore.getExpectedNumber(state.correctCount) +
        " nhe."
    );
  }

  startButton.addEventListener("click", function () {
    startRound("Bat dau");
  });

  restartButton.addEventListener("click", function () {
    startRound("Bat dau lai");
  });

  boardElement.addEventListener("click", handleTileClick);
  resetRound();
})();
