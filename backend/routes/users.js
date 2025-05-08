const express = require("express")
const router = express.Router()
const { poolPromise, sql } = require("../config/db")
const bcrypt = require("bcryptjs")

// Register a new user
router.post("/register", async (req, res) => {
  try {
    const { full_name, email, password, role, phone, experience_level, emergency_contact } = req.body

    // Check if user already exists
    const pool = await poolPromise
    const checkUser = await pool
      .request()
      .input("email", sql.NVarChar, email)
      .query("SELECT * FROM Users WHERE email = @email")

    if (checkUser.recordset.length > 0) {
      return res.status(400).json({ error: "User with this email already exists" })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user transaction
    const transaction = new sql.Transaction(pool)

    try {
      await transaction.begin()

      // Insert user
      const userResult = await transaction
        .request()
        .input("full_name", sql.NVarChar, full_name)
        .input("email", sql.NVarChar, email)
        .input("password", sql.NVarChar, hashedPassword)
        .input("role", sql.NVarChar, role)
        .input("phone", sql.NVarChar, phone)
        .output("user_id", sql.Int)
        .execute("sp_CreateUser")

      const userId = userResult.output.user_id

      // If role is delegate, update delegate-specific fields
      if (role === "delegate" && userId) {
        await transaction
          .request()
          .input("delegate_id", sql.Int, userId)
          .input("experience_level", sql.NVarChar, experience_level)
          .input("emergency_contact", sql.NVarChar, emergency_contact)
          .execute("sp_UpdateDelegate")
      }

      await transaction.commit()
      res.status(201).json({ message: "User registered successfully", user_id: userId })
    } catch (err) {
      await transaction.rollback()
      throw err
    }
  } catch (err) {
    console.error("Registration error:", err)
    res.status(500).json({ error: "Registration failed", details: err.message })
  }
})

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    // Get user by email
    const pool = await poolPromise
    const result = await pool.request().input("email", sql.NVarChar, email).execute("sp_GetUserByEmail")

    if (result.recordset.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" })
    }

    const user = result.recordset[0]

    // Direct string comparison instead of bcrypt
    if (password !== user.password) {
      return res.status(401).json({ error: "Invalid email or password" })
    }

    // Update last login time
    await pool.request().query(`UPDATE Users SET last_login = GETDATE() WHERE user_id = ${user.user_id}`)

    // Remove password from response
    delete user.password

    res.json({ message: "Login successful", user })
  } catch (err) {
    console.error("Login error:", err)
    res.status(500).json({ error: "Login failed", details: err.message })
  }
})

// Get user by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params

    const pool = await poolPromise
    const result = await pool.request().input("user_id", sql.Int, id).execute("sp_GetUserById")

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "User not found" })
    }

    const user = result.recordset[0]
    delete user.password

    res.json(user)
  } catch (err) {
    console.error("Error fetching user:", err)
    res.status(500).json({ error: "Failed to fetch user", details: err.message })
  }
})

// Update user
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params
    const { full_name, email, password, phone } = req.body

    let hashedPassword = null
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10)
    }

    const pool = await poolPromise
    const result = await pool
      .request()
      .input("user_id", sql.Int, id)
      .input("email", sql.NVarChar, email)
      .input("password", sql.NVarChar, hashedPassword)
      .input("full_name", sql.NVarChar, full_name)
      .input("phone", sql.NVarChar, phone)
      .execute("sp_UpdateUser")

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "User not found" })
    }

    const user = result.recordset[0]
    delete user.password

    res.json({ message: "User updated successfully", user })
  } catch (err) {
    console.error("Error updating user:", err)
    res.status(500).json({ error: "Failed to update user", details: err.message })
  }
})

// Delete user
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params

    const pool = await poolPromise
    await pool.request().input("user_id", sql.Int, id).input("hard_delete", sql.Bit, 1).execute("sp_DeleteUser")

    res.json({ message: "User deleted successfully" })
  } catch (err) {
    console.error("Error deleting user:", err)
    res.status(500).json({ error: "Failed to delete user", details: err.message })
  }
})

module.exports = router
