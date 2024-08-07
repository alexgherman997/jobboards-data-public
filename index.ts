import { JobPost } from './utils/jobpost-structure'
import { searchJobsXing } from './api-critical/xing-api'
import {
  createJobMapFromFile,
  generateKeyMap,
  saveJobArrayToFile,
} from './utils/helper-functions'
import { searchTerm, searchTermGermany } from './utils/constants'
import { searchJobReed } from './api-critical/reed-api'
import { searchJobsFreelancermap } from './ui/freelancermaps-ui'
import { searchJobsJobserve } from './ui/jobserve-ui'
import { searchJobsCwjobs } from './ui/cwjobs-ui'
import { searchStartupJobs } from './ui/startup-ui'
import { searchJobsTotalJobs } from './ui/totaljobs-ui'
import { searchJobsHimalayas } from './ui/himalayas-ui'
import { searchJobsCpl } from './api-critical/cpl-html-api'
import { searchJobsComputerfutures } from './api-critical/computerfutures-api'
import { searchJobsHays } from './api-critical/hays-api'
import { searchJobsDarwin } from './api-critical/darwin-api'
import { searchJobsGravitas } from './api-critical/gravitas-api'
import { searchJobsJeffersonfrank } from './api-major/jeffersonfrank-api'
import { searchJobsEuremotejobs } from './api-major/euremotejobs-html-api'
import { searchJobsArenallaict } from './api-major/arenellaict-api'
import { searchJobsAustinfraser } from './api-major/austinfraser-api'
import { searchJobsSr2 } from './api-major/sr2-api'

