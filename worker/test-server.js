import http from 'http';
import { assets } from './src/assets.js';
import workerHandler from './src/index.js';

const PORT = 8787;

const mockEnv = {
  GEMINI_API_KEY: 'AIzaSyCvo5xyQBwd5RehHUH18XB6ge7DvvTkqmI'
};

const server = http.createServer(async (req, res) => {
  // 将 Node.js 的 Request 对象转换为类似 Fetch API 的 Request 对象
  const url = new URL(req.url, `http://${req.headers.host}`);
  
  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (value !== undefined) {
      if (Array.isArray(value)) {
        for (const v of value) {
          headers.append(key, v);
        }
      } else {
        headers.set(key, value);
      }
    }
  }
  
  let body;
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    body = Buffer.concat(chunks);
  }
  
  const mockReq = new Request(url.toString(), {
    method: req.method,
    headers,
    body
  });
  
  try {
    const response = await workerHandler.fetch(mockReq, mockEnv, {});
    
    // 将 Worker Response 转换为 Node.js 响应
    res.statusCode = response.status;
    for (const [key, value] of response.headers.entries()) {
      res.setHeader(key, value);
    }
    
    if (response.body) {
      const reader = response.body.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(value);
      }
    }
    res.end();
  } catch (error) {
    console.error('Error:', error);
    res.statusCode = 500;
    res.end('Internal Server Error');
  }
});

server.listen(PORT, () => {
  console.log(`Test server running on http://localhost:${PORT}`);
  console.log('Ready to test the application!');
});
