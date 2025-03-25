import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaSearch,
  FaReply,
  FaSort,
  FaSortUp,
  FaSortDown,
} from "react-icons/fa";
import { toast } from "react-toastify";
import ReactPaginate from "react-paginate";
import LoadingSpinner from "../components/LoadingSpinner";

const Feedbacks = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [replyModal, setReplyModal] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [feedbacks, setFeedbacks] = useState([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const feedbacksPerPage = 10;

  // Sorting
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);

  const fetchFeedbacks = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_APP_API_URL}/api/feedback/all`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (
        response.data.success === false &&
        response.data.message === "Unauthorized"
      ) {
        toast.error(response.data.message);
        navigate("/login");
        return;
      }
      const sortedFeedbacks = response.data.feedbacks.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      setFeedbacks(sortedFeedbacks);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  // Filtered feedbacks based on search query
  const filteredFeedbacks = feedbacks.filter((feedback) =>
    ["first_name", "last_name", "email", "feedback"].some((key) =>
      feedback[key]?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // Sort Feedbacks
  const sortedFeedbacks = [...filteredFeedbacks].sort((a, b) => {
    if (sortConfig.key) {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
    }
    return 0;
  });

  // Pagination: Get current page's feedbacks
  const offset = currentPage * feedbacksPerPage;
  const currentPageFeedbacks = sortedFeedbacks.slice(
    offset,
    offset + feedbacksPerPage
  );

  // Handle page change
  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  // Handle sorting
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Open reply modal
  const handleReply = (feedback) => {
    setSelectedFeedback(feedback);
    setReplyMessage("");
    setReplyModal(true);
  };

  // Send reply function
  const sendReply = () => {
    if (!replyMessage.trim()) {
      notifyError("Reply message cannot be empty!");
      return;
    }

    notifySuccess(
      `Reply sent to ${selectedFeedback.email}: \n\n"${replyMessage}"`
    );
    setReplyModal(false);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-8 bg-gray-100">
      <div className="w-full mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">Feedbacks</h1>

        {/* Search Bar */}
        <div className="relative w-full md:w-1/3 mb-6">
          <input
            type="text"
            placeholder="Search by Name, Email, or Message"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 pl-10 border rounded-md"
          />
          <FaSearch className="absolute top-3 left-3 text-gray-500" />
        </div>

        {/* Feedback Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white shadow-md rounded-md">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th
                  className="p-3 text-left cursor-pointer"
                  onClick={() => handleSort("first_name")}
                >
                  Name
                  {sortConfig.key === "first_name" &&
                    (sortConfig.direction === "asc" ? (
                      <FaSortUp />
                    ) : (
                      <FaSortDown />
                    ))}
                </th>
                <th
                  className="p-3 text-left cursor-pointer"
                  onClick={() => handleSort("email")}
                >
                  Email
                  {sortConfig.key === "email" &&
                    (sortConfig.direction === "asc" ? (
                      <FaSortUp />
                    ) : (
                      <FaSortDown />
                    ))}
                </th>
                <th className="p-3 text-left">Phone</th>
                <th className="p-3 text-left">Message</th>
                <th
                  className="p-3 text-left cursor-pointer"
                  onClick={() => handleSort("created_at")}
                >
                  Date
                  {sortConfig.key === "created_at" &&
                    (sortConfig.direction === "asc" ? (
                      <FaSortUp />
                    ) : (
                      <FaSortDown />
                    ))}
                </th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentPageFeedbacks.length > 0 ? (
                currentPageFeedbacks.map((feedback) => (
                  <tr key={feedback._id} className="border-b">
                    <td className="p-3">
                      {feedback.first_name} {feedback.last_name}
                    </td>
                    <td className="p-3">{feedback.email}</td>
                    <td className="p-3">{feedback.phone}</td>
                    <td className="p-3">
                      {feedback.feedback.length > 40
                        ? `${feedback.feedback.substring(0, 40)}...`
                        : feedback.feedback}
                    </td>
                    <td className="p-3">
                      {new Date(feedback.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-3 text-center flex justify-center gap-2">
                      <Link to={`/feedback-details/${feedback._id}`}>
                        <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                          View
                        </button>
                      </Link>
                      <button
                        onClick={() => handleReply(feedback)}
                        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 flex items-center"
                      >
                        <FaReply className="mr-2" /> Reply
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center text-gray-500 p-3">
                    No feedbacks found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <ReactPaginate
          previousLabel={"← Previous"}
          nextLabel={"Next →"}
          breakLabel={"..."}
          breakClassName={"break-me"}
          pageCount={Math.ceil(filteredFeedbacks.length / feedbacksPerPage)}
          marginPagesDisplayed={2}
          pageRangeDisplayed={3}
          onPageChange={handlePageChange}
          containerClassName={"pagination flex justify-center mt-4"}
          subContainerClassName={"pages pagination"}
          activeClassName={"active bg-blue-500 text-white"}
          pageClassName={"px-4 py-2 mx-1 border rounded cursor-pointer"}
          previousClassName={"px-4 py-2 mx-1 border rounded cursor-pointer"}
          nextClassName={"px-4 py-2 mx-1 border rounded cursor-pointer"}
          breakLinkClassName={"px-4 py-2 mx-1 border rounded cursor-pointer"}
        />
      </div>
    </div>
  );
};

export default Feedbacks;
