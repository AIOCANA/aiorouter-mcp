// ── AIOrouter API Client ─────────────────────────────────────────────────
// HTTP client for making requests to the AIOrouter API from the local
// MCP stdio server. All tools use this client to communicate with the
// AIOrouter cloud service.

const BASE_URL = "https://api.aiorouter.ca";
const DEFAULT_TIMEOUT_MS = 30000;

export interface AiorouterApiResponse {
  choices?: Array<{
    message?: { content: string; role: string };
    finish_reason?: string;
  }>;
  model?: string;
  usage?: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
  error?: { message: string; type?: string };
  data?: unknown;
  [key: string]: unknown;
}

export interface ApiClientOptions {
  timeout?: number;
}

// ── Shared error handling ──────────────────────────────────────────────

function mapHttpStatusToErrorType(status: number): string {
  if (status === 401) return "authentication_error";
  if (status === 403) return "forbidden";
  if (status === 429) return "rate_limit_error";
  if (status >= 500) return "server_error";
  return "api_error";
}

async function handleNon2xx(response: Response): Promise<AiorouterApiResponse> {
  let body: Record<string, unknown> = {};
  try { body = await response.json() as Record<string, unknown>; } catch { /* keep empty */ }
  const apiError = body?.error as Record<string, unknown> | undefined;
  return {
    error: {
      message: typeof apiError?.message === "string" ? apiError.message : `HTTP ${response.status}`,
      type: mapHttpStatusToErrorType(response.status),
    },
  };
}

function handleFetchError(error: unknown): AiorouterApiResponse {
  if (error instanceof Error) {
    const name = error.name === "TimeoutError" || error.name === "AbortError" ? "timeout_error" : "network_error";
    return { error: { message: `${name}: ${error.message}`, type: name } };
  }
  return { error: { message: "Unknown error", type: "unknown_error" } };
}

// ── Public API ─────────────────────────────────────────────────────────

export async function callAiorouterAPI(
  endpoint: string,
  body: Record<string, unknown>,
  apiKey: string,
  options: ApiClientOptions = {}
): Promise<AiorouterApiResponse> {
  const url = `${BASE_URL}${endpoint}`;
  const timeout = options.timeout ?? DEFAULT_TIMEOUT_MS;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(timeout),
    });

    if (!response.ok) return handleNon2xx(response);
    return (await response.json()) as AiorouterApiResponse;
  } catch (error) {
    return handleFetchError(error);
  }
}

export async function getAiorouterAPI(
  endpoint: string,
  apiKey: string,
  options: ApiClientOptions = {}
): Promise<AiorouterApiResponse> {
  const url = `${BASE_URL}${endpoint}`;
  const timeout = options.timeout ?? DEFAULT_TIMEOUT_MS;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: { Authorization: `Bearer ${apiKey}` },
      signal: AbortSignal.timeout(timeout),
    });

    if (!response.ok) return handleNon2xx(response);
    return (await response.json()) as AiorouterApiResponse;
  } catch (error) {
    return handleFetchError(error);
  }
}
