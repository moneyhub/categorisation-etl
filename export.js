import fs from "fs"
import {stringify}from "csv-stringify"
import {transform} from "stream-transform"
import {Moneyhub} from "@mft/moneyhub-api-client"
import config from "./config/client.js"

const moneyhub = await Moneyhub(config)

//! The account to export from
const userId = "66462c065fa89f4e954cdcce"
const accountId = "1ef08ccf-d219-411f-85e5-b35ad3fd24df"

//! The file to write to
const fileName = "./transaction rows May 2024.csv"

//! The format of the file
const formatter = transform(async (record) => ({
  Date: record.date,
  Description: record.longDescription,
  Amount: (record.amount.value / 100).toFixed(2),
  CategoryId: record.categoryId,
  CounterpartyId: record.counterpartyId,
}))

formatter.on("error", (err) => console.error("Formatting error", err.message))

const stringifier = stringify({
  header: true,
})

const fileWriter = fs.createWriteStream(fileName.replace(".csv", "-categorised.csv"))

fileWriter.on("finish", () => console.log("Export finished"))

formatter.pipe(stringifier).pipe(fileWriter)

let exportedCount = 0
let keepExporting = true

while (keepExporting) {
  const transactionsResponse = await moneyhub.getTransactions({userId, params: {accountId, limit: 50, offset: exportedCount}})

  const {data: transactions} = transactionsResponse

  transactions.forEach((transaction) => formatter.write(transaction))

  exportedCount += transactions.length
  keepExporting = !!transactionsResponse.links.next

  console.log("Exported batch", {exportedCount})
}

formatter.end()