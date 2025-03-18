import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FaReply, FaTrash } from "react-icons/fa";
import LoadingSpinner from "../components/LoadingSpinner";
import { toast } from "react-toastify";

const ViewFeedbackDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [feedback, setFeedback] = useState(null);
  const [replyModal, setReplyModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");

  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_API_URL}/api/feedback/single/${id}`
        );
        setFeedback(response.data.feedback);
      } catch (error) {
        console.error("Error fetching feedback:", error);
      }
    };

    fetchFeedback();
  }, [id]);

  // Open reply modal
  const handleReply = () => {
    setReplyMessage(""); // Reset reply message
    setReplyModal(true);
  };

  // Open delete confirmation modal
  const handleDelete = () => {
    setDeleteModal(true);
  };

  // Send reply function
  const sendReply = () => {
    if (!replyMessage.trim()) {
      notifyError("Reply message cannot be empty!");
      return;
    }

    notifySuccess(`Reply sent to ${feedback.email}: \n\n"${replyMessage}"`);
    setReplyModal(false);
  };

  // Delete feedback function
  const deleteFeedback = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_APP_API_URL}/api/feedback/delete/${id}`
      );
      notifySuccess("Feedback deleted successfully!");
      navigate("/feedbacks"); // Redirect to the feedback list
    } catch (error) {
      console.error("Error deleting feedback:", error);
      notifyError("Failed to delete feedback.");
    } finally {
      setDeleteModal(false);
    }
  };

  if (!feedback) return <p className="text-center">Loading...</p>;

  return (
    <div className="p-8 bg-gray-100 min-h-screen flex justify-center">
      <div className="w-full max-w-8xl bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-semibold mb-4">Feedback Details</h1>
        <hr className="mb-4" />
        <div className="p-4">
          <p className="mb-4">
            <strong>Name:</strong> {feedback.first_name} {feedback.last_name}
          </p>
          <p className="mb-4">
            <strong>Email:</strong> {feedback.email}
          </p>
          <p className="mb-4">
            <strong>Phone:</strong> {feedback.phone || "N/A"}
          </p>
          <p className="mb-4">
            <strong>Message:</strong> {feedback.feedback}
          </p>
          <p className="mb-4">
            <strong>Date:</strong>{" "}
            {new Date(feedback.created_at).toLocaleDateString()}
          </p>

          <div className="flex gap-4">
            {/* Reply Button */}
            <button
              onClick={handleReply}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center justify-center"
            >
              <FaReply className="mr-2" /> Reply
            </button>

            {/* Delete Button */}
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 flex items-center justify-center"
            >
              <FaTrash className="mr-2" /> Delete
            </button>
          </div>
        </div>
      </div>

      {/* Reply Modal */}
      {replyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
          <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              Reply to {feedback.first_name} {feedback.last_name}
            </h2>
            <p className="text-gray-700 mb-2">
              <b>Email: </b>
              {feedback.email}
            </p>
            <p className="text-gray-700 mb-4">
              <b>Message: </b>
              {feedback.feedback}
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

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
          <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
            <p className="text-gray-700 mb-4">
              Are you sure you want to delete this feedback?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={deleteFeedback}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewFeedbackDetail;
