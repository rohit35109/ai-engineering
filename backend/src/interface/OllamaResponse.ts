export type ChatRole = "system" | "user" | "assistant";
export interface OllamaRequest {
    role: ChatRole;
    content: string;
}

export interface OllamaResponse {
    answer: string;
    metrics: OllamaMetrics;
    reason: string;
}

export interface OllamaChatResponse {
    message: {
        role: "assistant",
        content: string;
    }
    metrics: OllamaMetrics
}

interface OllamaMetrics {
    totalDurationInSeconds: number;
    generationDurationSeconds: number;
    outputTokens: number;
    promptProcessingDurationSeconds: number;
    inputTokens: number;
    loadDurationInSeconds: number;
    reason?: string
}