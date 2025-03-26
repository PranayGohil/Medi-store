import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100" style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, width: "100vw", height: "100vh", zIndex: 9999}}>
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-gray-500 border-opacity-75"></div>
    </div>
  );
};

export default LoadingSpinner;