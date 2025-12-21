import React, { useRef } from "react";
import {
  Table,
  Input,
  Pagination,
  Typography,
  Spin,
  Select,
  Button,
} from "antd";
import { CiSearch } from "react-icons/ci";
import { FiPrinter } from "react-icons/fi";
import ReactToPrint from "react-to-print";
import * as XLSX from "xlsx";

const ReusableTable = ({
  columns,
  data,
  isLoading,
  currentPage,
  lastPage,
  totalData,
  onSearchChange,
  searchText,
  onPageChange,
  perPage, // Add perPage prop
  onPerPageChange,
  print = false,
  exportExcel = false,
}) => {
  const printRef = useRef();
  const generatePaginationItems = () => {
    let items = [];
    let startPage, endPage;
    if (lastPage <= 5) {
      startPage = 1;
      endPage = lastPage;
    } else {
      if (currentPage <= 3) {
        startPage = 1;
        endPage = 5;
      } else if (currentPage + 2 >= lastPage) {
        startPage = lastPage - 4;
        endPage = lastPage;
      } else {
        startPage = currentPage - 2;
        endPage = currentPage + 2;
      }
    }

    for (let number = startPage; number <= endPage; number++) {
      items.push(
        <Pagination.Item
          key={number}
          active={number === currentPage}
          onClick={() => onPageChange(number)}
        >
          {number}
        </Pagination.Item>
      );
    }
    return items;
  };

  // Function to export data to Excel
  const handleExportToExcel = () => {
    // Create a new worksheet with the data
    const ws = XLSX.utils.json_to_sheet(
      data.map((row) =>
        columns.reduce((acc, column) => {
          acc[column.label] = row[column.name]; // Map column names to row data
          return acc;
        }, {})
      )
    );

    // Create a new workbook and add the worksheet to it
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    // Generate an Excel file and download it
    XLSX.writeFile(wb, "table_data.xlsx");
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <Select
            defaultValue={perPage}
            onChange={onPerPageChange}
            className="mr-2"
            style={{ width: 120 }}
          >
            <Select.Option value={5}>5</Select.Option>
            <Select.Option value={10}>10</Select.Option>
            <Select.Option value={15}>15</Select.Option>
            <Select.Option value={20}>20</Select.Option>
          </Select>
          {print && (
            <ReactToPrint
              trigger={() => (
                <Button>
                  <FiPrinter />
                </Button>
              )}
              content={() => printRef.current}
            />
          )}
          {exportExcel && (
            <Button onClick={handleExportToExcel}>Export to Excel</Button>
          )}
        </div>
        {onSearchChange && (
          <div className="flex items-center">
            <Input
              prefix={<CiSearch />}
              placeholder="Search…"
              value={searchText}
              onChange={(e) => onSearchChange(e.target.value)}
              className="ml-2"
            />
          </div>
        )}
      </div>
      {isLoading ? (
        <div className="text-center py-5">
          <Spin />
        </div>
      ) : (
        <div className="table-wrap" ref={printRef}>
          {/* <Table
            columns={columns}
            dataSource={data}
            pagination={false}
            rowKey={(record) => record.id} // Assuming each row has a unique `id` field
          /> */}
          <table className="table-main">
            <thead className="table-h">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.name}
                    className={`py-2 table-h ${
                      column?.class ? column.class : ""
                    }`}
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="table-b">
              {data?.length <= 0 ? (
                <tr className="text-center">
                  <td className="table-b" colSpan={columns.length}>
                    No data found
                  </td>
                </tr>
              ) : (
                <>
                  {data?.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {columns.map((column, colIndex) => {
                        const value = row[column.name];
                        if (column.render) {
                          return (
                            <td className="table-b" key={colIndex}>
                              {column.render(value, {
                                rowData: row,
                              })}
                            </td>
                          );
                        }
                        return (
                          <td className="table-b" key={colIndex}>
                            {value}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table>
        </div>
      )}
      {data?.length > 0 && (
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="md:col-span-1 col-span-2 gap-3 mt-3">
            <Typography.Text>Total items: {totalData} </Typography.Text>{" "}
            <Typography.Text>
              {currentPage} of {lastPage} pages
            </Typography.Text>
          </div>
          <div className="md:col-span-1 col-span-2">
            <div className="mx-auto md:float-right">
              <Pagination
                current={currentPage}
                total={totalData} // Update to use totalData
                pageSize={perPage} // Use perPage for items per page
                onChange={onPageChange}
                showSizeChanger={false}
                className="pt-3"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ReusableTable;
