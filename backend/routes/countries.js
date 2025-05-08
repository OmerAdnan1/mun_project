const express = require("express")
const router = express.Router()
const { poolPromise, sql } = require("../config/db")

// Get all countries
router.get("/", async (req, res) => {
  try {
    const { importance_min, importance_max, search_term } = req.query

    const pool = await poolPromise
    const result = await pool
      .request()
      .input("importance_min", sql.Int, importance_min || null)
      .input("importance_max", sql.Int, importance_max || null)
      .input("search_term", sql.NVarChar, search_term || null)
      .execute("sp_GetAllCountries")

    res.json(result.recordset)
  } catch (err) {
    console.error("Error fetching countries:", err)
    res.status(500).json({ error: "Failed to fetch countries", details: err.message })
  }
})

// Get country by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params

    const pool = await poolPromise
    const result = await pool.request().input("country_id", sql.Int, id).execute("sp_GetCountryById")

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "Country not found" })
    }

    res.json(result.recordset[0])
  } catch (err) {
    console.error("Error fetching country:", err)
    res.status(500).json({ error: "Failed to fetch country", details: err.message })
  }
})

// Create country
router.post("/", async (req, res) => {
  try {
    const { name, flag_url, description, importance } = req.body

    const pool = await poolPromise
    const result = await pool
      .request()
      .input("name", sql.NVarChar, name)
      .input("flag_url", sql.NVarChar, flag_url)
      .input("description", sql.Text, description)
      .input("importance", sql.Int, importance || 1)
      .output("country_id", sql.Int)
      .execute("sp_CreateCountry")

    const countryId = result.output.country_id

    res.status(201).json({
      message: "Country created successfully",
      country_id: countryId,
    })
  } catch (err) {
    console.error("Error creating country:", err)
    res.status(500).json({ error: "Failed to create country", details: err.message })
  }
})

// Update country
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params
    const { name, flag_url, description, importance } = req.body

    const pool = await poolPromise
    const result = await pool
      .request()
      .input("country_id", sql.Int, id)
      .input("name", sql.NVarChar, name)
      .input("flag_url", sql.NVarChar, flag_url)
      .input("description", sql.Text, description)
      .input("importance", sql.Int, importance)
      .execute("sp_UpdateCountry")

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "Country not found" })
    }

    res.json({
      message: "Country updated successfully",
      country: result.recordset[0],
    })
  } catch (err) {
    console.error("Error updating country:", err)
    res.status(500).json({ error: "Failed to update country", details: err.message })
  }
})

// Delete country
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params

    const pool = await poolPromise
    await pool.request().input("country_id", sql.Int, id).execute("sp_DeleteCountry")

    res.json({ message: "Country deleted successfully" })
  } catch (err) {
    console.error("Error deleting country:", err)
    res.status(500).json({ error: "Failed to delete country", details: err.message })
  }
})

// Populate countries
router.post("/populate", async (req, res) => {
  try {
    const pool = await poolPromise
    await pool.request().execute("dbo.PopulateCountries")

    res.json({ message: "Countries populated successfully" })
  } catch (err) {
    console.error("Error populating countries:", err)
    res.status(500).json({ error: "Failed to populate countries", details: err.message })
  }
})

module.exports = router
