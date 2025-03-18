import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import LoadingSpinner from "../components/LoadingSpinner";
import ReactPaginate from "react-paginate";

const Users = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [users, setUsers] = useState([]);

  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_API_URL}/api/user/get-all-users`
      );
      // Sort Users by created_at (newest first)
      const sortedUsers = response.data.users.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      setUsers(sortedUsers);
      console.log("Data : ", sortedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);
  // Sample Users Data
  // const users = [
  //   {
  //     id: 1,
  //     name: "John Doe",
  //     email: "john.doe@example.com",
  //     phone: "+91 8345678901",
  //     registeredAt: "2025-02-20",
  //     status: "Active",
  //   },
  //   {
  //     id: 2,
  //     name: "Jane Smith",
  //     email: "jane.smith@example.com",
  //     phone: "+91 7894567123",
  //     registeredAt: "2025-02-22",
  //     status: "Inactive",
  //   },
  //   {
  //     id: 3,
  //     name: "Alice Brown",
  //     email: "alice.brown@example.com",
  //     phone: "+91 9876543210",
  //     registeredAt: "2025-02-25",
  //     status: "Active",
  //   },
  // ];

  // Filter Users
  const filteredUsers = users.filter((user) => {
    return (
      (user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.phone.includes(searchQuery)) &&
      (statusFilter === "" || user.status === statusFilter)
    );
  });

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="w-full mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">Users</h1>

        {/* Search & Filter Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          {/* Search Input */}
          <div className="relative w-full md:w-1/3">
            <input
              type="text"
              placeholder="Search by Name, Email, or Phone"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-3 pl-10 border rounded-md"
            />
            <FaSearch className="absolute top-3 left-3 text-gray-500" />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full md:w-1/4 p-3 border rounded-md"
          >
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white shadow-md rounded-md">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="p-3 text-left">First Name</th>
                <th className="p-3 text-left">Last Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Phone</th>
                <th className="p-3 text-left">Registered At</th>
                {/* <th className="p-3 text-left">Status</th> */}
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b">
                    <td className="p-3">{user.first_name}</td>
                    <td className="p-3">{user.last_name}</td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3">{user.phone}</td>
                    <td className="p-3">{new Date(user.created_at).getDate() + "-" + new Date(user.created_at).getMonth() + "-" + new Date(user.created_at).getFullYear()} - {new Date(user.created_at).getHours() + ":" + new Date(user.created_at).getMinutes() + ":" + new Date(user.created_at).getSeconds()}</td>
                    <td className="p-3">
                      <Link to={`/user/user-details/${user._id}`} className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center text-gray-500 p-3">
                    No users found
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

export default Users;
