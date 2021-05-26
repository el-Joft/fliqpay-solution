# Fliq Pay Assessment Solution

[![Build Status](https://travis-ci.com/el-Joft/fliqpay-solution.svg?token=BFq3KzWqxMtNd3CJbq2v&branch=develop)](https://travis-ci.com/el-Joft/fliqpay-solution)

## Technologies

Below is a list of technologies used to build this project

- NodeJs/Express
- TypeScript
- MongoDB
- Jest

## Features

The app is a customer support ticketing system. The APIs includes:

- Create an Account and Authenticate
- Create Support Ticket
- Edit Support Ticket
- Get All Support Tickets
- Update Support Ticket
- Delete Support Ticket
- Close A Support Ticket
- Comment on a Support Ticket
- Generate CSV on Support Ticket for past month or within a time range

## Installation

Follow these steps to set up the app.
Clone the repo:

\$ https://github.com/el-Joft/fliqpay-solution.git

Navigate to the project directory:

```sh
cd fliqpay-solution
```

Install Dependencies Used in the Application with

```sh
npm install
```

Create a .env file in the directory. Update the Environment variables, use the .env.example as guide

#### Creating Database

Mongodb is used for this application. You can use the cloud mongob from here `https://www.mongodb.com/cloud`
and pass in the url in the .env or install mongodb locally based on your operating system and pass the url in the .env `MONGODB_URI`

## Running and Development

Starting the application

Seed Data using

```sh
npm run seed
```

```sh
npm run start:dev
```

This will start the application and run the application in port 8080 or the port specified in your .env

Access the docs here

[![Run in Postman](https://run.pstmn.io/button.svg)](https://adekunle.postman.co/workspace/c1309e06-c6f0-4879-8fdc-60f0f86cd391/documentation/5593925-94e3977d-cae7-4452-8d10-cd8a94a183c2)

or click this [link](https://adekunle.postman.co/workspace/c1309e06-c6f0-4879-8fdc-60f0f86cd391/documentation/5593925-94e3977d-cae7-4452-8d10-cd8a94a183c2)

## Testing

Make sure you set the `MONGODB_TEST_URI` in the .env

```sh
npm run test
```

### Author

> Name: Omotayo Timothy
> github: el-joft
> email: ottimothy@gmail.com
