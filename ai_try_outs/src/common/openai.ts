import OpenAI from "openai";
export const openai = new OpenAI({
    apiKey: process.env.NIVIDIA_API_KEY,
    baseURL: 'https://integrate.api.nvidia.com/v1',
})