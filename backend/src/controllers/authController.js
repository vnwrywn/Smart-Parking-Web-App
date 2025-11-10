import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../db/db.js";
import dotenv from "dotenv";

dotenv.config();

// Register
export const registerUser = async (req, res) => {
  const { username, password } = req.body;

  // Check if username & password is filled
  if (!username || !password) {
    return res.status(400).json({ status: "error", message: "Username and password required." });
  }

  try {
    // Check if username exists
    const userCheck = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
    if (userCheck.rows.length > 0) {
      return res.status(409).json({ status: "error", message: "Username already taken." });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 12);

    // Insert into DB
    await pool.query(
      "INSERT INTO users (username, password_hash) VALUES ($1, $2)",
      [username, hashed]
    );

    res.status(201).json({ status: "success", message: "User registered successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

// Login existing user
export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  // Check if username & password is filled
  if (!username || !password) {
    return res.status(400).json({ status: "error", message: "Username and password required." });
  }

  try {
    // Query for user id and password hash
    const userRes = await pool.query("SELECT id, password_hash FROM users WHERE username = $1", [username]);
    if (userRes.rows.length === 0) {
      return res.status(401).json({ status: "error", message: "Invalid username or password." });
    }

    // Compare password
    const user = userRes.rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ status: "error", message: "Invalid username or password." });
    }

    // Create JWT
    const token = jwt.sign(
      { id: user.id, username: username },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      status: "success",
      message: "Login successful.",
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};
