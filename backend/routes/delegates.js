const express = require("express")
const router = express.Router()
const { poolPromise, sql } = require("../config/db")

// Get delegate by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params

    const pool = await poolPromise
    const result = await pool.request().input("delegate_id", sql.Int, id).execute("sp_GetDelegateById")

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "Delegate not found" })
    }

    res.json(result.recordset[0])
  } catch (err) {
    console.error("Error fetching delegate:", err)
    res.status(500).json({ error: "Failed to fetch delegate", details: err.message })
  }
})

// Update delegate
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params
    const { experience_level, emergency_contact } = req.body

    const pool = await poolPromise
    const result = await pool
      .request()
      .input("delegate_id", sql.Int, id)
      .input("experience_level", sql.NVarChar, experience_level)
      .input("emergency_contact", sql.NVarChar, emergency_contact)
      .execute("sp_UpdateDelegate")

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "Delegate not found" })
    }

    res.json(result.recordset[0])
  } catch (err) {
    console.error("Error updating delegate:", err)
    res.status(500).json({ error: "Failed to update delegate", details: err.message })
  }
})

// Get delegate's past experiences
router.get("/:id/experiences", async (req, res) => {
  try {
    const { id } = req.params

    const pool = await poolPromise
    const result = await pool.request().input("delegate_id", sql.Int, id).execute("sp_GetDelegatePastExperiences")

    res.json(result.recordset)
  } catch (err) {
    console.error("Error fetching past experiences:", err)
    res.status(500).json({ error: "Failed to fetch past experiences", details: err.message })
  }
})

// Add past experience
router.post("/:id/experiences", async (req, res) => {
  try {
    const { id } = req.params
    const { conference_name, committee, country, year, awards, description } = req.body

    const pool = await poolPromise
    const result = await pool
      .request()
      .input("user_id", sql.Int, id)
      .input("conference_name", sql.NVarChar, conference_name)
      .input("committee", sql.NVarChar, committee)
      .input("country", sql.NVarChar, country)
      .input("year", sql.Int, year)
      .input("awards", sql.NVarChar, awards)
      .input("description", sql.Text, description)
      .output("experience_id", sql.Int)
      .execute("sp_AddPastExperience")

    const experienceId = result.output.experience_id

    res.status(201).json({
      message: "Past experience added successfully",
      experience_id: experienceId,
    })
  } catch (err) {
    console.error("Error adding past experience:", err)
    res.status(500).json({ error: "Failed to add past experience", details: err.message })
  }
})

// Get delegate's committee assignments
router.get("/:id/assignments", async (req, res) => {
  try {
    const { id } = req.params

    const pool = await poolPromise
    const result = await pool.request().input("DelegateId", sql.Int, id).execute("sp_GetDelegateAssignments")

    res.json(result.recordset)
  } catch (err) {
    console.error("Error fetching assignments:", err)
    res.status(500).json({ error: "Failed to fetch assignments", details: err.message })
  }
})

// Get delegate's documents
router.get("/:id/documents", async (req, res) => {
  try {
    const { id } = req.params
    const { type, status } = req.query

    const pool = await poolPromise
    const result = await pool
      .request()
      .input("delegate_id", sql.Int, id)
      .input("type", sql.NVarChar, type || null)
      .input("status", sql.NVarChar, status || null)
      .execute("sp_GetDocumentsByDelegate")

    res.json(result.recordset)
  } catch (err) {
    console.error("Error fetching documents:", err)
    res.status(500).json({ error: "Failed to fetch documents", details: err.message })
  }
})

// Get delegate's scores
router.get("/:id/scores", async (req, res) => {
  try {
    const { id } = req.params

    const pool = await poolPromise
    const result = await pool.request().input("delegate_id", sql.Int, id).execute("sp_GetScoresByDelegate")

    res.json(result.recordset)
  } catch (err) {
    console.error("Error fetching scores:", err)
    res.status(500).json({ error: "Failed to fetch scores", details: err.message })
  }
})

// Register and assign delegate to committee
router.post("/:id/register-assign", async (req, res) => {
  try {
    const { id } = req.params
    const { committee_id } = req.body

    const pool = await poolPromise
    const result = await pool
      .request()
      .input("DelegateId", sql.Int, id)
      .input("CommitteeId", sql.Int, committee_id)
      .execute("AllocateCountryToSingleDelegate")

    res.status(201).json({
      message: "Delegate registered and assigned successfully",
      assignment: result.recordset[0]
    })
  } catch (err) {
    console.error("Error in delegate registration and assignment:", err)
    res.status(500).json({ error: "Failed to register and assign delegate", details: err.message })
  }
})

module.exports = router
