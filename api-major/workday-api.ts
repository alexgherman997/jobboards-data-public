import { JobPost } from '../utils/jobpost-structure'
import { generateKeyMap } from '../utils/helper-functions'
import { getChatGptQualificationJD } from '../utils/chatgpt'
import { termsInTitle } from '../utils/constants'

export async function searchJobsWorkday(
  term: any,
  page = 1,
  reviewedJob: Map<string, JobPost>,
): Promise<Array<JobPost>> {
  let jobsArray: Array<JobPost> = new Array<JobPost>()
  try {
    const offset = (page - 1) * 20
    const response = await fetch(
      'https://workday.wd5.myworkdayjobs.com/wday/cxs/workday/Workday/jobs',
      {
        headers: {
          accept: 'application/json',
          'accept-language': 'en-US',
          'content-type': 'application/json',
          priority: 'u=1, i',
          'sec-ch-ua':
            '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"macOS"',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-origin',
          'x-calypso-csrf-token': '18addf22-9d6f-4a4c-a5ef-3cdec49cdcf5',
          cookie:
            'timezoneOffset=-180; enablePrivacyTracking=true; PLAY_LANG=en-US; _cfuvid=fMYXcayM4B46971v1ns0oJ9JLUeOTVITc31JZ000FGc-1719985685030-0.0.1.1-604800000; PLAY_SESSION=26f4fef4824b18ff1615f66cd7ccbffe318da363-workday_pSessionId=4as9s874hkh8b2kv3s9kkmdjah&instance=vps-prod-9n8b6cr5.prod-vps.pr502.cust.pdx.wd; wday_vps_cookie=2532088842.53810.0000; __cf_bm=5MR8sZH2s.JgPherxXZ4zcmZF0tZi644bRmw5N9ekkA-1720541354-1.0.1.1-iz7Us.YDYPj_A9ace_5vUTA6cHeXAiB3u0v5IQZR_6.bwQoyCqVb5rR7SvnCKXA8haYyX7VVUG5Pern3l6UbGQ; __cflb=02DiuHJZe28xXz6hQKLeTYyWYf7NxYcM1Fcda4SM2bUtC; wd-browser-id=05105f5e-5406-472f-9e9c-596cbcebf457; CALYPSO_CSRF_TOKEN=18addf22-9d6f-4a4c-a5ef-3cdec49cdcf5',
          Referer: `https://workday.wd5.myworkdayjobs.com/Workday/?q=${term}&source=Careers_Website&remoteType=bf0480ca9d751000ea15bc9c334b0001&remoteType=bf0480ca9d751000ea15bc9c334b0000&Location_Country=bc33aa3152ec42d4995f4791a106ed09&Location_Country=04a05835925f45b3a59406a2a6b72c8a&Location_Country=dcc5b7608d8644b3a93716604e78e995&Location_Country=a30a87ed25634629aa6c3958aa2b91ea&Location_Country=131d5ac7e3ee4d7b962bdc96e498e412&Location_Country=54c5b6971ffb4bf0b116fe7651ec789a&Location_Country=9696868b09c64d52a62ee13b052383cc&Location_Country=d903bb3fedad45039383f6de334ad4db&Location_Country=29247e57dbaf46fb855b224e03170bc7&Location_Country=bd34c524a6a04ae6915f5d96fa086199&Location_Country=fc078443155c4ad294201ecf5a61a499&Location_Country=80938777cac5440fab50d729f9634969&Location_Country=6a800a4736884df5826858d435650f45&Location_Country=55273a1b49934d97ae15342ef51f6b95&Location_Country=8cd04a563fd94da7b06857a79faaf815&Location_Country=49ab063f422741e2aef271de00efeac8&Location_Country=0afb2fa656da42e8bfb6d47bd24a26fa&Location_Country=187134fccb084a0ea9b4b95f23890dbe&Location_Country=d004c0d1a6c84511ab048669fcdf9fd7&Location_Country=d07f8ca8625e4345b98a91d0558b872a&Location_Country=a04ea128f43a42e59b1e6a19e8f0b374`,
          'Referrer-Policy': 'strict-origin-when-cross-origin',
        },
        body: `{"appliedFacets":{"remoteType":["bf0480ca9d751000ea15bc9c334b0001","bf0480ca9d751000ea15bc9c334b0000"],"Location_Country":["bc33aa3152ec42d4995f4791a106ed09","04a05835925f45b3a59406a2a6b72c8a","dcc5b7608d8644b3a93716604e78e995","a30a87ed25634629aa6c3958aa2b91ea","131d5ac7e3ee4d7b962bdc96e498e412","54c5b6971ffb4bf0b116fe7651ec789a","9696868b09c64d52a62ee13b052383cc","d903bb3fedad45039383f6de334ad4db","29247e57dbaf46fb855b224e03170bc7","bd34c524a6a04ae6915f5d96fa086199","fc078443155c4ad294201ecf5a61a499","80938777cac5440fab50d729f9634969","6a800a4736884df5826858d435650f45","55273a1b49934d97ae15342ef51f6b95","8cd04a563fd94da7b06857a79faaf815","49ab063f422741e2aef271de00efeac8","0afb2fa656da42e8bfb6d47bd24a26fa","187134fccb084a0ea9b4b95f23890dbe","d004c0d1a6c84511ab048669fcdf9fd7","d07f8ca8625e4345b98a91d0558b872a","a04ea128f43a42e59b1e6a19e8f0b374"]},"limit":20,"offset":${offset},"searchText":"${term}"}`,
        method: 'POST',
      },
    )
    const responseBody: any = await response.json()

    const URL = 'https://workday.wd5.myworkdayjobs.com/en-US/Workday'

    // Define the delay function
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms))

    for (const job of responseBody.jobPostings) {
      let jobPost = {
        url: URL + job.externalPath,
        title: job.title,
        company: 'Unknown company',
        location: job.locationsText,
        postedData:
          job.postedOn === 'Posted Today'
            ? 0
            : parseInt(job.postedOn.match(/(\d+)\+?/)?.[1] ?? '0', 10),
        slug: job.externalPath,
        qualifedGpt: true,
        reasonGpt: '',
      }

      const titleLowerCase = jobPost.title.toLowerCase()
      const termInTitleIncluded = termsInTitle.some((word) =>
        titleLowerCase.includes(word),
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
        const urlJD =
          'https://workday.wd5.myworkdayjobs.com/wday/cxs/workday/Workday'

        // Apply the delay before making the fetch request
        await delay(1000)

        // Get the JD information
        const responseJob = await fetch(urlJD + jobPost.slug, {
          headers: {
            accept: 'application/json',
            'accept-language': 'en-US',
            'content-type': 'application/x-www-form-urlencoded',
            priority: 'u=1, i',
            'sec-ch-ua':
              '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'x-calypso-csrf-token': '60aec1e4-9b8b-4006-aceb-fad1c909c97b',
          },
          referrer: urlJD + jobPost.slug,
          referrerPolicy: 'strict-origin-when-cross-origin',
          body: null,
          method: 'GET',
          mode: 'cors',
          credentials: 'include',
        })

        // ChatGPT JD qualification
        const responseJDBody: any = await responseJob.text()
        const qualifiedByGpt = await getChatGptQualificationJD(responseJDBody)

        const [status, reason] = qualifiedByGpt?.split('-') ?? []
        jobPost.qualifedGpt = JSON.parse(status)
        jobPost.reasonGpt = reason

        console.log(jobPost);
        jobsArray.push(jobPost)
      }
    }
    return jobsArray
  } catch (error: any) {
    console.log('error searching jobs', error.message)
    return jobsArray
  }
}

searchJobsWorkday('test', 1, new Map<any, any>())
