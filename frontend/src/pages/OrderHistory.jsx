import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";
import Breadcrumb from "../components/Breadcrumb";
import LoadingSpinner from "../components/LoadingSpinner";

const OrderHistory = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useContext(AuthContext);
  const { currency } = useContext(ShopContext);
  const [orders, setOrders] = useState([]);

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

      <section className="section-cart py-[50px] max-[1199px]:py-[35px] max-[576px]:py-[25px]">
        <div className="flex flex-wrap justify-between relative items-center mx-auto min-[1400px]:max-w-[1320px] min-[1200px]:max-w-[1140px] min-[992px]:max-w-[960px] min-[768px]:max-w-[720px] min-[576px]:max-w-[540px] max-[576px]:px-[12px]">
          <div className="flex flex-wrap w-full mb-[-24px]">
            <div className="min-[992px]:w-[100%] w-full px-[12px] mb-[24px] max-[576px]:px-0">
              {orders.length === 0 && (
                <p className="text-center text-[14px] max-[576px]:text-[13px] py-8">
                  No orders found.
                </p>
              )}
              {orders.map((order) => (
                <div
                  key={order.order_id}
                  className="bb-cart-table my-2 border-[1px] border-solid border-[#858585] rounded-[20px] max-[576px]:rounded-[12px] overflow-hidden"
                >
                  {/* Order Info - Responsive Grid */}
                  <div className="grid grid-cols-3 max-[576px]:grid-cols-1 gap-3 max-[576px]:gap-2 p-[12px] max-[576px]:p-[16px] border-b-[1px] border-solid border-[#858585]">
                    <div className="max-[576px]:flex max-[576px]:justify-between max-[576px]:items-center max-[576px]:border-b max-[576px]:border-[#e5e5e5] max-[576px]:pb-2">
                      <span className="font-Poppins text-[14px] max-[576px]:text-[13px] font-semibold leading-[28px] max-[576px]:leading-[24px] tracking-[0.03rem] text-[#686e7d]">
                        Order ID
                      </span>
                      <span className="font-Poppins text-[14px] max-[576px]:text-[12px] font-normal leading-[28px] max-[576px]:leading-[24px] tracking-[0.03rem] text-[#686e7d] max-[576px]:hidden">
                        <br />
                        {order.order_id}
                      </span>
                      <span className="font-Poppins text-[13px] font-normal leading-[24px] tracking-[0.03rem] text-[#686e7d] min-[577px]:hidden">
                        {order.order_id}
                      </span>
                    </div>

                    <div className="max-[576px]:flex max-[576px]:justify-between max-[576px]:items-center max-[576px]:border-b max-[576px]:border-[#e5e5e5] max-[576px]:pb-2">
                      <span className="font-Poppins text-[14px] max-[576px]:text-[13px] font-semibold leading-[28px] max-[576px]:leading-[24px] tracking-[0.03rem] text-[#686e7d]">
                        Date
                      </span>
                      <span className="font-Poppins text-[14px] max-[576px]:text-[12px] font-normal leading-[28px] max-[576px]:leading-[24px] tracking-[0.03rem] text-[#686e7d] max-[576px]:hidden">
                        <br />
                        {new Date(order.created_at).toLocaleDateString()}
                      </span>
                      <span className="font-Poppins text-[13px] font-normal leading-[24px] tracking-[0.03rem] text-[#686e7d] min-[577px]:hidden">
                        {new Date(order.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="max-[576px]:flex max-[576px]:justify-between max-[576px]:items-center">
                      <span className="font-Poppins text-[14px] max-[576px]:text-[13px] font-semibold leading-[28px] max-[576px]:leading-[24px] tracking-[0.03rem] text-[#686e7d]">
                        Total Price
                      </span>
                      <span className="font-Poppins text-[15px] max-[576px]:text-[14px] font-medium leading-[26px] max-[576px]:leading-[24px] tracking-[0.02rem] text-[#686e7d] max-[576px]:hidden">
                        <br />
                        {currency} {order.total.toFixed(2)}
                      </span>
                      <span className="font-Poppins text-[14px] font-medium leading-[24px] tracking-[0.02rem] text-[#686e7d] min-[577px]:hidden">
                        {currency} {order.total.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Product List & Status - Responsive Layout */}
                  <div className="flex max-[768px]:flex-col justify-between p-[12px] max-[576px]:p-[16px] border-b-[1px] border-solid border-[#858585] items-start max-[768px]:gap-4">
                    {/* Product List */}
                    <div className="flex-1 max-[768px]:w-full">
                      {order.products.map((product) => (
                        <div
                          key={product._id + product.net_quantity}
                          className="flex items-center gap-4 max-[576px]:gap-3 mb-4 max-[576px]:mb-3 last:mb-0"
                        >
                          {product.product_images &&
                            product.product_images.length > 0 && (
                              <img
                                src={product.product_images[0]}
                                alt={product.name}
                                className="w-16 h-16 max-[576px]:w-14 max-[576px]:h-14 object-cover rounded-md border flex-shrink-0"
                              />
                            )}
                          <div className="flex-1 min-w-0">
                            <p className="font-Poppins text-[14px] max-[576px]:text-[13px] font-normal leading-[28px] max-[576px]:leading-[22px] tracking-[0.03rem] text-[#686e7d]">
                              {product.name} ({product.net_quantity}{" "}
                              {product.dosage_form}/s) - Qty: {product.quantity}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Status Badge */}
                    <div className="max-[768px]:w-full max-[768px]:border-t max-[768px]:border-[#e5e5e5] max-[768px]:pt-3">
                      <span className="font-Poppins text-[14px] max-[576px]:text-[13px] font-semibold max-[768px]:inline-block px-3 py-1 bg-[#f5f5f5] rounded-md leading-[28px] max-[576px]:leading-[24px] tracking-[0.03rem] text-[#686e7d]">
                        Status: {order.order_status}
                      </span>
                    </div>
                  </div>

                  {/* Order Details Button */}
                  <div className="flex justify-end p-[12px] max-[576px]:p-[16px]">
                    <Link
                      to={`/order-details/${order.order_id}`}
                      className="bb-btn-2 inline-block items-center justify-center check-btn transition-all duration-[0.3s] ease-in-out font-Poppins leading-[28px] max-[576px]:leading-[24px] tracking-[0.03rem] py-[4px] px-[25px] max-[576px]:py-[8px] max-[576px]:px-[20px] max-[576px]:w-full max-[576px]:text-center text-[14px] max-[576px]:text-[13px] font-normal text-[#fff] bg-[#0097b2] rounded-[10px] max-[576px]:rounded-[8px] border-[1px] border-solid border-[#0097b2] hover:bg-transparent hover:border-[#3d4750] hover:text-[#3d4750]"
                    >
                      View Order Details
                    </Link>
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
