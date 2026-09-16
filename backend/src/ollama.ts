import { convertNsToSeconds } from "./common/helper";
import { OllamaResponse } from "./interface/OllamaResponse";

export async function askOllamaStream(prompt: string): Promise<ReadableStream<Uint8Array>> {
    const response = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: "llama3.2",
            prompt,
            stream: true
        })
    });
    if (!response.ok) {
        throw new Error(`Ollama returned ${response.status}`);
    }
    if (!response.body) {
        throw new Error("Ollama returned no response body")
    }
    return response.body;
}
 
export async function askOllama(prompt: string): Promise<OllamaResponse | null> {
    try {
        if (!prompt) { return null }
        const response = await fetch("http://localhost:11434/api/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "llama3.2",
                prompt,
                stream: false
            })
        });
        if (!response.ok) {
            throw new Error("Failed to get AI response. Try again later")
        }
        const jsonResponse = await response.json();
        return {
            answer: jsonResponse.response,
            reason: jsonResponse.done_reason,
            metrics: {
                totalDurationInSeconds: convertNsToSeconds(jsonResponse.total_duration),
                loadDurationInSeconds: convertNsToSeconds(jsonResponse.load_duration),
                inputTokens: jsonResponse.prompt_eval_count,
                promptProcessingDurationSeconds: convertNsToSeconds(jsonResponse.prompt_eval_duration),
                outputTokens: jsonResponse.eval_count,
                generationDurationSeconds: convertNsToSeconds(jsonResponse.eval_duration),
            }
        }
    } catch (e: any) {
        throw new Error(e.message)
    }
}