import {Moneyhub} from "@mft/moneyhub-api-client"
import config from "./config/client.js"
// Import the file system module
import fs from "fs"

// Define the content to be written to the file


const moneyhub = await Moneyhub(config)

// ! Create a user
const {userId} = await moneyhub.registerUser({})
console.log("USER ID:", userId)

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
console.log("ACCOUNT ID:", accountId)

const content = `export default {
  userId: "${userId}",
  accountId: "${accountId}",
}`;


fs.writeFile('./config/user.js', content, 'utf8', (err) => {
  if (err) {
      console.error('Error writing to file', err);
  } else {
      console.log('File written successfully');
  }
});