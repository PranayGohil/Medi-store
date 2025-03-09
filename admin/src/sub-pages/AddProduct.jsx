import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import { addProduct } from "../validation-schema/product-validations";
import axios from "axios";
import { toast } from "react-toastify";
import Stepper from "../components/Stepper";
import RichTextEditor from "../components/RichTextEditor";
import { ShopContext } from "../context/ShopContext";
import LoadingSpinner from "../components/LoadingSpinner";

const AddProduct = () => {
  const navigate = useNavigate();
  const { fetchProducts } = useContext(ShopContext);
  const notifySuccess = () => toast.success("Product Added Successfully");
  const notifyError = (error) => toast.error("Error Adding Product: " + error);
  const [step, setStep] = useState(1);
  const [productImages, setProductImages] = useState([]);
  const [manufacturerImage, setManufacturerImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  if (isLoading) {
    return <LoadingSpinner />;
  }

  const steps = [
    { name: "Basic Info", icon: "1" },
    { name: "Images", icon: "2" },
    { name: "Description", icon: "3" },
    { name: "Price and Others", icon: "4" },
  ];

  const getStepFields = (step) => {
    switch (step) {
      case 1:
        return [
          "product_code",
          "name",
          "generic_name",
          "manufacturer",
          "country_of_origin",
          "dosage_form",
          "categories",
        ];
      case 2:
        return ["product_images", "manufacturer_image"];
      case 3:
        return ["description", "information"];
      case 4:
        return ["pricing", "stock_quantity"];
      default:
        return [];
    }
  };

  const onStepClick = (index) => {
    setStep(index + 1);
  };

  const initialValues = {
    name: "",
    generic_name: "",
    product_code: "",
    product_images: null,
    manufacturer: "",
    manufacturer_image: null,
    categories: [{ category: "", subcategory: "" }],
    country_of_origin: "",
    dosage_form: "",
    description: "",
    information: "",
    prescription_required: false,
    pricing: [{ net_quantity: "", total_price: "", unit_price: "" }],
    stock_quantity: "",
  };

  const handleSubmit = async (values) => {
    setIsLoading(true);
    const formData = new FormData();

    formData.append("name", values.name);
    formData.append("generic_name", values.generic_name);
    formData.append("product_code", values.product_code);
    formData.append("manufacturer", values.manufacturer);
    formData.append("country_of_origin", values.country_of_origin);
    formData.append("dosage_form", values.dosage_form);
    formData.append("description", values.description);
    formData.append("information", values.information);
    formData.append("prescription_required", values.prescription_required);
    formData.append("stock_quantity", values.stock_quantity);

    // Convert array fields to JSON strings
    formData.append("categories", JSON.stringify(values.categories));
    formData.append("pricing", JSON.stringify(values.pricing));

    // Append images
    values.product_images.forEach((file) => {
      formData.append("product_images", file);
    });

    if (values.manufacturer_image) {
      formData.append("manufacturer_image", values.manufacturer_image);
    }

    try {
      axios
        .post(`${import.meta.env.VITE_APP_API_URL}/api/product/add`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((res) => {
          setIsLoading(false);
          console.log("Response:", res.data);
          if (res.data.success) {
            fetchProducts();
            notifySuccess();
            navigate("/products");
          } else {
            notifyError(error.message);
          }
        });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Handle Product Image Selection
  const handleProductImageChange = (event, setFieldValue, values) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      const newImages = files.map((file) => URL.createObjectURL(file));

      setProductImages((prevImages) => {
        const updatedImages = [...prevImages, ...newImages];
        console.log(updatedImages);
        return updatedImages;
      });

      setFieldValue("product_images", [...productImages, ...files]);
    }
  };

  // Handle Removing Product Image
  const removeProductImage = (index) => {
    const updatedImages = productImages.filter((_, i) => i !== index);
    setProductImages(updatedImages);
  };

  // Handle Manufacturer Image Selection
  const handleManufacturerImageChange = (event, setFieldValue) => {
    const file = event.target.files[0];
    if (file) {
      setManufacturerImage(URL.createObjectURL(file));
      setFieldValue("manufacturer_image", file);
      console.log(file);
    }
  };

  // Remove Manufacturer Image
  const removeManufacturerImage = () => {
    setManufacturerImage(null);
  };

  return (
    <div className="p-8 bg-gray-100">
      <div className=" mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">
          Add New Product
        </h1>
        <Stepper
          steps={steps}
          currentStep={step - 1}
          onStepClick={onStepClick}
        />{" "}
        {/* Stepper added */}
        <Formik
          initialValues={initialValues}
          validationSchema={addProduct}
          onSubmit={handleSubmit}
        >
          {({
            values,
            errors,
            touched,
            setTouched,
            setFieldValue,
            validateForm,
          }) => (
            <Form
              className="space-y-6"
              method="post"
              encType="multipart/form-data"
            >
              {/* Step 1: Basic Information */}
              {step === 1 && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-gray-600 font-medium">
                        Product Code
                      </label>
                      <Field
                        type="text"
                        name="product_code"
                        className="w-full p-3 border rounded-md"
                      />
                      <ErrorMessage
                        name="product_code"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 font-medium">
                        Product Name
                      </label>
                      <Field
                        type="text"
                        name="name"
                        className="w-full p-3 border rounded-md"
                      />
                      <ErrorMessage
                        name="name"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 font-medium">
                        Generic Name
                      </label>
                      <Field
                        type="text"
                        name="generic_name"
                        className="w-full p-3 border rounded-md"
                      />
                      <ErrorMessage
                        name="generic_name"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 font-medium">
                        Manufacturer Name
                      </label>
                      <Field
                        type="text"
                        name="manufacturer"
                        className="w-full p-3 border rounded-md"
                      />
                      <ErrorMessage
                        name="manufacturer"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 font-medium">
                        Country of Origin
                      </label>
                      <Field
                        type="text"
                        name="country_of_origin"
                        className="w-full p-3 border rounded-md"
                      />
                      <ErrorMessage
                        name="country_of_origin"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 font-medium">
                        Dosage Form
                      </label>
                      <Field
                        type="text"
                        name="dosage_form"
                        className="w-full p-3 border rounded-md"
                      />
                      <ErrorMessage
                        name="dosage_form"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>
                  </div>

                  <FieldArray name="categories">
                    {({ push, remove, form }) => (
                      <div>
                        {values.categories.map((_, index) => (
                          <div
                            key={index}
                            className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center mb-2"
                          >
                            <div>
                              <label className="block text-gray-600 font-medium">
                                Category
                              </label>
                              <Field
                                type="text"
                                name={`categories.${index}.category`}
                                placeholder="Category"
                                className="w-full p-3 border rounded-md"
                              />
                              <ErrorMessage
                                name={`categories.${index}.category`}
                                component="div"
                                className="text-red-500 text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-gray-600 font-medium">
                                Subcategory
                              </label>
                              <Field
                                type="text"
                                name={`categories.${index}.subcategory`}
                                placeholder="Subcategory"
                                className="w-full p-3 border rounded-md"
                              />
                              <ErrorMessage
                                name={`categories.${index}.subcategory`}
                                component="div"
                                className="text-red-500 text-sm"
                              />
                            </div>
                            {index > 0 && (
                              <div>
                                <button
                                  type="button"
                                  onClick={() => remove(index)}
                                  className="bg-red-500 text-white px-3 py-2 rounded"
                                >
                                  Remove
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() =>
                            push({ category: "", subcategory: "" })
                          }
                          className="bg-green-500 text-white px-4 py-2 rounded"
                        >
                          + Add More
                        </button>

                        {/* General Category Error Message */}
                        {form.errors.categories && form.touched.categories && (
                          <div className="text-red-500 text-sm mt-2">
                            Category and Subcategory are required.
                          </div>
                        )}
                      </div>
                    )}
                  </FieldArray>
                </>
              )}

              {/* Step 2: Product & Manufacturer Images */}
              {step === 2 && (
                <>
                  {/* Product Images */}
                  <label className="block text-gray-600 font-medium">
                    Product Images
                  </label>
                  <div className="flex flex-wrap gap-4 mt-2">
                    <label
                      htmlFor="productImages"
                      className="w-24 h-24 object-cover border rounded-md flex items-center justify-center cursor-pointer"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M7.5 7.5h-.75A2.25 2.25 0 0 0 4.5 9.75v7.5a2.25 2.25 0 0 0 2.25 2.25h7.5a2.25 2.25 0 0 0 2.25-2.25v-7.5a2.25 2.25 0 0 0-2.25-2.25h-.75m0-3-3-3m0 0-3 3m3-3v11.25m6-2.25h.75a2.25 2.25 0 0 1 2.25 2.25v7.5a2.25 2.25 0 0 1-2.25 2.25h-7.5a2.25 2.25 0 0 1-2.25-2.25v-.75"
                        />
                      </svg>

                      <input
                        type="file"
                        name="product_images"
                        id="productImages"
                        onChange={(event) =>
                          handleProductImageChange(event, setFieldValue, values)
                        }
                        accept="image/*"
                        style={{ display: "none" }}
                        multiple
                      />
                      <ErrorMessage
                        name="product_images"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </label>
                    {productImages.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image}
                          alt="Product Preview"
                          className="w-24 h-24 object-cover border rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => removeProductImage(index)}
                          className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1 rounded-full"
                        >
                          X
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Manufacturer Image Upload */}

                  {/* Manufacturer Image Preview */}
                  <label className="block text-gray-600 font-medium">
                    Manufacturer Logo Image
                  </label>
                  <div className="flex flex-wrap gap-4 mt-2">
                    <label
                      htmlFor="manufacturerImage"
                      className="w-24 h-24 object-cover border rounded-md flex items-center justify-center cursor-pointer"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3V15"
                        />
                      </svg>

                      <input
                        type="file"
                        name="manufacturer_image"
                        id="manufacturerImage"
                        onChange={(event) => {
                          handleManufacturerImageChange(event, setFieldValue);
                        }}
                        className="w-full p-3 border rounded-md"
                        accept="image/*"
                        style={{ display: "none" }}
                      />
                      <ErrorMessage
                        name="manufacturer_image"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </label>
                    {manufacturerImage && (
                      <div className="relative">
                        <img
                          src={manufacturerImage}
                          alt="Manufacturer Preview"
                          className="w-24 h-24 object-cover border rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => removeManufacturerImage()}
                          className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1 rounded-full"
                        >
                          X
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Step 3: Description & Additional Information */}
              {step === 3 && (
                <>
                  {/* Description Field */}
                  <div>
                    <label className="block text-gray-600 font-medium">
                      Description
                    </label>
                    <Field name="description">
                      {({ field, form }) => (
                        <RichTextEditor
                          value={field.value}
                          onChange={(value) =>
                            form.setFieldValue("description", value)
                          }
                        />
                      )}
                    </Field>
                    <ErrorMessage
                      name="description"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  {/* Additional Information Field */}
                  <div>
                    <label className="block text-gray-600 font-medium">
                      Additional Information
                    </label>
                    <Field name="information">
                      {({ field, form }) => (
                        <RichTextEditor
                          value={field.value}
                          onChange={(value) =>
                            form.setFieldValue("information", value)
                          }
                        />
                      )}
                    </Field>
                    <ErrorMessage
                      name="information"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                </>
              )}

              {/* Step 4: Pricing, Stock & Prescription */}
              {step === 4 && (
                <>
                  {/* Dynamic Pricing Fields */}
                  <FieldArray name="pricing">
                    {({ push, remove }) => (
                      <div>
                        {values.pricing.map((_, index) => (
                          <div
                            key={index}
                            className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center mb-2"
                          >
                            {/* Net Quantity */}
                            <div>
                              <label className="block text-gray-600 font-medium">
                                Quantity
                              </label>
                              <Field
                                type="number"
                                name={`pricing.${index}.net_quantity`}
                                className="w-full p-3 border rounded-md"
                                onChange={(e) => {
                                  const value = parseFloat(e.target.value) || 0;
                                  setFieldValue(
                                    `pricing.${index}.net_quantity`,
                                    value
                                  );

                                  // Auto-calculate unit price if total_price exists
                                  const totalPrice =
                                    values.pricing[index]?.total_price || 0;
                                  if (totalPrice > 0 && value > 0) {
                                    setFieldValue(
                                      `pricing.${index}.unit_price`,
                                      (totalPrice / value).toFixed(2)
                                    );
                                  }
                                }}
                              />
                              <ErrorMessage
                                name={`pricing.${index}.net_quantity`}
                                component="div"
                                className="text-red-500 text-sm"
                              />
                            </div>

                            {/* Total Price */}
                            <div>
                              <label className="block text-gray-600 font-medium">
                                Total Price
                              </label>
                              <Field
                                type="number"
                                name={`pricing.${index}.total_price`}
                                className="w-full p-3 border rounded-md"
                                onChange={(e) => {
                                  const value = parseFloat(e.target.value) || 0;
                                  setFieldValue(
                                    `pricing.${index}.total_price`,
                                    value
                                  );

                                  // Auto-calculate unit price if net_quantity exists
                                  const netQuantity =
                                    values.pricing[index]?.net_quantity || 0;
                                  if (netQuantity > 0 && value > 0) {
                                    setFieldValue(
                                      `pricing.${index}.unit_price`,
                                      (value / netQuantity).toFixed(2)
                                    );
                                  }
                                }}
                              />
                              <ErrorMessage
                                name={`pricing.${index}.total_price`}
                                component="div"
                                className="text-red-500 text-sm"
                              />
                            </div>

                            {/* Unit Price (Read-Only) */}
                            <div>
                              <label className="block text-gray-600 font-medium">
                                Unit Price
                              </label>
                              <Field
                                type="number"
                                name={`pricing.${index}.unit_price`}
                                className="w-full p-3 border rounded-md bg-gray-200"
                                readOnly
                              />
                              <ErrorMessage
                                name={`pricing.${index}.unit_price`}
                                component="div"
                                className="text-red-500 text-sm"
                              />
                            </div>

                            {/* Remove Button */}
                            {index > 0 && (
                              <div>
                                <button
                                  type="button"
                                  onClick={() => remove(index)}
                                  className="bg-red-500 text-white px-3 py-2 rounded"
                                >
                                  Remove
                                </button>
                              </div>
                            )}
                          </div>
                        ))}

                        {/* Add More Button */}
                        <button
                          type="button"
                          onClick={() =>
                            push({
                              net_quantity: "",
                              total_price: "",
                              unit_price: "",
                            })
                          }
                          className="bg-green-500 text-white px-4 py-2 rounded"
                        >
                          + Add More
                        </button>
                      </div>
                    )}
                  </FieldArray>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center mb-2">
                    <div>
                      <label className="block text-gray-600 font-medium">
                        Stock Quantity
                      </label>
                      <Field
                        type="number"
                        name="stock_quantity"
                        className="w-full p-3 border rounded-md"
                        placeholder="Stock Quantity"
                      />
                      <ErrorMessage
                        name="stock_quantity"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>
                    <div className="w-full flex items-center justify-center space-x-2 mt-4">
                      <Field
                        type="checkbox"
                        name="prescription_required"
                        id="prescription_required"
                        className="w-5 h-5"
                      />
                      <label
                        className="text-gray-600 font-medium"
                        htmlFor="prescription_required"
                      >
                        Prescription Required
                      </label>
                    </div>
                  </div>
                </>
              )}

              {/* Navigation Buttons */}
              <div className="w-full mt-6 flex justify-between">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                  >
                    Back
                  </button>
                ) : (
                  <div></div>
                )}

                {step < 4 ? (
                  <button
                    type="button"
                    onClick={async () => {
                      const errors = await validateForm();
                      const currentStepFields = getStepFields(step); // Get fields for current step
                      const hasErrors = currentStepFields.some(
                        (field) => errors[field]
                      );

                      if (hasErrors) {
                        setTouched(
                          currentStepFields.reduce(
                            (acc, field) => ({ ...acc, [field]: true }),
                            {}
                          )
                        );
                      } else {
                        setStep(step + 1);
                      }
                    }}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded"
                  >
                    Submit
                  </button>
                )}
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AddProduct;
