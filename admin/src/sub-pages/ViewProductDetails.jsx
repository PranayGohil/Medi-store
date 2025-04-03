import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import LoadingSpinner from "../components/LoadingSpinner";
import { CgUnavailable } from "react-icons/cg";
import { IoMdCheckmarkCircle } from "react-icons/io";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import "react-quill/dist/quill.snow.css";

const ViewProductDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [product, setProduct] = useState(null);
  const { currency, fetchProducts } = useContext(ShopContext);
  const [selectedImage, setSelectedImage] = useState("");
  const [showModal, setShowModal] = useState(false); // State for modal
  const successDelete = () => toast.success("Product Deleted Successfully");
  const errorDelete = (error) =>
    toast.error("Error Deleting Product: " + error);

  const fetchProduct = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_API_URL}/api/product/single/${id}`
      );
      setProduct(response.data.product);
      if (response.data.product.product_images.length > 0) {
        setSelectedImage(response.data.product.product_images[0]);
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const removeProduct = async () => {
    try {
      setIsLoading(true);
      const response = await axios.delete(
        `${import.meta.env.VITE_APP_API_URL}/api/product/remove/${product._id}`,
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
      fetchProducts();
      successDelete();
      navigate("/products");
    } catch (error) {
      errorDelete(error);
      console.error("Error deleting product:", error);
    } finally {
      setIsLoading(false);
    }
    setShowModal(false); // Close modal after delete
  };

  const toggleAvailability = async () => {
    try {
      setIsLoading(true);
      const response = await axios.put(
        `${
          import.meta.env.VITE_APP_API_URL
        }/api/product/change-available-status/${product._id}`,
        {},
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
      fetchProduct();
      toast.success(response.data.message);
    } catch (error) {
      toast.error("Error in Change availability: " + error);
      console.error("Error in Change availability: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!product || isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-6 bg-gray-100">
      <div className="w-full flex justify-between">
        {/* Page Title */}
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Product Details
        </h1>
        <div className="flex gap-4 py-2 px-5">
          <button
            className="flex items-center bg-green-400 text-white py-3 px-4 hover:bg-green-500 transition"
            onClick={() => navigate(`/product/edit-product/${product._id}`)}
          >
            <FaEdit className="mr-2" /> Edit Details
          </button>
          <button
            className="flex items-center bg-red-400 text-white py-3 px-4 hover:bg-red-500 transition"
            onClick={() => setShowModal(true)}
          >
            <MdDelete className="mr-2" /> Remove Product
          </button>
        </div>
      </div>
      {/* Two Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 shadow-lg">
          <h2 className="text-lg font-semibold mb-4">Product Images</h2>

          {/* Large Main Image */}
          <div className="flex justify-center">
            <img
              src={selectedImage}
              alt="Selected Product"
              className="w-[500px] h-[500px] object-contain shadow-md"
            />
          </div>

          {/* Thumbnails Row */}
          <div className="flex justify-center gap-4 mt-4">
            {product.product_images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Thumbnail ${index}`}
                className={`w-20 h-20 object-cover cursor-pointer shadow-md ${
                  selectedImage === image ? "border-2 border-blue-500" : ""
                }`}
                onClick={() => setSelectedImage(image)}
              />
            ))}
          </div>
        </div>
        <div className="md:col-span-2 bg-white p-6 shadow-lg">
          {/* Product Information */}
          <h2 className="text-lg font-semibold mb-4">Product Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <p>
              <strong>Product Code:</strong> {product.product_code}
            </p>
            <p>
              <strong>Name:</strong> {product.name}
            </p>
            <p>
              <strong>Generic Name:</strong> {product.generic_name}
            </p>
            <p>
              <strong>Manufacturer:</strong> {product.manufacturer}
            </p>
            <p>
              <strong>Country of Origin:</strong> {product.country_of_origin}
            </p>
            <p>
              <strong>Dosage Form:</strong> {product.dosage_form}
            </p>
            <p>
              <strong>Prescription Required:</strong>{" "}
              {product.prescription_required ? "Yes" : "No"}
            </p>
            <p>
              <strong>Rating:</strong> {product.rating}
            </p>
            <p>
              <strong>Available: </strong> {product.available ? "Yes" : "No"}
              <br />
              {product.available ? (
                <button
                  className="flex items-center bg-red-400 text-white py-1 px-4 mt-2 hover:bg-red-500 transition"
                  onClick={() => toggleAvailability()}
                >
                  <CgUnavailable className="mr-2" /> Mark as Unavailable
                </button>
              ) : (
                <button
                  className="flex items-center bg-green-400 text-white py-1 px-4 mt-2 hover:bg-green-500 transition"
                  onClick={() => toggleAvailability()}
                >
                  <IoMdCheckmarkCircle className="mr-2" /> Mark as Available
                </button>
              )}
            </p>
          </div>
          <hr className="my-4" />
          {/* Categories */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-4">Categories</h2>
            <div className="flex flex-wrap gap-2">
              {product.categories.map((cat, index) => (
                <span key={index} className="px-5 text-base">
                  {cat.category} ({cat.subcategory})
                </span>
              ))}
            </div>
          </div>
          <hr className="my-4" />
          {/* Pricing Details */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-4">Pricing Details</h2>

            <table>
              <tbody>
                {product.pricing.map((price, index) => (
                  <tr key={index} className="">
                    <td className="p-2 ">
                      {price.net_quantity + " " + product.dosage_form + "/s "}
                    </td>
                    <td className="p-2 ">
                      {currency + " " + price.total_price}
                    </td>
                    <td className="p-2 ">
                      {" ( " +
                        currency +
                        " " +
                        price.unit_price +
                        " per " +
                        product.dosage_form +
                        ")"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <hr className="my-4" />
          {/* Manufacturer Image */}
          <div className="mt-6 text-center">
            <h2 className="text-lg font-semibold mb-4">Manufacturer Image</h2>
            <img
              src={product.manufacturer_image || "/placeholder.jpg"}
              alt="Manufacturer"
              className="shadow-md w-48 mx-auto"
            />
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="bg-white p-6 shadow-lg mt-6">
        <h2 className="text-3xl font-semibold mb-4">Description</h2>
        <hr className="border border-black-300 mb-4" />
        <div
          className="prose max-w-full ql-editor text-gray-700"
          dangerouslySetInnerHTML={{ __html: product.description }}
        ></div>
      </div>
      {/* Additional Information */}
      <div className="bg-white p-6 shadow-lg mt-6">
        <h2 className="text-3xl font-semibold mb-4">Additional Information</h2>
        <hr className="border border-black-300 mb-4" />
        <div
          className="prose max-w-full ql-editor w-full text-gray-700"
          dangerouslySetInnerHTML={{ __html: product.information }}
        ></div>
      </div>

      {/* Reviews Section */}
      <div className="bg-white p-6 shadow-lg mt-6">
        <h2 className="text-3xl font-semibold mb-4">Reviews</h2>
        <hr className="border border-black-300 mb-4" />
        {product.reviews.length > 0 ? (
          <ul className="space-y-4">
            {product.reviews.map((review, index) => (
              <li key={index} className="border p-4 bg-gray-50">
                <p className="text-gray-700">
                  <strong>User:</strong> {review.user_id}
                </p>
                <p className="text-gray-700">
                  <strong>Comment:</strong> {review.comment}
                </p>
                <p className="text-gray-700">
                  <strong>Rating:</strong> {review.rating}
                </p>
                <p className="text-gray-700">
                  <strong>Status:</strong> {review.status}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No reviews yet.</p>
        )}
      </div>
      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[100]">
          <div className="bg-white p-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
            <p className="mb-4">
              Are you sure you want to delete this product?
            </p>
            <div className="flex justify-end gap-4 mt-5">
              <button
                className="bg-gray-300 text-gray-700 py-3 px-6 hover:bg-gray-400 transition"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-red-400 text-white py-3 px-6 hover:bg-red-500 transition"
                onClick={removeProduct}
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

export default ViewProductDetails;
