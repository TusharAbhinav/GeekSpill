import * as cheerio from "cheerio";
import { NextRequest, NextResponse } from "next/server";

// Helper function to extract text from HTML
function extractTextFromHtml(html: string) {
  const $ = cheerio.load(html);
  
  // Remove irrelevant elements
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

function convertBulletsToHtml(text: string): string {
  const lines = text.split('\n');
  let inBulletList = false;
  
  return lines.map(line => {
    const trimmedLine = line.trim();
    
    if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
      if (!inBulletList) {
        inBulletList = true;
        return `<ul class="list-disc ml-6 my-4">\n<li>${trimmedLine.slice(2)}</li>`;
      }
      return `<li>${trimmedLine.slice(2)}</li>`;
    } else if (inBulletList && trimmedLine === '') {
      inBulletList = false;
      return '</ul>';
    } else if (trimmedLine === '') {
      return '<br>';
    } else {
      if (inBulletList) {
        inBulletList = false;
        return `</ul>\n<p>${trimmedLine}</p>`;
      }
      return `<p>${trimmedLine}</p>`;
    }
  }).join('\n');
}

async function summarizeTextWithOpenAI(text: string) {
  const apiUrl = "https://api.openai.com/v1/chat/completions";
  const headers = {
    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    "Content-Type": "application/json",
  };

  if (text.length < 50) {
    console.warn("Text is too short to summarize");
    return "<p>Text is too short for meaningful summarization</p>";
  }

  const body = JSON.stringify({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: `You are a helpful assistant that summarizes text from mainly technical links.text might include irrelevant content you need to remove those and focus on main content 
          Please structure your response as follows:
          1. Start with a brief overview paragraph
          2. Include 3-5 key takeaways as bullet points
          3. End with a detailed analysis paragraph
          4. Maximum length should be around 600 words
           Format bullet points with "- " or "* ".
          Ensure the content is relevant and technical jargon is explained clearly and please try to explain like a human.Always answer from point of view of a first person`,
      },
      {
        role: "user",
        content: `Please summarize the following content:\n\n${text} and don't include any irrelevant part and focus on main content`,
      },
    ],
    max_tokens: 800,
    temperature: 0.7,
  });

  let retries = 3;
  while (retries > 0) {
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers,
        body,
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error("Error response:", responseData);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const summaryText = responseData.choices[0].message.content.trim();
      return convertBulletsToHtml(summaryText);
    } catch (error) {
      if (retries <= 1) {
        console.error("Error summarizing text:", error);
        throw error;
      }
      retries -= 1;
      console.log("Retrying request...");
      await new Promise(resolve => setTimeout(resolve, 1000 * (4 - retries)));
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

    const summaryHtml = await summarizeTextWithOpenAI(extractedText);

    const formattedHtml = `
      <article>
        <h1 class="text-2xl font-bold mb-6">Summary</h1>
        <div>
          ${summaryHtml}
        </div>
      </article>
    `;

    return NextResponse.json({ summaryGenerated: formattedHtml });
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