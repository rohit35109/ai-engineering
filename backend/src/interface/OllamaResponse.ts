export interface OllamaResponse {
    answer: string;
    metrics: OllamaMetrics
}

interface OllamaMetrics {
    inputTokens: number;
    outputTokens: number;
    totalDurationNs: number;
}