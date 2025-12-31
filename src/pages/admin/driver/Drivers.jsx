import React, { useCallback, useEffect, useState } from "react";
import debounce from "lodash/debounce";
import ReusableTable from "../../../components/custom/ReusableTable";
import {
  useGetDriversQuery,
  useDeactivateDriverMutation,
} from "../../redux/api/driverApiSlice";
import { Button, Popconfirm, Tag, Avatar } from "antd";
import { FiEdit, FiPlusCircle, FiTrash2, FiEye } from "react-icons/fi";
import AddUpdateForm from "./AddUpdateForm";
import ViewDriver from "./ViewDriver";
import toast from "react-hot-toast";
import { useAuthorized } from "../../../hooks/useAuthorized";
import { Utils } from "../../../utils/utils";
import dayjs from "dayjs";

const Drivers = () => {
  const { hasPermission } = useAuthorized();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [perPage, setPerPage] = useState(10);

  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const [viewOpen, setViewOpen] = useState(false);
  const [viewData, setViewData] = useState(null);

  /* =====================
     FETCH DRIVERS
  ===================== */
  const { data, isLoading, refetch } = useGetDriversQuery();

  /* =====================
     DEACTIVATE DRIVER
  ===================== */
  const [deactivateDriver] = useDeactivateDriverMutation();

  /* =====================
     SEARCH
  ===================== */
  const debouncedSearch = useCallback(
    debounce((value) => setSearchValue(value), 400),
    []
  );

  useEffect(() => () => debouncedSearch.cancel(), [debouncedSearch]);

  const handleSearchChange = (value) => {
    setSearchText(value);
    debouncedSearch(value);
  };

  const handleAdd = () => {
    setEditData(null);
    setOpen(true);
  };

  const handleEdit = (row) => {
    setEditData(row.raw);
    setOpen(true);
  };

  /* =====================
     TABLE COLUMNS
  ===================== */
  const columns = [
    { label: "SI", name: "si" },

    {
      label: "Photo",
      name: "photo",
      render: (value) => (
        <Avatar src={value} size={60}>
          D
        </Avatar>
      ),
    },

    { label: "Reg No", name: "registration_number" },
    { label: "Name", name: "name" },
    { label: "Phone", name: "phone" },

    { label: "Fiscal Year", name: "fiscal_year" },
    { label: "Expiry Date", name: "expiry_date" },

    {
      label: "Status",
      name: "status",
      render: (value) => {
        const statusMap = {
          pending: { text: "Pending", bg: "#facc15" },
          active: { text: "Active", bg: "#16a34a" },
          expired: { text: "Expired", bg: "#dc2626" },
          suspended: { text: "Suspended", bg: "#ea580c" },
          inactive: { text: "Inactive", bg: "#6b7280" },
        };

        const status = statusMap[value] || statusMap.inactive;

        return (
          <Tag
            style={{
              backgroundColor: status.bg,
              color: "#ffffff",
              border: "none",
              fontWeight: 500,
              textTransform: "capitalize",
            }}
          >
            {status.text}
          </Tag>
        );
      },
    },
  ];

  /* =====================
     ACTION COLUMN
  ===================== */
  columns.push({
    label: "Action",
    name: "action",
    render: (_, tableMeta) => (
      <div className="flex gap-2">
        {/* VIEW */}
        <Button
          onClick={() => {
            setViewData(tableMeta.rowData.raw);
            setViewOpen(true);
          }}
        >
          <FiEye />
        </Button>

        {/* EDIT */}
        {hasPermission([Utils.permissions.edit_driver]) && (
          <Button onClick={() => handleEdit(tableMeta.rowData)}>
            <FiEdit />
          </Button>
        )}

        {/* DEACTIVATE */}
        {hasPermission([Utils.permissions.deactivate_driver]) && (
          <Popconfirm
            title="Deactivate this driver?"
            onConfirm={async () => {
              await deactivateDriver(tableMeta.rowData.id);
              toast.success("Driver deactivated");
              refetch();
            }}
          >
            <Button danger>
              <FiTrash2 />
            </Button>
          </Popconfirm>
        )}
      </div>
    ),
  });

  /* =====================
     TABLE DATA MAPPING
  ===================== */
  const tableData = data?.data
    ?.filter((item) =>
      searchValue
        ? item.user?.name
            ?.toLowerCase()
            .includes(searchValue.toLowerCase())
        : true
    )
    .map((item, i) => ({
      si: i + 1,
      id: item.id,
      photo: item.driver_image,
      registration_number: item.registration_number,
      name: item.user?.name,
      phone: item.user?.phone,

      fiscal_year: item.latest_licence?.fiscal_year || "—",

      expiry_date: item.latest_licence?.end_date
        ? dayjs(item.latest_licence.end_date).format("DD MMM YYYY")
        : "—",

      status: item.computed_status ?? item.status,
      raw: item,
    }));

  return (
    <div className="card-layout">
      {/* HEADER */}
      <div className="flex justify-between headerbg items-center py-2 mb-4">
        <h1 className="text-xl font-bold text-gray-600">Drivers</h1>

        {hasPermission([Utils.permissions.create_driver]) && (
          <Button type="primary" onClick={handleAdd}>
            <FiPlusCircle /> Create
          </Button>
        )}
      </div>

      <ReusableTable
        columns={columns}
        data={tableData}
        isLoading={isLoading}
        currentPage={currentPage}
        lastPage={1}
        totalData={tableData?.length}
        onSearchChange={handleSearchChange}
        searchText={searchText}
        onPageChange={setCurrentPage}
        perPage={perPage}
        onPerPageChange={setPerPage}
      />

      {/* ADD / EDIT MODAL */}
      <AddUpdateForm
        open={open}
        onClose={() => setOpen(false)}
        editData={editData}
      />

      {/* VIEW MODAL */}
      <ViewDriver
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        data={viewData}
      />
    </div>
  );
};

export default Drivers;
