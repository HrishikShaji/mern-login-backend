import express from "express";
import dotenv from "dotenv";
import cors from "cors";

var mysql = require("mysql");
dotenv.config();
var connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
  optionSuccessStatus: 200,
};

connection.connect();

const app = express();
app.use(cors(corsOptions));
app.use(express.json());

app.get("/", (req, res) => res.send("helle"));

app.post("/login", (req, res) => {
  console.log(req);
});

console.log(process.env.HOST);

connection.query(
  "SELECT 1 + 1 AS solution",
  function (error: any, results: any, fields: any) {
    if (error) throw error;
    console.log("The solution is: ", results[0].solution);
  }
);

connection.end();

const port = process.env.PORT || 8082;

app.listen(port, () => console.log(`Server running on port ${port}`));
