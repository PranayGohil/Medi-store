import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FaReply, FaTrash } from "react-icons/fa";
import LoadingSpinner from "../components/LoadingSpinner";
import { toast } from "react-toastify";

const ViewFeedbackDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [replyModal, setReplyModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");

  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_APP_API_URL}/api/feedback/single/${id}`
        );
        setFeedback(response.data.feedback);
      } catch (error) {
        console.error("Error fetching feedback:", error);
      } finally {
        setIsLoading(false);
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
      setIsLoading(true);
      const response = await axios.delete(
        `${import.meta.env.VITE_APP_API_URL}/api/feedback/delete/${id}`,
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
      notifySuccess("Feedback deleted successfully!");
      navigate("/feedbacks"); // Redirect to the feedback list
    } catch (error) {
      console.error("Error deleting feedback:", error);
      notifyError("Failed to delete feedback.");
    } finally {
      setDeleteModal(false);
      setIsLoading(false);
    }
  };

  if (!feedback || isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-8 bg-gray-100 flex justify-center">
      <div className="w-full max-w-8xl bg-white shadow-md p-6">
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

          <div className="flex gap-4 mt-10">
            {/* Reply Button */}
            <button
              onClick={handleReply}
              className="bg-blue-400 text-white px-8 py-3 hover:bg-blue-500 flex items-center justify-center"
            >
              <FaReply className="mr-2" /> Reply
            </button>

            {/* Delete Button */}
            <button
              onClick={handleDelete}
              className="bg-red-400 text-white px-8 py-3 hover:bg-red-500 flex items-center justify-center"
            >
              <FaTrash className="mr-2" /> Delete
            </button>
          </div>
        </div>
      </div>

      {/* Reply Modal */}
      {replyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
          <div className="bg-white p-6 shadow-lg w-full max-w-md rounded-lg">
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
              className="w-full p-3 border mb-4"
              rows="4"
              placeholder="Type your reply here..."
            ></textarea>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setReplyModal(false)}
                className="bg-gray-500 text-white px-4 py-3 hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={sendReply}
                className="bg-green-500 text-white px-4 py-3 hover:bg-green-600"
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
          <div className="bg-white p-6 shadow-lg w-full max-w-md rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
            <p className="text-gray-700 mb-4">
              Are you sure you want to delete this feedback?
            </p>
            <div className="flex justify-end gap-3 mt-10">
              <button
                onClick={() => setDeleteModal(false)}
                className="bg-gray-500 text-white px-4 py-3 hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={deleteFeedback}
                className="bg-red-400 text-white px-4 py-3 hover:bg-red-500"
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
