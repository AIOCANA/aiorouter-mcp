# AIOrouter MCP Connector — Privacy Policy

> **適用範圍:** `@aiorouter/mcp` (npm) 與 AIOrouter Remote MCP Server (`https://api.aiorouter.ca/mcp`)
> **生效日期:** 2026-08-01
> **版本:** 1.0

## 1. Data Collection（資料收集）

AIOrouter MCP Connector 收集以下資料：

| 資料類別 | 說明 | 必要性 |
|:---|:---|:---|
| **API Key** | 使用者提供的 `AIOROUTER_API_KEY`，存於本機環境變數，**從未寫入磁碟、從未傳輸至 npm registry** | 必要 — 驗證與計費 |
| **對話內容** | 透過 `aiorouter_chat` 傳送的 messages（使用者 prompt 與模型回覆） | 必要 — 用於 AI 模型推論 |
| **用量/計費資料** | 呼叫次數、token 用量、訂閱狀態（僅透過 API 讀取） | 必要 — 配額與計費 |
| **帳號識別**（OAuth） | Google email + user ID（僅當啟用 OAuth 2.1 連線時） | 必要 — 帳號綁定與計費橋接 |

**我們不收集：** 使用者的檔案內容（除非透過 `aiorouter_chat` 明確傳送）、瀏覽歷史、其他應用程式資料。

## 2. Usage and Storage（使用與儲存）

- 對話內容僅用於**將請求路由至使用者指定的 AI 模型**（Qwen、DeepSeek、GLM、Kimi、Grok 等）以完成推論
- 資料在**路由前經 AIOrouter PII Shield 脫敏處理**（個人資訊與技術機密會先被保護）
- 傳輸全程使用 **HTTPS 加密**
- 資料儲存依 AIOrouter 平台資料政策（見 https://aiorouter.ca/privacy）

## 3. Third-party Sharing（第三方分享）

- **AI 模型供應商**（Alibaba、DeepSeek、Zhipu、Moonshot 等）：僅收到完成推論所需的最小化請求內容（經 PII Shield 脫敏後）
- **Anthropic**：僅當使用者將 AIOrouter 設定為 Claude Desktop 的 third-party inference gateway 時，Claude 請求才經 AIOrouter 路由
- **我們不出售使用者資料**

## 4. Data Retention（資料保留）

- 依 AIOrouter 平台資料保留政策（https://aiorouter.ca/privacy）
- 使用者可隨時在 dashboard（https://dashboard.aiorouter.ca）檢視用量、刪除 API key、或請求刪除資料

## 5. Contact Information（聯絡方式）

- **隱私相關問題:** privacy@aiorouter.ca
- **安全相關問題:** security@aiorouter.ca
- **公司:** AIOrouter, https://aiorouter.ca
