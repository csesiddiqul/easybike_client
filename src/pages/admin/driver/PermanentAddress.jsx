import React, { useEffect, useState } from "react";
import { Col, Form, Input, Select, Typography } from "antd";
import {
  useGetDivisionsQuery,
  useLazyGetDistrictsQuery,
  useLazyGetUpazilasQuery,
  useLazyGetUnionsQuery,
} from "../../redux/api/findAddressApiSlice";

const PermanentAddress = ({
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
  setValues,
  editData,
}) => {
  const { data: divisions } = useGetDivisionsQuery();
  const [permanentDistricts, setPermanentDistricts] = useState([]);
  const [permanentUpazilas, setPermanentUpazilas] = useState([]);
  const [permanentUnions, setPermanentUnions] = useState([]);

  const [getDistricts, { isLoading: isLoadingDistricts }] =
    useLazyGetDistrictsQuery();
  const [getUpazilas, { isLoading: isLoadingUpazilas }] =
    useLazyGetUpazilasQuery();
  const [getUnions, { isLoading: isLoadingUnions }] = useLazyGetUnionsQuery();

  // Function to fetch districts
  const fetchDistricts = async (divisionId, shouldSetValue = true) => {
    try {
      const response = await getDistricts(divisionId);
      setPermanentDistricts(response?.data?.data || []);
      setPermanentUpazilas([]); // Clear Upazilas when Districts change
      setPermanentUnions([]); // Clear Unions when Upazilas change
      if (shouldSetValue) {
        setValues((prev) => ({
          ...prev,
          permanent_district_id: "",
          permanent_upazila_id: "",
          permanent_union_id: "",
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
      setPermanentUpazilas(response?.data?.data || []);
      setPermanentUnions([]); // Clear Unions when Upazilas change
      if (shouldSetValue) {
        setValues((prev) => ({
          ...prev,
          permanent_upazila_id: "",
          permanent_union_id: "",
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
      setPermanentUnions(response?.data?.data || []);
      if (shouldSetValue) {
        setValues((prev) => ({
          ...prev,
          permanent_union_id: "",
        }));
      }
    } catch (error) {
      console.error("Failed to fetch unions:", error);
    }
  };

  useEffect(() => {
    if (editData) {
      const {
        permanent_division: { id: permanent_division_id } = {},
        permanent_district: { id: permanent_district_id } = {},
        permanent_upazila: { id: permanent_upazila_id } = {},
      } = editData || {};

      // Fetch districts if division is selected
      if (permanent_division_id) {
        fetchDistricts(permanent_division_id, false).then(() => {
          if (permanent_district_id) {
            fetchUpazilas(permanent_district_id, false).then(() => {
              if (permanent_upazila_id) {
                fetchUnions(permanent_upazila_id, false);
              }
            });
          }
        });
      }
    }
  }, [editData]);


  useEffect(() => {
    if (values.permanent_division_id) {
      fetchDistricts(values.permanent_division_id, false);
    }
  }, [values.permanent_division_id]);

  useEffect(() => {
    if (values.permanent_district_id) {
      fetchUpazilas(values.permanent_district_id, false);
    }
  }, [values.permanent_district_id]);

  useEffect(() => {
    if (values.permanent_upazila_id) {
      fetchUnions(values.permanent_upazila_id, false);
    }
  }, [values.permanent_upazila_id]);


  return (
    <>
      <Col xs={24} md={6}>
        <Form.Item
          label="Division"
          validateStatus={
            touched.permanent_division_id && errors.permanent_division_id
              ? "error"
              : ""
          }
          help={
            touched.permanent_division_id && errors.permanent_division_id
              ? errors.permanent_division_id
              : ""
          }
        >
          <Select
            showSearch
            value={values.permanent_division_id || ""}
            onBlur={handleBlur}
            onChange={(value) => {
              fetchDistricts(value);
              setValues((prev) => ({ ...prev, permanent_division_id: value }));
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
            touched.permanent_district_id && errors.permanent_district_id
              ? "error"
              : ""
          }
          help={
            touched.permanent_district_id && errors.permanent_district_id
              ? errors.permanent_district_id
              : ""
          }
        >
          <Select
            showSearch
            value={values.permanent_district_id || ""}
            onBlur={handleBlur}
            onChange={(value) => {
              fetchUpazilas(value);
              setValues((prev) => ({ ...prev, permanent_district_id: value }));
            }}
            options={permanentDistricts.map((value) => ({
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
            touched.permanent_upazila_id && errors.permanent_upazila_id
              ? "error"
              : ""
          }
          help={
            touched.permanent_upazila_id && errors.permanent_upazila_id
              ? errors.permanent_upazila_id
              : ""
          }
        >
          <Select
            showSearch
            value={values.permanent_upazila_id || ""}
            onBlur={handleBlur}
            onChange={(value) => {
              fetchUnions(value);
              setValues((prev) => ({ ...prev, permanent_upazila_id: value }));
            }}
            options={permanentUpazilas.map((value) => ({
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
            touched.permanent_union_id && errors.permanent_union_id
              ? "error"
              : ""
          }
          help={
            touched.permanent_union_id && errors.permanent_union_id
              ? errors.permanent_union_id
              : ""
          }
        >
          <Select
            showSearch
            value={values.permanent_union_id || ""}
            onBlur={handleBlur}
            onChange={(value) =>
              setValues((prev) => ({ ...prev, permanent_union_id: value }))
            }
            options={permanentUnions.map((value) => ({
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
            touched.permanent_ward && errors.permanent_ward ? "error" : ""
          }
          help={
            touched.permanent_ward && errors.permanent_ward
              ? errors.permanent_ward
              : ""
          }
      
        >
          <Input
            id="permanent_ward"
            name="permanent_ward"
            value={values.permanent_ward || ""}
            onBlur={handleBlur}
            onChange={handleChange}
          />
        </Form.Item>
      </Col>

      <Col xs={24} md={12}>
        <Form.Item
          label="Village Name"
          validateStatus={
            touched.permanent_village && errors.permanent_village ? "error" : ""
          }
          help={
            touched.permanent_village && errors.permanent_village
              ? errors.permanent_village
              : ""
          }
          
        >
          <Input
            id="permanent_village"
            name="permanent_village"
            value={values.permanent_village || ""}
            onBlur={handleBlur}
            onChange={handleChange}
          />
        </Form.Item>
      </Col>
    </>
  );
};

export default PermanentAddress;
