import { apiPost } from './api.js';

export async function generateContent(payload) {
  return apiPost('/generate', payload);
}

export async function enrichContent(payload) {
  return apiPost('/enrich', payload);
}
