import React, { useState, useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import Breadcrumb from "../components/Breadcrumb";
import Categories from "../components/Categories";
import ProductCard from "../components/ProductCard";

const Products = () => {
  const { products } = useContext(ShopContext);
  const [gridView, setGridView] = useState(true);
  const [sortOption, setSortOption] = useState("Sort by");

  const categories = [
    "Clothes",
    "Bags",
    "Shoes",
    "Cosmetics",
    "Electrics",
    "Phone",
    "Watch",
  ];
  const tags = ["Clothes", "Fruits", "Snacks"];
  return (
    <>
      <Breadcrumb
        title="Products"
        destination1="Home"
        destination2="Products"
      />
      <Categories />

      <section class="section-shop pb-[50px] max-[1199px]:pb-[35px]">
        <div class="flex flex-wrap justify-between relative items-center mx-auto min-[1400px]:max-w-[1320px] min-[1200px]:max-w-[1140px] min-[992px]:max-w-[960px] min-[768px]:max-w-[720px] min-[576px]:max-w-[540px]">
          <div class="flex flex-wrap w-full mb-[-24px]">
            <div className="min-[992px]:w-[25%] w-full px-[12px] mb-[24px]">
              <div class="bb-shop-wrap bg-[#f8f8fb] border-[1px] border-solid border-[#eee] rounded-[20px] sticky top-[0]">
                {/* Sidebar */}
                <div className="bb-sidebar-block p-[20px] border-b-[1px] border-solid border-[#eee]">
                  <div class="bb-sidebar-title mb-[20px]">
                    <h3 class="font-quicksand text-[18px] tracking-[0.03rem] leading-[1.2] font-bold text-[#3d4750]">
                      Category
                    </h3>
                  </div>
                  <div class="bb-sidebar-contact">
                    <ul>
                      {categories.map((category, index) => (
                        <li class="relative block mb-[14px]" key={index}>
                          <div class="bb-sidebar-block-item relative">
                            <input
                              type="checkbox"
                              class="w-full h-[calc(100%-5px)] absolute opacity-[0] cursor-pointer z-[999] top-[50%] left-[0] translate-y-[-50%]"
                            />
                            <a
                              href="javascript:void(0)"
                              class="ml-[30px] block text-[#777] text-[14px] leading-[20px] font-normal capitalize cursor-pointer"
                            >
                              {category}
                            </a>
                            <span class="checked absolute top-[0] left-[0] h-[18px] w-[18px] bg-[#fff] border-[1px] border-solid border-[#eee] rounded-[5px] overflow-hidden"></span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-700 mt-6 mb-4">
                      Tags
                    </h3>
                    <ul className="flex flex-wrap">
                      {tags.map((tag, index) => (
                        <li
                          key={index}
                          className="border px-3 py-1 rounded-lg text-sm text-gray-600 cursor-pointer hover:bg-indigo-400 hover:text-white mr-2 mb-2"
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Section */}
            <div className="lg:w-3/4 w-full px-3 mb-6">
              {/* <div className="flex justify-between bg-gray-100 border border-gray-200 rounded-2xl p-4 mb-6">
              <div className="flex space-x-2">
                <button
                  onClick={() => setGridView(true)}
                  className={`h-10 w-10 flex justify-center items-center border rounded-md ${
                    gridView ? "bg-gray-300" : "bg-transparent"
                  }`}
                >
                  <i className="ri-apps-line text-lg"></i>
                </button>
                <button
                  onClick={() => setGridView(false)}
                  className={`h-10 w-10 flex justify-center items-center border rounded-md ${
                    !gridView ? "bg-gray-300" : "bg-transparent"
                  }`}
                >
                  <i className="ri-list-unordered text-lg"></i>
                </button>
              </div>
              <select
                className="border px-3 py-2 rounded-md"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option disabled>Sort by</option>
                <option value="position">Position</option>
                <option value="relevance">Relevance</option>
                <option value="name-asc">Name, A to Z</option>
                <option value="name-desc">Name, Z to A</option>
                <option value="price-low">Price, Low to High</option>
                <option value="price-high">Price, High to Low</option>
              </select>
            </div> */}

              {/* Products List */}
              <div
                className={`grid ${
                  gridView ? "grid-cols-2 lg:grid-cols-3 gap-6" : "grid-cols-1"
                }`}
              >
                {products.map((product, index) => (
                  <ProductCard {...product} key={index} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Products;
