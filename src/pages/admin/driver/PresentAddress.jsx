import React, { useEffect, useState } from "react";
import { Col, Form, Input, Select, Typography } from "antd";
import {
  useGetDivisionsQuery,
  useLazyGetDistrictsQuery,
  useLazyGetUpazilasQuery,
  useLazyGetUnionsQuery,
} from "../../redux/api/findAddressApiSlice";

const PresentAddress = ({
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
  setValues,
  editData,
}) => {
  const { data: divisions } = useGetDivisionsQuery();
  const [presentDistricts, setPresentDistricts] = useState([]);
  const [presentUpazilas, setPresentUpazilas] = useState([]);
  const [presentUnions, setPresentUnions] = useState([]);

  const [getDistricts, {isLoading: isLoadingDistricts}] = useLazyGetDistrictsQuery();
  const [getUpazilas, {isLoading: isLoadingUpazilas}] = useLazyGetUpazilasQuery();
  const [getUnions, {isLoading: isLoadingUnions}] = useLazyGetUnionsQuery();

  // Function to fetch districts
  const fetchDistricts = async (divisionId, shouldSetValue = true) => {
    try {
      const response = await getDistricts(divisionId);
      setPresentDistricts(response?.data?.data || []);
      setPresentUpazilas([]); // Clear Upazilas when Districts change
      setPresentUnions([]); // Clear Unions when Upazilas change
      if (shouldSetValue) {
        setValues((prev) => ({
          ...prev,
          present_district_id: "",
          present_upazila_id: "",
          present_union_id: "",
        }));
      }
    } catch (error) {
      console.error("Failed to fetch districts:", error);
    }
  };

  // Function to fetch upazilas
  const fetchUpazilas = async (districtId, shouldSetValue = true) => {
    try {
      const response = await getUpazilas(districtId);
      setPresentUpazilas(response?.data?.data || []);
      setPresentUnions([]); // Clear Unions when Upazilas change
      if (shouldSetValue) {
        setValues((prev) => ({
          ...prev,
          present_upazila_id: "",
          present_union_id: "",
        }));
      }
    } catch (error) {
      console.error("Failed to fetch upazilas:", error);
    }
  };

  // Function to fetch unions
  const fetchUnions = async (upazilaId, shouldSetValue = true) => {
    try {
      const response = await getUnions(upazilaId);
      setPresentUnions(response?.data?.data || []);
      if (shouldSetValue) {
        setValues((prev) => ({
          ...prev,
          present_union_id: "",
        }));
      }
    } catch (error) {
      console.error("Failed to fetch unions:", error);
    }
  };

  useEffect(() => {
    if (editData) {
      const {
        present_division: { id: present_division_id } = {},
        present_district: { id: present_district_id } = {},
        present_upazila: { id: present_upazila_id } = {},
      } = editData || {};

      // Fetch districts if division is selected
      if (present_division_id) {
        fetchDistricts(present_division_id, false).then(() => {
          if (present_district_id) {
            fetchUpazilas(present_district_id, false).then(() => {
              if (present_upazila_id) {
                fetchUnions(present_upazila_id, false);
              }
            });
          }
        });
      }
    }
  }, [editData]);

  return (
    <>
    
      <Col xs={24} md={6}>
        <Form.Item
          label="Division"
          validateStatus={
            touched.present_division_id && errors.present_division_id
              ? "error"
              : ""
          }
          help={
            touched.present_division_id && errors.present_division_id
              ? errors.present_division_id
              : ""
          }
        >
          <Select
            showSearch
            value={values.present_division_id || ""}
            onBlur={handleBlur}
            onChange={(value) => {
              fetchDistricts(value);
              setValues((prev) => ({ ...prev, present_division_id: value }));
            }}
            options={divisions?.data.map((value) => ({
              label: value.name,
              value: value.id,
            }))}
            filterOption={(input, option) =>
              option.label.toLowerCase().includes(input.toLowerCase())
            }
          />
        </Form.Item>
      </Col>

      <Col xs={24} md={6}>
        <Form.Item
          label="District"
          validateStatus={
            touched.present_district_id && errors.present_district_id
              ? "error"
              : ""
          }
          help={
            touched.present_district_id && errors.present_district_id
              ? errors.present_district_id
              : ""
          }
        >
          <Select
            showSearch
            value={values.present_district_id || ""}
            onBlur={handleBlur}
            onChange={(value) => {
              fetchUpazilas(value);
              setValues((prev) => ({ ...prev, present_district_id: value }));
            }}
            options={presentDistricts.map((value) => ({
              label: value.name,
              value: value.id,
            }))}
            filterOption={(input, option) =>
              option.label.toLowerCase().includes(input.toLowerCase())
            }
            loading={isLoadingDistricts}
            disabled={isLoadingDistricts}
          />
        </Form.Item>
      </Col>
      <Col xs={24} md={6}>
        <Form.Item
          label="Upazila"
          validateStatus={
            touched.present_upazila_id && errors.present_upazila_id
              ? "error"
              : ""
          }
          help={
            touched.present_upazila_id && errors.present_upazila_id
              ? errors.present_upazila_id
              : ""
          }
        >
          <Select
            showSearch
            value={values.present_upazila_id || ""}
            onBlur={handleBlur}
            onChange={(value) => {
              fetchUnions(value);
              setValues((prev) => ({ ...prev, present_upazila_id: value }));
            }}
            options={presentUpazilas.map((value) => ({
              label: value.name,
              value: value.id,
            }))}
            filterOption={(input, option) =>
              option.label.toLowerCase().includes(input.toLowerCase())
            }
            loading={isLoadingUpazilas}
            disabled={isLoadingUpazilas}
          />
        </Form.Item>
      </Col>
      <Col xs={24} md={6}>
        <Form.Item
          label="Union"
          validateStatus={
            touched.present_union_id && errors.present_union_id
              ? "error"
              : ""
          }
          help={
            touched.present_union_id && errors.present_union_id
              ? errors.present_union_id
              : ""
          }
        >
          <Select
            showSearch
            value={values.present_union_id || ""}
            onBlur={handleBlur}
            onChange={(value) =>
              setValues((prev) => ({ ...prev, present_union_id: value }))
            }
            options={presentUnions.map((value) => ({
              label: value.name,
              value: value.id,
            }))}
            filterOption={(input, option) =>
              option.label.toLowerCase().includes(input.toLowerCase())
            }
            loading={isLoadingUnions}
            disabled={isLoadingUnions}
          />
        </Form.Item>
      </Col>

      <Col xs={24} md={12}>
        <Form.Item
          label="Ward Number"
          validateStatus={
            touched.present_ward && errors.present_ward ? "error" : ""
          }
          help={
            touched.present_ward && errors.present_ward
              ? errors.present_ward
              : ""
          }
      
        >
          <Input
            id="present_ward"
            name="present_ward"
            value={values.present_ward || ""}
            onBlur={handleBlur}
            onChange={handleChange}
          />
        </Form.Item>
      </Col>

      <Col xs={24} md={12}>
        <Form.Item
          label="Village Name"
          validateStatus={
            touched.present_village && errors.present_village ? "error" : ""
          }
          help={
            touched.present_village && errors.present_village
              ? errors.present_village
              : ""
          }
          
        >
          <Input
            id="present_village"
            name="present_village"
            value={values.present_village || ""}
            onBlur={handleBlur}
            onChange={handleChange}
          />
        </Form.Item>
      </Col>

    </>
  );
};

export default PresentAddress;
