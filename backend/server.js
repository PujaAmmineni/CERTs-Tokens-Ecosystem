const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const users = {}; // Store user data in-memory (Replace with DB in production)

const SECRET_KEY = "mysecretkey";

// User Registration
app.post("/register", (req, res) => {
    const { username, password } = req.body;
    if (users[username]) return res.status(400).json({ error: "User already exists" });

    users[username] = { password, balance: 1000 }; // Default balance
    res.json({ message: "User registered", balance: 1000 });
});

// User Login
app.post("/login", (req, res) => {
    const { username, password } = req.body;
    if (!users[username] || users[username].password !== password) {
        return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
    res.json({ token });
});

// Get Balance
app.get("/balance", (req, res) => {
    const { username } = jwt.verify(req.headers.authorization, SECRET_KEY);
    res.json({ balance: users[username].balance });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
