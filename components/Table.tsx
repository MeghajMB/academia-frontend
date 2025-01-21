import React from "react";
import {
  Spinner,
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/react";

interface AdminTableProps<T extends { id: string | number }> {
  bottomContent?: React.ReactNode;
  topContent?: React.ReactNode;
  columns: { key: keyof T | string; label: string }[];
  loadingState: "loading" | "idle";
  items: T[];
  renderCell: (item: T, columnKey: keyof T | string) => React.ReactNode;
  label: string;
  emptyContent: string;
}

export default function AdminTable<T extends { id: string | number }>({
  bottomContent,
  topContent,
  columns,
  loadingState,
  items,
  renderCell,
  label,
  emptyContent,
}: AdminTableProps<T>) {
  return (
    <Table
      removeWrapper
      aria-label={label}
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      topContent={topContent}
      topContentPlacement="outside"
    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn key={String(column.key)}>{column.label}</TableColumn>
        )}
      </TableHeader>

      <TableBody
        emptyContent={emptyContent}
        items={items}
        loadingContent={<Spinner />}
        loadingState={loadingState}
      >
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell>
                {renderCell(item, columnKey as keyof T | string)}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
