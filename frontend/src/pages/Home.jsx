import React from "react";
import Hero from "../components/Hero";
import ExploreCategories from "../components/ExploreCategories";
import BestSeller from "../components/BestSeller";
import Services from "../components/Services";

const Home = () => {
  return (
  <div>
    <Hero />
    <ExploreCategories />
    <BestSeller />
    <Services />
  </div>
  );
};

export default Home;
