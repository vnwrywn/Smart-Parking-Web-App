import pool from "../db/db.js";

// GET all lots
export const getLots = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, floor_name, building_id FROM parking_lots
      ORDER BY building_id ASC, floor_name ASC
    `);
    res.json({ status: "success", data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

// GET one lot by ID
export const getLotById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`
      SELECT 
        parking_lots.floor_name,
        buildings.id AS building_id,
        buildings.name AS building_name
      FROM parking_lots
      JOIN buildings ON parking_lots.building_id = buildings.id
      WHERE parking_lots.id = $1
    `, [id]);

    if (result.rows.length === 0)
      return res.status(404).json({ status: "error", message: "Lot not found" });

    res.json({ status: "success", data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

// CREATE a lot
export const createLot = async (req, res) => {
  const { building_id, floor_name } = req.body;
  // Check if building name is picked & password is filled
  if (!building_id || !floor_name)
    return res.status(400).json({ status: "error", message: "Building and floor name are required" });

  try {
    // Validate building exists
    const building = await pool.query("SELECT * FROM buildings WHERE id = $1", [building_id]);
    if (building.rows.length === 0)
      return res.status(404).json({ status: "error", message: "Building not found" });

    // Prevent duplicate floor in same building
    const duplicate = await pool.query(
      "SELECT id FROM parking_lots WHERE building_id = $1 AND floor_name = $2",
      [building_id, floor_name]
    );
    if (duplicate.rows.length > 0)
      return res.status(409).json({ status: "error", message: "A parking lot with than name already exists in that building" });

    // INSERT query
    const result = await pool.query(
      "INSERT INTO parking_lots (building_id, floor_name) VALUES ($1, $2) RETURNING *",
      [building_id, floor_name]
    );

    res.status(201).json({ status: "success", message: "Parking lot created", data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

// UPDATE a lot
export const updateLot = async (req, res) => {
  const { id } = req.params;
  const { building_id, floor_name } = req.body;

  try {
    const exists = await pool.query("SELECT id FROM parking_lots WHERE id = $1", [id]);
    if (exists.rows.length === 0)
      return res.status(404).json({ status: "error", message: "Lot not found" });

    // Prevent duplicate floor in same building
    const duplicate = await pool.query(
      "SELECT id FROM parking_lots WHERE building_id = $1 AND floor_name = $2",
      [building_id, floor_name]
    );
    if (duplicate.rows.length > 0)
      return res.status(409).json({ status: "error", message: "A parking lot with than name already exists in that building" });

    // UPDATE query
    await pool.query(
      "UPDATE parking_lots SET building_id = $1, floor_name = $2 WHERE id = $3",
      [building_id, floor_name, id]
    );

    res.json({ status: "success", message: "Parking lot updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

// DELETE a lot
export const deleteLot = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query("DELETE FROM parking_lots WHERE id = $1 RETURNING *", [id]);
    if (result.rows.length === 0)
      return res.status(404).json({ status: "error", message: "Lot not found" });

    res.json({ status: "success", message: "Parking lot deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};
