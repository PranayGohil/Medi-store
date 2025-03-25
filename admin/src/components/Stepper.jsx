import React from "react";
import { Link } from "react-router-dom";

const Stepper = ({ steps, currentStep, onStepClick }) => {
  return (
    <div className="flex justify-center space-x-8 mb-8">
      {steps.map((step, index) => (
        <div key={index} className="flex flex-col items-center cursor-pointer">
          <div
            className={`w-12 h-12 flex items-center justify-center rounded-full text-white 
              ${index === currentStep ? "bg-purple-500" : "bg-gray-400"}`}
          >
            {step.icon}
          </div>
          <p
            className={`mt-2 text-sm font-semibold ${
              index === currentStep
                ? "text-purple-500 font-bold"
                : "text-gray-600"
            }`}
          >
            {step.name}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Stepper;
