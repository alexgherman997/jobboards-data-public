import { JobPost } from '../utils/jobpost-structure'
import {
  calculateDaysDifference,
  convertToSlug,
  generateKeyMap,
  transformDatePostedTimeFormatToDays,
  transformPostedTimeToDays,
} from '../utils/helper-functions'
import { termsInTitle } from '../utils/constants'
import * as cheerio from 'cheerio'

//Only filter request: qa
export async function searchJobsCpl(
  term: any,
  page = 1,
  reviewedJob: Map<string, JobPost>,
): Promise<Array<JobPost>> {
  let jobsArray: Array<JobPost> = new Array<JobPost>()
  const URL = 'https://www.cpl.com'
  let responseBody: any = ''
  try {
    const offset = (page - 1) * 20
    const response = await fetch(
      `https://www.cpl.com/jobs?page=${page}&query=${term}&selected_locations=`,
      {
        headers: {
          accept: 'text/html, */*; q=0.01',
          'accept-language': 'en-US,en;q=0.9,ro;q=0.8,nl;q=0.7,de;q=0.6',
          'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
          newrelic:
            'eyJ2IjpbMCwxXSwiZCI6eyJ0eSI6IkJyb3dzZXIiLCJhYyI6IjM4NzU4MzciLCJhcCI6IjUzODU1NjA3NSIsImlkIjoiNGE3NDNiNGRiYzYxNGJjMiIsInRyIjoiNDJiMmJmNjdkZWUxNGNlYmVkNTIyYjZhOWE2MGE2NDYiLCJ0aSI6MTcyMTU1MzI5NDE3NiwidGsiOiIyOTg2Mzc2In19',
          priority: 'u=1, i',
          'sec-ch-ua':
            '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"macOS"',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-origin',
          traceparent:
            '00-42b2bf67dee14cebed522b6a9a60a646-4a743b4dbc614bc2-01',
          tracestate:
            '2986376@nr=0-1-3875837-538556075-4a743b4dbc614bc2----1721553294176',
          'x-newrelic-id': 'Vw4AVF5QDxAFVlVXBAIGXlA=',
          'x-pjax': 'true',
          'x-pjax-container': 'undefined',
          'x-requested-with': 'XMLHttpRequest',
          cookie:
            '0f67e87c_f24_autoId=9910f927-b9ba-418c-a302-fb3fc6e64e36; OptanonAlertBoxClosed=2024-07-18T15:50:45.728Z; google_cid=1201399780.1721317846; _lfa=LF1.1.fd6e0be1502709af.1718177751883; _cat=CAT1.3.586669459.1721317846046; _gid=GA1.2.252097917.1721546573; _gcl_au=1.1.2064797362.1721317846.1412043156.1721546602.1721546602; _ga_FS5FD0JNMC=GS1.1.1721546609.1.1.1721546620.49.0.0; __Host-_krakatoa_session=V4HdNhVKMW9mbWGt2LqAPWdkWz%2Fu0Cj3nQS4oX6BymWACrnG9ZYmM8hHTqisXNcAfamUpAwMBqh4eLSdKZq0Pc9ux161A9yKmHWcUe2U2kCfI%2FOXsxxXAF4Fy1vkf3gZ5jiOdKcyNBnMhDGEXPm3trCXef06YwDNiIBFSTifV9GuZgaAMu%2Faw7gyM0EMem4jW5sAp%2BLS%2FV8DfewVBJO8u%2F0559My5LCq2E31IqxZWMg6wZ90YebcoVt1wKtZa5EhMA59Hkgc0Z81McDRuSIacZxYYPhhILFguRoSfAgynfN1ooWAvhzMa0InTctYgC%2Fr%2Fe49SHFilqKNkod3--YWckXQ5q4vcZ04hO--E%2BzF7%2FgA5Rc01oyvfn%2F%2BlA%3D%3D; OptanonConsent=isGpcEnabled=0&datestamp=Sun+Jul+21+2024+12%3A13%3A44+GMT%2B0300+(Eastern+European+Summer+Time)&version=202403.2.0&browserGpcFlag=0&isIABGlobal=false&hosts=&consentId=96ea6f5a-bb01-4be8-a39b-841cb77207bf&interactionCount=1&isAnonUser=1&landingPath=NotLandingPage&groups=C0003%3A1%2CC0004%3A1%2CC0001%3A1%2CC0002%3A1&intType=1&geolocation=RO%3BCJ&AwaitingReconsent=false; _ga=GA1.1.1201399780.1721317846; _ga_CY473M28PG=GS1.1.1721553223.5.1.1721553291.60.0.0',
          Referer: `https://www.cpl.com/jobs/?query=${term}&selected_locations=`,
          'Referrer-Policy': 'strict-origin-when-cross-origin',
        },
        body: null,
        method: 'GET',
      },
    )

    let htmlResponseString = await response.text()
    const $ = cheerio.load(htmlResponseString)
    const jobs = $('div.job-details')

    jobs.each((i, jobDetail) => {
      let urlId = $(jobDetail).find('.job-title a').attr('href') ?? ''
      let title =
        $(jobDetail).find('.job-title').text().trimStart().trimEnd() ?? ''
      let location =
        $(jobDetail)
          .find('.results-job-location')
          .text()
          .trimStart()
          .trimEnd() ?? ''
      let salary = $(jobDetail).find('.results-salary').text().trimStart() ?? ''
      let postedDate: string =
        $(jobDetail).find('.results-posted-at').text().trimStart() ?? ''

      let dateNumber = transformDatePostedTimeFormatToDays(postedDate)

      let jobPost = {
        url: URL + urlId,
        title: title,
        company: 'Unknown company',
        location: location,
        postedData: dateNumber,
        salaryFrom: salary,
      }

      const tileLowerCase = jobPost.title.toLowerCase()
      const termInTitleIncluded = termsInTitle.some((word) =>
        tileLowerCase.includes(word),
      )

      const alreadyPresentInJobArray = jobsArray.some(
        (obj) => obj.title === jobPost.title && obj.company === jobPost.company,
      )
      const jobPostKey = generateKeyMap(jobPost)

      //checking if the job post is qualifed
      if (
        !alreadyPresentInJobArray &&
        !reviewedJob.has(jobPostKey) &&
        termInTitleIncluded &&
        jobPost.postedData <= 7 &&
        !tileLowerCase.includes('sap')
      ) {
        jobsArray.push(jobPost)
      }
    })

    return jobsArray
  } catch (error: any) {
    console.log('Cpl - Error principal function:', error.message, responseBody)
    return jobsArray
  }
}

