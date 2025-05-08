const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
require("dotenv").config()

// Import routes
const usersRoutes = require("./routes/users")
const delegatesRoutes = require("./routes/delegates")
const chairsRoutes = require("./routes/chairs")
const committeesRoutes = require("./routes/committees")
const countriesRoutes = require("./routes/countries")
const documentsRoutes = require("./routes/documents")
const eventsRoutes = require("./routes/events")
const blocksRoutes = require("./routes/blocks")
const adminRoutes = require("./routes/admin")

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())
app.use(morgan("dev"))

// Routes
app.use("/api/users", usersRoutes)
app.use("/api/delegates", delegatesRoutes)
app.use("/api/chairs", chairsRoutes)
app.use("/api/committees", committeesRoutes)
app.use("/api/countries", countriesRoutes)
app.use("/api/documents", documentsRoutes)
app.use("/api/events", eventsRoutes)
app.use("/api/blocks", blocksRoutes)
app.use("/api/admin", adminRoutes)

// Root route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the MUN Management API" })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    error: "Server error",
    message: err.message,
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
