import { useCallback, useEffect, useState } from "react";
import debounce from "lodash/debounce";
import ReusableTable from "../../../components/custom/ReusableTable.jsx";
import {
  useDeleteVehicleMutation,
  useGetVehicleQuery,
} from "../../redux/api/vehicleApiSlice.js";
import { Badge, Button, Popconfirm } from "antd";
import { FiEdit, FiEye, FiPlusCircle, FiTrash2 } from "react-icons/fi";
import AddUpdateForm from "./AddUpdateForm.jsx";
import ViewVehicle from "./ViewVehicle.jsx";
import VehicleLicence from "./VehicleLicense.jsx";
import toast from "react-hot-toast";
import { useAuthorized } from "../../../hooks/useAuthorized.js";
import { Utils } from "../../../utils/utils.js";
import { MdDocumentScanner } from "react-icons/md";

const Vehicle = () => {
  const { hasPermission, somePermission } = useAuthorized();

  // ================= STATES =================
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [perPage, setPerPage] = useState(10);

  const [open, setOpen] = useState(false);               // Add / Edit
  const [openView, setOpenView] = useState(false);       // View
  const [openLicenseView, setOpenLicenseView] = useState(false); // Licence

  const [editData, setEditData] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  // ================= API =================
  const [
    deleteData,
    {
      isSuccess: isSuccessDelete,
      data: dataDelete,
      error: errorDelete,
      isError: isErrorDelete,
      reset: resetDelete,
    },
  ] = useDeleteVehicleMutation();

  const { data, isLoading, refetch } = useGetVehicleQuery({
    page: currentPage,
    searchText: searchValue,
    perPage,
  });

  const totalData = data?.data?.meta?.total;
  const lastPage = data?.data?.meta?.last_page;

  // ================= SEARCH =================
  const debouncedSearch = useCallback(
    debounce((value) => {
      setCurrentPage(1);
      setSearchValue(value);
      refetch();
    }, 400),
    [refetch]
  );

  useEffect(() => {
    return () => debouncedSearch.cancel();
  }, [debouncedSearch]);

  const handleSearchChange = (value) => {
    setSearchText(value);
    debouncedSearch(value);
  };

  // ================= PAGINATION =================
  const handlePageChange = (page) => setCurrentPage(page);

  const handlePerPageChange = (value) => {
    setPerPage(value);
    setCurrentPage(1);
  };

  // ================= MODAL HANDLERS =================
  const handleAdd = () => {
    setEditData(null);
    setOpen(true);
  };

  const handleEdit = (data) => {
    setEditData(data);
    setOpen(true);
  };

  const handleClose = () => {
    setEditData(null);
    setOpen(false);
  };

  const handleViewClose = () => {
    setEditData(null);
    setOpenView(false);
  };

  const handleLicenceClose = () => {
    setSelectedVehicle(null);
    setOpenLicenseView(false);
  };

  // ================= DELETE FEEDBACK =================
  useEffect(() => {
    if (isSuccessDelete) {
      toast.success(dataDelete?.message || "Deleted successfully");
      resetDelete();
    }
    if (isErrorDelete) {
      toast.error(errorDelete?.data?.message || "Failed to delete");
      resetDelete();
    }
  }, [isSuccessDelete, isErrorDelete]);

  // ================= TABLE COLUMNS =================
  const columns = [
    { label: "SI", name: "si" },
    { label: "Registration No", name: "registration_number" },
    { label: "Vehicle Type", name: "vehicle_type" },
    { label: "Model", name: "vehicle_model_name" },
    { label: "Driver Name", name: "driver_name" },
    { label: "Driver Phone", name: "driver_phone" },
    {
      label: "Status",
      name: "status",
      render: (value) => (
        <Badge
          status={value === "active" ? "success" : "error"}
          text={value === "active" ? "Active" : "Inactive"}
        />
      ),
    }


    
  ];

  if (
    somePermission([
      Utils.permissions.view_vehicle,
      Utils.permissions.edit_vehicle,
      Utils.permissions.delete_vehicle,
    ])
  ) {
    columns.push({
      label: "Action",
      name: "action",
      render: (value) => (
        <div className="flex items-center gap-2">
          {/* VEHICLE LICENCE */}
          <Button
            onClick={() => {
              setSelectedVehicle(value);
              setOpenLicenseView(true);
            }}
          >
            <MdDocumentScanner />
          </Button>

          {/* VIEW */}
          <Button
            onClick={() => {
              setEditData(value);
              setOpenView(true);
            }}
          >
            <FiEye />
          </Button>

          {/* EDIT */}
          <Button onClick={() => handleEdit(value)}>
            <FiEdit />
          </Button>

          {/* DELETE */}
          <Popconfirm
            title="Are you sure you want to delete this vehicle?"
            onConfirm={() => deleteData(value.id)}
          >
            <Button danger>
              <FiTrash2 />
            </Button>
          </Popconfirm>
        </div>
      ),
    });
  }

  // ================= TABLE DATA =================
  const TableData = data?.data?.data?.map((item, i) => ({
    si: (currentPage - 1) * perPage + i + 1,
    registration_number: item.registration_number,
    vehicle_type: item.vehicle_type,
    vehicle_model_name: item.vehicle_model_name,
    driver_name: item.current_driver?.driver?.name,
    driver_phone: item.current_driver?.driver?.phone,
    status: item.status,
    action: item,
  }));

  // ================= RENDER =================
  return (
    <div className="card-layout">
      <div className="flex justify-between headerbg items-center py-2 mb-4">
        <h1 className="text-xl font-bold text-gray-600">Vehicle</h1>
        {hasPermission([Utils.permissions.create_owner]) && (
          <Button type="primary" onClick={handleAdd}>
            <FiPlusCircle /> Create
          </Button>
        )}
      </div>

      <ReusableTable
        columns={columns}
        data={TableData}
        isLoading={isLoading}
        currentPage={currentPage}
        lastPage={lastPage}
        totalData={totalData}
        onSearchChange={handleSearchChange}
        searchText={searchText}
        onPageChange={handlePageChange}
        perPage={perPage}
        onPerPageChange={handlePerPageChange}
      />

      {/* MODALS */}
      <AddUpdateForm open={open} onClose={handleClose} editData={editData} />

      <VehicleLicence
        open={openLicenseView}
        onClose={handleLicenceClose}
        vehicle={selectedVehicle}
      />

      <ViewVehicle
        open={openView}
        onClose={handleViewClose}
        editData={editData}
      />
    </div>
  );
};

export default Vehicle;
