# Job Portal

## Deployment

The frontend is deployed on Vercel. The Express API must run as a persistent Node service (the app uses scheduled reminders and local uploaded-file storage), so `render.yaml` is provided to deploy it on Render with a persistent uploads disk.

### 1. Deploy the API

1. Import this repository into Render using the Blueprint option and select `render.yaml`.
2. Set `MONGO_URI` to the production MongoDB connection string and `CLIENT_URL` to the final Vercel frontend origin (for example, `https://jobportal.example.com`, with no trailing slash). Add multiple comma-separated origins only when needed.
3. Configure Cloudinary values if using Cloudinary-backed uploads. Configure the SMTP values to enable password-reset and reminder emails.
4. Wait for the API service to deploy and copy its public HTTPS origin, such as `https://jobportal-api.onrender.com`.

The API requires `MONGO_URI` and `JWT_SECRET`. The Render blueprint generates a `JWT_SECRET`; never reuse a development secret in production. The persistent disk is mounted at `Backend/uploads`, because uploaded resumes and profile images must survive service restarts. The API build uses `npm install` because its existing lockfile does not include all declared resume-parsing dependencies.

### 2. Deploy the frontend

1. Import the same repository into Vercel and set **Root Directory** to `Frontend`.
2. Use the Vite defaults: build command `npm run build`, output directory `dist`, install command `npm install` (or `npm ci`).
3. Add the Vercel environment variable `VITE_API_BASE_URL` with the API's HTTPS origin from step 1, without a trailing slash or `/api` suffix.
4. Deploy. The `Frontend/vercel.json` rewrite sends client-side routes such as `/login` and `/description/:id` back to the SPA entry point.

Vite embeds `VITE_API_BASE_URL` at build time, so redeploy after changing it. For cookie-based authentication, use HTTPS and, where possible, custom domains on the same parent domain for the frontend and API (for example, `app.example.com` and `api.example.com`). Some browsers restrict cookies when the Vercel and API hosts are on unrelated domains.

### Local development

Keep `VITE_API_BASE_URL` empty in the root `.env` to use the Vite proxy to `http://localhost:5011`. Start the API from `Backend` with `npm run dev`, then start the frontend from `Frontend` with `npm run dev`.

Do not commit `.env` files. Configure production secrets in the hosting provider's environment settings. The fixed administrator login has been removed; provision an administrator by registering a normal account and promoting its `users` record to role `Administrator` in MongoDB.
