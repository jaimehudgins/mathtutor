import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const TUTOR_SYSTEM_PROMPT = `You are a patient, encouraging math tutor with a fun cat personality! You're helping a 7th grade student who:
- Has foundational learning gaps from COVID-era disruptions
- Struggles with: negative numbers, times tables, ratios, and basic operations
- Gets frustrated easily and believes he's "not good at math"
- Wants quick answers rather than understanding concepts
- Is working to build both skills AND confidence

## Your Core Role
You are a THINKING PARTNER, not an answer provider. Your goal is to help him succeed in the classroom WITHOUT AI assistance.

## CRITICAL RULES - Never Break These

### Rule 1: NEVER Give Direct Answers
Even if he begs, even if he's frustrated - do NOT provide answers to homework problems. Say something like:
"I know you want to finish this, but giving you the answer won't help you learn it. Let's figure this out together! 🐱 What have you tried so far?"

### Rule 2: Always Require Thinking First
Before giving ANY guidance, ask what he's tried. Accept "I don't know where to start because..." as valid, but require him to say WHY he's stuck.

### Rule 3: Use Guiding Questions (Socratic Method)
Ask questions that lead him to discover the answer himself:
- "What information does the problem give you?"
- "What is it asking you to find?"
- "Could you draw a picture of what's happening?"
- "What would be your first step?"
- "Have you seen a problem like this before?"

### Rule 4: Break Problems Into Small Steps
When overwhelmed, help identify smaller pieces. One step at a time.

### Rule 5: Find What's RIGHT Before Addressing Errors
When work is wrong:
1. Find something correct: "I see you did [X] right!"
2. Ask discovery questions: "Walk me through this step..."
3. Help HIM find the mistake - don't just say "that's wrong"

### Rule 6: Verify Understanding
After solving, ask: "Can you explain WHY you did that step?" If he can't explain it, he doesn't truly understand.

### Rule 7: Celebrate Productive Struggle
Remind him that difficulty means his brain is growing. Frustration is part of learning!

## Handling Frustration
If he seems frustrated (short answers, "idk", "just tell me", self-defeating statements):
- Acknowledge: "I can tell you're frustrated - that's completely normal! 🐱"
- Normalize: "Most people find this challenging at first"
- Reframe: "You're not bad at math - you're LEARNING math. That takes time!"
- Micro-break: "Let's paws for a second... take a breath. Now, let's look at just this one small piece."

If he says "I'm stupid" or "I can't do math":
"Hey, that's not true! You're not bad at math - you're learning something hard, and that takes time. The struggle means your brain is growing! 🐱"

## Watch for Foundational Gaps
These need extra patience and targeted practice:
- Negative number operations (signs, -3 + 5, etc.)
- Times tables (if he needs calculator for single-digit multiplication)
- Fraction operations
- Order of operations (PEMDAS)
- Ratio/proportion concepts

When you spot a gap causing repeated trouble, gently suggest:
"It seems like [concept] keeps slowing you down. Want to paws and practice just that for a bit? It'll make everything else easier! 🐱"

## Cat Personality (Keep it Natural!)
Sprinkle in 1-2 cat puns per response - don't overdo it:
- "Purr-fect thinking!" when on the right track
- "You're claw-some at this!" for encouragement
- "Let's paws and think..." when breaking down problems
- "Meow-velous!" for praise
- "That's the cat's meow!" for correct reasoning
- "You've got this, curious cat!" for motivation
- Use 🐱 emoji occasionally

## Response Structure
1. If he hasn't shown work: Ask to see his thinking first
2. If he's stuck: Use guiding questions (not answers!)
3. If he made an error: Find what's right, then guide him to find the mistake
4. If he got it right: Ask him to explain WHY it works
5. Always: Be warm, patient, and treat him as capable

## What Success Looks Like
NOT getting through homework quickly with your help.
SUCCESS is when he:
- Attempts before asking for help
- Can say WHERE and WHY he's stuck
- Catches his own mistakes
- Explains his reasoning
- Feels more confident, not more dependent

Remember: Your job is to help him become INDEPENDENT. Every hint-seeking loop should be redirected to his own thinking!`;

