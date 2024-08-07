import { JobPost } from '../utils/jobpost-structure'
import {
  calculateDaysDifference,
  convertToSlug,
  generateKeyMap,
} from '../utils/helper-functions'
import { termsInTitle } from '../utils/constants'

//only filter request: qa - work from home - last week
export async function searchJobReed(
  term: any,
  page = 1,
  reviewedJob: Map<string, JobPost>,
): Promise<Array<JobPost>> {
  let jobsArray: Array<JobPost> = new Array<JobPost>()
  let responseBody : any='';
  try {
    const offset = (page - 1) * 20
    const response = await fetch(`https://api.reed.co.uk/api-bff-jobseeker-jobs/search/anonymous/?page=${page}`, {
      "headers": {
        "accept": "*/*",
        "accept-language": "en-US,en;q=0.9",
        "cache": "no-store",
        "content-type": "application/json",
        "priority": "u=1, i",
        "sec-ch-ua": "\"Not/A)Brand\";v=\"8\", \"Chromium\";v=\"126\", \"Google Chrome\";v=\"126\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"macOS\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "x-ab-session-id": "eeab3b446366400aaf922c24f0b626c9",
        "x-correlation-device-id": "eeb29ff4-5fd0-4e35-851e-e35184621ccb",
        "x-correlation-id": "81b90975-19b0-4503-8c3e-5b8f6892fd53",
        "x-correlation-session-id": "ab5f29e9-4615-41f8-a6d7-c4f8fed43115",
        "x-correlation-source-id": "web-jobseeker-jobs",
        "x-correlation-unique-user-id": "45ddf33c-4d5d-4388-a3c3-3de4ce0d3013",
        "x-query-id": "daaadfb5-a2a7-402e-a987-cb7b97f103d3",
        "Referer": "https://www.reed.co.uk/",
        "Referrer-Policy": "strict-origin-when-cross-origin"
      },
      "body": `{\"sortBy\":\"default\",\"keywords\":\"${term}\",\"location\":{\"locationId\":0,\"locationName\":\"\"},\"parentSectorIds\":[],\"proximity\":10,\"salaryFrom\":0,\"salaryTo\":0,\"perHour\":false,\"perm\":false,\"temp\":false,\"partTime\":false,\"fullTime\":false,\"ouId\":0,\"recruiterName\":\"\",\"clientProfileId\":0,\"isReed\":false,\"agency\":false,\"direct\":false,\"graduate\":false,\"contract\":false,\"hideTrainingJobs\":false,\"remoteWorkingOption\":\"remote\",\"pageno\":${page},\"take\":25,\"dateCreatedOffSet\":\"lastweek\",\"seoDirectory\":\"\",\"misspeltKeywords\":null,\"skipKeywordSpellcheck\":false,\"visaSponsorship\":false,\"isEasyApply\":false,\"excludeSalaryDescriptions\":[],\"minApplicants\":0,\"maxApplicants\":0}`,
      "method": "POST"
    });

    responseBody = await response.json()

    const URL = 'https://www.reed.co.uk/jobs/'

    responseBody.result.response.jobSearchResult.searchResults.results.forEach(
      (job: any) => {
        let jobDetail = job.jobDetail
        let urlId =
          URL + convertToSlug(jobDetail.jobTitle) + '/' + jobDetail.jobId

        let jobPost = {
          url: urlId,
          title: jobDetail.jobTitle,
          company: jobDetail.ouName,
          remoteStatus: jobDetail.remoteWorkingOption,
          location: jobDetail.countyLocation,
          postedData: calculateDaysDifference(jobDetail.dateCreated),
          salaryFrom: jobDetail.salaryFrom,
          salaryTo: jobDetail.salaryTo,
        }

        const tileLowerCase = jobPost.title.toLowerCase()
        const termInTitleIncluded = termsInTitle.some((word) =>
          tileLowerCase.includes(word),
        )

        const alreadyPresentInJobArray = jobsArray.some(obj => obj.title === jobPost.title && obj.company === jobPost.company );
        const jobPostKey = generateKeyMap(jobPost)
        if (
          !alreadyPresentInJobArray &&
          !reviewedJob.has(jobPostKey) &&
          termInTitleIncluded &&
          jobDetail.eligibleUkOnly == false
        ) {
          jobsArray.push(jobPost)
        }
      },
    )

    return jobsArray
  } catch (error: any) {
    console.log('Reed - Error principal function:', error.message, responseBody )
    return jobsArray
  }
}
