const openContainer = () =>
  document.getElementById('container').classList.add('active')

const closeContainer = () => {
  clearScreens()
  document.getElementById('container').classList.remove('active')
}

const getLocalStorage = () =>
  JSON.parse(localStorage.getItem('base_costumer')) ?? []
const setLocalStorage = (baseCostumer) =>
  localStorage.setItem('base_costumer', JSON.stringify(baseCostumer))

const deleteClient = (index) => {
  const baseCostumer = readClient()
  baseCostumer.splice(index, 1)
  setLocalStorage(baseCostumer)
}

const updateClient = (index, client) => {
  const baseCostumer = readClient()
  baseCostumer[index] = client
  setLocalStorage(baseCostumer)
}

const readClient = () => getLocalStorage()

const createClient = (client) => {
  const baseCostumer = getLocalStorage()
  baseCostumer.push(client)
  setLocalStorage(baseCostumer)
}

const isValidScreens = () => {
  return document.getElementById('form').reportValidity()
}

const clearScreens = () => {
  const screens = document.querySelectorAll('.container-screen')
  screens.forEach((screen) => (screen.value = ''))
  document.getElementById('name').dataset.index = 'new'
}

const saveClient = () => {
  if (isValidScreens()) {
    const client = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      cell: document.getElementById('cell').value,
      city: document.getElementById('city').value,
    }
    const index = document.getElementById('name').dataset.index
    if (index == 'new') {
      createClient(client)
      updateTable()
      closeContainer()
    } else {
      updateClient(index, client)
      updateTable()
      closeContainer()
    }
  }
}

const createRow = (client, index) => {
  const newRow = document.createElement('tr')
  newRow.innerHTML = `
          <td>${client.name}</td>
          <td>${client.email}</td>
          <td>${client.cell}</td>
          <td>${client.city}</td>
          <td>
              <button type="button" class="button green" id="edit-${index}">Edit</button>
              <button type="button" class="button red" id="delete-${index}" >Delete</button>
          </td>
      `
  document.querySelector('#tableCustomer>tbody').appendChild(newRow)
}

const clearTable = () => {
  const rows = document.querySelectorAll('#tableCustomer>tbody tr')
  rows.forEach((row) => row.parentNode.removeChild(row))
}

const updateTable = () => {
  const baseCostumer = readClient()
  clearTable()
  baseCostumer.forEach(createRow)
}

const fillScreens = (client) => {
  document.getElementById('name').value = client.name
  document.getElementById('email').value = client.email
  document.getElementById('cell').value = client.cell
  document.getElementById('city').value = client.city
  document.getElementById('name').dataset.index = client.index
}

const editClient = (index) => {
  const client = readClient()[index]
  client.index = index
  fillScreens(client)
  openContainer()
}

const editDelete = (event) => {
  if (event.target.type == 'button') {
    const [action, index] = event.target.id.split('-')

    if (action == 'edit') {
      editClient(index)
    } else {
      const client = readClient()[index]
      const response = confirm(
        `Deseja realmente excluir o cliente ${client.nome}`,
      )
      if (response) {
        deleteClient(index)
        updateTable()
      }
    }
  }
}

updateTable()

document
  .getElementById('registerClient')
  .addEventListener('click', openContainer)

document
  .getElementById('containerClose')
  .addEventListener('click', closeContainer)

document.getElementById('save').addEventListener('click', saveClient)

document
  .querySelector('#tableCustomer>tbody')
  .addEventListener('click', editDelete)

document.getElementById('cancel').addEventListener('click', closeContainer)
