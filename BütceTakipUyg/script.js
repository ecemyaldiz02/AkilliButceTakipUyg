const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');

// LocalStorage'dan veriyi çek, yoksa boş dizi başlat
const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));

let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

// 1. İşlemi DOM'a (Ekrana) Ekleme Fonksiyonu
function addTransactionDOM(transaction) {
    // Gelir mi gider mi kontrolü (CSS sınıfı için)
    const sign = transaction.amount < 0 ? '-' : '+';
    const item = document.createElement('li');

    // Sınıf ekle (plus veya minus)
    item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

    item.innerHTML = `
        ${transaction.text} <span>${sign}₺${Math.abs(transaction.amount)}</span>
        <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
    `;

    list.appendChild(item);
}

// 2. Bakiyeyi, Geliri ve Gideri Güncelleme (Matematiksel Mantık)
function updateValues() {
    const amounts = transactions.map(transaction => transaction.amount);

    // Toplam Bakiye (Reduce kullanımı)
    const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);

    // Sadece Gelirleri Topla (Filter & Reduce)
    const income = amounts
        .filter(item => item > 0)
        .reduce((acc, item) => (acc += item), 0)
        .toFixed(2);

    // Sadece Giderleri Topla
    const expense = (
        amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1
    ).toFixed(2);

    balance.innerText = `₺${total}`;
    money_plus.innerText = `+₺${income}`;
    money_minus.innerText = `-₺${expense}`;
}

// 3. Yeni İşlem Ekleme
function addTransaction(e) {
    e.preventDefault();

    if (text.value.trim() === '' || amount.value.trim() === '') {
        alert('Lütfen bir açıklama ve miktar girin');
    } else {
        const transaction = {
            id: generateID(),
            text: text.value,
            amount: +amount.value // String'i Number'a çevirir
        };

        transactions.push(transaction);

        addTransactionDOM(transaction);
        updateValues();
        updateLocalStorage();

        text.value = '';
        amount.value = '';
    }
}

// 4. Rastgele ID Oluşturucu (Benzersiz ID lazım)
function generateID() {
    return Math.floor(Math.random() * 100000000);
}

// 5. İşlem Silme
function removeTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);
    updateLocalStorage();
    init(); // Ekranı yenile
}

// 6. LocalStorage Güncelleme
function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Uygulamayı Başlat
function init() {
    list.innerHTML = '';
    transactions.forEach(addTransactionDOM);
    updateValues();
}

init();

form.addEventListener('submit', addTransaction);