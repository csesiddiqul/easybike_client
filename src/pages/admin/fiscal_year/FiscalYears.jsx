import React, { useCallback, useEffect, useState } from "react";
import debounce from "lodash/debounce";
import ReusableTable from "../../../components/custom/ReusableTable";
import {
  useGetFiscalYearsQuery,
  useActivateFiscalYearMutation,
} from "../../redux/api/fiscalYearApiSlice";
import { enLocalDateFormat } from "../../../utils/main/dateFormat";
import { Button, Popconfirm, Tag } from "antd";
import { FiEdit, FiPlusCircle, FiCheckCircle } from "react-icons/fi";
import AddUpdateForm from "./AddUpdateForm";
import toast from "react-hot-toast";
import { useAuthorized } from "../../../hooks/useAuthorized";
import { Utils } from "../../../utils/utils";

const FiscalYear = () => {
  const { hasPermission, somePermission } = useAuthorized();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  /* =====================
     FETCH FISCAL YEARS
  ===================== */
  const { data, isLoading, refetch } = useGetFiscalYearsQuery();

  /* =====================
     ACTIVATE
  ===================== */
  const [
    activateFiscalYear,
    {
      isLoading: activating,
      isSuccess: activateSuccess,
      isError: activateError,
      error: activateErr,
      reset: resetActivate,
    },
  ] = useActivateFiscalYearMutation();

  /* =====================
     SEARCH (Client side)
  ===================== */
  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearchValue(value);
    }, 400),
    []
  );

  useEffect(() => {
    return () => debouncedSearch.cancel();
  }, [debouncedSearch]);

  const handleSearchChange = (value) => {
    setSearchText(value);
    debouncedSearch(value);
  };

  const handleAdd = () => {
    setEditData(null);
    setOpen(true);
  };

  const handleEdit = (data) => {
    setEditData(data);
    setOpen(true);
  };

  /* =====================
     ACTIVATE RESPONSE
  ===================== */
  useEffect(() => {
    if (activateSuccess) {
      toast.success("Fiscal year activated successfully");
      refetch();
      resetActivate();
    }
    if (activateError) {
      toast.error(activateErr?.data?.message || "Activation failed");
      resetActivate();
    }
  }, [activateSuccess, activateError, activateErr, refetch, resetActivate]);

  /* =====================
     TABLE COLUMNS
  ===================== */
  const columns = [
    { label: "SI", name: "si" },
    { label: "Fiscal Year", name: "name" },
    { label: "Start Date", name: "start_date_display" },
    { label: "End Date", name: "end_date_display" },
    {
        label: "Status",
        name: "status",
        render: (value) => {
            const statusMap = {
            true: { text: "Active", bg: "#16a34a" },
            false: { text: "Inactive", bg: "#dc2626" },
            };

            const status = statusMap[value];

            return (
            <Tag
                className="py-1 px-3"
                style={{
                backgroundColor: status.bg,
                color: "#fff",
                border: "none",
                fontWeight: 500,
                }}
            >
                {status.text}
            </Tag>
            );
        },
    }

  ];

  if (
    somePermission([
      Utils.permissions.activate_fiscal_year,
      Utils.permissions.correct_fiscal_year,
    ])
  ) {
    columns.push({
      label: "Action",
      name: "action",
      render: (value, tableMeta) => (
        <div className="flex items-center gap-2">
          {hasPermission([Utils.permissions.correct_fiscal_year]) && (
            <Button onClick={() => handleEdit(tableMeta?.rowData)}>
              <FiEdit />
            </Button>
          )}

          {!tableMeta?.rowData?.is_active &&
            hasPermission([Utils.permissions.activate_fiscal_year]) && (
              <Popconfirm
                title="Activate this fiscal year?"
                onConfirm={() =>
                  activateFiscalYear(tableMeta?.rowData?.id)
                }
                okText="Yes"
                cancelText="No"
              >
                <Button
                  type="primary"
                  loading={activating}
                  icon={<FiCheckCircle />}
                />
              </Popconfirm>
            )}
        </div>
      ),
    });
  }

  /* =====================
     TABLE DATA
  ===================== */
  const TableData = data?.data
    ?.filter((item) =>
      searchValue
        ? item.name.toLowerCase().includes(searchValue.toLowerCase())
        : true
    )
    .map((item, i) => ({
        si: i + 1,
        id: item.id,
        name: item.name,
        start_date: item.start_date,
        end_date: item.end_date,
        start_date_display: enLocalDateFormat(item.start_date),
        end_date_display: enLocalDateFormat(item.end_date),
        is_active: item.is_active,
        status: item.is_active,
    }));

  return (
    <div className="card-layout">
      <div className="flex justify-between headerbg items-center py-2 mb-4">
        <h1 className="text-xl font-bold text-gray-600 dark:text-gray-300">
          Fiscal Years
        </h1>

        {hasPermission([Utils.permissions.create_fiscal_year]) && (
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
        lastPage={1}
        totalData={TableData?.length}
        onSearchChange={handleSearchChange}
        searchText={searchText}
        onPageChange={setCurrentPage}
        perPage={perPage}
        onPerPageChange={setPerPage}
      />

      <AddUpdateForm open={open} onClose={() => setOpen(false)} editData={editData} />
    </div>
  );
};

export default FiscalYear;
