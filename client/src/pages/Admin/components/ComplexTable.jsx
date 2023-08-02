import React, { useState } from "react"
import CardMenu from "../../../components/Card/CardMenu"
import Card from "../../../components/Card/Card"
import Progress from "../../../components/Progress/Progress"
import { MdCancel, MdCheckCircle, MdChevronLeft, MdChevronRight, MdOutlineError } from "react-icons/md"

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable
} from "@tanstack/react-table"

const columnHelper = createColumnHelper()

// const columns = columnsDataCheck;
export default function ComplexTable(props) {
    
  const { tableData } = props
  const [sorting, setSorting] = React.useState([])
  let defaultData = tableData
  const columns = [
    columnHelper.accessor("name", {
      id: "name",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">NAME</p>
      ),
      cell: info => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {info.getValue()}
        </p>
      )
    }),
    columnHelper.accessor("status", {
      id: "status",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          STATUS
        </p>
      ),
      cell: info => (
        <div className="flex items-center">
          {info.getValue() === "Approved" ? (
            <MdCheckCircle className="text-green-500 me-1 dark:text-green-300" />
          ) : info.getValue() === "Disable" ? (
            <MdCancel className="text-red-500 me-1 dark:text-red-300" />
          ) : info.getValue() === "Error" ? (
            <MdOutlineError className="text-amber-500 me-1 dark:text-amber-300" />
          ) : null}
          <p className="text-sm font-bold text-navy-700 dark:text-white">
            {info.getValue()}
          </p>
        </div>
      )
    }),
    columnHelper.accessor("date", {
      id: "date",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">DATE</p>
      ),
      cell: info => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {info.getValue()}
        </p>
      )
    }),
    columnHelper.accessor("progress", {
      id: "progress",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          PROGRESS
        </p>
      ),
      cell: info => (
        <div className="flex items-center">
          <Progress width="w-[108px]" value={info.getValue()} />
        </div>
      )
    })
  ] // eslint-disable-next-line
  const [data, setData] = React.useState(() => [...defaultData])
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true
  })

  const ROWS_PER_PAGE = 5;
    const [currentPage, setCurrentPage] = useState(0);
    const totalPages = Math.ceil(data.length / ROWS_PER_PAGE);
    const startIndex = currentPage * ROWS_PER_PAGE;
    const endIndex = (currentPage + 1) * ROWS_PER_PAGE;
  
  return (
    <Card extra={"w-full h-full px-6 pb-6 sm:overflow-x-auto"}>
      <div className="relative flex items-center justify-between pt-4">
        <div className="text-xl font-bold text-navy-700 dark:text-white">
          Complex Table
        </div>
        <CardMenu />
      </div>

      <div className="mt-8 overflow-x-scroll xl:overflow-x-hidden">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id} className="!border-px !border-gray-400">
                {headerGroup.headers.map(header => {
                  return (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      onClick={header.column.getToggleSortingHandler()}
                      className="cursor-pointer border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start"
                    >
                      <div className="items-center justify-between text-xs text-gray-200">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: "",
                          desc: ""
                        }[header.column.getIsSorted()] ?? null}
                      </div>
                    </th>
                  )
                })}
              </tr>
            ))}
          </thead>
          <tbody>
 {table.getRowModel().rows.slice(startIndex, endIndex).map(row => {
              return (
                <tr key={row.id}>
                  {row.getVisibleCells().map(cell => {
                    return (
                      <td
                        key={cell.id}
                        className="min-w-[150px] border-white/0 py-3 pr-4"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className="flex justify-center mt-4">
        <div className="px-4 py-2 mx-2rounded-md">
          Showing {currentPage + 1} of {totalPages} entires
        </div>
        <div className="flex ml-auto space-x-1">
          <button
            className="px-3 py-2 bg-gray-200 rounded-md dark:text-black dark:bg-gray-800"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 0}
          >
            <MdChevronLeft />
          </button>

          {/* Display the page numbers as buttons */}
        {Array.from({ length: totalPages }, (_, index) => index).map((page) => (
          <button
            key={page}
            className={`px-3 py-2 ${
              currentPage === page ? "!bg-blue-500 text-white" : "bg-gray-200"
            } rounded-md dark:text-black dark:bg-gray-800`}
            onClick={() => setCurrentPage(page)}
          >
            {page + 1}
          </button>
        ))}

          <button
            className="px-3 py-2 bg-gray-200 rounded-md dark:text-black dark:bg-gray-800"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages - 1}
          >
            <MdChevronRight />
          </button>
        </div>
      </div>
    </Card>
  )
}
