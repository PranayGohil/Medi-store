// LocationContext.jsx
import { createContext, useState } from "react";

export const LocationContext = createContext();

export const LocationContextProvider = ({ children }) => {
  const [locationData, setLocationData] = useState({
    country: "",
    state: "",
    city: "",
    pincode: "",
  });

  const updateLocationData = (data) => {
    setLocationData({ ...locationData, ...data });
  };

  return (
    <LocationContext.Provider value={{ locationData, updateLocationData }}>
      {children}
    </LocationContext.Provider>
  );
};