import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaStar, FaRegStar } from "react-icons/fa";
import { ShopContext } from "../context/ShopContext";

const ProductCard = ({ product, viewMode }) => {
  const navigate = useNavigate();
  const { currency } = useContext(ShopContext);
  const [totalReviews, setTotalReviews] = useState(0);

  useEffect(() => {
    if (product.reviews.lenght > 0) {
      const total_reviews = product.reviews.reduce(
        (total, review) => total + review.rating,
        0
      );
      setTotalReviews(total_reviews);
    }

    console.log("Product: ", product);
  }, [product]);

  return (
    <div
      className={`bg-white shadow-lg rounded-lg p-5 transition-all transform hover:scale-95 hover:shadow-xl ${
        viewMode === "list" ? "flex items-center gap-6 p-4 justify-between" : ""
      }`}
    >
      <div className="text-sm text-gray-500 mb-2">
        Product Code: <span className="font-bold">{product.product_code}</span>
      </div>
      {/* Product Image */}
      <div
        className={`${
          viewMode === "list" ? "w-24 h-24" : "relative w-40 h-40 mx-auto mb-4"
        }`}
      >
        <img
          src={product.product_images[0]}
          alt={product.name}
          className="w-full h-full object-cover rounded-lg"
        />
      </div>

      {/* Product Info */}
      <div className={viewMode === "list" ? "flex-1" : ""}>
        <h2 className="text-lg font-bold text-gray-800">{product.name}</h2>
        <p className="text-sm text-gray-500 mb-2">({product.generic_name})</p>
        <p className="text-sm text-gray-600">{product.packaging}</p>
        <p className="text-sm text-gray-600">
          Manufacturer:{" "}
          <span className="font-semibold">{product.manufacturer}</span>
        </p>
      </div>
      <div
        className={
          viewMode === "list" ? "flex-1 flex items-end flex-col pr-5" : ""
        }
      >
        <p className="text-orange-600 font-bold text-lg mt-2">
          {currency}
          {product.pricing[0].unit_price}{" "}
          <span className="text-sm">/Piece</span>
        </p>

        {/* Star Rating */}
        <div className="flex items-center text-yellow-500 mt-2">
          {Array(5)
            .fill()
            .map((_, i) => (
              <div key={i}>
                {i < product.rating ? (
                  <FaStar key={i} />
                ) : (
                  <FaRegStar key={i} />
                )}
              </div>
            ))}
          <span className="text-gray-500 ml-2 text-sm">
            ({totalReviews} Reviews)
          </span>
        </div>
      </div>

      {/* Buttons - Move to right in list view */}
      <div
        className={`flex flex-col gap-2 ${
          viewMode === "list" ? "ml-auto" : "w-full mt-4 flex-row gap-3"
        }`}
      >
        <button
          className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition w-full"
          onClick={() => navigate(`/product/product-details/${product._id}`)}
        >
          View Details
        </button>
        <button
          className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition w-full"
          onClick={() => navigate(`/product/edit-product/${product._id}`)}
        >
          Edit Details
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
