import { JobPost } from '../utils/jobpost-structure'
import {
  calculateDaysDifference,
  delayExec,
  generateKeyMap,
} from '../utils/helper-functions'
import { termsInTitle } from '../utils/constants'
import {
  getChatGptQualificationJD,
  getChatGptQualificationJDv2,
} from '../utils/chatgpt'

//Filter request: qa - uk,ie,... - sorted posted date
export async function searchJobsHays(
  term: any,
  page = 1,
  reviewedJob: Map<string, JobPost>,
): Promise<Array<JobPost>> {
  let jobsArray: Array<JobPost> = new Array<JobPost>()
  const offset = (page - 1) * 10

  let searchCountries = [
    {
      code: 'gb/en',
      api: 'jobsweb',
      activationUrl: `/job-search/${term}-jobs?q=${term}&location=&specialismId=&subSpecialismId=&locationf=&industryf=&sortType=2&jobType=-1&flexiWorkType=-1&payTypefacet=-1&minPay=-1&maxPay=-1&jobSource=HaysGCJ&searchPageTitle=${term}%20Jobs%20in%20the%20UK%20%7C%20Hays%20Recruitment%20UK&searchPageDesc=Explore%20${term}%20job%20opportunities%20with%20Hays%20Recruitment%20UK.%20Compare%20salaries%20and%20apply%20for%20a%20role%20online%20today!`,
      urlCountry: 'co.uk',
    },
    // {
    //   code: 'ie/en',
    //   api: 'jobsweb',
    //   activationUrl: `/job-search/${term}-jobs?q=${term}&location=&specialismId=&subSpecialismId=&locationf=&industryf=&sortType=2&jobType=-1&flexiWorkType=-1&payTypefacet=-1&minPay=-1&maxPay=-1&jobSource=HaysGCJ&searchPageTitle=${term}%20Jobs%20in%20Ireland%20%7C%20Hays%20Recruitment%20Ireland&searchPageDesc=Explore%20${term}%20job%20opportunities%20with%20Hays%20Recruitment%20Ireland.%20Compare%20salaries%20and%20apply%20for%20a%20role%20online%20today!&distancef=`,
    //   urlCountry: 'ie',
    // },
    // {
    //   code: 'ca/en',
    //   api: 'jobsweb',
    //   activationUrl: `/job-search/${term}-jobs?q=${term}&location=&specialismId=&subSpecialismId=&locationf=&industryf=&sortType=2&jobType=-1&flexiWorkType=-1&payTypefacet=-1&minPay=-1&maxPay=-1&jobSource=HaysGCJ&searchPageTitle=${term}%20Jobs%20in%20Canada%20%7C%20Hays%20Recruitment%20Canada&searchPageDesc=Explore%20${term}%20job%20opportunities%20with%20Hays%20Recruitment%20Canada.%20Compare%20salaries%20and%20apply%20for%20a%20role%20online%20today!`,
    //   urlCountry: 'ca',
    // },
    // {
    //   code: 'fr/fr',
    //   api: 'jobsweb',
    //   activationUrl: `/recherche-emploi/${term}-offre?q=${term}&location=&specialismId=&subSpecialismId=&locationf=&industryf=&sortType=2&jobType=-1&flexiWorkType=-1&payTypefacet=-1&minPay=-1&maxPay=-1&jobSource=HaysGCJ&searchPageTitle=Offres%20d'emploi%20de%20${term}%20en%20France%20%7C%20Hays%20Recruitment%20France&searchPageDesc=Explorez%20les%20offres%20de%20${term}%20avec%20Hays%20France.%20Comparez%20les%20salaires%20et%20appliquez%20en%20ligne%20d%C3%A8s%20aujourd'hui%20!`,
    //   urlCountry: 'fr',
    // },
    // {
    //   code: 'es/es',
    //   api: 'jobsweb',
    //   activationUrl: `/busqueda-empleo/${term}-empleos?q=${term}&location=&specialismId=&subSpecialismId=&locationf=&industryf=&sortType=2&jobType=-1&flexiWorkType=-1&payTypefacet=-1&minPay=-1&maxPay=-1&jobSource=HaysGCJ&searchPageTitle=${term}%20Empleo%20en%20Spain%20%7C%20Hays%20Selecci%C3%B3n%20Spain&searchPageDesc=Explora%20todas%20las%20nuevas%20oportunidades%20de%20empleo%20que%20tenemos%20en%20${term}%20con%20Hays%20Spain.%20Compara%20los%20salarios%20y%20aplica%20online.`,
    //   urlCountry: 'es',
    // },
    // {
    //   code: 'nl/nl',
    //   api: 'jobsv2',
    //   activationUrl: `/vacatures-zoeken/${term}-vacatures?q=${term}&location=&specialismId=&subSpecialismId=&locationf=&industryf=&sortType=2&jobType=-1&flexiWorkType=-1&payTypefacet=-1&minPay=-1&maxPay=-1&jobSource=HaysGCJ&searchPageTitle=${term}%20vacatures%20in%20Netherlands%20%7C%20Hays%20Recruitment%20Netherlands&searchPageDesc=Vind%20de%20juiste%20${term}%20vacature%20bij%20Hays%20Recruitment%20Netherlands.%20Bekijk%20alle%20vacatures%20en%20solliciteer%20direct.`,
    //   urlCountry: 'nl',
    // },
    // {
    //   code: 'bel/bf',
    //   api: 'jobsv2',
    //   activationUrl: `/recherche-emploi/test-offre?q=${term}&location=&specialismId=&subSpecialismId=&locationf=&industryf=&sortType=2&jobType=-1&flexiWorkType=-1&payTypefacet=-1&minPay=-1&maxPay=-1&jobSource=HaysGCJ&searchPageTitle=Offres%20d'emploi%20de%20${term}%20en%20Belgique%20%7C%20Hays%20Recruitment%20Belgique&searchPageDesc=Explorez%20les%20offres%20de%20${term}%20avec%20Hays%20Belgique.%20Comparez%20les%20salaires%20et%20appliquez%20en%20ligne%20d%C3%A8s%20aujourd'hui%20!`,
    //   urlCountry: 'be',
    // },
    // {
    //   code: 'ro/ro',
    //   api: 'jobsv2',
    //   activationUrl: `/locuri-de-munca-cautare/${term}-locuri-de-munca?q=${term}&location=&specialismId=&subSpecialismId=&locationf=&industryf=&sortType=2&jobType=-1&flexiWorkType=-1&payTypefacet=-1&minPay=-1&maxPay=-1&jobSource=HaysGCJ&searchPageTitle=${term}%20Locuri%20de%20munc%C4%83%20%C3%AEn%20Romania%20%7C%20Hays%20Recruitment%20Romania&searchPageDesc=Explora%C8%9Bi%20oportunit%C4%83%C8%9Bile%20de%20angajare%20pentru%20pozi%C5%A3ia%20de%20${term}%20de%20la%20Hays%20Recruitment%20Romania.%20Compara%C8%9Bi%20salariile%20%C8%99i%20aplica%C8%9Bi%20online%20pentru%20un%20rol%20ast%C4%83zi!`,
    //   urlCountry: 'ro',
    // },
    // {
    //   code: 'se/sv',
    //   api: 'jobsv2',
    //   activationUrl: `/jobb-sokning/${term}-jobb?q=${term}&location=&specialismId=&subSpecialismId=&locationf=&industryf=&sortType=2&jobType=-1&flexiWorkType=-1&payTypefacet=-1&minPay=-1&maxPay=-1&jobSource=HaysGCJ&searchPageTitle=${term}%20Jobb%20i%20Sweden%20%7C%20Hays%20Sweden&searchPageDesc=Hitta%20${term}%20nya%20jobbm%C3%B6jligheter%20med%20Hays%20Sweden.%20J%C3%A4mf%C3%B6r%20l%C3%B6ner%20och%20f%C3%B6r%20en%20tj%C3%A4nst%20online%20idag!%20`,
    //   urlCountry: 'se',
    // },
    // {
    //   code: 'lu/fr',
    //   api: 'jobsv2',
    //   activationUrl: `/recherche-emploi/${term}-offre?q=${term}&location=&specialismId=&subSpecialismId=&locationf=&industryf=&sortType=2&jobType=-1&flexiWorkType=-1&payTypefacet=-1&minPay=-1&maxPay=-1&jobSource=HaysGCJ&searchPageTitle=Offres%20d'emploi%20de%20${term}%20en%20Luxembourg%20%7C%20Hays%20Recruitment%20Luxembourg&searchPageDesc=Explorez%20les%20offres%20de%20${term}%20avec%20Hays%20Luxembourg.%20Comparez%20les%20salaires%20et%20appliquez%20en%20ligne%20d%C3%A8s%20aujourd'hui%20!`,
    //   urlCountry: 'lu',
    // },
    // {
    //   code: 'pl/pl',
    //   api: 'jobsv2',
    //   activationUrl: `/znajdz-prace/${term}-oferty-pracy?q=${term}&location=&specialismId=&subSpecialismId=&locationf=&industryf=&sortType=2&jobType=-1&flexiWorkType=-1&payTypefacet=-1&minPay=-1&maxPay=-1&jobSource=HaysGCJ&searchPageTitle=${term},%20Poland%20%7C%20Oferty%20pracy%20Hays%20Poland&searchPageDesc=Znajd%C5%BA%20prac%C4%99%20jako:%20${term},%20Poland.%20Hays%20Poland%20partnerem%20Twojej%20kariery%20zawodowej.`,
    //   urlCountry: 'pl',
    // },
    // {
    //   code: 'cz/cs',
    //   api: 'jobsv2',
    //   activationUrl: `/hledat-praci/${term}-nabidky-prace?q=${term}&location=&specialismId=&subSpecialismId=&locationf=&industryf=&sortType=0&jobType=-1&flexiWorkType=-1&payTypefacet=-1&minPay=-1&maxPay=-1&jobSource=HaysGCJ&searchPageTitle=Pozice%20${term}%20v%20%C4%8Cesk%C3%A9%20republice%20%7C%20Hays%20Recruitment%20CZ&searchPageDesc=Proch%C3%A1zejte%20pracovn%C3%AD%20nab%C3%ADdky%20na%20roli%20${term}%20s%20Hays%20Recruitment%20CZ.%20Odpov%C4%9Bzte%20na%20pracovn%C3%AD%20pozici%20online%20je%C5%A1t%C4%9B%20dnes!`,
    //   urlCountry: 'cz',
    // },
  ]

  for (let country of searchCountries) {
    let responseBody: any = ''
    const URL = `https://www.hays.${country.urlCountry}/job-detail`
    try {
      const response = await fetch(
        `https://mapi.hays.com/jobportalapi/int/s/${country.code}/jobportal/job/browse/v1/${country.api}`,
        {
          headers: {
            accept: 'application/json',
            'accept-language': 'en-US,en;q=0.9,ro;q=0.8,nl;q=0.7,de;q=0.6',
            activityurl: country.activationUrl,
            authorization:
              'Bearer eyJhbGciOiJIUzUxMiJ9.eyJndWlkIjoiYWJjZWRhNTYtOWE0ZS00Y2YwLTg4MjAtMDA2Y2NjNDg3NmUyIiwiZG9tYWluTmFtZSI6ImdiIiwic3ViIjoiYWJjZWRhNTYtOWE0ZS00Y2YwLTg4MjAtMDA2Y2NjNDg3NmUyIiwiaWF0IjoxNzIxMzk5MzYwLCJuYmYiOjE3MjEzOTkzNjAsImF1ZCI6Imh0dHBzOi8vd3d3LmhheXMuY28udWsvIiwiaXNzIjoiaHR0cHM6Ly9tLmhheXMuY29tIiwiZXhwIjoxNzI5MTc1MzYwfQ.mX1ZadIgiNJGGVT_eDLD672flC_i1QrgPXlNiPW89YtcZefg_Ln3_8BNbOtta9hy6R__AdkKFc8W-t1myZmz2A',
            'cache-control': 'no-cache',
            'content-type': 'application/json',
            priority: 'u=1, i',
            'sec-ch-ua':
              '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'cross-site',
            'x-auth':
              'aDX5UzaKVndUKKfP:5yJumvuhCz7qkdpBRHJ09kN4cnSLfp4Ovrl2ja3I8+w=',
            'x-date': '2024-07-22T09:17:54+0300',
            'x-session': '1977e049-c69a-4f99-94b9-94af1599e2c4',
            Referer: `https://www.hays.${country.urlCountry}/`,
            'Referrer-Policy': 'strict-origin-when-cross-origin',
          },
          body: `{"facetLocation":"","flexibleWorking":"false","fullTime":"false","industry":[],
          "isSponsored":false,"jobType":[],"partTime":"false","query":"${term}","locations":"",
          "salMax":"","salMin":"","sortType":"PUBLISHED_DATE_DESC","specialismId":"",
          "subSpecialismId":"","typeOnlyFilter":"","userAgent":"-Desktop","radius":15,
          "isCrossCountry":false,"isResponseCountry":false,"responseSiteLocale":"","pageToken":\"${offset}\",
          "jobId":"","jobRefrence":"","crossCountryUrl":"","payType":"","type":"search",
          "cookieDomain":".hays.${country.urlCountry}"}`,
          method: 'POST',
        },
      )

      responseBody = await response.json()

      responseBody.data.result.jobs.forEach((jobDetailJson: any) => {
        let formattedDate =
          jobDetailJson.publishDate.year +
          '-' +
          jobDetailJson.publishDate.month +
          '-' +
          jobDetailJson.publishDate.day

        let jobPost = {
          url: jobDetailJson.nonFilterableCustomFields.xLocaleRecordID
            .values[0],
          title: jobDetailJson.title,
          company: 'Unknown company',
          location: jobDetailJson.location,
          postedData: calculateDaysDifference(formattedDate),
          salaryFrom: jobDetailJson.incentives,
          industry: jobDetailJson.department,
          urlCountry: country.urlCountry,
          code: country.code,
          api: country.api,
        }

        const tileLowerCase = jobPost.title.toLowerCase()
        const termInTitleIncluded = termsInTitle.some((word) =>
          tileLowerCase.includes(word),
        )
        const alreadyPresentInJobArray = jobsArray.some(
          (obj) =>
            obj.title === jobPost.title && obj.company === jobPost.company,
        )
        const jobPostKey = generateKeyMap(jobPost)

        if (
          !alreadyPresentInJobArray &&
          !reviewedJob.has(jobPostKey) &&
          //jobPost.postedData <= 7 &&
          termInTitleIncluded
        ) {
          jobsArray.push(jobPost)
        }
      })
    } catch (error: any) {
      console.log(
        `Hays ${country.urlCountry} - Error getting list `,
        error.message,
        responseBody,
      )
    }
  }

  //parsing JDs information
  let i = 0
  for (let job of jobsArray) {
    const activURL = job.url.split(`hays.${job.urlCountry}`)[1]

    const responseJob = await fetch(
      `https://mapi.hays.com/jobportalapi/int/s/${job.code}/jobportal/job/browse/v1/${job.api}`,
      {
        headers: {
          accept: 'application/json',
          activityurl: activURL,
          authorization:
            'Bearer eyJhbGciOiJIUzUxMiJ9.eyJndWlkIjoiYWJjZWRhNTYtOWE0ZS00Y2YwLTg4MjAtMDA2Y2NjNDg3NmUyIiwiZG9tYWluTmFtZSI6ImdiIiwic3ViIjoiYWJjZWRhNTYtOWE0ZS00Y2YwLTg4MjAtMDA2Y2NjNDg3NmUyIiwiaWF0IjoxNzIyMTQ0MzQzLCJuYmYiOjE3MjIxNDQzNDMsImF1ZCI6Imh0dHBzOi8vd3d3LmhheXMuY28udWsvIiwiaXNzIjoiaHR0cHM6Ly9tLmhheXMuY29tIiwiZXhwIjoxNzI5OTIwMzQzfQ.C_8PWsPbBsn2y_djn7vqI_nA8X9mTbkE6IJT7qvv6yUe1Y-rb8GAEFWIQpDXuQ1oKY92b1u4gVuEqWr3iL8QPA',
          'cache-control': 'no-cache',
          'content-type': 'application/json',
          'sec-ch-ua':
            '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"macOS"',
          'x-auth':
            'aDX5UzaKVndUKKfP:BaqT8FSOx/9kqag9cVrogrEkiQ/GeXifJfOOcnZCUY8=',
          'x-date': '2024-07-28T08:26:02+0300',
          'x-session': '1977e049-c69a-4f99-94b9-94af1599e2c4',
          Referer: `https://www.hays.${job.urlCountry}/`,
          'Referrer-Policy': 'strict-origin-when-cross-origin',
        },
        body: `{"facetLocation":"","flexibleWorking":null,"fullTime":null,"industry":[],"isSponsored":false,"jobType":[],"partTime":null,"query":"${job.title}","locations":"","salMax":"","salMin":"","sortType":"RELEVANCE_DESC","specialismId":"Technology","subSpecialismId":"TechXTesting","typeOnlyFilter":"","userAgent":"-Desktop","radius":15,"isCrossCountry":false,"isResponseCountry":false,"responseSiteLocale":"","pageToken":"0","jobId":"","jobRefrence":"","crossCountryUrl":"","payType":"","type":"similarJob","cookieDomain":".hays.${job.urlCountry}"}`,

        method: 'POST',
      },
    )

    // ChatGPT JD qualification
    const responseJDBody: any = await responseJob.json()
    const jobDescription = responseJDBody.data.result.jobs[0].description
    const qualifiedByGpt = await getChatGptQualificationJD(
      jobDescription + 'Rate is' + job.salaryFrom,
    )

    const [status, reason] = qualifiedByGpt?.split('-') ?? []
    job.qualifedGpt = JSON.parse(status)
    job.reasonGpt = reason
    i++
    // Slow down request per page to don't be blocked
    await delayExec(3000)
  }

  return jobsArray
}

