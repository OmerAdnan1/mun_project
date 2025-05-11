const sql = require('mssql');
require('dotenv').config();

// Log environment variables to debug
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_SERVER:', process.env.DB_SERVER);
console.log('DB_DATABASE:', process.env.DB_DATABASE);

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    port: parseInt(process.env.DB_PORT),
    options: {
        encrypt: false, // For local dev, set to true if using Azure
        trustServerCertificate: true
    }
};

const connectDB = async () => {
    try {
        await sql.connect(config);
        console.log('✅ SQL Server connected successfully!');
    } catch (err) {
        console.error('❌ SQL Server connection failed:', err);
    }
};

const pool = new sql.ConnectionPool(config);
const poolConnect = pool.connect();

// ✅ Call connectDB here!
connectDB();

module.exports = {
    sql,
    poolPromise: poolConnect
};

