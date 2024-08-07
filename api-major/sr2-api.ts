import { JobPost } from '../utils/jobpost-structure'
import {
  calculateDaysDifference,
  generateKeyMap,
} from '../utils/helper-functions'
import { termsInTitle } from '../utils/constants'

//Filter request: qa  - remote
export async function searchJobsSr2(
  term: any,
  page = 1,
  reviewedJob: Map<string, JobPost>,
): Promise<Array<JobPost>> {
  let jobsArray: Array<JobPost> = new Array<JobPost>()
  let responseBody: any = ''
  const URL = 'https://sr2rec.com/jobs'
  try {
    const offset = (page - 1) * 10
    const response = await fetch(
      'https://sr2rec.com/_sf/api/v1/jobs/search.json',
      {
        headers: {
          accept: '*/*',
          'accept-language': 'en-US,en;q=0.9,ro;q=0.8,nl;q=0.7,de;q=0.6',
          'content-type': 'application/json',
          priority: 'u=1, i',
          'sec-ch-ua':
            '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"macOS"',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-origin',
          cookie:
            '_ga=GA1.1.1398044618.1721392454; CookieConsent={stamp:%27CZ6k9M+L6v15yIy4i1XFMXs2BnXFPn3XianmiQcPfl+Cnap2wQRbmg==%27%2Cnecessary:true%2Cpreferences:true%2Cstatistics:true%2Cmarketing:true%2Cmethod:%27explicit%27%2Cver:1%2Cutc:1721392455720%2Cregion:%27ro%27}; _sf_source=referrer:|utm_source:|utm_medium:|utm_campaign:; _sf_journey=1721803675868:/|1721804197902:/jobs/?query=QA|1721804267601:/jobs/|1721804604209:/|1721804667972:/jobs/?query=qa|1721805390406:/jobs/#/remote|1721805663317:/jobs/312506-Cloud-Architect|1721805663329:/jobs/312506-Cloud-Architect/; _sf_journey_last_event=1721805663329; _ga_6MKGSWK2WH=GS1.1.1721803675.2.1.1721805663.0.0.0',
          Referer: 'https://sr2rec.com/jobs/',
          'Referrer-Policy': 'strict-origin-when-cross-origin',
        },
        body: `{"job_search":{"query":"${term}","location":{"address":"","radius":5,"region":"GB","radius_units":"miles"},"filters":{"458496eb-7820-4971-abec-eed17ddfc6c8":["c220d6e5-f7df-45ad-98a8-ebc024c28acd"],"b575512a-3581-4e52-a3a0-6819e0abe08a":["7944868f-a34c-4e33-a523-e5c7d0196354"]},"commute_filter":{},"offset":${offset},"jobs_per_page":10}}`,
        method: 'POST',
      },
    )

    responseBody = await response.json()

    responseBody.results.forEach((jobDetailJson: any) => {
      jobDetailJson = jobDetailJson.job
      let urlId = URL + '/' + jobDetailJson.url_slug

      let jobPost = {
        url: urlId,
        title: jobDetailJson.title,
        company: 'Unknown company',
        location: jobDetailJson.addresses[0],
        postedData: 99,
        salaryFrom: jobDetailJson.salary_package,
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
      'Sr2 - Error principal function:',
      error.message,
      responseBody,
    )
    return jobsArray
  }
}

