# bamazon

# What It Is

A CLI app that functions like an online store for buying items. There is also a database scheme to populate some base items. There are two views for this: 

## Customer

and

## Manager

# What a Customer Can Do

Once a customer starts the program, they can either view all of the items available for sale or purchase an item. There is also an option to exit.

### View All

When a customer views all items, they are presented with a list of all items in the store. Each item lists its ID, price, and current stock.

![starting](/Assets/Images/starting.png)

![view all items](/Assets/Images/view_all.png)

Once displayed, the user is automatically presented with the starting menu again and can choose to view all or purchase an item.

### Purchasing

When a user starts to purchase an item, they need to enter the ID of the product and how much they wish to order. The user's input is validated against the IDs in the database and will give the following error if the ID does not belong to an item:

![incorrect ID](/Assets/Images/invalid_id.png)

The user is asked to either view all the items again to find a valid ID, or start the purchasing option again and provide a different ID. 

Upon entering a valid ID, the user is asked how many of the item they would like to purchase and the stock quantity is validated against the item quantity in the databse. If the item does not have enough in stock, the user is prompted to enter a different quantity or go back to purchase a different item. This is validated multiple times if the user keeps moving through the prompts and tries to purchase an unavailable amount of the product.

![not enough stock](/Assets/Images/low_stock.png)

![not enough stock](/Assets/Images/incorrect_low_stock.png)

If the item is completely out of stock, the user is informed the item is not available.

![out of stock](/Assets/Images/out_of_stock.png)

After a successful purchase, a user is presented with the total amount of their transaction.

![total of purchase](/Assets/Images/successful_buy.png)

# What A Manager Can Do

A manager is presented with a welcome screen upon opening and lists all the things the user can do with manager permissions.

![manager welcome](/Assets/Images/manager_starting.png)

## View Low Inventory

A manager can see any items that have less than 5 units in stock.

![manager low inventory](/Assets/Images/manager_low_inventory.png)

If the manager wants to update stock, they can go in and add inventory.

## Adding Inventory

A manager can enter an ID of an item and how many units they would like to add to update the inventory of any item in the system.

![add inventory](/Assets/Images/manager_add_inventory.png)

## Adding New Products

If adding more inventory isn't enough, the manager can also add in a new item.

They are prompted to enter a name, department, price, and quantity.

![add new inventory](/Assets/Images/manager_add_new.png)

This new product is added to the database and can be seen when viewing products. 
