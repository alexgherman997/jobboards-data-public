import { JobPost } from '../utils/jobpost-structure'
import {
  calculateDaysDifference,
  convertToSlug,
  generateKeyMap,
} from '../utils/helper-functions'
import { termsInTitle } from '../utils/constants'

//Filter query: qa - both permanent and contract
export async function searchJobsJeffersonfrank(
  term: any,
  page = 1,
  reviewedJob: Map<string, JobPost>,
): Promise<Array<JobPost>> {
  let jobsArray: Array<JobPost> = new Array<JobPost>()
  let responseBody: any = ''
  try {
    const offset = (page - 1) * 20
    const response = await fetch(
      'https://kxcoh5wflzfgfj7zrvnhz46kuq.appsync-api.eu-west-2.amazonaws.com/graphql',
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
          'sec-fetch-site': 'cross-site',
          'x-amz-user-agent': 'aws-amplify/2.0.3',
          'x-api-key': 'da2-3xqbb3qmnveozhrhwvnhkg6vlm',
          Referer: `https://www.jeffersonfrank.com/aws-jobs?keyword=${term}&location=&segment=&product=&jobType=both`,
          'Referrer-Policy': 'no-referrer-when-downgrade',
        },
        body: `{"operationName":"searchJobs","variables":{"keyword":"${term}","location":"","role":[],"level":[],"jobType":"both","page":${page},"salaryFrom":"","salaryTo":"","salaryCurrency":"","segment":"","product":""},"query":"query searchJobs($keyword: String, $location: String, $role: [String!], $level: [String!], $jobType: String, $page: Int, $remote: Boolean, $security: Boolean, $addedSince: String, $salaryFrom: String, $salaryTo: String, $salaryCurrency: String, $product: String, $segment: String) {\\n  searchJobs(keyword: $keyword, location: $location, role: $role, level: $level, jobType: $jobType, page: $page, remote: $remote, security: $security, addedSince: $addedSince, salaryFrom: $salaryFrom, salaryTo: $salaryTo, salaryCurrency: $salaryCurrency, product: $product, segment: $segment) {\\n    pagination {\\n      value\\n      relation\\n      __typename\\n    }\\n    items {\\n      indexedAt\\n      lastModified\\n      contactName\\n      contactEmail\\n      applicationEmail\\n      reference\\n      title\\n      type\\n      skills\\n      description\\n      product\\n      segment\\n      role\\n      remote\\n      needsSecurityClearance\\n      seniority\\n      location {\\n        description\\n        country\\n        region\\n        __typename\\n      }\\n      salary {\\n        from\\n        to\\n        currency\\n        description\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n  getJobSearchFacetCounts(keyword: $keyword, location: $location, jobType: $jobType) {\\n    roles {\\n      key\\n      docCount\\n      __typename\\n    }\\n    levels {\\n      key\\n      docCount\\n      __typename\\n    }\\n    security {\\n      key\\n      docCount\\n      value\\n      __typename\\n    }\\n    remote {\\n      key\\n      docCount\\n      value\\n      __typename\\n    }\\n    newJobs {\\n      key\\n      docCount\\n      value\\n      __typename\\n    }\\n    currencies {\\n      key\\n      docCount\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n"}`,
        method: 'POST',
      },
    )

    const responseBody: any = await response.json()

    const URL = 'https://www.jeffersonfrank.com/job/'

    responseBody.data.searchJobs.items.forEach((jobDetail: any) => {
      let urlId =
        URL + jobDetail.reference + '/' + convertToSlug(jobDetail.title)
      let jobPost = {
        url: urlId,
        title: jobDetail.title,
        company: 'Unknown company',
        location: jobDetail.location.country,
        postedData: calculateDaysDifference(jobDetail.indexedAt),
        salaryFrom: jobDetail.salary.from,
        salaryTo: jobDetail.salary.to,
        contact: jobDetail.contactEmail,
        remoteOption: jobDetail.remote,
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
      'Jeffersonfrank - Error principal function:',
      error.message,
      responseBody,
    )
    return jobsArray
  }
}
