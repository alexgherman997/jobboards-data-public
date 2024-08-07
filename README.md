# Jobboard data description

Jobboard data framwork is searching for jobs in mulitple jobboards using Node.js for API extraction and Playwright for UI extraction, with TypeScript.<br>
Qualify those jobs based on multiple criterias and ChatGPT(eg: xing-api.ts).<br>
And returns a qualifed list of JSON jobs for manual validatation and application.<br>


## Installation command

npm i

## Execution command 

npx ts-node index.ts


## Usage 
Searching criteria for jobboards website: 
 - [qa, test, automation]
 - Contract, Full-time, Freelancer, Self-employed, Employment
 - Remote
 - Jobs from last week (when possible)
 - European countries
 - All domains (IT, Engineering, Finace) - ex: QA banking posted in Finance category
 - Both: Contract + Permanent position 

 Jobs qualifications:
 - [qa, test, automation, quality assurance] - words in title
 - Job reviewed for the first time (not find in jobs.json)
 - Allow to work from a different country
 - ChatGPT validation based on my experience

 How to use it:
 - When between projects, execute it daily to get new available jobs, validate those manually, and apply if fit

 Notes: 
 - Find API jobs results in incognito
 - Every search query is custom per website in order to get the best results 