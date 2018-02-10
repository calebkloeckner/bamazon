const mysql = require("mysql");
const inquirer = require("inquirer");


const connection = mysql.createConnection({
    host: 'localhost',
    port: 8889,
    user: 'root',
    password: 'root',
    database: 'bamazon'
});
connection.connect(function (err) {
    if (err) throw err;
    console.log("Get ready to buy from Bamazon");
    listOfProducts();

});

var itemsBought = [];
var chosenItem = null;

// lists all of the products available
function listOfProducts() {
    connection.query("SELECT * FROM products", function (err, res) {
        inquirer
            .prompt({
                name: "action",
                type: "list",
                message: "What item tickles your fancy? Select the item you are interested in:",
                choices: function () {
                    var choices = [];
                    for (var i = 0; i < res.length; i++) {
                        // choices.push("Item number: " + res[i].item_id + " - " + res[i].product_name + ": Cost: $" + res[i].price);
                        choices.push(res[i].product_name);
                    }
                    return choices;
                }

            }).then(function (answer) {
                for (var i = 0; i < res.length; i++) {
                    if (res[i].product_name === answer.action) {
                        chosenItem = res[i];
                        console.log('You have selected: ' + res[i].product_name);
                        console.log("We have " + res[i].stock_quantity + " in stock");
                        console.log("$" + res[i].price + " each");
                    }
                }
                itemsBought.push(chosenItem);
                purchaseQuantity(chosenItem);
            });
    });
}

function purchaseQuantity(item) {
    inquirer.prompt([{
        name: "orderQuantity",
        type: "input",
        message: "How many would you like?"
    }]).then(function (answers) {

        if (answers.orderQuantity > item.stock_quantity) {

            console.log("Not enough itmes in stock, please choose something else.");
            listOfProducts();

        } else {
            console.log("Looks like you're in luck!");


            makePurchase(item, answers.orderQuantity);
        }

        function makePurchase(product, quantity) {
            connection.query(
                "UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id = ?", [quantity, product.item_id],
                function (err, res) {
                    // Let the user know the purchase was successful, re-run loadProducts
                    console.log("\nSuccessfully purchased " + quantity + " " + product.product_name + "'s!");
                    console.log("Your total is: $" + product.price * quantity + ".00");
                    console.log("\n---------------------------------------------------------------\n");
                }
            )
        };
        listOfProducts();
    });

}

