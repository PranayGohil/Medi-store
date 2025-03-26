import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import { addProduct } from "../validation-schema/product-validations";
import axios from "axios";
import { toast } from "react-toastify";
import Stepper from "../components/Stepper";
import RichTextEditor from "../components/RichTextEditor";
import { ShopContext } from "../context/ShopContext";
import LoadingSpinner from "../components/LoadingSpinner";

const EditProducts = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { fetchProducts } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const notifySuccess = () => toast.success("Product Edited Successfully");
  const notifyError = (error) => toast.error("Error Editing Product: " + error);
  const [step, setStep] = useState(1);
  const [categories, setCategories] = useState([]);
  const [productImages, setProductImages] = useState([]);
  const [manufacturerImage, setManufacturerImage] = useState(null);
  const [newProductImages, setNewProductImages] = useState([]);
  const [newManufacturerImage, setNewManufacturerImage] = useState(null);

  const steps = [
    { name: "Basic Info", icon: "1" },
    { name: "Images", icon: "2" },
    { name: "Description", icon: "3" },
    { name: "Price and Others", icon: "4" },
  ];

  const getProductData = async () => {
    try {
      setIsLoading(true);
      axios
        .get(`${import.meta.env.VITE_APP_API_URL}/api/product/single/${id}`)
        .then((res) => {
          const product = res.data.product;
          setProductData(product);
          setProductImages(product.product_images || []);
          setManufacturerImage(product.manufacturer_image || null);
        });
    } catch (error) {
      console.error("Error fetching product data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchCategoriesData = async () => {
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

    fetchCategoriesData();
  }, []);

  useEffect(() => {
    getProductData();
  }, [id]);

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
        return ["pricing"];
      default:
        return [];
    }
  };

  const onStepClick = (index) => {
    setStep(index + 1);
  };

  const handleProductImageChange = (e, setFieldValue) => {
    const files = Array.from(e.target.files);
    const newImages = [];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newImages.push(reader.result);
        if (newImages.length === files.length) {
          setProductImages([...productImages, ...newImages]);
          setNewProductImages(files);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleManufacturerImageChange = (e, setFieldValue) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setManufacturerImage(reader.result);
      setNewManufacturerImage(file);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const removeProductImage = (index, values, setFieldValue) => {
    const updatedImages = [...productImages];
    updatedImages.splice(index, 1);
    setProductImages(updatedImages);
  };

  const removeManufacturerImage = (setFieldValue) => {
    setManufacturerImage(null);
  };

  const handleSubmit = async (values) => {
    try {
      setIsLoading(true);
      const formData = new FormData();

      Object.keys(values).forEach((key) => {
        if (key === "categories" || key === "pricing") {
          formData.append(key, JSON.stringify(values[key])); // Stringify
        } else if (key !== "product_images" && key !== "manufacturer_image") {
          formData.append(key, values[key]);
        }
      });

      productImages.forEach((image) => {
        if (typeof image === "string" && image.startsWith("http")) {
          formData.append("existingProductImages", image);
        }
      });

      if (
        manufacturerImage &&
        typeof manufacturerImage === "string" &&
        manufacturerImage.startsWith("http")
      ) {
        formData.append("existingManufacturerImage", manufacturerImage);
      }

      newProductImages.forEach((file) => {
        formData.append("product_images", file);
      });

      if (newManufacturerImage) {
        formData.append("manufacturer_image", newManufacturerImage);
      }

      axios
        .put(
          `${import.meta.env.VITE_APP_API_URL}/api/product/edit/${id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((response) => {
          if (
            response.data.success === false &&
            response.data.message === "Unauthorized"
          ) {
            toast.error(response.data.message);
            navigate("/login");
            return;
          }
          fetchProducts();
          notifySuccess();
          navigate("/products");
        })
        .catch((error) => {
          console.error("Error editing product:", error);
          notifyError(error.message || "Something went wrong.");
        });
    } catch (error) {
      console.error("Error editing product:", error);
      notifyError(error.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!productData || isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-8 bg-gray-100">
      <div className=" mx-auto bg-white shadow-md p-6">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">
          Edit Product
        </h1>
        <Stepper
          steps={steps}
          currentStep={step - 1}
          onStepClick={onStepClick}
        />
        <Formik
          initialValues={{
            product_code: productData.product_code || "",
            name: productData.name || "",
            generic_name: productData.generic_name || "",
            manufacturer: productData.manufacturer || "",
            country_of_origin: productData.country_of_origin || "",
            dosage_form: productData.dosage_form || "",
            categories: productData.categories || [
              { category: "", subcategory: "" },
            ],
            description: productData.description || "",
            information: productData.information || "",
            pricing: productData.pricing || [
              { net_quantity: "", total_price: "", unit_price: "" },
            ],
            prescription_required: productData.prescription_required || false,
          }}
          // validationSchema={addProduct}
          onSubmit={handleSubmit}
          enableReinitialize={true}
        >
          {({
            values,
            errors,
            touched,
            setTouched,
            setFieldValue,
            validateForm,
            handleSubmit,
          }) => (
            <Form
              className="space-y-6"
              method="put"
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
                        className="w-full p-3 border"
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
                        className="w-full p-3 border"
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
                        className="w-full p-3 border"
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
                        className="w-full p-3 border"
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
                        className="w-full p-3 border"
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
                        className="w-full p-3 border"
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
                        {values.categories &&
                          values.categories.map((_, index) => (
                            <div
                              key={index}
                              className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center mb-2"
                            >
                              <div>
                                <label className="block text-gray-600 font-medium">
                                  Category
                                </label>
                                <Field
                                  as="select"
                                  name={`categories.${index}.category`}
                                  className="w-full p-3 border rounded-none"
                                  onChange={(e) => {
                                    setFieldValue(
                                      `categories.${index}.category`,
                                      e.target.value
                                    );
                                    setFieldValue(
                                      `categories.${index}.subcategory`,
                                      ""
                                    );
                                  }}
                                >
                                  <option value="" disabled className="text-center">Select Category</option>
                                  {categories.map((cat) => (
                                    <option key={cat._id} value={cat.category}>
                                      {cat.category}
                                    </option>
                                  ))}
                                </Field>
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
                                  as="select"
                                  name={`categories.${index}.subcategory`}
                                  className="w-full p-3 border rounded-none"
                                >
                                  <option
                                    value=""
                                    disabled
                                    className="text-center"
                                  >
                                    Select Subcategory
                                  </option>
                                  {categories
                                    .find(
                                      (cat) =>
                                        cat.category ===
                                        values.categories[index].category
                                    )
                                    ?.subcategory.map((subcat, subIndex) => (
                                      <option key={subIndex} value={subcat}>
                                        {subcat}
                                      </option>
                                    ))}
                                  {categories
                                    .find(
                                      (cat) =>
                                        cat.category ===
                                        values.categories[index].category
                                    )
                                    ?.special_subcategory.map(
                                      (subcat, subIndex) => (
                                        <>
                                          {subIndex === 0 && (
                                            <option
                                              value=""
                                              disabled
                                              className="text-center"
                                            >
                                              Special Subcategories
                                            </option>
                                          )}

                                          <option key={subIndex} value={subcat}>
                                            {subcat}
                                          </option>
                                        </>
                                      )
                                    )}
                                </Field>
                                <ErrorMessage
                                  name={`categories.${index}.subcategory`}
                                  component="div"
                                  className="text-red-500 text-sm"
                                />
                              </div>
                              {index > 0 && (
                                <div className="flex items-end h-full">
                                  <button
                                    type="button"
                                    onClick={() => remove(index)}
                                    className="bg-red-400 hover:bg-red-500 text-white px-3 py-3"
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
                          className="bg-green-400 hover:bg-green-500 text-white px-4 py-3"
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
                  <label className="block text-gray-600 font-medium">
                    Product Images
                  </label>
                  <div className="flex flex-wrap gap-4 mt-2">
                    <label
                      htmlFor="productImages"
                      className="w-24 h-24 border flex items-center justify-center cursor-pointer"
                    >
                      {/* Upload icon */}
                      <input
                        type="file"
                        id="productImages"
                        onChange={(e) =>
                          handleProductImageChange(e, setFieldValue)
                        }
                        accept="image/*"
                        multiple
                        hidden
                      />
                    </label>
                    {productImages.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image}
                          alt="Product Preview"
                          className="w-24 h-24 object-cover border"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            removeProductImage(index, values, setFieldValue)
                          }
                          className="absolute top-1 right-1 bg-red-400 text-white text-xs px-2 py-1 rounded-full"
                        >
                          X
                        </button>
                      </div>
                    ))}
                  </div>

                  <label className="block text-gray-600 font-medium mt-4">
                    Manufacturer Logo
                  </label>
                  <div className="flex flex-wrap gap-4 mt-2">
                    <label
                      htmlFor="manufacturerImage"
                      className="w-24 h-24 border flex items-center justify-center cursor-pointer"
                    >
                      {/* Upload icon */}
                      <input
                        type="file"
                        id="manufacturerImage"
                        onChange={(e) =>
                          handleManufacturerImageChange(e, setFieldValue)
                        }
                        accept="image/*"
                        hidden
                      />
                    </label>
                    {manufacturerImage && (
                      <div className="relative">
                        <img
                          src={manufacturerImage}
                          alt="Manufacturer Preview"
                          className="w-24 h-24 object-cover border"
                        />
                        <button
                          type="button"
                          onClick={() => removeManufacturerImage(setFieldValue)}
                          className="absolute top-1 right-1 bg-red-400 text-white text-xs px-2 py-1 rounded-full"
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

              {/* Step 4: Pricing, Prescription */}
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
                                className="w-full p-3 border"
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
                                className="w-full p-3 border"
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
                                className="w-full p-3 border bg-gray-200"
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
                              <div className="h-full flex items-end">
                                <button
                                  type="button"
                                  onClick={() => remove(index)}
                                  className="bg-red-400 hover:bg-red-500 text-white px-3 py-3"
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
                          className="bg-green-400 hover:bg-green-500 mt-2 text-white px-4 py-3"
                        >
                          + Add More
                        </button>
                      </div>
                    )}
                  </FieldArray>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center mb-2">
                    <div className="w-full flex items-center justify-start space-x-2 mt-4">
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
                    className="bg-gray-500 text-white px-8 py-3"
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
                      const currentStepFields = getStepFields(step);
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
                    className="bg-blue-400 hover:bg-blue-500 text-white px-6 py-3"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="button"
                    className="bg-green-400 hover:bg-green-500 text-white px-6 py-3"
                    onClick={() => handleSubmit(values)}
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

export default EditProducts;
