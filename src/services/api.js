const API_BASE_URL = import.meta.env.VITE_API_URL;

export async function generateArticle(url) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 120000);

  const response = await fetch(`${API_BASE_URL}/api/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url }),
    signal: controller.signal,
  });

  clearTimeout(timeoutId);

  console.log('Response:', response);
  console.log('Response status:', response.status);
  console.log('Response ok:', response.ok);
  console.log('Response headers:', Object.fromEntries(response.headers.entries()));

  if (!response.ok) {
    let error;
    try {
      error = await response.json();
    } catch {
      const text = await response.text();
      throw new Error(error?.error || `请求失败: ${response.status} - ${text || '无响应'}`);
    }
    throw new Error(error.error || '请求失败');
  }

  return response;
}
