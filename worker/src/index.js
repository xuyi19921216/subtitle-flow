import { GoogleGenAI } from '@google/genai';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

async function handleOptions() {
  return new Response(null, { headers: corsHeaders });
}

async function* generateArticleStream(youtubeUrl, apiKey) {
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
      text: `请将视频整理成专业结构化访谈的中文稿。
      要求：
      1.标题统一为「对话【嘉宾名称】：【视频核心主题】」，按视频话题逻辑拆分一级标题，全文使用「主持人：提问内容」「嘉宾：回答内容」问答格式呈现。
      2.去除口癖、重复语句、无效闲聊，将口语内容精炼为书面专业表述，完整保留核心观点、行业判断、干货结论，不杜撰、不主观扩写。
      3.输出干净无多余符号、无额外总结评价、无冗余格式，适配高端商业访谈文稿风格。`,
    },
  ];

  const response = await ai.models.generateContentStream({
    model: model,
    contents: contents,
  });

  for await (const chunk of response) {
    if (chunk.text) {
      console.log(chunk.text);
      yield chunk.text;
    }
  }
}

async function handleGenerate(request, env) {
  if (request.method === 'OPTIONS') return handleOptions(request);
  
  try {
    const { url } = await request.json();
    const apiKey = env.GEMINI_API_KEY;
    
    if (!url || !url.includes('youtube.com') && !url.includes('youtu.be')) {
      return new Response(JSON.stringify({ error: '无效的YouTube链接' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of generateArticleStream(url, apiKey)) {
            const sseMessage = `event: message\ndata: ${JSON.stringify(chunk)}\n\n`;
            controller.enqueue(new TextEncoder().encode(sseMessage));
          }
          const doneMessage = `event: done\ndata: completed\n\n`;
          controller.enqueue(new TextEncoder().encode(doneMessage));
          controller.close();
        } catch (error) {
          const errorMessage = `event: error\ndata: ${JSON.stringify(error.message)}\n\n`;
          controller.enqueue(new TextEncoder().encode(errorMessage));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    if (url.pathname === '/api/generate') {
      return handleGenerate(request, env);
    }

    return new Response('Not found', { status: 404 });
  },
};
