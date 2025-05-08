const express = require("express")
const router = express.Router()
const { poolPromise, sql } = require("../config/db")

// Get admin by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params

    const pool = await poolPromise
    const result = await pool.request().input("user_id", sql.Int, id).execute("sp_GetAdminById")

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "Admin not found" })
    }

    res.json(result.recordset[0])
  } catch (err) {
    console.error("Error fetching admin:", err)
    res.status(500).json({ error: "Failed to fetch admin", details: err.message })
  }
})

// Update admin
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params
    const { admin_level, contact_number } = req.body

    const pool = await poolPromise
    await pool
      .request()
      .input("user_id", sql.Int, id)
      .input("admin_level", sql.NVarChar, admin_level)
      .input("contact_number", sql.NVarChar, contact_number)
      .execute("sp_UpdateAdmin")

    // Get updated admin data
    const result = await pool.request().input("user_id", sql.Int, id).execute("sp_GetAdminById")

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "Admin not found" })
    }

    res.json({
      message: "Admin updated successfully",
      admin: result.recordset[0],
    })
  } catch (err) {
    console.error("Error updating admin:", err)
    res.status(500).json({ error: "Failed to update admin", details: err.message })
  }
})

// Get system stats
router.get("/stats", async (req, res) => {
  try {
    const pool = await poolPromise

    // Get counts from various tables
    const [usersResult, delegatesResult, chairsResult, committeesResult, countriesResult] = await Promise.all([
      pool.request().query("SELECT COUNT(*) AS count FROM Users"),
      pool.request().query("SELECT COUNT(*) AS count FROM Delegates"),
      pool.request().query("SELECT COUNT(*) AS count FROM Chairs"),
      pool.request().query("SELECT COUNT(*) AS count FROM Committees"),
      pool.request().query("SELECT COUNT(*) AS count FROM Countries"),
    ])

    res.json({
      totalUsers: usersResult.recordset[0].count,
      totalDelegates: delegatesResult.recordset[0].count,
      totalChairs: chairsResult.recordset[0].count,
      totalCommittees: committeesResult.recordset[0].count,
      totalCountries: countriesResult.recordset[0].count,
    })
  } catch (err) {
    console.error("Error fetching system stats:", err)
    res.status(500).json({ error: "Failed to fetch system stats", details: err.message })
  }
})

// Assign delegate to committee
router.post("/assign-delegate", async (req, res) => {
  try {
    const { delegate_id, committee_id, country_id, block_id, conference_year } = req.body

    const pool = await poolPromise
    await pool
      .request()
      .input("DelegateId", sql.Int, delegate_id)
      .input("CommitteeId", sql.Int, committee_id)
      .input("CountryId", sql.Int, country_id)
      .input("BlockId", sql.Int, block_id || null)
      .input("ConferenceYear", sql.Int, conference_year || null)
      .execute("sp_AssignDelegateToCommittee")

    res.status(201).json({ message: "Delegate assigned to committee successfully" })
  } catch (err) {
    console.error("Error assigning delegate to committee:", err)
    res.status(500).json({ error: "Failed to assign delegate to committee", details: err.message })
  }
})

// Assign chair to committee
router.post("/assign-chair", async (req, res) => {
  try {
    const { chair_id, committee_id } = req.body

    const pool = await poolPromise
    await pool
      .request()
      .input("chair_id", sql.Int, chair_id)
      .input("committee_id", sql.Int, committee_id)
      .execute("sp_AssignChairToCommittee")

    res.status(201).json({ message: "Chair assigned to committee successfully" })
  } catch (err) {
    console.error("Error assigning chair to committee:", err)
    res.status(500).json({ error: "Failed to assign chair to committee", details: err.message })
  }
})

// Calculate overall scores
router.post("/calculate-scores", async (req, res) => {
  try {
    const { committee_id } = req.body

    const pool = await poolPromise
    const result = await pool
      .request()
      .input("committee_id", sql.Int, committee_id || null)
      .execute("sp_CalculateOverallScores")

    res.json({
      message: "Overall scores calculated successfully",
      scores: result.recordset,
    })
  } catch (err) {
    console.error("Error calculating overall scores:", err)
    res.status(500).json({ error: "Failed to calculate overall scores", details: err.message })
  }
})

// Generate awards
router.post("/generate-awards", async (req, res) => {
  try {
    const { committee_id, top_delegates } = req.body

    const pool = await poolPromise
    const result = await pool
      .request()
      .input("committee_id", sql.Int, committee_id)
      .input("top_delegates", sql.Int, top_delegates || 3)
      .execute("sp_GenerateAwards")

    res.json({
      message: "Awards generated successfully",
      awards: result.recordset,
    })
  } catch (err) {
    console.error("Error generating awards:", err)
    res.status(500).json({ error: "Failed to generate awards", details: err.message })
  }
})

// Allocate countries by experience
router.post("/allocate-countries", async (req, res) => {
  try {
    const { committee_id } = req.body

    const pool = await poolPromise
    const result = await pool
      .request()
      .input("CommitteeId", sql.Int, committee_id)
      .execute("dbo.AllocateCountriesByExperience")

    res.json({
      message: "Countries allocated successfully",
      allocations: result.recordset,
    })
  } catch (err) {
    console.error("Error allocating countries:", err)
    res.status(500).json({ error: "Failed to allocate countries", details: err.message })
  }
})

module.exports = router
