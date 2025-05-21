import React, { useEffect } from "react";

const InvoicePrint = ({ order, products }) => {

  return (
    <div className="p-10 max-w-4xl mx-auto bg-white text-black text-sm font-sans absolute top-0 left-0 w-full min-h-[100vh] transform z-10" id="invoice">
      <div className="text-center mb-6">
        <img src="/logo.png" alt="Logo" className="mx-auto h-20" />
        <h1 className="text-2xl font-bold">INVOICE</h1>
      </div>

      <div className="flex justify-between mb-4">
        <div>
          <p><strong>Invoice ID:</strong> {order.order_id}</p>
          <p><strong>Date:</strong> {new Date(order.created_at).toLocaleDateString()}</p>
        </div>
        <div className="text-right">
          <p><strong>Customer:</strong></p>
          <p>{order.delivery_address[0].first_name} {order.delivery_address[0].last_name}</p>
          <p>{order.delivery_address[0].email}</p>
        </div>
      </div>

      <table className="w-full border border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2 text-left">Product</th>
            <th className="border p-2">Qty</th>
            <th className="border p-2">Unit Price</th>
            <th className="border p-2">Total</th>
          </tr>
        </thead>
        <tbody>
          {order.products.map((item, index) => {
            const product = products.find(p => p._id === item.product_id);
            return (
              <tr key={index}>
                <td className="border p-2">{product?.name || "N/A"}</td>
                <td className="border p-2 text-center">{item.quantity}</td>
                <td className="border p-2 text-center">{order.currency || "₹"} {item.price}</td>
                <td className="border p-2 text-center">{order.currency || "₹"} {(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="mt-4 text-right">
        <p><strong>Subtotal:</strong> {order.currency || "₹"} {order.sub_total.toFixed(2)}</p>
        <p><strong>Discount:</strong> {order.currency || "₹"} {order.discount || 0}</p>
        <p><strong>Delivery:</strong> {order.currency || "₹"} {order.delivery_charge}</p>
        <p className="text-xl mt-2"><strong>Total:</strong> {order.currency || "₹"} {order.total.toFixed(2)}</p>
      </div>

      <div className="text-center mt-10 italic text-gray-600">
        Thank you for shopping with us!
      </div>
    </div>
  );
};

export default InvoicePrint;
