import { useState, useContext, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaPlus,
  FaThLarge,
  FaList,
  FaEye,
  FaEdit,
} from "react-icons/fa";
import ProductCard from "../components/ProductCard";
import { ShopContext } from "../context/ShopContext";

const Products = () => {
  const location = useLocation();
  const { products } = useContext(ShopContext);

  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [visibleProducts, setVisibleProducts] = useState(12);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observerRef = useRef(null);
  const navigate = useNavigate();

  const [filterBestSeller, setFilterBestSeller] = useState(false);
  const [filterAvailability, setFilterAvailability] = useState("");

  const availabilityOptions = [
    { label: "All", value: "" },
    { label: "In Stock", value: "in" },
    { label: "Out of Stock", value: "out" },
  ];

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

    const matchesBestSeller = !filterBestSeller || product.best_seller_manual;
    const matchesAvailability =
      filterAvailability === ""
        ? true
        : filterAvailability === "in"
        ? product.available
        : !product.available;

    return (
      matchesCategory &&
      matchesSubcategory &&
      matchesSearch &&
      matchesBestSeller &&
      matchesAvailability
    );
  });

  useEffect(() => {
    if (!observerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingMore) {
          setIsLoadingMore(true);
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
    <div className="p-6 bg-gray-100">
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

      {/* Filter Row */}
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

        <div className="flex flex-wrap gap-3 items-center">
          {/* Best Seller Filter */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">
              Best Seller
            </span>
            <button
              onClick={() => setFilterBestSeller(!filterBestSeller)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none ${
                filterBestSeller ? "bg-blue-500" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                  filterBestSeller ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Availability Filter */}
          <select
            value={filterAvailability}
            onChange={(e) => setFilterAvailability(e.target.value)}
            className="border border-gray-300 p-2 text-sm"
          >
            {availabilityOptions.map((opt) => (
              <option value={opt.value} key={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Search */}
          <div className="flex items-center bg-white shadow-md p-3 w-[250px]">
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
      {filteredProducts.length === 0 && (
        <p className="text-gray-500 w-full mt-5 text-center">
          No products found.
        </p>
      )}

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
            <p className="text-gray-500 animate-pulse">
              Loading more products...
            </p>
          ) : (
            <p className="text-gray-400">Scroll down to load more</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Products;
