// ── aiorouter_chat Tool ──────────────────────────────────────────────────
import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { callAiorouterAPI } from "../api-client.js";

export function registerChatTool(server: McpServer, apiKey: string): void {
  server.registerTool("aiorouter_chat", {
    title: "AIOrouter Chat",
      description: `Send a chat completion to any AIOrouter model (Qwen, DeepSeek, GLM, Kimi, Grok, etc).
Returns the model's full response. Non-streaming only (MCP limitation). Increase max_tokens (up to 8192) for long responses.`,
      annotations: { destructiveHint: false },
    inputSchema: {
      model: z.string().describe("Model ID from aiorouter_list_models"),
      messages: z.array(z.object({
        role: z.enum(["user", "assistant", "system"]),
        content: z.string().max(32768),
      })).min(1).max(50).describe("Conversation messages"),
      max_tokens: z.number().int().min(1).max(8192).optional().default(8192).describe("Max response tokens (1-8192)"),
      temperature: z.number().min(0).max(2).optional().default(0.7).describe("Sampling temperature (0-2)"),
    },
  }, async ({ model, messages, max_tokens, temperature }) => {
    const response = await callAiorouterAPI("/v1/chat/completions", {
      model, messages, max_tokens, temperature, stream: false,
    }, apiKey, { timeout: 60000 });

      if (response.error) {
        const messages: Record<string, string> = {
          authentication_error: `Your API key is invalid. Get a valid key at:\nhttps://dashboard.aiorouter.ca/keys`,
          rate_limit_error: `Rate limited. Please wait and try again.`,
          server_error: `AIOrouter server error. Please try again later.`,
          timeout_error: `Request timed out. Check your network connection.`,
        };
        const hint = messages[response.error.type ?? ""] ?? "";
        const text = hint ? `Error: ${response.error.message}\n\n${hint}` : `Error: ${response.error.message}`;
        return { content: [{ type: "text" as const, text }], isError: true };
      }

    const choice = response.choices?.[0];
    if (!choice?.message?.content) {
      return { content: [{ type: "text" as const, text: "Error: No response content" }], isError: true };
    }

    return {
      content: [{ type: "text" as const, text: choice.message.content }],
      structuredContent: {
        content: choice.message.content,
        model: response.model ?? model,
        usage: response.usage ?? { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
        finish_reason: choice.finish_reason ?? "stop",
      },
    };
  });
}
