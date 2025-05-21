import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";
import Title from "../components/Title";

import { AuthContext } from "../context/AuthContext";
import { ShopContext } from "../context/ShopContext";

import { FaStar } from "react-icons/fa";
import { toast } from "react-toastify";
import LoadingSpinner from "../components/LoadingSpinner";

import html2pdf from "html2pdf.js";

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [order, setOrder] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(null);

  const [openReview, setOpenReview] = useState(null);
  const [reviews, setReviews] = useState({});

  const { user } = useContext(AuthContext);
  const { currency } = useContext(ShopContext);

  const notifyError = (message) => toast.error(message);
  const notifySuccess = (message) => toast.success(message);

  const fetchOrder = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_APP_API_URL}/api/order/single-by-order-id/${id}`
      );
      setOrder(response.data.order);
      setSelectedStatus(response.data.order.order_status);
      console.log(response.data.order.status_history);

      // Fetch product details along with reviews
      const productDetails = await Promise.all(
        response.data.order.products.map(async (productItem) => {
          try {
            const productResponse = await axios.get(
              `${import.meta.env.VITE_APP_API_URL}/api/product/single/${
                productItem.product_id
              }`
            );

            // Fetch user's review for the product
            const reviewResponse = await axios.get(
              `${import.meta.env.VITE_APP_API_URL}/api/product/get-review/${
                productItem.product_id
              }/${user._id}`
            );

            if (reviewResponse.data.found === true) {
              setReviews({
                ...reviews,
                [productItem.product_id]: {
                  ...reviews[id],
                  comment: reviewResponse.data.review.comment,
                  rating: reviewResponse.data.review.rating,
                },
              });
            }

            return {
              ...productResponse.data.product,
              net_quantity: productItem.net_quantity,
              quantity: productItem.quantity,
              price: productItem.price,
              userReview: reviewResponse.data.review || null, // Store user review
            };
          } catch (productError) {
            console.error(
              `Error fetching product ${productItem.product_id}:`,
              productError
            );
            return {
              _id: productItem.product_id,
              name: "Product Not Found",
              generic_name: "N/A",
              product_code: "N/A",
              quantity: productItem.quantity,
              price: productItem.price,
              userReview: null,
            };
          }
        })
      );
      setProducts(productDetails);
    } catch (error) {
      console.error("Error fetching order details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      notifyError("Please login to view order details.");
      navigate("/login");
    }
    fetchOrder();
  }, []);

  const toggleReview = (id) => {
    setOpenReview(openReview === id ? null : id);
  };

  const handleReviewChange = (id, field, value) => {
    setReviews({
      ...reviews,
      [id]: { ...reviews[id], [field]: value },
    });
  };

  const handleReviewSubmit = (id) => {
    console.log("Review Submitted for Product ID:", id, reviews[id]);
    try {
      setIsLoading(true);
      const response = axios.post(
        `${import.meta.env.VITE_APP_API_URL}/api/product/add-review/${id}`,
        {
          user_id: user._id,
          rating: reviews[id].rating,
          comment: reviews[id].comment,
        }
      );
      console.log(response);
      notifySuccess("Review submitted successfully!");
      fetchOrder();
    } catch (error) {
      console.error("Error submitting review:", error);
    } finally {
      setIsLoading(false);
    }
    setOpenReview(null);
  };

  const downloadInvoicePDF = () => {
    const element = document.getElementById("invoice-content");
    html2pdf()
      .set({
        margin: 10,
        filename: `Invoice-${order.order_id}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .from(element)
      .save();
  };

  if (isLoading || !order) return <LoadingSpinner />;

  return (
    <>
      <Breadcrumb
        title="Order Details"
        destination1="Home"
        destination2="Order Details"
      />
      <section className="section-track py-[25px]">
        <div className="flex flex-wrap justify-between relative items-center mx-auto min-[1400px]:max-w-[1320px] min-[1200px]:max-w-[1140px] min-[992px]:max-w-[960px] min-[768px]:max-w-[720px] min-[576px]:max-w-[540px]">
          <Title
            title1="Track"
            title2="Order"
            description="Check your arriving order."
          />

          <div className="w-full px-[12px]">
            <div className="track p-[30px] border-[1px] border-solid border-[#eee] rounded-[30px] max-[480px]:p-[15px]">
              <div className="flex flex-wrap mx-[-12px] mb-[-24px]">
                <div className="w-full px-[12px] mb-[24px]">
                  <ul className="bb-progress m-[-12px] flex flex-wrap justify-center">
                    {order?.status_history &&
                    order.status_history.length > 0 ? (
                      order.status_history.map((history, index) => (
                        <li
                          key={index}
                          className={`w-[calc(20%-24px)] m-[12px] p-[30px] flex flex-wrap gap-4 items-center justify-center border-[1px] border-solid border-[#eee] rounded-[30px] relative max-[991px]:w-[calc(50%-24px)] max-[480px]:w-full ${"active"}`}
                        >
                          <span className="number w-[30px] h-[30px] bg-[#686e7d66] text-[#fff] absolute top-[10px] right-[10px] flex items-center justify-center rounded-[30px] font-Poppins text-[15px] font-light leading-[28px] tracking-[0.03rem]">
                            {index + 1}
                          </span>
                          <span className="icon mb-[5px]">
                            <i
                              className={`ri-${
                                [
                                  "check-double-line",
                                  "settings-line",
                                  "gift-2-line",
                                  "truck-line",
                                  "home-office-line",
                                ][index]
                              } text-[25px] text-[#a5a8b1]`}
                            ></i>
                          </span>
                          <span className="title text-center font-Poppins text-[15px] leading-[22px] tracking-[0.03rem] font-normal text-[#a5a8b1]">
                            {history.status}
                            <br />
                            {new Date(history.changed_at).toLocaleString()}
                          </span>
                        </li>
                      ))
                    ) : (
                      <p className="text-gray-500">
                        No status history available.
                      </p>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="section-track py-[25px] max-[1199px]:py-[35px]">
        <div className="flex flex-wrap justify-between relative items-center mx-auto min-[1400px]:max-w-[1320px] min-[1200px]:max-w-[1140px] min-[992px]:max-w-[960px] min-[768px]:max-w-[720px] min-[576px]:max-w-[540px]">
          <div className="flex flex-wrap w-full">
            <Title
              title1="Order"
              title2="Details"
              description="Check your Order Details."
            />
            <div className="w-full px-[12px]">
              <div className="track p-[30px] border-[1px] border-solid border-[#eee] rounded-[30px] max-[480px]:p-[15px]">
                <div className="flex flex-wrap mx-[-12px] mb-[-24px]">
                  <div className="min-[768px]:w-[33.33%] w-full px-[12px] mb-[24px]">
                    <div className="block-title p-[30px] bg-[#f8f8fb] border-[1px] border-solid border-[#eee] flex flex-col items-center justify-center rounded-[20px]">
                      <h6 className="mb-[5px] font-quicksand tracking-[0.03rem] text-[16px] font-bold leading-[1.2] text-[#3d4750]">
                        Order ID
                      </h6>
                      <p className="font-Poppins text-[14px] font-normal leading-[28px] tracking-[0.03rem] text-[#686e7d]">
                        {order.order_id}
                      </p>
                    </div>
                  </div>
                  <div className="min-[768px]:w-[33.33%] w-full px-[12px] mb-[24px]">
                    <div className="block-title p-[30px] bg-[#f8f8fb] border-[1px] border-solid border-[#eee] flex flex-col items-center justify-center rounded-[20px]">
                      <h6 className="mb-[5px] font-quicksand tracking-[0.03rem] text-[16px] font-bold leading-[1.2] text-[#3d4750]">
                        Order Date
                      </h6>
                      <p className="font-Poppins text-[14px] font-normal leading-[28px] tracking-[0.03rem] text-[#686e7d]">
                        {
                          new Date(order.created_at)
                            .toLocaleString()
                            .split(",")[0]
                        }
                      </p>
                    </div>
                  </div>
                  <div className="min-[768px]:w-[33.33%] w-full px-[12px] mb-[24px]">
                    <div className="block-title p-[30px] bg-[#f8f8fb] border-[1px] border-solid border-[#eee] flex flex-col items-center justify-center rounded-[20px]">
                      <h6 className="mb-[5px] font-quicksand tracking-[0.03rem] text-[16px] font-bold leading-[1.2] text-[#3d4750]">
                        Total Price
                      </h6>
                      <p className="font-Poppins text-[14px] font-normal leading-[28px] tracking-[0.03rem] text-[#686e7d]">
                        {currency} {order.total}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col py-5">
                  {products.map((product) => (
                    <div key={product._id} className="w-full px-3 mb-6">
                      <div className="bg-gray-100 border border-gray-200 p-5 rounded-2xl">
                        <div className="flex flex-col md:flex-row md:items-center">
                          {/* Product Image */}
                          <div className="flex-shrink-0 flex justify-center">
                            <img
                              src={product.product_images[0]}
                              alt={product.name}
                              className="w-1/2 md:w-20 md:h-20 rounded-md object-cover"
                            />
                          </div>

                          {/* Product Info */}
                          <div className="flex-grow mx-7 md:ml-6 mt-3 md:mt-0">
                            <span className="text-gray-700 text-sm md:text-base font-semibold">
                              {product.name}
                            </span>
                            <span className="text-gray-500 text-xs md:text-sm block">
                              {product.generic_name}
                            </span>
                            <span className="text-gray-500 text-xs md:text-sm">
                              {product.net_quantity} {product.dosage_form}/s
                            </span>
                          </div>

                          {/* Pricing Info */}
                          <div className="flex flex-col mx-7 items-start md:items-center md:ml-6 mt-3 md:mt-0">
                            <span className="text-gray-500 text-xs md:text-sm">
                              Price: {currency} {product.price}
                            </span>
                            <span className="text-gray-500 text-xs md:text-sm">
                              Quantity: {product.quantity}
                            </span>
                            <span className="text-gray-500 text-xs md:text-base font-semibold">
                              Total: ${product.price * product.quantity}
                            </span>
                          </div>

                          {/* Review Section */}
                          {product.userReview ? (
                            <div className="mt-4 mx-7 md:mt-0 md:ml-auto">
                              <button
                                onClick={() => toggleReview(product._id)}
                                className="bg-[#0097b2] border border-[#0097b2] hover:bg-transparent hover:text-[#0097b2] text-white text-sm md:text-base font-medium py-2 px-4 rounded-lg"
                              >
                                See Review
                              </button>
                            </div>
                          ) : (
                            <div className="mt-4 mx-7 md:mt-0 md:ml-auto">
                              <button
                                onClick={() => toggleReview(product._id)}
                                className="bg-[#0097b2] border border-[#0097b2] hover:bg-transparent hover:text-[#0097b2] text-white text-sm md:text-base font-medium py-2 px-4 rounded-lg"
                              >
                                Write Review
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Review Input (Dropdown Type) */}
                        {openReview === product._id && !product.userReview ? (
                          <div className="mt-4 bg-white border border-gray-300 p-4 rounded-lg shadow">
                            <h3 className="text-gray-700 font-semibold text-lg mb-2">
                              Write a Review for {product.name}
                            </h3>

                            {/* Clickable Star Rating */}
                            <label className="text-sm font-medium text-gray-600">
                              Rating
                            </label>
                            <div className="flex space-x-1 mt-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <FaStar
                                  key={star}
                                  className={`cursor-pointer text-2xl ${
                                    reviews[product._id]?.rating >= star
                                      ? "text-[#0097b2]"
                                      : "text-gray-300"
                                  }`}
                                  onClick={() =>
                                    handleReviewChange(
                                      product._id,
                                      "rating",
                                      star
                                    )
                                  }
                                />
                              ))}
                            </div>

                            {/* Review Text */}
                            <label className="text-sm font-medium text-gray-600 mt-3 block">
                              Your Review
                            </label>
                            <textarea
                              className="w-full border rounded-md p-2 mt-1 h-24 resize-none"
                              placeholder="Write your experience..."
                              value={reviews[product._id]?.comment || ""}
                              onChange={(e) =>
                                handleReviewChange(
                                  product._id,
                                  "comment",
                                  e.target.value
                                )
                              }
                            ></textarea>

                            {/* Buttons */}
                            <div className="flex justify-end mt-3 space-x-3">
                              <button
                                onClick={() => toggleReview(product._id)}
                                className="px-4 py-2 bg-gray-400 text-white rounded-md"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleReviewSubmit(product._id)}
                                className="px-4 py-2 bg-[#0097b2] border border-[#0097b2] hover:bg-transparent hover:text-[#0097b2] text-white rounded-md"
                              >
                                Submit
                              </button>
                            </div>
                          </div>
                        ) : openReview === product._id && product.userReview ? (
                          <div className="mt-4 bg-white border border-gray-300 p-4 rounded-lg shadow">
                            <h3 className="text-gray-700 font-semibold text-lg mb-2">
                              Your Review for {product.name}
                            </h3>
                            <div className="flex space-x-1 mt-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <FaStar
                                  key={star}
                                  className={`text-2xl ${
                                    product.userReview.rating >= star
                                      ? "text-[#0097b2]"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <p className="text-gray-600 mt-2">
                              {product.userReview.comment}
                            </p>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
                {order.order_status === "Order Delivered" && (
                  <button
                    onClick={downloadInvoicePDF}
                    className="bg-[#0097b2] border border-[#0097b2] hover:bg-transparent hover:text-[#0097b2] text-white text-sm md:text-base font-medium py-2 px-4 rounded-lg"
                  >
                    Download Invoice
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div style={{ display: "none" }}>
        <div id="invoice-content">
          <div className="p-10 max-w-4xl mx-auto bg-white text-black text-sm font-sans">
            <div className="text-center mb-6 flex justify-between items-center p-10">
              <img
                src="../assets/img/logo/logo.png"
                alt="Logo"
                className="h-20"
              />
              <h1 className="text-2xl font-bold">INVOICE</h1>
            </div>

            <div className="flex justify-between">
              <div>
                <div>
                  <strong>Order ID:</strong> <p>{order.order_id}</p>
                </div>
                <div className="mt-2">
                  <strong>Date:</strong>{" "}
                  <p>{new Date(order.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="text-right">
                {order.delivery_address && (
                  <>
                    <p>
                      <strong>Customer Name:</strong>
                    </p>
                    <p>
                      {order?.delivery_address[0]?.first_name}{" "}
                      {order?.delivery_address[0]?.last_name}
                    </p>
                    <p className="mt-2">
                      <strong>Email:</strong>
                    </p>
                    <p>{order.delivery_address[0]?.email}</p>
                    <p className="mt-2">
                      <strong>Phone:</strong>
                    </p>
                    <p>{order.delivery_address[0]?.phone}</p>
                  </>
                )}
              </div>
            </div>
            <div className="my-10">
              <table className="w-full border-collapse py-5">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border p-2 text-left">Product</th>
                    <th className="border p-2">Net Qty</th>
                    <th className="border p-2">Price</th>
                    <th className="border p-2">Qty</th>
                    <th className="border p-2">Total Price</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id}>
                      <td className="border p-2">
                        {product.name || "N/A"}{" "}
                        <small>({product.generic_name})</small>
                      </td>
                      <td className="border p-2 text-center">
                        {product.net_quantity} {product.dosage_form} /s
                      </td>
                      <td className="border p-2 text-center">
                        {currency} {product.price}
                      </td>
                      <td className="border p-2 text-center">
                        {product.quantity}
                      </td>
                      <td className="border p-2 text-center">
                        {currency}{" "}
                        {(product.price * product.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                  <tr className="">
                    <td colSpan="4" className=" p-2 text-right font-bold">
                      Subtotal:
                    </td>
                    <td className=" p-2 text-center">
                      {currency} {order.sub_total}
                    </td>
                  </tr>
                  <tr className="">
                    <td colSpan="4" className=" p-2 text-right font-bold">
                      Discount:
                    </td>
                    <td className=" p-2 text-center">
                      {currency} {order.discount || 0}
                    </td>
                  </tr>
                  <tr className="">
                    <td colSpan="4" className=" p-2 text-right font-bold">
                      Delivery:
                    </td>
                    <td className=" p-2 text-center">
                      {currency} {order.delivery_charge}
                    </td>
                  </tr>
                  <tr className="border-t-2 border-gray-400">
                    <td colSpan="4" className=" p-2 text-right font-bold">
                      Total:
                    </td>
                    <td className=" p-2 text-center">
                      {currency} {order.total}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="text-center mt-10 italic text-gray-600">
              Thank you for shopping with us!
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderDetails;
