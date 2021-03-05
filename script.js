const transactionDiv = document.querySelector(".transactions");
const revenuesDOOM = document.querySelector("#revenues");
const expenditureDOOM = document.querySelector("#expenditure");
const totalDOOM = document.querySelector("#total-value");

const inputTransactioName = document.querySelector("#name");
const inputTransactioValue = document.querySelector("#value");

const form = document.querySelector(".form");
const valueTransactionDOOM = document.querySelector(".value-transaction");
const nameTransactionDOOM = document.querySelector(".name-transaction");

const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));

let transactions = localStorage
  .getItem('transactions') !== null ? localStorageTransactions : []
 
const addTransactionIntDOOM = ({ id, amount, name }) => {
  const operator = amount < 0 ? "-" : "+"
  const CSSClass = amount < 0 ? "minus" : "plus"
  const li = document.createElement("li");
  
  li.classList.add(CSSClass);
  li.innerHTML += `
    ${name} <span>${operator} R$ ${Math.abs(amount.toFixed(2))}</span>
    <button class="delete-btn" onClick="removeTransaction(${id})">X</button>
  `
  
  transactionDiv.appendChild(li)
}

const updateBalancesValue = transactions => {
  const total = transactions
    .reduce((acc, value) => acc + value.amount, 0)
    .toFixed(2)

    const revenues = transactions
    .filter(transaction  => transaction.amount > 0)
    .reduce((acc, value) => acc + value.amount, 0)
    .toFixed(2)

  const expenditure = transactions
    .filter(transaction => transaction.amount < 0)
    .reduce((acc, value) => acc + value.amount, 0)
    .toFixed(2)


  revenuesDOOM.innerHTML = `R$ ${revenues}`;
  expenditureDOOM.innerHTML = `- R$ ${Math.abs(expenditure)}`;
  totalDOOM.innerHTML = `R$ ${total}`;
}

const removeTransaction = id => {
  transactions = transactions.filter(t => t.id !== id);
  updateLocalStorage();
  init();
}

const validateError = () => {
  const inputName = inputTransactioName.value;
  const inputValue = inputTransactioValue.value;

  if (inputName.trim().length <= 0) {
    viewMessageError("Preencha o campo nome", "name");
    return;

  } else {
    nameTransactionDOOM.innerHTML = "";
  }

  if (inputValue.trim().length <=0) {
    viewMessageError("Preencha o campo Números", "number");
    return;
  }

  if (!Number(inputValue)) {
    viewMessageError("Somente Números", "number");
    return;
  } else {
    valueTransactionDOOM.innerHTML = "";
  }

  inputTransactioName.value = '';
  inputTransactioValue.value = '';


  return {
    name: inputName,
    amount: Number(inputValue)
  }

}

const viewMessageError = (messageError, type) => {
  const span = document.createElement("span");
  span.classList.add("error");

  valueTransactionDOOM.innerHTML = "";
  nameTransactionDOOM.innerHTML = "";

  if (type == "name") {
    span.innerHTML = messageError;
    nameTransactionDOOM.appendChild(span);
  }

  if (type == "number") {
    span.innerHTML = messageError;
    valueTransactionDOOM.appendChild(span);
  } 

}

const init = () => {
  transactionDiv.innerHTML = '';

  transactions.map(transaction => {
    addTransactionIntDOOM(transaction);
  })
  updateBalancesValue(transactions);
}

const updateLocalStorage = () => {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const validate = validateError();
  if (typeof validate === "undefined") {
    return;
  }

  const { name, amount } = validate;

  const id =  transactions.length + 1;

  const data = {
    id,  
    name,
    amount,
  }

  transactions.push(data);
  init();
  updateLocalStorage();
});


init();
