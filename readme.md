# Transaction categorisation ETL

## Description

This project is designed to perform data categorization using an ETL (Extract, Transform, Load) process from a CSV file.

## Prerequisites

Before running the project, make sure you have:

- Run `npm ci` to install dependencies
- Add client config to `/config/client.js`
- (Optional) Run `npm run create-user` to create a user and an account in our API
- Add user and account details to `/config/user.js`
- Add csv file under the `data` folder as `transactions.csv`
- The script expects for the following columns to exist in the csv:
    - `Description`
    - `Amount`
    - `Date`

## Running

- Run `npm run import` to import data
- When enrichment is complete run `npm run export`