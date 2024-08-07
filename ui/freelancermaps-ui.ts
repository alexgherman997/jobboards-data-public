import { chromium, Locator } from '@playwright/test'
import {
  parseAndFormatDate,
  calculateDaysDifference,
  isAnySearchWordInTitle,
  createJobMapFromFile,
  generateKeyMap,
  getTextFromLocator,
} from '../utils/helper-functions'
import { JobPost } from '../utils/jobpost-structure'
import { termsInTitle } from '../utils/constants'
import * as dotenv from 'dotenv'
dotenv.config()

/*
  API is not found  
  Filter: 'qa' keyword - remote - all countries - sorted latest 
*/
export async function searchJobsFreelancermap(
  term: string,
  reviewedJob: Map<string, JobPost>,
): Promise<Array<JobPost>> {
  let jobsArray: Array<JobPost> = []
  const browser = await chromium.launch({ headless: true, slowMo: 200 })
  const context = await browser.newContext()
  const page = await context.newPage()
  page.setDefaultTimeout(5000)

  const URL = 'https://www.freelancermap.de'
  const searchURL = `https://www.freelancermap.de/projektboerse.html?remoteInPercent%5B0%5D=100&query=${term}&countries%5B%5D=%5B%5D&continents%5B0%5D=-1&sort=1&pagenr=1`


  try {
    await page.goto(URL)

    //login
    await page.locator('button#onetrust-accept-btn-handler').click()
    await page.locator('a#login-btn').click()
    await page.locator('input#login').fill(process.env.EMAIL!)
    await page.locator('input#password').fill(process.env.PASSWORD!)
    await page.getByRole('button', { name: 'Anmelden', exact: true }).click()

    //set filter in url
    await page.goto(searchURL)
    await page.waitForTimeout(3000)

    const jobPostsLocator: Locator = await page.locator('.project-container')
    const jobPostNumber: number = await jobPostsLocator.count()
    const jobTileLocator: string = '.project-title'
    const companyLocator: string = 'a.company'
    const locationLocator: string = '.project-location'
    const postedDayLocator: string = 'span.created-date'

    let date = 0
    while (date <= 7) {
      //parsing each jobDetails element
      for (let i = 0; i < jobPostNumber; i++) {
        let title: string = await getTextFromLocator(jobPostsLocator,jobTileLocator, i)
        let company: string = await getTextFromLocator(jobPostsLocator,companyLocator, i)
        let location: string = await getTextFromLocator(jobPostsLocator,locationLocator, i)
        const link: string =
          (await jobPostsLocator.nth(i).locator(jobTileLocator).getAttribute('href')) ?? ''
        let stringDate: any = await getTextFromLocator(jobPostsLocator,postedDayLocator, i)

        //formating date in number
        stringDate = stringDate.match(/\d{2}\.\d{2}\.\d{4}/)[0]
        stringDate = parseAndFormatDate(stringDate)
        date = calculateDaysDifference(stringDate)

        let jobPost: JobPost = {
          url: URL + link,
          title: title,
          company: company,
          location: location,
          postedData: date,
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
      await page.locator('div.next').click()
      await page.waitForTimeout(3000)
    }

    browser.close()
    return jobsArray
  } catch (error: any) {
    console.log('Freelancermap - Error principal function:', error.message)
    browser.close()
    return jobsArray
  }
}

//searchJobsFreelancermap('test', new Map<any, any>())
