export interface OllamaResponse {
    answer: string;
    metrics: OllamaMetrics;
    reason: string;
}

interface OllamaMetrics {
    totalDurationInSeconds: number;
    generationDurationSeconds: number;
    outputTokens: number;
    promptProcessingDurationSeconds: number;
    inputTokens: number;
    loadDurationInSeconds: number;
}