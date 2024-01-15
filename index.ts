import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createSecretToken } from "./utils/generateToken";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

var mysql = require("mysql");
dotenv.config();
var connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

const corsOptions = {
  origin: process.env.ORIGIN,
  credentials: true,
  optionSuccessStatus: 200,
};

connection.connect();

const app = express();
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.post("/", (req, res) => {
  const token = req.cookies.token;
  console.log("token is", token);
  if (!token) {
    return res.json({ status: false });
  }
  jwt.verify(token, process.env.SECRET, async (err, data) => {
    if (err) {
      return res.json({ status: false });
    } else {
      const query = "SELECT * FROM users WHERE id = ?";
      connection.query(query, [data.id], (error, results, fields) => {
        if (error) {
          return res.status(500).json({ error: "Internal server error" });
        }
        if (results.length > 0) {
          console.log("token", results);
          res.status(201).json({ user: results[0], success: true });
        } else {
          return res.json({ status: false });
        }
      });
    }
  });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }
  console.log(username, password);
  const query = "SELECT * FROM users WHERE username = ? AND password = ?";
  connection.query(query, [username, password], (error, results, fields) => {
    if (error) {
      return res.status(500).json({ error: "Internal server error" });
    }

    if (results.length > 0) {
      const id = results[0].id;
      console.log(id);
      const token = createSecretToken(id);
      res.cookie("token", token, {
        httpOnly: false,
      });
      res
        .status(201)
        .json({ message: "User logged in successfully", success: true });
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

  connection.query(query, [username, password], (error, results, fields) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ error: "Internal server error" });
    }
    console.log("results are", results.insertId);

    const token = createSecretToken(results.insertId);
    res.cookie("token", token, {
      httpOnly: false,
    });
    res
      .status(201)
      .json({ message: "User signed in successfully", success: true });
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
