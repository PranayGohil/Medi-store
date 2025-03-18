import React, { useState, useContext, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import Breadcrumb from "../components/Breadcrumb";
import ProductCard from "../components/ProductCard";

const Products = () => {
  const { products } = useContext(ShopContext);
  const [listView, setListView] = useState(false);
  const [sortOption, setSortOption] = useState("Sort by");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [visibleProducts, setVisibleProducts] = useState(9); // Initial count
  const [loading, setLoading] = useState(false);

  // Group products by category
  const categoryGroups = products.reduce((acc, product) => {
    product.categories.forEach((cat) => {
      if (!acc[cat.category]) {
        acc[cat.category] = {
          subcategories: new Set(),
          products: [],
        };
      }
      acc[cat.category].subcategories.add(cat.subcategory);
      acc[cat.category].products.push(product);
    });
    return acc;
  }, {});

  useEffect(() => {
    // Filter products based on selected categories and subcategories
    let filtered = products.filter((product) => {
      const categoryMatch =
        selectedCategories.length === 0 ||
        product.categories.some((cat) =>
          selectedCategories.includes(cat.category)
        );

      const subcategoryMatch =
        selectedSubcategories.length === 0 ||
        product.categories.some((cat) =>
          selectedSubcategories.includes(cat.subcategory)
        );

      return categoryMatch && subcategoryMatch;
    });

    // Sorting Logic
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
    setVisibleProducts(9);
  }, [products, selectedCategories, selectedSubcategories, sortOption]);

  // Handle category filter change
  const handleCategoryChange = (category) => {
    setSelectedCategories((prevCategories) =>
      prevCategories.includes(category)
        ? prevCategories.filter((c) => c !== category)
        : [...prevCategories, category]
    );
  };

  // Handle subcategory filter change
  const handleSubcategoryChange = (subcategory) => {
    setSelectedSubcategories((prevSubcategories) =>
      prevSubcategories.includes(subcategory)
        ? prevSubcategories.filter((s) => s !== subcategory)
        : [...prevSubcategories, subcategory]
    );
  };

  const toggleCategory = (category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  // Lazy loading function
  const loadMoreProducts = () => {
    if (loading || visibleProducts >= filteredProducts.length) return;
    setLoading(true);
    setTimeout(() => {
      setVisibleProducts((prev) => prev + 10); // Load 10 more products
      setLoading(false);
    }, 1000); // 1-second delay
  };

  // Handle scroll event to trigger lazy loading
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
        title="Products"
        destination1="Home"
        destination2="Products"
      />

      <section className="section-shop pb-[50px] max-[1199px]:pb-[35px]">
        <div className="flex flex-wrap justify-between relative items-center mx-auto min-[1400px]:max-w-[1320px] min-[1200px]:max-w-[1140px] min-[992px]:max-w-[960px] min-[768px]:max-w-[720px] min-[576px]:max-w-[540px]">
          <div className="flex flex-wrap w-full mb-[-24px]">
            <div className="min-[992px]:w-[25%] w-full px-[12px] mb-[24px]">
              <div className="bb-shop-wrap bg-[#f8f8fb] border-[1px] border-solid border-[#eee] rounded-[20px] sticky top-[0]">
                {/* Sidebar */}
                <div className="bb-sidebar-block p-[20px] border-b-[1px] border-solid border-[#eee]">
                  <div className="bb-sidebar-title mb-[20px]">
                    <h3 className="font-quicksand text-[18px] tracking-[0.03rem] leading-font-bold text-[#3d4750]">
                      Category
                    </h3>
                  </div>
                  <div className="bb-sidebar-contact">
                    <ul>
                      {Object.entries(categoryGroups).map(
                        ([category, { subcategories }]) => (
                          <li
                            className="relative block mb-[14px]"
                            key={category}
                          >
                            <div className="bb-sidebar-block-item relative">
                              <div
                                className="flex items-center justify-between cursor-pointer"
                                onClick={() => toggleCategory(category)}
                              >
                                <label className="flex items-center">
                                  <input
                                    type="checkbox"
                                    className="w-[25px] mr-2"
                                    checked={selectedCategories.includes(
                                      category
                                    )}
                                    onChange={() =>
                                      handleCategoryChange(category)
                                    }
                                  />
                                  <span className="text-[#777] text-[14px] leading-[20px] font-normal capitalize cursor-pointer">
                                    {category}
                                  </span>
                                </label>
                                <i
                                  className={`ri-arrow-${
                                    expandedCategories[category]
                                      ? "down"
                                      : "right"
                                  }-s-line`}
                                ></i>
                              </div>

                              {expandedCategories[category] && (
                                <ul className="ml-6 mt-2">
                                  {Array.from(subcategories).map(
                                    (subcategory) => (
                                      <li key={subcategory} className="mb-2">
                                        <label className="flex items-center">
                                          <input
                                            type="checkbox"
                                            className="w-[25px] mr-2"
                                            checked={selectedSubcategories.includes(
                                              subcategory
                                            )}
                                            onChange={() =>
                                              handleSubcategoryChange(
                                                subcategory
                                              )
                                            }
                                          />
                                          <span className="text-sm text-[#777]">
                                            {subcategory}
                                          </span>
                                        </label>
                                      </li>
                                    )
                                  )}
                                </ul>
                              )}
                            </div>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Section */}
            <div className="lg:w-3/4 w-full px-3 mb-6">
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

export default Products;
