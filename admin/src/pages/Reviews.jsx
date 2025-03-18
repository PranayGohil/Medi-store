import { useState, useEffect } from "react";
import {
  FaSearch,
  FaStar,
  FaCheck,
  FaTimes,
  FaSortUp,
  FaSortDown,
} from "react-icons/fa";
import axios from "axios";
import ReactPaginate from "react-paginate";

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(10);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [showModal, setShowModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_API_URL}/api/product/all-reviews`
      );

      if (response.data.success) {
        let reviewsData = response.data.reviews;

        const reviewsWithUserInfo = await Promise.all(
          reviewsData.map(async (review) => {
            try {
              const userinfo = await axios.get(
                `${import.meta.env.VITE_APP_API_URL}/api/user/get-user/${
                  review.user_id
                }`
              );

              if (userinfo.data.success) {
                return {
                  ...review,
                  user_name:
                    userinfo.data.user.first_name +
                    " " +
                    userinfo.data.user.last_name,
                  email: userinfo.data.user.email,
                  phone: userinfo.data.user.phone,
                };
              }
            } catch (err) {
              console.error("Error fetching user info:", err);
              return {
                ...review,
                user_name: "Unknown",
                email: "-",
                phone: "-",
              };
            }
          })
        );
        // Sort Reviews by created_at (newest first)
      const sortedReviews = reviewsWithUserInfo.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
        setReviews(sortedReviews);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const handleReviewStatus = async (productId, reviewId, status) => {
    try {
      await axios.put(
        `${
          import.meta.env.VITE_APP_API_URL
        }/api/product/change-review-status/${productId}/${reviewId}`,
        {
          status,
        }
      );
      fetchReviews();
    } catch (error) {
      console.error("Error updating review:", error);
    }
  };

  const filteredReviews = reviews.filter(
    (review) =>
      (review.user_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.product_name
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        review.comment?.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (ratingFilter === "" || review.rating === parseInt(ratingFilter))
  );

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    if (!sortColumn) return 0;

    let aValue, bValue;
    if (sortColumn === "user_name") {
      aValue = a.user_name;
      bValue = b.user_name;
    } else if (sortColumn === "product_name") {
      aValue = a.product_name;
      bValue = b.product_name;
    } else if (sortColumn === "rating") {
      aValue = a.rating;
      bValue = b.rating;
    } else if (sortColumn === "created_at") {
      aValue = new Date(a.created_at);
      bValue = new Date(b.created_at);
    } else if (sortColumn === "status") {
      aValue = a.status;
      bValue = b.status;
    } else {
      return 0;
    }

    if (sortDirection === "asc") {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const offset = currentPage * itemsPerPage;
  const currentReviews = sortedReviews.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(sortedReviews.length / itemsPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleOpenModal = (review) => {
    setSelectedReview(review);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedReview(null);
  };

  const handleModalApprove = () => {
    if (selectedReview) {
      handleReviewStatus(
        selectedReview.product_id,
        selectedReview._id,
        "approved"
      );
      handleCloseModal();
    }
  };

  const handleModalReject = () => {
    if (selectedReview) {
      handleReviewStatus(
        selectedReview.product_id,
        selectedReview._id,
        "rejected"
      );
      handleCloseModal();
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="w-full mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">
          Product Reviews
        </h1>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative w-full md:w-2/3">
            <input
              type="text"
              placeholder="Search by User, Product, or Comment"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-3 pl-10 border rounded-md"
            />
            <FaSearch className="absolute top-3 left-3 text-gray-500" />
          </div>

          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="p-3 border rounded-md w-full md:w-1/3"
          >
            <option value="">All Ratings</option>
            <option value="5">⭐⭐⭐⭐⭐ (5 Stars)</option>
            <option value="4">⭐⭐⭐⭐ (4 Stars)</option>
            <option value="3">⭐⭐⭐ (3 Stars)</option>
            <option value="2">⭐⭐ (2 Stars)</option>
            <option value="1">⭐ (1 Star)</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white shadow-md rounded-md">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th
                  className="p-3 text-left cursor-pointer"
                  onClick={() => handleSort("user_name")}
                >
                  User Name
                  {sortColumn === "user_name" &&
                    (sortDirection === "asc" ? (
                      <FaSortUp className="inline ml-1" />
                    ) : (
                      <FaSortDown className="inline ml-1" />
                    ))}
                </th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Phone</th>
                <th
                  className="p-3 text-left cursor-pointer"
                  onClick={() => handleSort("product_name")}
                >
                  Product
                  {sortColumn === "product_name" &&
                    (sortDirection === "asc" ? (
                      <FaSortUp className="inline ml-1" />
                    ) : (
                      <FaSortDown className="inline ml-1" />
                    ))}
                </th>
                <th
                  className="p-3 text-left cursor-pointer"
                  onClick={() => handleSort("rating")}
                >
                  Rating
                  {sortColumn === "rating" &&
                    (sortDirection === "asc" ? (
                      <FaSortUp className="inline ml-1" />
                    ) : (
                      <FaSortDown className="inline ml-1" />
                    ))}
                </th>
                <th className="p-3 text-left">Comment</th>
                <th
                  className="p-3 text-left cursor-pointer"
                  onClick={() => handleSort("created_at")}
                >
                  Date
                  {sortColumn === "created_at" &&
                    (sortDirection === "asc" ? (
                      <FaSortUp className="inline ml-1" />
                    ) : (
                      <FaSortDown className="inline ml-1" />
                    ))}
                </th>
                <th
                  className="p-3 text-center cursor-pointer"
                  onClick={() => handleSort("status")}
                >
                  Status
                  {sortColumn === "status" &&
                    (sortDirection === "asc" ? (
                      <FaSortUp className="inline ml-1" />
                    ) : (
                      <FaSortDown className="inline ml-1" />
                    ))}
                </th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentReviews.length > 0 ? (
                currentReviews.map((review) => (
                  <tr key={review._id} className="border-b">
                    <td className="p-3">{review.user_name}</td>
                    <td className="p-3">{review.email}</td>
                    <td className="p-3">{review.phone}</td>
                    <td className="p-3">{review.product_name}</td>
                    <td className="p-3 flex items-center">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <FaStar key={i} className="text-yellow-500" />
                      ))}
                    </td>
                    <td className="p-3">{review.comment}</td>
                    <td className="p-3">
                      {new Date(review.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-3 text-center">
                      <span
                        className={`px-2 py-1 rounded ${
                          review.status === "approved"
                            ? "bg-green-500 text-white"
                            : review.status === "rejected"
                            ? "bg-red-500 text-white"
                            : "bg-gray-300"
                        }`}
                      >
                        {review.status || "Pending"}
                      </span>
                    </td>
                    {review.status === "pending" ? (
                      <td className="p-3 flex justify-center gap-2">
                        <button
                          onClick={() =>
                            handleReviewStatus(
                              review.product_id,
                              review._id,
                              "approved"
                            )
                          }
                          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 flex items-center justify-center"
                        >
                          <FaCheck className="mr-2" /> Approve
                        </button>
                        <button
                          onClick={() =>
                            handleReviewStatus(
                              review.product_id,
                              review._id,
                              "rejected"
                            )
                          }
                          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 flex items-center justify-center"
                        >
                          <FaTimes className="mr-2" /> Reject
                        </button>
                      </td>
                    ) : (
                      <td className="p-3 flex justify-center gap-2">
                        <button
                          onClick={() => handleOpenModal(review)}
                          className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 flex items-center justify-center"
                        >
                          Change Status
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center text-gray-500 p-3">
                    No reviews found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <ReactPaginate
          previousLabel={"previous"}
          nextLabel={"next"}
          breakLabel={"..."}
          breakClassName={"break-me"}
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageClick}
          containerClassName={"pagination flex justify-center mt-4"}
          subContainerClassName={"pages pagination"}
          activeClassName={"active bg-blue-500 text-white"}
          pageClassName={"px-4 py-2 mx-1 border rounded cursor-pointer"}
          previousClassName={"px-4 py-2 mx-1 border rounded cursor-pointer"}
          nextClassName={"px-4 py-2 mx-1 border rounded cursor-pointer"}
          breakLinkClassName={"px-4 py-2 mx-1 border rounded cursor-pointer"}
        />
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md">
            <h2 className="text-lg font-semibold mb-4">Change Review Status</h2>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleModalApprove}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
              >
                Approve
              </button>
              <button
                onClick={handleModalReject}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                Reject
              </button>
              <button
                onClick={handleCloseModal}
                className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reviews;
