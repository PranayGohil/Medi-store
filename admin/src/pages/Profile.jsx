import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import LoadingSpinner from "../components/LoadingSpinner";

const Profile = () => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState({
    username: "",
    email: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [password, setPassword] = useState("");

  // Fetch Admin Profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.VITE_APP_API_URL}/api/admin/profile`,
          {
            headers: { Authorization: `Bearer ${token}` },
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

        const { username, email } = response.data.admin;
        setAdmin({ username, email });
        setNewUsername(username);
        setNewEmail(email);
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to fetch profile");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Handle Edit Profile
  const handleUpdate = async () => {
    if (!password.trim()) {
      toast.error("Password is required for updating profile");
      return;
    }
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${import.meta.env.VITE_APP_API_URL}/api/admin/profile`,
        { username: newUsername, email: newEmail, password },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(response.data);

      if (
        response.data.success === false &&
        response.data.message === "Unauthorized"
      ) {
        toast.error(response.data.message);
        navigate("/login");
        return;
      }
      toast.success("Profile updated successfully");
      setAdmin(response.data.admin);
      setEditMode(false);
      setPassword("");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    toast.success("Logged out successfully");
  };

  // Navigate to Forgot Password with State
  const handleForgotPassword = () => {
    navigate("/forgot-password", { state: { email: admin.email } });
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-8 bg-gray-100">
      <div className="w-full max-w-8xl mx-auto bg-white shadow-md p-6">
        <h1 className="text-3xl font-semibold mb-6">Admin Profile</h1>

        <div className="flex mb-4">
          <label className="block text-gray-700 mx-3">Username:</label>
          {editMode ? (
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="p-2 border"
            />
          ) : (
            <p>{admin.username}</p>
          )}
        </div>

        <div className="flex mb-4">
          <label className="block text-gray-700 mx-3">Email:</label>
          {editMode ? (
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="p-2 border"
            />
          ) : (
            <p>{admin.email}</p>
          )}
        </div>

        {/* Forgot Password Button */}
        <div className="flex mb-4">
          {editMode ? (
            <div className="flex mb-4">
              <label className="block text-gray-700 mx-3">
                Password (required):
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="p-2 border"
              />
            </div>
          ) : (
            <button
              onClick={handleForgotPassword}
              className="text-blue-500 hover:underline mx-3"
            >
              Forgot Password?
            </button>
          )}
        </div>

        <div className="flex gap-7 mt-6">
          {editMode ? (
            <>
              <button
                onClick={handleUpdate}
                className="bg-blue-500 text-white px-4 py-3 hover:bg-blue-600"
              >
                Save Changes
              </button>
              <button
                onClick={() => setEditMode(false)}
                className="bg-gray-500 text-white px-4 py-3 hover:bg-gray-600"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setEditMode(true)}
                className="bg-yellow-500 text-white px-4 py-3 hover:bg-yellow-600"
              >
                Edit Profile
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-3 hover:bg-red-600"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
