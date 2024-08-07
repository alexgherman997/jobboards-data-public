# Jobboard data description

Jobboard data framework is searching for jobs in multiple job boards using Node.js for API extraction and Playwright for UI extraction, with TypeScript.<br>
Qualify those jobs based on multiple criteria and ChatGPT(eg: xing-api.ts).<br>
And returns a qualified list of JSON jobs for manual validation and application.

## Installation command

npm i

## Execution command 

npx ts-node index.ts


## Usage 
Searching criteria for job boards website: 
 - [qa, test, automation]
 - Contract, Full-time, Freelancer, Self-employed, Employment
 - Remote
 - Jobs from last week (when possible)
 - European countries
 - All domains (IT, Engineering, Finance) - ex: QA banking posted in Finance category
 - Both: Contract + Permanent position 

 Jobs qualifications:
 - [qa, test, automation, quality assurance] - words in title
 - Job reviewed for the first time (not find in jobs.json)
 - Allow to work from a different country
 - ChatGPT validation based on my experience

 How to use it:
 - When between projects, execute it daily to get new available jobs, validate those manually, and apply if fit


## Notes 
 - Private repository initially didn't store the OpenAI API key in .env file, that's why a new public repository is created
 - Every search query is custom per website to get the best results 

 