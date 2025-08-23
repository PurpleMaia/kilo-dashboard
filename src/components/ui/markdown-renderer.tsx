import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";

/**
 * Simple Markdown renderer that:
 * - enables GFM (tables)
 * - allows safe HTML (rehype-raw + rehype-sanitize)
 * - customizes table/th/td for accessibility & styling
 */
/* eslint-disable */
interface MarkdownProps {
  source: string
}
export default function Markdown({ source }: MarkdownProps) {
  return (
    <div className="md-wrapper" style={{ overflowX: "auto" }}>
      <ReactMarkdown
        children={source}
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSanitize]}
        components={{
          table: ({ node, ...props }) => (
            <table {...props} style={{ borderCollapse: "collapse", width: "100%" }} />
          ),
          th: ({ node, ...props }) => (
            <th {...props} scope="col" style={{ padding: "8px", border: "1px solid #ddd", background: "#f7fafc", textAlign: "left" }} />
          ),
          td: ({ node, ...props }) => (
            <td {...props} style={{ padding: "8px", border: "1px solid #ddd" }} />
          ),
          p: ({ node, ...props }) => <p {...props} className="mb-4 leading-relaxed" />,
          // optionally customize captions, links, code, etc.
        }}
      />
    </div>
  );
}
/* eslint-enable */