import React from "react";
import Hero from "../components/Hero";
import ExploreCategories from "../components/ExploreCategories";
import BestSeller from "../components/BestSeller";
import Services from "../components/Services";
import WhyForeever from "../components/WhyArrowmeds"; // Import the new component
import SecurityAndTeam from "../components/SecurityAndTeam"; // Import the new component
import TestimonialsSection from "../components/TestimonialsSection"; // Import the new component

const Home = () => {
  return (
  <div >
    <Hero />
    {/* <ExploreCategories /> */}
    <BestSeller />
    <WhyForeever/>
    <SecurityAndTeam/>
    <TestimonialsSection/>

    <Services />
  </div>
  );
};

export default Home;
