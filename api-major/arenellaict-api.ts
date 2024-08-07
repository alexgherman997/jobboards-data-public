import { JobPost } from '../utils/jobpost-structure'
import {
  calculateDaysDifference,
  convertToSlug,
  generateKeyMap,
} from '../utils/helper-functions'
import { termsInTitle } from '../utils/constants'

//Filter request: last week
export async function searchJobsArenallaict(
  reviewedJob: Map<string, JobPost>,
): Promise<Array<JobPost>> {
  let jobsArray: Array<JobPost> = new Array<JobPost>()
  let responseBody: any = ''
  try {
    const response = await fetch(
      'https://arenella-ict.com/api/listing/public/?orderAttribute=created&order=desc&page=0&size=20&listingAge=THIS_WEEK',
      {
        headers: {
          accept: 'application/json, text/plain, */*',
          'accept-language': 'en-US,en;q=0.9,ro;q=0.8,nl;q=0.7,de;q=0.6',
          'content-type': 'application/json',
          'sec-ch-ua':
            '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"macOS"',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-site',
          Referer: 'https://www.arenella-ict.com/',
          'Referrer-Policy': 'strict-origin-when-cross-origin',
        },
        body: null,
        method: 'GET',
      },
    )

    const reponseBody: any = await response.json()

    const URL = 'https://www.arenella-ict.com/listing/'
    reponseBody.content.forEach((jobDetail: any) => {
      let jobPost = {
        url: URL + jobDetail.listingId,
        title: jobDetail.title,
        company: jobDetail.ownerCompany,
        location: jobDetail.country,
        postedData: calculateDaysDifference(jobDetail.created),
        salaryFrom: jobDetail.rate,
        contact: jobDetail.ownerEmail,
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
