(function () {
  var boardElement = document.querySelector("#sequence-board");
  var statusElement = document.querySelector("#sequence-status-box");
  var startButton = document.querySelector("#sequence-start-button");
  var replayButton = document.querySelector("#sequence-replay-button");
  var restartButton = document.querySelector("#sequence-restart-button");
  var lengthElement = document.querySelector("#sequence-length");
  var padDefinitions = [
    { id: "hong", label: "Hong", className: "pad-pink" },
    { id: "tim", label: "Tim", className: "pad-purple" },
    { id: "vang", label: "Vang", className: "pad-yellow" },
    { id: "xanh", label: "Xanh", className: "pad-blue" },
  ];
  var activeTimers = [];
  var state = {
    sequence: [],
    guesses: [],
    activePadId: "",
    roundLength: 3,
    phase: "idle",
  };

  function setStatus(message) {
    statusElement.textContent = message;
  }

  function clearTimers() {
    activeTimers.forEach(function (timerId) {
      window.clearTimeout(timerId);
    });
    activeTimers = [];
  }

  function renderBoard() {
    lengthElement.textContent = String(state.roundLength);
    boardElement.innerHTML = padDefinitions
      .map(function (pad) {
        var isActive = state.activePadId === pad.id;
        var disabled = state.phase === "preview";

        return (
          '<button class="sequence-pad ' +
          pad.className +
          (isActive ? " active" : "") +
          '" type="button" data-pad-id="' +
          pad.id +
          '"' +
          (disabled ? " disabled" : "") +
          '>' +
          '<span class="sequence-pad-label">' +
          pad.label +
          "</span>" +
          "</button>"
        );
      })
      .join("");
  }

  function playCurrentSequence() {
    clearTimers();
    state.phase = "preview";
    state.guesses = [];
    state.activePadId = "";
    renderBoard();
    setStatus("Nhin ky nhe. Cac mau dang sang theo thu tu.");

    state.sequence.forEach(function (padId, index) {
      activeTimers.push(
        window.setTimeout(function () {
          state.activePadId = padId;
          renderBoard();
        }, index * 850)
      );

      activeTimers.push(
        window.setTimeout(function () {
          state.activePadId = "";
          renderBoard();
        }, index * 850 + 450)
      );
    });

    activeTimers.push(
      window.setTimeout(function () {
        state.phase = "guess";
        renderBoard();
        setStatus("Den luot con roi. Hay cham lai dung thu tu vua thay.");
      }, state.sequence.length * 850 + 100)
    );
  }

  function startRound(resetLength) {
    if (resetLength) {
      state.roundLength = 3;
    }

    state.sequence = window.SequenceCore.createSequence(
      state.roundLength,
      padDefinitions.map(function (pad) {
        return pad.id;
      })
    );
    playCurrentSequence();
  }

  function moveToNextRound() {
    if (state.roundLength >= 5) {
      state.phase = "won";
      setStatus(
        "Gioi qua. Con da nho dung den muc 5 buoc roi. Bam Bat dau lai de choi tiep."
      );
      renderBoard();
      return;
    }

    state.roundLength += 1;
    setStatus("Dung roi. Sap sang chuoi moi dai hon mot chut.");
    activeTimers.push(
      window.setTimeout(function () {
        startRound(false);
      }, 900)
    );
  }

  function handlePadClick(event) {
    var pad = event.target.closest(".sequence-pad");
    var result;

    if (!pad || state.phase !== "guess") {
      return;
    }

    state.guesses.push(pad.dataset.padId);
    result = window.SequenceCore.evaluateSequenceGuess(
      state.sequence,
      state.guesses
    );

    if (result.status === "wrong") {
      state.phase = "idle";
      setStatus("Oops, chua dung thu tu roi. Bam Xem lai hoac Bat dau lai nhe.");
      renderBoard();
      return;
    }

    if (result.status === "complete") {
      state.phase = "success";
      setStatus("Hay qua. Con lap lai dung ca chuoi.");
      renderBoard();
      moveToNextRound();
      return;
    }

    setStatus(
      "Tot lam. Con da cham dung " +
        result.matchedCount +
        " buoc roi, tiep tuc nhe."
    );
  }

  startButton.addEventListener("click", function () {
    startRound(false);
  });

  replayButton.addEventListener("click", function () {
    if (!state.sequence.length) {
      setStatus("Con chua co chuoi nao de xem lai. Bam Bat dau truoc nhe.");
      return;
    }

    playCurrentSequence();
  });

  restartButton.addEventListener("click", function () {
    startRound(true);
  });

  boardElement.addEventListener("click", handlePadClick);
  renderBoard();
})();
