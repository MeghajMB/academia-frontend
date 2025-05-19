"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Chip,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
  Pagination,
  Select,
  SelectItem,
} from "@heroui/react";
import usePaymentApi from "@/hooks/api/usePaymentApi";
import { ErrorState } from "@/components/common/ErrorState";

interface TransactionState {
  amount: number;
  date: string;
  id: string;
  purchaseType: "course" | "conversion" | "coins";
  status: "pending" | "success" | "failed";
  type: "debit" | "credit";
}
const PURCHASE_OPTIONS = ["course", "conversion", "coins", "all"];
const TYPE_OPTIONS = ["credit", "debit", "all"];
export const TransactionHistory = () => {
  const [purchaseTypeFilter, setpurchaseTypeFilter] = useState<
    "course" | "conversion" | "coins" | "all"
  >("all");
  const [typeFilter, setTypeFilter] = useState<"credit" | "debit" | "all">(
    "all"
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [transactions, setTransactions] = useState<TransactionState[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const { getTransactionHistoryApi } = usePaymentApi();
  useEffect(() => {
    async function fetchTransactionHistory() {
      try {
        setIsLoading(true);
        setError(false);
        const response = await getTransactionHistoryApi({
          page: currentPage,
          purchaseType: purchaseTypeFilter,
          type: typeFilter,
        });
        if (response.status == "error") {
          throw new Error(response.message);
        }
        setTransactions(response.data.transactions);
        setTotalPages(response.data.pagination.totalPages);
      } catch (error) {
        console.log(error);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    }
    fetchTransactionHistory();
  }, [purchaseTypeFilter,typeFilter,currentPage]);
  if (isLoading) {
    return <Spinner />;
  }
  if (error) {
    return <ErrorState />;
  }
  return (
    <Table
      aria-label="Transaction history table"
      topContent={
        <>
          <div className="flex flex-row items-center justify-between">
            <h3 className="text-lg font-semibold">Transaction History</h3>
            <div className="flex gap-2 w-full justify-end">
              <Select
                className="max-w-48"
                label="Purchase Type"
                placeholder="Select a type"
                selectedKeys={[purchaseTypeFilter]}
                variant="bordered"
                onChange={(e) => setpurchaseTypeFilter(e.target.value)}
              >
                {PURCHASE_OPTIONS.map((purchase) => (
                  <SelectItem key={purchase}>{purchase}</SelectItem>
                ))}
              </Select>
              <Select
                className="max-w-48"
                label="Purchase Type"
                placeholder="Select a type"
                selectedKeys={[typeFilter]}
                variant="bordered"
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                {TYPE_OPTIONS.map((purchase) => (
                  <SelectItem key={purchase}>{purchase}</SelectItem>
                ))}
              </Select>
            </div>
          </div>
        </>
      }
      topContentPlacement="outside"
      bottomContent={
        <div className="py-2 px-2 flex justify-center items-center">
          <Pagination
            isCompact
            showControls
            showShadow
            classNames={{
              cursor: "bg-foreground text-background",
            }}
            color="secondary"
            isDisabled={false}
            page={currentPage}
            total={totalPages}
            variant="light"
            onChange={(page) => setCurrentPage(page)}
          />
        </div>
      }
      bottomContentPlacement="outside"
    >
      <TableHeader>
        <TableColumn>Transaction</TableColumn>
        <TableColumn>Type</TableColumn>
        <TableColumn>Amount</TableColumn>
        <TableColumn>Status</TableColumn>
        <TableColumn className="text-right">Date</TableColumn>
      </TableHeader>
      <TableBody
        loadingContent={<Spinner />}
        loadingState={isLoading ? "loading" : "idle"}
        emptyContent={"No Data To Display."}
      >
        {transactions.map((transaction) => (
          <TableRow key={transaction.id} as={motion.tr} className="group">
            <TableCell>
              <p className="text-sm font-medium">{transaction.id}</p>
            </TableCell>
            <TableCell>
              <Chip
                variant="bordered"
                className={
                  transaction.purchaseType === "course"
                    ? "border-emerald-200 text-emerald-700 dark:border-emerald-800 dark:text-emerald-400"
                    : transaction.purchaseType === "conversion"
                    ? "border-purple-200 text-purple-700 dark:border-purple-800 dark:text-purple-400"
                    : transaction.purchaseType === "coins"
                    ? "border-amber-200 text-amber-700 dark:border-amber-800 dark:text-amber-400"
                    : "border-zinc-200 text-zinc-700 dark:border-zinc-800 dark:text-zinc-400"
                }
              >
                {transaction.type}
              </Chip>
            </TableCell>
            <TableCell>
              <span
                className={`font-medium ${
                  transaction.type == "credit"
                    ? "text-emerald-600 dark:text-emerald-500"
                    : "text-red-600 dark:text-red-500"
                }`}
              >
                {transaction.type == "credit" ? "+" : "-"}
                {transaction.amount}
              </span>
            </TableCell>
            <TableCell>
              <Chip
                color={transaction.status === "success" ? "success" : "warning"}
                variant="flat"
                className={
                  transaction.status === "success"
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                    : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                }
              >
                {transaction.status}
              </Chip>
            </TableCell>
            <TableCell className="text-right">
              {new Date(transaction.date).toLocaleDateString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
