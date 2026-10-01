// Backend API base — use relative path so Vite dev server proxy is applied
// This avoids cross-origin cookie issues during development.
const API_BASE = "/api";
export const USER_API_ENDPOINT = `${API_BASE}/user`;
export const JOB_API_ENDPOINT = `${API_BASE}/job`;
export const APPLICATION_API_ENDPOINT = `${API_BASE}/application`;
export const COMPANY_API_ENDPOINT = `${API_BASE}/company`;
export const INTERVIEW_API_ENDPOINT = `${API_BASE}/interviews`;
export const CHAT_API_ENDPOINT = `${API_BASE}/chat`;