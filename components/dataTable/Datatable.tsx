/************************************************************
// Component     : Datatable Component (Tailwind Version)
// Purpose       : Common reusable datatable
// Created by    : Tilak
// Created Date  : 1-08-2025
// Description   : Common table rewritten in Tailwind CSS (no Bootstrap)

// Change History:
************************************************************/

"use client";

import React, { JSX, useEffect, useState } from "react";
import { HiOutlineChevronUp, HiOutlineChevronDown } from "react-icons/hi";

interface DataProps<T> {
  data: T[];
  otherData?: any;
  columns: any[];
  checkbox?: boolean;
  isSearchBar?: boolean;
  children: (child: { row: any; column: any; rowIndex: number }) => JSX.Element;
  rowClick?: (data: any) => void;
  onDoubleClick?: (data: T) => void;
  selectData?: any[];
  setSelectData?: (data: any[]) => void;
  isLoader?: boolean;
  tableNm?: React.ReactNode;
  pagination?: boolean;
  tableBtn?: React.ReactNode;
  footerSection?: React.ReactNode;
  height?: number;
  isShowUserDtl?: any;
  tableLeftBtn?: React.ReactNode;
  icon?: React.ReactNode;
  hr?: boolean;
  MoreAction?: React.ReactNode;
}

export const Datatable = <T,>({
  data,
  otherData,
  columns,
  checkbox,
  isSearchBar,
  children,
  rowClick,
  onDoubleClick,
  selectData,
  setSelectData,
  isLoader,
  tableNm,
  pagination,
  icon,
  footerSection,
  height,
  isShowUserDtl,
  hr,
  MoreAction,
}: DataProps<T>) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<string | null>(null);

  useEffect(() => {
    if (tableNm === "Day Wise Details" || tableNm === "Day Wise Summary") {
      setCurrentPage(1);
    }
  }, [data]);

  useEffect(() => {
    if (currentPage > 1) {
      setCurrentPage(1);
    }
  }, [searchTerm]);

  const handleSort = (column: keyof T | any) => {
    if (sortColumn === column) {
      setSortDirection((prevDirection: string | null) =>
        prevDirection === "asc" ? "desc" : "asc"
      );
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

const filterData = (data: T[] | unknown): T[] => {
  // ✅ If data is not an array, return an empty array instead of crashing
  if (!Array.isArray(data)) {
    console.warn("⚠️ Datatable: Expected 'data' to be an array but got:", data);
    return [];
  }

  if (!isSearchBar || !searchTerm.trim()) return data;

  return data.filter((item: T) =>
    Object.values(item).some(
      (value) =>
        value != null &&
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );
};

  const sortedData = sortColumn
    ? filterData(data).sort((a: T, b: T) => {
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];

        if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
        if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
        return 0;
      })
    : filterData(data);

  const totalPages = Math.ceil(sortedData?.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = pagination
    ? sortedData.slice(indexOfFirstItem, indexOfLastItem)
    : sortedData;

  const isSelected = (id: T) => selectData?.indexOf(id) !== -1;

  const handleClick = (_: any, row: T) => {
    const selectedIndex = selectData ? selectData?.indexOf(row) : 0;
    let newSelected: T[] = [];

    if (selectedIndex === -1) {
      newSelected = selectData ? newSelected.concat(selectData, row) : [];
    } else if (selectedIndex === 0) {
      newSelected = selectData ? newSelected.concat(selectData?.slice(1)) : [];
    } else if (selectData && selectedIndex === selectData?.length - 1) {
      newSelected = newSelected.concat(selectData?.slice(0, -1));
    } else if (selectedIndex > 0 && selectData) {
      newSelected = newSelected.concat(
        selectData?.slice(0, selectedIndex),
        selectData.slice(selectedIndex + 1)
      );
    }
    setSelectData && setSelectData(newSelected);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = data.map((n: any) => n);
      setSelectData && setSelectData(newSelected);
      return;
    }
    setSelectData && setSelectData([]);
  };

  return (
    <>
      {/* Header Section */}
      <div className="flex items-center justify-between mt-0 gap-3 pe-3 pt-2 ps-3 text-sm">
        <div className="flex items-center gap-2">
          {icon && (
            <div className="bg-gray-100 text-gray-700 p-1 rounded">
              {icon}
            </div>
          )}
          <div className="text-base font-medium">{tableNm}</div>
        </div>
        <div className="flex items-center gap-3">{MoreAction}</div>
      </div>

      {hr && <hr className="my-2 border-gray-200" />}

      {/* Table Section */}
      <div className="mt-3 pe-3 ps-3">
        <div className={`overflow-x-auto ${height ? `h-[${height}px]` : "h-auto"}`}>
          <table className="min-w-full border-collapse border border-gray-200 text-sm">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
           
                {columns.map((column: any, index: number) => (
                  <th
                    key={index}
                    onClick={() =>
                      column.sorting && handleSort(column.field)
                    }
                    style={{ width: column.width || "auto" }}
                    className={`p-2 font-semibold text-gray-600 cursor-pointer ${
                      column.align === "right"
                        ? "text-right"
                        : column.align === "center"
                        ? "text-center"
                        : "text-left"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      {column.header}
                      {sortColumn === column.field && column.sorting && (
                        <span>
                          {sortDirection === "asc" ? (
                            <HiOutlineChevronDown />
                          ) : (
                            <HiOutlineChevronUp />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-100">
              {!isLoader &&
                currentItems.map((row: any, rowIndex: number) => {
                  const isItemSelected = isSelected(row);
                  return (
                    <React.Fragment key={rowIndex}>
                      <tr
                        className="hover:bg-gray-50 cursor-pointer"
                        onDoubleClick={() =>
                          onDoubleClick && onDoubleClick({ ...row, idx: rowIndex })
                        }
                      >
                       

                        {columns.map((column: any, colIndex: number) => (
                          <td
                            key={colIndex}
                            onClick={() =>
                              rowClick && rowClick({ ...row, idx: rowIndex })
                            }
                            className={`p-2 text-gray-700 ${
                              column.align === "right"
                                ? "text-right"
                                : column.align === "center"
                                ? "text-center"
                                : "text-left"
                            }`}
                          >
                            {children({
                              row,
                              column,
                              rowIndex,
                            })}
                          </td>
                        ))}
                      </tr>

                      {isShowUserDtl && isShowUserDtl[rowIndex] && (
                        <tr>
                          <td
                            colSpan={columns.length}
                            className="bg-blue-50 p-3"
                          >
                            <div className="text-sm text-blue-600 font-semibold">
                              Description
                            </div>
                            <div className="text-gray-600">
                              {otherData?.errorMsg}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}

              {isLoader &&
                Array.from(data).map((_, rowIndex: number) => (
                  <tr key={rowIndex}>
                    {Array(checkbox ? columns.length + 1 : columns.length)
                      .fill("n")
                      .map((_, colIndex: number) => (
                        <td key={colIndex} className="p-2">
                          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                        </td>
                      ))}
                  </tr>
                ))}
            </tbody>

            {footerSection && <tfoot>{footerSection}</tfoot>}
          </table>

          {!isLoader && currentItems.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64">
              <img
                src=""
                alt="no data found"
                className="w-48 mb-2"
              />
              <p className="text-gray-600">No {tableNm} found</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
