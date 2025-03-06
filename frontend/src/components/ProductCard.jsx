import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";

const ProductCard = (product) => {
  const { currency } = useContext(ShopContext);
  const rating = product.rating.toFixed(1);
  const displayRating = () => {
    let stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <i
          key={i}
          className={
            i < rating
              ? "ri-star-fill float-left text-[15px] mr-[3px] leading-[18px] text-[#fea99a]"
              : "ri-star-line float-left text-[15px] mr-[3px] leading-[18px] text-[#fea99a]"
          }
        ></i>
      );
    }
    return stars;
  };
  return (
    <Link to={`/product/${product._id}`} className="bb-pro-box bg-white border border-[#eee] rounded-[20px] overflow-hidden">
      {/* Product Image */}
      <div className="bb-pro-img relative border-b border-[#eee]">
        <span className="flags absolute top-[10px] left-[6px] text-[14px] text-[#777] font-medium uppercase">
          NEW
        </span>

        <img
          className="w-full transition-all duration-300 hover:opacity-80"
          src={product.image[0]}
          alt={product.name}
        />
      </div>

      {/* Product Details */}
      <div className="p-[20px]">
        <div className="bb-pro-subtitle mb-[8px] flex flex-wrap justify-between">
          <a
            href="shop-left-sidebar-col-3.html"
            className="transition-all duration-[0.3s] ease-in-out font-Poppins text-[13px] leading-[16px] text-[#777] font-light tracking-[0.03rem]"
          >
            {product.category}
          </a>
          <span className="bb-pro-rating">{displayRating()}</span>
        </div>
        <h4 className="transition-all duration-[0.3s] ease-in-out font-quicksand w-full block whitespace-nowrap overflow-hidden text-ellipsis text-[15px] leading-[18px] text-[#3d4750] font-semibold tracking-[0.03rem]">
          {product.name}
        </h4>
        <div className="flex justify-between items-center">
          <span className="new-price px-[3px] text-[16px] text-[#686e7d] font-bold">
            {currency}
            {product.price}
          </span>
          {product.oldPrice && (
            <span className="old-price px-[3px] text-[14px] text-[#686e7d] line-through">
              {currency}
              {product.oldPrice}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
