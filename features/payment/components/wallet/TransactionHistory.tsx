"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardBody,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Chip,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/react";

const transactionData = [
  {
    id: "TRX-8294",
    date: "May 8, 2023",
    type: "Course Purchase",
    amount: "+1,200",
    coinType: "redeemable",
    status: "completed",
    description: "Web Development Fundamentals",
  },
  {
    id: "TRX-7651",
    date: "May 6, 2023",
    type: "Redemption",
    amount: "-5,000",
    coinType: "redeemable",
    status: "completed",
    description: "Converted to Gold Coins",
  },
  {
    id: "TRX-7650",
    date: "May 6, 2023",
    type: "Conversion",
    amount: "+500",
    coinType: "gold",
    status: "completed",
    description: "From Redeemable Coins",
  },
  {
    id: "TRX-6542",
    date: "May 3, 2023",
    type: "Withdrawal",
    amount: "-1,000",
    coinType: "gold",
    status: "processing",
    description: "Bank Transfer",
  },
  {
    id: "TRX-6104",
    date: "May 1, 2023",
    type: "Course Purchase",
    amount: "+850",
    coinType: "redeemable",
    status: "completed",
    description: "Data Science Essentials",
  },
  {
    id: "TRX-5872",
    date: "Apr 28, 2023",
    type: "Bonus",
    amount: "+500",
    coinType: "redeemable",
    status: "completed",
    description: "Monthly Instructor Bonus",
  },
  {
    id: "TRX-5218",
    date: "Apr 25, 2023",
    type: "Course Purchase",
    amount: "+1,500",
    coinType: "redeemable",
    status: "completed",
    description: "UX Design Masterclass",
  },
];

export const TransactionHistory = () => {
  const [filter, setFilter] = useState<"all" | "redeemable" | "gold">("all");

  const filteredTransactions =
    filter === "all"
      ? transactionData
      : transactionData.filter((t) => t.coinType === filter);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Transaction History</h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Your recent coin transactions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Dropdown>
            <DropdownTrigger>
              <Button
                variant="bordered"
                size="sm"
                className="flex items-center"
              >
                {filter === "all"
                  ? "All Coins"
                  : filter === "redeemable"
                  ? "Redeemable"
                  : "Gold"}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="ml-2"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Filter options">
              <DropdownItem
                key="header"
                className="text-sm font-medium opacity-70"
                isReadOnly
              >
                Filter by
              </DropdownItem>
              <DropdownItem key="all" onClick={() => setFilter("all")}>
                All Coins
              </DropdownItem>
              <DropdownItem
                key="redeemable"
                onClick={() => setFilter("redeemable")}
              >
                Redeemable Coins
              </DropdownItem>
              <DropdownItem key="gold" onClick={() => setFilter("gold")}>
                Gold Coins
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <Button isIconOnly variant="light" size="sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
          </Button>
        </div>
      </CardHeader>
      <CardBody>
        <div className="rounded-md border">
          <Table aria-label="Transaction history table">
            <TableHeader>
              <TableColumn>Transaction</TableColumn>
              <TableColumn>Type</TableColumn>
              <TableColumn>Amount</TableColumn>
              <TableColumn>Status</TableColumn>
              <TableColumn className="text-right">Date</TableColumn>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction, index) => (
                <TableRow
                  key={transaction.id}
                  as={motion.tr}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="group"
                >
                  <TableCell>
                    <div>
                      <p className="text-sm font-medium">{transaction.id}</p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        {transaction.description}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Chip
                      variant="bordered"
                      className={
                        transaction.type === "Course Purchase"
                          ? "border-emerald-200 text-emerald-700 dark:border-emerald-800 dark:text-emerald-400"
                          : transaction.type === "Redemption"
                          ? "border-purple-200 text-purple-700 dark:border-purple-800 dark:text-purple-400"
                          : transaction.type === "Conversion"
                          ? "border-blue-200 text-blue-700 dark:border-blue-800 dark:text-blue-400"
                          : transaction.type === "Withdrawal"
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
                        transaction.amount.startsWith("+")
                          ? "text-emerald-600 dark:text-emerald-500"
                          : "text-red-600 dark:text-red-500"
                      }`}
                    >
                      {transaction.amount}
                    </span>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400 ml-1">
                      {transaction.coinType === "redeemable" ? "RC" : "GC"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Chip
                      color={
                        transaction.status === "completed"
                          ? "success"
                          : "warning"
                      }
                      variant="flat"
                      className={
                        transaction.status === "completed"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                          : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                      }
                    >
                      {transaction.status}
                    </Chip>
                  </TableCell>
                  <TableCell className="text-right">
                    {transaction.date}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-center mt-4">
          <Button variant="bordered" size="sm">
            View All Transactions
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};
