export const Utils = {
  employeeStatus: ["Regular", "Retired"],

  bloodGroupOptions: [
    { value: "A+" },
    { value: "A-" },
    { value: "B+" },
    { value: "B-" },
    { value: "AB+" },
    { value: "AB-" },
    { value: "O+" },
    { value: "O-" },
  ],

  maritalStatus: ["Married", "Single"],
  married: "Married",
  single: "Single",

  genderOptions: ["Male", "Female", "Other"],

  distributionTypesArr: ["Parents", "Children", "Spouse", "Self", "Other"],
  distributionTypesObj: {
    Parents: "Parents",
    Children: "Children",
    Spouse: "Spouse",
    Self: "Self",
    Other: "Other",
  },

  permissions: {
    view_dashboard: "view_dashboard",
    create_user: "create_user",
    edit_user: "edit_user",
    delete_user: "delete_user",
    view_user: "view_user",

    create_role: "create_role",
    edit_role: "edit_role",
    delete_role: "delete_role",
    view_role: "view_role",
    assign_role: "assign_role",

    create_permission: "create_permission",
    edit_permission: "edit_permission",
    delete_permission: "delete_permission",
    view_permission: "view_permission",
    assign_permission: "assign_permission",

    create_category: "create_category",
    edit_category: "edit_category",
    delete_category: "delete_category",
    view_category: "view_category",

    create_designation: "create_designation",
    edit_designation: "edit_designation",
    delete_designation: "delete_designation",
    view_designation: "view_designation",

    create_distribution: "create_distribution",
    edit_distribution: "edit_distribution",
    delete_distribution: "delete_distribution",
    view_distribution: "view_distribution",

    create_medicine: "create_medicine",
    edit_medicine: "edit_medicine",
    delete_medicine: "delete_medicine",
    view_medicine: "view_medicine",
    assign_medicine: "assign_medicine",

    create_medicine_unit: "create_medicine_unit",
    edit_medicine_unit: "edit_medicine_unit",
    delete_medicine_unit: "delete_medicine_unit",
    view_medicine_unit: "view_medicine_unit",

    create_patient: "create_patient",
    edit_patient: "edit_patient",
    delete_patient: "delete_patient",
    view_patient: "view_patient",
    assign_patient: "assign_patient",

    create_police_unit: "create_police_unit",
    edit_police_unit: "edit_police_unit",
    delete_police_unit: "delete_police_unit",
    view_police_unit: "view_police_unit",

    create_stock: "create_stock",
    edit_stock: "edit_stock",
    delete_stock: "delete_stock",
    view_stock: "view_stock",

    edit_website_setting: "edit_website_setting",
    view_website_setting: "view_website_setting",
  },
  stock_status: {
    Active: "Active",
    Expired: "Expired",
    Damaged: "Damaged",
  },
};
