const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
    host: 'localhost',
    port: 8889,
    user: 'root',
    password:'root',
    database: 'bamazon'
});
connection.connect(function(err) {
    if (err) throw err;
    con.query("SELECT * FROM products", function(err, result) {
        if (err) throw err;
        console.log(result);
    });
    // runSearch();
});

// function runSearch() {
//     inquirer
//       .prompt({
//         name: "action",
//         type: "list",
//         message: "What would you like to do?",
//         choices: [
          
//         ]
//       })
//     }