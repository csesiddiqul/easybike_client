import React, { useCallback, useEffect, useState } from "react";
import debounce from "lodash/debounce";
import ReusableTable from "../../../components/custom/ReusableTable";
import {
  useDeletePoliceUnitsMutation,
  useGetPoliceUnitsQuery,
} from "../../redux/api/policeUnitsApiSlice";
import { enLocalDateFormat } from "../../../utils/main/dateFormat";
import { Button, Popconfirm } from "antd";
import { FiEdit, FiPlusCircle, FiTrash2 } from "react-icons/fi";
import AddUpdateForm from "./AddUpdateForm";
import toast from "react-hot-toast";
import { useAuthorized } from "../../../hooks/useAuthorized";
import { Utils } from "../../../utils/utils";

const PoliceUnits = () => {
  const { hasPermission, somePermission } = useAuthorized();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [perPage, setPerPage] = useState(10);
  // for edit
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  // handle delete
  const [
    deleteData,
    {
      isLoading: isLoadingDelete,
      isSuccess: isSuccessDelete,
      data: dataDelete,
      error: errorDelete,
      isError: isErrorDelete,
      reset: resetDelete,
    },
  ] = useDeletePoliceUnitsMutation();

  // handle fetching
  const { data, isLoading, refetch } = useGetPoliceUnitsQuery({
    page: currentPage,
    searchText: searchValue,
    perPage,
  });

  const totalData = data?.data?.meta?.total;
  const lastPage = data?.data?.meta?.last_page;

  const debouncedSearch = useCallback(
    debounce((value) => {
      setCurrentPage(1);
      setSearchValue(value);
      refetch();
    }, 400),
    [refetch]
  );

  useEffect(() => {
    // Cleanup function to cancel the debounce when the component unmounts or debouncedSearch changes
    return () => {
      debouncedSearch?.cancel();
    };
  }, [debouncedSearch]);

  const handleSearchChange = (value) => {
    setSearchText(value);
    debouncedSearch(value);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePerPageChange = (value) => {
    setPerPage(value);
    setCurrentPage(1); // Reset to first page on perPage change
  };

  // Handle add/edit
  const handleClose = () => {
    setEditData(null);
    setOpen(false);
  };

  const handleAdd = () => {
    setEditData(null);
    setOpen(true);
  };

  const handleEdit = (data) => {
    setEditData(data);
    setOpen(true);
  };

  useEffect(() => {
    if (isSuccessDelete) {
      toast.success(dataDelete?.message || "Deleted successfully");
      resetDelete();
    }
    if (isErrorDelete) {
      toast.error(errorDelete?.message || "Failed to delete");
      resetDelete();
    }
  }, [
    isSuccessDelete,
    isErrorDelete,
    dataDelete,
    errorDelete,
    refetch,
    resetDelete,
  ]);

  const columns = [
    {
      label: "SI",
      name: "si",
    },
    {
      label: "Name",
      name: "name",
    },
    {
      label: "Created at",
      name: "created_at",
    },
  ];

  if (
    somePermission([
      Utils.permissions.edit_police_unit,
      Utils.permissions.delete_police_unit,
    ])
  ) {
    columns.push({
      label: "Action",
      name: "action",
      render: (value, tableMeta) => (
        <div className="flex items-center gap-2">
          {hasPermission([Utils.permissions.edit_police_unit]) && (
            <Button onClick={() => handleEdit(tableMeta?.rowData)}>
              <FiEdit />
            </Button>
          )}
          {hasPermission([Utils.permissions.delete_police_unit]) && (
            <Popconfirm
              title="Are you sure you want to delete this data?"
              onConfirm={() => deleteData(tableMeta?.rowData?.id)}
              onCancel={() => toast.error("Delete cancelled")}
              okText="Yes"
              cancelText="No"
              placement="topRight"
            >
              <Button danger loading={isLoadingDelete}>
                <FiTrash2 />
              </Button>
            </Popconfirm>
          )}
        </div>
      ),
    });
  }

  const TableData = data?.data?.data.map((item, i) => ({
    si: (currentPage - 1) * perPage + i + 1,
    id: item.id,
    name: item.name,
    created_at: enLocalDateFormat(item.created_at),
  }));

  return (
    <div className="card-layout">
      <div className="flex justify-between headerbg items-center py-2 mb-4">
        <h1 className="text-xl font-bold text-gray-600 dark:text-gray-300">
          Police Units
        </h1>
        {hasPermission([Utils.permissions.create_police_unit]) && (
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
      <AddUpdateForm open={open} onClose={handleClose} editData={editData} />
    </div>
  );
};

export default PoliceUnits;
