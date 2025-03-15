import React, { useState, useEffect } from "react";
import axios from "axios";

import {
  FaSearch,
  FaPlus,
  FaChevronDown,
  FaChevronUp,
  FaEdit,
  FaThLarge,
  FaList,
} from "react-icons/fa";

const CategoryManagement = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newSubcategories, setNewSubcategories] = useState([""]);

  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false);

  const [expandedCategories, setExpandedCategories] = useState({});
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState("");
  const [editSubcategories, setEditSubcategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_API_URL}/api/category/all`
      );
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  });

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

  const addSubcategoryField = () => {
    setNewSubcategories((prevSubcategories) => [...prevSubcategories, ""]);
  };

  const removeSubcategoryField = (index) => {
    setNewSubcategories((prevSubcategories) => {
      const updatedSubcategories = [...prevSubcategories];
      updatedSubcategories.splice(index, 1);
      return updatedSubcategories;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (showNewCategoryInput) {
        // Add new category with subcategories
        await axios.post(
          `${import.meta.env.VITE_APP_API_URL}/api/category/add`,
          {
            category: newCategoryName,
            subcategory: newSubcategories,
          }
        );
      } else {
        // Add new subcategories to existing category
        await axios.put(
          `${
            import.meta.env.VITE_APP_API_URL
          }/api/category/update/${selectedCategory}`,
          { subcategory: newSubcategories }
        );
      }

      // Refresh categories after submission
      fetchCategories();

      // Reset form fields
      setNewCategoryName("");
      setNewSubcategories([""]);
      setSelectedCategory("");
      setShowNewCategoryInput(false);
    } catch (error) {
      console.error("Error adding category/subcategory:", error);
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
    setSidebarOpen(false);
    setShowAddCategoryModal(false);
    setSelectedCategory("");
    setShowNewCategoryInput(false);
    setNewCategoryName("");
  };

  const toggleCategoryExpansion = (categoryId) => {
    setExpandedCategories((prevExpanded) => ({
      ...prevExpanded,
      [categoryId]: !prevExpanded[categoryId],
    }));
  };

  const handleEditCategory = (categoryId) => {
    const categoryToEdit = categories.find((cat) => cat._id === categoryId);
    if (categoryToEdit) {
      setSidebarOpen(true);
      setEditCategoryId(categoryId);
      setEditCategoryName(categoryToEdit.category);
      setEditSubcategories([...categoryToEdit.subcategory]);
      setShowAddCategoryModal(false); // Close add modal if open
      setShowEditCategoryModal(true);
    }
  };

  const handleCloseEditCategoryModal = () => {
    setSidebarOpen(false);
    setShowEditCategoryModal(false);
    setEditCategoryId(null);
    setEditCategoryName("");
    setEditSubcategories([]);
  };

  const handleEditSubcategoryChange = (index, value) => {
    setEditSubcategories((prevSubcategories) => {
      const updatedSubcategories = [...prevSubcategories];
      updatedSubcategories[index] = value;
      return updatedSubcategories;
    });
  };

  const addEditSubcategoryField = () => {
    setEditSubcategories((prevSubcategories) => [...prevSubcategories, ""]);
  };

  const removeEditSubcategoryField = (index) => {
    setEditSubcategories((prevSubcategories) => {
      const updatedSubcategories = [...prevSubcategories];
      updatedSubcategories.splice(index, 1);
      return updatedSubcategories;
    });
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.put(
        `${import.meta.env.VITE_APP_API_URL}/api/category/update/${editCategoryId}`,
        {
          category: editCategoryName,
          subcategory: editSubcategories,
        }
      );
      fetchCategories();
      handleCloseEditCategoryModal();
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="w-full mx-auto bg-white shadow-md rounded-lg p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold text-gray-800">Products</h1>

          <div className="flex items-center gap-4">
            {/* Add Product Button */}
            {!showAddCategoryModal ? (
              <button
                className="flex items-center bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
                onClick={handleOpenAddCategoryModal}
              >
                <FaPlus className="mr-2" /> Add Category
              </button>
            ) : (
              <button
                className="flex items-center bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition"
                onClick={handleCloseAddCategoryModal}
              >
                <b> ✕ </b> &nbsp; Close
              </button>
            )}
          </div>
        </div>

        <div className="w-full flex gap-4">
          {/* Left side: Display existing categories */}
          <div className={`${sidebarOpen ? "w-1/2" : "w-full"} `}>
            <div className="p-4">
              <ul className="flex flex-wrap">
                {categories.map((category) => (
                  <li
                    key={category._id}
                    className={`mb-2 p-2 ${
                      sidebarOpen ? "w-1/2" : "w-1/3"
                    } `}
                  >
                    <div className="bg-white rounded-lg shadow-md p-4 ">
                      <div
                        className="flex justify-between text-lg font-bold text-gray-800 cursor-pointer"
                        onClick={() => toggleCategoryExpansion(category._id)}
                      >
                        {category.category}
                        {expandedCategories[category._id] ? (
                          <FaChevronUp className="ml-2" />
                        ) : (
                          <FaChevronDown className="ml-2" />
                        )}
                      </div>
                      <hr />
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
                          </ul>
                          <hr className="my-2" />
                          <button
                            className="flex items-center bg-blue-600 text-white mt-3 py-1 px-4 rounded-lg hover:bg-blue-700 transition"
                            onClick={() => handleEditCategory(category._id)}
                          >
                            <FaEdit className="mr-2" /> Edit
                          </button>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right side: Add category div */}
          {showAddCategoryModal && (
            <div className="md:w-1/2">
              <div className="flex flex-col h-full">
                <div className="bg-white p-4 rounded-lg shadow-md flex-grow">
                  <form onSubmit={handleSubmit}>
                    <div>
                      <select
                        value={selectedCategory}
                        className="input input-bordered w-full"
                        onChange={handleCategoryChange}
                      >
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                          <option key={category._id} value={category._id}>
                            {category.category}
                          </option>
                        ))}
                        <option value="add-new-category">
                          Add New Category
                        </option>
                      </select>

                      {showNewCategoryInput && (
                        <div>
                          <label className="label">
                            <span className="label-text">Category Name</span>
                          </label>
                          <input
                            type="text"
                            className="input input-bordered w-full"
                            placeholder="New Category Name"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                          />
                        </div>
                      )}

                      {/* Subcategory fields */}
                      <label className="label">
                        <span className="label-text">Subcategory</span>
                      </label>
                      {newSubcategories.map((subcategory, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                          <input
                            type="text"
                            placeholder="New Subcategory Name"
                            className="input input-bordered w-full"
                            value={subcategory}
                            onChange={(e) =>
                              handleSubcategoryChange(index, e.target.value)
                            }
                          />
                          <button
                            type="button"
                            className="btn btn-error text-white"
                            onClick={() => removeSubcategoryField(index)}
                          >
                            Remove
                          </button>
                        </div>
                      ))}

                      {/* Add more subcategories button */}
                      <button
                        type="button"
                        className="btn btn-sm btn-outline mt-2 w-full"
                        onClick={addSubcategoryField}
                      >
                        Add More Subcategories
                      </button>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary m-3  hover:bg-blue-700"
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
                <div className="bg-white p-4 rounded-lg shadow-md flex-grow">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Edit Category</h2>
                    <button
                      className="btn btn-sm btn-circle"
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
                        className="input input-bordered w-full"
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
                            className="input input-bordered w-full"
                            value={subcategory}
                            onChange={(e) =>
                              handleEditSubcategoryChange(index, e.target.value)
                            }
                          />
                          <button
                            type="button"
                            className="btn btn-sm btn-error"
                            onClick={() => removeEditSubcategoryField(index)}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        className="btn btn-sm btn-outline mt-2"
                        onClick={addEditSubcategoryField}
                      >
                        Add More Subcategories
                      </button>
                    </div>

                    <button type="submit" className="btn btn-primary">
                      Save Changes
                    </button>
                  </form>
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
