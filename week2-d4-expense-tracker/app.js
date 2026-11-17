var transactions = (typeof window !== "undefined" && window.transactions) || [
  { id: 1, note: "Salary", category: "Income", type: "income", amountCents: 30000 },
  { id: 2, note: "Lunch", category: "Food", type: "expense", amountCents: 450 },
  { id: 3, note: "Bus", category: "Transport", type: "expense", amountCents: 150 },
  { id: 4, note: "Notebook", category: "Study", type: "expense", amountCents: 300 },
];
if (typeof window !== "undefined") {
  window.transactions = transactions;
}

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

// Practice 2 — the AI's totalExpenses, reviewed and fixed:
// whole cents, no off-by-one loop, no duplicated work.
function totalExpenses(list) {
  return totalCents(filterByType(list, "expense"));
}

var notes = transactions.map((tx) => tx.note);

console.log(formatMoney(transactions[1].amountCents));

// ----- Checks -----
function check(name, actual, expected) {
  const ok = actual === expected;
  console.log(ok ? "✓" : "✗", name, ok ? "" : `(expected ${expected}, got ${actual})`);
}

check("format 450", formatMoney(450), "$4.50");
check("total of all", totalCents(transactions), 30900);
check("Food count", filterByCategory(transactions, "Food").length, 1);
check("expense count", filterByType(transactions, "expense").length, 3);
check("balance", summarize(transactions).balanceCents, 29100);
check(
  "new length",
  addTransaction(transactions, { id: 5, note: "Coffee", category: "Food", type: "expense", amountCents: 250 }).length,
  5
);
check("notes", notes.join(","), "Salary,Lunch,Bus,Notebook");
check("total expenses", totalExpenses(transactions), 900);

// Edge cases
check("total of empty list", totalCents([]), 0);
check("total expenses of empty list", totalExpenses([]), 0);
check("original list not changed", transactions.length, 4); // after addTransaction

// Exercise
function render() {
  const summaryBlock = document.querySelector("#summary") || document.querySelector("section");
  if (summaryBlock) {
    const totals = summarize(transactions);

    summaryBlock.innerHTML = `
      <div class="flex-1 border-2 border-black bg-white p-4 shadow-[4px_4px_0_#000]">
        <p class="mb-2 text-neutral-600">Balance</p>
        <p class="text-2xl font-bold">${formatMoney(totals.balanceCents)}</p>
      </div>
      <div class="flex-1 border-2 border-black bg-white p-4 shadow-[4px_4px_0_#000]">
        <p class="mb-2 text-neutral-600">Income</p>
        <p class="text-2xl font-bold text-green-700">${formatMoney(totals.incomeCents)}</p>
      </div>
      <div class="flex-1 border-2 border-black bg-white p-4 shadow-[4px_4px_0_#000]">
        <p class="mb-2 text-neutral-600">Expenses</p>
        <p class="text-2xl font-bold text-red-600">${formatMoney(totals.expensesCents)}</p>
      </div>
    `;
  }

  const list = document.querySelector("#list") || document.querySelector("ul");
  if (list) {
    list.innerHTML = "";

    transactions.forEach((tx) => {
      const isIncome = tx.type === "income";
      const sign = isIncome ? "+" : "-";
      const color = isIncome ? "text-green-700" : "text-red-600";

      const li = document.createElement("li");
      li.className =
        "mb-2 flex flex-col gap-1 border-2 border-black bg-white px-4 py-3 sm:flex-row sm:justify-between sm:gap-3";
      li.innerHTML = `
        <span class="flex-1 font-semibold">${tx.note}</span>
        <span class="text-neutral-600">${tx.category}</span>
        <span class="font-bold ${color}">${sign}${formatMoney(tx.amountCents)}</span>
      `;

      list.appendChild(li);
    });
  }
}

function init() {
  render();
  console.log("transactions:", transactions);

  const form = document.querySelector("form");
  if (form && !form.dataset.ready) {
    form.dataset.ready = "true";
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const note = document.querySelector("#note").value.trim();
      const amount = document.querySelector("#amount").value;
      const category = document.querySelector("#category").value;

      if (!note || !amount) return;

      const newTx = {
        id: Date.now(),
        note: note,
        category: category,
        type: "expense",
        amountCents: Math.round(Number(amount) * 100),
      };

      transactions = addTransaction(transactions, newTx);
      if (typeof window !== "undefined") {
        window.transactions = transactions;
      }

      console.log("transactions:", transactions);

      render();
      form.reset();
    });
  }
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
}

