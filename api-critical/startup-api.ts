import { JobPost } from '../utils/jobpost-structure'
import { calculateDaysDifference, generateKeyMap } from '../utils/helper-functions'
import { termsInTitle } from '../utils/constants'

//only filter request: qa - remote
// we don't check last 7 days job because we don't have that information in the api
export async function searchJobStartup(
  term: any,
  page = 1,
  reviewedJob: Map<string, JobPost>,
): Promise<Array<JobPost>> {
  let jobsArray: Array<JobPost> = new Array<JobPost>()
  let responseBody : any='';
  try {
      const offset = (page - 1) * 20

    const response = await fetch("https://4cqmtmmk73-dsn.algolia.net/1/indexes/Post_production/query?x-algolia-agent=Algolia%20for%20JavaScript%20(4.24.0)%3B%20Browser%20(lite)&x-algolia-api-key=NDc5YWZhM2UyNzlkY2M3ZDE5OWVhNDA2ZTI2NDIxNmVlNzY1MzNiZGZiOTE5YzMwNWJlM2Y0OWE0ZmFhNzk4ZnZhbGlkVW50aWw9MTcyMDgwMjUwNiZyZXN0cmljdEluZGljZXM9UG9zdF9wcm9kdWN0aW9uJTJDUGxhY2VzX3Byb2R1Y3Rpb24%3D&x-algolia-application-id=4CQMTMMK73", {
      "headers": {
        "accept": "*/*",
        "accept-language": "en-US,en;q=0.9,ro;q=0.8,nl;q=0.7,de;q=0.6",
        "content-type": "application/x-www-form-urlencoded",
        "sec-ch-ua": "\"Not/A)Brand\";v=\"8\", \"Chromium\";v=\"126\", \"Google Chrome\";v=\"126\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"macOS\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "cross-site",
        "Referer": "https://startup.jobs/",
        "Referrer-Policy": "strict-origin-when-cross-origin"
      },
      "body": `{\"query\":\"${term}\",\"attributesToRetrieve\":[\"path\",\"company_slug\",\"company_logo_url\",\"title\",\"company_name\",\"_tags\",\"remote\",\"location\",\"location_html\"],\"hitsPerPage\":25,\"page\":0,\"facets\":[\"commitment\"],\"filters\":\"\",\"tagFilters\":[\"\"],\"facetFilters\":[[\"commitment:Full-Time\",\"commitment:Part-Time\",\"commitment:Internship\",\"commitment:Contractor\"],\"remote:true\"],\"ruleContexts\":[],\"analyticsTags\":[\"frontend\"]}`,
      "method": "POST"
    });

    responseBody = await response.json()
    const URL = 'https://startup.jobs'
    
    responseBody.hits.forEach((job: any) => {
      let jobPost:JobPost = {
        url: URL + job.path,
        title: job.title,
        company: job.company_name, 
        location: job.location,
        postedData: 99,
      }

      const tileLowerCase = jobPost.title.toLowerCase()
      const termInTitleIncluded = termsInTitle.some((word) =>
        tileLowerCase.includes(word),
      )


      const alreadyPresentInJobArray = jobsArray.some(obj => obj.title === jobPost.title && obj.company === jobPost.company );

      const locationLowercase = jobPost.location.toLowerCase()
      const jobPostKey = generateKeyMap(jobPost)
  
      if (
        !alreadyPresentInJobArray &&
        !reviewedJob.has(jobPostKey) &&
        termInTitleIncluded &&
        !tileLowerCase.includes('sap') &&
        !locationLowercase.includes('india') 
        ) {
        jobsArray.push(jobPost)
      }

      
    })


    return jobsArray
  } catch (error: any) {
    console.log('Startup - Error principal function:', error.message, responseBody )
    return jobsArray
  }
}
