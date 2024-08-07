import { chromium, Locator } from '@playwright/test'
import {
  isAnySearchWordInTitle,
  generateKeyMap,
  getTextFromLocator,
  transformPostedTimeToDays,
} from '../utils/helper-functions'
import { JobPost } from '../utils/jobpost-structure'
import { termsInTitle } from '../utils/constants'
import * as dotenv from 'dotenv'
dotenv.config()

/*
  API is found, but has Captha Cloudflare
  Filter: 'qa' keywords custom from website dropdown - remote - worldwide - sorted latest 
*/
export async function searchJobsHimalayas(
  term: string,
  reviewedJob: Map<string, JobPost>,
): Promise<Array<JobPost>> {
  let jobsArray: Array<JobPost> = []
  const browser = await chromium.launch({ headless: false, slowMo: 200 })
  const context = await browser.newContext()
  const page = await context.newPage()
  page.setDefaultTimeout(5000)

  const URL = 'https://himalayas.app/'
  const searchURL = `https://himalayas.app/jobs/worldwide/${term}?sort=recent`

  try {
    //set filter in url
    await page.goto(searchURL)
    await page.waitForTimeout(3000)

    const jobPostsLocator: Locator = await page.locator('article')
    const jobPostNumber: number = await jobPostsLocator.count()
    const jobTileLocator: string = 'a.text-xl'
    const companyLocator: string = 'div.mb-6 .gap-x-4 a.text-gray-900'
    const postedDayLocator: string = 'time'
    const salaryLocator: string = '.gap-x-4+ .text-gray-600'

    //parsing each jobDetails element
    for (let i = 0; i < jobPostNumber; i++) {
      let title: string = await getTextFromLocator(
        jobPostsLocator,
        jobTileLocator,
        i,
      )
      let company: string = await getTextFromLocator(
        jobPostsLocator,
        companyLocator,
        i,
      )
      const link: string =
        (await jobPostsLocator
          .nth(i)
          .locator(jobTileLocator)
          .getAttribute('href')) ?? ''
      let stringDate: any = await getTextFromLocator(
        jobPostsLocator,
        postedDayLocator,
        i,
      )
      let salary: string = await getTextFromLocator(
        jobPostsLocator,
        salaryLocator,
        i,
      )

      //formating date in number
      let date = transformPostedTimeToDays(stringDate)

      let jobPost: JobPost = {
        url: URL + link,
        title: title,
        company: company,
        location: 'Unknown',
        postedData: date,
        salaryFrom: salary,
      }

      let searchWordInTitle = isAnySearchWordInTitle(jobPost.title, termsInTitle)
      const alreadyPresentInJobArray = jobsArray.some(
        (obj) => obj.title === jobPost.title && obj.company === jobPost.company,
      )
      const jobPostKey = generateKeyMap(jobPost)

      if (
        !alreadyPresentInJobArray &&
        !reviewedJob.has(jobPostKey) &&
        searchWordInTitle &&
        jobPost.postedData <= 7
      ) {
        jobsArray.push(jobPost)
      }
    }

    browser.close()
    return jobsArray
  } catch (error: any) {
    console.log('Himalayas - Error principal function:', error.message)
    browser.close()
    return jobsArray
  }
}

//searchJobsHimalayas('quality-assurance', new Map<any, any>())
// qa
// test-automation
// quality-assurance
