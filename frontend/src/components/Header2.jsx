import { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { ShopContext } from "../context/ShopContext";
import { GoDotFill } from "react-icons/go";
import LoadingSpinner from "./LoadingSpinner";

const Header = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const { products, currency } = useContext(ShopContext);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [openMobileSubMenu, setOpenMobileSubMenu] = useState("");

  const [categories, setCategories] = useState([]);

  const [hoverCartItems, setHoverCartItems] = useState([]);
  const [showCartPreview, setShowCartPreview] = useState(false);

  const dropdownRef = useRef(null);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsMobileCartOpen(false);
  };

  const toggleMobileCart = () => {
    setIsMobileCartOpen(!isMobileCartOpen);
    setIsMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setOpenMobileSubMenu("");
  };

  const closeMobileCart = () => {
    setIsMobileCartOpen(false);
  };

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_APP_API_URL}/api/category/all`
      );
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Get cart items with full product details from local context
  const getCartItemsWithDetails = () => {
    if (
      !cartItems ||
      cartItems.length === 0 ||
      !products ||
      products.length === 0
    ) {
      return [];
    }

    const itemsWithDetails = cartItems
      .map((cartItem) => {
        const product = products.find((p) => p._id === cartItem.product_id);

        if (!product) {
          return null;
        }

        // Find the specific pricing for this net_quantity
        const pricing = product.pricing.find(
          (p) => p.net_quantity === cartItem.net_quantity
        );

        return {
          id: product._id,
          name: product.name,
          generic_name: product.generic_name,
          image: product.product_images[0],
          manufacturer: product.manufacturer,
          dosage_form: product.dosage_form,
          net_quantity: cartItem.net_quantity,
          quantity: cartItem.quantity,
          price: pricing ? pricing.total_price : cartItem.price,
          unit_price: pricing ? pricing.unit_price : 0,
        };
      })
      .filter((item) => item !== null);

    return itemsWithDetails;
  };

  // const fetchHoverCartItems = async () => {
  //   try {
  //     const token = localStorage.getItem("token");
  //     const response = await axios.get(
  //       `${import.meta.env.VITE_APP_API_URL}/api/cart/get-cart-items`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );
  //     if (response.data.success) {
  //       setHoverCartItems(response.data.cartItems.slice(0, 3));
  //     }
  //   } catch (error) {
  //     console.error("Failed to fetch cart preview:", error);
  //   }
  // };

  const fetchHoverCartItems = () => {
    // For non-logged-in users or as primary source
    const localCartItems = getCartItemsWithDetails();
    setHoverCartItems(localCartItems.slice(0, 3));
  };

  // const fetchMobileCartItems = async () => {
  //   try {
  //     const token = localStorage.getItem("token");
  //     const response = await axios.get(
  //       `${import.meta.env.VITE_APP_API_URL}/api/cart/get-cart-items`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );
  //     if (response.data.success) {
  //       setHoverCartItems(response.data.cartItems);
  //     }
  //   } catch (error) {
  //     console.error("Failed to fetch cart items:", error);
  //   }
  // };

  const fetchMobileCartItems = () => {
    // For mobile cart, show all items
    const localCartItems = getCartItemsWithDetails();
    setHoverCartItems(localCartItems);
  };

  useEffect(() => {
    fetchCategories();
    const handleResize = () => {
      if (window.innerWidth > 991) {
        setIsMobileMenuOpen(false);
        setIsMobileCartOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    closeMobileMenu();
    closeMobileCart();
  }, [location]);

  useEffect(() => {
    if (isMobileCartOpen) {
      fetchMobileCartItems();
    }
  }, [isMobileCartOpen, cartItems, products]);

  // Update hover cart items when cartItems or products change
  useEffect(() => {
    if (showCartPreview) {
      fetchHoverCartItems();
    }
  }, [cartItems, products]);

  let totalCartItems = 0;
  if (cartItems && cartItems.length > 0) {
    totalCartItems = cartItems.length;
  }

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query) {
      const filteredSuggestions = products
        .filter(
          (product) =>
            product.name.toLowerCase().includes(query.toLowerCase().trim()) ||
            product.generic_name
              .toLowerCase()
              .includes(query.toLowerCase().trim()) ||
            product.manufacturer
              .toLowerCase()
              .includes(query.toLowerCase().trim()) ||
            product.product_code
              .toLowerCase()
              .includes(query.toLowerCase().trim())
        )
        .map((product) => ({
          id: product._id,
          name: product.name,
          generic_name: product.generic_name,
          image: product.product_images[0],
          manufacturer: product.manufacturer,
          dosage_form: product.dosage_form,
          price: product.pricing[0]?.unit_price || "N/A",
          alias: product.alias,
        }));

      setSuggestions(filteredSuggestions);
      setShowSuggestions(true);
    } else {
      const allProductNames = [
        ...new Set(
          products.map((product) => ({
            id: product._id,
            name: product.name,
            generic_name: product.generic_name,
            image: product.product_images[0],
            manufacturer: product.manufacturer,
            dosage_form: product.dosage_form,
            price: product.pricing[0]?.unit_price || "N/A",
            alias: product.alias,
          }))
        ),
      ];
      const sortedSuggestions = allProductNames.sort(
        (a, b) => new Date(b.name) - new Date(a.name)
      );
      setSuggestions(sortedSuggestions);
      setShowSuggestions(true);
    }
  };

  const handleSearchClick = () => {
    const allProductNames = [
      ...new Set(
        products.map((product) => ({
          id: product._id,
          name: product.name,
          generic_name: product.generic_name,
          image: product.product_images[0],
          manufacturer: product.manufacturer,
          dosage_form: product.dosage_form,
          price: product.pricing[0]?.unit_price || "N/A",
          alias: product.alias,
        }))
      ),
    ];
    const sortedSuggestions = allProductNames.sort(
      (a, b) => new Date(b.name) - new Date(a.name)
    );
    setSuggestions(sortedSuggestions);
    setShowSuggestions(true);
  };

  const handleSearchSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.name);
    setShowSuggestions(false);
    window.location.href = `/product/${suggestion.alias}`;
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const handleGenericSuggestionClick = (suggestion) => {
    window.location.href = `/search?generic=${encodeURIComponent(
      suggestion.generic_name
    )}`;
  };

  const handleCategoryClick = (category) => {
    window.location.href = `/search?category=${category}`;
  };

  const handleSubCategoryClick = (category, subcategory) => {
    window.location.href = `/search?category=${category}&subcategory=${subcategory}`;
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMobileSubMenu = (category) => {
    setOpenMobileSubMenu((prevId) => (prevId === category ? "" : category));
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <header className="bb-header relative z-[5] border-b-[1px] border-solid border-[#eee]">
      <div className="bottom-header py-[20px] max-[991px]:py-[15px]">
        <div className="flex flex-wrap justify-between relative items-center mx-auto min-[1400px]:max-w-[1320px] min-[1200px]:max-w-[1140px] min-[992px]:max-w-[960px] min-[768px]:max-w-[720px] min-[576px]:max-w-[540px]">
          <div className="flex flex-wrap w-full">
            <div className="w-full px-[12px]">
              <div className="inner-bottom-header flex justify-between max-lg:flex-col">
                <div className="cols bb-logo-detail flex max-lg:justify-between">
                  <div className="header-logo flex items-center max-[575px]:justify-center">
                    <Link to={"/"}>
                      <img
                        src="../assets/img/logo/logo.png"
                        alt="logo"
                        className="light w-[175px] max-[991px]:w-[125px] block"
                      />
                    </Link>
                  </div>
                  <div className="cols bb-icons justify-center lg:hidden flex">
                    <div className="bb-flex-justify max-[575px]:flex max-[575px]:justify-between">
                      <div className="bb-header-buttons h-full flex justify-end items-center">
                        <div className="bb-acc-drop relative">
                          <Link
                            to={`${user ? "/profile" : "/login"}`}
                            className="bb-header-btn bb-header-user dropdown-toggle bb-user-toggle transition-all duration-[0.3s] ease-in-out relative flex w-[auto] items-center whitespace-nowrap ml-[30px] max-[1199px]:ml-[20px] max-[767px]:ml-[0]"
                            title="Account"
                          >
                            <div className="header-icon relative flex">
                              <svg
                                className="svg-icon w-[30px] h-[30px] max-[1199px]:w-[25px] max-[1199px]:h-[25px] max-[991px]:w-[22px] max-[991px]:h-[22px]"
                                viewBox="0 0 1024 1024"
                                version="1.1"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  className="fill-[#0097b2]"
                                  d="M512.476 648.247c-170.169 0-308.118-136.411-308.118-304.681 0-168.271 137.949-304.681 308.118-304.681 170.169 0 308.119 136.411 308.119 304.681C820.594 511.837 682.645 648.247 512.476 648.247L512.476 648.247zM512.476 100.186c-135.713 0-246.12 109.178-246.12 243.381 0 134.202 110.407 243.381 246.12 243.381 135.719 0 246.126-109.179 246.126-243.381C758.602 209.364 648.195 100.186 512.476 100.186L512.476 100.186zM935.867 985.115l-26.164 0c-9.648 0-17.779-6.941-19.384-16.35-2.646-15.426-6.277-30.52-11.142-44.95-24.769-87.686-81.337-164.13-159.104-214.266-63.232 35.203-134.235 53.64-207.597 53.64-73.555 0-144.73-18.537-208.084-53.922-78 50.131-134.75 126.68-159.564 214.549 0 0-4.893 18.172-11.795 46.4-2.136 8.723-10.035 14.9-19.112 14.9L88.133 985.116c-9.415 0-16.693-8.214-15.47-17.452C91.698 824.084 181.099 702.474 305.51 637.615c58.682 40.472 129.996 64.267 206.966 64.267 76.799 0 147.968-23.684 206.584-63.991 124.123 64.932 213.281 186.403 232.277 329.772C952.56 976.901 945.287 985.115 935.867 985.115L935.867 985.115z"
                                />
                              </svg>
                            </div>
                          </Link>
                        </div>

                        <button
                          onClick={toggleMobileCart}
                          className="bb-header-btn transition-all duration-[0.3s] ease-in-out relative flex w-[auto] items-center ml-[30px] max-[1199px]:ml-[20px]"
                          title="Cart"
                        >
                          <div className="header-icon relative flex">
                            <svg
                              className="svg-icon w-[30px] h-[30px] max-[1199px]:w-[25px] max-[1199px]:h-[25px] max-[991px]:w-[22px] max-[991px]:h-[22px]"
                              viewBox="0 0 1024 1024"
                              version="1.1"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                className="fill-[#0097b2]"
                                d="M351.552 831.424c-35.328 0-63.968 28.64-63.968 63.968 0 35.328 28.64 63.968 63.968 63.968 35.328 0 63.968-28.64 63.968-63.968C415.52 860.064 386.88 831.424 351.552 831.424L351.552 831.424 351.552 831.424zM799.296 831.424c-35.328 0-63.968 28.64-63.968 63.968 0 35.328 28.64 63.968 63.968 63.968 35.328 0 63.968-28.64 63.968-63.968C863.264 860.064 834.624 831.424 799.296 831.424L799.296 831.424 799.296 831.424zM862.752 799.456 343.264 799.456c-46.08 0-86.592-36.448-92.224-83.008L196.8 334.592 165.92 156.128c-1.92-15.584-16.128-28.288-29.984-28.288L95.2 127.84c-17.664 0-32-14.336-32-31.968 0-17.664 14.336-32 32-32l40.736 0c46.656 0 87.616 36.448 93.28 83.008l30.784 177.792 54.464 383.488c1.792 14.848 15.232 27.36 28.768 27.36l519.488 0c17.696 0 32 14.304 32 31.968S880.416 799.456 862.752 799.456L862.752 799.456zM383.232 671.52c-16.608 0-30.624-12.8-31.872-29.632-1.312-17.632 11.936-32.928 29.504-34.208l433.856-31.968c15.936-0.096 29.344-12.608 31.104-26.816l50.368-288.224c1.28-10.752-1.696-22.528-8.128-29.792-4.128-4.672-9.312-7.04-15.36-7.04L319.04 223.84c-17.664 0-32-14.336-32-31.968 0-17.664 14.336-31.968 32-31.968l553.728 0c24.448 0 46.88 10.144 63.232 28.608 18.688 21.088 27.264 50.784 23.52 81.568l-50.4 288.256c-5.44 44.832-45.92 81.28-92 81.28L385.6 671.424C384.8 671.488 384 671.52 383.232 671.52L383.232 671.52zM383.232 671.52"
                              />
                            </svg>
                            {totalCartItems > 0 && (
                              <span className="absolute -top-[8px] -right-[8px] bg-[#ff0000] text-white text-[10px] font-bold rounded-full w-[18px] h-[18px] flex items-center justify-center">
                                {totalCartItems}
                              </span>
                            )}
                          </div>
                        </button>

                        <button
                          onClick={toggleMobileMenu}
                          className="bb-toggle-menu hidden max-[991px]:flex max-[991px]:ml-[20px]"
                        >
                          <div className="header-icon">
                            <i className="ri-menu-3-fill text-[22px] text-[#0097b2]" />
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="cols flex justify-center items-center">
                  <div className="header-search flex flex-wrap justify-between align-middle w-[600px] max-[1399px]:w-[500px] max-[1199px]:w-[400px] max-[991px]:w-full max-[991px]:min-w-[300px] max-[767px]:py-[15px] max-[480px]:min-w-[auto]">
                    <div
                      className="w-full mt-[5px] relative px-2"
                      ref={dropdownRef}
                    >
                      <form
                        className="w-full bb-btn-group-form flex relative"
                        onSubmit={handleSearchSubmit}
                      >
                        <input
                          type="text"
                          className="form-control bb-search-bar bg-[#fff] block w-full min-h-[45px] h-[48px] py-[10px] px-[15px] text-[14px] font-normal text-[#777] rounded-[10px] border-[1px] border-solid border-[#eee]"
                          placeholder="Search products..."
                          value={searchQuery}
                          onChange={handleSearchChange}
                          onClick={handleSearchClick}
                        />
                        <button
                          className="submit absolute top-[0] right-[0] flex items-center justify-center w-[45px] h-full bg-transparent text-[#555] text-[16px]"
                          type="submit"
                        >
                          <i className="ri-search-line text-[18px] text-[#555]" />
                        </button>
                      </form>

                      {showSuggestions && (
                        <ul className="absolute top-[100%] p-2 left-0 w-full min-w-[350px] max-h-[500px] overflow-scroll no-scrollbar bg-white border border-gray-300 shadow-lg rounded-md z-10">
                          {[
                            ...new Map(
                              suggestions.map((item) => [
                                item.generic_name,
                                item,
                              ])
                            ).values(),
                          ]
                            .slice(0, 8)
                            .map((suggestion, index) => (
                              <li
                                key={index}
                                className="p-2 cursor-pointer hover:bg-gray-100"
                                onClick={() =>
                                  handleGenericSuggestionClick(suggestion)
                                }
                              >
                                {suggestion.generic_name}
                              </li>
                            ))}
                          {suggestions.slice(0, 8).map((suggestion, index) => (
                            <li
                              key={index}
                              className="flex items-center p-2 cursor-pointer hover:bg-gray-100"
                              onClick={() =>
                                handleSearchSuggestionClick(suggestion)
                              }
                            >
                              <img
                                src={suggestion.image}
                                alt={suggestion.name}
                                className="w-12 h-12 rounded-md object-cover mr-3"
                              />
                              <div>
                                <p className="text-sm font-semibold">
                                  {suggestion.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  Mfg. by {suggestion.manufacturer}
                                </p>
                                <p className="text-xs font-semibold text-gray-600">
                                  {currency +
                                    " " +
                                    suggestion.price +
                                    " per " +
                                    suggestion.dosage_form}
                                </p>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>

                <div className="cols bb-icons justify-center lg:flex hidden">
                  <div className="bb-flex-justify max-[575px]:flex max-[575px]:justify-between">
                    <div className="bb-header-buttons h-full flex justify-end items-center">
                      <div className="bb-acc-drop relative">
                        <Link
                          to={`${user ? "/profile" : "/login"}`}
                          className="bb-header-btn bb-header-user dropdown-toggle bb-user-toggle transition-all duration-[0.3s] ease-in-out relative flex w-[auto] items-center whitespace-nowrap ml-[30px] max-[1199px]:ml-[20px] max-[767px]:ml-[0]"
                          title="Account"
                        >
                          <div className="header-icon relative flex">
                            <svg
                              className="svg-icon w-[30px] h-[30px] max-lg:w-[25px] max-lg:h-[25px] max-[991px]:w-[22px] max-[991px]:h-[22px]"
                              viewBox="0 0 1024 1024"
                              version="1.1"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                className="fill-[#0097b2]"
                                d="M512.476 648.247c-170.169 0-308.118-136.411-308.118-304.681 0-168.271 137.949-304.681 308.118-304.681 170.169 0 308.119 136.411 308.119 304.681C820.594 511.837 682.645 648.247 512.476 648.247L512.476 648.247zM512.476 100.186c-135.713 0-246.12 109.178-246.12 243.381 0 134.202 110.407 243.381 246.12 243.381 135.719 0 246.126-109.179 246.126-243.381C758.602 209.364 648.195 100.186 512.476 100.186L512.476 100.186zM935.867 985.115l-26.164 0c-9.648 0-17.779-6.941-19.384-16.35-2.646-15.426-6.277-30.52-11.142-44.95-24.769-87.686-81.337-164.13-159.104-214.266-63.232 35.203-134.235 53.64-207.597 53.64-73.555 0-144.73-18.537-208.084-53.922-78 50.131-134.75 126.68-159.564 214.549 0 0-4.893 18.172-11.795 46.4-2.136 8.723-10.035 14.9-19.112 14.9L88.133 985.116c-9.415 0-16.693-8.214-15.47-17.452C91.698 824.084 181.099 702.474 305.51 637.615c58.682 40.472 129.996 64.267 206.966 64.267 76.799 0 147.968-23.684 206.584-63.991 124.123 64.932 213.281 186.403 232.277 329.772C952.56 976.901 945.287 985.115 935.867 985.115L935.867 985.115z"
                              />
                            </svg>
                          </div>
                          <div className="bb-btn-desc flex flex-col ml-[10px] max-lg:hidden">
                            <span className="bb-btn-title font-Poppins transition-all duration-[0.3s] ease-in-out text-[12px] leading-[1] text-[#3d4750] mb-[4px] tracking-[0.6px] capitalize font-medium whitespace-nowrap">
                              Account
                            </span>
                            <span className="bb-btn-stitle font-Poppins transition-all duration-[0.3s] ease-in-out text-[14px] leading-[16px] font-semibold text-[#3d4750]  tracking-[0.03rem] whitespace-nowrap">
                              {user ? "Profile" : "Login"}
                            </span>
                          </div>
                        </Link>
                      </div>

                      <Link
                        to="/cart"
                        onMouseEnter={() => {
                          setShowCartPreview(true);
                          fetchHoverCartItems();
                        }}
                        onMouseLeave={() => setShowCartPreview(false)}
                        className="relative bb-header-btn bb-cart-toggle transition-all duration-[0.3s] ease-in-out flex w-[auto] items-center ml-[30px] max-lg:ml-[20px]"
                        title="Cart"
                      >
                        <div className="header-icon relative flex">
                          <svg
                            className="svg-icon w-[30px] h-[30px] max-lg:w-[25px] max-lg:h-[25px] max-[991px]:w-[22px] max-[991px]:h-[22px]"
                            viewBox="0 0 1024 1024"
                            version="1.1"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              className="fill-[#0097b2]"
                              d="M351.552 831.424c-35.328 0-63.968 28.64-63.968 63.968 0 35.328 28.64 63.968 63.968 63.968 35.328 0 63.968-28.64 63.968-63.968C415.52 860.064 386.88 831.424 351.552 831.424L351.552 831.424 351.552 831.424zM799.296 831.424c-35.328 0-63.968 28.64-63.968 63.968 0 35.328 28.64 63.968 63.968 63.968 35.328 0 63.968-28.64 63.968-63.968C863.264 860.064 834.624 831.424 799.296 831.424L799.296 831.424 799.296 831.424zM862.752 799.456 343.264 799.456c-46.08 0-86.592-36.448-92.224-83.008L196.8 334.592 165.92 156.128c-1.92-15.584-16.128-28.288-29.984-28.288L95.2 127.84c-17.664 0-32-14.336-32-31.968 0-17.664 14.336-32 32-32l40.736 0c46.656 0 87.616 36.448 93.28 83.008l30.784 177.792 54.464 383.488c1.792 14.848 15.232 27.36 28.768 27.36l519.488 0c17.696 0 32 14.304 32 31.968S880.416 799.456 862.752 799.456L862.752 799.456zM383.232 671.52c-16.608 0-30.624-12.8-31.872-29.632-1.312-17.632 11.936-32.928 29.504-34.208l433.856-31.968c15.936-0.096 29.344-12.608 31.104-26.816l50.368-288.224c1.28-10.752-1.696-22.528-8.128-29.792-4.128-4.672-9.312-7.04-15.36-7.04L319.04 223.84c-17.664 0-32-14.336-32-31.968 0-17.664 14.336-31.968 32-31.968l553.728 0c24.448 0 46.88 10.144 63.232 28.608 18.688 21.088 27.264 50.784 23.52 81.568l-50.4 288.256c-5.44 44.832-45.92 81.28-92 81.28L385.6 671.424C384.8 671.488 384 671.52 383.232 671.52L383.232 671.52zM383.232 671.52"
                            />
                          </svg>
                          <span className="main-label-note-new" />
                        </div>
                        <div className="bb-btn-desc flex flex-col ml-[10px] max-lg:hidden">
                          <span className="bb-btn-title font-Poppins transition-all duration-[0.3s] ease-in-out text-[12px] leading-[1] text-[#3d4750] mb-[4px] tracking-[0.6px] capitalize font-medium whitespace-nowrap">
                            <b className="bb-cart-count">{totalCartItems}</b>{" "}
                            items
                          </span>
                          <span className="bb-btn-stitle font-Poppins transition-all duration-[0.3s] ease-in-out text-[14px] leading-[16px] font-semibold text-[#3d4750]  tracking-[0.03rem] whitespace-nowrap">
                            Cart
                          </span>
                        </div>

                        {showCartPreview &&
                          (hoverCartItems.length > 0 ? (
                            <div
                              onMouseEnter={() => {
                                setShowCartPreview(true);
                                fetchHoverCartItems();
                              }}
                              onMouseLeave={() => setShowCartPreview(false)}
                              className="absolute top-[110%] right-0 w-[320px] bg-white shadow-lg border border-gray-200 rounded-md z-50 p-4"
                            >
                              <h4 className="text-lg font-semibold mb-2 text-[#0097b2]">
                                Cart Preview
                              </h4>
                              {hoverCartItems.map((item) => (
                                <div
                                  key={item.id + item.net_quantity}
                                  className="flex items-center mb-3"
                                >
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-12 h-12 object-cover rounded mr-3"
                                  />
                                  <div className="flex-grow">
                                    <p className="text-sm font-medium text-gray-800">
                                      {item.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {item.quantity} × {currency} {item.price}
                                    </p>
                                  </div>
                                  <span className="text-sm font-semibold text-gray-700">
                                    {currency}{" "}
                                    {(item.price * item.quantity).toFixed(2)}
                                  </span>
                                </div>
                              ))}
                              <div className="mt-2 text-center">
                                <Link
                                  to="/cart"
                                  className="text-sm text-[#0097b2] hover:underline font-medium"
                                >
                                  View Full Cart
                                </Link>
                              </div>
                            </div>
                          ) : (
                            <div className="absolute top-[110%] right-0 w-[320px] bg-white shadow-lg border border-gray-200 rounded-md z-50 p-4">
                              <p className="text-sm text-gray-700 text-center">
                                Your cart is empty
                              </p>
                            </div>
                          ))}
                      </Link>

                      <button
                        onClick={toggleMobileMenu}
                        className="bb-toggle-menu hidden max-[991px]:flex max-[991px]:ml-[20px]"
                      >
                        <div className="header-icon">
                          <i className="ri-menu-3-fill text-[22px] text-[#0097b2]" />
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bb-main-menu-desk bg-[#fff] py-[5px] border-t-[1px] border-solid border-[#eee] max-[991px]:hidden">
        <div className="flex flex-wrap justify-between relative items-center mx-auto min-[1400px]:max-w-[1320px] min-[1200px]:max-w-[1140px] min-[992px]:max-w-[960px] min-[768px]:max-w-[720px] min-[576px]:max-w-[540px]">
          <div className="flex flex-wrap w-full">
            <div className="w-full px-[24px]">
              <div className="bb-inner-menu-desk flex max-[1199px]:relative max-[991px]:justify-between">
                <div
                  className="bb-main-menu relative flex flex-[auto] justify-start max-[991px]:hidden"
                  id="navbarSupportedContent"
                >
                  <ul className="navbar-nav flex flex-wrap flex-row ">
                    <li className="nav-item ">
                      <Link
                        to="/all-categories"
                        className="flex items-center mr-[25px] text-[#fff] hover:text-[#0097b2] bg-[#0097b2] hover:bg-[#fff] hover:border-[1px] border-solid border-[#0097b2] rounded-[10px]  py-3 px-4"
                      >
                        <p className=" font-Poppins relative p-[0] leading-[28px] text-[15px] font-medium  block tracking-[0.03rem]">
                          All Categories
                        </p>
                      </Link>
                    </li>
                    <li className="nav-item flex items-center font-Poppins text-[15px] text-[#686e7d] font-light leading-[28px] tracking-[0.03rem] mr-[35px]">
                      <Link
                        to="/"
                        className="nav-link p-[0] font-Poppins leading-[28px] text-[15px] font-medium text-[#3d4750] tracking-[0.03rem] block"
                      >
                        Home
                      </Link>
                    </li>
                    {categories.map(
                      (category) =>
                        category.navbar_active && (
                          <li
                            key={category._id}
                            className="nav-item bb-main-dropdown flex items-center mr-[45px]"
                          >
                            <button
                              onClick={() =>
                                handleCategoryClick(category.category)
                              }
                              className="nav-link bb-dropdown-item font-Poppins relative p-[0] leading-[28px] text-[15px] font-medium text-[#3d4750] block tracking-[0.03rem]"
                            >
                              {category.category}
                            </button>
                            <ul className="mega-menu min-w-3/4 transition-all duration-[0.3s] ease-in-out mt-[25px] pl-[30px] absolute top-[40px] z-[16] text-left opacity-[0] invisible left-[auto] right-[auto] bg-[#fff] border-[1px] border-solid border-[#eee] flex flex-col rounded-[10px]">
                              <li className="m-[0] flex items-center w-full">
                                <ul className="mega-block mr-[30px] py-[15px] w-full">
                                  {category.subcategory.map((subCategory) => (
                                    <li
                                      className="flex items-center leading-[28px]"
                                      key={subCategory}
                                    >
                                      <button
                                        onClick={() =>
                                          handleSubCategoryClick(
                                            category.category,
                                            subCategory
                                          )
                                        }
                                        className="transition-all duration-[0.3s] ease-in-out font-Poppins py-[10px] leading-[22px] text-[14px] font-normal tracking-[0.03rem] text-[#686e7d] hover:text-[#0097b2] capitalize"
                                      >
                                        {subCategory}
                                      </button>
                                    </li>
                                  ))}
                                  {category.special_subcategory.map(
                                    (subCategory) => (
                                      <li
                                        className="flex items-center leading-[28px]"
                                        key={subCategory}
                                      >
                                        <button
                                          onClick={() =>
                                            handleSubCategoryClick(
                                              category.category,
                                              subCategory
                                            )
                                          }
                                          className="transition-all duration-[0.3s] ease-in-out font-Poppins py-[10px] leading-[22px] text-[14px] font-normal tracking-[0.03rem] text-[#686e7d] hover:text-[#0097b2] capitalize flex items-center"
                                        >
                                          <GoDotFill className="float-left text-[15px] mr-[3px] leading-[18px] text-[#0097b2]" />
                                          {subCategory}
                                        </button>
                                      </li>
                                    )
                                  )}
                                </ul>
                              </li>
                            </ul>
                          </li>
                        )
                    )}
                    <li className="nav-item flex items-center">
                      <Link
                        to="/offers"
                        className="nav-link font-Poppins  p-[0] leading-[28px] text-[15px] font-medium tracking-[0.03rem] text-[#3d4750] flex"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          version="1.1"
                          x={0}
                          y={0}
                          viewBox="0 0 64 64"
                          style={{ enableBackground: "new 0 0 512 512" }}
                          xmlSpace="preserve"
                          className="w-[20px] h-[25px] mr-[5px] leading-[18px] align-middle"
                        >
                          <g>
                            <path
                              d="M10 16v22c0 .3.1.6.2.8.3.6 6.5 13.8 21 20h.2c.2 0 .3.1.5.1s.3 0 .5-.1h.2c14.5-6.2 20.8-19.4 21-20 .1-.3.2-.5.2-.8V16c0-.9-.6-1.7-1.5-1.9-7.6-1.9-19.3-9.6-19.4-9.7-.1-.1-.2-.1-.4-.2-.1 0-.1 0-.2-.1h-.9c-.1 0-.2.1-.3.1-.1.1-.2.1-.4.2s-11.8 7.8-19.4 9.7c-.7.2-1.3 1-1.3 1.9zm4 1.5c6.7-2.1 15-7.2 18-9.1 3 1.9 11.3 7 18 9.1v20c-1.1 2.1-6.7 12.1-18 17.3-11.3-5.2-16.9-15.2-18-17.3z"
                              fill="#000000"
                              opacity={1}
                              data-original="#000000"
                              className="fill-[#0097b2]"
                            />
                            <path
                              d="M28.6 38.4c.4.4.9.6 1.4.6s1-.2 1.4-.6l9.9-9.9c.8-.8.8-2 0-2.8s-2-.8-2.8 0L30 34.2l-4.5-4.5c-.8-.8-2-.8-2.8 0s-.8 2 0 2.8z"
                              fill="#000000"
                              opacity={1}
                              data-original="#000000"
                              className="fill-[#0097b2]"
                            />
                          </g>
                        </svg>
                        Offers
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`bb-mobile-menu-overlay ${
          isMobileMenuOpen || isMobileCartOpen ? "block" : "hidden"
        } w-full h-screen fixed top-[0] left-[0] bg-[#000000cc] z-[16]`}
        onClick={() => {
          closeMobileMenu();
          closeMobileCart();
        }}
      />

      <div
        id="bb-mobile-menu"
        className={`bb-mobile-menu transition-all duration-[0.3s] ease-in-out w-[340px] h-full pt-[15px] px-[20px] pb-[20px] fixed top-[0] right-[auto] left-[0] bg-[#fff] z-[170] overflow-auto max-[480px]:w-[300px] ${
          isMobileMenuOpen ? "translate-x-[0]" : "translate-x-[-100%]"
        }`}
      >
        <div className="bb-menu-title w-full pb-[10px] flex flex-wrap justify-between">
          <span className="menu_title font-Poppins flex items-center text-[16px] text-[#3d4750] font-semibold leading-[26px] tracking-[0.02rem]">
            My Menu
          </span>
          <button
            type="button"
            onClick={closeMobileMenu}
            className="bb-close-menu relative border-[0] text-[30px] leading-[1] text-[#ff0000] bg-transparent"
          >
            ×
          </button>
        </div>
        <div className="bb-menu-inner">
          <div className="bb-menu-content">
            <ul>
              <li className="relative">
                <Link
                  to="/"
                  onClick={closeMobileMenu}
                  className="transition-all duration-[0.3s] ease-in-out mb-[12px] p-[12px] block font-Poppins capitalize text-[#686e7d] border-[1px] border-solid border-[#eee] rounded-[10px] text-[15px] font-medium leading-[28px] tracking-[0.03rem]"
                >
                  Home
                </Link>
              </li>
              <li className="relative">
                <Link
                  to="/all-categories"
                  onClick={closeMobileMenu}
                  className="transition-all duration-[0.3s] ease-in-out mb-[12px] p-[12px] block font-Poppins capitalize text-[#686e7d] border-[1px] border-solid border-[#eee] rounded-[10px] text-[15px] font-medium leading-[28px] tracking-[0.03rem]"
                >
                  All Categories
                </Link>
              </li>
              {categories.map(
                (category) =>
                  category.navbar_active && (
                    <li
                      key={category._id}
                      className="relative border-[1px] border-solid border-[#eee] rounded-[10px] transition-all duration-[0.3s] ease-in-out mb-[12px] p-[12px] font-Poppins capitalize text-[#686e7d] text-[15px] font-medium leading-[28px] tracking-[0.03rem]"
                    >
                      <div className="flex justify-between items-center ">
                        <button
                          onClick={() => {
                            closeMobileMenu();
                            handleCategoryClick(category.category);
                          }}
                          className=" w-[80%] text-start"
                        >
                          {category.category}
                        </button>
                        {openMobileSubMenu === category.category ? (
                          <i
                            className="ri-arrow-down-s-line float-right leading-[28px]w-[15%]"
                            onClick={() => toggleMobileSubMenu("")}
                          ></i>
                        ) : (
                          <i
                            className="ri-arrow-right-s-line float-right leading-[28px]w-[15%]"
                            onClick={() =>
                              toggleMobileSubMenu(category.category)
                            }
                          ></i>
                        )}
                      </div>
                      {openMobileSubMenu === category.category && (
                        <>
                          <ul className="sub-menu w-full min-w-[auto] p-[0] mb-[10px] static visible opacity-[1]">
                            <li className="relative">
                              <ul className="sub-menu w-full min-w-[auto] p-[0]  static visible opacity-[1]">
                                {category.subcategory.map((subCategory) => (
                                  <li
                                    key={subCategory}
                                    className="relative border-b border-[#eee]"
                                  >
                                    <button
                                      onClick={() =>
                                        handleSubCategoryClick(
                                          category.category,
                                          subCategory
                                        )
                                      }
                                      className="w-full text-start font-Poppins leading-[28px] tracking-[0.03rem] transition-all duration-[0.3s] ease-in-out font-normal pl-[30px] text-[14px] text-[#777] mb-[0] capitalize block py-[6px]"
                                    >
                                      {subCategory}
                                    </button>
                                  </li>
                                ))}
                                {category.special_subcategory.map(
                                  (subCategory) => (
                                    <li
                                      key={subCategory}
                                      className="relative border-b border-[#eee]"
                                    >
                                      <button
                                        onClick={() =>
                                          handleSubCategoryClick(
                                            category.category,
                                            subCategory
                                          )
                                        }
                                        className="w-full flex items-center justify-start text-start gap-[5px] font-Poppins leading-[28px] tracking-[0.03rem] transition-all duration-[0.3s] ease-in-out font-normal pl-[30px] text-[14px] text-[#777] mb-[0] capitalize py-[6px]"
                                      >
                                        <GoDotFill className="float-left text-[15px] mr-[5px] leading-[18px] text-[#0097b2]" />
                                        {subCategory}
                                      </button>
                                    </li>
                                  )
                                )}
                              </ul>
                            </li>
                          </ul>
                        </>
                      )}
                    </li>
                  )
              )}
              <li className="relative">
                <Link
                  to="/offers"
                  onClick={closeMobileMenu}
                  className="ntransition-all duration-[0.3s] ease-in-out mb-[12px] p-[12px] flex font-Poppins capitalize text-[#686e7d] border-[1px] border-solid border-[#eee] rounded-[10px] text-[15px] font-medium leading-[28px] tracking-[0.03rem]"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    version="1.1"
                    x={0}
                    y={0}
                    viewBox="0 0 64 64"
                    style={{ enableBackground: "new 0 0 512 512" }}
                    xmlSpace="preserve"
                    className="w-[20px] h-[25px] mr-[5px] leading-[18px] align-middle"
                  >
                    <g>
                      <path
                        d="M10 16v22c0 .3.1.6.2.8.3.6 6.5 13.8 21 20h.2c.2 0 .3.1.5.1s.3 0 .5-.1h.2c14.5-6.2 20.8-19.4 21-20 .1-.3.2-.5.2-.8V16c0-.9-.6-1.7-1.5-1.9-7.6-1.9-19.3-9.6-19.4-9.7-.1-.1-.2-.1-.4-.2-.1 0-.1 0-.2-.1h-.9c-.1 0-.2.1-.3.1-.1.1-.2.1-.4.2s-11.8 7.8-19.4 9.7c-.7.2-1.3 1-1.3 1.9zm4 1.5c6.7-2.1 15-7.2 18-9.1 3 1.9 11.3 7 18 9.1v20c-1.1 2.1-6.7 12.1-18 17.3-11.3-5.2-16.9-15.2-18-17.3z"
                        fill="#000000"
                        opacity={1}
                        data-original="#000000"
                        className="fill-[#0097b2]"
                      />
                      <path
                        d="M28.6 38.4c.4.4.9.6 1.4.6s1-.2 1.4-.6l9.9-9.9c.8-.8.8-2 0-2.8s-2-.8-2.8 0L30 34.2l-4.5-4.5c-.8-.8-2-.8-2.8 0s-.8 2 0 2.8z"
                        fill="#000000"
                        opacity={1}
                        data-original="#000000"
                        className="fill-[#0097b2]"
                      />
                    </g>
                  </svg>
                  Offers
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div
        id="bb-mobile-cart"
        className={`bb-mobile-cart transition-all duration-[0.3s] ease-in-out w-[340px] h-full pt-[15px] px-[20px] pb-[20px] fixed top-[0] left-[auto] right-[0] bg-[#fff] z-[170] overflow-auto max-[480px]:w-[300px] ${
          isMobileCartOpen ? "translate-x-[0]" : "translate-x-[100%]"
        }`}
      >
        <div className="bb-cart-title w-full pb-[10px] flex flex-wrap justify-between border-b border-[#eee] mb-[15px]">
          <span className="cart_title font-Poppins flex items-center text-[16px] text-[#3d4750] font-semibold leading-[26px] tracking-[0.02rem]">
            My Cart ({totalCartItems})
          </span>
          <button
            type="button"
            onClick={closeMobileCart}
            className="bb-close-cart relative border-[0] text-[30px] leading-[1] text-[#ff0000] bg-transparent"
          >
            ×
          </button>
        </div>
        <div className="bb-cart-inner">
          {hoverCartItems.length > 0 ? (
            <>
              <div className="bb-cart-content max-h-[calc(100vh-200px)] overflow-y-auto">
                {hoverCartItems.map((item) => (
                  <div
                    key={item.id + item.net_quantity}
                    className="bb-cart-item flex items-start gap-3 mb-4 pb-4 border-b border-[#eee]"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                    />
                    <div className="flex-grow">
                      <p className="text-sm font-semibold text-gray-800 mb-1">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500 mb-1">
                        {item.net_quantity}
                      </p>
                      <div className="flex justify-between items-center">
                        <p className="text-xs text-gray-600">
                          Qty: {item.quantity}
                        </p>
                        <p className="text-sm font-bold text-[#0097b2]">
                          {currency} {(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bb-cart-footer mt-4 pt-4 border-t border-[#eee]">
                <Link
                  to="/cart"
                  onClick={closeMobileCart}
                  className="w-full block text-center bg-[#0097b2] text-white py-3 rounded-lg font-semibold text-[15px] hover:bg-[#008a9e] transition-all duration-300"
                >
                  View Full Cart
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-10">
              <svg
                className="mx-auto w-20 h-20 mb-4 text-gray-300"
                fill="currentColor"
                viewBox="0 0 1024 1024"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M351.552 831.424c-35.328 0-63.968 28.64-63.968 63.968 0 35.328 28.64 63.968 63.968 63.968 35.328 0 63.968-28.64 63.968-63.968C415.52 860.064 386.88 831.424 351.552 831.424L351.552 831.424 351.552 831.424zM799.296 831.424c-35.328 0-63.968 28.64-63.968 63.968 0 35.328 28.64 63.968 63.968 63.968 35.328 0 63.968-28.64 63.968-63.968C863.264 860.064 834.624 831.424 799.296 831.424L799.296 831.424 799.296 831.424zM862.752 799.456 343.264 799.456c-46.08 0-86.592-36.448-92.224-83.008L196.8 334.592 165.92 156.128c-1.92-15.584-16.128-28.288-29.984-28.288L95.2 127.84c-17.664 0-32-14.336-32-31.968 0-17.664 14.336-32 32-32l40.736 0c46.656 0 87.616 36.448 93.28 83.008l30.784 177.792 54.464 383.488c1.792 14.848 15.232 27.36 28.768 27.36l519.488 0c17.696 0 32 14.304 32 31.968S880.416 799.456 862.752 799.456L862.752 799.456zM383.232 671.52c-16.608 0-30.624-12.8-31.872-29.632-1.312-17.632 11.936-32.928 29.504-34.208l433.856-31.968c15.936-0.096 29.344-12.608 31.104-26.816l50.368-288.224c1.28-10.752-1.696-22.528-8.128-29.792-4.128-4.672-9.312-7.04-15.36-7.04L319.04 223.84c-17.664 0-32-14.336-32-31.968 0-17.664 14.336-31.968 32-31.968l553.728 0c24.448 0 46.88 10.144 63.232 28.608 18.688 21.088 27.264 50.784 23.52 81.568l-50.4 288.256c-5.44 44.832-45.92 81.28-92 81.28L385.6 671.424C384.8 671.488 384 671.52 383.232 671.52L383.232 671.52zM383.232 671.52" />
              </svg>
              <p className="text-sm text-gray-500 mb-4">Your cart is empty</p>
              <Link
                to="/all-categories"
                onClick={closeMobileCart}
                className="inline-block bg-[#0097b2] text-white py-2 px-6 rounded-lg font-semibold text-[14px] hover:bg-[#008a9e] transition-all duration-300"
              >
                Start Shopping
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
