// script.js

// Get DOM elements
const balanceEl = document.getElementById('balance');
const transactionForm = document.getElementById('transactionForm');
const transactionName = document.getElementById('transactionName');
const transactionAmount = document.getElementById('transactionAmount');
const transactionType = document.getElementById('transactionType');
const transactionList = document.getElementById('transactionList');

// Load transactions from localStorage or initialize as empty
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// Initialize app
function init() {
    transactionList.innerHTML = '';
    transactions.forEach(addTransactionDOM);
    updateBalance();
}

// Add transaction
transactionForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = transactionName.value.trim();
    const amount = parseFloat(transactionAmount.value);
    const type = transactionType.value;

    if (name === '' || isNaN(amount)) {
        alert('Please enter valid transaction details.');
        return;
    }

    const transaction = {
        id: Date.now(),
        name,
        amount: type === 'expense' ? -Math.abs(amount) : Math.abs(amount)
    };

    transactions.push(transaction);
    saveToLocalStorage();
    addTransactionDOM(transaction);
    updateBalance();

    transactionName.value = '';
    transactionAmount.value = '';
});

// Add transaction to DOM
function addTransactionDOM(transaction) {
    const li = document.createElement('li');
    li.classList.add(transaction.amount < 0 ? 'expense-item' : 'income-item');
    li.innerHTML = `
        ${transaction.name} <span>${transaction.amount < 0 ? '-' : '+'}$${Math.abs(transaction.amount).toFixed(2)}</span>
        <button class="delete-btn" onclick="deleteTransaction(${transaction.id})">x</button>
    `;
    transactionList.appendChild(li);
}

// Update balance
function updateBalance() {
    const total = transactions.reduce((sum, t) => sum + t.amount, 0);
    balanceEl.textContent = total.toFixed(2);
}

// Delete a transaction
function deleteTransaction(id) {
    transactions = transactions.filter(t => t.id !== id);
    saveToLocalStorage();
    init();
}

// Save transactions to localStorage
function saveToLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Initialize app on page load
init();
