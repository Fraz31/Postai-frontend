const TOAST_CONTAINER_ID = 'postai-toast-container';

function ensureContainer() {
  let el = document.getElementById(TOAST_CONTAINER_ID);
  if (!el) {
    el = document.createElement('div');
    el.id = TOAST_CONTAINER_ID;
    el.className = 'toast-container';
    document.body.appendChild(el);
  }
  return el;
}

function showToast(message, type) {
  const container = ensureContainer();
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('show');
  }, 10);

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

export function showError(message) {
  showToast(message, 'error');
}

export function showSuccess(message) {
  showToast(message, 'success');
}
