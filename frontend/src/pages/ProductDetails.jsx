import React, { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";
import RelatedProducts from "../components/RelatedProducts";
import axios from "axios";
import LoadingSpinner from "../components/LoadingSpinner";
import PageTitle from "../components/PageTitle";
import ExpandableContent from "../components/ExpandableContent";
import { ShopContext } from "../context/ShopContext";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";

import { Share2 } from "lucide-react";

const ProductDetails = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const alias = id;
  const { currency } = useContext(ShopContext);
  const { user } = useContext(AuthContext);
  const { addItemToCart, cartItems } = useContext(CartContext);
  const [product, setProduct] = useState(null);
  const [activeTab, setActiveTab] = useState("detail");
  const [mainImage, setMainImage] = useState(null);
  const [rating, setrating] = useState(0);
  const [cart, setCart] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [visibleReviews, setVisibleReviews] = useState(5);

  // Create quantity state for each pricing option
  const [quantities, setQuantities] = useState({});

  const fetchCart = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_APP_API_URL}/api/cart/get-cart-items`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Cart Details: " + response.data.cartItems);
      if (response.data.success) {
        setCart(response.data.cartItems);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchReviews = async (product_id) => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${
          import.meta.env.VITE_APP_API_URL
        }/api/product/get-review/${product_id}`
      );

      if (response.data.success) {
        let reviewsData = response.data.reviews;

        const reviewsWithUserInfo = await Promise.all(
          reviewsData.map(async (review) => {
            try {
              const userinfo = await axios.get(
                `${import.meta.env.VITE_APP_API_URL}/api/user/get-user/${
                  review.user_id
                }`
              );

              if (userinfo.data.success) {
                return {
                  ...review,
                  user_name:
                    userinfo.data.user.first_name +
                    " " +
                    userinfo.data.user.last_name,
                  email: userinfo.data.user.email,
                  phone: userinfo.data.user.phone,
                };
              }
            } catch (err) {
              console.error("Error fetching user info:", err);
              return {
                ...review,
                user_name: "Unknown",
                email: "-",
                phone: "-",
              };
            }
          })
        );
        reviewsData = reviewsWithUserInfo.filter(
          (review) => review.status === "approved"
        );
        setReviews(reviewsData);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProduct = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${
          import.meta.env.VITE_APP_API_URL
        }/api/product/single-by-alias/${alias}`
      );
      console.log("Response: " + response.data.product);
      if (response.data.success) {
        fetchReviews(response.data.product._id);
        setProduct(response.data.product);
        if (response.data.product.product_images.length > 0) {
          setMainImage(response.data.product.product_images[0]);
        }
        setrating(response.data.product.rating);

        // Initialize quantities for each pricing option
        const initialQuantities = {};
        response.data.product.pricing.forEach((price) => {
          initialQuantities[price.net_quantity] = 1;
        });
        setQuantities(initialQuantities);
      } else {
        console.error("Failed to fetch product");
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user]);

  useEffect(() => {
    fetchProduct();
  }, [alias]);

  const handleThumbnailClick = (image) => {
    setMainImage(image);
  };

  const displayRating = () => {
    let stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <i
          key={i}
          className={
            i < rating
              ? "ri-star-fill float-left text-[15px] mr-[3px] text-yellow-500"
              : "ri-star-line float-left text-[15px] mr-[3px] text-yellow-500"
          }
        ></i>
      );
    }
    return stars;
  };

  const handleQuantityChange = (netQuantity, change) => {
    setQuantities((prev) => ({
      ...prev,
      [netQuantity]: Math.max(1, prev[netQuantity] + change),
    }));
  };

  const isInCart = (netQuantity) => {
    if (!product) return false;

    // Check in local cart context (for both logged-in and non-logged-in users)
    const inLocalCart = cartItems.some(
      (item) =>
        item.product_id === product._id && item.net_quantity === netQuantity
    );

    // Check in server cart (only for logged-in users)
    const inServerCart = cart.some(
      (item) => item.id === product._id && item.net_quantity === netQuantity
    );

    return inLocalCart || inServerCart;
  };

  const handleAddToCart = async (price) => {
    try {
      setIsLoading(true);

      const cartItem = {
        product_id: product._id,
        net_quantity: price.net_quantity,
        price: price.total_price,
        quantity: quantities[price.net_quantity],
      };

      // Always add to local storage via CartContext
      addItemToCart(cartItem);

      // If user is logged in, also sync with server
      if (user) {
        const response = await axios.post(
          `${import.meta.env.VITE_APP_API_URL}/api/cart/add-to-cart`,
          {
            userId: user._id,
            product_id: product._id,
            net_quantity: price.net_quantity,
            price: price.total_price,
            quantity: quantities[price.net_quantity],
          }
        );

        if (response.data.success) {
          fetchCart();
        } else {
          setError("Failed to sync cart with server.");
          setTimeout(() => setError(null), 3000);
        }
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      setError("An error occurred while adding to cart.");
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleShare = async () => {
    const shareData = {
      title: product.name,
      text: `Check out ${product.name}${
        product.generic_name ? ` (${product.generic_name})` : ""
      } - ${product.manufacturer || "Available now"}`,
      url: window.location.href,
    };

    try {
      // Check if native share API is available (works on mobile and modern browsers)
      if (navigator.share) {
        await navigator.share(shareData);
        console.log("Product shared successfully");
      } else {
        // Fallback: Copy link to clipboard
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      }
    } catch (err) {
      // User cancelled share or error occurred
      if (err.name !== "AbortError") {
        console.error("Error sharing:", err);
        // Fallback: Try to copy to clipboard
        try {
          await navigator.clipboard.writeText(window.location.href);
          alert("Link copied to clipboard!");
        } catch (clipboardErr) {
          console.error("Failed to copy link:", clipboardErr);
        }
      }
    }
  };

  if (!product || isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <PageTitle title={`${product.name}`} />
      <Breadcrumb
        title="Product Details"
        destination1="Home"
        destination2="Product Details"
      />
      <section className="section-product py-[50px] max-[1199px]:py-[35px]">
        <div className="flex flex-wrap justify-between relative items-center mx-auto min-[1400px]:max-w-[1320px] min-[1200px]:max-w-[1140px] min-[992px]:max-w-[960px] min-[768px]:max-w-[720px] min-[576px]:max-w-[540px]">
          <div className="flex flex-wrap w-full">
            <div className="w-full px-[12px]">
              <div className="bb-single-pro mb-[24px]">
                <div className="flex flex-wrap mx-[-12px]">
                  {/* Product Image Section */}
                  <div className="min-[992px]:w-[41.66%] w-full px-[12px] mb-[24px]">
                    <div className="single-pro-slider sticky top-[0] p-[15px] border-[1px] border-solid border-[#858585] rounded-[24px] max-[991px]:max-w-[500px] max-[991px]:m-auto">
                      <div className="single-product-cover">
                        <div className="single-slide zoom-image-hover rounded-tl-[15px] rounded-tr-[15px]">
                          <img
                            className="img-responsive rounded-tl-[15px] rounded-tr-[15px]"
                            src={mainImage}
                            alt={product.name}
                          />
                        </div>
                      </div>
                      <div className="flex mt-4 space-x-2 overflow-x-auto">
                        {product.product_images.map((image, index) => (
                          <img
                            key={index}
                            className="w-20 h-20 min-w-[80px] border-2 border-transparent hover:border-gray-400 rounded-md cursor-pointer object-cover"
                            src={image}
                            alt={`product-${index}`}
                            onClick={() => handleThumbnailClick(image)}
                          />
                        ))}
                      </div>
                      <div className="bb-share-product absolute top-4 right-4">
                        <button
                          onClick={handleShare}
                          className="flex items-center gap-2 px-2 py-2 border-[1px] border-solid border-[#0097b2] text-[#0097b2] rounded-full font-Poppins text-[14px] font-medium hover:bg-[#0097b2] hover:text-white transition-all"
                        >
                          <svg
                            className="w-[18px] h-[18px]"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Product Details Section */}
                  <div className="min-[992px]:w-[58.33%] w-full px-[24px] mb-[24px]">
                    <div className="bb-single-pro-contact">
                      <div className="bb-sub-title mb-[20px]">
                        <h4 className="font-quicksand text-[22px] mt-2 tracking-[0.03rem] font-bold leading-[1.2] text-[#3d4750]">
                          {product.name}
                        </h4>
                        {product.generic_name && (
                          <h3 className="font-quicksand text-[15px] mt-2 tracking-[0.03rem] font-bold leading-[1.2] text-[#39393a]">
                            ({product.generic_name})
                          </h3>
                        )}
                      </div>
                      <div className="bb-single-rating mb-[12px]">
                        <span className="bb-pro-rating mr-[10px]">
                          {displayRating()}
                        </span>
                        <span className="bb-read-review">
                          |&nbsp;&nbsp;
                          <Link
                            to="#bb-spt-nav-review"
                            className="font-Poppins text-[15px] font-light leading-[28px] tracking-[0.03rem]"
                          >
                            {product.reviews.length} Reviews
                          </Link>
                        </span>
                      </div>
                      <div className="font-Poppins text-[15px] font-light leading-[28px] tracking-[0.03rem]">
                        <ul className="my-[-8px] pl-[18px]">
                          {product.product_code && (
                            <li className="my-[8px] font-Poppins text-[14px] font-light leading-[28px] tracking-[0.03rem] text-[#333] list-disc">
                              <span className="font-Poppins text-[#333] text-[14px] font-semibold">
                                Product Code :
                              </span>{" "}
                              {product.product_code}
                            </li>
                          )}
                          {product.country_of_origin && (
                            <li className="my-[8px] font-Poppins text-[14px] font-light leading-[28px] tracking-[0.03rem] text-[#777] list-disc">
                              <span className="font-Poppins text-[#777] text-[14px]">
                                Country of Origin :
                              </span>{" "}
                              {product.country_of_origin}
                            </li>
                          )}
                          {product.dosage_form && (
                            <li className="my-[8px] font-Poppins text-[14px] font-light leading-[28px] tracking-[0.03rem] text-[#777] list-disc">
                              <span className="font-Poppins text-[#777] text-[14px]">
                                Dosage Form :
                              </span>{" "}
                              {product.dosage_form}
                            </li>
                          )}
                          {product.manufacturer && (
                            <li className="my-[8px] font-Poppins text-[14px] font-light leading-[28px] tracking-[0.03rem] text-[#777] list-disc">
                              <span className="font-Poppins text-[#777] text-[14px]">
                                Manufacturer :
                              </span>{" "}
                              {product.manufacturer}
                            </li>
                          )}
                        </ul>
                        <p className="my-[8px] w-[300px] font-Poppins text-[14px] font-light leading-[28px] tracking-[0.03rem] text-[#777] list-disc">
                          {product.manufacturer_image && (
                            <img
                              src={product.manufacturer_image}
                              alt={product.manufacturer}
                              className="w-full"
                            />
                          )}
                        </p>
                      </div>

                      {product.available ? (
                        <>
                          {!!error && (
                            <div className="w-full mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                              {error}
                            </div>
                          )}

                          {/* Table Format for Pricing */}
                          <div className="bb-pricing-table my-[24px]">
                            <div className="pro-title mb-[12px]">
                              <h4 className="font-quicksand leading-[1.2] tracking-[0.03rem] text-[16px] font-bold uppercase text-[#3d4750]">
                                Select Quantity
                              </h4>
                            </div>

                            {/* Desktop Table View */}
                            <div className="hidden md:block overflow-x-auto border border-[#0097b2]">
                              <table className="w-full border-collapse">
                                <thead>
                                  <tr className="bg-[#0097b2] text-white">
                                    <th className="py-3 px-4 text-left font-Poppins text-[14px] font-semibold">
                                      PACK SIZE
                                    </th>
                                    <th className="py-3 px-4 text-left font-Poppins text-[14px] font-semibold">
                                      PRICE
                                    </th>
                                    <th className="py-3 px-4 text-center font-Poppins text-[14px] font-semibold">
                                      QUANTITY
                                    </th>
                                    <th className="py-3 px-4 text-center font-Poppins text-[14px] font-semibold">
                                      ACTION
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {product.pricing.map((price, index) => (
                                    <tr
                                      key={index}
                                      className="border-b border-[#858585] hover:bg-gray-50"
                                    >
                                      <td className="py-3 px-4">
                                        <span className="font-Poppins text-[14px] text-[#3d4750] font-medium">
                                          {price.net_quantity}{" "}
                                          {product.dosage_form}/s
                                        </span>
                                      </td>
                                      <td className="py-3 px-4">
                                        <div>
                                          <span className="font-Poppins text-[16px] font-bold text-[#0097b2]">
                                            {currency} {price.total_price}
                                          </span>
                                          <p className="font-Poppins text-[12px] text-[#777]">
                                            ({currency} {price.unit_price} per{" "}
                                            {product.dosage_form})
                                          </p>
                                        </div>
                                      </td>
                                      <td className="py-3 px-4">
                                        <div className="flex justify-center">
                                          <div className="qty-plus-minus w-[100px] h-[40px] py-[7px] border-[1px] border-solid border-[#858585] overflow-hidden relative flex items-center justify-between bg-[#fff] rounded-[10px]">
                                            <button
                                              className="bb-qtybtn px-3"
                                              type="button"
                                              onClick={() =>
                                                handleQuantityChange(
                                                  price.net_quantity,
                                                  -1
                                                )
                                              }
                                            >
                                              -
                                            </button>
                                            <span className="qty-input text-[#777] text-[14px] font-normal">
                                              {quantities[price.net_quantity]}
                                            </span>
                                            <button
                                              className="bb-qtybtn px-3"
                                              type="button"
                                              onClick={() =>
                                                handleQuantityChange(
                                                  price.net_quantity,
                                                  1
                                                )
                                              }
                                            >
                                              +
                                            </button>
                                          </div>
                                        </div>
                                      </td>
                                      <td className="py-3 px-4 text-center">
                                        {isInCart(price.net_quantity) ? (
                                          <Link
                                            to="/cart"
                                            className="inline-block bg-[#6c757d] text-white py-2 px-6 rounded-[10px] font-Poppins text-[14px] font-medium hover:bg-[#5a6268] transition-all"
                                          >
                                            View Cart
                                          </Link>
                                        ) : (
                                          <button
                                            onClick={() =>
                                              handleAddToCart(price)
                                            }
                                            className="bg-[#0097b2] text-white py-2 px-6 rounded-[10px] font-Poppins text-[14px] font-medium hover:bg-[#007a8f] transition-all"
                                          >
                                            ADD
                                          </button>
                                        )}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>

                            {/* Mobile Card View */}
                            <div className="md:hidden space-y-4">
                              {product.pricing.map((price, index) => (
                                <div
                                  key={index}
                                  className="border-[1px] border-solid border-[#858585] rounded-[15px] p-4 bg-white shadow-sm"
                                >
                                  <div className="flex justify-between items-start mb-3">
                                    <div>
                                      <h5 className="font-Poppins text-[15px] font-bold text-[#3d4750] mb-1">
                                        {price.net_quantity}{" "}
                                        {product.dosage_form}/s
                                      </h5>
                                      <p className="font-Poppins text-[12px] text-[#777]">
                                        {currency} {price.unit_price} per{" "}
                                        {product.dosage_form}
                                      </p>
                                    </div>
                                    <span className="font-Poppins text-[18px] font-bold text-[#0097b2]">
                                      {currency} {price.total_price}
                                    </span>
                                  </div>

                                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#858585]">
                                    <div className="qty-plus-minus w-[100px] h-[40px] py-[7px] border-[1px] border-solid border-[#858585] overflow-hidden relative flex items-center justify-between bg-[#fff] rounded-[10px]">
                                      <button
                                        className="bb-qtybtn px-3"
                                        type="button"
                                        onClick={() =>
                                          handleQuantityChange(
                                            price.net_quantity,
                                            -1
                                          )
                                        }
                                      >
                                        -
                                      </button>
                                      <span className="qty-input text-[#777] text-[14px] font-normal">
                                        {quantities[price.net_quantity]}
                                      </span>
                                      <button
                                        className="bb-qtybtn px-3"
                                        type="button"
                                        onClick={() =>
                                          handleQuantityChange(
                                            price.net_quantity,
                                            1
                                          )
                                        }
                                      >
                                        +
                                      </button>
                                    </div>

                                    {isInCart(price.net_quantity) ? (
                                      <Link
                                        to="/cart"
                                        className="bg-[#6c757d] text-white py-2 px-6 rounded-[10px] font-Poppins text-[14px] font-medium hover:bg-[#5a6268] transition-all"
                                      >
                                        View Cart
                                      </Link>
                                    ) : (
                                      <button
                                        onClick={() => handleAddToCart(price)}
                                        className="bg-[#0097b2] text-white py-2 px-6 rounded-[10px] font-Poppins text-[14px] font-medium hover:bg-[#007a8f] transition-all"
                                      >
                                        ADD
                                      </button>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </>
                      ) : (
                        <p className="font-Poppins text-[16px] font-light text-[#ec6363] leading-[28px] tracking-[0.03rem] mt-[50px]">
                          This medicine is currently out of stock or unavailable
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bb-single-pro-tab">
                <div className="bb-pro-tab mb-[24px]">
                  <ul className="bb-pro-tab-nav flex flex-wrap mx-[-20px] max-[991px]:justify-center">
                    <li className="nav-item relative leading-[28px]">
                      <button
                        className={`nav-link px-5 font-Poppins text-[16px] font-medium capitalize leading-[28px] tracking-[0.03rem] block ${
                          activeTab === "detail"
                            ? "text-black font-bold"
                            : "text-[#686e7d]"
                        }`}
                        onClick={() => setActiveTab("detail")}
                      >
                        Detail
                      </button>
                    </li>
                    <li className="nav-item relative leading-[28px]">
                      <button
                        className={`nav-link px-5 font-Poppins text-[16px] font-medium capitalize leading-[28px] tracking-[0.03rem] block ${
                          activeTab === "information"
                            ? "text-black font-bold"
                            : "text-[#686e7d]"
                        }`}
                        onClick={() => setActiveTab("information")}
                      >
                        Information
                      </button>
                    </li>
                  </ul>
                </div>
                <div className="tab-content">
                  {activeTab === "detail" && (
                    <div className="tab-pro-pane" id="detail">
                      <div className="bb-inner-tabs border-[1px] border-solid border-[#858585] rounded-[20px]">
                        {product.description ? (
                          <div className="bb-details mx-3">
                            <ExpandableContent
                              html={product.description}
                              limit={400}
                            />
                          </div>
                        ) : (
                          <h4 className="font-quicksand leading-[1.2] tracking-[0.03rem] mb-[5px] text-[16px] font-bold text-[#3d4750]">
                            No description found
                          </h4>
                        )}
                      </div>
                    </div>
                  )}

                  {activeTab === "information" && (
                    <div className="tab-pro-pane" id="information">
                      <div className="bb-inner-tabs border-[1px] border-solid border-[#858585] rounded-[20px]">
                        {product.information ? (
                          <div className="bb-details mx-3">
                            <ExpandableContent
                              html={product.information}
                              limit={400}
                            />
                          </div>
                        ) : (
                          <h4 className="font-quicksand leading-[1.2] tracking-[0.03rem] mb-[5px] text-[16px] font-bold text-[#3d4750]">
                            No information found
                          </h4>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-4 w-[100%]">
              <div className="nav-item relative leading-[28px] mb-3">
                <div className="nav-link px-5 font-Poppins text-[16px] font-medium capitalize leading-[28px] tracking-[0.03rem] block text-black">
                  Reviews
                </div>
              </div>
              <div className="tab-pro-pane w-[100%] p-3" id="reviews">
                <div className="bb-inner-tabs border-[1px] border-solid border-[#858585] pt-[15px] rounded-[20px]">
                  <div className="bb-reviews mx-3">
                    {reviews.length === 0 && (
                      <h4 className="font-quicksand leading-[1.2] tracking-[0.03rem] mb-[5px] text-[16px] font-bold text-[#3d4750]">
                        No Review Found
                      </h4>
                    )}

                    {/* Show only visible reviews */}
                    {reviews.slice(0, visibleReviews).map((review) => (
                      <div
                        className="reviews-bb-box flex mb-[24px]"
                        key={review._id}
                      >
                        <div className="inner-image max-[575px]:mb-[12px] mr-2">
                          <div className="w-[100px]">
                            <h4 className="font-quicksand leading-[1.2] tracking-[0.03rem] mb-[5px] text-[16px] font-bold text-[#0097b2]">
                              {review.user_name}
                            </h4>
                            <small>{formatDate(review.created_at)}</small>
                            <img
                              src="/assets/img/reviews/verified_purchase.png"
                              className="w-100 mt-1 pr-3"
                            />
                          </div>
                        </div>
                        <div className="inner-contact">
                          <div className="bb-pro-rating flex">
                            {[...Array(review.rating)].map((star, index) => (
                              <i
                                key={index}
                                className="ri-star-fill float-left text-[15px] mr-[3px] text-yellow-500"
                              ></i>
                            ))}
                          </div>
                          <p className="font-quicksand leading-[1.2] tracking-[0.03rem] mb-[5px] text-[14px] text-[#777]">
                            {review.comment}
                          </p>
                        </div>
                      </div>
                    ))}

                    {/* Load More Button */}
                    {visibleReviews < reviews.length && (
                      <div className="text-center mt-4 mb-3">
                        <button
                          onClick={() => setVisibleReviews((prev) => prev + 5)}
                          className="bg-[#0097b2] hover:bg-[#007a8f] text-white py-2 px-6 rounded-[10px] font-Poppins text-[14px] font-medium transition-all"
                        >
                          Load More
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <RelatedProducts
        subCategory={product?.categories?.[0]?.subcategory}
        category={product?.categories?.[0]?.category}
        currentProductId={product?._id}
      />
    </>
  );
};

export default ProductDetails;
