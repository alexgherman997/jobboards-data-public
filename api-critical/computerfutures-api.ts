import { JobPost } from '../utils/jobpost-structure'
import {
  calculateDaysDifference,
  generateKeyMap,
} from '../utils/helper-functions'
import { termsInTitle } from '../utils/constants'

//Filter request: qa - all countries - remote
export async function searchJobsComputerfutures(
  term: any,
  page = 1,
  reviewedJob: Map<string, JobPost>,
): Promise<Array<JobPost>> {
  let jobsArray: Array<JobPost> = new Array<JobPost>()
  let responseBody: any = ''
  const URL = 'https://www.computerfutures.com/en-gb/job'
  try {
    const offset = (page - 1) * 20
    page = page - 1
    const response = await fetch(
      'https://api.websites.sthree.com/api/services/v2/app/Search/Search',
      {
        headers: {
          'abp.localization.culturename': 'en-gb',
          accept: '*/*',
          'accept-language': 'en-US,en;q=0.9,ro;q=0.8,nl;q=0.7,de;q=0.6',
          'content-type': 'application/json',
          'sec-ch-ua':
            '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"macOS"',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'cross-site',
          Referer: 'https://www.computerfutures.com/',
          'Referrer-Policy': 'strict-origin-when-cross-origin',
        },
        body: `{"resultPage":${page},"resultFrom":${offset},"resultSize":20,"keywords":"${term}","language":"en-gb","remoteWorking":true,"brandCode":"CF","searchRadius":"20mi"}`,
        method: 'POST',
      },
    )

    responseBody = await response.json()

    responseBody.result.results.forEach((jobDetailJson: any) => {
      let urlId =
        URL + '/' + jobDetailJson.slug + '/' + jobDetailJson.jobReference

      let jobPost = {
        url: urlId,
        title: jobDetailJson.title,
        company: 'Unknown company',
        location: jobDetailJson.location,
        postedData: calculateDaysDifference(jobDetailJson.postDate),
        salaryFrom: jobDetailJson.salaryFrom,
        salaryTo: jobDetailJson.salaryTo,
        remoteOption: jobDetailJson.remoteWorkingAvailable,
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
        termInTitleIncluded &&
        jobPost.postedData <= 7 &&
        jobPost.remoteOption === true
      ) {
        jobsArray.push(jobPost)
      }
    })

    return jobsArray
  } catch (error: any) {
    console.log(
      'Computerfutures - Error principal function:',
      error.message,
      responseBody,
    )
    return jobsArray
  }
}
