export type GetTransactionHistoryApiParams = {
  page: number;
  type: "credit" | "debit" | "all";
  purchaseType: "course" | "conversion" | "coins" | "all";
};
