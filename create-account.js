import {Moneyhub} from "@mft/moneyhub-api-client"
import config from "./config/client.js"

const moneyhub = await Moneyhub(config)

// ! Create a user
const {userId} = await moneyhub.registerUser({})
console.log("userId:", userId)

const newAccount = {
  accountName: "Categorisation Account",
  providerName: "Test Bank",
  type: "cash:current",
  accountType: "personal",
  balance: {
    date: new Date().toISOString().split('T')[0],
    amount: {
      value: 0
    }
  },
}

// ! Create account
const {data: {id: accountId}} = await moneyhub.createAccount({userId, account: newAccount})
console.log("accountId:", accountId)