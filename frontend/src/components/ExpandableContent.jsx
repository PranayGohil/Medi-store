import React, { useState } from "react";

const ExpandableContent = ({ html, limit = 300 }) => {
  const [expanded, setExpanded] = useState(false);

  // Strip HTML tags for measuring length
  const plainText = html?.replace(/<[^>]+>/g, "") || "";

  // If content is short, show full without scroll
  if (plainText.length <= limit) {
    return (
      <div
        className="prose max-w-full ql-editor p-4"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  // Show partial content when not expanded
  const partialText = plainText.substring(0, limit) + "...";

  return (
    <div className="prose max-w-full ql-editor">
      <div
        className={`text-justify p-4 ${
          expanded ? "max-h-[500px] overflow-y-auto scrollbar-custom" : ""
        }`}
        dangerouslySetInnerHTML={{
          __html: expanded ? html : partialText,
        }}
      />
      <div className="px-4 pb-4">
        <button
          className="text-[#0097b2] font-Poppins text-[14px] font-medium underline hover:text-[#007a8f] transition-all"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "Read Less" : "Read More"}
        </button>
      </div>

      <style jsx>{`
        .scrollbar-custom::-webkit-scrollbar {
          width: 8px;
        }

        .scrollbar-custom::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }

        .scrollbar-custom::-webkit-scrollbar-thumb {
          background: #0097b2;
          border-radius: 10px;
        }

        .scrollbar-custom::-webkit-scrollbar-thumb:hover {
          background: #007a8f;
        }

        /* For Firefox */
        .scrollbar-custom {
          scrollbar-width: thin;
          scrollbar-color: #0097b2 #f1f1f1;
        }
      `}</style>
    </div>
  );
};

export default ExpandableContent;
  