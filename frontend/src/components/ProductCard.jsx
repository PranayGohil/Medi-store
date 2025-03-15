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

  if (!product.listView) {
    return (
      <Link
        to={`/product/${product.alias}`}
        className="bb-pro-box bg-white border border-[#eee] rounded-[20px] overflow-hidden"
      >
        {/* Product Image */}
        <div className="bb-pro-img relative border-b border-[#eee]">
          <span className="flags absolute top-[10px] left-[6px] text-[14px] text-[#777] font-medium uppercase">
            {product.product_code}
          </span>

          <img
            className="w-full aspect-square object-contain transition-all duration-300 hover:opacity-80"
            src={product.product_images[0]}
            alt={product.name}
          />
        </div>

        {/* Product Details */}
        <div className="p-[20px]">
          <div className="bb-pro-subtitle mb-[8px] flex flex-wrap justify-between">
            <p
              href="shop-left-sidebar-col-3.html"
              className="transition-all duration-[0.3s] ease-in-out font-Poppins text-[13px] leading-[16px] text-[#777] font-light tracking-[0.03rem]"
            >
              {product.categories[0].category}
            </p>
            <span className="bb-pro-rating">{displayRating()}</span>
          </div>
          <h4 className="transition-all duration-[0.3s] ease-in-out font-quicksand w-full block whitespace-nowrap overflow-hidden text-ellipsis text-[15px] leading-[18px] text-[#3d4750] font-semibold tracking-[0.03rem]">
            {product.name}
          </h4>
          <div className="flex justify-between items-center">
            <span className="new-price px-[3px] text-[16px] text-[#686e7d] font-bold">
              {currency}
              {product.pricing[0].unit_price} /Piece
            </span>
          </div>
          <Link to={`/product/${product.alias}`} className="block text-center mt-2 bb-btn-2 transition-all duration-[0.3s] ease-in-out font-Poppins leading-[28px] tracking-[0.03rem] py-[4px] px-[25px] text-[14px] font-normal text-[#fff] bg-[#6c7fd8] rounded-[10px] border-[1px] border-solid border-[#6c7fd8] hover:bg-transparent hover:border-[#3d4750] hover:text-[#3d4750]">
            View Details
          </Link>
        </div>
      </Link>
    );
  } else {
    return (
      <Link to={`/product/${product.alias}`} className="flex items-center border border-[#eee] rounded-[20px] mb-4 p-4">
        {/* Product Image */}
        <div className="w-1/4 mr-4">
          <img
            className="w-full"
            src={product.product_images[0]}
            alt={product.name}
          />
        </div>

        {/* Product Details */}
        <div className="flex-grow">
          <span className="text-sm text-gray-500">{product.product_code}</span>
          <p className="text-sm text-gray-700">{product.categories[0].category}</p>
          <h4 className="text-lg font-semibold">{product.name}</h4>
          <div className="bb-pro-rating">{displayRating()}</div>
        </div>

        {/* Price and Rating */}
        <div className="w-1/4 text-right">
          <span className="text-lg font-bold">
            {currency} {product.pricing[0].unit_price} /Piece
          </span>
          <Link to={`/product/${product.alias}`} className="block text-center mt-2 bb-btn-2 transition-all duration-[0.3s] ease-in-out font-Poppins leading-[28px] tracking-[0.03rem] py-[4px] px-[25px] text-[14px] font-normal text-[#fff] bg-[#6c7fd8] rounded-[10px] border-[1px] border-solid border-[#6c7fd8] hover:bg-transparent hover:border-[#3d4750] hover:text-[#3d4750]">
            View Details
          </Link>
        </div>
      </Link>
    );
  }
};

export default ProductCard;