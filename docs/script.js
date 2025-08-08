/* --------------------------------------------------
   1. Marble bag & multipliers
-------------------------------------------------- */
// array of marbles: 3 red, 5 green, 1 black, 1 white
const BAG = [
  ...Array(3).fill("red"),
  ...Array(5).fill("green"),
  "black",
  "white",
];
// how much you win/lose per color
const MULTIPLIERS = {
  green: 2,  // double your bet
  red: -1,   // lose your bet
  black: 10, // huge win
  white: -5, // big loss
};

/* --------------------------------------------------
   2. DOM helpers (grab elements once)
-------------------------------------------------- */
const $ = (id) => document.getElementById(id);
const setupSection   = $("setup");       // where you set gold/draws
const bettingSection = $("betting");     // betting interface
const startBtn       = $("startBtn");    // “Start Game” button
const betBtn         = $("betBtn");      // “Place Bet” button
const exitBtn        = $("exitBtn");     // “Exit Game” button
const statusEl       = $("status");      // status text
const logEl          = $("log");         // log output area
const betInput       = $("bet");         // bet input field
const flashEl        = $("flashMessage"); // overlay div
const flashText      = $("flashText");   // overlay text
const playAgainBtn   = $("playAgainBtn");// button to restart
const startGoldInput = $("startGold");   // input for starting gold
const drawsInput     = $("draws");       // input for number of draws

/* --------------------------------------------------
   3. Game state variables
-------------------------------------------------- */
let goldStart, goldRemaining, drawsTotal, drawIndex = 0;
// remember original background for flash effect
const baseBG = getComputedStyle(document.body).background;

/* --------------------------------------------------
   4. Utility: pick random marble
-------------------------------------------------- */
const randomMarble = () =>
  BAG[Math.floor(Math.random() * BAG.length)];

/* --------------------------------------------------
   5. Logging helper
-------------------------------------------------- */
const log = (msg, cls) => {
  // append a <p> with message + CSS class, then scroll to bottom
  logEl.innerHTML += `<p class="${cls}">${msg}</p>`;
  logEl.scrollTop = logEl.scrollHeight;
};

/* --------------------------------------------------
   6. Flash background color
-------------------------------------------------- */
function flashBG(color) {
  const body = document.body;
  body.style.transition = "background 0.25s";
  body.style.background = color;          // flash color
  setTimeout(() => {
    body.style.background = baseBG;       // back to normal
  }, 800);
}

/* --------------------------------------------------
   7. Show overlay for end/game over
-------------------------------------------------- */
function showFlashMessage(text, color) {
  flashText.textContent = text;           // set “GAME OVER” etc
  flashText.style.color = color;          // color of text
  flashEl.classList.remove("hidden");     // reveal overlay
  flashEl.classList.add("show");
  // focus the Play Again button so Enter works
  setTimeout(() => {
    playAgainBtn.focus();
  }, 200);
}
// hide overlay and reset focus when clicked
playAgainBtn.onclick = () => {
  flashEl.classList.add("hidden");
  flashEl.classList.remove("show");
  startGoldInput.focus();
};

/* --------------------------------------------------
   8. Particle effects: confetti
-------------------------------------------------- */
const CONFETTI_COLS = [
  "#ff4757","#fffa65","#1e90ff","#2ed573",
  "#ffa502","#ff6b81","#70a1ff","#7bed9f"
];
function spawnConfetti(count) {
  for (let i = 0; i < count; i++) {
    const el = document.createElement("div");
    el.className = "confetti";
    const size = 6 + Math.random() * 10;
    el.style.width = el.style.height = size + "px";
    el.style.background =
      CONFETTI_COLS[Math.floor(Math.random() * CONFETTI_COLS.length)];
    el.style.left = "50vw";  // start center
    el.style.top  = "50vh";
    // random end position
    const dx = (Math.random()*100 - 50) + "vw";
    const dy = (Math.random()*100 - 50) + "vh";
    el.style.setProperty('--dx', dx);
    el.style.setProperty('--dy', dy);
    if (Math.random() > 0.5) el.style.borderRadius = "50%";
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1800); // clean up
  }
}

/* --------------------------------------------------
   9. Game flow: startGame()
-------------------------------------------------- */
function startGame() {
  goldStart  = Number(startGoldInput.value); // read inputs
  drawsTotal = Number(drawsInput.value);
  // basic validation: ensure positive numbers were entered
  if (
    !Number.isFinite(goldStart) ||
    !Number.isFinite(drawsTotal) ||
    goldStart <= 0 ||
    drawsTotal <= 0
  ) {
    return alert("Enter valid numbers!");
  }

  goldRemaining = goldStart;
  drawIndex = 1;
  logEl.innerHTML = "";                     // clear old log
  statusEl.textContent = `You start with ${goldRemaining} gold.`;

  // hide setup, show betting UI
  setupSection.classList.add("hidden");
  bettingSection.classList.remove("hidden");
  betInput.focus();                         // jump to bet field
}
// wire up the Start button
startBtn.onclick = startGame;
// allow Enter key in inputs to also start
[startGoldInput, drawsInput].forEach(inp => {
  inp.addEventListener("keydown", e => {
    if (e.key === "Enter") startGame();
  });
});

/* --------------------------------------------------
   10. Betting round: playRound()
-------------------------------------------------- */
function playRound() {
  const bet = Number(betInput.value);       // how much user bets
  // validation
  if (!bet || bet > goldRemaining || bet <= 0) {
    return alert("Invalid bet amount.");
  }

  const drawn  = randomMarble();            // pick a marble
  const result = bet * MULTIPLIERS[drawn];  // calc win/loss
  goldRemaining += result;

  // pick CSS class & flash color based on marble
  let cssClass, bgColor;
  switch (drawn) {
    case "green":
      cssClass = "win-green"; bgColor = "#1b5e20"; spawnConfetti(40);
      break;
    case "black":
      cssClass = "win-black"; bgColor = "#0d2919"; spawnConfetti(90);
      break;
    case "red":
      cssClass = "lose-red"; bgColor = "#7a1f1f";
      break;
    case "white":
      cssClass = "lose-white"; bgColor = "#3b1515";
      break;
  }
  flashBG(bgColor); // flash screen

  // message for log
  const outcome = result > 0
    ? `won <strong>${result}</strong>`
    : `lost <strong>${-result}</strong>`;
  log(
    `Draw ${drawIndex}/${drawsTotal}: Marble is <em>${drawn}</em>. You ${outcome}. Gold left: ${goldRemaining}.`,
    cssClass
  );
  drawIndex++;

  // end-game conditions
  if (goldRemaining <= goldStart/2) {
    statusEl.textContent = "💀 Less than half your gold remains. You lose!";
    showFlashMessage("GAME OVER", "#ff3b3b");
    endGame();
  } else if (drawIndex > drawsTotal) {
    const diff = goldRemaining - goldStart;
    statusEl.textContent = diff > 0
      ? `🎉 You finished up ${diff} gold!`
      : diff < 0
        ? `😬 You finished down ${-diff} gold`
        : `😶 You broke even.`;
    showFlashMessage("FINISH!", "#ffd700");
    endGame();
  }

  betInput.value = "";  // clear input for next round
  betInput.focus();      // keep focus there
}
betBtn.onclick = playRound;   // wire button
betInput.addEventListener("keydown", e => {
  if (e.key === "Enter") playRound(); // allow Enter key
});

/* --------------------------------------------------
   11. Exit or reset
-------------------------------------------------- */
function endGame() {
  bettingSection.classList.add("hidden");
  setupSection.classList.remove("hidden");
}
exitBtn.onclick = endGame;     // wire exit button
