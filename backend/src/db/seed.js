import pkg from "pg";
import fs from "fs";

const { Pool } = pkg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function seed() {
  try {
    const schema = fs.readFileSync("src/db/schema.sql").toString();
    const data = fs.readFileSync("src/db/seed.sql").toString();
    await pool.query(schema);
    await pool.query(data);
    console.log("Database seeded successfully.");
  } catch (err) {
    console.error("Seeding failed:", err);
  } finally {
    await pool.end();
  }
}

seed();
