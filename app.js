const INITIAL_BALANCE = 1000;
let balance = INITIAL_BALANCE;
const history = [];

const seed = crypto.randomUUID();
let nonce = 0;

const balanceEl = document.getElementById("balance");
const seedEl = document.getElementById("seed");
const resultEl = document.getElementById("result");
const historyEl = document.getElementById("history");
const resetBtn = document.getElementById("reset");
const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".game-panel");
const slotsView = document.getElementById("slots-view");

const rouletteForm = document.getElementById("roulette-form");
const rouletteAmountEl = document.getElementById("roulette-amount");
const rouletteColorEl = document.getElementById("roulette-color");

const slotsForm = document.getElementById("slots-form");
const slotsAmountEl = document.getElementById("slots-amount");

const coinForm = document.getElementById("coin-form");
const coinAmountEl = document.getElementById("coin-amount");
const coinSideEl = document.getElementById("coin-side");

seedEl.textContent = seed;
render();

function rand01FromSeed() {
  const input = `${seed}:${nonce++}`;
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return hash / 2 ** 32;
}

function debit(amount) {
  if (!Number.isFinite(amount) || amount <= 0) return "Valor inválido.";
  if (amount > balance) return "Saldo insuficiente.";
  balance -= amount;
  return null;
}

function credit(multiplier, amount) {
  return amount * multiplier;
}

function pushResult(game, text) {
  const msg = `[${game}] ${text}`;
  history.push(msg);
  resultEl.textContent = msg;
  render();
}

function render() {
  balanceEl.textContent = balance.toString();
  historyEl.innerHTML = "";
  for (const item of [...history].reverse()) {
    const li = document.createElement("li");
    li.textContent = item;
    historyEl.appendChild(li);
  }
}

function spinRoulette() {
  const r = rand01FromSeed();
  if (r < 1 / 37) return "green";
  return r < 0.5 ? "red" : "black";
}

rouletteForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const amount = Number(rouletteAmountEl.value);
  const choice = rouletteColorEl.value;

  const error = debit(amount);
  if (error) {
    resultEl.textContent = error;
    return;
  }

  const result = spinRoulette();
  let delta = -amount;

  if (result === choice) {
    const multiplier = choice === "green" ? 14 : 2;
    const win = credit(multiplier, amount);
    balance += win;
    delta = win - amount;
  }

  pushResult("Roleta", `apostou ${amount} em ${choice}, saiu ${result}, variação ${delta >= 0 ? "+" : ""}${delta}.`);
});

const slotSymbols = ["🍒", "🍋", "⭐", "🔔", "7️⃣"];
function rollSlot() {
  return slotSymbols[Math.floor(rand01FromSeed() * slotSymbols.length)];
}

slotsForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const amount = Number(slotsAmountEl.value);
  const error = debit(amount);
  if (error) {
    resultEl.textContent = error;
    return;
  }

  const a = rollSlot();
  const b = rollSlot();
  const c = rollSlot();
  slotsView.textContent = `${a} | ${b} | ${c}`;

  let multiplier = 0;
  if (a === b && b === c) multiplier = 8;
  else if (a === b || b === c || a === c) multiplier = 2;

  let delta = -amount;
  if (multiplier > 0) {
    const win = credit(multiplier, amount);
    balance += win;
    delta = win - amount;
  }

  pushResult("Slots", `${a}|${b}|${c}, multiplicador ${multiplier}x, variação ${delta >= 0 ? "+" : ""}${delta}.`);
});

coinForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const amount = Number(coinAmountEl.value);
  const choice = coinSideEl.value;

  const error = debit(amount);
  if (error) {
    resultEl.textContent = error;
    return;
  }

  const result = rand01FromSeed() < 0.5 ? "heads" : "tails";
  let delta = -amount;
  if (result === choice) {
    const win = credit(2, amount);
    balance += win;
    delta = win - amount;
  }

  pushResult("Moeda", `apostou ${amount} em ${choice}, saiu ${result}, variação ${delta >= 0 ? "+" : ""}${delta}.`);
});

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const target = tab.dataset.game;
    tabs.forEach((t) => t.classList.remove("active"));
    panels.forEach((p) => p.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById(`game-${target}`).classList.add("active");
  });
});

resetBtn.addEventListener("click", () => {
  balance = INITIAL_BALANCE;
  history.length = 0;
  resultEl.textContent = "Saldo e histórico resetados.";
  slotsView.textContent = "🍒 | 🍋 | ⭐";
  render();
});
