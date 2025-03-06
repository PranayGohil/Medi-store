import React, { useRef } from "react";
import JoditEditor from "jodit-react";

const RichTextEditor = ({ value, onChange }) => {
  const editor = useRef(null);

  const config = {
    height: 300, // Set the height to 300px (adjust as needed)
    placeholder: "Write here...",
  };

  return (
    <JoditEditor
      ref={editor}
      value={value}
      config={config}
      onBlur={(newContent) => onChange(newContent)}
    />
  );
};

export default RichTextEditor;
