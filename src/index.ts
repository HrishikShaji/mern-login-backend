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

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  const query = "SELECT * FROM users WHERE username = ? AND password = ?";
  connection.query(query, [username, password], (error, results, fields) => {
    if (error) {
      return res.status(500).json({ error: "Internal server error" });
    }

    if (results.length > 0) {
      return res.status(200).json({ message: "Login successful" });
    } else {
      return res.status(401).json({ error: "Invalid username or password" });
    }
  });
});

app.post("/signin", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  const query = "INSERT INTO users (username, password) VALUES (?, ?)";
  console.log(username, password);
  connection.query(query, [username, password], (error, results, fields) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ error: "Internal server error" });
    }
    console.log(results);
    return res.status(201).json({ message: "User created successfully" });
  });
});

process.on("SIGINT", () => {
  connection.end((err) => {
    if (err) {
      console.error("Error closing MySQL connection:", err);
    } else {
      console.log("MySQL connection closed");
      process.exit();
    }
  });
});

const port = process.env.PORT || 8082;

app.listen(port, () => console.log(`Server running on port ${port}`));
