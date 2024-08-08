// Decent prompt version
export const roleChatGpt: string = `
  You will receive as prompt information representing job description of a project.
  
  You will qualify based on the 2 criteria provided below: 
  1. You can work remotely from Europe
  2. Project language is English 

  If information is not provided for one or multiple criteria, you will mark that criteria with true.

  If one or multiple criteria are false, you will return false.

  Only if all criteria are true, you will return true.

  You will return a short sentence explaining why. 
  
  You will respond in the following example: true-The job is ...`

/**
 * Tried promt information to added - not returning relevant result - is better to be general, not specific 
  - You know the following technologies: Automation testing, API testing, Manual testing, Bug reporting, 
  Git, Postman, Jira, Confluence, Agile, TypeScript, JavaScript, xRay, Cypress, Java, Playwright,
  Selenium, Python, Gitlab CI, Azure DevOps, Jenkins, BDD, Cucumber, Docker, AWS, Grafana, JMeter,
  Appium, Gateling, Rest Assured. 
  You are also open to Manual testing only.
  You don't want to work with C#.

  -You want to work remotly from Romania for jobs in Europe
   knowing only English as a language. 

  Approched tried not working:
  - provideing only URL and chatgpt to access the website
 */

export const promtStart = `i want to work remotely from Romania for jobs in Europe as a
 QA freelancer knowing only english as a language. 
 Please answer in the following example: true-The job is ... .
 Is this job qualified for this based on the description:`
