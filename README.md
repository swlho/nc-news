# Northcoders News API

## Setting up .env files

Create two .env files in the root folder of the project: .env.test and .env.development. Into each, add 'PGDATABASE=' followed with the correct database name for that environment (see /db/setup.sql for the database names).

N.B. Before committing any code, double check that these .env files are included in the .gitignore file.