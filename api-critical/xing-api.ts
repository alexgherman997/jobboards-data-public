import { JobPost } from '../utils/jobpost-structure'
import {
  calculateDaysDifference,
  generateKeyMap,
  delayExec,
} from '../utils/helper-functions'
import { termsInTitle } from '../utils/constants'
import { getChatGptQualificationJD } from '../utils/chatgpt'

//Filter request: qa - full remote
export async function searchJobsXing(
  term: any,
  page = 1,
  reviewedJob: Map<string, JobPost>,
): Promise<Array<JobPost>> {
  let jobsArray: Array<JobPost> = new Array<JobPost>()
  let responseBody: any = ''

  try {
    const offset = (page - 1) * 20
    //request for getting each job listing for a search page
    const response = await fetch('https://www.xing.com/graphql/api', {
      headers: {
        accept: '*/*',
        'accept-language': 'en',
        'content-type': 'application/json',
        'sec-ch-ua':
          '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'x-csrf-token': '7tUhMuAxq0SyL50vx8MDSf4k9aA76Q7K',
        cookie:
          'xing_csrf_token=7tUhMuAxq0SyL50vx8MDSf4k9aA76Q7K; xing_csrf_checksum=lrD6EUd-UODIq7zsP8HD2RuCBdTyAHWuk-NorkHQyn4; visitor_id=b8d6591b-5b9b-413e-ae96-8bc11283d91b; userConsent=%7B%22marketing%22%3Atrue%2C%22version%22%3A%225%22%7D; _gcl_au=1.1.1057822923.1719409414; _scid=0c71066a-0895-43c8-8931-483b9f9d09c2; language=en; language=en; _session_id=b5f2109c296bf02ba2552cb99b781c09; s=ZPE4gZGv8R7DgWyuR6DCYA; was_logged_in_once=true; s_id=65881610.77b53e; login=NjU4ODE2MTAjNjU4ODE2MTAtQ01VaEhxcEFNVVVGaTFYOEdkX1E3RVpyd2pj%0Ad2lreFdvS0M0WF95elh5bw%3D%3D--dbe8a42c28e8959a1b14f836e9b5e2be8064243a; _ScCbts=%5B%2286%3Bchrome.2%3A2%3A5%22%5D; c_=624987edec9b185d5518a96cb2865fe2; stm.fbexid=322a3468-baf8-405d-a76f-670a50517d11; stm.rtbid=81271400-68e6-4544-ab98-fb0340e4a29b; ab.storage.deviceId.bd5d74db-085a-4722-a85a-7080dbaa6faa=%7B%22g%22%3A%227a24e115-8c7f-f4c5-03cb-95eb572c13b1%22%2C%22c%22%3A1719409425893%2C%22l%22%3A1722962857529%7D; ab.storage.userId.bd5d74db-085a-4722-a85a-7080dbaa6faa=%7B%22g%22%3A%2265881610%22%2C%22c%22%3A1720607255959%2C%22l%22%3A1722962857529%7D; cto_bundle=L9A3c19sdGRHWmVZbHlyQUcyU0xoT3E4UUVHd2JvQnMlMkIxUTNMNGhTWXZBVUZ6ZjRnJTJGZDRoNzlMREV6OEZlSUdIbjB2bThUY01hT3FqeWk0dHclMkZTOXRmdmlSOHQwSnhIbUQ4TU1aNWNxcDlZSnZTSTZURjF5akh1ME1IeUZ6YVBscWNaVU9ra003eXJSYWZlTjVIeWREUUdyaldia3FvZXNOQjRmRGNJMXRsTzlHczBuRFplWVRHRzg2RWFmMUZreGJubG9RZ0tqV1hkVW1FbVJkNTRiNUJaTU5VWDgwVUhVWDBMaVNNa0l1NDJBaW02bVlsYjdHaHRhM1R2NXVXZHJOa1I5RVRGaVJGbWZoZlh2dEZhamx4aXBLVGU0cFg3TGZ2a2pvQzF3V0t3dTdoVk9reFloREVVWjNPSEtUaUxLWmZ4cA; _scid_r=0c71066a-0895-43c8-8931-483b9f9d09c2; stm.cgid=TbgwTYYnfG3GNlxfettV52LDP6R1Ku_J; prevPage=wbm%2FSearch_Stellenmarkt%2Fserp; ab.storage.sessionId.bd5d74db-085a-4722-a85a-7080dbaa6faa=%7B%22g%22%3A%2243314023-8b19-d76f-335d-7bf6491361e2%22%2C%22e%22%3A1722964856565%2C%22c%22%3A1722962857528%2C%22l%22%3A1722963056565%7D; _dd_s=rum=0&expire=1722963962985',
      },
      referrerPolicy: 'no-referrer',
      body: `{\"operationName\":\"JobSearchByQuery\",\"variables\":{\"query\":{\"keywords\":\"${term}\",\"filter\":{\"remoteOption\":{\"id\":[\"FULL_REMOTE.050e26\"]}}},\"consumer\":\"loggedout.web.jobs.search_results.center\",\"sort\":\"date\",\"limit\":20,\"offset\":${offset},\"trackRecent\":true,\"searchMode\":\"NORMAL\"},\"query\":\"query JobSearchByQuery($query: JobSearchQueryInput!, $consumer: String!, $offset: Int, $limit: Int, $sort: String, $trackRecent: Boolean, $searchMode: SearchMode) {\\n  jobSearchByQuery(\\n    query: $query\\n    consumer: $consumer\\n    offset: $offset\\n    limit: $limit\\n    sort: $sort\\n    searchMode: $searchMode\\n    trackRecent: $trackRecent\\n    returnAggregations: true\\n    splitBenefit: true\\n  ) {\\n    total\\n    searchQuery {\\n      guid\\n      body {\\n        ...JobSearchQueryBodySplitBenefits\\n        __typename\\n      }\\n      __typename\\n    }\\n    collection {\\n      ...JobItemResult\\n      __typename\\n    }\\n    aggregations {\\n      employmentTypes {\\n        ...EmploymentTypeAggregation\\n        __typename\\n      }\\n      careerLevels {\\n        ...CareerLevelAggregation\\n        __typename\\n      }\\n      disciplines {\\n        ...DisciplineAggregation\\n        __typename\\n      }\\n      industries {\\n        ...IndustryAggregation\\n        __typename\\n      }\\n      benefitsEmployeePerk {\\n        ...BenefitAggregation\\n        __typename\\n      }\\n      benefitsWorkingCulture {\\n        ...BenefitAggregation\\n        __typename\\n      }\\n      countries {\\n        ...CountryAggregation\\n        __typename\\n      }\\n      cities {\\n        ...CityAggregation\\n        __typename\\n      }\\n      remoteOptions {\\n        ...RemoteOptionAggregation\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n\\nfragment CompanyFilter on JobFilterCompany {\\n  company {\\n    companyName\\n    __typename\\n  }\\n  entityId\\n  __typename\\n}\\n\\nfragment EmploymentTypeFilter on JobFilterEmploymentType {\\n  employmentType {\\n    localizationValue\\n    __typename\\n  }\\n  entityId\\n  __typename\\n}\\n\\nfragment CareerLevelFilter on JobFilterCareerLevel {\\n  careerLevel {\\n    localizationValue\\n    __typename\\n  }\\n  entityId\\n  __typename\\n}\\n\\nfragment DisciplineFilter on JobFilterDiscipline {\\n  discipline {\\n    localizationValue\\n    __typename\\n  }\\n  entityId\\n  __typename\\n}\\n\\nfragment IndustryFilter on JobFilterIndustry {\\n  industry {\\n    localizationValue\\n    __typename\\n  }\\n  entityId\\n  __typename\\n}\\n\\nfragment BenefitEmployeePerkFilter on JobFilterBenefitEmployeePerk {\\n  benefitEmployeePerk {\\n    localizationValue\\n    __typename\\n  }\\n  entityId\\n  __typename\\n}\\n\\nfragment BenefitWorkingCultureFilter on JobFilterBenefitWorkingCulture {\\n  benefitWorkingCulture {\\n    localizationValue\\n    __typename\\n  }\\n  entityId\\n  __typename\\n}\\n\\nfragment CountryFilter on JobFilterCountry {\\n  country {\\n    localizationValue\\n    __typename\\n  }\\n  entityId\\n  __typename\\n}\\n\\nfragment CityFilter on JobFilterCity {\\n  city {\\n    localizationValue: name\\n    __typename\\n  }\\n  entityId\\n  __typename\\n}\\n\\nfragment SalaryFilter on JobFilterSalary {\\n  min\\n  max\\n  __typename\\n}\\n\\nfragment RemoteOptionFilter on JobFilterRemoteOption {\\n  remoteOption {\\n    localizationValue\\n    __typename\\n  }\\n  entityId\\n  __typename\\n}\\n\\nfragment JobSearchFilterCollectionSplitBenefits on JobFilterCollection {\\n  ...CompanyFilter\\n  ...EmploymentTypeFilter\\n  ...CareerLevelFilter\\n  ...DisciplineFilter\\n  ...IndustryFilter\\n  ...BenefitEmployeePerkFilter\\n  ...BenefitWorkingCultureFilter\\n  ...CountryFilter\\n  ...CityFilter\\n  ...SalaryFilter\\n  ...RemoteOptionFilter\\n  __typename\\n}\\n\\nfragment Salary on Salary {\\n  currency\\n  amount\\n  __typename\\n}\\n\\nfragment SalaryRange on SalaryRange {\\n  currency\\n  minimum\\n  maximum\\n  __typename\\n}\\n\\nfragment SalaryEstimate on SalaryEstimate {\\n  currency\\n  minimum\\n  maximum\\n  median\\n  __typename\\n}\\n\\nfragment VisibleJobCommon on VisibleJob {\\n  id\\n  slug\\n  url\\n  title\\n  activatedAt\\n  globalId\\n  location {\\n    city\\n    __typename\\n  }\\n  employmentType {\\n    localizationValue\\n    __typename\\n  }\\n  companyInfo {\\n    companyNameOverride\\n    company {\\n      id\\n      logos {\\n        x1: logo96px\\n        __typename\\n      }\\n      kununuData {\\n        ratingAverage\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n  salary {\\n    ...Salary\\n    ...SalaryRange\\n    ...SalaryEstimate\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment JobTeaserVisibleJob on VisibleJob {\\n  ...VisibleJobCommon\\n  userInteractions {\\n    bookmark {\\n      state\\n      __typename\\n    }\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment JobKeyfactV2 on JobMatchingHighlightsJobKeyfactV2 {\\n  __typename\\n  type\\n  localization {\\n    localizationValue\\n    __typename\\n  }\\n  localizationA11y {\\n    localizationValue\\n    __typename\\n  }\\n  ... on JobMatchingHighlightsJobKeyfactSalaryV2 {\\n    value {\\n      ...Salary\\n      ...SalaryRange\\n      ...SalaryEstimate\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n\\nfragment JobMatchingHighlightsV2 on JobMatchingHighlightsV2 {\\n  token\\n  highlight {\\n    type\\n    localization {\\n      localizationValue\\n      __typename\\n    }\\n    localizationA11y {\\n      localizationValue\\n      __typename\\n    }\\n    __typename\\n  }\\n  matchingFacts {\\n    ...JobKeyfactV2\\n    __typename\\n  }\\n  nonMatchingFacts {\\n    ...JobKeyfactV2\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment JobSearchQueryBodySplitBenefits on JobSearchQueryBody {\\n  keywords\\n  location {\\n    text\\n    radius\\n    city {\\n      id\\n      name\\n      __typename\\n    }\\n    __typename\\n  }\\n  filterCollection {\\n    ...JobSearchFilterCollectionSplitBenefits\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment JobItemResult on JobItemResult {\\n  trackingToken\\n  position\\n  descriptionHighlight\\n  jobDetail {\\n    ...JobTeaserVisibleJob\\n    __typename\\n  }\\n  matchingHighlightsV2 {\\n    ...JobMatchingHighlightsV2\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment EmploymentTypeAggregation on JobAggregationEmploymentType {\\n  count\\n  id\\n  employmentType {\\n    localizationValue\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment CareerLevelAggregation on JobAggregationCareerLevels {\\n  count\\n  id\\n  careerLevel {\\n    localizationValue\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment DisciplineAggregation on JobAggregationDiscipline {\\n  count\\n  id\\n  discipline {\\n    localizationValue\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment IndustryAggregation on JobAggregationIndustry {\\n  count\\n  id\\n  industry {\\n    localizationValue\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment BenefitAggregation on JobAggregationBenefit {\\n  count\\n  id\\n  benefit {\\n    localizationValue\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment CountryAggregation on JobAggregationCountry {\\n  count\\n  id\\n  country {\\n    localizationValue\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment CityAggregation on JobAggregationCity {\\n  count\\n  id\\n  city {\\n    localizationValue: name\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment RemoteOptionAggregation on JobAggregationRemoteOption {\\n  id\\n  remoteOption {\\n    localizationValue\\n    __typename\\n  }\\n  __typename\\n}\\n\"}`,
      method: 'POST',
    })

    responseBody = await response.json()

    //parsing and extracting elements from the api request
    responseBody.data.jobSearchByQuery.collection.forEach(async (job: any) => {
      const jobDetail = job.jobDetail
      let urlId,
        salaryFrom = -1,
        salaryTo = -1
      try {
        urlId = jobDetail.url ?? ''
        ;(salaryFrom = jobDetail.salary.minimum ?? 0),
          (salaryTo = jobDetail.salary.maximum ?? 0)
      } catch (err: any) {
        console.log('Error parsing data:', err.message)
      }

      // assign extracted date to jobPost which is a possible candidate for a valid job post
      let jobPost: JobPost = {
        url: jobDetail.url ?? '',
        title: jobDetail.title ?? '',
        company: jobDetail.companyInfo.companyNameOverride ?? '',
        location: jobDetail.location.city ?? '',
        postedData: calculateDaysDifference(jobDetail.activatedAt) ?? 0,
        salaryFrom,
        salaryTo,
        slug: jobDetail.slug,
      }

      //preparing the validations
      const tileLowerCase = jobPost.title.toLowerCase()
      const termInTitleIncluded = termsInTitle.some((word) =>
        tileLowerCase.includes(word),
      )
      const alreadyPresentInJobArray = jobsArray.some(
        (obj) => obj.title === jobPost.title && obj.company === jobPost.company,
      )
      const jobPostKey = generateKeyMap(jobPost)

      //validation 1 - checking if the job post is qualifed
      if (
        !alreadyPresentInJobArray &&
        !reviewedJob.has(jobPostKey) &&
        termInTitleIncluded &&
        jobPost.postedData <= 7 &&
        !tileLowerCase.includes('sap')
      ) {
        jobsArray.push(jobPost)
      }
    })

    //validation 2 - parsing and validating each job description with chatgpt
    for (let job of jobsArray) {
      const responseJob = await fetch('https://www.xing.com/graphql/api', {
        headers: {
          accept: '*/*',
          'accept-language': 'en',
          'content-type': 'application/json',
          'sec-ch-ua':
            '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"macOS"',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-origin',
          'x-csrf-token': '7tUhMuAxq0SyL50vx8MDSf4k9aA76Q7K',
          cookie:
            'xing_csrf_token=7tUhMuAxq0SyL50vx8MDSf4k9aA76Q7K; xing_csrf_checksum=lrD6EUd-UODIq7zsP8HD2RuCBdTyAHWuk-NorkHQyn4; visitor_id=b8d6591b-5b9b-413e-ae96-8bc11283d91b; userConsent=%7B%22marketing%22%3Atrue%2C%22version%22%3A%225%22%7D; _gcl_au=1.1.1057822923.1719409414; _scid=0c71066a-0895-43c8-8931-483b9f9d09c2; language=en; language=en; _session_id=b5f2109c296bf02ba2552cb99b781c09; s=ZPE4gZGv8R7DgWyuR6DCYA; was_logged_in_once=true; s_id=65881610.77b53e; stm.fbexid=5287c6aa-3dae-4279-a72f-adc6f9b469bd; stm.rtbid=0ace304b-1a02-4d96-9150-2c3585d028be; stm.cgid=PRuFDWXuO0DandcmigB2fiZCpFCLd-Gc; login=NjU4ODE2MTAjNjU4ODE2MTAtQ01VaEhxcEFNVVVGaTFYOEdkX1E3RVpyd2pj%0Ad2lreFdvS0M0WF95elh5bw%3D%3D--dbe8a42c28e8959a1b14f836e9b5e2be8064243a; _ScCbts=%5B%2286%3Bchrome.2%3A2%3A5%22%2C%22238%3Bchrome.2%3A2%3A5%22%5D; c_=6ecb45b900d96d3974282f8cc551fe36; ab.storage.deviceId.bd5d74db-085a-4722-a85a-7080dbaa6faa=%7B%22g%22%3A%227a24e115-8c7f-f4c5-03cb-95eb572c13b1%22%2C%22c%22%3A1719409425893%2C%22l%22%3A1721899653879%7D; ab.storage.userId.bd5d74db-085a-4722-a85a-7080dbaa6faa=%7B%22g%22%3A%2265881610%22%2C%22c%22%3A1720607255959%2C%22l%22%3A1721899653879%7D; prevPage=wbm%2FStellenmarkt%2Fdetail; ab.storage.sessionId.bd5d74db-085a-4722-a85a-7080dbaa6faa=%7B%22g%22%3A%22b4e321a4-30c4-81b8-c2d6-9c8d0329e3e2%22%2C%22e%22%3A1721901536658%2C%22c%22%3A1721899653878%2C%22l%22%3A1721899736658%7D; _scid_r=0c71066a-0895-43c8-8931-483b9f9d09c2; cto_bundle=gJT0Rl9sdGRHWmVZbHlyQUcyU0xoT3E4UUVIaFZOMmdxcCUyQkJLSFBxVWgzSERKUiUyRkR4JTJGb3F3eVpyNU0zaG1QdVdESk5mNlFkbGIzNGZEMWh0dFF4WHhKUllLZDBhUUZSN01JSFI3ZFJSV25zc3FKUGh0N2JXSHRGNzFRJTJCa2VFcVRNJTJCeEJkZm1xeUFXZHBTYU9SY2U2T0NEcFFUcDI3eiUyRkZkaiUyQkFUc1FNTUR6ZXFyb0VXNEZ6NXIlMkZGWlNWcCUyQmtxbFlpWVZjMSUyQjN6TUolMkZWM0RCWlFCcGZGWGt3VkpXUElxcEU5TnJZdHJhUVUlMkJiVFVMSHlvOWx4bkFObksybWhQZTRnenRG; _dd_s=rum=0&expire=1721900863980',
        },
        referrerPolicy: 'no-referrer',
        body: `{"operationName":"GetJobDetails","variables":{"slug":"${job.slug}"},"query":"query GetJobDetails($slug: String!) {\\n  job(slug: $slug, enableTemplateData: true) {\\n    ... on UnauthorizedJob {\\n      id\\n      reason\\n      __typename\\n    }\\n    ...JobDetailsVisibleJob\\n    __typename\\n  }\\n}\\n\\nfragment Salary on Salary {\\n  currency\\n  amount\\n  __typename\\n}\\n\\nfragment SalaryRange on SalaryRange {\\n  currency\\n  minimum\\n  maximum\\n  __typename\\n}\\n\\nfragment SalaryEstimate on SalaryEstimate {\\n  currency\\n  minimum\\n  maximum\\n  median\\n  __typename\\n}\\n\\nfragment VisibleJobCommon on VisibleJob {\\n  id\\n  slug\\n  url\\n  title\\n  activatedAt\\n  globalId\\n  location {\\n    city\\n    __typename\\n  }\\n  employmentType {\\n    localizationValue\\n    __typename\\n  }\\n  companyInfo {\\n    companyNameOverride\\n    company {\\n      id\\n      logos {\\n        x1: logo96px\\n        __typename\\n      }\\n      kununuData {\\n        ratingAverage\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n  salary {\\n    ...Salary\\n    ...SalaryRange\\n    ...SalaryEstimate\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment KununuData on CompanyKununuData {\\n  companyProfileUrl\\n  mappedBenefits {\\n    type\\n    __typename\\n  }\\n  ratingAverage\\n  ratingCount\\n  culture {\\n    link\\n    completedSubmissionsCount\\n    cultureCompass {\\n      profile\\n      industry\\n      __typename\\n    }\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment Company on Company {\\n  id\\n  companySize\\n  links {\\n    public\\n    __typename\\n  }\\n  logos {\\n    logo96px\\n    __typename\\n  }\\n  industry {\\n    localizationValue\\n    __typename\\n  }\\n  address {\\n    city\\n    country {\\n      localizationValue\\n      __typename\\n    }\\n    __typename\\n  }\\n  userContext {\\n    followState {\\n      isFollowing\\n      __typename\\n    }\\n    __typename\\n  }\\n  kununuData {\\n    ...KununuData\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment SocialUrls on TemplateDataSocialUrls {\\n  website\\n  facebook\\n  twitter\\n  youtube\\n  xing\\n  instagram\\n  pinterest\\n  tiktok\\n  kununu\\n  __typename\\n}\\n\\nfragment Description on JobDescription {\\n  ... on HtmlDescription {\\n    content\\n    __typename\\n  }\\n  ... on ExternalUrlDescription {\\n    url\\n    proxyUrl\\n    htmlContent\\n    __typename\\n  }\\n  ... on PdfDescription {\\n    pdfUrl\\n    previewImage {\\n      url: image870x\\n      __typename\\n    }\\n    htmlContent\\n    __typename\\n  }\\n  ... on TemplateData {\\n    sectionTitleColor\\n    genericDescription\\n    companyDescriptionTitle\\n    companyDescriptionContent\\n    responsibilityTitle\\n    responsibilityContent\\n    skillsTitle\\n    skillsContent\\n    weOfferTitle\\n    weOfferContent\\n    contactInfoTitle\\n    contactInfoContent\\n    headerImage\\n    footerImage\\n    videoUrls {\\n      youtube\\n      vimeo\\n      __typename\\n    }\\n    socialUrls {\\n      ...SocialUrls\\n      __typename\\n    }\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment JobDetailsVisibleJob on VisibleJob {\\n  ...VisibleJobCommon\\n  activeUntil\\n  application {\\n    __typename\\n    ... on UrlApplication {\\n      applyUrl\\n      __typename\\n    }\\n    ... on EmailApplication {\\n      applyEmail\\n      __typename\\n    }\\n    ... on MessageApplication {\\n      contactUserId\\n      __typename\\n    }\\n  }\\n  banner {\\n    image936x200\\n    __typename\\n  }\\n  careerLevel {\\n    id\\n    localizationValue\\n    __typename\\n  }\\n  companyInfo {\\n    company {\\n      ...Company\\n      __typename\\n    }\\n    __typename\\n  }\\n  description {\\n    ...Description\\n    __typename\\n  }\\n  discipline {\\n    id\\n    localizationValue\\n    __typename\\n  }\\n  employmentType {\\n    id\\n    localizationValue\\n    __typename\\n  }\\n  industry {\\n    id\\n    localizationValue\\n    __typename\\n  }\\n  jobCode\\n  keywords\\n  language\\n  location {\\n    street\\n    city\\n    cityId\\n    zipCode\\n    region\\n    country {\\n      countryCode\\n      localizationValue\\n      __typename\\n    }\\n    __typename\\n  }\\n  matchingHighlights(context: postings) {\\n    matchingFacts {\\n      type\\n      __typename\\n    }\\n    __typename\\n  }\\n  paid\\n  prioritized\\n  remoteOptions\\n  salary {\\n    ...Salary\\n    ...SalaryRange\\n    ...SalaryEstimate\\n    __typename\\n  }\\n  serviceOfferingGroup\\n  summary {\\n    trackingToken\\n    content {\\n      introduction\\n      qualifications\\n      keyResponsibilities\\n      __typename\\n    }\\n    __typename\\n  }\\n  topJob\\n  userInteractions {\\n    application {\\n      ... on JobUserXingApplication {\\n        createdAt\\n        status\\n        __typename\\n      }\\n      __typename\\n    }\\n    bookmark {\\n      state\\n      __typename\\n    }\\n    __typename\\n  }\\n  video {\\n    url\\n    __typename\\n  }\\n  __typename\\n}\\n"}`,
        method: 'POST',
      })

      // ChatGPT JD qualification
      const responseJDBody: any = await responseJob.json()
      const jobDescription = JSON.stringify(responseJDBody.data.job.description)

      const qualifiedByGpt = await getChatGptQualificationJD(jobDescription)

      const [status, reason] = qualifiedByGpt?.split('-') ?? []
      job.qualifedGpt = JSON.parse(status)
      job.reasonGpt = reason
      // Slow down request per page so we don't be blocked
      await delayExec(3000)
    }

    return jobsArray
  } catch (error: any) {
    console.log('Xing - Error principal function:', error.message, responseBody)
    return jobsArray
  }
}