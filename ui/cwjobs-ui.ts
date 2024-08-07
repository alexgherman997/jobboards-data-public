import { chromium, expect, Locator } from '@playwright/test'
import {
  isAnySearchWordInTitle,
  generateKeyMap,
  getTextFromLocator,
  transformPostedTimeToDays,
  calculateDaysDifference,
  getAttributeFromLocator,
} from '../utils/helper-functions'
import { JobPost } from '../utils/jobpost-structure'
import { termsInTitle } from '../utils/constants'
import * as dotenv from 'dotenv'
dotenv.config()

/*
  API is not found  
  Filter: 'qa' keyword - remote - europe - sorted latest - last 7 days
  - don't need to add other countries like UK - Europe cover everything
  - only headed execution is working for 5+ pages
  - only cliking the next button is working for pagination
  - slowmo: 500 - to avoid website crash
*/

export async function searchJobsCwjobs(
  term: string,
  reviewedJob: Map<string, JobPost>,
): Promise<Array<JobPost>> {
  let jobsArray: Array<JobPost> = []
  const browser = await chromium.launch({ headless: false, slowMo: 500 })
  const context = await browser.newContext()
  const page = await context.newPage()
  page.setDefaultTimeout(5000)

  const URL = 'https://www.cwjobs.co.uk'
  let searchURL = `https://www.cwjobs.co.uk/jobs/work-from-home/${term}/in-europe?radius=20&sort=2&action=sort_publish&postedWithin=7&page=1`

  try {
    //set filter in url
    await page.goto(searchURL, { timeout: 30000 })
    await page.locator('#ccmgt_explicit_accept').click()

    let numberPageString: string = await page
      .locator('[aria-relevant="additions text"]')
      .innerText({ timeout: 30000 })
    let numberOfPages: number = parseInt(
      numberPageString.match(/Page \d+ of (\d+)/)![1],
      10,
    )

    let j = 1
    do {
      // search based on URL(not working as expected)
      // searchURL = `https://www.cwjobs.co.uk/jobs/work-from-home/${term}/in-europe?radius=20&sort=2&action=sort_publish&postedWithin=7&page=${j}`
      // await page.goto(searchURL)
      //await page.waitForTimeout(3000)

      if (j > 1)
        await page.locator('a[aria-label="Next"]').click({ timeout: 30000 })

      let jobPostsLocator: Locator = await page.locator(
        'article[data-at="job-item"]',
      )
      await expect(jobPostsLocator.first()).toBeVisible({ timeout: 30000 })
      let jobPostNumber: number = await jobPostsLocator.count()
      let jobTileLocator: string = '[data-testid="job-item-title"]'
      let companyLocator: string = '[data-at="job-item-company-name"]'
      let locationLocator: string = '[data-at="job-item-location"]'
      let postedDayLocator: string = 'time'
      let salaryLocator: string = '[data-at="job-item-salary-info"]'

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
        let location: string = await getTextFromLocator(
          jobPostsLocator,
          locationLocator,
          i,
        )
        const link: string = await getAttributeFromLocator(
          jobPostsLocator,
          jobTileLocator,
          i,
          'href',
        )
        const stringDate: string = await getAttributeFromLocator(
          jobPostsLocator,
          postedDayLocator,
          i,
          'datetime',
        )
        let salary: string = await getTextFromLocator(
          jobPostsLocator,
          salaryLocator,
          i,
        )

        //formating date in number
        let date = calculateDaysDifference(stringDate)

        let jobPost: JobPost = {
          url: searchURL,
          title: title,
          company: company,
          location: location,
          postedData: date,
          salaryFrom: salary,
          pageNumber: j,
        }

        let searchWordInTitle = isAnySearchWordInTitle(
          jobPost.title,
          termsInTitle,
        )
        const alreadyPresentInJobArray = jobsArray.some(
          (obj) =>
            obj.title === jobPost.title && obj.company === jobPost.company,
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

      j++
    } while (j <= numberOfPages)

    browser.close()
    return jobsArray
  } catch (error: any) {
    console.log('Cwjobs - Error principal function:', error.message)
    browser.close()
    return jobsArray
  }
}

//Debug
//searchJobsCwjobs('test', new Map<any, any>())
