// InvoicePrintWrapper.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import InvoicePrint from "../components/InvoicePrint";
import axios from "axios";

const InvoicePrintWrapper = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchInvoiceData = async () => {
      const orderRes = await axios.get(
        `${import.meta.env.VITE_APP_API_URL}/api/order/single/${orderId}`
      );
      const orderData = orderRes.data.order;
      const productIds = orderData.products.map((p) => p.product_id);
      const productRes = await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/api/product/get-by-ids`,
        { ids: productIds }
      );

      setOrder(orderData);
      setProducts(productRes.data.products);
    };

    fetchInvoiceData();
  }, [orderId]);

  if (!order || products.length === 0) return <p>Loading...</p>;

  return <InvoicePrint order={order} products={products} />;
};

export default InvoicePrintWrapper;
