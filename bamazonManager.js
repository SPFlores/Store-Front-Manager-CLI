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
  prompt({
    type: 'input',
    name: 'item',
    message: 'What is the ID of the product that you would like to add inventory to?'
  })
    .then(({ item }) => {
      db.query(`SELECT * FROM products WHERE ?`, { item_id: item }, (e, [{ product_name, stock_quantity }]) => {
        if (e) throw e
        prompt({
          type: 'number',
          name: 'amount',
          message: `How many ${product_name} would you like to add?`
        })
          .then(({ amount }) => {
            db.query(`UPDATE products SET ? WHERE ?`, [
              { stock_quantity: stock_quantity + amount }, { item_id: item }
            ], e => {
              if (e) throw e
              console.log(`You have successfully added ${amount} ${product_name}. The total quantity is now ${stock_quantity + amount}.`)
              buySomeSchtuff()
            })
          })
          .catch(e => console.log(e))
      })
    })
    .catch(e => console.log(e))
}

const addNewThing = _ => {
  prompt([
    {
      type: 'input',
      name: 'product_name',
      message: 'What is the name of the product that you would like to add?'
    },
    {
      type: 'input',
      name: 'department_name',
      message: 'To what department does it belong?'
    },
    {
      type: 'number',
      name: 'price',
      message: 'How much does one item cost?'
    },
    {
      type: 'number',
      name: 'stock_quantity',
      message: 'How many of this item would you like to add?'
    }
  ])
    .then(item => {
      db.query('INSERT INTO products SET ?', item, e => {
        if (e) throw e
        console.log(`You have successfully added ${item.product_name} to the store. There are currently ${item.stock_quantity} units in stock.`)
        buySomeSchtuff()
      })
    })
    .catch(e => console.log(e))
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
          addNewThing()
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
