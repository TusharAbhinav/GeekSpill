import * as cheerio from "cheerio";
import { NextRequest, NextResponse } from "next/server";

function extractTextFromHtml(html: string) {
  const $ = cheerio.load(html);

  $('script, style, [style*="display:none"], head').remove();

  const textElements = [
    "p",
    "article",
    ".article-body",
    ".content",
    "#content",
  ];

  let extractedText = "";

  for (const selector of textElements) {
    const content = $(selector).text();
    if (content.trim().length > extractedText.length) {
      extractedText = content;
    }
    if (selector === "p") break;
  }

  return extractedText.replace(/\s+/g, " ").replace(/\n+/g, " ").trim();
}

async function summarizeTextWithHuggingFace(text: string) {
  const url =
    "https://api-inference.huggingface.co/models/facebook/bart-large-cnn";
  const headers = {
    Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
    "Content-Type": "application/json",
  };

  if (text.length < 50) {
    console.warn("Text is too short to summarize");
    return "Text is too short for meaningful summarization";
  }

  const truncatedText = text.length > 1000 ? text.slice(0, 1000) : text;

  const body = JSON.stringify({
    inputs: truncatedText,
    parameters: {
      max_length: 300,
      min_length: 150,
      do_sample: true,
      num_beams: 4,
      early_stopping: true,
    },
  });

  let retries = 3;

  while (retries > 0) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers,
        body,
      });

      const responseData = await response.json();

      if (response.status === 503) {
        console.log("Model is loading, retrying...");
        retries -= 1;
        await new Promise((resolve) => setTimeout(resolve, 10000));
        continue;
      }

      if (!response.ok) {
        console.error("Error response:", responseData);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return (
        responseData[0]?.summary_text ||
        responseData[0]?.generated_text ||
        "Summary not available"
      );
    } catch (error) {
      if (retries <= 1) {
        console.error("Error summarizing text:", error);
        throw error;
      }
      retries -= 1;
      console.log("Retrying request...");
    }
  }

  throw new Error("Failed to summarize after multiple retries.");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const res = await fetch(url);

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch the URL" },
        { status: res.status }
      );
    }

    const htmlContent = await res.text();
    const extractedText = extractTextFromHtml(htmlContent);

    if (!extractedText) {
      return NextResponse.json(
        { error: "No valid content found to summarize" },
        { status: 400 }
      );
    }

    const summaryGenerated = await summarizeTextWithHuggingFace(extractedText);

    const htmlSummary = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <title>Article Summary</title>
      </head>
      <body>
          <article>
              <h1>Summary</h1>
              <p>${summaryGenerated}</p>
          </article>
      </body>
      </html>
    `;

    return NextResponse.json({ summaryGenerated: htmlSummary });
  } catch (error) {
    return NextResponse.json(
      {
        error: "An error occurred",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