export async function POST(request: NextRequest) {
  try {
    // Check for API key
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error("ANTHROPIC_API_KEY is not set");
      return NextResponse.json(
        { error: "API configuration error. Please contact support." },
        { status: 500 },
      );
    }

    const { image, text, messageHistory } = await request.json();

    if (!image && !text) {
      return NextResponse.json(
        { error: "Please provide an image or text description of the problem" },
        { status: 400 },
      );
    }

    // Build the message content
    const content: Anthropic.MessageParam["content"] = [];

    // Add image if provided
    if (image) {
      // Image should be base64 encoded with data URL prefix
      // Use a more permissive regex to handle various image types (jpeg, png, gif, webp, heic, etc.)
      const base64Match = image.match(/^data:image\/([^;]+);base64,(.+)$/);
      if (base64Match) {
        // Map various image formats to Claude-supported types
        let imageType = base64Match[1].toLowerCase();

        // Claude supports: image/jpeg, image/png, image/gif, image/webp
        // Map common variations and unsupported types
        if (imageType === "jpg") {
          imageType = "jpeg";
        } else if (!["jpeg", "png", "gif", "webp"].includes(imageType)) {
          // For unsupported formats (heic, heif, bmp, tiff, etc.),
          // default to jpeg as browsers typically convert on capture
          console.log(`Unsupported image type: ${imageType}, treating as jpeg`);
          imageType = "jpeg";
        }

        const mediaType = `image/${imageType}` as
          | "image/jpeg"
          | "image/png"
          | "image/gif"
          | "image/webp";
        // Strip any whitespace/newlines from base64 data (can occur with large images)
        const base64Data = base64Match[2].replace(/\s/g, "");

        // Validate base64 data before sending to API
        // Check that it's valid base64 (only contains valid base64 characters)
        const base64Regex = /^[A-Za-z0-9+/]+=*$/;
        if (!base64Regex.test(base64Data)) {
          console.error("Invalid base64 characters in image data");
          return NextResponse.json(
            {
              error:
                "The image couldn't be processed. Please try taking a new photo or uploading a different image.",
            },
            { status: 400 },
          );
        }

        // Check minimum length (a valid image should have reasonable data)
        if (base64Data.length < 100) {
          console.error("Base64 data too short to be a valid image");
          return NextResponse.json(
            {
              error:
                "The image appears to be corrupted. Please try again with a different photo.",
            },
            { status: 400 },
          );
        }

        content.push({
          type: "image",
          source: {
            type: "base64",
            media_type: mediaType,
            data: base64Data,
          },
        });
      } else {
        // Image was provided but couldn't be parsed
        console.error("Failed to parse image data URL format");
        return NextResponse.json(
          {
            error:
              "Could not process the image. Please try a different image or take a new photo.",
          },
          { status: 400 },
        );
      }
    }

    // Add text prompt
    const userPrompt = text
      ? `Here's my homework problem: ${text}`
      : "Here's my homework problem (see the image).";

    content.push({
      type: "text",
      text: userPrompt,
    });

    // Build conversation history for context
    const messages: Anthropic.MessageParam[] = [];

    // Add previous messages if any
    if (messageHistory && Array.isArray(messageHistory)) {
      for (const msg of messageHistory.slice(-10)) {
        // Keep last 10 messages for context
        if (msg.role === "student") {
          messages.push({
            role: "user",
            content: msg.content,
          });
        } else if (msg.role === "tutor") {
          messages.push({
            role: "assistant",
            content: msg.content,
          });
        }
      }
    }

    // Add current message
    messages.push({
      role: "user",
      content,
    });

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1500,
      system: TUTOR_SYSTEM_PROMPT,
      messages,
    });

    const assistantMessage =
      response.content[0].type === "text"
        ? response.content[0].text
        : "I had trouble analyzing that. Could you try again? 🐱";

    return NextResponse.json({ response: assistantMessage });
  } catch (error) {
    console.error("Error analyzing homework:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    // Check for credit/billing issues
    if (
      errorMessage.includes("credit") ||
      errorMessage.includes("billing") ||
      errorMessage.includes("balance")
    ) {
      return NextResponse.json(
        {
          error:
            "Meow! 😿 The Helper Cat is taking a catnap right now. Let Aunt Jaime know that I need some kibble!",
        },
        { status: 503 },
      );
    }

    // Check for rate limiting
    if (errorMessage.includes("rate") || errorMessage.includes("too many")) {
      return NextResponse.json(
        {
          error:
            "Whoa, slow down! 🐱 This cat needs a moment to catch up. Try again in a few seconds!",
        },
        { status: 429 },
      );
    }

    // Check for invalid image/pattern errors from the API
    if (
      errorMessage.includes("did not match the expected pattern") ||
      errorMessage.includes("Could not process image") ||
      errorMessage.includes("Invalid base64")
    ) {
      return NextResponse.json(
        {
          error:
            "Meow! 😿 I couldn't read that image clearly. Try taking a new photo with better lighting, or type out the problem instead!",
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        error:
          "Meow! 😿 Something went wrong. Try again or describe your problem differently!",
      },
      { status: 500 },
    );
  }
}
