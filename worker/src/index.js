import { GoogleGenAI } from '@google/genai';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

async function handleOptions() {
  return new Response(null, { headers: corsHeaders });
}

async function handleGenerate(request, env) {
  console.log('收到 generate 请求');
  
  if (request.method === 'OPTIONS') return handleOptions(request);
  
  try {
    const { url } = await request.json();
    console.log('解析 URL:', url);
    
    const apiKey = env.GEMINI_API_KEY;
    console.log('API Key 存在:', !!apiKey);
    
    if (!url || !url.includes('youtube.com') && !url.includes('youtu.be')) {
      return new Response(JSON.stringify({ error: '无效的YouTube链接' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'Gemini API密钥未配置' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const stream = new ReadableStream({
      async start(controller) {
        try {
          console.log('初始化 Gemini AI...');
          const ai = new GoogleGenAI({ apiKey });
          const model = 'gemini-3-flash-preview';

          console.log('准备 contents...');
          const contents = [
            {
              fileData: {
                fileUri: url,
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

          console.log('开始调用 Gemini API...');
          const response = await ai.models.generateContentStream({
            model: model,
            contents: contents,
          });
          console.log('Gemini API 调用成功，开始处理流...');

          for await (const chunk of response) {
            if (chunk.text) {
              console.log('收到文本块:', chunk.text.substring(0, 50));
              const sseMessage = `event: message\ndata: ${JSON.stringify(chunk.text)}\n\n`;
              controller.enqueue(new TextEncoder().encode(sseMessage));
            }
          }
          
          console.log('流处理完成');
          const doneMessage = `event: done\ndata: completed\n\n`;
          controller.enqueue(new TextEncoder().encode(doneMessage));
          controller.close();
        } catch (error) {
          console.error('处理失败:', error);
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
