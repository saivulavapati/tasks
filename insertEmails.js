// insertEmails.js
const { extractEmails } = require("./extractEmails");
const mysql = require("mysql2/promise");

// ---- Config ----
const DB = {
  host: "localhost",
  user: "root",
  password: "root@123",
  database: "va_db",
};
const TABLE = "emails";
const BATCH_SIZE = 500;

// ---- Get Excel file from command line argument ----
const EXCEL_FILE = process.argv[2] || "data.xlsx";


(async () => {
  try {
    //Extract emails from Excel
    let emails = extractEmails(EXCEL_FILE);

    if (emails.length === 0) {
      console.log("No valid emails found in Excel.");
      process.exit(0);
    }

    //Connect to MySQL
    const conn = await mysql.createConnection(DB);
    console.log(`Found ${emails.length} valid emails. Inserting into MySQL...`);

    //Batch insert
    for (let i = 0; i < emails.length; i += BATCH_SIZE) {
      const batch = emails.slice(i, i + BATCH_SIZE);
      const placeholders = batch.map(() => "(?)").join(",");
      await conn.execute(
        `INSERT IGNORE INTO \`${TABLE}\` (email) VALUES ${placeholders}`,
        batch
      );
      console.log(`Inserted batch ${Math.floor(i / BATCH_SIZE) + 1} (${batch.length} emails)`);
    }

    await conn.end();
    console.log("All emails inserted successfully.");

  } catch (err) {
    console.error("Error inserting emails:", err.message);
    process.exit(1);
  }
})();
