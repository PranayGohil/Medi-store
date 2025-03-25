import { createContext, useEffect, useState } from "react";
import axios from "axios";
import LoadingSpinner from "../components/LoadingSpinner";
import { toast } from "react-toastify";

export const SitePreferencesContext = createContext();

export const SitePreferencesContextProvider = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [banners, setBanners] = useState([]);
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const fetchSitePreferences = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_APP_API_URL}/api/site`
      );
      if (response.data && response.data[0] && response.data[0].banners) {
        setBanners(response.data[0].banners);
        setDeliveryCharge(response.data[0].delivery_charge);
      }
    } catch (error) {
      toast.error("Failed to fetch settings");
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchSitePreferences();
  }, []);

  const value = {
    banners,
    deliveryCharge,
  };
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  return (
    <SitePreferencesContext.Provider value={value}>
      {props.children}
    </SitePreferencesContext.Provider>
  );
};
