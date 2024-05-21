import fs from "fs"
import {stringify}from "csv-stringify"
import {transform} from "stream-transform"
import {Moneyhub} from "@mft/moneyhub-api-client"
import config from "./config/client.js"
import userConfig from "./config/user.js"

const moneyhub = await Moneyhub(config)

const getGlobalCounterparties = async (counterparties = [], offset = 0) => {
  const {data, links} = await moneyhub.getGlobalCounterparties({limit: 1000, offset})
  if (links.next) {
      const nextOffset = new URL(links.next).searchParams.get("offset")
      return getGlobalCounterparties([...data, ...counterparties], nextOffset)
  }
  return [...data, ...counterparties]
}


const {data: standardCategories} = await moneyhub.getStandardCategories({})
const {data: standardCategoryGroups} = await moneyhub.getStandardCategoryGroups({})
const counterparties = await getGlobalCounterparties()

//! The account to export from
const {userId, accountId} = userConfig

//! The file to write to
const FILE_NAME = "./data/transactions.csv"

//! The format of the file
const formatter = transform(async (record) => {
  const category = standardCategories.find((category) => category.categoryId === record.categoryId)
  const group = standardCategoryGroups.find((group) => group.id === category?.group)
  const counterparty = record.counterpartyId ? counterparties.find((counterpaty) => counterpaty.id === record.counterpartyId) : {}
  
  return {
    Date: record.date,
    Description: record.longDescription,
    Amount: (record.amount.value / 100).toFixed(2),
    CategoryId: record.categoryId,
    CategoryName: category?.key,
    CategoryGroupId: category?.group,
    CategoryGroupName: group?.key,
    CounterpartyId: counterparty?.id,
    CounterpartyName: counterparty?.name,
  }
})

formatter.on("error", (err) => console.error("Formatting error", err.message))

const stringifier = stringify({
  header: true,
})

const fileWriter = fs.createWriteStream(FILE_NAME.replace(".csv", "-categorised.csv"))

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