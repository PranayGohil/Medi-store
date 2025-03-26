import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

// Add hidden fields you want to exclude
const hiddenFields = ["links", "purchase_units"]; 

const NestedDropdown = ({ data, level = 0 }) => {
  const [expandedNodes, setExpandedNodes] = useState({});

  if (!data || typeof data !== "object") {
    return <div>No Details Available</div>;
  }

  const toggleNode = (key) => {
    setExpandedNodes((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const renderNode = (key, value, nodePath) => {
    if (hiddenFields.includes(key)) {
      return null; // Skip rendering hidden fields
    }

    const isObject = typeof value === "object" && value !== null;
    const isOpen = expandedNodes[nodePath];

    return (
      <div key={nodePath} className={`ml-${level * 4} mt-2`}>
        <div
          className={`flex items-center gap-5 cursor-pointer p-2 rounded-md ${
            isObject ? "hover:bg-gray-100" : ""
          }`}
          onClick={() => isObject && toggleNode(nodePath)}
        >
          <span className="font-semibold text-gray-800">{key}</span>
          {isObject ? (
            isOpen ? (
              <FaChevronUp className="text-gray-500" />
            ) : (
              <FaChevronDown className="text-gray-500" />
            )
          ) : (
            <span className="text-blue-600">{String(value)}</span>
          )}
        </div>

        {isOpen && isObject && (
          <div className="ml-4 border-l-2 border-gray-300 pl-4">
            <NestedDropdown data={value} level={level + 1} />
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      {Object.entries(data).map(([key, value]) =>
        renderNode(key, value, `${level}-${key}`)
      )}
    </div>
  );
};

export default NestedDropdown;
