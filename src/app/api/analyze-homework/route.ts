import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { image, text, messageHistory } = await request.json();

    if (!image && !text) {
      return NextResponse.json(
        { error: 'Please provide an image or text description of the problem' },
        { status: 400 }
      );
    }

    // Build the message content
    const content: Anthropic.MessageParam['content'] = [];

    // Add image if provided
    if (image) {
      // Image should be base64 encoded with data URL prefix
      const base64Match = image.match(/^data:image\/(\w+);base64,(.+)$/);
      if (base64Match) {
        const mediaType = `image/${base64Match[1]}` as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp';
        const base64Data = base64Match[2];
        content.push({
          type: 'image',
          source: {
            type: 'base64',
            media_type: mediaType,
            data: base64Data,
          },
        });
      }
    }

    // Add text prompt
    const userPrompt = text
      ? `Here's my homework problem: ${text}\n\nPlease help me understand and solve this step by step.`
      : 'Please look at this homework problem and help me understand and solve it step by step.';

    content.push({
      type: 'text',
      text: userPrompt,
    });

    // Build conversation history for context
    const messages: Anthropic.MessageParam[] = [];

    // Add previous messages if any
    if (messageHistory && Array.isArray(messageHistory)) {
      for (const msg of messageHistory.slice(-10)) { // Keep last 10 messages for context
        if (msg.role === 'student') {
          messages.push({
            role: 'user',
            content: msg.content,
          });
        } else if (msg.role === 'tutor') {
          messages.push({
            role: 'assistant',
            content: msg.content,
          });
        }
      }
    }

    // Add current message
    messages.push({
      role: 'user',
      content,
    });

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      system: `You are a friendly and encouraging math tutor helping a 7th grade student with their homework. Your role is to:

1. Carefully read and understand the math problem (from the image and/or text)
2. Break down the problem into clear, manageable steps
3. Explain each step in simple language a 7th grader can understand
4. Don't just give the answer - guide the student through the thinking process
5. Use encouraging language and celebrate their efforts
6. If you see multiple problems, focus on one at a time unless asked otherwise
7. Point out any relevant formulas or concepts they should know
8. If the handwriting or image is unclear, ask for clarification

Topics you might see include: ratios, proportions, percents, integers, rational numbers, expressions, equations, geometry (circles, angles, area, volume), probability, and statistics.

Keep responses concise but thorough. Use simple formatting with line breaks for readability.`,
      messages,
    });

    const assistantMessage = response.content[0].type === 'text'
      ? response.content[0].text
      : 'I had trouble analyzing that. Could you try again?';

    return NextResponse.json({ response: assistantMessage });
  } catch (error) {
    console.error('Error analyzing homework:', error);
    return NextResponse.json(
      { error: 'Failed to analyze homework. Please try again.' },
      { status: 500 }
    );
  }
}
