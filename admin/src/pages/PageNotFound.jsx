import React from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center items-center p-8 bg-gray-100">
      <div className="w-full flex flex-col justify-center items-center bg-white shadow-md rounded-lg p-6">
        <h1 className="text-6xl md:text-8xl font-bold text-blue-600">404</h1>
        <h2 className="text-xl md:text-3xl font-semibold mt-4 text-gray-800">
          Oops! Page Not Found
        </h2>
        <p className="text-gray-500 mt-2 text-center">
          The page you're looking for doesn't exist or may have been moved.
        </p>

        <img
          src="https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif"
          alt="Not Found"
          className="h-auto w-[500px]"
        />

        <button
          onClick={() => navigate("/")}
          className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition flex items-center justify-center"
        >
          <FaArrowLeft className="mr-2" />
          Go Back Home
        </button>
      </div>
    </div>
  );
};

export default PageNotFound;
