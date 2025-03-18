import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaSearch, FaReply } from "react-icons/fa";
import { toast } from "react-toastify";

const Feedbacks = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [replyModal, setReplyModal] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [feedbacks, setFeedbacks] = useState([]);

  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);

  const fetchFeedbacks = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_API_URL}/api/feedback/all`
      );
      console.log("Data : ", response.data.feedbacks);
      // Sort feedbacks by created_at (newest first)
      const sortedFeedbacks = response.data.feedbacks.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      setFeedbacks(sortedFeedbacks);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  });
  
  // Filtered feedbacks
  const filteredFeedbacks = feedbacks.filter(
    (feedback) =>
      feedback.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feedback.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feedback.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feedback.feedback.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Open reply modal
  const handleReply = (feedback) => {
    setSelectedFeedback(feedback);
    setReplyMessage(""); // Reset reply message
    setReplyModal(true);
  };

  // Send reply function
  const sendReply = () => {
    if (!replyMessage.trim()) {
      notifyError("Reply message cannot be empty!");
      return;
    }

    notifySuccess(`Reply sent to ${selectedFeedback.email}: \n\n"${replyMessage}"`);
    setReplyModal(false);
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
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
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Phone</th>
                <th className="p-3 text-left">Message</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredFeedbacks.length > 0 ? (
                filteredFeedbacks.map((feedback) => (
                  <tr key={feedback.id} className="border-b">
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
                          View Full Details
                        </button>
                      </Link>
                      <button
                        onClick={() => handleReply(feedback)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center justify-center"
                      >
                        <FaReply className="mr-2" /> Reply
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center text-gray-500 p-3">
                    No feedbacks found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reply Modal */}
      {replyModal && selectedFeedback && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
          <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              Reply to {selectedFeedback.first_name}{" "}
              {selectedFeedback.last_name}
            </h2>
            <p className="text-gray-700 mb-2">
              Email: {selectedFeedback.email}
            </p>
            <p className="text-gray-700 mb-4">
              Message: {selectedFeedback.feedback}
            </p>
            <textarea
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              className="w-full p-3 border rounded-md mb-4"
              rows="4"
              placeholder="Type your reply here..."
            ></textarea>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setReplyModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={sendReply}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
              >
                Send Reply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Feedbacks;
