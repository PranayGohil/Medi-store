import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import ReactPaginate from "react-paginate";
import LoadingSpinner from "../components/LoadingSpinner";

const Users = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [users, setUsers] = useState([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const usersPerPage = 10;

  // Sorting
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const notifyError = (message) => toast.error(message);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_APP_API_URL}/api/user/get-all-users`,
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
      const sortedUsers = response.data.users.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      setUsers(sortedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      notifyError("Failed to fetch users");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter Users
  const filteredUsers = users.filter(
    (user) =>
      (user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.phone.includes(searchQuery)) &&
      (statusFilter === "" || user.status === statusFilter)
  );

  // Sort Users
  const sortedUsers = [...filteredUsers].sort((a, b) => {
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

  // Pagination Logic
  const offset = currentPage * usersPerPage;
  const currentPageUsers = sortedUsers.slice(offset, offset + usersPerPage);

  // Handle Page Change
  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  // Handle Sorting
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-8 bg-gray-100">
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
                <th
                  className="p-3 text-left cursor-pointer"
                  onClick={() => handleSort("first_name")}
                >
                  First Name
                  {sortConfig.key === "first_name" &&
                    (sortConfig.direction === "asc" ? (
                      <FaSortUp />
                    ) : (
                      <FaSortDown />
                    ))}
                </th>
                <th
                  className="p-3 text-left cursor-pointer"
                  onClick={() => handleSort("last_name")}
                >
                  Last Name
                  {sortConfig.key === "last_name" &&
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
                <th
                  className="p-3 text-left cursor-pointer"
                  onClick={() => handleSort("created_at")}
                >
                  Registered At
                  {sortConfig.key === "created_at" &&
                    (sortConfig.direction === "asc" ? (
                      <FaSortUp />
                    ) : (
                      <FaSortDown />
                    ))}
                </th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentPageUsers.length > 0 ? (
                currentPageUsers.map((user) => (
                  <tr key={user._id} className="border-b">
                    <td className="p-3">{user.first_name}</td>
                    <td className="p-3">{user.last_name}</td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3">{user.phone}</td>
                    <td className="p-3">
                      {new Date(user.created_at).toLocaleDateString()}{" "}
                      {new Date(user.created_at).toLocaleTimeString()}
                    </td>
                    <td className="p-3">
                      <Link
                        to={`/user/user-details/${user._id}`}
                        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center text-gray-500 p-3">
                    No users found
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
          pageCount={Math.ceil(filteredUsers.length / usersPerPage)}
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

export default Users;
