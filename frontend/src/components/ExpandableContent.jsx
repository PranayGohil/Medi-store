import React, { useState } from "react";

const ExpandableContent = ({ html, limit = 300 }) => {
  const [expanded, setExpanded] = useState(false);

  // Strip HTML tags for measuring length
  const plainText = html?.replace(/<[^>]+>/g, "") || "";

  // If content is short, show full
  if (plainText.length <= limit) {
    return (
      <div
        className="prose max-w-full ql-editor"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  // Show partial content when not expanded
  const partialText = plainText.substring(0, limit) + "...";

  return (
    <div className="prose max-w-full ql-editor">
      <div
        className="text-justify"
        dangerouslySetInnerHTML={{
          __html: expanded ? html : partialText,
        }}
      />
      <button
        className="mt-2 text-[#0097b2] font-medium underline hover:text-[#007a8f]"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? "Read Less" : "Read More"}
      </button>
    </div>
  );
};

export default ExpandableContent;
