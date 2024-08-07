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
  API - cookies expires every 2 days - to much manintenance -> ui solution 
  Filter: 'qa' keyword - remote - europe - sorted latest(default) - first page(few new result per day)
  Note: detected in headless mode, working in headed mode
  */
export async function searchStartupJobs(
  term: string,
  reviewedJob: Map<string, JobPost>,
): Promise<Array<JobPost>> {
  let jobsArray: Array<JobPost> = []
  const browser = await chromium.launch({ headless: false, slowMo: 200 })
  const context = await browser.newContext()
  const page = await context.newPage()
  page.setDefaultTimeout(5000)

  const URL = 'https://startup.jobs'
  const searchURL = `https://startup.jobs/?q=${term}&remote=true`

  try {
    //set filter in url
    await page.goto(searchURL)

    await page.waitForTimeout(5000)

    const jobPostsLocator: Locator = await page.locator(
      '[data-search-target="hits"] > div',
    )
    const jobPostNumber: number = await jobPostsLocator.count()
    const jobTileLocator: string = 'a.pt-1'
    const companyLocator: string = 'a.py-1'

    //parsing each jobDetails element
    for (let i = 0; i < jobPostNumber; i++) {
      let title: string = await getTextFromLocator(jobPostsLocator,jobTileLocator, i)
      let company: string = await getTextFromLocator(jobPostsLocator,companyLocator, i)
      const link: string =
        (await jobPostsLocator.nth(i).locator(jobTileLocator).getAttribute('href')) ?? ''

      let jobPost: JobPost = {
        url: URL + link,
        title: title,
        company: company,
        location: 'Unknown',
        postedData: 99,
      }

      const tileLowerCase = jobPost.title.toLowerCase()
      let searchWordInTitle = isAnySearchWordInTitle(jobPost.title, termsInTitle)
      const alreadyPresentInJobArray = jobsArray.some(
        (obj) => obj.title === jobPost.title && obj.company === jobPost.company,
      )
      const jobPostKey = generateKeyMap(jobPost)

      if (
        !alreadyPresentInJobArray &&
        !reviewedJob.has(jobPostKey) &&
        searchWordInTitle &&
        !tileLowerCase.includes('sap')
      ) {
        jobsArray.push(jobPost)
      }
    }

    browser.close()
    return jobsArray
  } catch (error: any) {
    console.log('Startup - Error principal function:', error.message)
    browser.close()
    return jobsArray
  }
}