async function main() {
  let allJobsMap = new Map<string, JobPost>()
  let jobsList: Array<JobPost>

  let allJobsMapRevied = new Map<string, JobPost>()
  allJobsMapRevied = createJobMapFromFile('jobs.json')

  //API critical
  //Xing - gpt - done
  for (let term of searchTerm) {
    jobsList = await searchJobsXing(term, 1, allJobsMapRevied)
    jobsList.forEach((jobDetails) =>
      allJobsMap.set(generateKeyMap(jobDetails), jobDetails),
    )
    jobsList = await searchJobsXing(term, 2, allJobsMapRevied)
    jobsList.forEach((jobDetails) =>
      allJobsMap.set(generateKeyMap(jobDetails), jobDetails),
    )
    jobsList = await searchJobsXing(term, 3, allJobsMapRevied)
    jobsList.forEach((jobDetails) =>
      allJobsMap.set(generateKeyMap(jobDetails), jobDetails),
    )
  }

  //Reed - done
  for (let term of searchTerm) {
    jobsList = await searchJobReed(term, 1, allJobsMapRevied)
    jobsList.forEach((jobDetails) =>
      allJobsMap.set(generateKeyMap(jobDetails), jobDetails),
    )
    jobsList = await searchJobReed(term, 2, allJobsMapRevied)
    jobsList.forEach((jobDetails) =>
      allJobsMap.set(generateKeyMap(jobDetails), jobDetails),
    )
    jobsList = await searchJobReed(term, 3, allJobsMapRevied)
    jobsList.forEach((jobDetails) =>
      allJobsMap.set(generateKeyMap(jobDetails), jobDetails),
    )
  }

  //Cpl
  for (let term of searchTerm) {
    jobsList = await searchJobsCpl(term, 1, allJobsMapRevied)
    jobsList.forEach((jobDetails) =>
      allJobsMap.set(generateKeyMap(jobDetails), jobDetails),
    )
    jobsList = await searchJobsCpl(term, 2, allJobsMapRevied)
    jobsList.forEach((jobDetails) =>
      allJobsMap.set(generateKeyMap(jobDetails), jobDetails),
    )
    jobsList = await searchJobsCpl(term, 3, allJobsMapRevied)
    jobsList.forEach((jobDetails) =>
      allJobsMap.set(generateKeyMap(jobDetails), jobDetails),
    )
  }

  //Computer futures
  for (let term of searchTerm) {
    jobsList = await searchJobsComputerfutures(term, 1, allJobsMapRevied)
    jobsList.forEach((jobDetails) =>
      allJobsMap.set(generateKeyMap(jobDetails), jobDetails),
    )
    jobsList = await searchJobsComputerfutures(term, 2, allJobsMapRevied)
    jobsList.forEach((jobDetails) =>
      allJobsMap.set(generateKeyMap(jobDetails), jobDetails),
    )
    jobsList = await searchJobsComputerfutures(term, 3, allJobsMapRevied)
    jobsList.forEach((jobDetails) =>
      allJobsMap.set(generateKeyMap(jobDetails), jobDetails),
    )
  }

  //Hays
  // for (let term of searchTerm) {
  //   jobsList = await searchJobsHays(term, 1, allJobsMapRevied)
  //   jobsList.forEach((jobDetails) =>
  //     allJobsMap.set(generateKeyMap(jobDetails), jobDetails),
  //   )
  //   jobsList = await searchJobsHays(term, 2, allJobsMapRevied)
  //   jobsList.forEach((jobDetails) =>
  //     allJobsMap.set(generateKeyMap(jobDetails), jobDetails),
  //   )
  //   jobsList = await searchJobsHays(term, 3, allJobsMapRevied)
  //   jobsList.forEach((jobDetails) =>
  //     allJobsMap.set(generateKeyMap(jobDetails), jobDetails),
  //   )
  // }

  //Darwin
  for (let term of searchTerm) {
    jobsList = await searchJobsDarwin(term, 1, allJobsMapRevied)
    jobsList.forEach((jobDetails) =>
      allJobsMap.set(generateKeyMap(jobDetails), jobDetails),
    )
    jobsList = await searchJobsDarwin(term, 2, allJobsMapRevied)
    jobsList.forEach((jobDetails) =>
      allJobsMap.set(generateKeyMap(jobDetails), jobDetails),
    )
  }

  //Gravitas
  for (let term of searchTerm) {
    jobsList = await searchJobsGravitas(term, 1, allJobsMapRevied)
    jobsList.forEach((jobDetails) =>
      allJobsMap.set(generateKeyMap(jobDetails), jobDetails),
    )
  }

  //UI
  //Freelancer map
  for (let term of searchTermGermany) {
    jobsList = await searchJobsFreelancermap(term, allJobsMapRevied)
    jobsList.forEach((jobDetails) =>
      allJobsMap.set(generateKeyMap(jobDetails), jobDetails),
    )
  }

  //Job serve
  for (let term of searchTerm) {
    jobsList = await searchJobsJobserve(term, allJobsMapRevied)
    jobsList.forEach((jobDetails) =>
      allJobsMap.set(generateKeyMap(jobDetails), jobDetails),
    )
  }

  //Total jobs
  for (let term of searchTerm) {
    jobsList = await searchJobsTotalJobs(term, allJobsMapRevied)
    jobsList.forEach((jobDetails) =>
      allJobsMap.set(generateKeyMap(jobDetails), jobDetails),
    )
  }

  //Cw jobs
  for (let term of searchTerm) {
    jobsList = await searchJobsCwjobs(term, allJobsMapRevied)
    jobsList.forEach((jobDetails) =>
      allJobsMap.set(generateKeyMap(jobDetails), jobDetails),
    )
  }

  //API Major
  //Arrenaict
  jobsList = await searchJobsArenallaict(allJobsMapRevied)
  jobsList.forEach((jobDetails) =>
    allJobsMap.set(generateKeyMap(jobDetails), jobDetails),
  )

  //Jeffersonfrank
  for (let term of searchTerm) {
    jobsList = await searchJobsJeffersonfrank(term, 1, allJobsMapRevied)
    jobsList.forEach((jobDetails) =>
      allJobsMap.set(generateKeyMap(jobDetails), jobDetails),
    )
  }

  //Workday
  for (let term of searchTerm) {
    jobsList = await searchJobsJeffersonfrank(term, 1, allJobsMapRevied)
    jobsList.forEach((jobDetails) =>
      allJobsMap.set(generateKeyMap(jobDetails), jobDetails),
    )
  }

  //Austinfraser
  for (let term of searchTerm) {
    jobsList = await searchJobsAustinfraser(term, 1, allJobsMapRevied)
    jobsList.forEach((jobDetails) =>
      allJobsMap.set(generateKeyMap(jobDetails), jobDetails),
    )
  }

  //Euremotejobs
  for (let term of searchTerm) {
    jobsList = await searchJobsEuremotejobs(term, 1, allJobsMapRevied)
    jobsList.forEach((jobDetails) =>
      allJobsMap.set(generateKeyMap(jobDetails), jobDetails),
    )
  }

  //Sr2
  for (let term of searchTerm) {
    jobsList = await searchJobsSr2(term, 1, allJobsMapRevied)
    jobsList.forEach((jobDetails) =>
      allJobsMap.set(generateKeyMap(jobDetails), jobDetails),
    )
  }

  //UI
  //Startup jobs
  for (let term of searchTerm) {
    jobsList = await searchStartupJobs(term, allJobsMapRevied)
    jobsList.forEach((jobDetails) =>
      allJobsMap.set(generateKeyMap(jobDetails), jobDetails),
    )
  }

  //Himalayas jobs
  for (let term of searchTerm) {
    jobsList = await searchJobsHimalayas(term, allJobsMapRevied)
    jobsList.forEach((jobDetails) =>
      allJobsMap.set(generateKeyMap(jobDetails), jobDetails),
    )
  }

  // Convert Map values to Array, for sorting the new jobs
  let allJobArray: Array<JobPost> = [...allJobsMap.values()]
  allJobArray.sort((a, b) => a.postedData - b.postedData)

  //Show only the new Jobs
  console.log(allJobArray)

  // merge the new jobs with the old jobs, and write in thejson  file
  allJobArray = [...allJobArray, ...allJobsMapRevied.values()]
  allJobArray.sort((a, b) => a.postedData - b.postedData)
  saveJobArrayToFile('jobs.json', allJobArray)
}

main()
//newJobboards()

//Debug function
async function newJobboards() {
  let allJobsMap = new Map<string, JobPost>()
  let jobsList: Array<JobPost>

  let allJobsMapRevied = new Map<string, JobPost>()
  allJobsMapRevied = createJobMapFromFile('jobs.json')

  let allJobArray: Array<JobPost> = [...allJobsMap.values()]
  allJobArray.sort((a, b) => a.postedData - b.postedData)

  console.log(allJobArray)
}

//todo

/*
fix cookies expired: 
- Jeffersonfrank
- hymalyas

chagpt validation order: 
- fix xing
- total jobs 
- jobserve
- freelancer.de
- darwin 

improvements:
- implement parallel execution per file 
*/

/*
Tried things not worth it:
- tried scrapy for ui scraping websites, i don't need a lot of unfiltered jobs, and the learning curve is not worth it, and using proxies, when i can use playwright which i already know
*/
