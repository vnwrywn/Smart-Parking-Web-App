import pool from "../db/db.js";

// GET all buildings
export const getBuildings = async (req, res) => {
  try {
    const result = await pool.query("SELECT id, name FROM buildings ORDER BY id ASC");
    res.json({ status: "success", data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

// GET one building by ID
export const getBuildingById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT name FROM buildings WHERE id = $1", [id]);

    if (result.rows.length === 0)
      return res.status(404).json({ status: "error", message: "Lot not found" });

    res.json({ status: "success", data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

// CREATE building
export const createBuilding = async (req, res) => {
  const { name } = req.body;
  // Check if building name isn't filled
  if (!name)
    return res.status(400).json({ status: "error", message: "Building name is required" });

  try {
    // Check if building name is already used
    const exists = await pool.query("SELECT id  FROM buildings WHERE name = $1", [name]);
    if (exists.rows.length > 0)
      return res.status(409).json({ status: "error", message: "Building already exists" });

    // INSERT operation
    const result = await pool.query(
      "INSERT INTO buildings (name) VALUES ($1) RETURNING *",
      [name]
    );

    res.status(201).json({ status: "success", message: "Building created", data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

// UPDATE building
export const updateBuilding = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  // Check if building name isn't picked
  if (!name)
    return res.status(400).json({ status: "error", message: "Building name is required" });

  try {
    // Validate building ID
    const exists = await pool.query("SELECT name FROM buildings WHERE id = $1", [id]);
    if (exists.rows.length === 0)
      return res.status(404).json({ status: "error", message: "Building not found" });

    // UPDATE operation
    await pool.query("UPDATE buildings SET name = $1 WHERE id = $2", [name, id]);
    res.json({ status: "success", message: "Building updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

// DELETE building
export const deleteBuilding = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query("DELETE FROM buildings WHERE id = $1 RETURNING *", [id]);
    if (result.rows.length === 0)
      return res.status(404).json({ status: "error", message: "Building not found" });

    res.json({ status: "success", message: "Building deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};
