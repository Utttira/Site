const INITIAL_BALANCE = 1000;
let balance = INITIAL_BALANCE;
const history = [];

const seed = crypto.randomUUID();
let nonce = 0;

const balanceEl = document.getElementById("balance");
const seedEl = document.getElementById("seed");
const resultEl = document.getElementById("result");
const historyEl = document.getElementById("history");
const form = document.getElementById("bet-form");
const amountEl = document.getElementById("amount");
const colorEl = document.getElementById("color");
const resetBtn = document.getElementById("reset");

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

function spinRoulette() {
  const r = rand01FromSeed();
  if (r < 1 / 37) return "green";
  return r < 0.5 ? "red" : "black";
}

function payoutMultiplier(color) {
  if (color === "green") return 14;
  return 2;
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

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const amount = Number(amountEl.value);
  const choice = colorEl.value;

  if (!Number.isFinite(amount) || amount <= 0) {
    resultEl.textContent = "Valor inválido.";
    return;
  }

  if (amount > balance) {
    resultEl.textContent = "Saldo insuficiente.";
    return;
  }

  const result = spinRoulette();
  balance -= amount;

  let delta = -amount;
  if (choice === result) {
    const win = amount * payoutMultiplier(choice);
    balance += win;
    delta = win - amount;
  }

  const text = `Aposta ${amount} em ${choice}, saiu ${result}, variação ${delta >= 0 ? "+" : ""}${delta}.`;
  history.push(text);
  resultEl.textContent = text;

  render();
});

resetBtn.addEventListener("click", () => {
  balance = INITIAL_BALANCE;
  history.length = 0;
  resultEl.textContent = "Saldo e histórico resetados.";
  render();
});
