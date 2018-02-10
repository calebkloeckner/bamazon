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
    managerDuties();
});

function managerDuties() {
    inquirer.prompt([
        {
            type: "list",
            name: "managementOptions",
            message: "What would you like to do?",
            choices: [
                "View products for sale",
                "View low inventory",
                "Add to inventory",
                "Add new product"
            ]
        }
    ]).then(function(answers){
        if(answers.managementOptions === "View products for sale"){
            viewProducts();
        } if(answers.managementOptions === "View low inventory"){
            lowInventory();
        } if(answers.managementOptions === "Add to inventory"){
            addInventory();
        } if(answers.managementOptions === "Add new product"){
            addProduct();
        }
    });
}

function viewProducts() {
    console.log("These are the products for sale... ");
    connection.query("SELECT * FROM products", function(err, res){
        for(var i = 0; i < res.length; i++){
            console.log(res[i].product_name);
        }
    });    
    managerDuties();
}

function lowInventory() {
    console.log("These items are low in inventory ");
    connection.query("SELECT * FROM products WHERE stock_quantity < 3", function(err, res) {
        for(var i = 0; i < res.length; i++){
            console.log(res[i].product_name + ": " + res[i].stock_quantity);
        }
    });
    managerDuties();
}

var newInventory = [];
function addInventory(){
    console.log("Add to your inventory...");
    connection.query("SELECT * FROM products", function(err, res){
        inquirer.prompt([
            {
                type: "input",
                name: "items",
                message: "What would you like to add?",
                choices: function(){
                    var choices = [];
                    for(var i = 0; i < res.length; i++){
                        choices.push(res[i].product_name);
                    }
                    return choices;
                }
            }
        ]).then(function(answers){
            var chosenItem;
            for(var i = 0; i < res.length; i++){
                if(res[i].product_name === answers.items){
                    chosenItem = res[i];
                }
            }
            newInventory.push(chosenItem);
        });
    });
}
// this is a far as I got. 