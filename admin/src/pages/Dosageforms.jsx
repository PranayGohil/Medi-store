import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaSearch, FaPlus } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";
import LoadingSpinner from "../components/LoadingSpinner";

const Dosageforms = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dosageforms, setDosageforms] = useState([]);
  const [selectedDosageform, setSelectedDosageform] = useState("");
  const [newDosageformName, setNewDosageformName] = useState("");
  const [deleteDosageformId, setDeleteDosageformId] = useState(null);
  const [deleteDosageformName, setDeleteDosageformName] = useState("");

  const [showNewDosageformsInput, setShowNewDosageformsInput] = useState(false);
  const [showAddDosageformModal, setShowAddDosageformModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredDosageforms, setFilteredosageforms] = useState([]);

  const fetchDosageforms = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_APP_API_URL}/api/dosageform/all`
      );
      setDosageforms(response.data);
    } catch (error) {
      console.error("Error fetching dosageforms:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDosageforms();
  }, []);

  useEffect(() => {
    const results = dosageforms.filter((dosageform) =>
      dosageform.dosageform.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredosageforms(results);
  }, [searchTerm, dosageforms]);

  const resetAllForms = () => {
    setSelectedDosageform("");
    setNewDosageformName("");
    setShowNewDosageformsInput(false);
    setShowAddDosageformModal(false);
    setSidebarOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Submitting dosageform:", newDosageformName);
    try {
      setIsLoading(true);
      if (showNewDosageformsInput) {
        // Add new dosageform
        const response = await axios.post(
          `${import.meta.env.VITE_APP_API_URL}/api/dosageform/add`,
          {
            dosageform: newDosageformName,
          },
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
      }

      // Refresh dosageforms after submission
      fetchDosageforms();

      // Reset form fields
      setNewDosageformName("");
      setSelectedDosageform("");
      setShowNewDosageformsInput(false);
      setShowAddDosageformModal(false);
      setSearchTerm("");
      setSidebarOpen(false);
    } catch (error) {
      console.error("Error adding dosageform:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenAddDosageformModal = () => {
    setSidebarOpen(true);
    setShowAddDosageformModal(true);
    setSelectedDosageform("");
    setShowNewDosageformsInput(true);
  };

  const handleCloseAddDosageformModal = () => {
    resetAllForms();
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const confirmDelete = async () => {
    try {
      setIsLoading(true);
      const response = await axios.delete(
        `${
          import.meta.env.VITE_APP_API_URL
        }/api/dosageform/remove/${deleteDosageformId}`,
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

      if (response.data.success === false) {
        toast.error(response.data.message);
      } else {
        toast.success("Dosageform deleted successfully");
        resetAllForms();
        fetchDosageforms();
      }
      setShowDeleteConfirmation(false);
      setDeleteDosageformId(null);
      setDeleteDosageformName("");
    } catch (error) {
      console.error("Error deleting dosageform:", error);
      toast.error("Failed to delete dosageform");
      setShowDeleteConfirmation(false);
    } finally {
      setIsLoading(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
    setDeleteDosageformId(null);
    setDeleteDosageformName("");
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }
  return (
    <div className="p-6 bg-gray-100">
      <div className="w-full mx-auto bg-white shadow-md p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold text-gray-800">
            Manage Dosage Forms
          </h1>

          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <div className="">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search dosage forms..."
                  className="input border p-3 w-full pr-10 rounded-none"
                  value={searchTerm}
                  onChange={handleSearch}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
              </div>
            </div>
            {/* Add Product Button */}
            {!showAddDosageformModal ? (
              <button
                className="flex items-center bg-blue-400 text-white py-3 px-4 hover:bg-blue-500 transition"
                onClick={handleOpenAddDosageformModal}
              >
                <FaPlus className="mr-2" /> Add Dosageform
              </button>
            ) : (
              <button
                className="flex items-center bg-gray-600 text-white py-3 px-6 hover:bg-gray-700 transition"
                onClick={handleCloseAddDosageformModal}
              >
                <b> ✕ </b> &nbsp; Close
              </button>
            )}
          </div>
        </div>

        <div className="w-full flex gap-4">
          <div className={`${sidebarOpen ? "w-1/2" : "w-full"} `}>
            <div className="p-4">
              <ul className="flex flex-wrap">
                {filteredDosageforms.length === 0 ? (
                  <p className="text-gray-500 text-center w-full mt-5">
                    No dosageforms found
                  </p>
                ) : (
                  filteredDosageforms.map((dosageform) => (
                    <li
                      key={dosageform._id}
                      className={`mb-2 p-2 ${sidebarOpen ? "w-1/2" : "w-1/3"} `}
                    >
                      <div className="bg-white border border-gray-300 p-4 flex justify-between items-center">
                        <div className="flex justify-between text-lg font-bold mb-3 text-gray-800 cursor-pointer">
                          {dosageform.dosageform}
                        </div>
                        <MdDelete
                          onClick={() => {
                            setShowDeleteConfirmation(true);
                            setDeleteDosageformId(dosageform._id);
                            setDeleteDosageformName(dosageform.dosageform);
                          }}
                        />
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>

          {/* Add Dosageform Modal */}
          {showAddDosageformModal && (
            <div className="md:w-1/2">
              <div className="flex flex-col h-full">
                <div className="bg-white p-4 border border-gray-300 mt-6 flex-grow">
                  <h2 className="text-xl font-semibold mb-4">
                    Add New Dosageform
                  </h2>
                  <form onSubmit={handleSubmit}>
                    <div>
                      <div>
                        <label className="label">
                          <span className="label-text">Dosageform Name</span>
                        </label>
                        <input
                          type="text"
                          className="input border p-3 w-full rounded-none"
                          placeholder="New Dosageform Name"
                          value={newDosageformName}
                          onChange={(e) => setNewDosageformName(e.target.value)}
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn bg-green-400 hover:bg-green-500 py-3 px-6 float-end text-white mt-2 rounded-none"
                    >
                      Submit
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Confirmation Modal */}
          {showDeleteConfirmation && (
            <div className="fixed top-0 left-0 z-50 inset-0 bg-black bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-6 shadow-lg">
                <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
                <p>Are you sure you want to delete this dosageform? </p>
                <p className="text-red-500 font-semibold text-center mt-3">
                  {deleteDosageformName}
                </p>
                <div className="flex justify-end mt-4">
                  <button
                    className="bg-gray-500 text-white px-4 py-3 mr-2 hover:bg-gray-600"
                    onClick={cancelDelete}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-red-400 text-white px-4 py-3 hover:bg-red-500"
                    onClick={confirmDelete}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dosageforms;
