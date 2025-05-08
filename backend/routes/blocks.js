const express = require("express")
const router = express.Router()
const { poolPromise, sql } = require("../config/db")

// Get block by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params

    const pool = await poolPromise
    const result = await pool.request().input("block_id", sql.Int, id).execute("sp_GetBlockById")

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "Block not found" })
    }

    res.json(result.recordset[0])
  } catch (err) {
    console.error("Error fetching block:", err)
    res.status(500).json({ error: "Failed to fetch block", details: err.message })
  }
})

// Create block
router.post("/", async (req, res) => {
  try {
    const { committee_id, name, stance } = req.body

    const pool = await poolPromise
    const result = await pool
      .request()
      .input("committee_id", sql.Int, committee_id)
      .input("name", sql.NVarChar, name)
      .input("stance", sql.Text, stance)
      .output("block_id", sql.Int)
      .execute("sp_CreateBlock")

    const blockId = result.output.block_id

    res.status(201).json({
      message: "Block created successfully",
      block_id: blockId,
    })
  } catch (err) {
    console.error("Error creating block:", err)
    res.status(500).json({ error: "Failed to create block", details: err.message })
  }
})

// Update block
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params
    const { name, stance } = req.body

    const pool = await poolPromise
    const result = await pool
      .request()
      .input("block_id", sql.Int, id)
      .input("name", sql.NVarChar, name)
      .input("stance", sql.Text, stance)
      .execute("sp_UpdateBlock")

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "Block not found" })
    }

    res.json({
      message: "Block updated successfully",
      block: result.recordset[0],
    })
  } catch (err) {
    console.error("Error updating block:", err)
    res.status(500).json({ error: "Failed to update block", details: err.message })
  }
})

// Delete block
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params

    const pool = await poolPromise
    await pool.request().input("block_id", sql.Int, id).execute("sp_DeleteBlock")

    res.json({ message: "Block deleted successfully" })
  } catch (err) {
    console.error("Error deleting block:", err)
    res.status(500).json({ error: "Failed to delete block", details: err.message })
  }
})

// Assign delegate to block
router.post("/assign", async (req, res) => {
  try {
    const { assignment_id, block_id } = req.body

    const pool = await poolPromise
    await pool
      .request()
      .input("AssignmentId", sql.Int, assignment_id)
      .input("BlockId", sql.Int, block_id)
      .execute("sp_AssignDelegateToBlock")

    res.status(201).json({ message: "Delegate assigned to block successfully" })
  } catch (err) {
    console.error("Error assigning delegate to block:", err)
    res.status(500).json({ error: "Failed to assign delegate to block", details: err.message })
  }
})

module.exports = router
