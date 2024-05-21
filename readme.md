# Transaction categorisation ETL

## Description

This project is designed to perform data categorization using an ETL (Extract, Transform, Load) process from a CSV file.

## Prerequisites

Before running the project, make sure you have:

- Run `npm ci` to install dependencies
- Add client config to [`/config/client.js`](https://github.com/moneyhub/categorisation-etl/blob/main/config/client.js)
- (Optional) Run `npm run create-user` to create a user and an account in our API
- Add user and account details to [`/config/user.js`](https://github.com/moneyhub/categorisation-etl/blob/main/config/user.js)
- Add csv file under the `data` folder as `transactions.csv`
- The script expects for the following columns to exist in the csv:
    - `Description`
    - `Amount`
    - `Date`

## Running

- Run `npm run import` to import data
- When enrichment is complete run `npm run export`

## Example input

```
Date,Amount,Currency,Description
2024-01-12 00:00:00.0000000 +00:00,-26.87,GBP,AMZNMKTPLACE
2024-02-04 00:00:00.0000000 +00:00,-7.12,GBP,TESCO
```

## Example output

The output of the `npm run export` is written down to a file named `data/transactions-categorised.csv`.

This file contains the category and counterparty details per transaction.

```
Date,Description,Amount,CategoryId,CategoryName,CategoryGroupId,CategoryGroupName,CounterpartyId,CounterpartyName
2024-02-04T00:00:00.000Z,TESCO,-7.12,std:a2d41243-ab21-4d02-ac0d-daa3621e4b49,groceries,group:6,groceries,26c417bc-248f-5e3f-9835-3cd9c2842f50,Tesco
2024-01-12T00:00:00.000Z,AMZNMKTPLACE,-26.87,std:cdc55410-176d-4c71-9bb2-6988b5d4913d,general,group:6,groceries,5581d920-fedc-5369-9be7-685246231447,Amazon Marketplace

```