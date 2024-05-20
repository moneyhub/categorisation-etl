# Transaction categorisation ETL

## Description

This project is designed to perform data categorization using an ETL (Extract, Transform, Load) process from a CSV file.

## Prerequisites

Before running the project, make sure you have:

- Run `npm ci` to install dependencies
- Add client config to `/config/client.js`
- Add user and account details to `/config/user.js`
- Run `npm run create-account` if required

## Running

Each file contains some configuration which needs to be set

- The file 
- Update the formatter for the required file format
- Run `npm run import` to import data
- When enrichment is complete run `npm run export`