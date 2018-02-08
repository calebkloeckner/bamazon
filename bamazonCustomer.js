const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
    host: 'localhost',
    port: 8889,
    user: 'root',
    password:'root',
    database: 'bamazon'
});
connection.connect(function(err){
    if(err) throw err;
    console.log("Get ready to buy from Bamazon");
    listOfProducts();

});

var itemsBought = [];
// lists all of the products available
function listOfProducts() {
    connection.query("SELECT * FROM products", function(err, res){
        inquirer
        .prompt({
          name: "action",
          type: "list",
          message: "What item tickles your fancy? Select the item you are interested in:",
          choices: function() {
              var choices = [];
              for(var i = 0; i < res.length; i++){
                  choices.push("Item number: " + res[i].item_id + " - " + res[i].product_name + ": Cost: $" + res[i].price);
              }
              return choices;
          }
        
    }).then(function(answer){
        var chosenItem;
        for(var i = 0; i < res.length; i++){
            if(res[i].product_name === answer.items){
                chosenItem = res[i];
            }
        }
        itemsBought.push(chosenItem);
       
        purchaseQuanity();
    });

});
}