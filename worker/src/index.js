import { GoogleGenerativeAI } from '@google/generative-ai';
import { YoutubeTranscript } from 'youtube-transcript';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

async function handleOptions(request) {
  return new Response(null, { headers: corsHeaders });
}

function extractVideoId(url) {
  const patterns = [
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtube\.com\/embed\/([^?]+)/,
    /youtu\.be\/([^?]+)/,
    /youtube\.com\/v\/([^?]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

async function getTranscript(videoId) {
  const languages = ['zh-Hans', 'zh-CN', 'zh', 'en'];
  
  for (const lang of languages) {
    try {
      const transcript = await YoutubeTranscript.fetchTranscript(videoId, { lang });
      const text = transcript.map(item => item.text).join(' ');
      
      if (text.length > 0) {
        return text;
      }
    } catch (error) {
      console.log(`Failed to fetch transcript for language ${lang}: ${error.message}`);
    }
  }
  
  throw new Error('无法获取视频字幕，请确保视频有可用字幕');
}

async function generateArticle(transcript) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Gemini API密钥未配置');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const prompt = `
  请将以下YouTube视频字幕内容整理成一篇结构清晰、排版优美的中文文章。

  字幕内容：
  ${transcript}

  要求：
  1. 提取视频的核心主题，生成一个吸引人的标题
  2. 将内容分成多个段落，每段围绕一个主题展开
  3. 使用适当的小标题（##）来组织内容
  4. 对于关键点，可以使用列表（- 或 1.）形式呈现
  5. 语言要流畅自然，符合中文阅读习惯
  6. 保持内容的逻辑性和连贯性

  请直接输出文章内容，不要添加额外的解释说明。
  `;

  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
  });

  return result.response.text();
}

async function handleGenerate(request) {
  if (request.method === 'OPTIONS') return handleOptions(request);
  
  try {
    const { url } = await request.json();
    const videoId = extractVideoId(url);
    
    if (!videoId) {
      return new Response(JSON.stringify({ error: '无效的YouTube链接' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const transcript = await getTranscript(videoId);
    
    if (!transcript || transcript.length === 0) {
      return new Response(JSON.stringify({ error: '未找到视频字幕' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const article = await generateArticle(transcript);
    
    if (!article || article.length === 0) {
      return new Response(JSON.stringify({ error: '文章生成失败' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(article, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/plain; charset=utf-8',
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
    const videoId = extractVideoId(url);
    
    if (!videoId) {
      return new Response(JSON.stringify({ error: '无效的YouTube链接' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const transcript = await getTranscript(videoId);
    
    return new Response(JSON.stringify({
      success: true,
      videoId: videoId,
      transcriptLength: transcript.length,
      transcriptPreview: transcript.substring(0, 500) + '...'
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
