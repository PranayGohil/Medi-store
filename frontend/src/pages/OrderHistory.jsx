import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";
import Breadcrumb from "../components/Breadcrumb"; // Import Breadcrumb

const OrderHistory = () => {
  const { user } = useContext(AuthContext);
  const { currency } = useContext(ShopContext);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.VITE_APP_API_URL}/api/order/get-user-orders`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Data : ", response.data.orders);
        setOrders(response.data.orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

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
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="bb-cart-table my-2 border-[1px] border-solid border-[#eee] rounded-[20px] overflow-hidden max-[1399px]:overflow-y-auto"
                >
                  <table className="w-full max-[1399px]:w-[780px]">
                    <tbody>
                      <tr className="border-b-[1px] border-solid border-[#eee]">
                        <td className="p-[12px]">
                          <span className="font-Poppins text-[14px] font-semibold leading-[28px] tracking-[0.03rem] text-[#686e7d]">
                            Order ID
                          </span>
                          <br />
                          <span className="font-Poppins text-[14px] font-normal leading-[28px] tracking-[0.03rem] text-[#686e7d]">
                            {order.order_id}
                          </span>
                        </td>
                        <td className="p-[12px]">
                          <span className="font-Poppins text-[14px] font-semibold leading-[28px] tracking-[0.03rem] text-[#686e7d]">
                            Date
                          </span>
                          <br />
                          <span className="font-Poppins text-[14px] font-normal leading-[28px] tracking-[0.03rem] text-[#686e7d]">
                            {new Date(order.created_at).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="p-[12px]">
                          <span className="font-Poppins text-[14px] font-semibold leading-[28px] tracking-[0.03rem] text-[#686e7d]">
                            Total Price
                          </span>
                          <br />
                          <span className="font-Poppins text-[15px] font-medium leading-[26px] tracking-[0.02rem] text-[#686e7d]">
                            {currency} {order.total.toFixed(2)}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="p-[12px]">
                          <ul className="list-none p-0">
                            {order.products.map((product) => (
                              <li
                                key={product._id + product.net_quantity}
                                className="flex items-center mb-2"
                              >
                                {product.product_images &&
                                  product.product_images.length > 0 && (
                                    <img
                                      src={product.product_images[0]} // Use the first image
                                      alt={product.name}
                                      className="w-16 h-16 object-cover rounded-md mr-2" // Adjust size as needed
                                    />
                                  )}
                                <div>
                                  <p className="font-Poppins text-[14px] font-normal leading-[28px] tracking-[0.03rem] text-[#686e7d]">
                                    {product.name} ({product.net_quantity}{" "}
                                    {product.dosage_form}/s) - Qty:{" "}
                                    {product.quantity}
                                  </p>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </td>
                        <td className="p-[12px]">
                          <span className="font-Poppins text-[14px] font-normal leading-[28px] tracking-[0.03rem] text-[#686e7d]">
                            {order.order_status}
                          </span>
                        </td>
                        <td className="p-[12px]">
                          <button
                            className="bb-btn-2 inline-block items-center justify-center check-btn transition-all duration-[0.3s] ease-in-out font-Poppins leading-[28px] tracking-[0.03rem] py-[4px] px-[25px] text-[14px] font-normal text-[#fff] bg-[#6c7fd8] rounded-[10px] border-[1px] border-solid border-[#6c7fd8] hover:bg-transparent hover:border-[#3d4750] hover:text-[#3d4750]"
                            onClick={() => handleViewOrder(order._id)}
                          >
                            View Order Details
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
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
