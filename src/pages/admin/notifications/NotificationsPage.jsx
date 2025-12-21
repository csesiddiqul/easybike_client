import React, { useCallback, useEffect, useState } from "react";
import debounce from "lodash/debounce";
import ReusableTable from "../../../components/custom/ReusableTable";
import { useGetAlertMessageQuery } from "../../redux/api/alertMessageApiSlice";
import { enLocalDateTimeFormat } from "../../../utils/main/dateFormat";

const NotificationsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [perPage, setPerPage] = useState(10);

  // handle fetching
  const { data, isLoading, refetch } = useGetAlertMessageQuery({
    page: currentPage,
    searchText: searchValue,
    perPage,
  });


  const totalData = data?.data?.total;
  const lastPage = data?.data?.last_page;

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


  const columns = [
    {
      label: "SI",
      name: "si",
    },
    {
      label: "Message",
      name: "data",
    },
    {
      label: "Date",
      name: "created_at",
    },
  ];

  const TableData = data?.data?.data.map((item, i) => ({
    si: (currentPage - 1) * perPage + i + 1,
    id: item.id,
    data: item?.data,
    created_at: enLocalDateTimeFormat(item?.created_at),
    action: item,
  }));

  return (
    <div className="card-layout">
      <div className="grid grid-cols-2 gap-3 py-2 mb-4">
        <div className="md:col-span-1 col-span-2">
          <h1 className="text-xl font-bold text-gray-600 dark:text-gray-300">
            Notifications
          </h1>
        </div>
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
    </div>
  );
};

export default NotificationsPage;
