const mysql = require("mysql2");
require("dotenv").config();
const fs = require("fs");
const path = require("path");

// Read the schema file
let schema = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8");
schema = schema.replace(/\${DATABASE_NAME}/g, process.env.MYSQL_DATABASE);

// Create connection
pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  port: process.env.MYSQL_PORT,
  connectionLimit: 10,
});

// Execute schema
pool.getConnection((err, connection) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    process.exit(1);
  }

  console.log("Successfully connected to the database");

  // Split the schema into individual statements
  const statements = schema
    .split(";")
    .map((statement) => statement.trim())
    .filter((statement) => statement.length > 0);

  // Execute each statement sequentially
  let executedStatements = 0;

  const executeNextStatement = () => {
    if (executedStatements >= statements.length) {
      console.log("All tables created successfully!");
      connection.release();
      process.exit(0);
      return;
    }

    const statement = statements[executedStatements];
    connection.query(statement, (error) => {
      if (error) {
        console.error("Error executing statement:", error);
        connection.release();
        process.exit(1);
      }
      console.log(
        `Executed statement ${executedStatements + 1} of ${statements.length}`,
      );
      executedStatements++;
      executeNextStatement();
    });
  };

  executeNextStatement();
});
