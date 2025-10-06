const XLSX = require("xlsx");
const fs = require("fs");

function extractEmails(filePath) {
    if(!fs.existsSync(filePath)){
        throw new Error(`file not found at ${filePath}`)
    }
    try{
        fs.accessSync(filePath,fs.constants.R_OK) //file can be accessed
        const fileBuffer = fs.readFileSync(filePath);
        if(!fileBuffer || fileBuffer.length === 0){
            throw new Error(`file is empty or could not read`)
        }
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const data = XLSX.utils.sheet_to_json(worksheet);
        const emails = data.map(row => row.email || row.Email || row.EMAIL).filter(e => e);
        const uniqueEmails = [...new Set(emails)];

        return uniqueEmails;
    }
    catch (error) {
        console.error("Error reading Excel file:", error.message);
        throw new Error(error);
  }
}

module.exports = { extractEmails };
