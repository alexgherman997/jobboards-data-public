import { JobPost } from '../utils/jobpost-structure'
import {
  calculateDaysDifference,
  generateKeyMap,
  transformDatePostedTimeFormatToDays,
} from '../utils/helper-functions'
import { termsInTitle } from '../utils/constants'

//Filter request: qa - all countries
export async function searchJobsGravitas(
  term: any,
  page = 1,
  reviewedJob: Map<string, JobPost>,
): Promise<Array<JobPost>> {
  let jobsArray: Array<JobPost> = new Array<JobPost>()
  let responseBody: any = ''
  const URL = 'https://www.gravitasgroup.com/jobs'
  try {
    const offset = (page - 1) * 10
    const response = await fetch(
      'https://www.gravitasgroup.com/_sf/api/v1/jobs/search.json',
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
            '_ga=GA1.1.874840382.1718013227; cookie_consent_user_consent_token=kVqbVR14e3oq; cookie_consent_user_accepted=true; cookie_consent_level=%7B%22strictly-necessary%22%3Atrue%2C%22functionality%22%3Atrue%2C%22tracking%22%3Atrue%2C%22targeting%22%3Atrue%7D; _ga_Z5SF861TRR=GS1.1.1721717266.5.1.1721717390.60.0.0; _sf_journey=1721717390284:/jobs; _sf_source=referrer:|utm_source:|utm_medium:|utm_campaign:; _sf_journey_last_event=1721717390284',
          Referer: 'https://www.gravitasgroup.com/jobs',
          'Referrer-Policy': 'strict-origin-when-cross-origin',
        },
        body: `{"job_search":{"query":"${term}","location":{"address":"","radius":5,"region":"GB","radius_units":"kilometres"},"filters":{"f656755b-20ab-4683-a8c5-6814b4ab25d3":["7830d73a-4057-4883-ad8d-a9e56add479c"]},"commute_filter":{},"offset":${offset},"jobs_per_page":10}}`,
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
      'Gravitas - Error principal function:',
      error.message,
      responseBody,
    )
    return jobsArray
  }
}
