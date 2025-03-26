import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaSearch,
  FaPlus,
  FaChevronDown,
  FaChevronUp,
  FaEdit,
} from "react-icons/fa";
import { TbLayoutNavbarExpand } from "react-icons/tb";
import { toast } from "react-toastify";
import LoadingSpinner from "../components/LoadingSpinner";

const CategoryManagement = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newSubcategories, setNewSubcategories] = useState([""]);
  const [newSpecialSubcategories, setNewSpecialSubcategories] = useState([]);

  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState("");
  const [editSubcategories, setEditSubcategories] = useState([]);
  const [editSpecialSubcategories, setEditSpecialSubcategories] = useState([]);
  const [editNavbarActive, setEditNavbarActive] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCategories, setFilteredCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_APP_API_URL}/api/category/all`
      );
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const results = categories.filter((category) =>
      category.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCategories(results);
  }, [searchTerm, categories]);

  const resetAllForms = () => {
    setSidebarOpen(false);
    setNewCategoryName("");
    setSelectedCategory("");
    setNewSubcategories([""]);
    setNewSpecialSubcategories([]);
    setShowNewCategoryInput(false);
    setShowAddCategoryModal(false);
    setShowEditCategoryModal(false);
    setExpandedCategories({});
    setEditCategoryId(null);
    setEditCategoryName("");
    setEditSubcategories([]);
    setEditSpecialSubcategories([]);
    setEditNavbarActive(false);
  };

  const handleCategoryChange = (event) => {
    const value = event.target.value;
    setSelectedCategory(value);
    setShowNewCategoryInput(value === "add-new-category");
  };

  const handleSubcategoryChange = (index, value) => {
    setNewSubcategories((prevSubcategories) => {
      const updatedSubcategories = [...prevSubcategories];
      updatedSubcategories[index] = value;
      return updatedSubcategories;
    });
  };

  const handleSpecialSubcategoryChange = (index, value) => {
    setNewSpecialSubcategories((prevSubcategories) => {
      const updatedSubcategories = [...prevSubcategories];
      updatedSubcategories[index] = value;
      return updatedSubcategories;
    });
  };

  const addSubcategoryField = () => {
    setNewSubcategories((prevSubcategories) => [...prevSubcategories, ""]);
  };

  const addSpecialSubcategoryField = () => {
    setNewSpecialSubcategories((prevSubcategories) => [
      ...prevSubcategories,
      "",
    ]);
  };

  const removeSubcategoryField = (index) => {
    setNewSubcategories((prevSubcategories) => {
      const updatedSubcategories = [...prevSubcategories];
      updatedSubcategories.splice(index, 1);
      return updatedSubcategories;
    });
  };

  const removeSpecialSubcategoryField = (index) => {
    setNewSpecialSubcategories((prevSubcategories) => {
      const updatedSubcategories = [...prevSubcategories];
      updatedSubcategories.splice(index, 1);
      return updatedSubcategories;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setIsLoading(true);
      if (showNewCategoryInput) {
        // Add new category with subcategories
        const response = await axios.post(
          `${import.meta.env.VITE_APP_API_URL}/api/category/add`,
          {
            category: newCategoryName,
            subcategory: newSubcategories,
            special_subcategory: newSpecialSubcategories,
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
      } else {
        // Add new subcategories to existing category
        const response = await axios.put(
          `${
            import.meta.env.VITE_APP_API_URL
          }/api/category/update/${selectedCategory}`,
          {
            subcategory: newSubcategories,
            special_subcategory: newSpecialSubcategories,
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

      // Refresh categories after submission
      fetchCategories();

      // Reset form fields
      setNewCategoryName("");
      setNewSubcategories([""]);
      setNewSpecialSubcategories([]);
      setSelectedCategory("");
      setShowNewCategoryInput(false);
      setShowAddCategoryModal(false);
      setSidebarOpen(false);
    } catch (error) {
      console.error("Error adding category/subcategory:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenAddCategoryModal = () => {
    setSidebarOpen(true);
    setShowAddCategoryModal(true);
    setShowEditCategoryModal(false); // Close edit modal if open
    setSelectedCategory("");
    setShowNewCategoryInput(true);
  };

  const handleCloseAddCategoryModal = () => {
    resetAllForms();
  };

  const toggleCategoryExpansion = (categoryId) => {
    setExpandedCategories((prevExpanded) => ({
      ...prevExpanded,
      [categoryId]: !prevExpanded[categoryId],
    }));
  };

  const handleEditCategory = (categoryId, navbar_active) => {
    const categoryToEdit = categories.find((cat) => cat._id === categoryId);
    if (categoryToEdit) {
      setSidebarOpen(true);
      setEditCategoryId(categoryId);
      setEditCategoryName(categoryToEdit.category);
      setEditSubcategories([...categoryToEdit.subcategory]);
      setEditSpecialSubcategories([...categoryToEdit.special_subcategory]);
      setShowAddCategoryModal(false); // Close add modal if open
      setShowEditCategoryModal(true);
    }
  };

  const handleCloseEditCategoryModal = () => {
    resetAllForms();
  };

  const handleEditSubcategoryChange = (index, value) => {
    setEditSubcategories((prevSubcategories) => {
      const updatedSubcategories = [...prevSubcategories];
      updatedSubcategories[index] = value;
      return updatedSubcategories;
    });
  };

  const handleEditSpecialSubcategoryChange = (index, value) => {
    setEditSpecialSubcategories((prevSubcategories) => {
      const updatedSubcategories = [...prevSubcategories];
      updatedSubcategories[index] = value;
      return updatedSubcategories;
    });
  };

  const addEditSubcategoryField = () => {
    setEditSubcategories((prevSubcategories) => [...prevSubcategories, ""]);
  };

  const addEditSpecialSubcategoryField = () => {
    setEditSpecialSubcategories((prevSubcategories) => [
      ...prevSubcategories,
      "",
    ]);
  };

  const removeEditSubcategoryField = (index) => {
    setEditSubcategories((prevSubcategories) => {
      const updatedSubcategories = [...prevSubcategories];
      updatedSubcategories.splice(index, 1);
      return updatedSubcategories;
    });
  };

  const removeEditSpecialSubcategoryField = (index) => {
    setEditSpecialSubcategories((prevSubcategories) => {
      const updatedSubcategories = [...prevSubcategories];
      updatedSubcategories.splice(index, 1);
      return updatedSubcategories;
    });
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();

    try {
      setIsLoading(true);
      const response = await axios.put(
        `${
          import.meta.env.VITE_APP_API_URL
        }/api/category/update/${editCategoryId}`,
        {
          category: editCategoryName,
          subcategory: editSubcategories,
          special_subcategory: editSpecialSubcategories,
          navbar_active: editNavbarActive,
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
      fetchCategories();
      handleCloseEditCategoryModal();
    } catch (error) {
      console.error("Error updating category:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleDeleteClick = (categoryId) => {
    setEditCategoryId(categoryId);
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = async () => {
    try {
      setIsLoading(true);
      const response = await axios.delete(
        `${
          import.meta.env.VITE_APP_API_URL
        }/api/category/remove/${editCategoryId}`,
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
        toast.success("Category deleted successfully");
        resetAllForms();
        fetchCategories();
      }
      setShowDeleteConfirmation(false);
      setEditCategoryId(null);
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category");
      setShowDeleteConfirmation(false);
    } finally {
      setIsLoading(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
    setEditCategoryId(null);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-6 bg-gray-100">
      <div className="w-full mx-auto bg-white shadow-md p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold text-gray-800">Products</h1>

          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <div className="">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search categories..."
                  className="input input-bordered w-full pr-10 rounded-none"
                  value={searchTerm}
                  onChange={handleSearch}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
              </div>
            </div>
            {/* Add Product Button */}
            {!showAddCategoryModal ? (
              <button
                className="flex items-center bg-blue-400 text-white py-3 px-4 hover:bg-blue-500 transition"
                onClick={handleOpenAddCategoryModal}
              >
                <FaPlus className="mr-2" /> Add Category
              </button>
            ) : (
              <button
                className="flex items-center bg-gray-600 text-white py-3 px-6 hover:bg-gray-700 transition"
                onClick={handleCloseAddCategoryModal}
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
                {filteredCategories.map((category) => (
                  <li
                    key={category._id}
                    className={`mb-2 p-2 ${sidebarOpen ? "w-1/2" : "w-1/3"} `}
                  >
                    <div className="bg-white border border-gray-300 p-4 ">
                      <div
                        className="flex justify-between text-lg font-bold mb-3 text-gray-800 cursor-pointer"
                        onClick={() => toggleCategoryExpansion(category._id)}
                      >
                        {category.category}
                        <div className="flex items-center">
                          {category.navbar_active && (
                            <TbLayoutNavbarExpand className="mx-2 bg-green-500 rounded-md p-1" />
                          )}
                          {expandedCategories[category._id] ? (
                            <FaChevronUp className="ml-2" />
                          ) : (
                            <FaChevronDown className="ml-2" />
                          )}
                        </div>
                      </div>
                      {expandedCategories[category._id] && (
                        <div>
                          <ul className="pl-10 mt-2 list-disc">
                            {category.subcategory.map((subcategory, index) => (
                              <li
                                key={index}
                                className="text-base text-gray-600"
                              >
                                {subcategory}
                              </li>
                            ))}
                            {category.special_subcategory.map(
                              (special_subcategory, index) => (
                                <li
                                  key={index}
                                  className="text-base text-green-600"
                                >
                                  {special_subcategory}
                                </li>
                              )
                            )}
                          </ul>
                          <div className="flex justify-end">
                            <button
                              className="flex items-center bg-blue-400 text-white mt-3 py-2 px-6 hover:bg-blue-500 transition"
                              onClick={() => {
                                handleEditCategory(category._id);
                                if (category.navbar_active) {
                                  setEditNavbarActive(true);
                                } else {
                                  setEditNavbarActive(false);
                                }
                              }}
                            >
                              <FaEdit className="mr-2" /> Edit
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Add Category Modal */}
          {showAddCategoryModal && (
            <div className="md:w-1/2">
              <div className="flex flex-col h-full">
                <div className="bg-white p-4 border border-gray-300 mt-6 flex-grow">
                  <h2 className="text-xl font-semibold mb-4">
                    Add New Category
                  </h2>
                  <form onSubmit={handleSubmit}>
                    <div>
                      <div>
                        <label className="label">
                          <span className="label-text">Category Name</span>
                        </label>
                        <input
                          type="text"
                          className="input input-bordered w-full rounded-none"
                          placeholder="New Category Name"
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                        />
                      </div>

                      {/* Subcategory fields */}
                      <label className="label">
                        <span className="label-text">Subcategory</span>
                      </label>
                      {newSubcategories.map((subcategory, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                          <input
                            type="text"
                            placeholder="New Subcategory Name"
                            className="input input-bordered w-full rounded-none"
                            value={subcategory}
                            onChange={(e) =>
                              handleSubcategoryChange(index, e.target.value)
                            }
                          />
                          <button
                            type="button"
                            className="btn btn-error text-white rounded-none"
                            onClick={() => removeSubcategoryField(index)}
                          >
                            Remove
                          </button>
                        </div>
                      ))}

                      {/* Add more subcategories button */}
                      <button
                        type="button"
                        className="btn bg-blue-400 hover:bg-blue-500 text-white mt-2 w-full rounded-none"
                        onClick={addSubcategoryField}
                      >
                        Add More Subcategories
                      </button>

                      {/* Special Subcategory fields */}
                      {newSpecialSubcategories.length > 0 && (
                        <label className="label">
                          <span className="label-text">
                            Special Subcategory
                          </span>
                        </label>
                      )}
                      {newSpecialSubcategories.map((subcategory, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                          <input
                            type="text"
                            placeholder="Special Subcategory Name"
                            className="input input-bordered w-full rounded-none"
                            value={subcategory}
                            onChange={(e) =>
                              handleSpecialSubcategoryChange(
                                index,
                                e.target.value
                              )
                            }
                          />
                          <button
                            type="button"
                            className="btn btn-error text-white rounded-none"
                            onClick={() => removeSpecialSubcategoryField(index)}
                          >
                            Remove
                          </button>
                        </div>
                      ))}

                      {/* Add more subcategories button */}
                      <button
                        type="button"
                        className="btn bg-blue-400 hover:bg-blue-500 text-white mt-2 w-full rounded-none"
                        onClick={addSpecialSubcategoryField}
                      >
                        Add Special Subcategories
                      </button>
                    </div>

                    <button
                      type="submit"
                      className="btn bg-green-400 hover:bg-green-500 float-end text-white mt-2 rounded-none"
                    >
                      Submit
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Edit Category Modal */}
          {showEditCategoryModal && (
            <div className="md:w-1/2">
              <div className="flex flex-col h-full">
                <div className="bg-white p-4 border border-gray-300 mt-6 flex-grow">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Edit Category</h2>
                    <button
                      className="btn btn-sm btn-circle bg-gray-500 text-white"
                      onClick={handleCloseEditCategoryModal}
                    >
                      ✕
                    </button>
                  </div>

                  <form onSubmit={handleEditSubmit}>
                    <div className="form-control mb-4">
                      <label className="label">
                        <span className="label-text">Category Name</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Category Name"
                        className="input input-bordered w-full rounded-none"
                        value={editCategoryName}
                        onChange={(e) => setEditCategoryName(e.target.value)}
                      />
                    </div>

                    {/* Subcategory fields */}
                    <div className="form-control mb-4">
                      <label className="label">
                        <span className="label-text">Subcategories</span>
                      </label>
                      {editSubcategories.map((subcategory, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                          <input
                            type="text"
                            placeholder="Subcategory Name"
                            className="input input-bordered w-full rounded-none"
                            value={subcategory}
                            onChange={(e) =>
                              handleEditSubcategoryChange(index, e.target.value)
                            }
                          />
                          <button
                            type="button"
                            className="btn btn-error text-white  rounded-none"
                            onClick={() => removeEditSubcategoryField(index)}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        className="btn bg-blue-400 hover:bg-blue-500 text-white mt-2 w-full rounded-none"
                        onClick={addEditSubcategoryField}
                      >
                        Add More Subcategories
                      </button>
                      <label className="label mt-5">
                        <span className="label-text">
                          Special Subcategories
                        </span>
                      </label>
                      {editSpecialSubcategories.map((subcategory, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                          <input
                            type="text"
                            placeholder="Special Subcategory Name"
                            className="input input-bordered w-full rounded-none"
                            value={subcategory}
                            onChange={(e) =>
                              handleEditSpecialSubcategoryChange(
                                index,
                                e.target.value
                              )
                            }
                          />
                          <button
                            type="button"
                            className="btn btn-error text-white  rounded-none"
                            onClick={() =>
                              removeEditSpecialSubcategoryField(index)
                            }
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        className="btn bg-blue-400 hover:bg-blue-500 text-white mt-2 w-full rounded-none"
                        onClick={addEditSpecialSubcategoryField}
                      >
                        Add Special Subcategories
                      </button>
                      <button
                        type="button"
                        className="btn bg-red-400 hover:bg-red-500 text-white mt-2 w-full rounded-none"
                        onClick={() => handleDeleteClick(editCategoryId)}
                      >
                        Remove Category
                      </button>
                      <div>
                        <input
                          type="checkbox"
                          className="mr-2 mt-3"
                          id="editNavbarActive"
                          checked={editNavbarActive}
                          onChange={(e) =>
                            setEditNavbarActive(e.target.checked)
                          }
                        />
                        <label htmlFor="editNavbarActive">Show in Navbar</label>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn bg-blue-400 hover:bg-blue-500 text-white mt-2 float-end rounded-none"
                    >
                      Save Changes
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Confirmation Modal */}
          {showDeleteConfirmation && (
            <div className="fixed top-0 left-0 z-50 inset-0 bg-black bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
                <p>Are you sure you want to delete this category? </p>
                <h2 className="text-lg text-center font-bold mb-4">
                  {" "}
                  {editCategoryName}{" "}
                </h2>
                <div className="flex justify-end mt-4">
                  <button
                    className="bg-gray-500 text-white px-4 py-2 rounded mr-2 hover:bg-gray-600"
                    onClick={cancelDelete}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
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

export default CategoryManagement;
