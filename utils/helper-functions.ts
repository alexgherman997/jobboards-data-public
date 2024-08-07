import * as fs from 'fs'
import { JobPost } from './jobpost-structure'
import { Locator } from '@playwright/test'

/**
 * Generates a composite key for a job posting based on its title and company.
 *
 * This function combines the `title` and `company` properties of a job posting
 * to create a unique identifier string. The generated key can be used to
 * identify and differentiate job postings, especially when filtering out
 * duplicates.
 *
 * @param {JobPost} job - The job posting object containing the title and company.
 * @returns {string} - The composite key in the format "title-company".
 */
export function generateKeyMap(job: JobPost): string {
  return `${job.title}-${job.company}`
}

/**
 * Creates a Map of job posts from a JSON file.
 *
 * @param {string} filePath - The path to the JSON file containing the job posts.
 * @returns {Map<string, JobPost>} A Map where the keys are job URLs and the values are job posts.
 */
export function createJobMapFromFile(filePath: string): Map<string, JobPost> {
  const fileContent = fs.readFileSync(filePath, 'utf-8')
  const jobArray: JobPost[] = JSON.parse(fileContent)

  const jobMap = new Map<string, JobPost>()

  jobArray.forEach((job) => {
    jobMap.set(generateKeyMap(job), job)
  })

  return jobMap
}

/**
 * Saves an array of job posts to a file in JSON format.
 *
 * @param {string} filePath - The path to the file where the job array should be saved.
 * @param {Array<JobPost>} jobArray - The array of job posts to be saved.
 * @returns {void}
 */
export function saveJobArrayToFile(
  filePath: string,
  jobArray: Array<JobPost>,
): void {
  const jsonString = JSON.stringify(jobArray, null, 2)
  fs.writeFileSync(filePath, jsonString, 'utf-8')
}

/**
 * Parses a date string in "DD.MM.YYYY" format and returns it in "YYYY-MM-DD" format.
 *
 * @param {string} dateString - The input date string in "DD.MM.YYYY" format.
 * @returns {string} The formatted date string in "YYYY-MM-DD" format.
 */
export function parseAndFormatDate(dateString: string): string {
  const [day, month, year] = dateString.split('.')
  const inputDate = new Date(`${year}-${month}-${day}`)

  const formattedYear = inputDate.getUTCFullYear()
  const formattedMonth = String(inputDate.getUTCMonth() + 1).padStart(2, '0')
  const formattedDay = String(inputDate.getUTCDate()).padStart(2, '0')

  return `${formattedYear}-${formattedMonth}-${formattedDay}`
}

//flip date format from day/month/year to month/day/year
export function flipDate(dateString: string) {
  const [month, day, year] = dateString.split('/')
  return `${day}/${month}/${year}`
}

/**
 * Calculates the difference in days between the current date and the input date.
 *
 * @param {string} dateString - The input date as a string.
 * @returns {number} The difference in days between the current date and the input date.
 * date format - year-month-date
 * example: 2024-07-22T06:39:55.267Z
 */
export function calculateDaysDifference(dateString: string): number {
  const inputDate = new Date(dateString)
  const currentDate = new Date()
  const differenceInTime = currentDate.getTime() - inputDate.getTime()
  const differenceInDays = Math.floor(differenceInTime / (1000 * 60 * 60 * 24))
  return differenceInDays
}

/**
 * Converts a given string to a URL-friendly slug.
 *
 * @param {string} title - The input string to be converted to a slug.
 * @returns {string} The URL-friendly slug.
 */
