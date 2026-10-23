# Totalna jatka — AI

Each player writes one freeform description. The browser sends both descriptions to
`api/total-duel.js`, which uses OpenAI Responses with structured JSON output. There
is no keyword scoring or local fallback. Ordinary game modes remain entirely local.

## Deploy the whole game on Vercel

1. Import `yellowBirdy/jatka-ai` in Vercel and select branch `master`.
2. Framework preset: Other. The checked-in `vercel.json` supplies the build command,
   static output directory and Node function settings.
3. In Project Settings → Environment Variables add `OPENAI_API_KEY`. This is a
   server-side secret. Do not put it in source files, browser storage or chat.
   The OpenAI API account needs available API credit; a ChatGPT subscription is separate.
4. Optionally set `OPENAI_MODEL` (default `gpt-4.1-mini`). Deploy.
5. Open the Vercel URL and choose “Totalna jatka”. Test two descriptions and confirm
   that the short narrative, long narrative and explanation are returned.

## Keep GitHub Pages as the frontend

Deploy the same repository on Vercel as above, then set `ALLOWED_ORIGIN` in Vercel to
`https://yellowbirdy.github.io`. Set `totalAiEndpoint` in `ai-config.js` to
`https://YOUR-PROJECT.vercel.app/api/total-duel` and republish Pages.
Never add the API key to `ai-config.js`.

## Limits and validation

Each description may contain up to 20,000 characters. The API timeout is 90 seconds;
the function allows 120 seconds. An in-memory per-instance limit allows 12 calls per
10 minutes per IP. For a widely shared public deployment, enable durable rate limits
in the hosting platform and set a spending budget for the API project.
The backend validates input, restricts cross-origin browser access and uses structured
output. The frontend renders AI and player text through `textContent`.
Drafts remain local; descriptions are sent to OpenAI only when the player starts a duel.

`npm test` tests the API with a mocked upstream response and does not require a key.
`npm run build:site` prepares the static assets used by Vercel.
