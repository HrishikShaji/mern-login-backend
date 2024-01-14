var mysql = require("mysql");
var connection = mysql.createConnection({
  host: "bm0jrovmzh5ttjj38yia-mysql.services.clever-cloud.com",
  user: "ut2j0iujvriiarpi",
  password: "N8AJNQvzcutRpniArAYU",
  database: "bm0jrovmzh5ttjj38yia",
});

connection.connect();

connection.query("SELECT 1 + 1 AS solution", function (error, results, fields) {
  if (error) throw error;
  console.log("The solution is: ", results[0].solution);
});

connection.end();
