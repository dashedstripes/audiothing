import { anthropic } from "@ai-sdk/anthropic";
import { createMCPClient } from "@ai-sdk/mcp";
import {
  convertToModelMessages,
  stepCountIs,
  streamText,
  type UIMessage,
} from "ai";
import { z } from "zod";

import { CLIENT_TOOLS, type UserContext } from "@/lib/client-tools";

/**
 * Client-side tools for capturing page context.
 * No execute functions - execution happens on the client via onToolCall.
 */
const clientTools = {
  [CLIENT_TOOLS.PAGE_CONTEXT]: {
    description: `Page context as markdown: URL, title, and text content (headings, links, lists). Fast. No visuals.`,
    inputSchema: z.object({
      reason: z.string().describe("Why you need page context"),
    }),
  },
  [CLIENT_TOOLS.SCREENSHOT]: {
    description: `Visual screenshot of the page. You CANNOT see anything visual without this - no images, colors, layout, or appearance.`,
    inputSchema: z.object({
      reason: z.string().describe("Why you need a screenshot"),
    }),
  },
};

/**
 * System prompt for the AudioThing content assistant
 */
function getSystemPrompt(userContext: UserContext) {
  return `You are a helpful content assistant for AudioThing, a website about audio production tips, techniques, reviews, and news.

## Your Capabilities
- Search and find news articles about audio production
- Find and explain tutorials with step-by-step instructions
- Answer questions about audio production topics covered on the site
- Help users discover relevant content

## Current User Context
- Page: ${userContext.documentTitle}
- Location: ${userContext.documentLocation}

## How to Respond
- Be friendly, helpful, and concise
- When showing articles or tutorials, include title and a brief summary
- When providing results, ALWAYS include links: [News Title](/news/slug)
- If you can't find what the user wants, suggest related content
- Use markdown formatting for better readability

## Tool Usage
- Use initial_context first to understand available content types
- Use groq_query to find specific content (news articles, tutorials)
- For news: query _type == "news" with fields like title, slug, body
- For tutorials: query _type == "tutorial" with fields like title, slug, steps
- Always include _id in your projections
- You can combine filters with semantic search using text::embedding() for better results`;
}

export async function POST(req: Request) {
  const {
    messages,
    userContext,
  }: { messages: UIMessage[]; userContext: UserContext } = await req.json();

  if (!process.env.SANITY_CONTEXT_MCP_URL) {
    throw new Error(
      "SANITY_CONTEXT_MCP_URL is not set. Create an Agent Context document in Sanity Studio first.",
    );
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY is not set");
  }

  const mcpClient = await createMCPClient({
    transport: {
      type: "http",
      url: process.env.SANITY_CONTEXT_MCP_URL,
      headers: {
        Authorization: `Bearer ${process.env.SANITY_API_READ_TOKEN}`,
      },
    },
  });

  const systemPrompt = getSystemPrompt(
    userContext || {
      documentTitle: "AudioThing",
      documentLocation: "/",
    },
  );

  try {
    const mcpTools = await mcpClient.tools();

    const result = streamText({
      model: anthropic("claude-sonnet-4-20250514"),
      system: systemPrompt,
      messages: await convertToModelMessages(messages),
      tools: {
        ...mcpTools,
        ...clientTools,
      },
      stopWhen: stepCountIs(20),
      onFinish: async () => {
        await mcpClient.close();
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    await mcpClient.close();
    throw error;
  }
}
