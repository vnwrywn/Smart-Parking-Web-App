import pool from "../db/db.js";

// GET all slots (optional ?lot_id)
export const getSlots = async (req, res) => {
  const { lot_id } = req.query;

  try {
    const query = `
      SELECT id, lot_id, x, y, occupancy_status FROM slots
      ${lot_id ? "WHERE slots.lot_id = $1" : ""}
      ORDER BY lot_id ASC, y DESC, x ASC
    `;

    const params = lot_id ? [lot_id] : [];
    const result = await pool.query(query, params);

    res.json({ status: "success", data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

// GET all slots' availability
export const getAvailability = async (req, res) => {
  try {
    // Counts all available slots
    const query1 = `
      SELECT lot_id, COUNT(id) FROM slots
      WHERE occupancy_status = 'AVAILABLE'
      GROUP BY lot_id
    `;
    // Counts all slots
    const query2 = `
      SELECT lot_id, COUNT(id) FROM slots
      GROUP BY lot_id
    `;

    const result1 = await pool.query(query1);
    const result2 = await pool.query(query2);
    const result = {
      res1: result1.rows,
      res2: result2.rows
    }

    res.json({ status: "success", data: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

// GET one slot
export const getSlotById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(`
      SELECT slots.*, parking_lots.floor_name, buildings.name AS building_name
      FROM slots
      JOIN parking_lots ON slots.lot_id = parking_lots.id
      JOIN buildings ON parking_lots.building_id = buildings.id
      WHERE slots.id = $1
    `, [id]);

    if (result.rows.length === 0)
      return res.status(404).json({ status: "error", message: "Slot not found" });

    res.json({ status: "success", data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

// CREATE slot
export const createSlot = async (req, res) => {
  const { lot_id, x, y } = req.body;
  // Check inputs
  if (!lot_id || x === undefined || y === undefined)
    return res.status(400).json({ status: "error", message: "Lot ID and coordinates are required" });

  try {
    // Check if lot exists
    const lot = await pool.query("SELECT id FROM parking_lots WHERE id = $1", [lot_id]);
    if (lot.rows.length === 0)
      return res.status(404).json({ status: "error", message: "Parking lot not found" });

    // INSERT operation
    const result = await pool.query(
      `INSERT INTO slots (lot_id, x, y, occupancy_status)
      VALUES ($1, $2, $3, 'AVAILABLE')
      RETURNING *`,
      [lot_id, x, y]
    );

    res.status(201).json({ status: "success", message: "Slot created", data: result.rows[0] });
  } catch (err) {
    if (err.code === "23505") { // unique_violation
      return res.status(409).json({ status: "error", message: "Slot coordinate already exists in this lot" });
    }
    console.error(err);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

// UPDATE slot info
export const updateSlot = async (req, res) => {
  const { id } = req.params;
  const { x, y, lot_id } = req.body;
  // Check inputs
  if ((x === undefined && y !== undefined) || x !== undefined && y === undefined)
    return res.status(400).json({ status: "error", message: "Either define both x & y or neither." });

  try {
    const exists = await pool.query("SELECT id FROM slots WHERE id = $1", [id]);
    if (exists.rows.length === 0)
      return res.status(404).json({ status: "error", message: "Slot not found" });

    await pool.query(
      `UPDATE slots
       SET x = COALESCE($1, x),
           y = COALESCE($2, y),
           lot_id = COALESCE($3, lot_id),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $4`,
      [x, y, lot_id, id]
    );

    res.json({ status: "success", message: "Slot updated" });
  } catch (err) {
    if (err.code === "23505")
      return res.status(409).json({ status: "error", message: "Slot coordinate already exists in this lot" });

    console.error(err);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

// TOGGLE occupancy
export const toggleSlot = async (req, res) => {
  const { id } = req.params;

  try {
    const slot = await pool.query("SELECT occupancy_status FROM slots WHERE id = $1", [id]);
    if (slot.rows.length === 0)
      return res.status(404).json({ status: "error", message: "Slot not found" });

    const newStatus = slot.rows[0].occupancy_status === "AVAILABLE" ? "OCCUPIED" : "AVAILABLE";

    await pool.query(
      "UPDATE slots SET occupancy_status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2",
      [newStatus, id]
    );

    res.json({
      status: "success",
      message: `Slot status changed to ${newStatus}`,
      data: { id, occupancy_status: newStatus }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

// DELETE slot
export const deleteSlot = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query("DELETE FROM slots WHERE id = $1 RETURNING *", [id]);
    if (result.rows.length === 0)
      return res.status(404).json({ status: "error", message: "Slot not found" });

    res.json({ status: "success", message: "Slot deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};
