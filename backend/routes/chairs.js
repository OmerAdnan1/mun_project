const express = require("express")
const router = express.Router()
const { poolPromise, sql } = require("../config/db")

// Get chair by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params

    const pool = await poolPromise
    const result = await pool.request().input("user_id", sql.Int, id).execute("sp_GetChairById")

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "Chair not found" })
    }

    res.json(result.recordset[0])
  } catch (err) {
    console.error("Error fetching chair:", err)
    res.status(500).json({ error: "Failed to fetch chair", details: err.message })
  }
})

// Update chair
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params
    const { evaluation_metrics, chairing_experience } = req.body

    const pool = await poolPromise
    await pool
      .request()
      .input("user_id", sql.Int, id)
      .input("evaluation_metrics", sql.Text, evaluation_metrics)
      .input("chairing_experience", sql.Text, chairing_experience)
      .execute("sp_UpdateChair")

    // Get updated chair data
    const result = await pool.request().input("user_id", sql.Int, id).execute("sp_GetChairById")

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "Chair not found" })
    }

    res.json({
      message: "Chair updated successfully",
      chair: result.recordset[0],
    })
  } catch (err) {
    console.error("Error updating chair:", err)
    res.status(500).json({ error: "Failed to update chair", details: err.message })
  }
})

// Get committees chaired by a specific chair
router.get("/:id/committees", async (req, res) => {
  try {
    const { id } = req.params

    const pool = await poolPromise
    const result = await pool.request().query(`
        SELECT c.*, u.full_name AS chair_name,
        (SELECT COUNT(*) FROM DelegateAssignments da WHERE da.committee_id = c.committee_id) AS delegate_count
        FROM Committees c
        JOIN Users u ON c.chair_id = u.user_id
        WHERE c.chair_id = ${id}
      `)

    res.json(result.recordset)
  } catch (err) {
    console.error("Error fetching committees:", err)
    res.status(500).json({ error: "Failed to fetch committees", details: err.message })
  }
})

// Record a score for a delegate
router.post("/scores", async (req, res) => {
  try {
    const { delegate_id, category, points, chair_id, event_id, document_id, comments } = req.body

    const pool = await poolPromise
    await pool
      .request()
      .input("delegate_id", sql.Int, delegate_id)
      .input("category", sql.NVarChar, category)
      .input("points", sql.Decimal(5, 2), points)
      .input("chair_id", sql.Int, chair_id)
      .input("event_id", sql.Int, event_id || null)
      .input("document_id", sql.Int, document_id || null)
      .input("comments", sql.Text, comments)
      .execute("sp_RecordScore")

    res.status(201).json({ message: "Score recorded successfully" })
  } catch (err) {
    console.error("Error recording score:", err)
    res.status(500).json({ error: "Failed to record score", details: err.message })
  }
})

// Change document status
router.put("/documents/:id/status", async (req, res) => {
  try {
    const { id } = req.params
    const { new_status } = req.body

    const pool = await poolPromise
    await pool
      .request()
      .input("document_id", sql.Int, id)
      .input("new_status", sql.NVarChar, new_status)
      .execute("sp_ChangeDocumentStatus")

    res.json({ message: `Document status changed to ${new_status}` })
  } catch (err) {
    console.error("Error changing document status:", err)
    res.status(500).json({ error: "Failed to change document status", details: err.message })
  }
})

// Change event status
router.put("/events/:id/status", async (req, res) => {
  try {
    const { id } = req.params
    const { new_status } = req.body

    const pool = await poolPromise
    await pool
      .request()
      .input("event_id", sql.Int, id)
      .input("new_status", sql.NVarChar, new_status)
      .execute("sp_ChangeEventStatus")

    res.json({ message: `Event status changed to ${new_status}` })
  } catch (err) {
    console.error("Error changing event status:", err)
    res.status(500).json({ error: "Failed to change event status", details: err.message })
  }
})

module.exports = router
