const { prompt } = require('inquirer')
const { createConnection } = require('mysql2')

const db = createConnection({
  host: 'localhost',
  user: 'root',
  password: 'LMUlions141!',
  database: 'bamazon'
})

async function getItems() {
  let response = await new Promise((resolve, reject) => {
    db.query(`SELECT * FROM products`, (e, r) => {
      if (e) {
        reject(e)
      } else {
        resolve(r)
      }
    })
  })
  return response
}

async function viewLow() {
  let response = await new Promise((resolve, reject) => {
    db.query(`SELECT * FROM products WHERE stock_quantity < 5`, (e, r) => {
      if (e) {
        reject(e)
      } else {
        resolve(r)
      }
    })
  })
  return response
}

const addInventory = _ => {
  prompt([
    {
      type: 'input',
      name: 'item',
      message: 'What is the ID of the product that you would like to add inventory to?'
    },
    {
      type: 'number',
      name: 'amount',
      message: 'How much of the product would you like to add?'
    }
  ])
    .then(({ input, number }) => {
      db.query(`SELECT `)
    })
}

const buySomeSchtuff = _ => {
  prompt({
    type: 'list',
    name: 'action',
    message: 'What would you like to do?',
    choices: ['View All Products', 'View Low Inventory', 'Add To Inventory', 'Add New Product', 'Exit']
  })
    .then(({ action }) => {
      switch (action) {
        case 'View All Products':
          getItems()
            .then(item => {
              item.forEach(({ item_id, product_name, price, stock_quantity }) => console.log(`      --------------------
      Item ${item_id} is ${product_name}.
      Item cost is $${price} per unit.
      Currently there is ${stock_quantity} in stock.`))
              buySomeSchtuff()
            })
            .catch(e => console.log(e))
          break
        case 'View Low Inventory':
          viewLow()
            .then(item => {
              item.forEach(({ item_id, product_name, price, stock_quantity }) => console.log(`      --------------------
      Item ${item_id} has low inventory.
      Currently there is only ${stock_quantity} in stock.
      `))
              buySomeSchtuff()
            })
            .catch(e => console.log(e))
          break
        case 'Add To Inventory':
          addInventory()
          break
        case 'Add New Product':
          console.log('add new products')
          break
        case 'Exit':
          process.exit()
        default:
          break
      }
    })
    .catch(e => console.log(e))
}

console.log('-----Welcome to Bamazon!-----')
buySomeSchtuff()