export function convertToSlug(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Transforms a time-posted string into the corresponding number of days.
 * @param {string} input - The input string describing the posted time.
 * @returns {number} - The number of days extracted from the input string.
 */
export function transformPostedTimeToDays(input: string): number {
  if (input == 'Recently' || input == 'Today') return 0
  else if (input.includes('Expires')) return 7
  else if (input === 'Yesterday') return 1

  const regex = /(\d+) (minute|hour|day|week)s? ago/
  const match = input.match(regex)
  if (match) {
    const value = parseInt(match[1], 10)
    const unit = match[2]

    switch (unit) {
      case 'minute':
        return 0
      case 'hour':
        return 0 // Any hours translate to 0 days
      case 'day':
        return value // Directly return the number of days
      case 'week':
        return value * 7 // Convert weeks to days
      default:
        return 0
    }
  }
  throw new Error('Date invalid format')
}

/**
 * Checks if any of the search words are included in the job post title.
 *
 * @param {JobPost} title - The job post title to be searched.
 * @param {string[]} termsInTitle - The array of search words to look for in the job post title.
 * @returns {boolean} True if any of the search words are found in the job post title, false otherwise.
 */
export function isAnySearchWordInTitle(
  title: string,
  termsInTitle: string[],
): boolean {
  // Convert the job post title to lowercase
  const titleLowerCase = title.toLowerCase()

  // Check if any of the search words are included in the title
  const termInTitleIncluded = termsInTitle.some((word) =>
    titleLowerCase.includes(word.toLowerCase()),
  )

  return termInTitleIncluded
}

export function checkJobIsQualified(jobInformation: string): boolean {
  if (jobInformation.includes('ir35') || jobInformation.includes('sap'))
    return false
  return true
}

// Utility function to handle locator text extraction with error handling
export async function getTextFromLocator(
  locatorParent: Locator,
  locatorChield: string,
  index: number,
  defaultValue: string = 'Unknown',
): Promise<string> {
  try {
    return await locatorParent.nth(index).locator(locatorChield).innerText()
  } catch (err: any) {
    console.log(`Error fetching locator at index ${index}:`, err.message)
    return defaultValue
  }
}

// Utility function to handle locator attribute extraction with error handling
export async function getAttributeFromLocator(
  locatorParent: Locator,
  locatorChield: string,
  index: number,
  attribute: string,
  defaultValue: string = 'Unknown',
): Promise<string> {
  try {
    return (
      (await locatorParent
        .nth(index)
        .locator(locatorChield)
        .getAttribute(attribute)) ?? ''
    )
  } catch (err: any) {
    console.log(`Error fetching locator at index ${index}:`, err.message)
    return defaultValue
  }
}

/**
 * Transforms a time-posted string into the corresponding number of days.
 * @param {string} input - The input string describing the posted time.
 * @returns {number} - The number of days extracted from the input string.
 */
export function transformDatePostedTimeFormatToDays(input: string): number {
  // Remove newlines and extra spaces from the input
  input = input.replace(/\s+/g, ' ').trim()

  if (input === 'Recently' || input === 'Today') return 0
  else if (input.includes('Expires')) return 7
  else if (input === 'Yesterday') return 1

  const regex = /(\d+)\s*(minute|hour|day|week|month|year)s?\s*ago/
  const match = input.match(regex)
  if (match) {
    const value = parseInt(match[1], 10)
    const unit = match[2]

    switch (unit) {
      case 'minute':
        return 0 // Minutes translate to 0 days
      case 'hour':
        return 0 // Hours translate to 0 days
      case 'day':
        return value // Directly return the number of days
      case 'week':
        return value * 7 // Convert weeks to days
      case 'month':
        return value * 30 // Convert months to days (approximate)
      case 'year':
        return value * 365 // Convert years to days (approximate)
      default:
        return 0
    }
  }
  throw new Error('Date invalid format')
}

// return last 7 days in format 2024-07-22
export function getLast7DaysDate(): string {
  const today = new Date()
  const last7Days = new Date(today)
  last7Days.setDate(today.getDate() - 7)
  const year = last7Days.getFullYear()
  const month = String(last7Days.getMonth() + 1).padStart(2, '0')
  const day = String(last7Days.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

//convert date type 'Posted 10 Jul', into number days ago
export function calculateDaysAgo(displayPostedDate: string): number {
  const today = new Date()

  const datePart = displayPostedDate.replace('Posted ', '')

  const [day, month] = datePart.split(' ')
  const monthMap: { [key: string]: number } = {
    Jan: 0,
    Feb: 1,
    Mar: 2,
    Apr: 3,
    May: 4,
    Jun: 5,
    Jul: 6,
    Aug: 7,
    Sep: 8,
    Oct: 9,
    Nov: 10,
    Dec: 11,
  }

  const postedDate = new Date(
    today.getFullYear(),
    monthMap[month],
    parseInt(day),
  )
  if (postedDate > today) {
    postedDate.setFullYear(today.getFullYear() - 1)
  }

  const timeDiff = today.getTime() - postedDate.getTime()
  const daysAgo = Math.floor(timeDiff / (1000 * 3600 * 24))

  return daysAgo
}

export function delayExec(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
