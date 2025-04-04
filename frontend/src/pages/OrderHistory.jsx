import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import Breadcrumb from "../components/Breadcrumb";
import LoadingSpinner from "../components/LoadingSpinner";

const OrderHistory = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useContext(AuthContext);
  const { currency } = useContext(ShopContext);
  const [orders, setOrders] = useState([]);

  const notifyError = (message) => toast.error(message);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.post(
          `${import.meta.env.VITE_APP_API_URL}/api/order/get-user-orders`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log("Orders:", response.data);
        const sortedOrders = response.data.orders.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setOrders(sortedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    } else {
      notifyError("Please login to view your order history.");
      navigate("/login");
    }
  }, [user]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Breadcrumb
        title="Order History"
        destination1="Home"
        destination2="Order History"
      />

      <section className="section-cart py-[50px] max-[1199px]:py-[35px]">
        <div className="flex flex-wrap justify-between relative items-center mx-auto min-[1400px]:max-w-[1320px] min-[1200px]:max-w-[1140px] min-[992px]:max-w-[960px] min-[768px]:max-w-[720px] min-[576px]:max-w-[540px]">
          <div className="flex flex-wrap w-full mb-[-24px]">
            <div className="min-[992px]:w-[100%] w-full px-[12px] mb-[24px]">
              {orders.length === 0 && (
                <p className="text-center">No orders found.</p>
              )}
              {orders.map((order) => (
                <div
                  key={order.order_id}
                  className="bb-cart-table my-2 border-[1px] border-solid border-[#eee] rounded-[20px] overflow-hidden"
                >
                  {/* Order Info */}
                  <div className="flex justify-between p-[12px] border-b-[1px] border-solid border-[#eee]">
                    <div>
                      <span className="font-Poppins text-[14px] font-semibold leading-[28px] tracking-[0.03rem] text-[#686e7d]">
                        Order ID
                      </span>
                      <br />
                      <span className="font-Poppins text-[14px] font-normal leading-[28px] tracking-[0.03rem] text-[#686e7d]">
                        {order.order_id}
                      </span>
                    </div>

                    <div>
                      <span className="font-Poppins text-[14px] font-semibold leading-[28px] tracking-[0.03rem] text-[#686e7d]">
                        Date
                      </span>
                      <br />
                      <span className="font-Poppins text-[14px] font-normal leading-[28px] tracking-[0.03rem] text-[#686e7d]">
                        {new Date(order.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <div>
                      <span className="font-Poppins text-[14px] font-semibold leading-[28px] tracking-[0.03rem] text-[#686e7d]">
                        Total Price
                      </span>
                      <br />
                      <span className="font-Poppins text-[15px] font-medium leading-[26px] tracking-[0.02rem] text-[#686e7d]">
                        {currency} {order.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between p-[12px] border-b-[1px] border-solid border-[#eee] items-center">
                    {/* Product List */}
                    <div className="p-[12px]">
                      {order.products.map((product) => (
                        <div
                          key={product._id + product.net_quantity}
                          className="flex items-center gap-4 mb-4"
                        >
                          {product.product_images &&
                            product.product_images.length > 0 && (
                              <img
                                src={product.product_images[0]}
                                alt={product.name}
                                className="w-16 h-16 object-cover rounded-md border"
                              />
                            )}
                          <div>
                            <p className="font-Poppins text-[14px] font-normal leading-[28px] tracking-[0.03rem] text-[#686e7d]">
                              {product.name} ({product.net_quantity}{" "}
                              {product.dosage_form}/s) - Qty: {product.quantity}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div>
                      <span className="font-Poppins text-[14px] font-normal leading-[28px] tracking-[0.03rem] text-[#686e7d]">
                        {order.order_status}
                      </span>
                    </div>

                    {/* Order Status & Button */}
                    <div className="flex justify-between items-center p-[12px]">
                      <Link
                        to={`/order-details/${order.order_id}`}
                        className="bb-btn-2 inline-block items-center justify-center check-btn transition-all duration-[0.3s] ease-in-out font-Poppins leading-[28px] tracking-[0.03rem] py-[4px] px-[25px] text-[14px] font-normal text-[#fff] bg-[#0097b2] rounded-[10px] border-[1px] border-solid border-[#0097b2] hover:bg-transparent hover:border-[#3d4750] hover:text-[#3d4750]"
                      >
                        View Order Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default OrderHistory;
