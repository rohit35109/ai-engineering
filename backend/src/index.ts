import dotenv from "dotenv";
import express, { Request, Response } from "express";
import { askOllamaChat, askOllamaChatStream } from "./ollama";
import { OllamaChatResponse } from "./interface/OllamaResponse";
import { convertNsToSeconds } from "./common/helper";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// For non stream
app.post("/api/chat", async (req: Request, res: Response) => {
  const { messages } = req.body;
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "messages must be a non-empty array" });
  }
  // const result = await askOllama(req.body.prompt);
  const result = await askOllamaChat(messages);
  // res.json(result as OllamaResponse);
  res.json(result as OllamaChatResponse);
});


app.post("/api/chat/stream", async (req: Request, res: Response) => {
  const { messages } = req.body;
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "messages must be a non-empty array" });
  }

  try {
    const stream = await askOllamaChatStream(messages);

    res.setHeader("Content-Type", "application/x-ndjson");
    res.setHeader("Cache-Control", "no-cache");
    res.flushHeaders();

    const reader = stream.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
            if (!line.trim()) continue;
            const chunk = JSON.parse(line);
            if (chunk.done) {
                res.write(
                    `${JSON.stringify({
                        type: "done",
                        metrics: {
                            totalDurationInSeconds: convertNsToSeconds(chunk.total_duration),
                            loadDurationInSeconds: convertNsToSeconds(chunk.load_duration),
                            inputTokens: chunk.prompt_eval_count,
                            promptProcessingDurationSeconds: convertNsToSeconds(chunk.prompt_eval_duration),
                            outputTokens: chunk.eval_count,
                            generationDurationSeconds: convertNsToSeconds(chunk.eval_duration),
                        }
                    })}\n`
                );
            } else if (chunk.message?.content) {
                res.write(`${JSON.stringify({
                    type: "token",
                    value: chunk.message.content
                })}\n`)
            }
        }
    }
    res.end();
  }
  catch (e) {
    console.error(e);
    if (res.headersSent) {
        res.write(`${JSON.stringify({
            type: "error",
            message: "Stream failed"
        })}\n`);
        res.end();
        return;
    }
    res.status(502).json({ error: "Could not reach ollama" })
  }

  res.json();
});

// app.post("/api/chat/stream", async (req: Request, res: Response) => {
//   const { prompt } = req.body;
//   if (typeof prompt !== "string" || !prompt.trim()) {
//     res.status(400).json({ error: "Prompt must be non empty string" });
//   }

//   try {
//     const stream = await askOllamaStream(prompt);

//     res.setHeader("Content-Type", "application/x-ndjson");
//     res.setHeader("Cache-Control", "no-cache");
//     res.flushHeaders();

//     const reader = stream.getReader();
//     const decoder = new TextDecoder();
//     let buffer = '';
//     while (true) {
//         const { done, value } = await reader.read();
//         if (done) break;
//         buffer += decoder.decode(value, { stream: true });
//         const lines = buffer.split("\n");
//         buffer = lines.pop() ?? "";

//         for (const line of lines) {
//             if (!line.trim()) continue;
//             const chunk = JSON.parse(line);
//             if (chunk.done) {
//                 res.write(
//                     `${JSON.stringify({
//                         type: "done",
//                         metrics: {
//                             totalDurationInSeconds: convertNsToSeconds(chunk.total_duration),
//                             loadDurationInSeconds: convertNsToSeconds(chunk.load_duration),
//                             inputTokens: chunk.prompt_eval_count,
//                             promptProcessingDurationSeconds: convertNsToSeconds(chunk.prompt_eval_duration),
//                             outputTokens: chunk.eval_count,
//                             generationDurationSeconds: convertNsToSeconds(chunk.eval_duration),
//                         }
//                     })}\n`
//                 );
//             } else if (chunk.response) {
//                 res.write(`${JSON.stringify({
//                     type: "token",
//                     value: chunk.response
//                 })}\n`)
//             }
//         }
//     }
//     res.end();
//   }
//   catch (e) {
//     console.error(e);
//     if (res.headersSent) {
//         res.write(`${JSON.stringify({
//             type: "error",
//             message: "Stream failed"
//         })}\n`);
//         res.end();
//         return;
//     }
//     res.status(502).json({ error: "Could not reach ollama" })
//   }

//   res.json();
// });

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
