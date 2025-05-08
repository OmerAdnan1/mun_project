const express = require("express")
const router = express.Router()
const { poolPromise, sql } = require("../config/db")

// Get document by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params

    const pool = await poolPromise
    const result = await pool.request().input("document_id", sql.Int, id).execute("sp_GetDocumentById")

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "Document not found" })
    }

    res.json(result.recordset[0])
  } catch (err) {
    console.error("Error fetching document:", err)
    res.status(500).json({ error: "Failed to fetch document", details: err.message })
  }
})

// Create document
router.post("/", async (req, res) => {
  try {
    const { title, type, content, file_url, delegate_id, block_id, requires_voting, status, due_date } = req.body

    const pool = await poolPromise
    const result = await pool
      .request()
      .input("title", sql.NVarChar, title)
      .input("type", sql.NVarChar, type)
      .input("content", sql.Text, content)
      .input("file_url", sql.NVarChar, file_url)
      .input("delegate_id", sql.Int, delegate_id)
      .input("block_id", sql.Int, block_id || null)
      .input("requires_voting", sql.Bit, requires_voting !== undefined ? requires_voting : 1)
      .input("status", sql.NVarChar, status || "draft")
      .input("due_date", sql.DateTime, due_date ? new Date(due_date) : new Date())
      .output("document_id", sql.Int)
      .execute("sp_CreateDocument")

    const documentId = result.output.document_id

    res.status(201).json({
      message: "Document created successfully",
      document_id: documentId,
    })
  } catch (err) {
    console.error("Error creating document:", err)
    res.status(500).json({ error: "Failed to create document", details: err.message })
  }
})

// Update document
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params
    const { title, content, file_url, block_id, requires_voting, status } = req.body

    const pool = await poolPromise
    await pool
      .request()
      .input("document_id", sql.Int, id)
      .input("title", sql.NVarChar, title)
      .input("content", sql.Text, content)
      .input("file_url", sql.NVarChar, file_url)
      .input("block_id", sql.Int, block_id)
      .input("requires_voting", sql.Bit, requires_voting)
      .input("status", sql.NVarChar, status)
      .execute("sp_UpdateDocument")

    res.json({ message: "Document updated successfully" })
  } catch (err) {
    console.error("Error updating document:", err)
    res.status(500).json({ error: "Failed to update document", details: err.message })
  }
})

// Delete document
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params

    const pool = await poolPromise
    await pool.request().input("document_id", sql.Int, id).execute("sp_DeleteDocument")

    res.json({ message: "Document deleted successfully" })
  } catch (err) {
    console.error("Error deleting document:", err)
    res.status(500).json({ error: "Failed to delete document", details: err.message })
  }
})

// Vote on document
router.post("/:id/vote", async (req, res) => {
  try {
    const { id } = req.params
    const { delegate_id, vote, notes } = req.body

    const pool = await poolPromise
    await pool
      .request()
      .input("delegate_id", sql.Int, delegate_id)
      .input("document_id", sql.Int, id)
      .input("vote", sql.NVarChar, vote)
      .input("notes", sql.Text, notes)
      .execute("sp_RecordVote")

    res.status(201).json({ message: "Vote recorded successfully" })
  } catch (err) {
    console.error("Error recording vote:", err)
    res.status(500).json({ error: "Failed to record vote", details: err.message })
  }
})

// Get votes for a document
router.get("/:id/votes", async (req, res) => {
  try {
    const { id } = req.params

    const pool = await poolPromise
    const result = await pool.request().input("document_id", sql.Int, id).execute("sp_GetVotesByDocument")

    res.json(result.recordset)
  } catch (err) {
    console.error("Error fetching document votes:", err)
    res.status(500).json({ error: "Failed to fetch document votes", details: err.message })
  }
})

module.exports = router
