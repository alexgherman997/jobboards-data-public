import { JobPost } from '../utils/jobpost-structure'
import {
  calculateDaysDifference,
  generateKeyMap,
  getLast7DaysDate,
  calculateDaysAgo,
} from '../utils/helper-functions'
import { searchTerm } from '../utils/constants'

export async function searchJobCarrerAddict(
  term: any,
  page: number,
  reviewedJob: Map<string, JobPost>,
): Promise<Array<JobPost>> {
  let jobsArray: Array<JobPost> = new Array<JobPost>()
  let responseBody: any = ''

  //get last 7 days for variable in fetch response
  const last7DaysDate = getLast7DaysDate()

  try {
    const offset = (page - 1) * 20

    const response = await fetch(
      `https://jobs.careeraddict.com/jobs/search_api?page=${page}&key_word=${term}&posted_date=${last7DaysDate}&industries%5B%5D=31&job_types%5B%5D=remote&job_types%5B%5D=contract&job_types%5B%5D=full_time&job_types%5B%5D=temporary`,
      {
        headers: {
          accept: 'application/json',
          'accept-language': 'en-US,en;q=0.9',
          'content-type': 'application/json',
          priority: 'u=1, i',
          'sec-ch-ua':
            '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'same-origin',
          'sec-fetch-site': 'same-origin',
          'x-csrf-token':
            'k5qkH-BCg_FjY6aF71c-KTTH79YAFPb3KsqEtB8E9KQ9Rg5CQzPdtJxrBXRITSvBtKHRjYZKwyS8WJk7NivYBw',
          'x-requested-with': 'XMLHttpRequest',
          cookie:
            'ezux_lpl_93872=1721661991067|852d47ca-9067-4415-7d8b-600d650a4e2d|true; _gcl_au=1.1.1675741209.1720684141; _gat_UA-28764692-2=1; _awl=2.1720684141.5-edc6dd8ac04e685709f3ea88a3c9e096-6763652d6575726f70652d7765737431-0; ez-consent-tcf=CQBlZ8gQBlZ8gErAJJENA7EsAP_gAEPgAATAKTtV_G__bWlr8X73aftkeY1P9_h77sQxBhfJE-4FzLvW_JwXx2ExNA36tqIKmRIEu3bBIQNlHJDUTVCgaogVryDMak2coTNKJ6BkiFMRO2dYCF5vmwtj-QKY5vr993dx2B-t_dv83dzyz4VHn3a5_2e0WJCdA58tDfv9bROb-9IOd_58v4v8_F_rE2_eT1l_tevp7D9-cts7_XW-9_fff79Ll_-mB_gpKAWYaFRAGWRISEGgYQQIAVBWEBFAgAAABIGiAgBMGBTsDAJdYSIAQAoABggBAACjIAEAAAkACEQAQAFAgAAgECgADAAgGAgAYGAAMAFgIBAACA6BCmBBAoFgAkZkRCmBCFAkEBLZUIJAECCuEIRZ4EEAiJgoAAASACsAAQFgsDiSQErEggS4g2gAAIAEAggAqEUnZgCCAM2WqvFk2jK0gLR8wXvaYAAA.YAAAAAAAAAAA; ezosuibasgeneris-1=4502928d-2691-43e9-41b2-1b3e897d2fee; _cc_id=f3a0c37779c50c6e9c36dff0a05a772; _au_1d=AU1D-0100-001720684144-S51C1IS3-WLKF; _au_last_seen_iab_tcf=1720684144609; __qca=P0-235473214-1720684147928; _ga=GA1.3.428438397.1720684141; _lr_env_src_ats=false; pbjs-unifiedid=%7B%22TDID_LOOKUP%22%3A%22FALSE%22%2C%22TDID_CREATED_AT%22%3A%222024-07-11T07%3A49%3A09%22%7D; pbjs-unifiedid_cst=UCwQLCEsrA%3D%3D; _ga_N0GYP9G2B5=GS1.1.1720684140.1.0.1720684908.59.0.0; ezux_lpl_93872=1721032740578|08877919-2504-40f7-56b4-b219f5ae3c33|true; _ga_FVWZ0RM4DH=GS1.1.1721291812.7.0.1721291812.60.0.0; portal_type=candidates; ezoma_93872=999,999; ezoictest=stable; ezoab_93872=mod155; ezoadgid_93872=-2; lp_93872=https://jobs.careeraddict.com/jobs/search?page=1&key_word=test&industries%5B%5D=31&job_types%5B%5D=remote&job_types%5B%5D=contract&job_types%5B%5D=full_time&job_types%5B%5D=temporary; ezovuuidtime_93872=1721661977; ezovuuid_93872=4e037356-17af-4aa4-4144-894c2a50864a; ezoref_93872=; ezds=ffid%3D1%2Cw%3D1536%2Ch%3D864; ezohw=w%3D1536%2Ch%3D695; _gid=GA1.3.1585557747.1721661979; _lr_retry_request=true; panoramaId_expiry=1722266779086; _cc_id=f3a0c37779c50c6e9c36dff0a05a772; panoramaId=bbaa6db71f50a47a056a49472988c8bd038ae4fa0bcdddc33a473db99e90b71b; cto_bidid=ND3Sll8zcUdmdTlSRHlDbDZlQzFTWWtVa3pYSVglMkZqRG5nUUZvbXpyV1hpYTNBU1JRUHNDMzA1S0xOSGtyTjlreHk4RjJYRmh4MjhPdnZaMEVHMk5jbGFqdlVWVHJGV3ZNVFRnNU5KdnE2dSUyQiUyRkJyTThaaHc4cVpUNWl5MmR4S1ZMcXZRcA; _ga=GA1.2.428438397.1720684141; _gid=GA1.2.1585557747.1721661979; __gads=ID=ecf9ca0af4ae9aad:T=1720684142:RT=1721661980:S=ALNI_MagMqHMl0DW7ZTXMkPmPXOTrooLRg; __eoi=ID=f8d03f2306f1bbce:T=1720684142:RT=1721661980:S=AA-AfjZyGMnUqVcVXq6NeFWhV_Ko; cto_bundle=vcAf-V9Oc2JWYWRsM0x5TzhucTU2M2MwUlVObnA5YWtyNDNaJTJGdENSb1BPNHpkSVBRUWpoJTJCcEtyTk11a3R5QWdGdmJhT2pGczR5JTJGZHQyNjlJcmdSQW42dEdnSXNFcUk1a2NHQ1gxV3lWb3MzcDE3dSUyRjF2RzI2M2xUY21obTNhRzAlMkJxUXlYcmpXUHk1N2hUbXJHbEQlMkY1WUhQdnBxJTJCd25RSXd5WWdQUlh1bU9kUSUyRkhJJTNE; _career_jobs_session=2aexNgk%2FY5RKFSDFI5wFqMok38AxNvXrCHtJyGhx5YmTqKvgE%2BytK3EWbga%2BiQC5eTi0C%2FDwO7NINGIhLSTWUelFr5WEUs%2FmolZjCRpBrnIE2x7Wsz5CO%2FX%2BV9LxkGqX1PzPPhtp1FU9ZzLgVZnZVsHPSAGQs2FIrFpqd4%2FDwHYccdsusKUdIZ2n8NkQJetMRDrk3Dz9meLOyuVCckEGNS7z6YUwUpkE70mkdPHsU3T6HH3DOEoKLBJNLkjf%2BoXecvcLKNtNYPtUBCuHHxQEsJ0FcOGGVnwQmH49ZscWYR8HhMSZsnco9cRDpuc%2Fug1UD4Gecw%3D%3D--wfUAujtMuZlwf1z8--ZTCVGRizOUkWCv0G1ndyDw%3D%3D; _ga_RQ09TW6Y2P=GS1.1.1721661978.7.1.1721661989.0.0.0; ezux_ifep_93872=true; ezux_et_93872=109; ezux_tos_93872=683',
          Referer:
            'https://jobs.careeraddict.com/jobs/search?page=1&key_word=test&posted_date=2024-07-15&industries%5B%5D=31&job_types%5B%5D=remote&job_types%5B%5D=contract&job_types%5B%5D=full_time&job_types%5B%5D=temporary',
          'Referrer-Policy': 'strict-origin-when-cross-origin',
        },
        body: null,
        method: 'GET',
      },
    )

    responseBody = await response.json()

    const URL = 'https://jobs.careeraddict.com/'

    responseBody.jobs.forEach((job: any) => {
      const jobDetail = job

      let urlId = URL + 'post/' + jobDetail.id

      let jobPost = {
        url: urlId,
        title: jobDetail.title,
        company: jobDetail.get_company_name ?? '',
        location: jobDetail.display_location ?? '',
        salary: jobDetail.display_salary ?? '',
        postedData: calculateDaysAgo(jobDetail.display_posted_date) ?? 0,
      }

      //setting checking condition
      const tileLowerCase = jobPost.title.toLowerCase()
      const allTermsIncluded = searchTerm.some((word) =>
        tileLowerCase.includes(word),
      )

      const date: number = jobPost.postedData

      const alreadyPresentInJobArray = jobsArray.some(
        (obj) => obj.title === jobPost.title && obj.company === jobPost.company,
      )
      const jobPostKey = generateKeyMap(jobPost)

      //checking if the job post is qualifed
      if (
        !alreadyPresentInJobArray &&
        !reviewedJob.has(jobPostKey) &&
        allTermsIncluded &&
        jobPost.postedData <= 7 &&
        !tileLowerCase.includes('sap')
      ) {
        jobsArray.push(jobPost)
      }
    })

    return jobsArray
  } catch (error: any) {
    console.log('Error principal function:', error.message, responseBody)
    return jobsArray
  }
}

