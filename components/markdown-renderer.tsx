import React from "react";
import Markdown from "markdown-to-jsx";

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <div
      className="prose prose-invert max-w-none
                    prose-headings:text-white 
                    prose-a:text-blue-400 
                    prose-strong:text-white
                    prose-code:text-white
                    prose-pre:bg-brandSecondary
                    "
    >
      <Markdown>{content}</Markdown>
    </div>
  );
};

export default MarkdownRenderer;
