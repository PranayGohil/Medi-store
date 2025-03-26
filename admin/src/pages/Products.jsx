import { useState, useContext, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaSearch, FaPlus, FaThLarge, FaList, FaEye, FaEdit } from "react-icons/fa";
import ProductCard from "../components/ProductCard";
import { ShopContext } from "../context/ShopContext";

const Products = () => {
  const location = useLocation();
  const { products } = useContext(ShopContext);

  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [visibleProducts, setVisibleProducts] = useState(12); // Initial products
  const [isLoadingMore, setIsLoadingMore] = useState(false); // Control loading text
  const observerRef = useRef(null);

  const navigate = useNavigate();

  // Extract category and subcategory from query parameters
  const searchParams = new URLSearchParams(location.search);
  const selectedCategory = searchParams.get("category") || "";
  const selectedSubcategory = searchParams.get("subcategory") || "";

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      !selectedCategory ||
      product.categories.some((cat) => cat.category === selectedCategory);
    const matchesSubcategory =
      !selectedSubcategory ||
      product.categories.some((cat) => cat.subcategory === selectedSubcategory);
    const matchesSearch =
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.generic_name.toLowerCase().includes(search.toLowerCase()) ||
      product.manufacturer.toLowerCase().includes(search.toLowerCase()) ||
      product.product_code.includes(search);

    return matchesCategory && matchesSubcategory && matchesSearch;
  });

  // Lazy Loading with Delay
  useEffect(() => {
    if (!observerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingMore) {
          setIsLoadingMore(true);

          // Delay loading new products by 1.5 seconds
          setTimeout(() => {
            setVisibleProducts((prev) => prev + 8);
            setIsLoadingMore(false);
          }, 1000);
        }
      },
      { threshold: 1.0 }
    );

    observer.observe(observerRef.current);

    return () => observer.disconnect();
  }, [filteredProducts, isLoadingMore]);

  return (
    <div className="p-6 bg-gray-50">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">Products</h1>

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/product/add-product")}
            className="flex items-center bg-blue-400 text-white py-3 px-4 hover:bg-blue-500 transition"
          >
            <FaPlus className="mr-2" /> Add Product
          </button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="flex gap-2 bg-gray-300 p-1">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 transition ${
              viewMode === "grid"
                ? "bg-blue-400 text-white"
                : "bg-gray-300 text-gray-800"
            }`}
          >
            <FaThLarge size={20} />
          </button>

          <button
            onClick={() => setViewMode("list")}
            className={`p-2 transition ${
              viewMode === "list"
                ? "bg-blue-400 text-white"
                : "bg-gray-300 text-gray-800"
            }`}
          >
            <FaList size={20} />
          </button>
        </div>
        <div className="flex justify-end items-center gap-4 w-full md:w-1/2">
          <div className="flex items-center bg-white shadow-md p-3 w-[400px]">
            <FaSearch className="text-gray-500" />
            <input
              type="text"
              placeholder="Search for medicines..."
              className="outline-none ml-2 w-full bg-transparent"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Product Display Section */}
      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            : "space-y-4"
        }
      >
        {filteredProducts.slice(0, visibleProducts).map((product, index) => (
          <ProductCard product={product} key={index} viewMode={viewMode} />
        ))}
      </div>

      {/* Lazy Load Trigger */}
      {visibleProducts < filteredProducts.length && (
        <div ref={observerRef} className="mt-6 text-center">
          {isLoadingMore ? (
            <p className="text-gray-500 animate-pulse">Loading more products...</p>
          ) : (
            <p className="text-gray-400">Scroll down to load more</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Products;
