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

const buyAThing = _ => {
  prompt([
    {
      type: 'number',
      name: 'item',
      message: 'Please entere the ID of the item you would like to buy.'
    },
    {
      type: 'number',
      name: 'quant',
      message: 'How many would you like to buy?'
    }
  ])
    .then(({ item, quant }) => {
      db.query(`SELECT * FROM products WHERE ?`,
        { item_id: item }, (e, [{ product_name, stock_quantity, price }]) => {
          let stock = stock_quantity
          if (stock === 0) {
            console.log(`We're sorry, ${product_name} is not currently in stock.`)
            buySomeSchtuff()
          } else if (stock < quant && stock > 0) {
            console.log(`We're sorry, there isn't enough ${product_name} in stock for you to purchace that quantity. The maximum you can purchase is ${stock}`)
            prompt({
              type: 'confirm',
              name: 'moreOrLess',
              message: 'Do you want to purchase a different quantity?'
            })
              .then(({ moreOrLess }) => {
                if (moreOrLess) {
                  prompt({
                    type: 'number',
                    name: 'quantity',
                    message: `How many ${product_name} would you like to purchase? Maximum is ${stock}.`
                  })
                    .then(({ quantity }) => {
                      db.query(`UPDATE products SET ? WHERE ?`, [
                        { stock_quantity: (stock - quantity) }, { item_id: item }
                      ], e => {
                        if (e) throw e
                        console.log(`Congratulations, you have purchased ${quantity} of the ${product_name} at ${price} each for a total of $${quantity * price}.`)
                        buySomeSchtuff()
                      })
                    })
                    .catch(e => console.log(e))
                } else {
                  buySomeSchtuff()
                }
              })
              .catch(e => console.log(e))
          } else if (stock > quant) {
            db.query(`UPDATE products SET ? WHERE ?`, [
              { stock_quantity: (stock - quant) }, { item_id: item }
            ], e => {
              if (e) throw e
              console.log(`Congratulations, you have purchased ${quant} of the ${product_name} at ${price} each for a total of $${quant * price}.`)
              buySomeSchtuff()
            })
          }
        }
      )
    })
    .catch(e => console.log(e))
}

const buySomeSchtuff = _ => {
  prompt({
    type: 'list',
    name: 'action',
    message: 'What would you like to do?',
    choices: ['View All Products', 'Purchase', 'Exit']
  })
    .then(({ action }) => {
      switch (action) {
        case 'View':
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
        case 'Purchase':
          buyAThing()
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
