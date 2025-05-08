const express = require("express")
const router = express.Router()
const { poolPromise, sql } = require("../config/db")

// Get all committees
router.get("/", async (req, res) => {
  try {
    const { difficulty, chair_id, search_term } = req.query

    const pool = await poolPromise
    const result = await pool
      .request()
      .input("difficulty", sql.NVarChar, difficulty || null)
      .input("chair_id", sql.Int, chair_id || null)
      .input("search_term", sql.NVarChar, search_term || null)
      .execute("sp_GetAllCommittees")

    res.json(result.recordset)
  } catch (err) {
    console.error("Error fetching committees:", err)
    res.status(500).json({ error: "Failed to fetch committees", details: err.message })
  }
})

// Get committee by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params

    const pool = await poolPromise
    const result = await pool.request().input("committee_id", sql.Int, id).execute("sp_GetCommitteeById")

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "Committee not found" })
    }

    res.json(result.recordset[0])
  } catch (err) {
    console.error("Error fetching committee:", err)
    res.status(500).json({ error: "Failed to fetch committee", details: err.message })
  }
})

// Create committee
router.post("/", async (req, res) => {
  try {
    const { name, description, topic, difficulty, capacity, location, start_date, end_date, chair_id } = req.body

    const pool = await poolPromise
    const result = await pool
      .request()
      .input("name", sql.NVarChar, name)
      .input("description", sql.Text, description)
      .input("topic", sql.NVarChar, topic)
      .input("difficulty", sql.NVarChar, difficulty || "intermediate")
      .input("capacity", sql.Int, capacity)
      .input("location", sql.NVarChar, location)
      .input("start_date", sql.Date, start_date ? new Date(start_date) : null)
      .input("end_date", sql.Date, end_date ? new Date(end_date) : null)
      .input("chair_id", sql.Int, chair_id)
      .output("committee_id", sql.Int)
      .execute("sp_CreateCommittee")

    const committeeId = result.output.committee_id

    res.status(201).json({
      message: "Committee created successfully",
      committee_id: committeeId,
    })
  } catch (err) {
    console.error("Error creating committee:", err)
    res.status(500).json({ error: "Failed to create committee", details: err.message })
  }
})

// Update committee
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params
    const { name, description, topic, difficulty, capacity, location, start_date, end_date, chair_id } = req.body

    const pool = await poolPromise
    const result = await pool
      .request()
      .input("committee_id", sql.Int, id)
      .input("name", sql.NVarChar, name)
      .input("description", sql.Text, description)
      .input("topic", sql.NVarChar, topic)
      .input("difficulty", sql.NVarChar, difficulty)
      .input("capacity", sql.Int, capacity)
      .input("location", sql.NVarChar, location)
      .input("start_date", sql.Date, start_date ? new Date(start_date) : null)
      .input("end_date", sql.Date, end_date ? new Date(end_date) : null)
      .input("chair_id", sql.Int, chair_id)
      .execute("sp_UpdateCommittee")

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "Committee not found" })
    }

    res.json({
      message: "Committee updated successfully",
      committee: result.recordset[0],
    })
  } catch (err) {
    console.error("Error updating committee:", err)
    res.status(500).json({ error: "Failed to update committee", details: err.message })
  }
})

// Delete committee
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params

    const pool = await poolPromise
    await pool.request().input("committee_id", sql.Int, id).execute("sp_DeleteCommittee")

    res.json({ message: "Committee deleted successfully" })
  } catch (err) {
    console.error("Error deleting committee:", err)
    res.status(500).json({ error: "Failed to delete committee", details: err.message })
  }
})

// Get committee delegates
router.get("/:id/delegates", async (req, res) => {
  try {
    const { id } = req.params

    const pool = await poolPromise
    const result = await pool.request().query(`
        SELECT da.*, u.full_name AS delegate_name, u.email AS delegate_email,
               d.experience_level, c.name AS country_name, b.name AS block_name
        FROM DelegateAssignments da
        JOIN Users u ON da.delegate_id = u.user_id
        JOIN Delegates d ON u.user_id = d.user_id
        JOIN Countries c ON da.country_id = c.country_id
        LEFT JOIN Blocks b ON da.block_id = b.block_id
        WHERE da.committee_id = ${id}
      `)

    res.json(result.recordset)
  } catch (err) {
    console.error("Error fetching committee delegates:", err)
    res.status(500).json({ error: "Failed to fetch committee delegates", details: err.message })
  }
})

// Get committee documents
router.get("/:id/documents", async (req, res) => {
  try {
    const { id } = req.params
    const { type, status } = req.query

    const pool = await poolPromise
    const result = await pool
      .request()
      .input("committee_id", sql.Int, id)
      .input("type", sql.NVarChar, type || null)
      .input("status", sql.NVarChar, status || null)
      .execute("sp_GetDocumentsByCommittee")

    res.json(result.recordset)
  } catch (err) {
    console.error("Error fetching committee documents:", err)
    res.status(500).json({ error: "Failed to fetch committee documents", details: err.message })
  }
})

// Get committee events
router.get("/:id/events", async (req, res) => {
  try {
    const { id } = req.params
    const { type, status, start_date, end_date } = req.query

    const pool = await poolPromise
    const result = await pool
      .request()
      .input("committee_id", sql.Int, id)
      .input("type", sql.NVarChar, type || null)
      .input("status", sql.NVarChar, status || null)
      .input("start_date", sql.Date, start_date ? new Date(start_date) : null)
      .input("end_date", sql.Date, end_date ? new Date(end_date) : null)
      .execute("sp_GetEventsByCommittee")

    res.json(result.recordset)
  } catch (err) {
    console.error("Error fetching committee events:", err)
    res.status(500).json({ error: "Failed to fetch committee events", details: err.message })
  }
})

// Get committee blocks
router.get("/:id/blocks", async (req, res) => {
  try {
    const { id } = req.params

    const pool = await poolPromise
    const result = await pool.request().input("committee_id", sql.Int, id).execute("sp_GetBlocksByCommittee")

    res.json(result.recordset)
  } catch (err) {
    console.error("Error fetching committee blocks:", err)
    res.status(500).json({ error: "Failed to fetch committee blocks", details: err.message })
  }
})

module.exports = router
