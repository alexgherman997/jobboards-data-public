import { JobPost } from '../utils/jobpost-structure'
import {
  generateKeyMap,
  transformPostedTimeToDays,
} from '../utils/helper-functions'
import { termsInTitle } from '../utils/constants'
import * as cheerio from 'cheerio'

//Filter query: qa - Worldwide
export async function searchJobsEuremotejobs(
  term: any,
  page = 1,
  reviewedJob: Map<string, JobPost>,
): Promise<Array<JobPost>> {
  let jobsArray: Array<JobPost> = new Array<JobPost>()
  let responseBody: any = ''
  try {
    const response = await fetch(
      'https://euremotejobs.com/jm-ajax/get_listings/',
      {
        headers: {
          accept: '*/*',
          'accept-language': 'en-US,en;q=0.9,ro;q=0.8,nl;q=0.7,de;q=0.6',
          'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
          priority: 'u=1, i',
          'sec-ch-ua':
            '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"macOS"',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-origin',
          'x-requested-with': 'XMLHttpRequest',
          cookie:
            'PHPSESSID=6d9c45566e6e3acec2f9a6d4a842162c; mailchimp_landing_site=https%3A%2F%2Feuremotejobs.com%2F; _ga=GA1.1.1282348347.1720091153; sbjs_migrations=1418474375998%3D1; sbjs_current_add=fd%3D2024-07-04%2011%3A05%3A54%7C%7C%7Cep%3Dhttps%3A%2F%2Feuremotejobs.com%2F%7C%7C%7Crf%3Dhttps%3A%2F%2Fwww.google.ro%2F; sbjs_first_add=fd%3D2024-07-04%2011%3A05%3A54%7C%7C%7Cep%3Dhttps%3A%2F%2Feuremotejobs.com%2F%7C%7C%7Crf%3Dhttps%3A%2F%2Fwww.google.ro%2F; sbjs_current=typ%3Dorganic%7C%7C%7Csrc%3Dgoogle%7C%7C%7Cmdm%3Dorganic%7C%7C%7Ccmp%3D%28none%29%7C%7C%7Ccnt%3D%28none%29%7C%7C%7Ctrm%3D%28none%29%7C%7C%7Cid%3D%28none%29%7C%7C%7Cplt%3D%28none%29%7C%7C%7Cfmt%3D%28none%29%7C%7C%7Ctct%3D%28none%29; sbjs_first=typ%3Dorganic%7C%7C%7Csrc%3Dgoogle%7C%7C%7Cmdm%3Dorganic%7C%7C%7Ccmp%3D%28none%29%7C%7C%7Ccnt%3D%28none%29%7C%7C%7Ctrm%3D%28none%29%7C%7C%7Cid%3D%28none%29%7C%7C%7Cplt%3D%28none%29%7C%7C%7Cfmt%3D%28none%29%7C%7C%7Ctct%3D%28none%29; tk_or=%22https%3A%2F%2Fwww.google.ro%2F%22; cookieyes-consent=consentid:SFRMb1pBdUJlaG9MUHlZUVBQcVQ0Z2VlaUdlbHdSUUQ,consent:yes,action:yes,necessary:yes,functional:yes,analytics:yes,performance:yes,advertisement:yes,other:yes; tk_lr=%22%22; _ga_VQ7J5GMZ4T=GS1.1.1720708093.5.1.1720708112.0.0.0; tk_r3d=%22%22; sbjs_udata=vst%3D6%7C%7C%7Cuip%3D%28none%29%7C%7C%7Cuag%3DMozilla%2F5.0%20%28Macintosh%3B%20Intel%20Mac%20OS%20X%2010_15_7%29%20AppleWebKit%2F537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome%2F126.0.0.0%20Safari%2F537.36; _ga_CPPVFEL04G=GS1.1.1721802149.7.1.1721802499.0.0.0; sbjs_session=pgs%3D13%7C%7C%7Ccpg%3Dhttps%3A%2F%2Feuremotejobs.com%2Fjob%2Fsoftware-engineer-trust-and-safety-product%2F',
          Referer: 'https://euremotejobs.com/',
          'Referrer-Policy': 'strict-origin-when-cross-origin',
        },
        body: `lang=&search_keywords=${term}&search_location=&filter_job_type%5B%5D=4-day-week&filter_job_type%5B%5D=ai&filter_job_type%5B%5D=bilingual&filter_job_type%5B%5D=czech&filter_job_type%5B%5D=dutch&filter_job_type%5B%5D=finnish&filter_job_type%5B%5D=freelance&filter_job_type%5B%5D=french&filter_job_type%5B%5D=full-time&filter_job_type%5B%5D=german&filter_job_type%5B%5D=internship&filter_job_type%5B%5D=italian&filter_job_type%5B%5D=japanese&filter_job_type%5B%5D=jobs-in-crypto&filter_job_type%5B%5D=multilingual&filter_job_type%5B%5D=part-time&filter_job_type%5B%5D=polish&filter_job_type%5B%5D=portuguese&filter_job_type%5B%5D=romanian&filter_job_type%5B%5D=russian&filter_job_type%5B%5D=slovak&filter_job_type%5B%5D=spanish&filter_job_type%5B%5D=swedish&filter_job_type%5B%5D=temporary&filter_job_type%5B%5D=ukranian&filter_job_type%5B%5D=web3&filter_job_type%5B%5D=&per_page=20&orderby=featured&featured_first=false&order=DESC&page=${page}&show_pagination=false&form_data=search_keywords%3Dqa%26search_region%3D0%26filter_job_type%255B%255D%3D4-day-week%26filter_job_type%255B%255D%3Dai%26filter_job_type%255B%255D%3Dbilingual%26filter_job_type%255B%255D%3Dczech%26filter_job_type%255B%255D%3Ddutch%26filter_job_type%255B%255D%3Dfinnish%26filter_job_type%255B%255D%3Dfreelance%26filter_job_type%255B%255D%3Dfrench%26filter_job_type%255B%255D%3Dfull-time%26filter_job_type%255B%255D%3Dgerman%26filter_job_type%255B%255D%3Dinternship%26filter_job_type%255B%255D%3Ditalian%26filter_job_type%255B%255D%3Djapanese%26filter_job_type%255B%255D%3Djobs-in-crypto%26filter_job_type%255B%255D%3Dmultilingual%26filter_job_type%255B%255D%3Dpart-time%26filter_job_type%255B%255D%3Dpolish%26filter_job_type%255B%255D%3Dportuguese%26filter_job_type%255B%255D%3Dromanian%26filter_job_type%255B%255D%3Drussian%26filter_job_type%255B%255D%3Dslovak%26filter_job_type%255B%255D%3Dspanish%26filter_job_type%255B%255D%3Dswedish%26filter_job_type%255B%255D%3Dtemporary%26filter_job_type%255B%255D%3Dukranian%26filter_job_type%255B%255D%3Dweb3%26filter_job_type%255B%255D%3D`,
        method: 'POST',
      },
    )

    const reponseBody = await response.json()
    const htmlResponseString = reponseBody.html
    const $ = cheerio.load(htmlResponseString)
    const jobs = $('li.job_listing')

    jobs.each((i, jobDetail) => {
      let urlId = $(jobDetail).attr('data-href') ?? ''
      let title = $(jobDetail).find('h3.job_listing-title').text()
      let location = $(jobDetail).find('.google_map_link').text()
      let postedDate = $(jobDetail).find('.job_listing-date').text()
      let postedDateInDays = transformPostedTimeToDays(postedDate)

      let jobPost = {
        url: urlId,
        title: title,
        company: 'Unknown company',
        location: location,
        postedData: postedDateInDays,
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
      'Euremotejobs - Error principal function:',
      error.message,
      responseBody,
    )
    return jobsArray
  }
}
