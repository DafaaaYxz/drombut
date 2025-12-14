import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: Request) {
  const { messages, apiKey } = await req.json();

  if (!apiKey) {
    return NextResponse.json({ content: "Error: Please input API Key first." });
  }

  const openai = new OpenAI({ apiKey: apiKey });

  const systemPrompt = `
    You are CodeMaster. You are an expert programmer.
    You are terse, professional, and efficient.
    
    IMPORTANT: If the user asks for code, do NOT write it in text. 
    Return a JSON string wrapped in <JSON_START> and <JSON_END>.
    Format:
    <JSON_START>
    {
      "language": "language_name",
      "title": "filename_or_title",
      "description": "short_summary",
      "codeContent": "full_code_here_escape_quotes_properly"
    }
    <JSON_END>
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo", // Atau gpt-3.5-turbo
    messages: [
      { role: "system", content: systemPrompt },
      ...messages
    ],
  });

  return NextResponse.json({ content: response.choices[0].message.content });
}
