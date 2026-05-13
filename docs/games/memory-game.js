(function () {
  var boardElement = document.querySelector("#memory-board");
  var statusElement = document.querySelector("#status-box");
  var durationInput = document.querySelector("#preview-duration");
  var startButton = document.querySelector("#start-button");
  var restartButton = document.querySelector("#restart-button");
  var previewTimerId = null;
  var state = {
    numbers: Array(9).fill(""),
    visibility: Array(9).fill(false),
    phase: "idle",
  };

  function setStatus(message) {
    statusElement.textContent = message;
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

  function renderBoard() {
    boardElement.innerHTML = state.numbers
      .map(function (number, index) {
        var isVisible = state.visibility[index];
        var isDisabled = state.phase === "idle" || state.phase === "preview" || !number;
        var tileLabel = number || "";

        return (
          '<button class="tile' +
          (isVisible ? "" : " hidden") +
          '" type="button" data-index="' +
          index +
          '"' +
          (isDisabled ? " disabled" : "") +
          ' aria-label="O so ' +
          (index + 1) +
          '">' +
          tileLabel +
          "</button>"
        );
      })
      .join("");
  }

  function startRound(sourceLabel) {
    var previewSeconds = getPreviewSeconds();

    clearPreviewTimer();
    state.numbers = window.MemoryCore.generateShuffledNumbers();
    state.visibility = window.MemoryCore.createInitialVisibility(9);
    state.phase = "preview";
    renderBoard();
    setStatus(
      sourceLabel +
        ": 9 so dang hien thi. Sau " +
        previewSeconds +
        " giay, bang se duoc up lai."
    );

    previewTimerId = window.setTimeout(function () {
      state.visibility = window.MemoryCore.hideAllTiles(state.visibility);
      state.phase = "hidden";
      renderBoard();
      setStatus("Bang da bi up xuong. Gio hay click vao tung o de lat so.");
    }, previewSeconds * 1000);
  }

  function handleTileClick(event) {
    var tile = event.target.closest(".tile");
    var index;

    if (!tile || state.phase !== "hidden") {
      return;
    }

    index = parseInt(tile.dataset.index, 10);

    if (state.visibility[index]) {
      return;
    }

    state.visibility = window.MemoryCore.revealTile(state.visibility, index);
    renderBoard();

    if (state.visibility.every(Boolean)) {
      state.phase = "complete";
      setStatus("Con da lat het ca 9 o roi. Bam \"Bat dau lai\" de choi tiep nhe.");
      return;
    }

    setStatus("Tot lam. Con vua lat them 1 o. Thu nho tiep vi tri cac so khac nhe.");
  }

  startButton.addEventListener("click", function () {
    startRound("Bat dau");
  });

  restartButton.addEventListener("click", function () {
    startRound("Bat dau lai");
  });

  boardElement.addEventListener("click", handleTileClick);
  renderBoard();
})();
