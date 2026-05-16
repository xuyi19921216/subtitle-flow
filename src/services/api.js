const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://subtitle-flow-worker.1392729514.workers.dev';

export async function generateArticle(url) {
  const response = await fetch(`${API_BASE_URL}/api/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url }),
  });

  if (!response.ok) {
    let error;
    try {
      error = await response.json();
    } catch {
      error = { error: '请求失败' };
    }
    throw new Error(error.error || '请求失败');
  }

  return response;
}