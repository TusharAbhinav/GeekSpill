import MarkdownRenderer from "@/components/markdown-renderer";
import React from "react";
import fs from "fs";
import path from "path";

const getMarkdownContent = async () => {
  const filePath = path.join(process.cwd(), "release-notes.md");
  const markdown = fs.readFileSync(filePath, "utf-8");
  return markdown;
};

const HomePage = async () => {
  const markdown = await getMarkdownContent();
  return (
    <main className="min-h-screen bg-background text-foreground p-6">
      <MarkdownRenderer content={markdown} />
    </main>
  );
};

export default HomePage;
