const mysql = require("mysql2");
require("dotenv").config();

// Connection settings (they come from the .env file)
const settings = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

// Online databases like TiDB Cloud need a secure connection
if (process.env.DB_SSL === "true") {
  settings.ssl = { minVersion: "TLSv1.2" };
}

const pool = mysql.createPool(settings);

module.exports = pool.promise();