import { chromium, Page, Locator } from '@playwright/test'
import {
  parseAndFormatDate,
  calculateDaysDifference,
  isAnySearchWordInTitle,
  createJobMapFromFile,
  generateKeyMap,
  flipDate,
  getTextFromLocator,
} from '../utils/helper-functions'
import { JobPost } from '../utils/jobpost-structure'

/*
  API is not dynamic
  URL can't be set 
  Filter: 'qa' in title - remote - europe - sorted latest - last 7 daysß
*/
export async function searchJobsJobserve(
  term: string,
  reviewedJob: Map<string, JobPost>,
): Promise<Array<JobPost>> {
  let jobsArray: Array<JobPost> = []
  const browser = await chromium.launch({ headless: true, slowMo: 200 })
  const context = await browser.newContext()
  const page = await context.newPage()
  page.setDefaultTimeout(15000)

  const URL = 'https://jobserve.com'

  try {
    await page.goto(URL)

    //set filter
    await page.locator('.jobsearch #tab_pqs').click()
    await page.locator('#txtTitle').fill(term)
    await page.locator('#chkRemoteWorking').click()
    await page.locator('#btnSearch').click()
    await page.locator('#searchtogglelink').click()
    await page.locator('#amendsearch').click()
    await page.locator('#MyCountriesConfig').click()
    await page.locator('#cbgroupitemEurope').click()
    await page.locator('#btn_submit').click()
    await page.locator('#sortSelect').click()
    await page.locator('#lkLt').click()
    await page.locator('#viewPageSelect a#numberSelect').click()
    await page.locator('#lk200').click()
    await page.waitForTimeout(3000)

    const jobPostsLocator: Locator = await page.locator('.jobListItem')
    const jobPostNumber: number = await jobPostsLocator.count()

    const jobTileLocator: string = '.jobListPosition'
    const companyLocator: string =
      '.jobListDetailsPanel > .jobListDetail:nth-of-type(5) a'
    const locationLocator: string = '#summlocation'
    const postedDayLocator: string = '#summposteddate'
    const salaryLocator: string = '#summrate'
    const employmentTypeLocator: string = '#summtype'
    const detailsLocator: string = '.jobListSkills'

    //parsing each jobDetails element
    for (let i = 0; i < jobPostNumber; i++) {
      let title: string = await getTextFromLocator(
        jobPostsLocator,
        jobTileLocator,
        i,
      )
      let company = await getTextFromLocator(jobPostsLocator, companyLocator, i)
      let location: string = await getTextFromLocator(
        jobPostsLocator,
        locationLocator,
        i,
      )
      let link: string =
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
      let employmentType: string = await getTextFromLocator(
        jobPostsLocator,
        employmentTypeLocator,
        i,
      )
      let details: string = await getTextFromLocator(
        jobPostsLocator,
        detailsLocator,
        i,
      )

      //formating date in number
      let formatDate: string = flipDate(stringDate)
      let date: number = calculateDaysDifference(formatDate)

      let jobPost: JobPost = {
        url: URL + link,
        title: title,
        company: company,
        location: location,
        postedData: date,
        salaryFrom: salary,
        employmentType: employmentType,
      }

      const alreadyPresentInJobArray = jobsArray.some(
        (obj) => obj.title === jobPost.title && obj.company === jobPost.company,
      )
      const jobPostKey = generateKeyMap(jobPost)

      if (!alreadyPresentInJobArray && !reviewedJob.has(jobPostKey)) {
        jobsArray.push(jobPost)
      }
    }

    browser.close()
    return jobsArray
  } catch (error: any) {
    console.log('Jobserve - Error principal function:', error.message)
    browser.close()
    return jobsArray
  }
}
