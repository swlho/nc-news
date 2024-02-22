# Northcoders News API

## Link to hosted version on Render:
https://nc-news-836l.onrender.com/api

## Project summary
An API for the purpose of accessing application data programmatically. The intention here is to mimic the building of a real world backend service (such as Reddit) which should provide this information to the front end architecture.

## Instructions for hosting locally

#### Link to Github repo for cloning locally
https://github.com/swlho/nc-news.git


#### Step 1
Once the repo is cloned to a local machine, run the following in the terminal:
>`npm install`

This will install all the necessary project dependencies

*N.B Ensure installed node version is v20.0.0 or above and Postgres is v8.11.3 or above*

#### Step 2
Create two .env files in the root folder of the project: .env.test and .env.development. Into each, add 'PGDATABASE=' followed with the correct database name for that environment (see /db/setup.sql for the database names).

*N.B. Before committing any code, double check that these .env files are included in the .gitignore file.*

#### Step 4
Create the local databases by running the following in the terminal:
>`npm run setup-dbs`

#### Step 5
Seed the local databases by running the following in the terminal:
>`npm run seed`

#### Step 6
To run the Jest test suite, run the following command:
>`npm test app`

#### Step 7
To access the api through a web browser or a platform like Insomnia, first run the following command to initialise the server listener:
>`node listen.js`

If successful, the message `"Listening on port 9090!"` should appear in the terminal

Then use `localhost:9090/api` to access the api endpoint documentation to explore the different available endpoints

## Thank you for visiting this project!