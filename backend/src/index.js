import express from "express";
import dotenv from "dotenv";
import session from "express-session";
import pgSession from "connect-pg-simple";
import cors from "cors";
import pool from "./db/db.js";
import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/adminAuth.js";
import buildingRoutes from "./routes/buildings.js";
import lotRoutes from "./routes/lots.js";
import slotRoutes from "./routes/slots.js";

dotenv.config();
const app = express();

// Middleware
app.use(express.json());

// Setup session middleware
const PgSession = pgSession(session);

app.use(session({
  store: new PgSession({
    pool,
    tableName: "session",
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 4, // 4 hours
    secure: false, // true only in production (HTTPS)
    httpOnly: true,
  },
}));

app.use(
  cors({
    origin: "http://localhost:5173", // your React dev server
    credentials: true,               // allow cookies for admin routes
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/buildings", buildingRoutes);
app.use("/api/lots", lotRoutes);
app.use("/api/slots", slotRoutes);

app.get("/", (req, res) => {
  res.json({ message: "SmartPark backend running 🚗" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
