import React, { useState, useContext, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import Breadcrumb from "../components/Breadcrumb";
import ProductCard from "../components/ProductCard";
import { useLocation } from "react-router-dom";

const SearchResults = () => {
  const { products } = useContext(ShopContext);
  const [listView, setListView] = useState(false);
  const [sortOption, setSortOption] = useState("Sort by");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState(9);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("q");
  const genericSearchQuery = searchParams.get("generic");

  useEffect(() => {
    let filtered = products;

    // Apply search filtering
    if (searchQuery) {
      filtered = products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.product_code.includes(searchQuery) ||
          product.manufacturer
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          product.generic_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    } else if (genericSearchQuery) {
      filtered = products.filter((product) =>
        product.generic_name
          .toLowerCase()
          .includes(genericSearchQuery.toLowerCase())
      );
    }

    // Apply sorting logic
    if (sortOption === "name-asc") {
      filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === "name-desc") {
      filtered = [...filtered].sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortOption === "price-low") {
      filtered = [...filtered].sort((a, b) => a.price - b.price);
    } else if (sortOption === "price-high") {
      filtered = [...filtered].sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(filtered);
    setVisibleProducts(9); // Reset visible products when filtering changes
  }, [products, searchQuery, genericSearchQuery, sortOption]);

  // Lazy loading function
  const loadMoreProducts = () => {
    if (loading || visibleProducts >= filteredProducts.length) return;
    setLoading(true);
    setTimeout(() => {
      setVisibleProducts((prev) => prev + 9); 
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 100 &&
        !loading
      ) {
        loadMoreProducts();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, visibleProducts, filteredProducts]);

  return (
    <>
      <Breadcrumb
        title="Search Results"
        destination1="Home"
        destination2="Search"
      />

      <section className="section-shop pb-[50px] max-[1199px]:pb-[35px]">
        <div className="flex flex-wrap justify-between relative items-center mx-auto min-[1400px]:max-w-[1320px] min-[1200px]:max-w-[1140px] min-[992px]:max-w-[960px] min-[768px]:max-w-[720px] min-[576px]:max-w-[540px]">
          <div className="flex flex-wrap w-full mb-[-24px]">
            {/* Products Section */}
            <div className="lg:w-full w-full px-3 mb-6">
              <div className="flex justify-between bg-gray-100 border border-gray-200 rounded-2xl p-4 mb-6">
                <div className="flex space-x-2">
                  <button
                    onClick={() => setListView(false)}
                    className={`h-10 w-10 flex justify-center items-center border rounded-md ${
                      listView ? "bg-transparent" : "bg-gray-300"
                    }`}
                  >
                    <i className="ri-apps-line text-lg"></i>
                  </button>
                  <button
                    onClick={() => setListView(true)}
                    className={`h-10 w-10 flex justify-center items-center border rounded-md ${
                      !listView ? "bg-transparent" : "bg-gray-300"
                    }`}
                  >
                    <i className="ri-list-unordered text-lg"></i>
                  </button>
                </div>
                <select
                  className="block border px-3 py-2 rounded-md"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                >
                  <option disabled>Sort by</option>
                  <option value="name-asc">Name, A to Z</option>
                  <option value="name-desc">Name, Z to A</option>
                  <option value="price-low">Price, Low to High</option>
                  <option value="price-high">Price, High to Low</option>
                </select>
              </div>

              {/* Products List */}
              <div
                className={`grid ${
                  listView ? "grid-cols-1" : "grid-cols-2 lg:grid-cols-3 gap-6"
                }`}
              >
                {filteredProducts
                  .slice(0, visibleProducts)
                  .map((product, index) => (
                    <ProductCard {...product} key={index} listView={listView} />
                  ))}
                {filteredProducts.length === 0 && (
                  <div className="col-span-full text-center py-8">
                    <p>No products found.</p>
                  </div>
                )}
              </div>

              {/* Loading Indicator */}
              {loading && (
                <div className="text-center py-4">
                  <p>Loading more products...</p>
                </div>
              )}

              {/* No More Products */}
              {visibleProducts >= filteredProducts.length && !loading && (
                <div className="text-center py-4">
                  <p>No more products to load.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default SearchResults;
