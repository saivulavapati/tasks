#!/bin/bash

#Config
NODE_FILE="insertEmails.js"
EXCEL_FILE=${1:-"data.xlsx"}

echo "Extracting emails from $EXCEL_FILE and inserting into MySQL..."
node "$NODE_FILE" "$EXCEL_FILE"
