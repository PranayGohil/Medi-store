import React, { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";
import RelatedProducts from "../components/RelatedProducts";
import axios from "axios";
import LoadingSpinner from "../components/LoadingSpinner";
import PageTitle from "../components/PageTitle";
import { ShopContext } from "../context/ShopContext";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { toast } from "react-toastify";

const ProductDetails = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  const alias = id;
  const { currency } = useContext(ShopContext);
  const { user } = useContext(AuthContext);
  const { addItemToCart } = useContext(CartContext);
  const [product, setProduct] = useState(null);
  const [activeTab, setActiveTab] = useState("detail");
  const [mainImage, setMainImage] = useState(null);
  const [rating, setrating] = useState(0);
  const [selectedPrice, setSelectedPrice] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState([]);
  const [reviews, setReviews] = useState([]);

  const [isProductInCart, setIsProductInCart] = useState(false);
  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);

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

        // Fetch user data for all reviews in parallel
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
        setSelectedPrice(response.data.product.pricing[0]);
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
    fetchCart();
  }, []);
  useEffect(() => {
    fetchProduct();
  }, [alias]);

  useEffect(() => {
    if (cart && product && selectedPrice) {
      const productExists = cart.some(
        (item) =>
          item.id === product._id &&
          item.net_quantity === selectedPrice.net_quantity
      );
      // if (productExists === true) {
      //   setQuantity(productExists.quantity);
      // } else {
      //   setQuantity(1);
      // }
      setIsProductInCart(productExists);
    }
  }, [cart, product, selectedPrice]);

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
              ? "ri-star-fill float-left text-[15px] mr-[3px] text-[#0097b2]"
              : "ri-star-line float-left text-[15px] mr-[3px] text-[#0097b2]"
          }
        ></i>
      );
    }
    return stars;
  };

  const handleAddToCart = async () => {
    if (!user) {
      notifyError("Please login to add items to your cart.");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/api/cart/add-to-cart`,
        {
          userId: user._id,
          product_id: product._id,
          net_quantity: selectedPrice.net_quantity,
          price: selectedPrice.total_price,
          quantity: quantity,
        }
      );

      if (response.data.success) {
        notifySuccess("Product added to cart!");
        fetchCart();
        addItemToCart({
          product_id: product._id,
          net_quantity: selectedPrice.net_quantity,
          price: selectedPrice.total_price,
          quantity: quantity,
        });
        setIsProductInCart(true);
      } else {
        notifyError("Failed to add product to cart.");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      notifyError("An error occurred while adding to cart.");
    } finally {
      setIsLoading(false);
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
                    <div className="single-pro-slider sticky top-[0] p-[15px] border-[1px] border-solid border-[#eee] rounded-[24px] max-[991px]:max-w-[500px] max-[991px]:m-auto">
                      <div className="single-product-cover">
                        <div className="single-slide zoom-image-hover rounded-tl-[15px] rounded-tr-[15px]">
                          <img
                            className="img-responsive rounded-tl-[15px] rounded-tr-[15px]"
                            src={mainImage}
                            alt={product.name}
                          />
                        </div>
                      </div>
                      <div className="flex mt-4 space-x-2">
                        {product.product_images.map((image, index) => (
                          <img
                            key={index}
                            className="w-32 overflow-scroll border border-transparent hover:border-gray-400 rounded-md cursor-pointer"
                            src={image}
                            alt={`product-${index}`}
                            onClick={() => handleThumbnailClick(image)}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Product Details Section */}
                  <div className="min-[992px]:w-[58.33%] w-full px-[12px] mb-[24px]">
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
                            className="font-Poppins text-[15px] font-light leading-[28px] tracking-[0.03rem] text-[#0097b2]"
                          >
                            {product.reviews.length} Reviews
                          </Link>
                        </span>
                      </div>
                      <div className="font-Poppins text-[15px] font-light leading-[28px] tracking-[0.03rem]">
                        <ul className="my-[-8px] pl-[18px]">
                          {product.product_code && (
                            <li className="my-[8px] font-Poppins text-[14px] font-light leading-[28px] tracking-[0.03rem] text-[#777] list-disc">
                              <span className="font-Poppins text-[#777] text-[14px]">
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

                      {/* <div className="bb-single-price-wrap flex justify-between py-[10px]">
                        <div className="bb-single-price py-[15px]">
                          <div className="price mb-[8px]">
                            <h5 className="font-quicksand leading-[1.2] tracking-[0.03rem] text-[20px] font-extrabold text-[#3d4750]">
                              {currency + " " + selectedPrice.total_price}
                            </h5>
                          </div>
                          <div className="mrp">
                            <p className="font-Poppins text-[16px] font-light text-[#686e7d] leading-[28px] tracking-[0.03rem]">
                              M.R.P. :{" "}
                              <span className="text-[15px] line-through">
                                $1,999.00
                              </span>
                            </p>
                          </div>
                        </div>
                        <div className="bb-single-price py-[15px]">
                          <div className="sku mb-[8px]">
                            <h5 className="font-quicksand text-[18px] font-extrabold leading-[1.2] tracking-[0.03rem] text-[#3d4750]">
                              SKU#: WH12
                            </h5>
                          </div>
                          <div className="stock">
                            <span className="text-[18px] text-[#0097b2]">
                              In stock
                            </span>
                          </div>
                        </div>
                      </div> */}
                      {product.available ? (
                        <>
                          <div className="bb-single-pro-weight my-[24px]">
                            <div className="pro-title mb-[12px]">
                              <h4 className="font-quicksand leading-[1.2] tracking-[0.03rem] text-[16px] font-bold uppercase text-[#3d4750]">
                                Select Quantity
                              </h4>
                            </div>
                            <div className="bb-pro-variation-contant">
                              <ul className="flex flex-wrap m-[-2px]">
                                <div>
                                  {product.pricing.map((price, index) => (
                                    <li
                                      key={index}
                                      className={`my-[10px] mx-[2px] py-[2px] px-[15px] border-[1px] border-solid border-[#eee] rounded-[10px] cursor-pointer ${
                                        price.net_quantity ===
                                        selectedPrice.net_quantity
                                          ? "active-variation"
                                          : ""
                                      }`}
                                      onClick={() => setSelectedPrice(price)}
                                    >
                                      <span className="font-Poppins text-[#000000] font-light text-[14px] leading-[28px] tracking-[0.03rem]">
                                        {price.net_quantity}{" "}
                                        {product.dosage_form} /s -
                                        &nbsp;&nbsp;&nbsp;&nbsp; {currency}
                                        {price.total_price}{" "}
                                        &nbsp;&nbsp;&nbsp;&nbsp; ( {currency}
                                        {price.unit_price} per{" "}
                                        {product.dosage_form} )
                                      </span>
                                    </li>
                                  ))}
                                </div>
                              </ul>
                            </div>
                          </div>
                          <div className="pro-title mb-[18px]">
                            <h4 className="font-quicksand leading-[1.2] tracking-[0.03rem] text-[16px] font-bold uppercase text-[#3d4750]">
                              Total: {currency}{" "}
                              {selectedPrice.total_price * quantity}
                            </h4>
                          </div>
                          <div className="bb-single-qty flex flex-wrap m-[-2px]">
                            <div className="qty-plus-minus m-[2px] w-[85px] h-[40px] py-[7px] border-[1px] border-solid border-[#eee] overflow-hidden relative flex items-center justify-between bg-[#fff] rounded-[10px]">
                              <button
                                className="bb-qtybtn"
                                type="button"
                                onClick={() => {
                                  setQuantity((prevQuantity) => {
                                    if (prevQuantity > 1) {
                                      return prevQuantity - 1;
                                    }
                                    return prevQuantity; // Ensure it doesn't go below 1
                                  });
                                }}
                              >
                                -
                              </button>
                              <p className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-full qty-input text-[#777] float-left text-[14px] h-auto m-[0] p-[0] text-center outline-[0] font-normal leading-[35px] rounded-[10px]">
                                {quantity}
                              </p>
                              <button
                                className="bb-qtybtn"
                                type="button"
                                onClick={() => {
                                  setQuantity(
                                    (prevQuantity) => prevQuantity + 1
                                  );
                                }}
                              >
                                +
                              </button>
                            </div>
                            <div className="buttons m-[2px]">
                              {isProductInCart ? (
                                <Link
                                  to="/cart"
                                  className="bb-btn-2 transition-all duration-[0.3s] ease-in-out h-[40px] flex font-Poppins leading-[28px] tracking-[0.03rem] py-[6px] px-[25px] text-[14px] font-normal text-[#fff] bg-[#0097b2] rounded-[10px] border-[1px] border-solid border-[#0097b2] hover:bg-transparent hover:border-[#3d4750] hover:text-[#3d4750]"
                                >
                                  View Cart
                                </Link>
                              ) : (
                                <button
                                  onClick={handleAddToCart}
                                  className="bb-btn-2 transition-all duration-[0.3s] ease-in-out h-[40px] flex font-Poppins leading-[28px] tracking-[0.03rem] py-[6px] px-[25px] text-[14px] font-normal text-[#fff] bg-[#0097b2] rounded-[10px] border-[1px] border-solid border-[#0097b2] hover:bg-transparent hover:border-[#3d4750] hover:text-[#3d4750]"
                                >
                                  Add to Cart
                                </button>
                              )}
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
                    <li className="nav-item relative leading-[28px]">
                      <button
                        className={`nav-link px-5 font-Poppins text-[16px] font-medium capitalize leading-[28px] tracking-[0.03rem] block ${
                          activeTab === "reviews"
                            ? "text-black font-bold"
                            : "text-[#686e7d]"
                        }`}
                        onClick={() => setActiveTab("reviews")}
                      >
                        Reviews
                      </button>
                    </li>
                  </ul>
                </div>
                <div className="tab-content">
                  {activeTab === "detail" && (
                    <div className="tab-pro-pane" id="detail">
                      <div className="bb-inner-tabs border-[1px] border-solid border-[#eee] p-[15px] rounded-[20px]">
                        {product.description ? (
                          <div
                            className="bb-details prose max-w-full ql-editor mx-3"
                            dangerouslySetInnerHTML={{
                              __html: product.description,
                            }}
                          ></div>
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
                      <div className="bb-inner-tabs border-[1px] border-solid border-[#eee] p-[15px] rounded-[20px]">
                        {product.information ? (
                          <div
                            className="information prose max-w-full ql-editor mx-3"
                            dangerouslySetInnerHTML={{
                              __html: product.information,
                            }}
                          ></div>
                        ) : (
                          <h4 className="font-quicksand leading-[1.2] tracking-[0.03rem] mb-[5px] text-[16px] font-bold text-[#3d4750]">
                            No information found
                          </h4>
                        )}
                      </div>
                    </div>
                  )}

                  {activeTab === "reviews" && (
                    <div className="tab-pro-pane" id="reviews">
                      <div className="bb-inner-tabs border-[1px] border-solid border-[#eee] p-[15px] rounded-[20px]">
                        <div className="bb-reviews mx-3">
                          {reviews.length === 0 && (
                            <h4 className="font-quicksand leading-[1.2] tracking-[0.03rem] mb-[5px] text-[16px] font-bold text-[#3d4750]">
                              No Review Found
                            </h4>
                          )}
                          {reviews.map((review) => (
                            <div
                              className="reviews-bb-box flex mb-[24px] max-[575px]:flex-col"
                              key={review._id}
                            >
                              <div className="inner-image mr-[12px] max-[575px]:mr-[0] max-[575px]:mb-[12px]">
                                <img
                                  src="../assets/img/reviews/1.jpg"
                                  alt="img-1"
                                  className="w-[50px] h-[50px] max-w-[50px] rounded-[10px]"
                                />
                              </div>
                              <div className="inner-contact">
                                <h4 className="font-quicksand leading-[1.2] tracking-[0.03rem] mb-[5px] text-[16px] font-bold text-[#3d4750]">
                                  {review.user_name}
                                </h4>
                                <div className="bb-pro-rating flex">
                                  {[...Array(review.rating)].map(
                                    (star, index) => (
                                      <i
                                        key={index}
                                        className="ri-star-fill float-left text-[15px] mr-[3px] text-[#0097b2]"
                                      ></i>
                                    )
                                  )}
                                </div>
                                <p className="font-quicksand leading-[1.2] tracking-[0.03rem] mb-[5px] text-[14px] text-[#777]">
                                  {review.comment}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <RelatedProducts />
    </>
  );
};

export default ProductDetails;
