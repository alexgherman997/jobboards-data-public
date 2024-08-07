import { JobPost } from '../utils/jobpost-structure'
import {
  calculateDaysDifference,
  generateKeyMap,
  transformDatePostedTimeFormatToDays,
} from '../utils/helper-functions'
import { termsInTitle } from '../utils/constants'
import * as cheerio from 'cheerio'

//Filter request: qa - all countries
export async function searchJobsDarwin(
  term: any,
  page = 1,
  reviewedJob: Map<string, JobPost>,
): Promise<Array<JobPost>> {
  let jobsArray: Array<JobPost> = new Array<JobPost>()
  let responseBody: any = ''
  const URL = 'https://www.darwinrecruitment.com/job-search'
  try {
    const offset = (page - 1) * 12
    const response = await fetch(
      `https://www.darwinrecruitment.com/job-search/?_keywords=${term}&_paged=${page}`,
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
            '_ga=GA1.1.2025205896.1721285980; cookielawinfo-checkbox-necessary=yes; cookielawinfo-checkbox-non-necessary=yes; _hjSessionUser_2975588=eyJpZCI6IjFlMTU3MjllLTQ0MGItNTg4Zi1hOWY4LTA0ZDQ1MDJjOTlhMCIsImNyZWF0ZWQiOjE3MjEyODU5ODA4MjgsImV4aXN0aW5nIjp0cnVlfQ==; CookieLawInfoConsent=eyJuZWNlc3NhcnkiOnRydWUsIm5vbi1uZWNlc3NhcnkiOnRydWV9; viewed_cookie_policy=yes; _hjSession_2975588=eyJpZCI6IjdhNjI5YmI2LTE3NzctNGQ2NS05MjlhLWE5NmQ3MmE4NWZmZSIsImMiOjE3MjE3MTMyMTIxNTcsInMiOjEsInIiOjEsInNiIjowLCJzciI6MCwic2UiOjAsImZzIjowLCJzcCI6MX0=; _ga_ZYYRYZ858D=GS1.1.1721716004.4.1.1721716693.32.0.630909847; _ga_51LF5QBT5E=GS1.1.1721715990.4.1.1721716791.0.0.0',
          Referer: `https://www.darwinrecruitment.com/job-search/?_keywords=${term}&_paged=${page}`,
          'Referrer-Policy': 'strict-origin-when-cross-origin',
        },
        body: `{"action":"facetwp_refresh","data":{"facets":{"keywords":"${term}","sort_by":[],"internal_jobs":[],"remote_selection":[],"country":[],"custom_city":[],"location":[],"job_sector":[],"job_listing_sub_sector":[]},"frozen_facets":{},"http_params":{"get":{"_keywords":"${term}","_paged":"${page}"},"uri":"job-search","url_vars":{"keywords":["qa"],"remote_selection":["fully-remote"],"paged":"1"}},"template":"wp","extras":{"pager":true,"sort":"default"},"soft_refresh":1,"is_bfcache":1,"first_load":0,"paged":"${page}"}}`,
        method: 'POST',
      },
    )

    responseBody = await response.json()
    let htmlContent = responseBody.template

    const $ = cheerio.load(htmlContent)
    const jobs = $('div.pp-content-post')

    jobs.each((i, jobDetail) => {
      let urlId = $(jobDetail).find('a.new_home_job_title').attr('href') ?? ''
      let title = $(jobDetail).find('a.new_home_job_title').text() ?? ''
      let location =
        $(jobDetail).find('.col-md-5 .new_home_more_info').text() ?? ''
      let postedDate: string =
        $(jobDetail).find('[itemprop=datePublished]').attr('content') ?? ''

      let dateNumber = calculateDaysDifference(postedDate)

      let jobPost = {
        url: urlId,
        title: title,
        company: 'Unknown company',
        location: location,
        postedData: dateNumber,
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
        jobPost.postedData <= 7
      ) {
        jobsArray.push(jobPost)
      }
    })

    return jobsArray
  } catch (error: any) {
    console.log(
      'Darwin - Error principal function:',
      error.message,
      responseBody,
    )
    return jobsArray
  }
}

searchJobsDarwin('test', 2, new Map<any, any>())
