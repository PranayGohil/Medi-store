import { useState } from "react";
import { FaSearch, FaTrashAlt, FaStar } from "react-icons/fa";

const Reviews = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");

  // Sample reviews data
  const reviews = [
    {
      id: 1,
      user: "John Doe",
      product: "Paracetamol 500mg",
      rating: 5,
      comment: "Works great for fever relief!",
      date: "2025-02-24",
    },
    {
      id: 2,
      user: "Jane Smith",
      product: "Vitamin C Tablets",
      rating: 4,
      comment: "Good quality, but packaging could be better.",
      date: "2025-02-25",
    },
    {
      id: 3,
      user: "Alice Brown",
      product: "Cough Syrup",
      rating: 2,
      comment: "Didn't work well for me.",
      date: "2025-02-26",
    },
  ];

  // Filtered reviews based on search & rating
  const filteredReviews = reviews.filter(
    (review) =>
      (review.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.comment.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (ratingFilter === "" || review.rating === parseInt(ratingFilter))
  );

  // Handle review deletion
  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this review?");
    if (confirmDelete) {
      alert(`Review ${id} deleted!`);
      // Here, implement actual delete logic (e.g., API call)
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="w-full mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">Product Reviews</h1>

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Search Input */}
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

          {/* Rating Filter */}
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
                <th className="p-3 text-left">User</th>
                <th className="p-3 text-left">Product</th>
                <th className="p-3 text-left">Rating</th>
                <th className="p-3 text-left">Comment</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredReviews.length > 0 ? (
                filteredReviews.map((review) => (
                  <tr key={review.id} className="border-b">
                    <td className="p-3">{review.user}</td>
                    <td className="p-3">{review.product}</td>
                    <td className="p-3 flex items-center">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <FaStar key={i} className="text-yellow-500" />
                      ))}
                    </td>
                    <td className="p-3">{review.comment}</td>
                    <td className="p-3">{review.date}</td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleDelete(review.id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 flex items-center justify-center"
                      >
                        <FaTrashAlt className="mr-2" /> Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center text-gray-500 p-3">
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
