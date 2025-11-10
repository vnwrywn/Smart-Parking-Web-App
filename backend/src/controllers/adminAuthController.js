import bcrypt from "bcrypt";
import pool from "../db/db.js";

// Admin login
export const adminLogin = async (req, res) => {
  const { username, password } = req.body;

  // Check if username & password is filled
  if (!username || !password)
    return res.status(400).json({ status: "error", message: "Username and password required" });

  try {
    // Query for admin id and password hash
    const result = await pool.query("SELECT * FROM admins WHERE username = $1", [username]);
    if (result.rows.length === 0)
      return res.status(401).json({ status: "error", message: "Invalid credentials" });

    // Compare password
    const admin = result.rows[0];
    const valid = await bcrypt.compare(password, admin.password_hash);

    if (!valid)
      return res.status(401).json({ status: "error", message: "Invalid credentials" });

    // Create session
    req.session.adminId = admin.id;
    req.session.adminName = admin.username;

    res.json({
      status: "success",
      message: "Admin login successful",
      admin: { id: admin.id, username: admin.username },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

// Admin logout
export const adminLogout = (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ status: "error", message: "Failed to log out" });
    res.clearCookie("connect.sid");
    res.json({ status: "success", message: "Logged out successfully" });
  });
};
