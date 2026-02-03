import * as Yup from "yup";

export const getInitialValues = (initial = {}) => {
  const data = {
    present_division_id: initial?.present_division?.id || "",
    present_district_id: initial?.present_district?.id || "",
    present_upazila_id: initial?.present_upazila?.id || "",
    present_union_id: initial?.present_union?.id || "",
    present_village: initial?.present_village || "",
    present_ward: initial?.present_ward || "",

    // Permanent Address
    permanent_division_id: initial?.permanent_division?.id || "",
    permanent_district_id: initial?.permanent_district?.id || "",
    permanent_upazila_id: initial?.permanent_upazila?.id || "",
    permanent_union_id: initial?.permanent_union?.id || "",
    permanent_village: initial?.permanent_village || "",
    permanent_ward: initial?.permanent_ward || "",
  };
  return data;
};

export const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  phone: Yup.string().required("Phone is required"),
  email: Yup.string().email().required("Email is required"),
  status: Yup.string().required("Status is required"),
  father_or_husband_name: Yup.string().required("Required"),

  // Present Address
  present_division_id: Yup.string().required("Present division is required"),
  present_district_id: Yup.string().required("Present district is required"),
  present_upazila_id: Yup.string().required("Present upazila is required"),
  present_union_id: Yup.string().required("Present union is required"),
  present_ward: Yup.string().required("Present ward is required"),
  present_village: Yup.string().required("Present village is required").max(255, "Present village cannot exceed 255 characters"),

  permanent_division_id: Yup.string().required( "Permanent division is required"),
  permanent_district_id: Yup.string().required("Permanent district is required"),
  permanent_upazila_id: Yup.string().required("Permanent upazila is required"),
  permanent_union_id: Yup.string().required("Permanent union is required"),
  permanent_ward: Yup.string().required("Permanent ward is required"),
  permanent_village: Yup.string()
    .required("Permanent village is required")
    .max(255, "Permanent village cannot exceed 255 characters"),
});
