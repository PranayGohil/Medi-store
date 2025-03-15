import { useState, useEffect } from "react";
import { FaSearch, FaTrashAlt, FaStar, FaCheck, FaTimes } from "react-icons/fa";
import axios from "axios";

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");

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

        // Fetch user data for all reviews in parallel
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

        setReviews(reviewsWithUserInfo);
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
        }/api/product//change-review-status/${productId}/${reviewId}`,
        {
          status,
        }
      );
      fetchReviews(); // Refresh reviews after update
    } catch (error) {
      console.error("Error updating review:", error);
    }
  };

  // Filter reviews based on search & rating
  const filteredReviews = reviews.filter(
    (review) =>
      (review.user_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.product_name
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        review.comment?.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (ratingFilter === "" || review.rating === parseInt(ratingFilter))
  );

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="w-full mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">
          Product Reviews
        </h1>

        {/* Search & Filter Bar */}
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

        {/* Reviews Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white shadow-md rounded-md">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="p-3 text-left">User Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Phone</th>
                <th className="p-3 text-left">Product</th>
                <th className="p-3 text-left">Rating</th>
                <th className="p-3 text-left">Comment</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReviews.length > 0 ? (
                filteredReviews.map((review) => (
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
                      <>
                        <td className="p-3 flex justify-center gap-2">
                          <button className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 flex items-center justify-center">
                            Change Status
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center text-gray-500 p-3">
                    No reviews found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reviews;
