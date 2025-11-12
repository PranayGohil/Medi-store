// src/components/TestimonialsSection.jsx

import React from "react";
import { FaQuoteLeft } from "react-icons/fa"; // Using react-icons for a modern quote icon

const TestimonialsSection = () => {
  // Common container class (retaining your responsive container structure)
  const containerClass = "mx-auto min-[1400px]:max-w-[1320px] min-[1200px]:max-w-[1140px] min-[992px]:max-w-[960px] min-[768px]:max-w-[720px] min-[576px]:max-w-[540px] px-[12px]";
  
  // Custom theme colors
  const primaryColor = "#0097b2"; // Arrowmeds primary color
  const headingColor = "#1a5b4f"; // Darker, trusted green
  
  const testimonials = [
    {
      name: "James Taylor",
      text: "I have been using Some ED Medicine and I am incredibly impressed with the results! I feel a difference in libido and stamina right away. I have used this medicine and improve my Sexual Activity, Today I will so happy.",
      source: "Verified Customer"
    },
    {
      name: "Sean Williams",
      text: "Thanks a lot, Arrowmeds! I got my package and I already managed to test it! Sex lasts for 1 hour and my tool feels “turbocharged” and ready for more. That's so much more than I expected and it feels great!",
      source: "Verified Customer"
    },
    {
      name: "Jackson Mercer",
      text: "I really didn't expect such a great post from you! I am 53 years old and have been using these pills for about a year already and couldn't be any happier. Sex lasts much longer.",
      source: "Verified Customer"
    },
    {
      name: "Michael Chen",
      text: "Exceptional service and discrete shipping. The results were noticeable within the first few days. Highly recommend for anyone looking for reliable support and a massive boost in confidence.",
      source: "Verified Customer"
    },
    {
      name: "Jack Martin",
      text: "I really didn't expect such a great post from you! I am 53 years old and have been using these pills for about a year already and couldn't be any happier. Sex lasts much longer.",
      source: "Verified Customer"
    },
    {
      name: "Michael jordan",
      text: "Exceptional service and discrete shipping. The results were noticeable within the first few days. Highly recommend for anyone looking for reliable support and a massive boost in confidence.",
      source: "Verified Customer"
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className={containerClass}>

        {/* --- Section Header --- */}
        <header className="mb-12 text-center">
          <h2 style={{ color: primaryColor }} className="text-4xl font-extrabold mb-4">
            Customer Testimonials
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            See what our valued customers are saying about their experience and results.
          </p>
        </header>

        {/* --- Testimonial Cards Grid --- */}
        {/* Responsive grid: 1 column on small, 2 on medium, 3 on large screens */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="bg-gray-50 p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col h-full"
            >
              
              {/* Quote Icon */}
              <FaQuoteLeft 
                className="text-4xl mb-4" 
                style={{ color: primaryColor }} 
              />

              {/* Testimonial Text */}
              <p className="text-lg italic text-gray-700 leading-relaxed flex-grow">
                "{testimonial.text}"
              </p>

              {/* Separator */}
              <hr className="my-5 border-gray-200" />
              
              {/* Customer Info */}
              <div>
                <p className="text-xl font-bold text-gray-900 mb-1">
                  {testimonial.name}
                </p>
                <p className="text-sm font-medium text-green-600">
                  {testimonial.source}
                </p>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default TestimonialsSection;