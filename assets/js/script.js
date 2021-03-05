const transactionDiv = document.querySelector(".transactions");
const revenuesDOOM = document.querySelector("#revenues");
const expenditureDOOM = document.querySelector("#expenditure");
const totalDOOM = document.querySelector("#total-value");

const inputTransactionName = document.querySelector("#name");
const inputTransactionValue = document.querySelector("#value");

const inputTransactionUpdateName = document.querySelector("#input-name-update");
const inputTransactionUpdateValue = document.querySelector("#input-value-update");

const form = document.querySelector(".form");
const formUpdate = document.querySelector(".form-update");

const valueTransactionDOOM = document.querySelector(".value-transaction");
const nameTransactionDOOM = document.querySelector(".name-transaction");
const valueUpdateTransactionDOOM = document.querySelector(".value-update-transaction");
const nameUpdateTransactionDOOM = document.querySelector(".name-update-transaction");

const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));
let transactions = localStorage
.getItem('transactions') !== null ? localStorageTransactions : [];

const modalDOOM = document.querySelector(".modal");

const modal = {
  open (idTransaction) {
    modalDOOM.classList.add("active");
    const transaction = transactions.filter(t => t.id === idTransaction);
    const { id, name, amount } = transaction[0];
    formUpdate.setAttribute("id", id);
  

    inputTransactionUpdateName.value = name;
    inputTransactionUpdateValue.value = amount;
    
  },

  close () {
    modalDOOM.classList.remove("active");
  }
}


const addTransactionIntDOOM = ({ id, amount, name }) => {
  const operator = amount < 0 ? "-" : "+"
  const CSSClass = amount < 0 ? "minus" : "plus"
  const li = document.createElement("li");
  
  li.classList.add(CSSClass);
  li.innerHTML += `
  ${name} <span>${operator} R$ ${Math.abs(amount.toFixed(2))}</span>
  <div class="btn-box">
    <button class="btn delete-btn" onClick="removeTransaction(${id})"> X </button>
    <button class="btn edit-btn" onClick="modal.open(${id})">🖊</button>
  </div>
  
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

const updateTransaction = (e) => {
  e.preventDefault();
  const id = Number(e.target.getAttribute("id"));

  const validate = validateErrorUpdate();
  if (typeof validate === "undefined") {
    return;
  }
  
  
  const data = {
    id,
    name: inputTransactionUpdateName.value,
    amount: Number(inputTransactionUpdateValue.value)
  }

  transactions[id - 1] = data;
  updateLocalStorage();
  init();
  modal.close();
}

const removeTransaction = id => {
  transactions = transactions.filter(t => t.id !== id);
  updateLocalStorage();
  init();
}

const validateErrorInsert = () => {
  const inputName = inputTransactionName.value;
  const inputValue = inputTransactionValue.value;
  
  if (inputName.trim().length <= 0) {
    viewMessageErrorInsert("Preencha o campo nome", "name");
    return;
    
  } else {
    nameTransactionDOOM.innerHTML = "";
  }
  
  if (inputValue.trim().length <=0) {
    viewMessageErrorInsert("Preencha o campo Números", "number");
    return;
  }
  
  if (!Number(inputValue)) {
    viewMessageErrorInsert("Somente Números", "number");
    return;
  } else {
    valueTransactionDOOM.innerHTML = "";
  }
  
  inputTransactionName.value = '';
  inputTransactionValue.value = '';
  
  
  return {
    name: inputName,
    amount: Number(inputValue)
  }
  
}

const validateErrorUpdate = () => {
  console.log("cu")
  const inputName = inputTransactionUpdateName.value;
  const inputValue = inputTransactionUpdateValue.value;
  
  if (inputName.trim().length <= 0) {
    viewMessageErrorUpdate("Preencha o campo nome", "name");
    return;
    
  } else {
    nameUpdateTransactionDOOM.innerHTML = "";
  }
  
  if (inputValue.trim().length <=0) {
    viewMessageErrorUpdate("Preencha o campo Números", "number");
    return;
  } else {
    valueUpdateTransactionDOOM.innerHTML = "";
  }
  
  if (!Number(inputValue)) {
    viewMessageErrorUpdate("Somente Números", "number");
    return;
  } else {
    valueUpdateTransactionDOOM.innerHTML = "";
  }
  
  inputTransactionName.value = '';
  inputTransactionValue.value = '';
  
  
  return {
    name: inputName,
    amount: Number(inputValue)
  }
  
}

const viewMessageErrorInsert = (messageError, type) => {
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

const viewMessageErrorUpdate = (messageError, type) => {
  const p = document.createElement("p");
  p.classList.add("error");
  
  valueUpdateTransactionDOOM.innerHTML = "";
  nameUpdateTransactionDOOM.innerHTML = "";
  
  if (type == "name") {
    p.innerHTML = messageError;
    nameUpdateTransactionDOOM.appendChild(p);
  }
  
  if (type == "number") {
    p.innerHTML = messageError;
    valueUpdateTransactionDOOM.appendChild(p);
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
  
  const validate = validateErrorInsert();
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

formUpdate.addEventListener("submit", e => updateTransaction(e));

init();
