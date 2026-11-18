const sampleTransactions = [
  { id: 1, note: "Salary", category: "Income", type: "income", amountCents: 30000 },
  { id: 2, note: "Lunch", category: "Food", type: "expense", amountCents: 450 },
  { id: 3, note: "Bus", category: "Transport", type: "expense", amountCents: 150 },
  { id: 4, note: "Notebook", category: "Study", type: "expense", amountCents: 300 },
];

let transactions = [];

function formatMoney(cents) {
  const sign = cents < 0 ? "-" : "";
  return sign + "$" + (Math.abs(cents) / 100).toFixed(2);
}

function totalCents(list) {
  return list.reduce((sum, tx) => sum + tx.amountCents, 0);
}

function filterByCategory(list, category) {
  return list.filter((tx) => tx.category === category);
}

function filterByType(list, type) {
  return list.filter((tx) => tx.type === type);
}

function summarize(list) {
  const incomeCents = totalCents(filterByType(list, "income"));
  const expensesCents = totalCents(filterByType(list, "expense"));
  return {
    incomeCents: incomeCents,
    expensesCents: expensesCents,
    balanceCents: incomeCents - expensesCents,
  };
}

function addTransaction(list, tx) {
  return [...list, tx];
}

// ----- Page -----
const listEl = document.querySelector("#transaction-list");
const balanceEl = document.querySelector("#balance-amount");
const incomeEl = document.querySelector("#income-amount");
const expenseEl = document.querySelector("#expense-amount");
const formEl = document.querySelector("#expense-form");
const messageEl = document.querySelector("#form-message");

function renderTransactions(list) {
  listEl.replaceChildren();
  for (const tx of list) {
    const li = document.createElement("li");
    li.className =
      "mb-2 flex flex-col gap-1 border-2 border-black bg-white px-4 py-3 sm:flex-row sm:justify-between sm:gap-3";

    const note = document.createElement("span");
    note.className = "flex-1 font-semibold";
    note.textContent = tx.note;

    const category = document.createElement("span");
    category.className = "text-neutral-600";
    category.textContent = tx.category;

    const amount = document.createElement("span");
    amount.className = "font-bold " + (tx.type === "income" ? "text-green-700" : "text-red-600");
    const sign = tx.type === "income" ? "+" : "-";
    amount.textContent = sign + formatMoney(tx.amountCents);

    li.append(note, category, amount);
    listEl.append(li);
  }
}

function renderSummary(list) {
  const summary = summarize(list);
  balanceEl.textContent = formatMoney(summary.balanceCents);
  incomeEl.textContent = formatMoney(summary.incomeCents);
  expenseEl.textContent = formatMoney(summary.expensesCents);
}

function render() {
  renderTransactions(transactions);
  renderSummary(transactions);
}

formEl.addEventListener("submit", (event) => {
  event.preventDefault();

  const note = document.querySelector("#note").value.trim();
  const amountText = document.querySelector("#amount").value;
  const category = document.querySelector("#category").value;
  const amountCents = Math.round(Number(amountText) * 100);

  if (note === "") {
    messageEl.textContent = "Please write a note.";
    return;
  }
  if (Number.isNaN(amountCents) || amountCents <= 0) {
    messageEl.textContent = "Amount must be more than 0.";
    return;
  }

  messageEl.textContent = "";
  const tx = {
    id: Date.now(),
    note: note,
    category: category,
    type: "expense",
    amountCents: amountCents,
  };
  transactions = addTransaction(transactions, tx);
  render();
  formEl.reset();
});

async function loadTransactions() {
  const res = await fetch("transactions.json");
  if (!res.ok) {
    throw new Error("Could not load transactions (status " + res.status + ")");
  }
  return await res.json();
}

async function start() {
  try {
    transactions = await loadTransactions();
  } catch (error) {
    messageEl.textContent = error.message;
  }
  render();
}

start();

// ----- Checks (use sampleTransactions) -----
function check(name, actual, expected) {
  const ok = actual === expected;
  console.log(ok ? "✓" : "✗", name, ok ? "" : `(expected ${expected}, got ${actual})`);
}

check("total of all", totalCents(sampleTransactions), 30900);
check("balance", summarize(sampleTransactions).balanceCents, 29100);
