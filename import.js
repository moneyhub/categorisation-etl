import fs from "fs"
import {parse}from "csv-parse"
import {transform} from "stream-transform"
import {Moneyhub} from "@mft/moneyhub-api-client"
import config from "./config/client.js"
import userConfig from "./config/user.js"

const moneyhub = await Moneyhub(config)

//! The account to import to
const {userId, accountId} = userConfig

//! The default category to assign
const UNCATEGORISED_CATEGORY_ID  = "std:39577c49-350f-45a4-8ec3-48ce205585fb"

//! The file to import form
const FILE_NAME = "./data/transactions.csv"

const FILE_COLUMNS = {
  DATE: "Date",
  DESCRIPTION: "Description",
  AMOUNT: "Amount",
}

//! The format of the file
const formatter = transform(async (record) => ({
  accountId,
  amount: {
    value: parseAmount(record[FILE_COLUMNS.AMOUNT]),
  },
  date: new Date(record[FILE_COLUMNS.DATE]).toISOString(),
  longDescription: record[FILE_COLUMNS.DESCRIPTION],
  categoryId: UNCATEGORISED_CATEGORY_ID,
}))

const parseAmount = (amount) => Math.round(parseFloat(amount) * 100)

const fileReader = fs.createReadStream(FILE_NAME, "utf8")

fileReader.on("end", () => console.log("File read complete"))

const parser = parse({
  columns: true,
  skip_records_with_error: true,
})

const batchSize = 50

let records = []
let importedCount = 0
let skippedCount = 0

parser.on("skip", (err) => {
  console.log("Parser skipped record", err.message)
  skippedCount++
})
parser.on("error", (err) => console.log("Parser error", err.message))

formatter.on("data", (record) => records.push(record))

formatter.on("error", (err) => console.error("Formatting error", err.message))

// Upload the transactions when the file read is complete. This could have been done in batches as went along
formatter.on("end", async () => {
  console.log(`Importing ${records.length} transactions`)
  while (records.length > 0) {
    const batch = records.splice(0, records.length > batchSize ? batchSize: records.length)

    const {data: transactions} = await moneyhub.addTransactions({
      userId,
      transactions: batch,
      params: {
        categorise: true,
      },
    })

    importedCount += transactions.length

    console.log("Batch added", {batchSize: transactions.length, importedCount, recordsRemaining: records.length})
  }

  console.log("Import complete", {importedCount})
})

fileReader.pipe(parser).pipe(formatter)
