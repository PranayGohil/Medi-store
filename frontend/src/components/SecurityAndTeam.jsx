// src/components/SecurityAndTeam.jsx

import React from "react";

const SecurityAndTeam = () => {
  // Common container class (retaining your responsive container structure)
  const containerClass = "mx-auto min-[1400px]:max-w-[1320px] min-[1200px]:max-w-[1140px] min-[992px]:max-w-[960px] min-[768px]:max-w-[720px] min-[576px]:max-w-[540px] px-[12px]";
  
  // Updated heading class for a stronger, centered look on small screens
  const headingClass = "text-[32px] font-extrabold text-[#0097b2] mb-4 text-center";

  const clinicalTeam = [
    { name: "Dr. Jack Williamson", imageUrl: "https://www.arrowmeds.com/wp-content/uploads/2023/12/Dr.-Jack-Williamson-1.png", title: "Medical Director" },
    { name: "Dr. Jennifer Smith", imageUrl: "https://www.arrowmeds.com/wp-content/uploads/2024/02/DR.-Jennifer-Smith-2.png", title: "Chief Pharmacist" },
    { name: "Dr. Keren Sidham", imageUrl: "https://www.arrowmeds.com/wp-content/uploads/2024/02/Dr.-Keren-Sidham-1.png", title: "Health Consultant" },
    // { name: "Dr. Harris Anderson", imageUrl: "https://www.arrowmeds.com/wp-content/uploads/2024/02/DR.-Harris-Anderson-1.png", title: "Senior Researcher" },
    // Adding a couple more for better grid demonstration
  ];

  const doctorCardClass = "bg-white border border-gray-100 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden text-center p-6";
  const imageWrapperClass = "w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-[#0097b2]/50";
  const nameClass = "text-[18px] font-bold text-gray-800 mb-1 hover:text-[#0097b2] transition-colors";
  const titleClass = "text-sm text-gray-500 font-medium";

  return (
    <section className="py-12">
      <div className={containerClass}>

        {/* --- Section Header --- */}
        <header className="mb-10">
          <h2 className={headingClass}>Meet Our Clinical Team</h2>
          <p className="text-[16px] text-[#686e7d] leading-relaxed max-w-3xl mx-auto text-center">
            Here are the pillars of our organization, our dedicated medical experts who guide our valued customers on various diseases, treatments, and medicines. Explore their research, articles, and reviews on our portal.
          </p>
        </header>

        {/* --- Doctor Cards Grid --- */}
        {/* Responsive grid: 1 column on small, 2 on medium, 3 on large screens */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {clinicalTeam.map((doctor, index) => (
            <a href="#" key={index} className="block group"> 
              <div className={doctorCardClass}>
                
                {/* Doctor Image */}
                <div className={imageWrapperClass}>
                  <img
                    src={doctor.imageUrl}
                    alt={doctor.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    // Removed the inline style for background color as the images should load
                  />
                </div>

                {/* Doctor Name and Title */}
                <h3 className={nameClass}>
                  {doctor.name}
                </h3>
                <p className={titleClass}>
                  {doctor.title}
                </p>

              </div>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
};

export default SecurityAndTeam;