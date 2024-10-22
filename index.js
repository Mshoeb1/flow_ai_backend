const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { open } = require("sqlite");
const path = require("path");
const cors = require("cors");

const app = express();

app.use(bodyParser.json());

app.use(cors());

const dbPath = path.join(__dirname, "dataBase.db");

let dataBase = null;

// Initializing Db Server
const initializeDBAndServer = async () => {
  try {
    dataBase = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    console.log("file open");
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

// creating data base
const db = new sqlite3.Database(
  "./dataBase.db",
  sqlite3.OPEN_READWRITE,
  (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log("Connected to the in-memory SQlite database.");
  }
);

db.serialize(() => {
  db.run(
    "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT NOT NULL,email TEXT UNIQUE NOT NULL,password TEXT NOT NULL);",
    (err) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log("Users table created");
      }
    }
  );
  db.run(
    "CREATE TABLE IF NOT EXISTS transactions (id INTEGER PRIMARY KEY AUTOINCREMENT,user_id INTEGER, type TEXT NOT NULL,category INTEGER NOT NULL, amount INETGER NOT NULL,date TEXT NOT NULL,description TEXT, FOREIGN KEY (category) REFERENCES categories(id), FOREIGN KEY (user_id) REFERENCES users(id));",
    (err) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log("Transaction table created");
      }
    }
  );

  db.run(
    "CREATE TABLE IF NOT EXISTS categories (id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT NOT NULL,type TEXT NOT NULL);",
    (err) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log("categories table created");
      }
    }
  );
});

// Authenticating user via JWT token

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const selectUser = `SELECT * FROM users WHERE email='${email}';`;
  const userData = await dataBase.get(selectUser);
  if (userData !== undefined) {
    const isPasswordMatched = await bcrypt.compare(password, userData.password);
    if (userData && isPasswordMatched) {
      const payload = {
        email: email,
      };
      const jwtToken = jwt.sign(payload, "MY_SECRET_TOKEN");
      res.status(200);
      res.json({
        id: userData.id,
        name: userData.name,
        email: userData.email,
        password: userData.password,
        jwt_token: jwtToken,
      });
      console.log("login successfull");
    } else {
      res.status(401);
      res.send("Invalid Password Entered");
    }
  } else {
    res.status(401);
    res.send("Invalid Username and Password");
  }
});

// Creating user

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const row = db.run(
    `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`,
    [name, email, hashedPassword],
    function (err) {
      if (err) {
        if (err.code === "SQLITE_CONSTRAINT") {
          return res.status(400).json({ error: "Email already exists" });
        }
        return res.status(500).json({ error: err.message });
      }
    }
  );
  if (row) {
    const payload = {
      name: name,
    };
    const jwtToken = jwt.sign(payload, "MY_SECRET_TOKEN", {
      expiresIn: "30d",
    });
    res.json({
      name: name,
      email: email,
      password: hashedPassword,
      jwt_tokent: jwtToken,
    });
  } else {
    res.status(400);
    res.send("User Registration Error");
  }
});

// creating transaction

app.post("/transactions", async (req, res) => {
  const { id, type, category, amount, date, description } = req.body;
  if (!id || !type || !category || !amount || !date || !description) {
    res.send("All Fields Required");
    res.status("400");
  } else {
    let row;
    row = db.run(
      `INSERT INTO transactions (user_id, type, category, amount, date, description) VALUES (?, ?, ?, ?, ?, ?)`,
      [id, type, category, amount, date, description],
      function (err) {
        if (err) {
          if (err.code === "SQLITE_CONSTRAINT") {
            return (
              res.status(400),
              res.json({ error: "Please check all input fields" })
            );
          }
          return res.status(500).json({ error: err.message });
        } else {
          res.status(200);
          res.send("Data updated in transaction fields");
        }
      }
    );
  }
});

// Retrieving All transactions

app.get("/transactions", async (req, res) => {
  db.all(`SELECT * FROM transactions`, (err, rows) => {
    if (err) {
      console.error(err.message);
    } else {
      // Convert the rows to an array of objects
      const transactionArray = rows.map((row) => {
        return {
          id: row.id,
          type: row.type,
          category: row.category,
          amount: row.amount,
          date: row.date,
          description: row.description,
        };
      });

      // Return the data as an array of objects
      console.log(transactionArray);
      res.json(transactionArray);
    }
  });
});

// Retrieving Specific Transaction Based on input ID:

app.get("/transactions/:id", async (req, res) => {
  const id = req.params.id;
  db.all(`SELECT * FROM transactions WHERE id =${id};`, (err, rows) => {
    if (err) {
      console.error(err.message);
    } else {
      // Convert the rows to an array of objects
      const transactionArray = rows.map((row) => {
        return {
          id: row.id,
          type: row.type,
          category: row.category,
          amount: row.amount,
          date: row.date,
          description: row.description,
        };
      });

      // Return the data as an array of objects
      console.log(transactionArray);
      res.json(transactionArray);
    }
  });
});

// Update a transaction by ID
app.put("/transactions/:id", (req, res) => {
  const id = req.params.id;

  const { type, category, amount, date, description } = req.body;
  const sql = `UPDATE transactions SET type = ?, category = ?, amount = ?, date = ?, description = ? WHERE id = ${id}`;
  db.run(sql, [type, category, amount, date, description], function (err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.status(200);
    res.json({ message: "Transaction updated successfully" });
  });
});

// Deleting Specific transaction from database
app.delete("/transactions/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const deletedRows = await db.run(
      `DELETE FROM transactions WHERE id = ${id};`
    );

    if (deletedRows.changes === 0) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    res.status(200);
    res.json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Modeling Summary of transaction using from specific date

app.get("/summary", (req, res) => {
  const { from, to, type } = req.query;
  let query = `SELECT type, SUM(amount) as total FROM transactions WHERE type=${type}`;
  let params = [];

  if (from) {
    query += ` AND date >= ?`;
    params.push(from);
  }

  if (to) {
    query += ` AND date <= ?`;
    params.push(to);
  }

  if (category) {
    query += ` AND category = ?`;
    params.push(category);
  }

  query += ` GROUP BY type`;

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    const summary = rows.reduce((acc, row) => {
      acc[row.type] = row.total;
      return acc;
    }, {});

    summary.balance = (summary.income || 0) - (summary.expense || 0);
    res.json(summary);
  });
});

const PORT = process.env.PORT || 4000;
console.log(PORT);
app.listen(PORT, console.log("Server is running on 4000 port!"));
