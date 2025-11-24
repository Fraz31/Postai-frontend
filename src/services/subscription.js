import { apiGet, apiPost } from './api.js';

export async function getSubscription() {
  return apiGet('/subscription/me');
}

export async function createCheckout(plan) {
  const data = await apiPost('/subscription/create-checkout', { plan });
  if (data && data.success && data.url) {
    window.location.href = data.url;
  }
  return data;
}
