import { JobPost } from '../utils/jobpost-structure'
import {
  calculateDaysDifference,
  generateKeyMap,
} from '../utils/helper-functions'
import { termsInTitle } from '../utils/constants'

//Filter query: qa - remote
export async function searchJobsAustinfraser(
  term: any,
  page = 1,
  reviewedJob: Map<string, JobPost>,
): Promise<Array<JobPost>> {
  let jobsArray: Array<JobPost> = new Array<JobPost>()
  let responseBody: any = ''
  try {
    const offset = (page - 1) * 6
    const response = await fetch(
      'https://austin-fraser.sites.sourceflow.co.uk/_sf/api/v1/jobs/search.json',
      {
        headers: {
          accept: 'application/json, text/plain, */*',
          'accept-language': 'en-US,en;q=0.9,ro;q=0.8,nl;q=0.7,de;q=0.6',
          'content-type': 'application/json',
          priority: 'u=1, i',
          'sec-ch-ua':
            '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"macOS"',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'cross-site',
          Referer: 'https://www.austinfraser.com/',
          'Referrer-Policy': 'strict-origin-when-cross-origin',
        },
        body: `{"job_search":{"query":"${term}","location":{"address":"","radius":5,"radius_units":"miles"},"filters":{"edee8481-37de-4be8-804b-26231e9f818d":["67a46d50-99cc-4adb-a288-499d2e5d4db2"]},"commute_filter":{},"offset":${offset},"jobs_per_page":6}}`,
        method: 'POST',
      },
    )

    const reponseBody: any = await response.json()
    const URL = 'https://www.austinfraser.com/jobs/'

    reponseBody.results.forEach((jobs: any) => {
      const jobDetail = jobs.job
      let jobPost = {
        url: URL + jobDetail.url_slug,
        title: jobDetail.title,
        company: 'Unknown company',
        location: jobDetail.addresses,
        postedData: 99,
        salaryFrom: jobDetail.salary_package,
      }
      const tileLowerCase = jobPost.title.toLowerCase()
      const termInTitleIncluded = termsInTitle.some((word) =>
        tileLowerCase.includes(word),
      )
      const alreadyPresentInJobArray = jobsArray.some(
        (obj) => obj.title === jobPost.title && obj.company === jobPost.company,
      )
      const jobPostKey = generateKeyMap(jobPost)

      if (
        !alreadyPresentInJobArray &&
        !reviewedJob.has(jobPostKey) &&
        termInTitleIncluded
      ) {
        jobsArray.push(jobPost)
      }
    })

    return jobsArray
  } catch (error: any) {
    console.log(
      'Euremotejobs - Error principal function:',
      error.message,
      responseBody,
    )
    return jobsArray
  }
}
