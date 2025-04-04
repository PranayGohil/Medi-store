import React, { useState, useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import Breadcrumb from "../components/Breadcrumb";
import ProductCard from "../components/ProductCard";

const Products = () => {
  const { products } = useContext(ShopContext);
  const [listView, setListView] = useState(false);
  const [sortOption, setSortOption] = useState("Sort by");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [visibleProducts, setVisibleProducts] = useState(9);
  const [showCategories, setShowCategories] = useState(false);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Extract category and subcategory from state
  const { category, subcategory } = location.state || {};

  const [selectedCategory, setSelectedCategory] = useState(category || "");
  const [selectedSubcategory, setSelectedSubcategory] = useState(
    subcategory || ""
  );

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
    let filtered = products;

    if (selectedCategory) {
      filtered = filtered.filter((product) =>
        product.categories.some((cat) => cat.category === selectedCategory)
      );
    }

    if (selectedCategory && selectedSubcategory) {
      filtered = filtered.filter((product) =>
        product.categories.some(
          (cat) =>
            cat.subcategory === selectedSubcategory &&
            cat.category === selectedCategory
        )
      );
    }

    // Sorting Logic
    if (sortOption === "name-asc") {
      filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === "name-desc") {
      filtered = [...filtered].sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortOption === "price-low") {
      filtered = [...filtered].sort(
        (a, b) => a.pricing[0].unit_price - b.pricing[0].unit_price
      );
    } else if (sortOption === "price-high") {
      filtered = [...filtered].sort(
        (a, b) => b.pricing[0].unit_price - a.pricing[0].unit_price
      );
    }

    setFilteredProducts(filtered);
    setVisibleProducts(9);
  }, [products, selectedCategory, selectedSubcategory, sortOption]);

  const setCategoryAndSubcategory = (cat, subcat) => {
    if (cat === selectedCategory && !subcat) {
      setSelectedCategory(null);
      setSelectedSubcategory(null);
    } else {
      setExpandedCategories({ [cat]: true });
      setSelectedCategory(cat);
      setSelectedSubcategory(subcat || "");
    }
  };

  const toggleCategory = (category) => {
    setExpandedCategories({
      [category]: !expandedCategories[category],
    });
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

  const toggleCategorySection = () => {
    setShowCategories(!showCategories);
  };

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
            <div className="min-[992px]:w-[25%] w-full px-[12px] mb-[24px] hidden lg:block">
              <div className="bb-shop-wrap bg-[#f8f8fb] border-[1px] border-solid border-[#eee] rounded-[20px] sticky top-[0]">
                {/* Sidebar */}
                <div className="bb-sidebar-block border-b-[1px] border-solid border-[#eee]">
                  <div className="bb-sidebar-title mb-[20px]">
                    <h3 className="font-quicksand text-[18px] px-[20px] pt-[20px] tracking-[0.03rem] leading-font-bold text-[#3d4750]">
                      Category
                    </h3>
                  </div>
                  <div className="bb-sidebar-contact">
                    <ul>
                      {Object.entries(categoryGroups).map(
                        ([category, { subcategories }]) => (
                          <li className="relative block" key={category}>
                            <div className="bb-sidebar-block-item relative">
                              <div
                                className={`flex items-center justify-between cursor-pointer py-[10px] px-[20px] ${
                                  category === selectedCategory
                                    ? "bg-[#0097b2] text-white"
                                    : "text-[#777]"
                                }`}
                                onClick={() =>
                                  setCategoryAndSubcategory(category)
                                }
                              >
                                <label className="flex items-center">
                                  <span
                                    className={`text-[14px] leading-[20px] font-normal capitalize cursor-pointer`}
                                  >
                                    {category}
                                  </span>
                                </label>
                                <i
                                  className={`ri-arrow-${
                                    expandedCategories[category]
                                      ? "down"
                                      : "right"
                                  }-s-line`}
                                  onClick={() => toggleCategory(category)}
                                />
                              </div>

                              {expandedCategories[category] && (
                                <ul>
                                  {Array.from(subcategories).map(
                                    (subcategory) => (
                                      <li
                                        key={subcategory}
                                        className={`pl-10 py-2 cursor-pointer ${
                                          category === selectedCategory &&
                                          subcategory === selectedSubcategory
                                            ? "bg-[#0097b2] text-white"
                                            : "text-[#777]"
                                        }`}
                                        onClick={() =>
                                          setCategoryAndSubcategory(
                                            category,
                                            subcategory
                                          )
                                        }
                                      >
                                        <div className="flex items-center">
                                          <span>- {subcategory}</span>
                                        </div>
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
                <div className="flex md:flex-row flex-col gap-2">
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
                  <button
                    className={`flex items-center gap-3  ${
                      showCategories ? "bg-gray-300" : "bg-white"
                    } border py-2 px-3 rounded-md lg:hidden`}
                    onClick={() => toggleCategorySection()}
                  >
                    <i class="ri-filter-3-line"></i>
                    Category Filter
                  </button>
                </div>
              </div>
              {showCategories && (
                <div className="w-full px-[12px] mb-[24px] block lg:hidden">
                  <div className="bb-shop-wrap bg-[#f8f8fb] border-[1px] border-solid border-[#eee] rounded-[20px] sticky top-[0]">
                    {/* Sidebar */}
                    <div className="bb-sidebar-block border-b-[1px] border-solid border-[#eee]">
                      <div className="bb-sidebar-title mb-[20px]">
                        <h3 className="font-quicksand text-[18px] px-[20px] pt-[20px] tracking-[0.03rem] leading-font-bold text-[#3d4750]">
                          Category
                        </h3>
                      </div>
                      <div className="bb-sidebar-contact">
                        <ul>
                          {Object.entries(categoryGroups).map(
                            ([category, { subcategories }]) => (
                              <li className="relative block" key={category}>
                                <div className="bb-sidebar-block-item relative">
                                  <div
                                    className={`flex items-center justify-between cursor-pointer py-[10px] px-[20px] ${
                                      category === selectedCategory
                                        ? "bg-[#0097b2] text-white"
                                        : "text-[#777]"
                                    }`}
                                    onClick={() =>
                                      setCategoryAndSubcategory(category)
                                    }
                                  >
                                    <label className="flex items-center">
                                      <span
                                        className={`text-[14px] leading-[20px] font-normal capitalize cursor-pointer`}
                                      >
                                        {category}
                                      </span>
                                    </label>
                                    <i
                                      className={`ri-arrow-${
                                        expandedCategories[category]
                                          ? "down"
                                          : "right"
                                      }-s-line`}
                                      onClick={() => toggleCategory(category)}
                                    />
                                  </div>

                                  {expandedCategories[category] && (
                                    <ul>
                                      {Array.from(subcategories).map(
                                        (subcategory) => (
                                          <li
                                            key={subcategory}
                                            className={`pl-10 py-2 cursor-pointer ${
                                              category === selectedCategory &&
                                              subcategory ===
                                                selectedSubcategory
                                                ? "bg-[#0097b2] text-white"
                                                : "text-[#777]"
                                            }`}
                                            onClick={() =>
                                              setCategoryAndSubcategory(
                                                category,
                                                subcategory
                                              )
                                            }
                                          >
                                            <div className="flex items-center">
                                              <span>- {subcategory}</span>
                                            </div>
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
              )}

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
