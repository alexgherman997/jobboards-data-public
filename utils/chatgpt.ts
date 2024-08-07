import OpenAI from 'openai'
import { promtStart, roleChatGpt } from '../utils/prompt-gpt'
import * as dotenv from 'dotenv'
dotenv.config()

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

// return true/false after gpt is qualifing the job based on what i'm looking in the next qa contract
export async function getChatGptQualificationJD(
  prompt: string,
  model = 'gpt-4o-mini',
) {
  const chatCompletion = await openai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: roleChatGpt,
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    model: model,
    max_tokens: 75,
  })
  return chatCompletion.choices[0].message.content
}



// chatgpt validation without using system role, and default starting prompt
export async function getChatGptQualificationJDv2(
  prompt: string,
  model = 'gpt-4o-mini',
) {
  const chatCompletion = await openai.chat.completions.create({
    messages: [
      {
        role: 'user',
        content: promtStart + prompt,
      },
    ],
    model: model,
    max_tokens: 75,
  })
  return chatCompletion.choices[0].message.content
}
