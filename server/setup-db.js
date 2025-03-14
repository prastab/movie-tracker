const mysql = require('mysql2');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

// Read the schema file
const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');

// Create connection pool
const connection = mysql.createConnection(process.env.MYSQL_PUBLIC_URL);
pool = mysql.createPool(process.env.MYSQL_PUBLIC_URL);

// Execute schema
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    process.exit(1);
  }

  console.log('Successfully connected to the database');

  // Split the schema into individual statements
  const statements = schema
    .split(';')
    .map(statement => statement.trim())
    .filter(statement => statement.length > 0);

  // Execute each statement sequentially
  let executedStatements = 0;

  const executeNextStatement = () => {
    if (executedStatements >= statements.length) {
      console.log('All tables created successfully!');
      connection.release();
      process.exit(0);
      return;
    }

    const statement = statements[executedStatements];
    connection.query(statement, (error) => {
      if (error) {
        console.error('Error executing statement:', error);
        connection.release();
        process.exit(1);
      }
      console.log(`Executed statement ${executedStatements + 1} of ${statements.length}`);
      executedStatements++;
      executeNextStatement();
    });
  };

  executeNextStatement();
});