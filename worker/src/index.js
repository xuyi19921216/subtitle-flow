import { GoogleGenAI } from '@google/genai';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

async function handleOptions(request) {
  return new Response(null, { headers: corsHeaders });
}

async function* generateArticleStream(youtubeUrl) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Gemini API密钥未配置');
  }

  const ai = new GoogleGenAI({ apiKey });
  const model = 'gemini-3-flash-preview';

  const contents = [
    {
      fileData: {
        fileUri: youtubeUrl,
      },
    },
    {
      text: `请根据这个YouTube视频生成一篇结构清晰、排版优美的中文文章。

要求：
1. 提取视频的核心主题，生成一个吸引人的标题
2. 将内容分成多个段落，每段围绕一个主题展开
3. 使用适当的小标题（##）来组织内容
4. 对于关键点，可以使用列表（- 或 1.）形式呈现
5. 语言要流畅自然，符合中文阅读习惯
6. 保持内容的逻辑性和连贯性

请直接输出文章内容，不要添加额外的解释说明。`,
    },
  ];

  const response = await ai.models.generateContentStream({
    model: model,
    contents: contents,
  });

  for await (const chunk of response) {
    if (chunk.text) {
      yield chunk.text;
    }
  }
}

async function handleGenerate(request) {
  if (request.method === 'OPTIONS') return handleOptions(request);
  
  try {
    const { url } = await request.json();
    
    if (!url || !url.includes('youtube.com') && !url.includes('youtu.be')) {
      return new Response(JSON.stringify({ error: '无效的YouTube链接' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of generateArticleStream(url)) {
            controller.enqueue(new TextEncoder().encode(chunk));
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

async function handleTest(request) {
  if (request.method === 'OPTIONS') return handleOptions(request);
  
  try {
    const { url } = await request.json();
    
    if (!url || !url.includes('youtube.com') && !url.includes('youtu.be')) {
      return new Response(JSON.stringify({ error: '无效的YouTube链接' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({
      success: true,
      url: url,
      message: 'YouTube链接已接收，准备发送给Gemini处理'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

export default {
  async fetch(request) {
    const url = new URL(request.url);
    
    if (url.pathname === '/api/generate') {
      return handleGenerate(request);
    }
    
    if (url.pathname === '/api/test') {
      return handleTest(request);
    }

    return new Response('Not found', { status: 404 });
  },
};
