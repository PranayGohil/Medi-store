import * as Yup from "yup";

export const addProduct = Yup.object().shape({
  // Step 1: Basic Information
  product_code: Yup.string()
    .matches(/^[A-Za-z0-9_-]+$/, "Invalid product code format"),
  name: Yup.string().required("Product name is required"),
  generic_name: Yup.string(),
  manufacturer: Yup.string(),
  country_of_origin: Yup.string(),
  dosage_form: Yup.string().required("Dosage form is required"),

  categories: Yup.array()
    .of(
      Yup.object().shape({
        category: Yup.string(),
        subcategory: Yup.string(),
      })
    ),

  // Step 2: Images
  product_images: Yup.array()
    .min(1, "At least one product image is required")
    .required("Product images are required"),
  manufacturer_image: Yup.mixed(),

  // Step 3: Description & Information
  description: Yup.string(),
  information: Yup.string(),

  // Step 4: Pricing
  pricing: Yup.array()
    .of(
      Yup.object().shape({
        net_quantity: Yup.number()
          .typeError("Quantity must be a number")
          .positive("Quantity must be greater than 0")
          .required("Quantity is required"),
        total_price: Yup.number()
          .typeError("Total price must be a number")
          .positive("Total price must be greater than 0")
          .required("Total price is required"),
        unit_price: Yup.number()
          .typeError("Unit price must be a number")
          .positive("Unit price must be greater than 0")
          .required("Unit price is required"),
      })
    )
    .min(1, "At least one pricing option is required"),

  prescription_required: Yup.boolean(),
});
