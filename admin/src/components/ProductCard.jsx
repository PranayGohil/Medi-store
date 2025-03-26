import { Link } from "react-router-dom";
import { FaEye, FaEdit } from "react-icons/fa";
const ProductCard = ({ product, viewMode }) => {
  return (
    <div
      className={`bg-white shadow-lg p-5 transition-all transform hover:scale-95 hover:shadow-xl ${
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
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Product Info */}
      <div className={viewMode === "list" ? "flex-1" : ""}>
        <h2 className="text-lg font-bold text-gray-800">{product.name}</h2>
        <p className="text-sm text-gray-500 mb-2">({product.generic_name})</p>
        <p className="text-sm text-gray-600">
          Manufacturer:{" "}
          <span className="font-semibold">{product.manufacturer}</span>
        </p>
      </div>

      {/* Buttons */}
      <div
        className={`flex flex-col gap-2 ${
          viewMode === "list" ? "ml-auto" : "w-full mt-4 flex-row gap-3"
        }`}
      >
        <Link to={`/product/product-details/${product._id}`}>
          <button className="bg-blue-400 text-white py-2 px-4 hover:bg-blue-500 transition w-full">
            View Details
          </button>
        </Link>
        <Link to={`/product/edit-product/${product._id}`}>
          <button className="bg-green-400 text-white py-2 px-4 hover:bg-green-500 transition w-full">
            Edit Details
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
