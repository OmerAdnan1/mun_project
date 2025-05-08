const express = require("express")
const router = express.Router()
const { poolPromise, sql } = require("../config/db")

// Get event by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params

    const pool = await poolPromise
    const result = await pool.request().input("event_id", sql.Int, id).execute("sp_GetEventById")

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "Event not found" })
    }

    res.json(result.recordset[0])
  } catch (err) {
    console.error("Error fetching event:", err)
    res.status(500).json({ error: "Failed to fetch event", details: err.message })
  }
})

// Create event
router.post("/", async (req, res) => {
  try {
    const {
      committee_id,
      type,
      proposed_by,
      description,
      start_time,
      end_time,
      status,
      duration_minutes,
      topic,
      notes,
    } = req.body

    const pool = await poolPromise
    const result = await pool
      .request()
      .input("committee_id", sql.Int, committee_id)
      .input("type", sql.NVarChar, type)
      .input("proposed_by", sql.Int, proposed_by)
      .input("description", sql.Text, description)
      .input("start_time", sql.DateTime, start_time ? new Date(start_time) : null)
      .input("end_time", sql.DateTime, end_time ? new Date(end_time) : null)
      .input("status", sql.NVarChar, status || "pending")
      .input("duration_minutes", sql.Int, duration_minutes)
      .input("topic", sql.NVarChar, topic)
      .input("notes", sql.Text, notes)
      .output("event_id", sql.Int)
      .execute("sp_CreateEvent")

    const eventId = result.output.event_id

    res.status(201).json({
      message: "Event created successfully",
      event_id: eventId,
    })
  } catch (err) {
    console.error("Error creating event:", err)
    res.status(500).json({ error: "Failed to create event", details: err.message })
  }
})

// Update event
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params
    const { description, start_time, end_time, status, duration_minutes, topic, notes } = req.body

    const pool = await poolPromise
    await pool
      .request()
      .input("event_id", sql.Int, id)
      .input("description", sql.Text, description)
      .input("start_time", sql.DateTime, start_time ? new Date(start_time) : null)
      .input("end_time", sql.DateTime, end_time ? new Date(end_time) : null)
      .input("status", sql.NVarChar, status)
      .input("duration_minutes", sql.Int, duration_minutes)
      .input("topic", sql.NVarChar, topic)
      .input("notes", sql.Text, notes)
      .execute("sp_UpdateEvent")

    res.json({ message: "Event updated successfully" })
  } catch (err) {
    console.error("Error updating event:", err)
    res.status(500).json({ error: "Failed to update event", details: err.message })
  }
})

// Delete event
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params

    const pool = await poolPromise
    await pool.request().input("event_id", sql.Int, id).execute("sp_DeleteEvent")

    res.json({ message: "Event deleted successfully" })
  } catch (err) {
    console.error("Error deleting event:", err)
    res.status(500).json({ error: "Failed to delete event", details: err.message })
  }
})

// Vote on event
router.post("/:id/vote", async (req, res) => {
  try {
    const { id } = req.params
    const { delegate_id, vote, notes } = req.body

    const pool = await poolPromise
    await pool
      .request()
      .input("delegate_id", sql.Int, delegate_id)
      .input("event_id", sql.Int, id)
      .input("vote", sql.NVarChar, vote)
      .input("notes", sql.Text, notes)
      .execute("sp_RecordVote")

    res.status(201).json({ message: "Vote recorded successfully" })
  } catch (err) {
    console.error("Error recording vote:", err)
    res.status(500).json({ error: "Failed to record vote", details: err.message })
  }
})

// Get votes for an event
router.get("/:id/votes", async (req, res) => {
  try {
    const { id } = req.params

    const pool = await poolPromise
    const result = await pool.request().input("event_id", sql.Int, id).execute("sp_GetVotesByEvent")

    res.json(result.recordset)
  } catch (err) {
    console.error("Error fetching event votes:", err)
    res.status(500).json({ error: "Failed to fetch event votes", details: err.message })
  }
})

module.exports = router
